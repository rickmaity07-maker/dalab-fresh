"use client";

import Image from "next/image";
import { Star } from "./brand-mark";
import { ProductCard } from "./product-card";
import { ScrollItem, ScrollRow } from "./scroll-row";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";

// The black "Taste of home" banner with the Somali mat photo, then the photographed specialities in a row.
export function HomeFavourites() {
  const { state, meta } = useShop();
  const { t, lang } = useLang();
  const favourites = meta.products.filter((p) => p.homeFavourite).toSorted((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));

  return (
    <section id="home" aria-labelledby="home-title" className="space-y-4">
      <div className="relative isolate flex min-h-[200px] overflow-hidden rounded-panel bg-[#141414] text-white sm:min-h-[220px]">
        <div className="relative z-10 flex max-w-[34rem] flex-col justify-center gap-2 p-5 sm:p-7">
          <p lang="so" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#e3b23c]">
            <Star className="size-3.5" /> {lang === "so" ? "Dalab Fresh" : "Dhadhanka guriga"}
          </p>
          <h1 id="home-title" className="text-[clamp(24px,3vw,34px)] leading-[1.1] font-extrabold">{t.home.title}</h1>
          <p className="max-w-[42ch] text-[14px] text-[#d6d3cb]">{t.home.lead}</p>
        </div>
        <div className="absolute inset-y-0 right-0 -z-0 w-[55%] sm:w-[48%]">
          <Image src="/photos/mat-spices.jpg" alt="Spices in woven bowls on a Somali mat" fill priority sizes="(max-width: 1024px) 55vw, 30vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#141414_0%,rgb(20_20_20/0.55)_35%,transparent_75%)]" />
        </div>
      </div>

      {favourites.length ? (
        <ScrollRow label={t.home.title}>
          {favourites.map((p) => (
            <ScrollItem key={p.id}>
              <ProductCard product={p} qty={state.cart[p.id] ?? 0} saved={state.saved.has(p.id)} />
            </ScrollItem>
          ))}
        </ScrollRow>
      ) : null}
    </section>
  );
}
