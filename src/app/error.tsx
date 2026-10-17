"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Wordmark } from "@/components/brand-mark";

// Catches unexpected errors below the root layout and offers a retry instead of a blank page.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="gutter mx-auto grid min-h-dvh max-w-[560px] content-center justify-items-start gap-5 py-16">
      <Link href="/" aria-label="Dalab Fresh Startseite" className="text-ink no-underline"><Wordmark /></Link>
      <div className="space-y-2">
        <h1 className="text-[clamp(24px,4vw,32px)] leading-tight font-extrabold">Die Seite konnte nicht geladen werden</h1>
        <p className="text-muted">Prüf deine Internetverbindung und versuch es noch einmal. Dein Warenkorb bleibt gespeichert.</p>
        <p className="text-sm text-muted" lang="en">The page couldn&apos;t load. Check your connection and try again; your basket is saved.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-[12px] bg-ink px-6 font-semibold text-bg transition-transform active:scale-[0.98]">
          Neu laden
        </button>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-[12px] border border-line px-6 font-semibold transition-colors hover:border-ink">Zum Shop</Link>
      </div>
    </main>
  );
}
