// Creates the tables in Neon and loads the seed catalogue. Safe to re-run: existing rows are updated.
// Usage: npm run db:setup   (reads DATABASE_URL from .env.local)
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { CATEGORIES, PRODUCTS, STORES } from "../src/lib/catalog.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local (Neon console > Connect) and run again.");
  process.exit(1);
}
const sql = neon(url);

const schema = await readFile(new URL("../src/lib/schema.sql", import.meta.url), "utf8");
// Strip comments, then run one statement at a time (the HTTP driver takes a single statement per query).
for (const stmt of schema.replace(/--.*$/gm, "").split(";").map((s) => s.trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("Schema ready.");

await sql.transaction([
  ...CATEGORIES.map((c, i) => sql`
    insert into categories (id, name, icon, photo, sort) values (${c.id}, ${JSON.stringify(c.name)}::jsonb, ${c.icon}, ${c.photo ?? null}, ${i})
    on conflict (id) do update set name = excluded.name, icon = excluded.icon, photo = excluded.photo, sort = excluded.sort`),
  ...STORES.map((s, i) => sql`
    insert into stores (id, name, city, area, hours, sort) values (${s.id}, ${s.name}, ${s.city}, ${s.area}, ${JSON.stringify(s.hours)}::jsonb, ${i})
    on conflict (id) do update set name = excluded.name, city = excluded.city, area = excluded.area, hours = excluded.hours, sort = excluded.sort`),
  // Images are left alone on update so uploads from scripts/upload-images.mjs survive a re-seed.
  ...PRODUCTS.map((p, i) => sql`
    insert into products (id, name, size, price, was, category, icon, hue, keywords, home_favourite, photo, sort)
    values (${p.id}, ${JSON.stringify(p.name)}::jsonb, ${JSON.stringify(p.size)}::jsonb, ${p.price}, ${p.was ?? null}, ${p.category},
            ${p.icon}, ${p.hue}, ${p.keywords}, ${Boolean(p.homeFavourite)}, ${p.photo ?? null}, ${i})
    on conflict (id) do update set name = excluded.name, size = excluded.size, price = excluded.price, was = excluded.was,
      category = excluded.category, icon = excluded.icon, hue = excluded.hue, keywords = excluded.keywords,
      home_favourite = excluded.home_favourite, photo = excluded.photo, sort = excluded.sort`),
]);

console.log(`Seeded ${CATEGORIES.length} categories, ${STORES.length} stores and ${PRODUCTS.length} products.`);
