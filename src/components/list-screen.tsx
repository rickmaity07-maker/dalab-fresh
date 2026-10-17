"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { ProductCard } from "./product-card";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";
import { SmartList } from "./smart-list";
import { sectionTitle } from "./ui";

// Phone "List" screen: paste a shopping list, and below it the products saved with the heart.
export function ListScreen() {
  const { state, meta } = useShop();
  const { t } = useLang();
  const saved = meta.products.filter((p) => state.saved.has(p.id));

  return (
    <section id="list" aria-labelledby="list-title" className="scroll-mt-24 space-y-6">
      <div>
        <h2 id="list-title" className={sectionTitle}>{t.hero.listLabel}</h2>
        <p className="mt-1.5 mb-4 max-w-[56ch] text-muted">{t.hero.lead}</p>
        <SmartList />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-extrabold">{t.nav.saved}</h2>
        {saved.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} qty={state.cart[p.id] ?? 0} saved />
            ))}
          </div>
        ) : (
          <div className="grid justify-items-center gap-2 rounded-panel bg-surface px-6 py-10 text-center text-muted shadow-soft">
            <HeartIcon size={26} />
            <b className="text-ink">{t.catalog.emptySavedTitle}</b>
            <span className="max-w-[36ch] text-sm">{t.catalog.emptySavedBody}</span>
          </div>
        )}
      </div>
    </section>
  );
}
