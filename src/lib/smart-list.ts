import type { Product } from "./types";

export type ListMatch = { raw: string; qty: number; product: Product | null };

const SPLIT = /[,\n;]+|\band\b/i;
const LEADING_QTY = /^(\d+)\s*(x|pcs|packs?|bottles?|kg)?\s*(of\s+)?/;

// Turns "2 milk, eggs and bananas" into product matches. Longest keyword wins, so "olive oil" beats "oil".
export function parseShoppingList(text: string, products: Product[]): ListMatch[] {
  return text
    .split(SPLIT)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((raw) => {
      let qty = 1;
      let rest = raw.toLowerCase();
      const m = rest.match(LEADING_QTY);
      if (m && m[0].trim()) {
        qty = Math.min(99, Math.max(1, parseInt(m[1], 10)));
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
