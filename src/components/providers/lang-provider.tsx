"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, DICTS, type Dict, isLang } from "@/lib/i18n";
import { formatEur, formatNumber } from "@/lib/pricing";
import type { L10n, Lang } from "@/lib/types";

type LangContextValue = {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
  money: (cents: number) => string;
  num: (n: number) => string;
  pick: (text: L10n) => string;
};

const LangContext = createContext<LangContextValue | null>(null);
const KEY = "dalab:lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (isLang(saved)) return saved;
  } catch {}
  const browser = navigator.language.slice(0, 2);
  return isLang(browser) ? browser : DEFAULT_LANG;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  // German on the server and the first client render, then the visitor's saved or browser language.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only value, read once after hydration
    setLangState(initialLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try { localStorage.setItem(KEY, next); } catch {}
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      t: DICTS[lang],
      setLang,
      money: (c) => formatEur(c, lang),
      num: (n) => formatNumber(n, lang),
      pick: (text) => text[lang] ?? text.de,
    }),
    [lang, setLang],
  );

  return <LangContext value={value}>{children}</LangContext>;
}

export function useLang() {
  const ctx = use(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
