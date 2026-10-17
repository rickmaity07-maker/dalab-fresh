// Uploads product photos to Cloudinary and links them to products in Neon.
// Put photos in ./product-photos named by product id: 14.jpg, 18.webp, ...
// Usage: npm run images:upload   (reads CLOUDINARY_URL or CLOUDINARY_* and DATABASE_URL from .env.local)
import { readdir } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { v2 as cloudinary } from "cloudinary";

const { DATABASE_URL, CLOUDINARY_URL, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set.");
if (!CLOUDINARY_URL) {
  if (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Set CLOUDINARY_URL, or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.");
  }
  cloudinary.config({ cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET });
}

const sql = neon(DATABASE_URL);
const dir = path.resolve("product-photos");
const files = (await readdir(dir).catch(() => [])).filter((f) => /^\d+\.(jpe?g|png|webp|avif)$/i.test(f));
if (!files.length) {
  console.log(`No photos found. Add files like ${path.join(dir, "14.jpg")} and run again.`);
  process.exit(0);
}

for (const file of files) {
  const id = Number.parseInt(file, 10);
  const res = await cloudinary.uploader.upload(path.join(dir, file), {
    folder: "dalab/products",
    public_id: String(id),
    overwrite: true,
    resource_type: "image",
  });
  const updated = await sql`update products set image = ${res.public_id} where id = ${id} returning id`;
  console.log(updated.length ? `#${id} -> ${res.public_id}` : `#${id} uploaded, but no product has that id`);
}
console.log("Done. Call /api/revalidate (or restart the dev server) to show the new images.");
