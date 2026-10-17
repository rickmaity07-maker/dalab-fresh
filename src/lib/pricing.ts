import type { FulfilmentMode, Lang, Product, Quote } from "./types";

export const FREE_DELIVERY_OVER = 4000; // €40
export const DELIVERY_FEE = 399;
export const EXPRESS_FEE = 599;
/** 1 point per euro; 500 points = €5 off. */
export const POINTS_PER_EURO = 1;

export const LOCALES: Record<Lang, string> = { de: "de-DE", en: "en-IE", so: "so-SO" };

const money = new Map<Lang, Intl.NumberFormat>();
export function formatEur(cents: number, lang: Lang = "de") {
  let f = money.get(lang);
  if (!f) money.set(lang, (f = new Intl.NumberFormat(LOCALES[lang], { style: "currency", currency: "EUR" })));
  return f.format(cents / 100);
}

export const formatNumber = (n: number, lang: Lang = "de") => n.toLocaleString(LOCALES[lang]);

/**
 * Price per kg or per litre (German law, PAngV, requires it next to the price for weighed and liquid goods).
 * Reads the German size label ("500 g", "1 kg", "1,5 L", "6 x 1,5 L"); returns null for pieces and bunches.
 */
export function unitPrice(price: number, sizeDe: string): { cents: number; unit: "kg" | "L" } | null {
  const m = sizeDe.match(/^(?:(\d+)\s*x\s*)?(\d+(?:,\d+)?)\s*(kg|g|L|ml)$/i);
  if (!m) return null;
  const count = m[1] ? Number(m[1]) : 1;
  const amount = Number(m[2].replace(",", ".")) * count;
  const unit = m[3].toLowerCase();
  const base = unit === "kg" || unit === "l" ? amount : amount / 1000;
  if (!base || (base === 1 && !m[1])) return null; // exactly 1 kg / 1 L: the price already is the unit price
  return { cents: Math.round(price / base), unit: unit === "kg" || unit === "g" ? "kg" : "L" };
}

// Shared by the basket UI and the order API, so the browser and server always agree on the total.
export function quote(lines: { product: Product; qty: number }[], mode: FulfilmentMode, slotId: string | null): Quote {
  let subtotal = 0;
  let savings = 0;
  let itemCount = 0;
  for (const { product, qty } of lines) {
    subtotal += product.price * qty;
    if (product.was) savings += (product.was - product.price) * qty;
    itemCount += qty;
  }
  let fee = 0;
  if (mode === "delivery" && itemCount > 0) {
    fee = slotId === "express" ? EXPRESS_FEE : subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  }
  return { subtotal, savings, fee, total: subtotal + fee, points: Math.floor(subtotal / 100) * POINTS_PER_EURO, itemCount };
}
