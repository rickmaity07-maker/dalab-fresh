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
      if (rows.length) return { id, ...order };
    }
    throw new Error("Could not allocate an order id");
  }

  // Serialise file writes so two orders placed at once can't overwrite each other.
  const run = writeQueue.then(async () => {
    const all = await readFileOrders();
    const taken = new Set(all.map((o) => o.id));
    let id: string;
    do id = newId();
    while (taken.has(id) || id === SAMPLE_ORDER_ID);
    const saved: Order = { id, ...order };
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify([saved, ...all].slice(0, 500), null, 2));
    return saved;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

// Sample progression until a staff dashboard sets real stages: picking after 2 min, on the way after 10, done after 40.
function stageFor(placedAt: string, now: number): TrackingStage {
  const mins = (now - Date.parse(placedAt)) / 60000;
  return mins >= 40 ? 3 : mins >= 10 ? 2 : mins >= 2 ? 1 : 0;
}

export async function getOrderStatus(id: string): Promise<OrderStatus | null> {
  const key = id.trim().toUpperCase();
  if (key === SAMPLE_ORDER_ID) return { id: key, slotId: "sample", mode: "delivery", stage: 2, sample: true };

  const sql = db();
  if (sql) {
    const rows = (await sql`select id, placed_at, mode, slot_id from orders where id = ${key}`) as {
      id: string; placed_at: string | Date; mode: Order["mode"]; slot_id: string;
    }[];
    const row = rows[0];
    if (!row) return null;
    return { id: row.id, slotId: row.slot_id, mode: row.mode, stage: stageFor(new Date(row.placed_at).toISOString(), Date.now()) };
  }

  const order = (await readFileOrders()).find((o) => o.id === key);
  if (!order) return null;
  return { id: order.id, slotId: order.slotId, mode: order.mode, stage: stageFor(order.placedAt, Date.now()) };
}
