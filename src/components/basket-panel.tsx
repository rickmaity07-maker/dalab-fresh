"use client";

import { BasketIcon } from "@phosphor-icons/react";
import { FREE_DELIVERY_OVER } from "@/lib/pricing";
import { ProductThumb } from "./product-card";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";
import { QuantityControl } from "./quantity-control";
import { SmartList } from "./smart-list";

/** Progress towards free delivery, shared by the desktop panel and the drawer. */
function FreeDeliveryBar() {
  const { state, meta } = useShop();
  const { t, money } = useLang();
  if (state.mode !== "delivery" || !meta.quote.itemCount) return null;
  const gap = FREE_DELIVERY_OVER - meta.quote.subtotal;
  const pct = Math.min(100, Math.round((meta.quote.subtotal / FREE_DELIVERY_OVER) * 100));
  const [before, amount, after] = t.basket.moreForFree(money(Math.max(0, gap)));
  return (
    <div>
      <p className="text-[13px] font-semibold text-good">{gap > 0 ? <>{before}{amount}{after}</> : t.basket.freeDelivery}</p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t.services.freeDelivery}>
        <div className="h-full rounded-full bg-good transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Desktop: the basket is always open on the right, with the shopping-list box on top.
export function BasketPanel() {
  const { state, actions, meta } = useShop();
  const { t, money, pick } = useLang();
  const lines = Object.entries(state.cart).flatMap(([id, qty]) => {
    const p = meta.productsById.get(Number(id));
    return p ? [{ p, qty }] : [];
  });

  return (
    <aside aria-label={t.basket.title} className="sticky top-[84px] flex max-h-[calc(100dvh-100px)] flex-col overflow-hidden rounded-panel bg-surface shadow-soft">
      <div className="space-y-3 p-4 pb-3">
        <h2 className="flex items-baseline justify-between text-lg font-extrabold">
          {t.basket.title}
          {meta.quote.itemCount ? <span className="text-sm font-medium text-muted tabular-nums">{meta.quote.itemCount}</span> : null}
        </h2>
        <SmartList compact />
      </div>

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-1">
        {lines.length ? (
          lines.map(({ p, qty }) => (
            <li key={p.id} className="flex items-center gap-3">
              <ProductThumb product={p} className="size-11 rounded-[10px]" iconSize={20} sizes="44px" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">{pick(p.name)}</p>
                <p className="text-[13px] text-muted tabular-nums">{money(p.price * qty)}</p>
              </div>
              <QuantityControl id={p.id} name={pick(p.name)} qty={qty} variant="line" />
            </li>
          ))
        ) : (
          <li className="grid justify-items-center gap-1.5 py-6 text-center text-sm text-muted">
            <BasketIcon size={26} />
            <span className="font-semibold text-ink">{t.basket.emptyTitle}</span>
            <span className="max-w-[28ch]">{t.basket.emptyBody}</span>
          </li>
        )}
      </ul>

      <div className="space-y-3 border-t border-line p-4">
        <FreeDeliveryBar />
        <div className="flex items-baseline justify-between">
          <span className="text-sm">{t.basket.total}</span>
          <span className="text-xl font-extrabold tabular-nums">{money(meta.quote.total)}</span>
        </div>
        <button
          type="button"
          disabled={!meta.quote.itemCount}
          onClick={() => actions.openDrawer("checkout")}
          className="min-h-12 w-full rounded-[12px] bg-ink font-semibold text-bg transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {t.basket.checkout}
        </button>
      </div>
    </aside>
  );
}
