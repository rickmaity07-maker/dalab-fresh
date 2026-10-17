import { cacheLife } from "next/cache";
import { AisleNav, AisleTiles } from "@/components/aisle-nav";
import { BasketPanel } from "@/components/basket-panel";
import { CartDrawer } from "@/components/cart-drawer";
import { Catalog } from "@/components/catalog";
import { HomeFavourites } from "@/components/home-favourites";
import { ListScreen } from "@/components/list-screen";
import { MobileBar } from "@/components/mobile-bar";
import { Offers } from "@/components/offers";
import { BrowseProvider } from "@/components/providers/browse-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import { NavProvider, Screen } from "@/components/providers/nav-provider";
import { ShopProvider } from "@/components/providers/shop-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
           <NavProvider>
            <a href="#main" className="sr-only z-50 rounded-[10px] bg-ink px-4 py-2.5 font-semibold text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Zum Inhalt springen</a>
            <SiteHeader />
            <div className="gutter mx-auto grid max-w-[1600px] gap-6 pt-4 lg:grid-cols-[212px_minmax(0,1fr)] lg:gap-6 lg:pt-5 xl:grid-cols-[224px_minmax(0,1fr)_330px]">
              <div className="hidden lg:block">
                <AisleNav />
              </div>
              {/* On phones each <Screen> is one tab of the bottom menu; on desktop they stack as one page. */}
              <main id="main" className="min-w-0 space-y-8">
                <Screen tabs={["home"]} className="space-y-8">
                  <HomeFavourites />
                  <Offers endsOn={endsOn} />
                </Screen>
                <Screen tabs={["aisles"]} className="space-y-8">
                  <div id="aisles" className="lg:hidden">
                    <AisleTiles />
                  </div>
                  <Catalog />
                </Screen>
                <Screen tabs={["list"]} className="lg:hidden">
                  <ListScreen />
                </Screen>
                <Screen tabs={["orders"]}>
                  <Services />
                </Screen>
                <Screen tabs={["home"]}>
                  <StoreList />
                </Screen>
              </main>
              <div className="hidden xl:block">
                <BasketPanel />
              </div>
            </div>
            <Screen tabs={["home"]}>
              <SiteFooter />
            </Screen>
            {/* Room for the bottom menu on screens without the footer. */}
            <Screen tabs={["aisles", "list", "orders"]} className="lg:hidden">
              <div aria-hidden className="h-[calc(160px+env(safe-area-inset-bottom,0px))]" />
            </Screen>
            <MobileBar />
            <CartDrawer />
           </NavProvider>
          </BrowseProvider>
        </ShopProvider>
      </ToastProvider>
    </LangProvider>
  );
}
