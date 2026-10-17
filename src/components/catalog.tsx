"use client";

import { HeartIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useDeferredValue, useMemo } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { type SortKey, useBrowse } from "./providers/browse-provider";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";
import { button, chip, chipOff, chipOn } from "./ui";

const saving = (p: Product) => (p.was ?? p.price) - p.price;
const SORTERS: Record<Exclude<SortKey, "popular">, (a: Product, b: Product) => number> = {
  "price-low": (a, b) => a.price - b.price,
  "price-high": (a, b) => b.price - a.price,
  saving: (a, b) => saving(b) - saving(a),
};
const SORT_KEYS: SortKey[] = ["popular", "price-low", "price-high", "saving"];

export function Catalog() {
  const { state: shop, meta } = useShop();
  const { t, lang, pick } = useLang();
  const browse = useBrowse();
  const { scope, sort, offersOnly } = browse.state;
  const query = useDeferredValue(browse.state.query.trim().toLowerCase());

  const results = useMemo(() => {
    const list = meta.products.filter(
      (p) =>
        (scope.kind !== "category" || p.category === scope.id) &&
        (scope.kind !== "saved" || shop.saved.has(p.id)) &&
        (!offersOnly || p.was) &&
        (!query ||
          Object.values(p.name).some((n) => n.toLowerCase().includes(query)) ||
          p.keywords.some((k) => k.includes(query) || query.includes(k))),
    );
    return sort === "popular" ? list : list.toSorted(SORTERS[sort]);
  }, [meta.products, scope, shop.saved, offersOnly, query, sort]);

  const category = scope.kind === "category" ? meta.categories.find((c) => c.id === scope.id) : undefined;
  const title = offersOnly ? t.nav.offers : scope.kind === "saved" ? t.nav.saved : category ? pick(category.name) : t.nav.all;
  const somali = category && lang !== "so" ? category.name.so : null;

  return (
    <section id="shop" aria-labelledby="shop-title" className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 id="shop-title" className="text-[clamp(22px,2.4vw,28px)] font-extrabold">{title}</h2>
        {somali ? <span lang="so" className="text-[15px] text-muted">{somali}</span> : null}
        <span className="ml-auto text-sm text-muted tabular-nums">
          {t.catalog.count(results.length)}
          {query ? ` ${t.catalog.matching(browse.state.query.trim())}` : ""}
        </span>
      </div>

      <div className="no-scrollbar -mx-4 mt-3 mb-5 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <button type="button" aria-pressed={offersOnly} className={`${chip} ${offersOnly ? chipOn : chipOff}`} onClick={() => browse.actions.setOffersOnly(!offersOnly)}>
          {t.catalog.offersOnly}
        </button>
        <label htmlFor="sort" className="sr-only">{t.catalog.sortLabel}</label>
        <select id="sort" value={sort} onChange={(e) => browse.actions.setSort(e.target.value as SortKey)} className={`${chip} ${chipOff} cursor-pointer appearance-none pr-4`}>
          {SORT_KEYS.map((k) => <option key={k} value={k}>{t.catalog.sort[k]}</option>)}
        </select>
        {scope.kind !== "all" || offersOnly || query ? (
          <button type="button" className={`${chip} border-transparent text-muted underline-offset-2 hover:underline`} onClick={browse.actions.reset}>{t.catalog.clear}</button>
        ) : null}
      </div>

      {results.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 min-[1440px]:grid-cols-4 min-[1800px]:grid-cols-5">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} qty={shop.cart[p.id] ?? 0} saved={shop.saved.has(p.id)} />
          ))}
        </div>
      ) : (
        <div className="grid justify-items-center gap-2.5 rounded-panel bg-surface px-6 py-12 text-center text-muted shadow-soft">
          {scope.kind === "saved" ? <HeartIcon size={28} /> : <MagnifyingGlassIcon size={28} />}
          <b className="text-lg font-bold text-ink">{scope.kind === "saved" ? t.catalog.emptySavedTitle : t.catalog.emptySearchTitle}</b>
          <span className="max-w-[48ch]">{scope.kind === "saved" ? t.catalog.emptySavedBody : t.catalog.emptySearchBody}</span>
          <button type="button" className={`${button.ghost} mt-2`} onClick={browse.actions.reset}>{t.catalog.clear}</button>
        </div>
      )}
    </section>
  );
}
