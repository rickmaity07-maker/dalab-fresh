"use client";

import { BasketIcon, CheckIcon, CreditCardIcon, MapPinIcon, MoneyIcon, StorefrontIcon, TruckIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { describeSlot, type Dict } from "@/lib/i18n";
import { FREE_DELIVERY_OVER } from "@/lib/pricing";
import type { PaymentMethod, Quote } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { ProductThumb } from "./product-card";
import { useLang } from "./providers/lang-provider";
import { type OrderError, useShop } from "./providers/shop-provider";
import { QuantityControl } from "./quantity-control";
import { button, iconButton, input } from "./ui";

const CONTACT_KEY = "dalab:v1:contact";
type Contact = { name: string; email: string; phone: string; address: string };
const EMPTY_CONTACT: Contact = { name: "", email: "", phone: "", address: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readContact(): Contact {
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    return raw ? { ...EMPTY_CONTACT, ...(JSON.parse(raw) as Partial<Contact>) } : EMPTY_CONTACT;
  } catch {
    return EMPTY_CONTACT;
  }
}

const errorText = (t: Dict, field: string) => t.errors[field as keyof Dict["errors"]] ?? t.errors.form;

function Summary({ quote, mode, express }: { quote: Quote; mode: "delivery" | "collect"; express: boolean }) {
  const { t, money } = useLang();
  const row = "flex justify-between gap-3 text-[15px]";
  return (
    <div className="grid gap-1.5">
      {quote.savings ? <div className={row}><span>{t.basket.youSave}</span><span className="font-bold text-good tabular-nums">{money(quote.savings)}</span></div> : null}
      <div className={row}><span>{t.basket.subtotal}</span><span className="tabular-nums">{money(quote.subtotal)}</span></div>
      <div className={row}>
        <span>{mode === "collect" ? t.basket.collect : express ? t.basket.express : t.basket.delivery}</span>
        <span className="tabular-nums">{quote.fee ? money(quote.fee) : t.basket.free}</span>
      </div>
      <div className={`${row} text-lg font-bold`}><span>{t.basket.total}</span><span className="tabular-nums">{money(quote.total)}</span></div>
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto grid gap-2.5 border-t border-line px-5 pt-4 pb-5">{children}</div>;
}

function EmptyBasket() {
  const { actions } = useShop();
  const { t } = useLang();
  return (
    <>
      <div className="mx-5 mt-4 grid justify-items-center gap-2.5 rounded-panel border border-dashed border-line px-6 py-12 text-center text-muted">
        <BasketIcon size={28} />
        <b className="text-lg text-ink">{t.basket.emptyTitle}</b>
        <span>{t.basket.emptyBody}</span>
      </div>
      <Footer><button type="button" className={button.primary} onClick={actions.closeDrawer}>{t.basket.start}</button></Footer>
    </>
  );
}

function BasketView() {
  const { state, actions, meta } = useShop();
  const { t, money, pick } = useLang();
  const lines = Object.entries(state.cart).flatMap(([id, qty]) => {
    const p = meta.productsById.get(Number(id));
    return p ? [{ p, qty }] : [];
  });
  if (!lines.length) return <EmptyBasket />;
  const gap = FREE_DELIVERY_OVER - meta.quote.subtotal;
  const [before, amount, after] = t.basket.moreForFree(money(gap));

  return (
    <>
      <ul className="flex-1 overflow-y-auto px-5 py-2">
        {lines.map(({ p, qty }) => (
          <li key={p.id} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 border-b border-line py-2.5" style={{ "--h": p.hue } as React.CSSProperties}>
            <ProductThumb product={p} className="size-[52px] rounded-[10px]" iconSize={24} sizes="52px" />
            <span className="min-w-0">
              <b className="block text-[15px] leading-tight">{pick(p.name)}</b>
              <small className="text-[13px] text-muted">{pick(p.size)}, {money(p.price)} {t.hero.each}</small>
            </span>
            <span className="grid justify-items-end gap-1.5">
              <span className="font-bold tabular-nums">{money(p.price * qty)}</span>
              <QuantityControl id={p.id} name={pick(p.name)} qty={qty} variant="line" />
            </span>
          </li>
        ))}
      </ul>
      <Footer>
        {state.mode === "delivery" ? (
          <p className="text-[13px] text-muted">
            {gap > 0 ? <>{before}<b className="text-good">{amount}</b>{after}</> : <b className="text-good">{t.basket.freeDelivery}</b>}
          </p>
        ) : null}
        <Summary quote={meta.quote} mode={state.mode} express={state.slotId === "express"} />
        <button type="button" className={button.primary} onClick={() => actions.openDrawer("checkout")}>{t.basket.checkout}</button>
      </Footer>
    </>
  );
}

function Field({ id, label, hint, error, ...props }: { id: string; label: string; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] font-bold">{label}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={`${id}-note`} className={input} {...props} />
      <span id={`${id}-note`} className={error ? "text-[13px] font-bold text-bad" : "text-xs text-muted"}>{error ?? hint}</span>
    </div>
  );
}

function CheckoutView() {
  const { state, actions, meta } = useShop();
  const { t, lang } = useLang();
  const now = useNow();
  const [contact, setContact] = useState<Contact>(readContact);
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [error, setError] = useState<OrderError | null>(null);
  const [pending, startTransition] = useTransition();
  const store = meta.stores.find((s) => s.id === state.storeId) ?? meta.stores[0];
  if (!meta.quote.itemCount) return <EmptyBasket />;

  const set = (key: keyof Contact) => (e: React.ChangeEvent<HTMLInputElement>) => setContact((c) => ({ ...c, [key]: e.target.value }));
  const fieldError = (f: string) => (error?.field === f ? errorText(t, f) : undefined);
  const radio = "flex cursor-pointer items-center gap-3 rounded-tile border border-line px-3.5 py-3 font-bold transition-colors duration-200 has-[:checked]:border-accent has-[:checked]:bg-accent-soft";

  function submit() {
    const c = { name: contact.name.trim(), email: contact.email.trim(), phone: contact.phone.trim(), address: contact.address.trim() };
    const invalid = c.name.length < 2 ? "name" : !EMAIL.test(c.email) ? "email" : state.mode === "delivery" && c.address.length < 8 ? "address" : null;
    if (invalid) {
      setError({ field: invalid });
      document.getElementById(`checkout-${invalid}`)?.focus();
      return;
    }
    try { localStorage.setItem(CONTACT_KEY, JSON.stringify(c)); } catch {}
    startTransition(async () => {
      setError(await actions.placeOrder({ ...c, phone: c.phone || undefined, payment, lang }));
    });
  }

  return (
    <>
      <form id="checkout" noValidate className="grid flex-1 content-start gap-1 overflow-y-auto px-5 py-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <fieldset className="grid gap-2.5 pt-2.5 pb-4">
          <legend className="pb-2.5 text-[15px] font-bold">{t.checkout.how}</legend>
          <label className={radio}>
            <input type="radio" name="mode" checked={state.mode === "delivery"} onChange={() => actions.setMode("delivery")} className="size-[18px] accent-accent" />
            <TruckIcon size={20} />
            <span>{t.services.delivery}<small className="block text-[13px] font-semibold text-muted">{t.checkout.toAddress}</small></span>
          </label>
          <label className={radio}>
            <input type="radio" name="mode" checked={state.mode === "collect"} onChange={() => actions.setMode("collect")} className="size-[18px] accent-accent" />
            <StorefrontIcon size={20} />
            <span>{t.services.collect}<small className="block text-[13px] font-semibold text-muted">{t.checkout.collectAt(store.name)}</small></span>
          </label>
        </fieldset>

        <fieldset className="grid gap-3 pb-4">
          <legend className="pb-2.5 text-[15px] font-bold">{t.checkout.contact}</legend>
          <Field id="checkout-name" label={t.checkout.name} autoComplete="name" value={contact.name} onChange={set("name")} error={fieldError("name")} />
          <Field id="checkout-email" label={t.checkout.email} type="email" autoComplete="email" inputMode="email" value={contact.email} onChange={set("email")} hint={t.checkout.emailHint} error={fieldError("email")} />
          <Field id="checkout-phone" label={t.checkout.phone} type="tel" autoComplete="tel" value={contact.phone} onChange={set("phone")} hint={t.checkout.phoneHint} />
          {state.mode === "delivery" ? (
            <Field id="checkout-address" label={t.checkout.address} autoComplete="street-address" placeholder={t.checkout.addressPlaceholder} value={contact.address} onChange={set("address")} error={fieldError("address")} />
          ) : null}
        </fieldset>

        <div className="grid gap-2 pb-4">
          <h3 className="text-[15px] font-bold">{t.checkout.time}</h3>
          <p className="text-sm text-muted">{state.slotId && now ? describeSlot(state.slotId, now, lang) : t.checkout.noTime}</p>
          <button
            type="button"
            className={`${button.ghost} ${button.small} justify-self-start`}
            onClick={() => {
              actions.closeDrawer();
              document.getElementById("delivery")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {state.slotId ? t.checkout.changeTime : t.checkout.pickTime}
          </button>
          {error?.field === "slot" || error?.field === "slotGone" ? <span className="text-[13px] font-bold text-bad">{errorText(t, error.field)}</span> : null}
        </div>

        <fieldset className="grid gap-2.5 pb-4">
          <legend className="pb-2.5 text-[15px] font-bold">{t.checkout.payment}</legend>
          <label className={radio}>
            <input type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} className="size-[18px] accent-accent" />
            <CreditCardIcon size={20} />
            <span>{t.checkout.card(state.mode)}<small className="block text-[13px] font-semibold text-muted">{t.checkout.cardNote}</small></span>
          </label>
          <label className={radio}>
            <input type="radio" name="payment" checked={payment === "cash"} onChange={() => setPayment("cash")} className="size-[18px] accent-accent" />
            <MoneyIcon size={20} />
            <span>{t.checkout.cash}<small className="block text-[13px] font-semibold text-muted">{t.checkout.cashNote}</small></span>
          </label>
        </fieldset>

        {error && !["name", "email", "address", "slot", "slotGone"].includes(error.field) ? <p role="alert" className="text-[13px] font-bold text-bad">{errorText(t, error.field)}</p> : null}
      </form>
      <Footer>
        <Summary quote={meta.quote} mode={state.mode} express={state.slotId === "express"} />
        <button type="submit" form="checkout" disabled={pending} className={button.primary}>{pending ? t.checkout.placing : t.checkout.place}</button>
        <button type="button" className={button.ghost} onClick={() => actions.openDrawer("basket")}>{t.checkout.back}</button>
      </Footer>
    </>
  );
}

function ConfirmationView() {
  const { state, actions } = useShop();
  const { t, lang, money, num } = useLang();
  const now = useNow();
  const order = state.lastOrder;
  if (!order) return <EmptyBasket />;
  const when = now ? describeSlot(order.slotId, now, lang) : "";
  return (
    <>
      <div className="grid flex-1 content-start justify-items-center gap-3 px-5 py-10 text-center">
        <span className="grid size-[72px] place-items-center rounded-full bg-good text-surface"><CheckIcon size={36} weight="bold" /></span>
        <h3 className="text-2xl leading-tight font-extrabold">{t.confirm.title(order.id)}</h3>
        <p className="max-w-[34ch] text-muted">{t.confirm.body(order.mode, when, money(order.total), num(order.points))}</p>
        <p className="max-w-[34ch] text-sm text-muted">{t.confirm.emailed(order.email)}</p>
      </div>
      <Footer>
        <button
          type="button"
          className={button.primary}
          onClick={() => {
            actions.closeDrawer();
            document.getElementById("track")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <MapPinIcon size={20} />
          {t.confirm.track}
        </button>
        <button type="button" className={button.ghost} onClick={actions.closeDrawer}>{t.confirm.keep}</button>
      </Footer>
    </>
  );
}

export function CartDrawer() {
  const { state, actions, meta } = useShop();
  const { t } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const view = state.drawer;

  useEffect(() => {
    if (!view) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && actions.closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [view, actions]);

  if (!view) return null;
  const titles = { basket: t.basket.title, checkout: t.basket.checkout, confirmation: t.basket.placed };
  const title = view === "basket" && meta.quote.itemCount ? `${titles.basket} (${meta.quote.itemCount})` : titles[view];

  return (
    <>
      <div aria-hidden className="fixed inset-0 z-40 bg-[rgb(26_19_13/0.5)] backdrop-blur-[2px]" onClick={actions.closeDrawer} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="fixed inset-y-0 right-0 z-41 flex w-[min(440px,100%)] animate-slide-in flex-col bg-surface pt-[env(safe-area-inset-top,0px)] pr-[env(safe-area-inset-right,0px)] pb-[env(safe-area-inset-bottom,0px)] shadow-soft"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-[18px]">
          <h2 id="drawer-title" className="text-xl font-extrabold">{title}</h2>
          <button ref={closeRef} type="button" aria-label={t.basket.close} className={iconButton} onClick={actions.closeDrawer}><XIcon size={20} /></button>
        </div>
        {view === "basket" ? <BasketView /> : view === "checkout" ? <CheckoutView /> : <ConfirmationView />}
      </aside>
    </>
  );
}
