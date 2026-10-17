"use client";

import { HouseIcon, ListChecksIcon, PackageIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";

const go = (id: string) => (id === "top" ? window.scrollTo({ top: 0, behavior: "smooth" }) : document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));

// Phones and tablets: the black basket bar and the app-style bottom menu.
export function MobileBar() {
  const { actions, meta } = useShop();
  const { t, money } = useLang();
  const items = [
    { id: "top", label: t.nav.home, icon: HouseIcon },
    { id: "aisles", label: t.nav.aisles, icon: SquaresFourIcon },
    { id: "list", label: t.nav.list, icon: ListChecksIcon },
    { id: "track", label: t.nav.orders, icon: PackageIcon },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      {meta.quote.itemCount ? (
        <div className="gutter pb-2">
          <button
            type="button"
            onClick={() => actions.openDrawer("basket")}
            className="flex min-h-[52px] w-full animate-slide-up items-center justify-between gap-3 rounded-[14px] bg-ink px-4 font-semibold text-bg shadow-lift"
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
          {items.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button type="button" onClick={() => go(id)} className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted transition-colors hover:text-ink">
                <Icon size={22} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
