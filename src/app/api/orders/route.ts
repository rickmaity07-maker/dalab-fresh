import { NextResponse, after } from "next/server";
import { getCatalog } from "@/lib/data";
import { DICTS, isLang } from "@/lib/i18n";
import { sendOrderEmails } from "@/lib/mailer";
import { saveOrder } from "@/lib/orders-store";
import { quote } from "@/lib/pricing";
import { allow, clientIp } from "@/lib/rate-limit";
import { isSlotBookable } from "@/lib/slots";
import type { OrderRequest, Product } from "@/lib/types";

type ErrorField = keyof (typeof DICTS)["en"]["errors"];
// The client shows its own translated text for `field`; `message` is for other API consumers.
const fail = (field: ErrorField, status = 400) => NextResponse.json({ field, message: DICTS.en.errors[field] }, { status });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Control characters (line breaks, tabs, NUL) have no place in a name or address and could break email layout.
const CONTROL = /[\u0000-\u001f\u007f]+/g;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(CONTROL, " ").trim().slice(0, max) : "");
const MAX_BODY = 32_000; // bytes; a full basket is a few kB
const MAX_LINES = 80;

export async function POST(req: Request) {
  let body: Partial<OrderRequest> & { website?: unknown };
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return fail("form", 413);
    body = JSON.parse(raw);
  } catch {
    return fail("form");
  }
  if (!body || typeof body !== "object") return fail("form");

  // Hidden "website" field: people never see it, form-filling bots do. Pretend success without saving or emailing.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ id: "DF-00000", slotId: String(body.slotId ?? ""), mode: "delivery", points: 0, total: 0, email: "" }, { status: 201 });
  }

  const { products, stores } = await getCatalog();
  const byId = new Map(products.map((p) => [p.id, p]));

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length > MAX_LINES) return fail("items");
  const lines: { product: Product; qty: number }[] = [];
  for (const item of items) {
    const product = byId.get(Number(item?.id));
    const qty = Number(item?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 99) return fail("items");
    lines.push({ product, qty });
  }
  if (!lines.length) return fail("emptyBasket");

  const mode = body.mode === "collect" ? "collect" : body.mode === "delivery" ? "delivery" : null;
  if (!mode) return fail("mode");
  const store = stores.find((s) => s.id === body.storeId);
  if (!store) return fail("store");

  const name = clean(body.name, 120);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 40);
  const address = clean(body.address, 300);
  if (name.length < 2) return fail("name");
  if (!EMAIL.test(email)) return fail("email");
  if (mode === "delivery" && address.length < 8) return fail("address");

  // Every order sends an email, so cap orders per connection and per address to stop spam and fake orders.
  const [ipOk, mailOk] = await Promise.all([allow("order", clientIp(req), 5, 600), allow("order-mail", email, 5, 3600)]);
  if (!ipOk || !mailOk) return fail("tooMany", 429);

  const now = new Date();
  const slotId = String(body.slotId ?? "");
  if (!isSlotBookable(slotId, now, mode)) return fail("slotGone");

  const lang = isLang(body.lang) ? body.lang : "de";
  // Prices come from the catalogue, never from the browser.
  const q = quote(lines, mode, slotId);

  let order;
  try {
    order = await saveOrder({
      placedAt: now.toISOString(),
      mode,
      slotId,
      storeId: store.id,
      name,
      email,
      phone: phone || undefined,
      address: mode === "delivery" ? address : undefined,
      payment: body.payment === "cash" ? "cash" : "card",
      lang,
      items: lines.map(({ product, qty }) => ({ id: product.id, qty, name: product.name[lang], price: product.price })),
      quote: q,
    });
  } catch (err) {
    console.error("[orders] Could not save order:", err);
    return fail("form", 500);
  }

  // Email after the response, so a slow mail server never delays checkout.
  after(() => sendOrderEmails(order, store, now));

  return NextResponse.json({ id: order.id, slotId, mode, points: q.points, total: q.total, email }, { status: 201 });
}
