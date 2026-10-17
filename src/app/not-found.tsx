import Link from "next/link";
import { Wordmark } from "@/components/brand-mark";

// Shown for unknown addresses. German first (the shop's default), with English and Somali lines.
export default function NotFound() {
  return (
    <main id="main" className="gutter mx-auto grid min-h-dvh max-w-[560px] content-center justify-items-start gap-5 py-16">
      <Link href="/" aria-label="Dalab Fresh Startseite" className="text-ink no-underline"><Wordmark /></Link>
      <p className="text-[64px] leading-none font-extrabold tracking-[-0.04em] text-gold-text tabular-nums">404</p>
      <div className="space-y-2">
        <h1 className="text-[clamp(24px,4vw,32px)] leading-tight font-extrabold">Diese Seite gibt es nicht</h1>
        <p className="text-muted">Der Link ist vielleicht veraltet. Im Shop findest du alle Produkte und Angebote.</p>
        <p className="text-sm text-muted" lang="en">This page doesn&apos;t exist. Head back to the shop.</p>
        <p className="text-sm text-muted" lang="so">Boggan ma jiro. Ku noqo dukaanka.</p>
      </div>
      <Link href="/" className="inline-flex min-h-12 items-center rounded-[12px] bg-ink px-6 font-semibold text-bg transition-transform active:scale-[0.98]">
        Zum Shop
      </Link>
    </main>
  );
}
