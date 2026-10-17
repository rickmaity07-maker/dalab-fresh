"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { useLang } from "./providers/lang-provider";

// A swipeable row of cards. Touch users swipe; mouse users get round arrow buttons on wide screens.
export function ScrollRow({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const by = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const arrow = "absolute top-[38%] z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-lift transition-transform hover:scale-105 md:grid";

  return (
    <div className="relative">
      <div ref={ref} role="list" aria-label={label} className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-6 sm:mx-0 sm:scroll-px-0 sm:px-0">
        {children}
      </div>
      <button type="button" aria-label={t.nav.prev} className={`${arrow} -left-3`} onClick={() => by(-1)}><CaretLeftIcon size={18} weight="bold" /></button>
      <button type="button" aria-label={t.nav.next} className={`${arrow} -right-3`} onClick={() => by(1)}><CaretRightIcon size={18} weight="bold" /></button>
    </div>
  );
}

export function ScrollItem({ children }: { children: React.ReactNode }) {
  return <div role="listitem" className="w-[172px] shrink-0 snap-start sm:w-[188px]">{children}</div>;
}
