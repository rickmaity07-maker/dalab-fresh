"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useLang } from "./providers/lang-provider";
import { useShopActions } from "./providers/shop-provider";
import { useToast } from "./providers/toast-provider";

type Props = {
  id: number;
  name: string;
  qty: number;
  /** "round": the gold + that sits on a product photo. "pill": a labelled button. "line": compact stepper for the basket. */
  variant?: "round" | "pill" | "line";
  addLabel?: string;
};

// One control for every place a product appears: "add" until it is in the basket, then a stepper.
export function QuantityControl({ id, name, qty, variant = "round", addLabel }: Props) {
  const actions = useShopActions();
  const { t } = useLang();
  const toast = useToast();

  if (!qty) {
    const add = () => {
      actions.add(id);
      toast(t.product.added(name));
    };
    if (variant === "pill") {
      return (
        <button type="button" aria-label={t.product.addAria(name)} onClick={add} className="inline-flex min-h-11 items-center gap-2 rounded-[12px] bg-gold px-5 font-semibold text-gold-ink transition-transform active:scale-[0.97]">
          <PlusIcon size={18} weight="bold" />
          {addLabel ?? t.product.addToBasket}
        </button>
      );
    }
    return (
      <button
        type="button"
        aria-label={t.product.addAria(name)}
        onClick={add}
        className={`grid place-items-center rounded-full bg-gold text-gold-ink shadow-soft transition-transform hover:scale-105 active:scale-95 ${variant === "line" ? "size-8" : "size-10 border-[3px] border-surface"}`}
      >
        <PlusIcon size={variant === "line" ? 16 : 20} weight="bold" />
      </button>
    );
  }

  const size = variant === "line" ? "h-8" : "h-10";
  const btn = `grid ${size} ${variant === "line" ? "w-8" : "w-9"} place-items-center rounded-full transition-colors`;
  return (
    <div
      role="group"
      aria-label={t.product.quantityOf(name)}
      className={`inline-flex ${size} items-center rounded-full ${variant === "line" ? "border border-line bg-surface text-ink" : "border-[3px] border-surface bg-ink text-bg shadow-soft"}`}
    >
      <button type="button" aria-label={qty === 1 ? t.product.remove(name) : t.product.removeOne} className={`${btn} ${variant === "line" ? "hover:bg-surface-2" : "hover:bg-white/15"}`} onClick={() => actions.setQty(id, qty - 1)}>
        {qty === 1 ? <TrashIcon size={15} weight="bold" /> : <MinusIcon size={15} weight="bold" />}
      </button>
      <output className="min-w-5 text-center text-sm font-bold tabular-nums">{qty}</output>
      <button type="button" aria-label={t.product.addOne} className={`${btn} ${variant === "line" ? "hover:bg-surface-2" : "hover:bg-white/15"}`} onClick={() => actions.setQty(id, qty + 1)}>
        <PlusIcon size={15} weight="bold" />
      </button>
    </div>
  );
}
