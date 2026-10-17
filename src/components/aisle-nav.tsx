"use client";

import { HeartIcon, SealPercentIcon, SquaresFourIcon } from "@phosphor-icons/react";
import Image from "next/image";
import type { CategoryId } from "@/lib/types";
import { ProductIcon } from "./product-icon";
import { useBrowse } from "./providers/browse-provider";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";

const toShop = () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });

/** Which aisle is selected, as one string: "all", "offers", "saved" or a category id. */
export function useAisle() {
  const { state, actions } = useBrowse();
  const active = state.offersOnly ? "offers" : state.scope.kind === "category" ? state.scope.id : state.scope.kind;
  const go = (id: "all" | "offers" | "saved" | CategoryId) => {
    actions.setOffersOnly(id === "offers");
    actions.setScope(id === "all" || id === "offers" ? { kind: "all" } : id === "saved" ? { kind: "saved" } : { kind: "category", id });
    toShop();
  };
  return { active, go };
}

// Desktop: a sticky list of aisles with photo thumbnails, left of the products.
export function AisleNav() {
  const { meta, state } = useShop();
  const { t, pick } = useLang();
  const { active, go } = useAisle();
  const row = "flex min-h-11 w-full items-center gap-3 rounded-[10px] px-2.5 py-1.5 text-left text-[14px] transition-colors";
  const on = "bg-gold-soft font-bold";
  const off = "font-medium hover:bg-bg";

  return (
    <nav aria-label={t.nav.aisles} className="sticky top-[84px] flex max-h-[calc(100dvh-100px)] flex-col gap-0.5 overflow-y-auto pb-4">
      <button type="button" aria-pressed={active === "all"} className={`${row} ${active === "all" ? on : off}`} onClick={() => go("all")}>
        <span className="grid size-[34px] place-items-center rounded-[8px] bg-ink text-gold"><SquaresFourIcon size={18} weight="fill" /></span>
        {t.nav.all}
      </button>
      <button type="button" aria-pressed={active === "offers"} className={`${row} ${active === "offers" ? on : off}`} onClick={() => go("offers")}>
        <span className="grid size-[34px] place-items-center rounded-[8px] bg-sale text-white"><SealPercentIcon size={18} weight="fill" /></span>
        {t.nav.offers}
      </button>
      <div className="my-2 h-px bg-line" />
      {meta.categories.map((c) => (
        <button key={c.id} type="button" aria-pressed={active === c.id} className={`${row} ${active === c.id ? on : off}`} onClick={() => go(c.id)}>
          <span className="relative grid size-[34px] shrink-0 place-items-center overflow-hidden rounded-[8px] bg-bg">
            {c.photo ? <Image src={c.photo} alt="" fill sizes="34px" className="object-cover" /> : <ProductIcon name={c.icon} size={18} weight="duotone" />}
          </span>
          {pick(c.name)}
        </button>
      ))}
      <div className="my-2 h-px bg-line" />
      <button type="button" aria-pressed={active === "saved"} className={`${row} ${active === "saved" ? on : off}`} onClick={() => go("saved")}>
        <span className="grid size-[34px] place-items-center rounded-[8px] bg-bg text-sale"><HeartIcon size={18} weight="fill" /></span>
        {t.nav.saved}
        {state.saved.size ? <span className="ml-auto text-xs text-muted tabular-nums">{state.saved.size}</span> : null}
      </button>
    </nav>
  );
}

// Phone and tablet: aisle tiles in a grid, as in the app layout.
export function AisleTiles() {
  const { meta } = useShop();
  const { t, pick } = useLang();
  const { active, go } = useAisle();
  const tile = "flex flex-col items-center gap-1.5 rounded-panel bg-surface p-2 text-center text-[12px] leading-tight font-semibold shadow-soft transition-shadow";

  return (
    <div role="toolbar" aria-label={t.nav.aisles} className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
      <button type="button" aria-pressed={active === "offers"} className={`${tile} ${active === "offers" ? "ring-2 ring-ink" : ""}`} onClick={() => go("offers")}>
        <span className="grid aspect-square w-full max-w-14 place-items-center rounded-[10px] bg-sale text-white"><SealPercentIcon size={24} weight="fill" /></span>
        {t.nav.offers}
      </button>
      {meta.categories.map((c) => (
        <button key={c.id} type="button" aria-pressed={active === c.id} className={`${tile} ${active === c.id ? "ring-2 ring-ink" : ""}`} onClick={() => go(c.id)}>
          <span className="relative grid aspect-square w-full max-w-14 place-items-center overflow-hidden rounded-[10px] bg-bg">
            {c.photo ? <Image src={c.photo} alt="" fill sizes="56px" className="object-cover" /> : <ProductIcon name={c.icon} size={24} weight="duotone" />}
          </span>
          <span className="line-clamp-2">{pick(c.name)}</span>
        </button>
      ))}
    </div>
  );
}
