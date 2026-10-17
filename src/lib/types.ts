// Prices are stored in cents (1 EUR = 100 cents) so totals never drift from float rounding.

export type Lang = "de" | "en" | "so";
/** A piece of text in every supported language. */
export type L10n = Record<Lang, string>;

export type CategoryId =
  | "fruit"
  | "dairy"
  | "bakery"
  | "meat"
  | "pantry"
  | "drinks"
  | "snacks"
  | "home"
  | "baby";

export type IconKey =
  | "grid" | "fruit" | "mango" | "citrus" | "tomato" | "onion" | "leaf" | "chilli" | "milk" | "egg"
  | "jar" | "flatbread" | "pastry" | "meat" | "drumstick" | "fish" | "grains" | "pasta" | "spice"
  | "bean" | "oil" | "date" | "tea" | "juice" | "water" | "sweet" | "cookie" | "nuts"
  | "soap" | "laundry" | "incense" | "baby";

export type Category = { id: CategoryId; name: L10n; icon: IconKey; photo?: string };

export type Product = {
  id: number;
  name: L10n;
  size: L10n;
  price: number;
  was?: number;
  category: CategoryId;
  icon: IconKey;
  hue: number;
  keywords: string[];
  /** Shown in the "Taste of home" row. */
  homeFavourite?: boolean;
  /** Bundled photo in /public, used until a Cloudinary image is uploaded. */
  photo?: string;
  /** Cloudinary public id, e.g. "dalab/products/canjeero". */
  image?: string;
};

export type Store = { id: string; name: string; city: string; area: string; hours: L10n };

export type FulfilmentMode = "delivery" | "collect";
export type PaymentMethod = "card" | "cash";

export type CartLine = { id: number; qty: number };

export type OrderRequest = {
  items: CartLine[];
  mode: FulfilmentMode;
  slotId: string;
  storeId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  payment: PaymentMethod;
  lang: Lang;
};

export type Quote = {
  subtotal: number;
  savings: number;
  fee: number;
  total: number;
  points: number;
  itemCount: number;
};

export type Order = {
  id: string;
  placedAt: string;
  mode: FulfilmentMode;
  slotId: string;
  storeId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  payment: PaymentMethod;
  lang: Lang;
  items: (CartLine & { name: string; price: number })[];
  quote: Quote;
  /** Progress set by staff on /admin; missing on file orders saved before it existed. */
  stage?: TrackingStage;
};

export type TrackingStage = 0 | 1 | 2 | 3;
export type OrderStatus = { id: string; slotId: string; mode: FulfilmentMode; stage: TrackingStage; sample?: boolean };
