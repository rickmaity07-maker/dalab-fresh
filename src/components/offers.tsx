"use client";

import { TimerIcon } from "@phosphor-icons/react";
import { formatDay } from "@/lib/i18n";
import { ProductCard } from "./product-card";
import { useAisle } from "./aisle-nav";
import { ScrollItem, ScrollRow } from "./scroll-row";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";

// The week's deals as a swipeable row of product cards, biggest saving first.
// `endsOn` is the offer's last day (ISO date) worked out on the server, so both renders agree.
export function Offers({ endsOn }: { endsOn: string }) {
  const { state, meta } = useShop();
  const { t, lang } = useLang();
  const { go } = useAisle();
  const deals = meta.products
    .filter((p) => p.was)
    .toSorted((a, b) => (b.was! - b.price) / b.was! - (a.was! - a.price) / a.was!);
  if (!deals.length) return null;
  const end = new Date(`${endsOn}T00:00:00Z`);

  return (
    <section id="offers" aria-labelledby="offers-title" className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 id="offers-title" className="text-[clamp(20px,2.2vw,24px)] font-extrabold">{t.offers.title}</h2>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted"><TimerIcon size={16} />{t.offers.ends(formatDay(end, lang, { weekday: "long" }))}</span>
        <button type="button" onClick={() => go("offers")} className="ml-auto text-sm font-semibold underline-offset-2 hover:underline">{t.nav.seeAll}</button>
      </div>
      <div className="mt-3">
        <ScrollRow label={t.offers.title}>
          {deals.map((p) => (
            <ScrollItem key={p.id}>
              <ProductCard product={p} qty={state.cart[p.id] ?? 0} saved={state.saved.has(p.id)} />
            </ScrollItem>
          ))}
        </ScrollRow>
      </div>
    </section>
  );
}
