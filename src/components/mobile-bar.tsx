"use client";

import { HouseIcon, ListChecksIcon, PackageIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { useLang } from "./providers/lang-provider";
import { type Tab, useNav } from "./providers/nav-provider";
import { useShop } from "./providers/shop-provider";

// Phones and tablets: the black basket bar and the app-style bottom menu that switches screens.
export function MobileBar() {
  const { actions, meta } = useShop();
  const { t, money } = useLang();
  const nav = useNav();
  const items: { id: Tab; label: string; icon: typeof HouseIcon }[] = [
    { id: "home", label: t.nav.home, icon: HouseIcon },
    { id: "aisles", label: t.nav.aisles, icon: SquaresFourIcon },
    { id: "list", label: t.nav.list, icon: ListChecksIcon },
    { id: "orders", label: t.nav.orders, icon: PackageIcon },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 select-none lg:hidden">
      {meta.quote.itemCount ? (
        <div className="gutter pb-2">
          <button
            type="button"
            onClick={() => actions.openDrawer("basket")}
            className="flex min-h-[52px] w-full animate-slide-up items-center justify-between gap-3 rounded-[14px] bg-ink px-4 font-semibold text-bg shadow-lift transition-transform active:scale-[0.98]"
          >
            <span className="flex items-center gap-2.5">
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-gold px-1.5 text-xs font-bold text-gold-ink tabular-nums">{meta.quote.itemCount}</span>
              {t.nav.viewBasket}
            </span>
            <span className="tabular-nums">{money(meta.quote.total)}</span>
          </button>
        </div>
      ) : null}
      <nav aria-label={t.nav.menu} className="border-t border-line bg-surface pb-[env(safe-area-inset-bottom,0px)]">
        <ul className="mx-auto grid h-16 max-w-xl grid-cols-4">
          {items.map(({ id, label, icon: Icon }) => {
            const on = nav.tab === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-current={on ? "page" : undefined}
                  onClick={() => nav.go(id)}
                  className={`relative flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors active:bg-surface-2 ${on ? "text-ink" : "text-muted"}`}
                >
                  <span aria-hidden className={`absolute top-0 h-[3px] w-8 rounded-b-full bg-gold transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
                  <Icon size={23} weight={on ? "fill" : "regular"} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
