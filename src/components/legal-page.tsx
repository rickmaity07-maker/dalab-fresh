import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import { Wordmark } from "./brand-mark";

export const LEGAL_LINKS = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB & Widerruf" },
] as const;

// Shared frame for the legal pages: quiet header, readable column, links between the pages.
// Legal texts are in German, the binding language for a German shop.
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="gutter mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4">
          <Link href="/" aria-label="Dalab Fresh Startseite" className="text-ink no-underline">
            <Wordmark />
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-[12px] border border-line px-3.5 text-sm font-semibold transition-colors hover:border-ink">
            <ArrowLeftIcon size={16} weight="bold" /> Zurück zum Shop
          </Link>
        </div>
      </header>
      <main id="main" className="gutter mx-auto max-w-[760px] py-10 sm:py-14">
        <h1 className="text-[clamp(28px,4vw,38px)] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance">{title}</h1>
        <p className="mt-2 text-sm text-muted">Stand: {BUSINESS.legalUpdated}</p>
        <div className="legal mt-8">{children}</div>
      </main>
      <footer className="border-t border-line bg-surface">
        <nav aria-label="Rechtliches" className="gutter mx-auto flex max-w-[760px] flex-wrap gap-x-6 gap-y-2 py-6 text-sm">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted underline-offset-2 hover:text-ink hover:underline">{l.label}</Link>
          ))}
          <span className="ml-auto text-muted">© 2026 {BUSINESS.legalName}</span>
        </nav>
      </footer>
    </>
  );
}
