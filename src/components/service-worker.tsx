"use client";

import { useEffect } from "react";

// Registers /sw.js in production so the installed app starts offline. Skipped in development,
// where a cached page would hide code changes.
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);
  return null;
}
