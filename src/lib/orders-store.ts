import "server-only";
import { randomInt } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "./db";
import type { Order, OrderStatus, TrackingStage } from "./types";

// Orders live in Neon. Without DATABASE_URL they go to data/orders.json so local development still works.
const FILE = path.join(process.cwd(), "data", "orders.json");
export const SAMPLE_ORDER_ID = "DF-48213";

const newId = () => `DF-${randomInt(10000, 100000)}`;

let writeQueue: Promise<unknown> = Promise.resolve();

async function readFileOrders(): Promise<Order[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}

// Serialise file writes so two requests at once can't overwrite each other.
function updateFile<T>(change: (all: Order[]) => { next: Order[]; result: T }): Promise<T> {
  const run = writeQueue.then(async () => {
    const { next, result } = change(await readFileOrders());
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(next.slice(0, 500), null, 2));
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export async function saveOrder(order: Omit<Order, "id">): Promise<Order> {
  const sql = db();
  if (sql) {
    // Retry on the rare id collision instead of reading every id first.
    for (let attempt = 0; attempt < 5; attempt++) {
      const id = newId();
      if (id === SAMPLE_ORDER_ID) continue;
      const rows = await sql`
        insert into orders (id, placed_at, mode, slot_id, store_id, customer_name, email, phone, address, payment, lang, items, quote)
        values (${id}, ${order.placedAt}, ${order.mode}, ${order.slotId}, ${order.storeId}, ${order.name}, ${order.email},
                ${order.phone ?? null}, ${order.address ?? null}, ${order.payment}, ${order.lang},
                ${JSON.stringify(order.items)}::jsonb, ${JSON.stringify(order.quote)}::jsonb)
        on conflict (id) do nothing
        returning id`;
      if (rows.length) return { id, stage: 0, ...order };
    }
    throw new Error("Could not allocate an order id");
  }

  return updateFile((all) => {
    const taken = new Set(all.map((o) => o.id));
    let id: string;
    do id = newId();
    while (taken.has(id) || id === SAMPLE_ORDER_ID);
    const saved: Order = { id, stage: 0, ...order };
    return { next: [saved, ...all], result: saved };
  });
}

export async function getOrderStatus(id: string): Promise<OrderStatus | null> {
  const key = id.trim().toUpperCase();
  if (key === SAMPLE_ORDER_ID) return { id: key, slotId: "sample", mode: "delivery", stage: 2, sample: true };

  const sql = db();
  if (sql) {
    const rows = (await sql`select id, mode, slot_id, stage from orders where id = ${key}`) as {
      id: string; mode: Order["mode"]; slot_id: string; stage: TrackingStage;
    }[];
    const row = rows[0];
    return row ? { id: row.id, slotId: row.slot_id, mode: row.mode, stage: row.stage } : null;
  }

  const order = (await readFileOrders()).find((o) => o.id === key);
  return order ? { id: order.id, slotId: order.slotId, mode: order.mode, stage: order.stage ?? 0 } : null;
}

// ---- Staff ----

export type OrderView = "open" | "done" | "all";

type OrderRow = {
  id: string; placed_at: string | Date; mode: Order["mode"]; slot_id: string; store_id: string; customer_name: string;
  email: string; phone: string | null; address: string | null; payment: Order["payment"]; lang: Order["lang"];
  items: Order["items"]; quote: Order["quote"]; stage: TrackingStage;
};

const fromRow = (r: OrderRow): Order => ({
  id: r.id, placedAt: new Date(r.placed_at).toISOString(), mode: r.mode, slotId: r.slot_id, storeId: r.store_id,
  name: r.customer_name, email: r.email, phone: r.phone ?? undefined, address: r.address ?? undefined,
  payment: r.payment, lang: r.lang, items: r.items, quote: r.quote, stage: r.stage,
});

/** Orders for the staff page, newest first. "open" = not yet delivered or collected. */
export async function listOrders(view: OrderView, limit = 200): Promise<Order[]> {
  const sql = db();
  if (sql) {
    const rows = (view === "open"
      ? await sql`select * from orders where stage < 3 order by placed_at desc limit ${limit}`
      : view === "done"
        ? await sql`select * from orders where stage = 3 order by placed_at desc limit ${limit}`
        : await sql`select * from orders order by placed_at desc limit ${limit}`) as OrderRow[];
    return rows.map(fromRow);
  }
  const all = await readFileOrders();
  return all
    .filter((o) => view === "all" || (view === "done" ? (o.stage ?? 0) === 3 : (o.stage ?? 0) < 3))
    .slice(0, limit);
}

/** Counts for the staff page tabs. */
export async function countOrders(): Promise<{ open: number; done: number }> {
  const sql = db();
  if (sql) {
    const [row] = (await sql`select count(*) filter (where stage < 3)::int as open, count(*) filter (where stage = 3)::int as done from orders`) as { open: number; done: number }[];
    return row;
  }
  const all = await readFileOrders();
  const done = all.filter((o) => o.stage === 3).length;
  return { open: all.length - done, done };
}

export async function setOrderStage(id: string, stage: TrackingStage): Promise<boolean> {
  const sql = db();
  if (sql) {
    const rows = await sql`update orders set stage = ${stage}, stage_at = now() where id = ${id} returning id`;
    return rows.length > 0;
  }
  return updateFile((all) => {
    const found = all.some((o) => o.id === id);
    return { next: all.map((o) => (o.id === id ? { ...o, stage } : o)), result: found };
  });
}
