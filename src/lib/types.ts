// Prices are stored in fils (1 AED = 100 fils) so totals never drift from float rounding.

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
  | "grid" | "fruit" | "citrus" | "cherries" | "carrot" | "leaf" | "milk" | "egg" | "cheese"
  | "bread" | "croissant" | "cake" | "drumstick" | "beef" | "fish" | "shrimp" | "grains"
  | "bean" | "oil" | "coffee" | "date" | "water" | "soda" | "tea" | "popcorn" | "cookie"
  | "nuts" | "candy" | "spray" | "laundry" | "baby";

export type Category = { id: CategoryId; name: string; icon: IconKey };

export type Product = {
  id: number;
  name: string;
  size: string;
  price: number;
  was?: number;
  category: CategoryId;
  icon: IconKey;
  hue: number;
  keywords: string[];
};

export type Store = { id: string; name: string; city: string; area: string; hours: string };

export type FulfilmentMode = "delivery" | "collect";
export type PaymentMethod = "card" | "cash";

export type CartLine = { id: number; qty: number };

export type OrderRequest = {
  items: CartLine[];
  mode: FulfilmentMode;
  slotId: string;
  storeId: string;
  address?: string;
  payment: PaymentMethod;
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
  slotLabel: string;
  storeId: string;
  address?: string;
  payment: PaymentMethod;
  items: (CartLine & { name: string; price: number })[];
  quote: Quote;
};

export type TrackingStage = 0 | 1 | 2 | 3;
export type OrderStatus = { id: string; slotLabel: string; mode: FulfilmentMode; stage: TrackingStage; sample?: boolean };
