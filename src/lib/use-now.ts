"use client";

import { useSyncExternalStore } from "react";

// The current time, refreshed each minute. Null during server render and hydration so time-based UI
// (slots, "today") never mismatches; components show a skeleton until it arrives.
let now: Date | null = null;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    now = new Date();
    timer = setInterval(() => {
      now = new Date();
      listeners.forEach((l) => l());
    }, 60_000);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, () => now, () => null);
}
