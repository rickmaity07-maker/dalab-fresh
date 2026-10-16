import "server-only";
import { randomInt } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Order, OrderStatus, TrackingStage } from "./types";

// File-backed order store for local development. Swap for a database before going live.
const FILE = path.join(process.cwd(), "data", "orders.json");
export const SAMPLE_ORDER_ID = "QM-48213";

let writeQueue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Order[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}

export async function saveOrder(order: Omit<Order, "id">): Promise<Order> {
  // Serialise writes so two orders placed at once can't overwrite each other.
  const run = writeQueue.then(async () => {
    const all = await readAll();
    const taken = new Set(all.map((o) => o.id));
    let id: string;
    do id = `QM-${randomInt(10000, 100000)}`;
    while (taken.has(id) || id === SAMPLE_ORDER_ID);
    const saved: Order = { id, ...order };
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify([saved, ...all].slice(0, 500), null, 2));
    return saved;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

// Sample progression: picking after 2 minutes, on the way after 10, delivered after 40.
function stageFor(placedAt: string, now: number): TrackingStage {
  const mins = (now - Date.parse(placedAt)) / 60000;
  return mins >= 40 ? 3 : mins >= 10 ? 2 : mins >= 2 ? 1 : 0;
}

export async function getOrderStatus(id: string): Promise<OrderStatus | null> {
  const key = id.trim().toUpperCase();
  if (key === SAMPLE_ORDER_ID) {
    return { id: key, slotLabel: "Today, 6-8 PM", mode: "delivery", stage: 2, sample: true };
  }
  const order = (await readAll()).find((o) => o.id === key);
  if (!order) return null;
  return { id: order.id, slotLabel: order.slotLabel, mode: order.mode, stage: stageFor(order.placedAt, Date.now()) };
}
