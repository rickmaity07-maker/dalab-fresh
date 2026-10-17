"use client";

import { createContext, use, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

// Phones and the installed app show one screen at a time, switched by the bottom menu, like a native app.
// Desktop keeps the single page and simply scrolls to the section.
export type Tab = "home" | "aisles" | "list" | "orders";
const TABS: Tab[] = ["home", "aisles", "list", "orders"];

// Which screen each section lives on. A tab's own name means "the top of that screen".
const SCREEN_OF: Record<string, Tab> = {
  home: "home", offers: "home", stores: "home",
  aisles: "aisles", shop: "aisles",
  list: "list",
  orders: "orders", delivery: "orders", track: "orders",
};

const isTab = (v: string): v is Tab => (TABS as string[]).includes(v);
const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
const urlFor = (tab: Tab) => `${location.pathname}${location.search}${tab === "home" ? "" : `#/${tab}`}`;

/** Reads "#/aisles" (our screens) or an old-style "#track" section link. */
function fromHash(hash: string): { tab: Tab; target: string } | null {
  const h = hash.replace(/^#\/?/, "");
  if (!h) return null;
  const tab = SCREEN_OF[h];
  return tab ? { tab, target: h } : null;
}

type NavValue = { tab: Tab; go: (target: string) => void };
const NavContext = createContext<NavValue | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("home");
  const tabRef = useRef<Tab>("home");
  const scrollByTab = useRef<Partial<Record<Tab, number>>>({});
  // Where to scroll once the new screen has rendered: a section id, "top", or "restore" (the tab's last position).
  const pending = useRef<string | null>(null);

  const show = useCallback((next: Tab, scroll: string, push: boolean) => {
    if (next === tabRef.current) {
      // Same screen: nothing to swap, just scroll.
      if (scroll === "top") window.scrollTo({ top: 0, behavior: "smooth" });
      else if (scroll !== "restore") document.getElementById(scroll)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    scrollByTab.current[tabRef.current] = window.scrollY;
    tabRef.current = next;
    if (push) history.pushState({ tab: next }, "", urlFor(next));
    pending.current = scroll;
    setTab(next);
  }, []);

  const go = useCallback(
    (target: string) => {
      const screen = SCREEN_OF[target] ?? "home";
      if (isDesktop()) {
        if (target === "home") window.scrollTo({ top: 0, behavior: "smooth" });
        else document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (isTab(target)) {
        // Bottom menu: a new tab returns to where you left it; tapping the current tab jumps to its top.
        show(screen, screen === tabRef.current ? "top" : "restore", true);
      } else {
        show(screen, target, true);
      }
    },
    [show],
  );

  // Open the screen named in the address (shared link, app shortcut), and follow the back/forward buttons.
  useEffect(() => {
    const initial = fromHash(location.hash);
    if (initial && !isDesktop()) {
      history.replaceState({ tab: initial.tab }, "", urlFor(initial.tab));
      show(initial.tab, isTab(initial.target) ? "top" : initial.target, false);
    }
    const onPop = () => {
      const found = fromHash(location.hash);
      show(found?.tab ?? "home", "restore", false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [show]);

  // Scroll after the screen swap has been painted into the DOM, before the browser shows it.
  useLayoutEffect(() => {
    const where = pending.current;
    if (!where) return;
    pending.current = null;
    if (where === "top") window.scrollTo({ top: 0, behavior: "instant" });
    else if (where === "restore") window.scrollTo({ top: scrollByTab.current[tab] ?? 0, behavior: "instant" });
    else document.getElementById(where)?.scrollIntoView({ behavior: "instant", block: "start" });
  });

  const value = useMemo(() => ({ tab, go }), [tab, go]);
  return <NavContext value={value}>{children}</NavContext>;
}

export function useNav() {
  const ctx = use(NavContext);
  if (!ctx) throw new Error("useNav must be used inside <NavProvider>");
  return ctx;
}

/** Content for some screens. On phones it's hidden on the other screens; on desktop it's always shown. */
export function Screen({ tabs, className = "", children }: { tabs: Tab[]; className?: string; children: React.ReactNode }) {
  const { tab } = useNav();
  const on = tabs.includes(tab);
  return <div className={`${on ? "max-lg:animate-screen-in" : "max-lg:hidden"} ${className}`}>{children}</div>;
}
