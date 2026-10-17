"use client";

import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import { BrandMark } from "./brand-mark";
import { useLang } from "./providers/lang-provider";
import { useNav } from "./providers/nav-provider";
import { LanguageSwitch } from "./site-header";

export function SiteFooter() {
  const { t } = useLang();
  const nav = useNav();
  const columns = [
    { title: t.footer.shop, links: [[t.footer.links.aisles, "#shop"], [t.footer.links.offers, "#offers"]] },
    { title: t.footer.help, links: [[t.footer.links.delivery, "#delivery"], [t.footer.links.track, "#track"], [t.footer.links.stores, "#stores"]] },
  ];

  return (
    <footer className="mt-10 bg-[#141414] pb-[calc(150px+env(safe-area-inset-bottom,0px))] text-sm text-[#a8a59d] lg:pb-10">
      <div className="gutter mx-auto grid max-w-[1600px] gap-8 pt-10 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2.5 text-[20px] font-extrabold tracking-[-0.02em] text-white">
            <BrandMark /> Dalab <span className="text-[#e3b23c]">Fresh</span>
          </span>
          <p className="mt-3 max-w-[40ch]">{t.brand.tagline}</p>
          <p className="mt-4 max-w-[44ch] text-[#d6d3cb]" lang="so">„Gacmo wada jir bay wax ku gooyaan.“</p>
          <p className="max-w-[44ch]">{t.footer.proverb}</p>
          <LanguageSwitch className="mt-5 inline-flex" />
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-2.5 text-sm font-semibold text-white">{col.title}</h2>
            <ul className="grid gap-1.5">
              {col.links.map(([label, href]) => (
                <li key={href}><a href={href} onClick={(e) => { e.preventDefault(); nav.go(href.slice(1)); }} className="transition-colors hover:text-[#e3b23c]">{label}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="gutter mx-auto mt-10 flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[13px]">
        <nav aria-label={t.footer.legal.imprint} className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/impressum" className="transition-colors hover:text-[#e3b23c]">{t.footer.legal.imprint}</Link>
          <Link href="/datenschutz" className="transition-colors hover:text-[#e3b23c]">{t.footer.legal.privacy}</Link>
          <Link href="/agb" className="transition-colors hover:text-[#e3b23c]">{t.footer.legal.terms}</Link>
        </nav>
        <span className="sm:ml-auto">© 2026 {BUSINESS.legalName}</span>
      </div>
    </footer>
  );
}
