import type { FulfilmentMode } from "./types";

// Slot ids: "express" or "YYYY-MM-DD@H" (local date, start hour).
export const SLOT_HOURS: [number, string][] = [
  [8, "8-10 AM"],
  [10, "10 AM-12 PM"],
  [14, "2-4 PM"],
  [18, "6-8 PM"],
  [20, "8-10 PM"],
];
export const DAYS_AHEAD = 4;

export type Slot = { id: string; label: string; note: string; disabled: boolean; express?: boolean };
export type Day = { index: number; key: string; top: string; date: string };

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function addDays(now: Date, n: number) {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d;
}

export function listDays(now: Date): Day[] {
  return Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const d = addDays(now, i);
    return {
      index: i,
      key: dayKey(d),
      top: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-GB", { weekday: "short" }),
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    };
  });
}

const expressOpen = (now: Date) => now.getHours() >= 7 && now.getHours() < 22;
// Sample capacity rule so the picker shows a booked slot; replace with real capacity data.
const isFull = (dayIndex: number, hour: number) => dayIndex === 1 && hour === 18;

export function listSlots(now: Date, dayIndex: number, mode: FulfilmentMode, feeNote: string): Slot[] {
  const key = dayKey(addDays(now, dayIndex));
  const slots: Slot[] = [];
  if (dayIndex === 0 && mode === "delivery" && expressOpen(now)) {
    slots.push({ id: "express", label: "Express, 45-60 min", note: "AED 10.00", disabled: false, express: true });
  }
  for (const [hour, label] of SLOT_HOURS) {
    const past = dayIndex === 0 && hour <= now.getHours() + 1;
    const full = isFull(dayIndex, hour);
    slots.push({
      id: `${key}@${hour}`,
      label,
      note: past ? "Unavailable" : full ? "Fully booked" : mode === "collect" ? "Free" : feeNote,
      disabled: past || full,
    });
  }
  return slots;
}

export function isSlotBookable(slotId: string, now: Date, mode: FulfilmentMode): boolean {
  if (slotId === "express") return mode === "delivery" && expressOpen(now);
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const match = listSlots(now, i, mode, "").find((s) => s.id === slotId);
    if (match) return !match.disabled;
  }
  return false;
}

export function slotLabel(slotId: string, now: Date): string {
  if (slotId === "express") return "Today, within 45-60 min";
  const [key, hourText] = slotId.split("@");
  const hour = Number(hourText);
  const days = listDays(now);
  const day = days.find((d) => d.key === key);
  const range = SLOT_HOURS.find(([h]) => h === hour)?.[1] ?? "";
  const dayName = day
    ? day.index < 2 ? day.top : new Date(`${key}T00:00`).toLocaleDateString("en-GB", { weekday: "long" })
    : key;
  return `${dayName}, ${range}`;
}
