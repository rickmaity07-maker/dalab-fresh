import type { Product } from "./types";

export type ListMatch = { raw: string; qty: number; product: Product | null };

// "and" / "und" / "iyo" join items in English, German and Somali.
const SPLIT = /[,\n;]+|\b(?:and|und|iyo)\b/i;
const LEADING_QTY = /^(\d+)\s*(x|stk\.?|stück|pcs|packs?|kg|xabbo)?\s*(of\s+)?/;

// Turns "2 canjeero, xawaash und Tee" into product matches. Longest keyword wins, so "caano geel" beats "caano".
export function parseShoppingList(text: string, products: Product[]): ListMatch[] {
  return text
    .split(SPLIT)
    .map((s) => s?.trim())
    .filter(Boolean)
    .map((raw) => {
      let qty = 1;
      let rest = raw.toLowerCase();
      const m = rest.match(LEADING_QTY);
      if (m && m[0].trim()) {
        // "5 kg rice" means one 5 kg bag, not five of them.
        qty = m[2] === "kg" ? 1 : Math.min(99, Math.max(1, parseInt(m[1], 10)));
        rest = rest.slice(m[0].length);
      }
      let best: Product | null = null;
      let bestLen = 0;
      for (const p of products) {
        for (const k of p.keywords) {
          const hit = rest.includes(k) || (k.length > 3 && rest.length > 2 && k.includes(rest));
          if (hit && k.length > bestLen) {
            best = p;
            bestLen = k.length;
          }
        }
      }
      return { raw, qty, product: best };
    });
}
