import { cacheLife } from "next/cache";
import { AisleNav, AisleTiles } from "@/components/aisle-nav";
import { BasketPanel } from "@/components/basket-panel";
import { CartDrawer } from "@/components/cart-drawer";
import { Catalog } from "@/components/catalog";
import { HomeFavourites } from "@/components/home-favourites";
import { MobileBar } from "@/components/mobile-bar";
import { Offers } from "@/components/offers";
import { BrowseProvider } from "@/components/providers/browse-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import { ShopProvider } from "@/components/providers/shop-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmartList } from "@/components/smart-list";
import { StoreList } from "@/components/store-list";
import { getCatalog } from "@/lib/data";
import { TIME_ZONE } from "@/lib/slots";

// Offers run Friday to Thursday (Berlin time). Returns the coming Thursday as YYYY-MM-DD.
async function offerEnd() {
  "use cache";
  cacheLife("hours");
  const [y, m, d] = new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE }).split("-").map(Number);
  const today = new Date(Date.UTC(y, m - 1, d));
  today.setUTCDate(today.getUTCDate() + ((4 - today.getUTCDay() + 7) % 7 || 7));
  return today.toISOString().slice(0, 10);
}

// One page, two shapes: on desktop aisles | products | basket (three columns);
// on phones and in the installed app the aisles become tiles and the basket a bar above a bottom menu.
export default async function Home() {
  const [catalog, endsOn] = await Promise.all([getCatalog(), offerEnd()]);
  return (
    <LangProvider>
      <ToastProvider>
        <ShopProvider products={catalog.products} categories={catalog.categories} stores={catalog.stores}>
          <BrowseProvider>
            <SiteHeader />
            <div className="gutter mx-auto grid max-w-[1600px] gap-6 pt-4 lg:grid-cols-[212px_minmax(0,1fr)] lg:gap-6 lg:pt-5 xl:grid-cols-[224px_minmax(0,1fr)_330px]">
              <div className="hidden lg:block">
                <AisleNav />
              </div>
              <main className="min-w-0 space-y-8">
                <HomeFavourites />
                <div id="aisles" className="scroll-mt-24 lg:hidden">
                  <AisleTiles />
                </div>
                <div id="list" className="scroll-mt-24 lg:hidden">
                  <SmartList />
                </div>
                <Offers endsOn={endsOn} />
                <Catalog />
                <Services />
                <StoreList />
              </main>
              <div className="hidden xl:block">
                <BasketPanel />
              </div>
            </div>
            <SiteFooter />
            <MobileBar />
            <CartDrawer />
          </BrowseProvider>
        </ShopProvider>
      </ToastProvider>
    </LangProvider>
  );
}
