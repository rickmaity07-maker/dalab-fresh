import { EnvelopeSimpleIcon, MapPinIcon, PhoneIcon, StorefrontIcon, TruckIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { LoginForm } from "@/components/admin/login-form";
import { Wordmark } from "@/components/brand-mark";
import { button } from "@/components/ui";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { getCatalog } from "@/lib/data";
import { DICTS, describeSlot } from "@/lib/i18n";
import { countOrders, listOrders, type OrderView } from "@/lib/orders-store";
import { formatEur } from "@/lib/pricing";
import { TIME_ZONE } from "@/lib/slots";
import type { Order, Store } from "@/lib/types";
import { logout, updateStage } from "./actions";

type Search = Promise<{ view?: string | string[] }>;

export const metadata: Metadata = {
  title: "Bestellungen | Dalab Fresh",
  robots: { index: false, follow: false },
};

const VIEWS: { id: OrderView; label: string }[] = [
  { id: "open", label: "Offen" },
  { id: "done", label: "Erledigt" },
  { id: "all", label: "Alle" },
];

// Staff page: incoming orders, newest first, with buttons to move each one along.
// Everything here reads the session cookie, so it renders per request behind a Suspense boundary.
export default function AdminPage({ searchParams }: { searchParams: Search }) {
  return (
    <div className="min-h-dvh bg-bg">
      <Suspense fallback={<Shell><p className="text-muted">Wird geladen</p></Shell>}>
        <Gate searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function Shell({ children, signedIn = false }: { children: React.ReactNode; signedIn?: boolean }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="gutter mx-auto flex h-[64px] max-w-[1400px] items-center gap-4">
          <Link href="/" className="text-ink no-underline"><Wordmark compact /></Link>
          <span className="hidden text-sm font-semibold text-muted sm:inline">Bestellungen</span>
          {signedIn ? (
            <form action={logout} className="ml-auto">
              <button type="submit" className={`${button.ghost} ${button.small}`}>Abmelden</button>
            </form>
          ) : null}
        </div>
      </header>
      <main id="main" className="gutter mx-auto max-w-[1400px] py-6">{children}</main>
    </>
  );
}

async function Gate({ searchParams }: { searchParams: Search }) {
  if (!adminConfigured()) {
    return (
      <Shell>
        <div className="max-w-[52ch] rounded-panel bg-surface p-6 shadow-soft">
          <h1 className="text-xl font-extrabold">Staff-Bereich noch nicht eingerichtet</h1>
          <p className="mt-2 text-muted">Lege in Vercel (und lokal in .env.local) die Variable ADMIN_PASSWORD mit mindestens 8 Zeichen an und deploye neu.</p>
        </div>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <div className="mx-auto mt-[8vh] max-w-[380px] rounded-panel bg-surface p-6 shadow-soft">
          <h1 className="text-xl font-extrabold">Anmelden</h1>
          <p className="mt-1 mb-5 text-sm text-muted">Für Mitarbeitende von Dalab Fresh.</p>
          <LoginForm />
        </div>
      </Shell>
    );
  }

  const params = await searchParams;
  const view: OrderView = VIEWS.some((v) => v.id === params.view) ? (params.view as OrderView) : "open";
  const [orders, counts, catalog] = await Promise.all([listOrders(view), countOrders(), getCatalog()]);
  const stores = new Map(catalog.stores.map((s) => [s.id, s]));
  const now = new Date();
  const countFor = (id: OrderView) => (id === "open" ? counts.open : id === "done" ? counts.done : counts.open + counts.done);

  return (
    <Shell signedIn>
      <AutoRefresh />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-[clamp(22px,2.4vw,28px)] font-extrabold">Bestellungen</h1>
        <nav aria-label="Filter" className="flex gap-1 rounded-[12px] border border-line bg-surface p-[3px]">
          {VIEWS.map((v) => (
            <Link
              key={v.id}
              href={v.id === "open" ? "/admin" : `/admin?view=${v.id}`}
              aria-current={v.id === view ? "page" : undefined}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-[9px] px-3.5 text-sm font-semibold ${v.id === view ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
            >
              {v.label} <span className="tabular-nums opacity-70">{countFor(v.id)}</span>
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-1 text-sm text-muted">Aktualisiert sich jede Minute von selbst.</p>

      {orders.length ? (
        <ul className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {orders.map((o) => (
            <li key={o.id}><OrderCard order={o} store={stores.get(o.storeId)} now={now} /></li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-panel bg-surface px-6 py-12 text-center shadow-soft">
          <p className="text-lg font-bold">{view === "open" ? "Keine offenen Bestellungen" : "Noch keine Bestellungen"}</p>
          <p className="mt-1 text-muted">Neue Bestellungen erscheinen hier automatisch.</p>
        </div>
      )}
    </Shell>
  );
}

const placedFmt = new Intl.DateTimeFormat("de-DE", { timeZone: TIME_ZONE, weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function OrderCard({ order: o, store, now }: { order: Order; store?: Store; now: Date }) {
  const t = DICTS.de;
  const steps = o.mode === "collect" ? [t.track.steps[0], t.track.steps[1], ...t.track.collectSteps] : t.track.steps;
  const stage = o.stage ?? 0;
  const money = (c: number) => formatEur(c, "de");
  const when = o.slotId === "express" ? "Express, so schnell wie möglich" : describeSlot(o.slotId, now, "de");

  return (
    <article className={`rounded-panel bg-surface p-5 shadow-soft ${stage === 3 ? "opacity-70" : ""}`} aria-labelledby={`order-${o.id}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 id={`order-${o.id}`} className="text-lg font-extrabold tabular-nums">{o.id}</h2>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-bold ${o.mode === "delivery" ? "bg-gold-soft text-gold-text" : "bg-surface-2 text-ink"}`}>
          {o.mode === "delivery" ? <TruckIcon size={14} weight="bold" /> : <StorefrontIcon size={14} weight="bold" />}
          {o.mode === "delivery" ? "Lieferung" : "Abholung"}
        </span>
        <span className="ml-auto text-[13px] text-muted">bestellt {placedFmt.format(new Date(o.placedAt))}</span>
      </div>

      <p className="mt-2 font-semibold">{when}</p>
      <p className="text-sm text-muted">{store?.name ?? o.storeId}</p>

      <div className="mt-4 grid gap-1 text-sm">
        <p className="font-bold">{o.name}</p>
        <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 break-all text-ink hover:underline"><EnvelopeSimpleIcon size={16} className="shrink-0 text-muted" />{o.email}</a>
        {o.phone ? <a href={`tel:${o.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 hover:underline"><PhoneIcon size={16} className="text-muted" />{o.phone}</a> : null}
        {o.address ? (
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`} target="_blank" rel="noopener" className="inline-flex items-start gap-2 hover:underline">
            <MapPinIcon size={16} className="mt-0.5 shrink-0 text-muted" />{o.address}
          </a>
        ) : null}
      </div>

      <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
        {o.items.map((i) => (
          <li key={i.id} className="flex justify-between gap-3 py-1.5">
            <span><b className="tabular-nums">{i.qty}×</b> {i.name}</span>
            <span className="tabular-nums whitespace-nowrap">{money(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-baseline justify-between text-sm">
        <span className="text-muted">{o.payment === "card" ? "Karte" : "Bar"} bei Übergabe{o.quote.fee ? `, inkl. ${money(o.quote.fee)} Lieferung` : ""}</span>
        <span className="text-lg font-extrabold tabular-nums">{money(o.quote.total)}</span>
      </div>

      <form action={updateStage} className="mt-4">
        <input type="hidden" name="id" value={o.id} />
        <fieldset>
          <legend className="sr-only">Status von {o.id}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {steps.map(([label], i) => (
              <button
                key={label}
                type="submit"
                name="stage"
                value={i}
                aria-pressed={i === stage}
                className={`min-h-11 rounded-[10px] border px-2 text-[13px] font-semibold transition-colors ${
                  i === stage ? "border-ink bg-ink text-bg" : i < stage ? "border-line bg-surface-2 text-muted" : "border-line bg-surface hover:border-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </form>
    </article>
  );
}
