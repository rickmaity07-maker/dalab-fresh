import type { FulfilmentMode, Product, Quote } from "./types";

export const FREE_DELIVERY_OVER = 10000;
export const DELIVERY_FEE = 700;
export const EXPRESS_FEE = 1000;

export const formatAed = (fils: number) => `AED ${(fils / 100).toFixed(2)}`;

// Shared by the basket UI and the order API, so the browser and server always agree on the total.
export function quote(
  lines: { product: Product; qty: number }[],
  mode: FulfilmentMode,
  slotId: string | null,
): Quote {
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
  return { subtotal, savings, fee, total: subtotal + fee, points: Math.floor(subtotal / 100), itemCount };
}
