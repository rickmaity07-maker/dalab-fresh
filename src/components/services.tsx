"use client";

import { CheckIcon, ClockIcon, StorefrontIcon, TruckIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { describeSlot, formatDay } from "@/lib/i18n";
import { DELIVERY_FEE, EXPRESS_FEE, FREE_DELIVERY_OVER } from "@/lib/pricing";
import { hourRange, listDays, listSlots } from "@/lib/slots";
import type { FulfilmentMode, OrderStatus } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { Star } from "./brand-mark";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";
import { useToast } from "./providers/toast-provider";
import { button, input, panel, sectionTitle } from "./ui";

const SAMPLE_ID = "DF-48213";

function SlotPicker() {
  const { state, actions, meta } = useShop();
  const { t, lang, money } = useLang();
  const toast = useToast();
  const now = useNow();
  const [day, setDay] = useState(0);
  const feeNote = meta.quote.subtotal >= FREE_DELIVERY_OVER ? t.services.freeDelivery : money(DELIVERY_FEE);
  const modes: { id: FulfilmentMode; label: string; icon: React.ReactNode }[] = [
    { id: "delivery", label: t.services.delivery, icon: <TruckIcon size={20} /> },
    { id: "collect", label: t.services.collect, icon: <StorefrontIcon size={20} /> },
  ];

  return (
    <div className={`${panel} xl:row-span-2`}>
      <h3 className="text-lg font-extrabold">{t.services.pickTime}</h3>
      <p className="mt-1.5 max-w-[60ch] text-[15px] text-muted">{t.services.pickTimeLead(money(FREE_DELIVERY_OVER))}</p>

      <div role="group" aria-label={t.services.modeGroup} className="mt-4 inline-flex flex-wrap rounded-[12px] bg-bg p-1">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={state.mode === m.id}
            onClick={() => actions.setMode(m.id)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-[9px] px-4 font-semibold transition-colors duration-200 ${state.mode === m.id ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink"}`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {now ? (
        <>
          <div className="-mx-1 mt-[18px] flex gap-2 overflow-x-auto px-1 pb-1">
            {listDays(now).map((d) => (
              <button
                key={d.key}
                type="button"
                aria-pressed={day === d.index}
                onClick={() => setDay(d.index)}
                className={`min-w-[96px] rounded-tile border px-3.5 py-2.5 text-left transition-colors duration-200 ${day === d.index ? "border-ink bg-gold-soft" : "border-line hover:border-ink"} ${d.sunday ? "opacity-60" : ""}`}
              >
                <small className="block text-xs font-bold text-muted">
                  {d.index === 0 ? t.services.today : d.index === 1 ? t.services.tomorrow : formatDay(d.utc, lang, { weekday: "short" })}
                </small>
                <b className="text-[15px]">{formatDay(d.utc, lang, { day: "numeric", month: "short" })}</b>
              </button>
            ))}
          </div>
          <div className="mt-3.5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            {listSlots(now, day, state.mode).map((s) => {
              const picked = state.slotId === s.id;
              const disabled = s.status !== "open";
              const note = s.status !== "open" ? t.services.status[s.status] : s.express ? money(EXPRESS_FEE) : state.mode === "collect" ? t.services.free : feeNote;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={disabled}
                  aria-pressed={picked}
                  onClick={() => {
                    actions.setSlot(s.id);
                    toast(t.services.timeSaved(describeSlot(s.id, now, lang)), <ClockIcon size={20} />);
                  }}
                  className={`flex flex-col gap-0.5 rounded-tile border px-3.5 py-3 text-left font-semibold tabular-nums transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${s.express ? "border-dashed" : ""} ${picked ? "border-ink bg-ink text-bg" : "border-line hover:enabled:border-[color-mix(in_oklab,var(--accent)_50%,var(--line))]"}`}
                >
                  <span className={s.status === "past" ? "line-through" : ""}>{s.express ? t.services.express : hourRange(s.start, s.end)}</span>
                  <small className={`text-xs font-semibold ${picked ? "opacity-85" : "text-muted"}`}>{note}</small>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div aria-hidden className="mt-[18px] grid gap-2">
          <div className="h-[60px] animate-pulse rounded-tile bg-surface-2" />
          <div className="h-[120px] animate-pulse rounded-tile bg-surface-2" />
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <ClockIcon size={18} />
        {state.slotId && now ? t.services.selected(describeSlot(state.slotId, now, lang)) : t.services.noSlot}
      </p>
    </div>
  );
}

function PointsCard() {
  const { meta } = useShop();
  const { t, num } = useLang();
  return (
    <div className="relative min-w-0 overflow-hidden rounded-panel bg-[#141414] text-white shadow-soft">
      <div className="relative p-5">
        <Star className="absolute -top-4 -right-8 size-[160px] text-[#e3b23c]/15" />
        <h3 className="text-lg font-extrabold">{t.points.title}</h3>
        <p className="mt-1.5 max-w-[34ch] text-[14px] text-[#d6d3cb]">{t.points.lead}</p>
        <div className="mt-5 text-[48px] leading-none font-extrabold text-[#e3b23c] tabular-nums">{num(1284)}</div>
        <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm">
          <span className="text-[#a8a59d]">{t.points.sample}</span>
          <span className="font-semibold">{t.points.earns(num(meta.quote.points))}</span>
        </div>
      </div>
    </div>
  );
}

function TrackOrder({ initialId = "" }: { initialId?: string }) {
  const { t, lang } = useLang();
  const now = useNow();
  const [orderId, setOrderId] = useState(initialId);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<{ field: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function track(e: React.FormEvent) {
    e.preventDefault();
    const id = orderId.trim().toUpperCase();
    if (!id) {
      setError({ field: "empty", id });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (res.ok) {
        setStatus(data as OrderStatus);
        setError(null);
      } else {
        setStatus(null);
        setError({ field: data.field === "notFound" ? "notFound" : "network", id });
      }
    } catch {
      setError({ field: "network", id });
    } finally {
      setLoading(false);
    }
  }

  const errorText = error ? (error.field === "empty" ? t.track.enterId(SAMPLE_ID) : error.field === "notFound" ? t.track.notFound(error.id) : t.errors.network) : null;
  const steps = status?.mode === "collect" ? [t.track.steps[0], t.track.steps[1], ...t.track.collectSteps] : t.track.steps;
  const when = status && !status.sample && now ? describeSlot(status.slotId, now, lang) : null;

  return (
    <div id="track" className={panel}>
      <h3 className="text-lg font-extrabold">{t.track.title}</h3>
      <p className="mt-1.5 text-[15px] text-muted">{t.track.lead}</p>
      <form onSubmit={track} noValidate className="mt-4 flex flex-wrap gap-2">
        <div className="grid min-w-40 flex-1 gap-1.5">
          <label htmlFor="order-id" className="text-[13px] font-bold">{t.track.label}</label>
          <input id="order-id" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder={SAMPLE_ID} autoComplete="off" aria-invalid={Boolean(error)} className={input} />
          {errorText ? (
            <span className="text-[13px] font-bold text-bad">{errorText}</span>
          ) : (
            <span className="text-xs text-muted">{status?.sample ? t.track.sample : when ? t.track.arriving(when) : t.track.hint(SAMPLE_ID)}</span>
          )}
        </div>
        <button type="submit" disabled={loading} className={`${button.ghost} mt-[26px] self-start`}>{loading ? t.track.checking : t.track.button}</button>
      </form>

      {status ? (
        <ol className="mt-[18px] grid">
          {steps.map(([title, sub], i) => {
            const done = i < status.stage;
            const current = i === status.stage;
            return (
              <li key={title} className="relative grid grid-cols-[28px_1fr] gap-3 pb-3.5">
                {i < steps.length - 1 ? <span aria-hidden className={`absolute top-7 bottom-0 left-[13px] w-0.5 ${done ? "bg-good" : "bg-line"}`} /> : null}
                <span className={`grid size-7 place-items-center rounded-full border-2 text-xs font-bold ${done ? "border-good bg-good text-surface" : current ? "border-ink bg-surface text-ink" : "border-line bg-surface text-muted"}`}>
                  {done ? <CheckIcon size={14} weight="bold" /> : i + 1}
                </span>
                <div>
                  <b className="block text-[15px]">{title}</b>
                  <small className="text-[13px] text-muted">{current ? sub : done ? t.track.done : ""}</small>
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}

export function Services() {
  const { state } = useShop();
  const { t } = useLang();
  return (
    <section id="delivery" aria-labelledby="delivery-title" className="scroll-mt-24">
      <h2 id="delivery-title" className={sectionTitle}>{t.services.title}</h2>
      <p className="mt-1.5 mb-4 max-w-[56ch] text-muted">{t.services.lead}</p>
      <div className="grid gap-3 xl:grid-cols-[1.5fr_1fr]">
        <SlotPicker />
        <PointsCard />
        {/* Re-mount with the new order number after checkout so it's prefilled. */}
        <TrackOrder key={state.lastOrder?.id ?? "none"} initialId={state.lastOrder?.id} />
      </div>
    </section>
  );
}
