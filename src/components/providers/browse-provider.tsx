"use client";

import { createContext, use, useEffect, useMemo, useState } from "react";
import type { CategoryId } from "@/lib/types";

export type SortKey = "popular" | "price-low" | "price-high" | "saving";
type Scope = { kind: "all" } | { kind: "category"; id: CategoryId } | { kind: "saved" };

type BrowseContextValue = {
  state: { scope: Scope; query: string; sort: SortKey; offersOnly: boolean };
  actions: {
    setScope: (scope: Scope) => void;
    setQuery: (q: string) => void;
    setSort: (s: SortKey) => void;
    setOffersOnly: (v: boolean) => void;
    reset: () => void;
  };
};

const BrowseContext = createContext<BrowseContextValue | null>(null);

// Kept apart from the basket so typing a search doesn't re-render basket consumers, and vice versa.
export function BrowseProvider({ children }: { children: React.ReactNode }) {
  const [scope, setScope] = useState<Scope>({ kind: "all" });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [offersOnly, setOffersOnly] = useState(false);

  // The installed app's "Angebote" shortcut opens /?aisle=offers.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable in the browser
    if (new URLSearchParams(window.location.search).get("aisle") === "offers") setOffersOnly(true);
  }, []);

  const value = useMemo<BrowseContextValue>(
    () => ({
      state: { scope, query, sort, offersOnly },
      actions: {
        setScope,
        setQuery,
        setSort,
        setOffersOnly,
        reset: () => {
          setScope({ kind: "all" });
          setQuery("");
          setOffersOnly(false);
        },
      },
    }),
    [scope, query, sort, offersOnly],
  );

  return <BrowseContext value={value}>{children}</BrowseContext>;
}

export function useBrowse() {
  const ctx = use(BrowseContext);
  if (!ctx) throw new Error("useBrowse must be used inside <BrowseProvider>");
  return ctx;
}
