"use client";

import { BasketIcon, MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { parseShoppingList } from "@/lib/smart-list";
import { ProductThumb } from "./product-card";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";
import { useToast } from "./providers/toast-provider";

// Paste a shopping list in German, English or Somali; each line is matched to a product and added in one tap.
export function SmartList({ compact = false }: { compact?: boolean }) {
  const { actions, meta } = useShop();
  const { t, money, pick } = useLang();
  const toast = useToast();
  const id = useId();
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const matches = useMemo(() => parseShoppingList(deferred, meta.products), [deferred, meta.products]);
  const hits = matches.flatMap((m) => (m.product ? [{ product: m.product, qty: m.qty }] : []));
  const total = hits.reduce((sum, h) => sum + h.product.price * h.qty, 0);

  return (
    <div className="rounded-panel border border-gold-line bg-gold-soft p-3.5">
      <label htmlFor={id} className="text-[13px] font-bold">{t.nav.listTitle}</label>
      <textarea
        id={id}
        rows={compact ? 2 : 3}
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.hero.placeholder}
        className="mt-2 block min-h-[3.4em] w-full resize-none rounded-[10px] border border-gold-line bg-surface px-3 py-2 text-[14px] leading-snug outline-none [field-sizing:content] placeholder:text-muted focus:border-ink"
      />
      {matches.length ? (
        <>
          <ul aria-live="polite" aria-label={t.hero.matched} className="mt-2.5 flex flex-wrap gap-1.5">
            {matches.map((m, i) =>
              m.product ? (
                <li key={`${i}-${m.raw}`} className="inline-flex animate-pop items-center gap-1.5 rounded-full bg-surface py-0.5 pr-2.5 pl-0.5 text-[13px]">
                  <ProductThumb product={m.product} className="size-6 rounded-full" iconSize={13} sizes="24px" />
                  <span className="font-medium">{pick(m.product.name)}</span>
                  <span className="text-muted tabular-nums">×{m.qty}</span>
                </li>
              ) : (
                <li key={`${i}-${m.raw}`} title={t.hero.notFoundHint} className="inline-flex items-center gap-1 rounded-full border border-dashed border-gold-line py-0.5 pr-2.5 pl-2 text-[13px] text-muted">
                  <MagnifyingGlassIcon size={13} />
                  {t.hero.notFound(m.raw)}
                </li>
              ),
            )}
          </ul>
          <button
            type="button"
            disabled={!hits.length}
            onClick={() => {
              actions.addMany(hits.map((h) => ({ id: h.product.id, qty: h.qty })));
              toast(t.hero.added(hits.length), <BasketIcon size={20} />);
              setText("");
            }}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-ink px-4 text-sm font-semibold text-bg transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            <PlusIcon size={16} weight="bold" />
            {t.hero.addAll}
            <span className="tabular-nums opacity-80">{money(total)}</span>
          </button>
        </>
      ) : (
        <p className="mt-2 text-xs text-muted">{t.hero.hint}</p>
      )}
    </div>
  );
}
