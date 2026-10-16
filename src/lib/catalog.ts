import type { Category, Product, Store } from "./types";

// Sample catalogue. Replace with a database or POS feed; the API routes and UI only depend on these shapes.

export const CATEGORIES: Category[] = [
  { id: "fruit", name: "Fruit and veg", icon: "fruit" },
  { id: "dairy", name: "Dairy and eggs", icon: "milk" },
  { id: "bakery", name: "Bakery", icon: "bread" },
  { id: "meat", name: "Meat and seafood", icon: "beef" },
  { id: "pantry", name: "Pantry", icon: "grains" },
  { id: "drinks", name: "Drinks", icon: "soda" },
  { id: "snacks", name: "Snacks", icon: "cookie" },
  { id: "home", name: "Household", icon: "spray" },
  { id: "baby", name: "Baby", icon: "baby" },
];

export const PRODUCTS: Product[] = [
  { id: 1, name: "Bananas", size: "1 kg", price: 525, category: "fruit", icon: "fruit", hue: 48, keywords: ["banana"] },
  { id: 2, name: "Royal Gala apples", size: "1 kg", price: 895, was: 1050, category: "fruit", icon: "fruit", hue: 2, keywords: ["apple"] },
  { id: 3, name: "Oranges", size: "1 kg", price: 475, category: "fruit", icon: "citrus", hue: 28, keywords: ["orange"] },
  { id: 4, name: "Red grapes", size: "500 g", price: 950, category: "fruit", icon: "cherries", hue: 290, keywords: ["grape"] },
  { id: 5, name: "Carrots", size: "1 kg", price: 395, category: "fruit", icon: "carrot", hue: 22, keywords: ["carrot"] },
  { id: 6, name: "Iceberg lettuce", size: "1 piece", price: 425, category: "fruit", icon: "leaf", hue: 110, keywords: ["lettuce", "salad"] },
  { id: 7, name: "Cherries", size: "250 g", price: 1800, was: 2200, category: "fruit", icon: "cherries", hue: 350, keywords: ["cherr"] },
  { id: 8, name: "Lemons", size: "500 g", price: 450, category: "fruit", icon: "citrus", hue: 56, keywords: ["lemon"] },
  { id: 9, name: "Fresh milk, full fat", size: "2 L", price: 1150, category: "dairy", icon: "milk", hue: 210, keywords: ["milk"] },
  { id: 10, name: "Large white eggs", size: "30 pieces", price: 2295, was: 2650, category: "dairy", icon: "egg", hue: 40, keywords: ["egg"] },
  { id: 11, name: "Labneh", size: "400 g", price: 975, category: "dairy", icon: "milk", hue: 190, keywords: ["labneh"] },
  { id: 12, name: "Halloumi", size: "225 g", price: 1325, category: "dairy", icon: "cheese", hue: 46, keywords: ["halloumi", "cheese"] },
  { id: 13, name: "Arabic bread", size: "6 pieces", price: 250, category: "bakery", icon: "bread", hue: 36, keywords: ["arabic bread", "khubz", "bread", "pita"] },
  { id: 14, name: "Butter croissants", size: "4 pieces", price: 1200, category: "bakery", icon: "croissant", hue: 34, keywords: ["croissant"] },
  { id: 15, name: "Chocolate cake", size: "500 g", price: 2400, was: 2900, category: "bakery", icon: "cake", hue: 18, keywords: ["cake"] },
  { id: 16, name: "Chicken drumsticks", size: "1 kg", price: 1695, category: "meat", icon: "drumstick", hue: 20, keywords: ["chicken", "drumstick"] },
  { id: 17, name: "Beef mince", size: "500 g", price: 1950, category: "meat", icon: "beef", hue: 356, keywords: ["beef", "mince"] },
  { id: 18, name: "Hammour fillet", size: "500 g", price: 3400, was: 3900, category: "meat", icon: "fish", hue: 196, keywords: ["hammour", "fish"] },
  { id: 19, name: "Tiger prawns", size: "500 g", price: 2975, category: "meat", icon: "shrimp", hue: 14, keywords: ["prawn", "shrimp"] },
  { id: 20, name: "Basmati rice", size: "5 kg", price: 4250, category: "pantry", icon: "grains", hue: 44, keywords: ["rice", "basmati"] },
  { id: 21, name: "Chickpeas", size: "400 g", price: 325, category: "pantry", icon: "bean", hue: 38, keywords: ["chickpea", "hummus"] },
  { id: 22, name: "Extra virgin olive oil", size: "1 L", price: 3200, category: "pantry", icon: "oil", hue: 80, keywords: ["olive oil", "oil"] },
  { id: 23, name: "Arabic coffee", size: "250 g", price: 2150, category: "pantry", icon: "coffee", hue: 26, keywords: ["coffee", "qahwa"] },
  { id: 24, name: "Khalas dates", size: "1 kg", price: 2600, was: 3100, category: "pantry", icon: "date", hue: 24, keywords: ["date"] },
  { id: 25, name: "Drinking water", size: "12 x 1.5 L", price: 1350, was: 1575, category: "drinks", icon: "water", hue: 200, keywords: ["water"] },
  { id: 26, name: "Orange juice", size: "1.75 L", price: 1025, category: "drinks", icon: "citrus", hue: 32, keywords: ["juice"] },
  { id: 27, name: "Cola", size: "6 x 330 ml", price: 1100, category: "drinks", icon: "soda", hue: 0, keywords: ["cola", "soda", "pepsi", "coke"] },
  { id: 28, name: "Green tea", size: "50 bags", price: 925, category: "drinks", icon: "tea", hue: 120, keywords: ["tea"] },
  { id: 29, name: "Butter popcorn", size: "3 bags", price: 650, category: "snacks", icon: "popcorn", hue: 50, keywords: ["popcorn"] },
  { id: 30, name: "Chocolate chip cookies", size: "300 g", price: 825, was: 995, category: "snacks", icon: "cookie", hue: 30, keywords: ["cookie", "biscuit"] },
  { id: 31, name: "Mixed nuts", size: "400 g", price: 2750, category: "snacks", icon: "nuts", hue: 32, keywords: ["nuts", "almond", "cashew"] },
  { id: 32, name: "Milk chocolate bar", size: "100 g", price: 375, category: "snacks", icon: "candy", hue: 330, keywords: ["chocolate"] },
  { id: 33, name: "Dishwashing liquid", size: "1 L", price: 795, category: "home", icon: "spray", hue: 150, keywords: ["dish", "washing up"] },
  { id: 34, name: "Laundry detergent", size: "3 L", price: 2900, was: 3450, category: "home", icon: "laundry", hue: 220, keywords: ["laundry", "detergent"] },
  { id: 35, name: "Diapers, size 4", size: "64 pieces", price: 5900, was: 6800, category: "baby", icon: "baby", hue: 260, keywords: ["diaper", "nappies", "nappy"] },
  { id: 36, name: "Baby wipes", size: "3 x 72", price: 1250, category: "baby", icon: "baby", hue: 180, keywords: ["wipes"] },
];

export const STORES: Store[] = [
  { id: "nahda", name: "Al Nahda", city: "Dubai", area: "Near Al Nahda Park", hours: "Open 7 AM to 2 AM" },
  { id: "qusais", name: "Al Qusais", city: "Dubai", area: "Damascus Street", hours: "Open 24 hours" },
  { id: "muwaileh", name: "Muwaileh", city: "Sharjah", area: "University City Road", hours: "Open 7 AM to 1 AM" },
  { id: "mussafah", name: "Mussafah", city: "Abu Dhabi", area: "Shabiya 10", hours: "Open 24 hours" },
];

export const PRODUCTS_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));
export const STORE_IDS = new Set(STORES.map((s) => s.id));
