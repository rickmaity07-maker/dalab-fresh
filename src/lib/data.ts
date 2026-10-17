import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CATEGORIES, PRODUCTS, STORES } from "./catalog";
import { db } from "./db";
import type { Category, Product, Store } from "./types";

export type Catalog = { categories: Category[]; products: Product[]; stores: Store[] };

type ProductRow = {
  id: number; name: Product["name"]; size: Product["size"]; price: number; was: number | null;
  category: Product["category"]; icon: Product["icon"]; hue: number; keywords: string[];
  home_favourite: boolean; image: string | null; photo: string | null;
};

// Cached for an hour and tagged, so a price change in the database shows up after
// `revalidateTag("catalog")` (see /api/revalidate) without rebuilding the site.
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const sql = db();
  if (!sql) return { categories: CATEGORIES, products: PRODUCTS, stores: STORES };

  const [categories, rows, stores] = await Promise.all([
    sql`select id, name, icon, photo from categories order by sort, id` as unknown as Promise<(Category & { photo: string | null })[]>,
    sql`select id, name, size, price, was, category, icon, hue, keywords, home_favourite, image, photo
        from products where active order by sort, id` as unknown as Promise<ProductRow[]>,
    sql`select id, name, city, area, hours from stores order by sort, id` as unknown as Promise<Store[]>,
  ]);

  const products = rows.map((r): Product => ({
    id: r.id, name: r.name, size: r.size, price: r.price, category: r.category, icon: r.icon,
    hue: r.hue, keywords: r.keywords,
    ...(r.was ? { was: r.was } : {}),
    ...(r.home_favourite ? { homeFavourite: true } : {}),
    ...(r.image ? { image: r.image } : {}),
    ...(r.photo ? { photo: r.photo } : {}),
  }));
  return { categories: categories.map(({ photo, ...c }) => (photo ? { ...c, photo } : c)), products, stores };
}
