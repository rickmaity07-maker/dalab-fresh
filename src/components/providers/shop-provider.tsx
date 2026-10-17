"use client";

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { quote } from "@/lib/pricing";
import type { Category, FulfilmentMode, OrderRequest, Product, Quote, Store } from "@/lib/types";

type DrawerView = "basket" | "checkout" | "confirmation";
export type PlacedOrder = { id: string; slotId: string; mode: FulfilmentMode; points: number; total: number; email: string };
/** `field` names the input to flag and the translated message to show (see DICTS[lang].errors). */
export type OrderError = { field: string };
export type OrderDetails = Pick<OrderRequest, "name" | "email" | "phone" | "address" | "payment" | "lang">;

type ShopState = {
  cart: Record<number, number>;
  saved: Set<number>;
  storeId: string;
  mode: FulfilmentMode;
  slotId: string | null;
  drawer: DrawerView | null;
  lastOrder: PlacedOrder | null;
};

type ShopActions = {
  add: (id: number, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  addMany: (lines: { id: number; qty: number }[]) => void;
  toggleSaved: (id: number) => boolean;
  setStore: (id: string) => void;
  setMode: (mode: FulfilmentMode) => void;
  setSlot: (slotId: string | null) => void;
  openDrawer: (view?: DrawerView) => void;
  closeDrawer: () => void;
  placeOrder: (details: OrderDetails) => Promise<OrderError | null>;
};

type ShopMeta = {
  products: Product[];
  categories: Category[];
  productsById: Map<number, Product>;
  stores: Store[];
  quote: Quote;
};

type ShopContextValue = { state: ShopState; actions: ShopActions; meta: ShopMeta };

const ShopContext = createContext<ShopContextValue | null>(null);
// Actions never change identity, so components that only need to act (cards, steppers) can skip state updates.
const ShopActionsContext = createContext<ShopActions | null>(null);

// Versioned key so a future shape change can't crash on old saved data.
const STORAGE_KEY = "dalab:v1";
type Persisted = { cart: Record<number, number>; saved: number[]; storeId: string };

function readPersisted(): Partial<Persisted> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : {};
  } catch {
    return {};
  }
}

export function ShopProvider({ products, categories, stores, children }: { products: Product[]; categories: Category[]; stores: Store[]; children: React.ReactNode }) {
  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [saved, setSaved] = useState<Set<number>>(() => new Set());
  const [storeId, setStoreId] = useState(stores[0].id);
  const [mode, setModeState] = useState<FulfilmentMode>("delivery");
  const [slotId, setSlotId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<DrawerView | null>(null);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  // State, not a ref: saving waits for the render after the restore, so it can never write an empty basket over the saved one.
  const [hydrated, setHydrated] = useState(false);

  // Restore after mount so the server render and first client render match.
  useEffect(() => {
    const p = readPersisted();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is browser-only, so it's read once after hydration
    if (p.cart) setCart(Object.fromEntries(Object.entries(p.cart).filter(([id]) => productsById.has(Number(id)))));
    if (p.saved) setSaved(new Set(p.saved.filter((id) => productsById.has(id))));
    if (p.storeId && stores.some((s) => s.id === p.storeId)) setStoreId(p.storeId);
    setHydrated(true);
  }, [productsById, stores]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, saved: [...saved], storeId } satisfies Persisted));
    } catch {}
  }, [hydrated, cart, saved, storeId]);

  const setQty = useCallback((id: number, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      const q = Math.max(0, Math.min(99, Math.round(qty)));
      if (q) next[id] = q;
      else delete next[id];
      return next;
    });
  }, []);

  const add = useCallback((id: number, qty = 1) => setCart((c) => ({ ...c, [id]: Math.min(99, (c[id] ?? 0) + qty) })), []);

  const addMany = useCallback((lines: { id: number; qty: number }[]) => {
    setCart((c) => {
      const next = { ...c };
      for (const { id, qty } of lines) next[id] = Math.min(99, (next[id] ?? 0) + qty);
      return next;
    });
  }, []);

  const savedRef = useRef(saved);
  useEffect(() => {
    savedRef.current = saved;
  }, [saved]);
  const toggleSaved = useCallback((id: number) => {
    const willSave = !savedRef.current.has(id);
    setSaved((s) => {
      const next = new Set(s);
      if (willSave) next.add(id);
      else next.delete(id);
      return next;
    });
    return willSave;
  }, []);

  const setMode = useCallback((m: FulfilmentMode) => {
    setModeState(m);
    setSlotId((s) => (m === "collect" && s === "express" ? null : s));
  }, []);

  const lines = useMemo(
    () => Object.entries(cart).flatMap(([id, qty]) => {
      const product = productsById.get(Number(id));
      return product ? [{ product, qty }] : [];
    }),
    [cart, productsById],
  );
  const q = useMemo(() => quote(lines, mode, slotId), [lines, mode, slotId]);

  // Read the latest checkout inputs at submit time without re-creating the callback.
  const orderInputs = useRef({ cart, mode, slotId, storeId });
  useEffect(() => {
    orderInputs.current = { cart, mode, slotId, storeId };
  }, [cart, mode, slotId, storeId]);

  const placeOrder = useCallback(async (details: OrderDetails): Promise<OrderError | null> => {
    const { cart: c, mode: m, slotId: s, storeId: st } = orderInputs.current;
    if (!s) return { field: "slot" };
    const body: OrderRequest = {
      items: Object.entries(c).map(([id, qty]) => ({ id: Number(id), qty })),
      mode: m,
      slotId: s,
      storeId: st,
      ...details,
    };
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) return { field: typeof data?.field === "string" ? data.field : "form" };
      setLastOrder(data as PlacedOrder);
      setCart({});
      setSlotId(null);
      setDrawer("confirmation");
      return null;
    } catch {
      return { field: "network" };
    }
  }, []);

  const actions = useMemo<ShopActions>(
    () => ({
      add, setQty, addMany, toggleSaved, setMode, placeOrder,
      setStore: setStoreId,
      setSlot: setSlotId,
      openDrawer: (view = "basket") => setDrawer(view),
      closeDrawer: () => setDrawer(null),
    }),
    [add, setQty, addMany, toggleSaved, setMode, placeOrder],
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      state: { cart, saved, storeId, mode, slotId, drawer, lastOrder },
      actions,
      meta: { products, categories, productsById, stores, quote: q },
    }),
    [cart, saved, storeId, mode, slotId, drawer, lastOrder, actions, products, categories, productsById, stores, q],
  );

  return (
    <ShopActionsContext value={actions}>
      <ShopContext value={value}>{children}</ShopContext>
    </ShopActionsContext>
  );
}

export function useShop() {
  const ctx = use(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

export function useShopActions() {
  const ctx = use(ShopActionsContext);
  if (!ctx) throw new Error("useShopActions must be used inside <ShopProvider>");
  return ctx;
}
