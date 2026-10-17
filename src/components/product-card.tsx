"use client";

import { HeartIcon } from "@phosphor-icons/react";
import Image, { type ImageLoader } from "next/image";
import { memo } from "react";
import { imagesEnabled, productImage } from "@/lib/images";
import { unitPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductIcon } from "./product-icon";
import { useLang } from "./providers/lang-provider";
import { useShopActions } from "./providers/shop-provider";
import { useToast } from "./providers/toast-provider";
import { QuantityControl } from "./quantity-control";

// Cloudinary resizes and picks the format, so Next.js only has to ask for the right width.
const cloudinaryLoader: ImageLoader = ({ src, width }) => productImage(src, width) ?? src;

/** Photo when there is one (Cloudinary upload, then bundled photo), otherwise the product icon on a tinted tile. */
export function ProductThumb({ product, className = "size-12", iconSize = 24, sizes = "48px" }: { product: Product; className?: string; iconSize?: number; sizes?: string }) {
  const { pick } = useLang();
  const alt = pick(product.name);
  const cloud = imagesEnabled && product.image;
  const src = cloud ? product.image : product.photo;
  if (src) {
    return (
      <span className={`relative block shrink-0 overflow-hidden bg-surface-2 ${className}`}>
        <Image loader={cloud ? cloudinaryLoader : undefined} src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </span>
    );
  }
  return (
    <span className={`tint grid shrink-0 place-items-center ${className}`} style={{ "--h": product.hue } as React.CSSProperties}>
      <ProductIcon name={product.icon} size={iconSize} weight="duotone" />
    </span>
  );
}

/** The Somali name under the German or English one, or the German name when the page is in Somali. */
function useSecondName(product: Product) {
  const { lang } = useLang();
  const second = lang === "so" ? product.name.de : product.name.so;
  return second.toLowerCase() === (lang === "so" ? product.name.so : product.name[lang]).toLowerCase() ? null : second;
}

// Picnic-style card: photo on top with the gold + on its corner, then price, name, Somali name and size.
// Memoised on primitives (qty, saved) so changing one item's quantity doesn't redraw the whole grid.
export const ProductCard = memo(function ProductCard({ product, qty, saved }: { product: Product; qty: number; saved: boolean }) {
  const actions = useShopActions();
  const { t, lang, money, pick } = useLang();
  const toast = useToast();
  const name = pick(product.name);
  const second = useSecondName(product);
  const pct = product.was ? Math.round(((product.was - product.price) / product.was) * 100) : 0;
  const per = unitPrice(product.price, product.size.de);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-panel bg-surface shadow-soft transition-shadow duration-200 hover:shadow-lift">
      <div className="relative">
        <ProductThumb product={product} className="aspect-[4/3] w-full" iconSize={44} sizes="(max-width: 640px) 50vw, 220px" />
        {pct ? <span className="absolute top-2.5 left-2.5 rounded-md bg-sale px-2 py-0.5 text-xs font-bold text-white tabular-nums">-{pct}%</span> : null}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? t.product.unsaveAria(name) : t.product.saveAria(name)}
          className={`absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-surface/90 transition-colors ${saved ? "text-sale" : "text-muted hover:text-ink"}`}
          onClick={() => toast(actions.toggleSaved(product.id) ? t.product.savedToast : t.product.unsavedToast, <HeartIcon size={20} />)}
        >
          <HeartIcon size={19} weight={saved ? "fill" : "regular"} />
        </button>
        <div className="absolute right-2.5 -bottom-5">
          <QuantityControl id={product.id} name={name} qty={qty} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5">
        <p className="flex flex-wrap items-baseline gap-x-2 pr-12">
          <span className={`text-[17px] font-extrabold tabular-nums ${pct ? "text-sale" : ""}`}>{money(product.price)}</span>
          {product.was ? <span className="text-xs text-muted tabular-nums line-through">{money(product.was)}</span> : null}
        </p>
        <h3 className="mt-0.5 text-[14px] leading-snug font-semibold">{name}</h3>
        {second ? <p lang={lang === "so" ? "de" : "so"} className="text-[13px] leading-snug text-muted">{second}</p> : null}
        <p className="mt-auto pt-1.5 text-xs text-muted tabular-nums">
          {pick(product.size)}
          {per ? `, ${money(per.cents)}/${per.unit}` : ""}
        </p>
      </div>
    </article>
  );
});
