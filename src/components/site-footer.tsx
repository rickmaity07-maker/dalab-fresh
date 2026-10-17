"use client";

import { BrandMark } from "./brand-mark";
import { useLang } from "./providers/lang-provider";
import { LanguageSwitch } from "./site-header";

export function SiteFooter() {
  const { t } = useLang();
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
                <li key={href}><a href={href} className="transition-colors hover:text-[#e3b23c]">{label}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
