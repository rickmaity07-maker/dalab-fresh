import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/data";

// Read-only catalogue endpoint for other clients (a mobile app, a POS sync). The web page reads the catalogue directly on the server.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category");
  const q = searchParams.get("q")?.trim().toLowerCase().slice(0, 80);
  const { categories, products } = await getCatalog();
  const matches = products.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!q || Object.values(p.name).some((n) => n.toLowerCase().includes(q)) || p.keywords.some((k) => k.includes(q))),
  );
  return NextResponse.json({ categories, products: matches });
}
