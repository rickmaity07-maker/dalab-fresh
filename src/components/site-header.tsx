"use client";

import { BasketIcon, MagnifyingGlassIcon, StorefrontIcon, TruckIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { LANGS } from "@/lib/i18n";
import { Wordmark } from "./brand-mark";
import { useBrowse } from "./providers/browse-provider";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function LanguageSwitch({ className = "inline-flex" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.header.language} className={`rounded-[12px] border border-line bg-surface p-[3px] ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          title={l.label}
          aria-label={l.label}
          aria-pressed={lang === l.id}
          onClick={() => setLang(l.id)}
          className={`min-h-[34px] min-w-10 rounded-[9px] px-2.5 text-[13px] font-bold transition-colors duration-200 ${lang === l.id ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { state, actions, meta } = useShop();
  const { t, money } = useLang();
  const browse = useBrowse();
  const [term, setTerm] = useState("");
  const store = meta.stores.find((s) => s.id === state.storeId) ?? meta.stores[0];

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-30 h-[env(safe-area-inset-top,0px)] bg-surface" />
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 border-b border-line bg-surface">
        <div className="gutter mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-3 py-3 lg:h-[68px] lg:flex-nowrap lg:py-0">
          <a href="#" aria-label={t.header.home} className="text-ink no-underline lg:w-[212px] lg:shrink-0">
            <Wordmark />
          </a>

          <form
            role="search"
            className="order-last flex h-11 w-full min-w-0 items-center gap-2.5 rounded-[12px] bg-bg px-4 transition-shadow focus-within:ring-2 focus-within:ring-ink lg:order-none lg:max-w-[560px] lg:flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              browse.actions.setQuery(term);
              browse.actions.setScope({ kind: "all" });
              scrollTo("shop");
            }}
          >
            <MagnifyingGlassIcon size={19} className="shrink-0 text-muted" />
            <label htmlFor="site-search" className="sr-only">{t.header.searchLabel}</label>
            <input
              id="site-search"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              placeholder={t.header.searchPlaceholder}
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                browse.actions.setQuery(e.target.value);
              }}
              className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTo(state.mode === "delivery" ? "delivery" : "stores")}
              className="hidden min-h-11 items-center gap-2 rounded-[12px] border border-line px-3.5 text-sm transition-colors hover:border-ink md:inline-flex"
            >
              {state.mode === "delivery" ? <TruckIcon size={18} className="text-good" /> : <StorefrontIcon size={18} className="text-good" />}
              <span className="whitespace-nowrap">{state.mode === "delivery" ? t.nav.deliveryToday(store.city) : `${t.header.collectFrom} ${store.name}`}</span>
            </button>
            <LanguageSwitch />
            <button
              type="button"
              aria-label={t.header.basket}
              className="relative hidden min-h-11 items-center gap-2 rounded-[12px] bg-ink px-4 font-semibold text-bg md:inline-flex xl:hidden"
              onClick={() => actions.openDrawer("basket")}
            >
              <BasketIcon size={20} weight="bold" />
              <span className="tabular-nums">{money(meta.quote.subtotal)}</span>
              {meta.quote.itemCount ? (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-gold-ink tabular-nums">{meta.quote.itemCount}</span>
              ) : null}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
