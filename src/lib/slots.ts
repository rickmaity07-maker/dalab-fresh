import type { FulfilmentMode } from "./types";

// Slot ids: "express" or "YYYY-MM-DD@H" (Berlin date, start hour). Everything runs on Berlin time,
// so a server in another timezone and a shopper's phone agree on what "today" and "past" mean.
export const TIME_ZONE = "Europe/Berlin";
const SLOT_HOURS: [start: number, end: number][] = [
  [8, 10],
  [10, 12],
  [14, 16],
  [17, 19],
  [19, 21],
];
const DAYS_AHEAD = 5;

export type SlotStatus = "open" | "past" | "full" | "closed";
export type Slot = { id: string; start: number; end: number; status: SlotStatus; express?: boolean };
/** `utc` is midnight UTC of the Berlin calendar date, for formatting with timeZone: "UTC". */
export type Day = { index: number; key: string; utc: Date; sunday: boolean };

const pad = (n: number) => String(n).padStart(2, "0");
export const hourRange = (start: number, end: number) => `${pad(start)}:00-${pad(end)}:00`;

const partsFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
});

function berlin(now: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(now).map((x) => [x.type, x.value]));
  return { y: Number(p.year), m: Number(p.month), d: Number(p.day), hour: Number(p.hour) };
}

export function listDays(now: Date): Day[] {
  const { y, m, d } = berlin(now);
  return Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const utc = new Date(Date.UTC(y, m - 1, d + i));
    return {
      index: i,
      key: `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`,
      utc,
      sunday: utc.getUTCDay() === 0,
    };
  });
}

const expressOpen = (now: Date) => {
  const h = berlin(now).hour;
  return h >= 8 && h < 20;
};
// Sample capacity rule so the picker shows a booked slot; replace with real capacity data.
const isFull = (dayIndex: number, hour: number) => dayIndex === 1 && hour === 17;

export function listSlots(now: Date, dayIndex: number, mode: FulfilmentMode): Slot[] {
  const day = listDays(now)[dayIndex];
  const slots: Slot[] = [];
  if (dayIndex === 0 && !day.sunday && mode === "delivery" && expressOpen(now)) {
    slots.push({ id: "express", start: 0, end: 0, status: "open", express: true });
  }
  const hourNow = berlin(now).hour;
  for (const [start, end] of SLOT_HOURS) {
    const status: SlotStatus = day.sunday
      ? "closed"
      : dayIndex === 0 && start <= hourNow + 1 ? "past"
      : isFull(dayIndex, start) ? "full"
      : "open";
    slots.push({ id: `${day.key}@${start}`, start, end, status });
  }
  return slots;
}

export function isSlotBookable(slotId: string, now: Date, mode: FulfilmentMode): boolean {
  if (slotId === "express") return mode === "delivery" && !listDays(now)[0].sunday && expressOpen(now);
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const match = listSlots(now, i, mode).find((s) => s.id === slotId);
    if (match) return match.status === "open";
  }
  return false;
}

/** Splits a slot id into the pieces needed to describe it. */
export function parseSlot(slotId: string, now: Date) {
  if (slotId === "express") return { express: true as const };
  const [key, hourText] = slotId.split("@");
  const start = Number(hourText);
  const end = SLOT_HOURS.find(([h]) => h === start)?.[1] ?? start + 2;
  const [y, m, d] = key.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  const dayIndex = listDays(now).findIndex((x) => x.key === key);
  return { express: false as const, utc, dayIndex, range: hourRange(start, end) };
}
