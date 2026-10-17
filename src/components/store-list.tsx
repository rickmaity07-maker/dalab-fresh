"use client";

import { ClockIcon, MapPinIcon, StorefrontIcon } from "@phosphor-icons/react";
import { useLang } from "./providers/lang-provider";
import { useShop } from "./providers/shop-provider";
import { useToast } from "./providers/toast-provider";
import { button, sectionTitle } from "./ui";

export function StoreList() {
  const { state, actions, meta } = useShop();
  const { t, pick } = useLang();
  const toast = useToast();

  return (
    <section id="stores" aria-labelledby="stores-title" className="scroll-mt-24">
      <h2 id="stores-title" className={sectionTitle}>{t.stores.title}</h2>
      <p className="mt-1.5 mb-4 max-w-[56ch] text-muted">{t.stores.lead}</p>
      <ul className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {meta.stores.map((s) => {
          const mine = s.id === state.storeId;
          return (
            <li key={s.id} className={`flex flex-col gap-1 rounded-panel bg-surface p-4 shadow-soft ${mine ? "ring-2 ring-ink" : ""}`}>
              <p className="text-xs font-semibold text-muted">{s.city}</p>
              <h3 className="text-[16px] font-bold">{s.name}</h3>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted"><MapPinIcon size={16} className="shrink-0" />{s.area}</p>
              <p className="flex items-center gap-2 text-sm text-muted"><ClockIcon size={16} className="shrink-0" />{pick(s.hours)}</p>
              <div className="mt-auto pt-3">
                {mine ? (
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-[10px] bg-gold-soft px-3 text-sm font-semibold"><StorefrontIcon size={17} weight="fill" className="text-gold-text" />{t.stores.yours}</span>
                ) : (
                  <button
                    type="button"
                    className={`${button.ghost} ${button.small}`}
                    onClick={() => {
                      actions.setStore(s.id);
                      toast(t.stores.changed(s.name), <StorefrontIcon size={20} />);
                    }}
                  >
                    {t.stores.set}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
