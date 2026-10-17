import type { Category, L10n, Product, Store } from "./types";

// Seed catalogue. `npm run db:setup` copies it into Neon; after that the site reads from the database.
const l = (de: string, en: string, so: string): L10n => ({ de, en, so });

export const CATEGORIES: Category[] = [
  { id: "fruit", name: l("Obst & Gemüse", "Fruit & veg", "Khudaar & miro"), icon: "mango", photo: "/photos/cat-fruit.jpg" },
  { id: "dairy", name: l("Milch & Eier", "Dairy & eggs", "Caano & ukun"), icon: "milk", photo: "/photos/cat-dairy.jpg" },
  { id: "bakery", name: l("Brot & Canjeero", "Bread & canjeero", "Rooti & canjeero"), icon: "flatbread", photo: "/photos/cat-bakery.jpg" },
  { id: "meat", name: l("Halal Fleisch & Fisch", "Halal meat & fish", "Hilib xalaal & kalluun"), icon: "meat", photo: "/photos/cat-meat.jpg" },
  { id: "pantry", name: l("Vorrat & Gewürze", "Pantry & spices", "Raashin & xawaash"), icon: "spice", photo: "/photos/cat-pantry.jpg" },
  { id: "drinks", name: l("Getränke", "Drinks", "Cabitaan"), icon: "juice", photo: "/photos/cat-drinks.jpg" },
  { id: "snacks", name: l("Süßes & Snacks", "Sweets & snacks", "Macmacaan"), icon: "sweet", photo: "/photos/cat-snacks.jpg" },
  { id: "home", name: l("Haushalt", "Household", "Alaabta guriga"), icon: "incense", photo: "/photos/uunsi.jpg" },
  { id: "baby", name: l("Baby", "Baby", "Ilmaha"), icon: "baby" },
];

const kg = l("1 kg", "1 kg", "1 kg");
const g = (n: number) => l(`${n} g`, `${n} g`, `${n} g`);
const pcs = (n: number) => l(`${n} Stück`, `${n} pieces`, `${n} xabbo`);

export const PRODUCTS: Product[] = [
  { id: 1, name: l("Bananen", "Bananas", "Moos"), size: kg, price: 199, category: "fruit", icon: "fruit", hue: 48, keywords: ["banane", "banana", "moos"] },
  { id: 2, name: l("Mangos", "Mangoes", "Cambe"), size: pcs(2), price: 349, was: 449, category: "fruit", icon: "mango", hue: 36, keywords: ["mango", "cambe"], photo: "/photos/mango.jpg" },
  { id: 3, name: l("Papaya", "Papaya", "Babaay"), size: pcs(1), price: 299, category: "fruit", icon: "mango", hue: 22, keywords: ["papaya", "babaay"] },
  { id: 4, name: l("Limetten", "Limes", "Liin dhanaan"), size: g(500), price: 249, category: "fruit", icon: "citrus", hue: 95, keywords: ["limette", "lime", "liin"] },
  { id: 5, name: l("Tomaten", "Tomatoes", "Yaanyo"), size: kg, price: 279, category: "fruit", icon: "tomato", hue: 4, keywords: ["tomate", "tomato", "yaanyo"] },
  { id: 6, name: l("Rote Zwiebeln", "Red onions", "Basal guduud"), size: l("2 kg", "2 kg", "2 kg"), price: 299, category: "fruit", icon: "onion", hue: 330, keywords: ["zwiebel", "onion", "basal"] },
  { id: 7, name: l("Frischer Koriander", "Fresh coriander", "Kabsar"), size: l("1 Bund", "1 bunch", "1 xidhmo"), price: 99, category: "fruit", icon: "leaf", hue: 120, keywords: ["koriander", "coriander", "cilantro", "kabsar"] },
  { id: 8, name: l("Grüne Chilis", "Green chillies", "Basbaas cagaar"), size: g(200), price: 149, category: "fruit", icon: "chilli", hue: 105, keywords: ["chili", "chilli", "basbaas"] },

  { id: 9, name: l("Kamelmilch", "Camel milk", "Caano geel"), size: l("500 ml", "500 ml", "500 ml"), price: 549, was: 649, category: "dairy", icon: "milk", hue: 38, keywords: ["kamelmilch", "camel milk", "caano geel", "geel"], homeFavourite: true, photo: "/photos/camel.jpg" },
  { id: 10, name: l("Frische Vollmilch", "Fresh whole milk", "Caano lo'aad"), size: l("1 L", "1 L", "1 L"), price: 119, category: "dairy", icon: "milk", hue: 210, keywords: ["milch", "milk", "caano"] },
  { id: 11, name: l("Eier, Freiland", "Free-range eggs", "Ukun"), size: pcs(10), price: 299, category: "dairy", icon: "egg", hue: 40, keywords: ["eier", "egg", "ukun"] },
  { id: 12, name: l("Naturjoghurt", "Natural yoghurt", "Caano fadhi"), size: kg, price: 179, category: "dairy", icon: "jar", hue: 200, keywords: ["joghurt", "yoghurt", "yogurt", "fadhi"] },
  { id: 13, name: l("Ghee (Butterschmalz)", "Ghee", "Subag"), size: g(500), price: 799, category: "dairy", icon: "jar", hue: 45, keywords: ["ghee", "butterschmalz", "subag"], homeFavourite: true },

  { id: 14, name: l("Canjeero, frisch", "Fresh canjeero", "Canjeero"), size: pcs(10), price: 399, category: "bakery", icon: "flatbread", hue: 34, keywords: ["canjeero", "anjero", "laxoox", "injera"], homeFavourite: true, photo: "/photos/canjeero.jpg" },
  { id: 15, name: l("Muufo Fladenbrot", "Muufo flatbread", "Muufo"), size: pcs(6), price: 349, category: "bakery", icon: "flatbread", hue: 30, keywords: ["muufo", "fladenbrot", "flatbread", "brot", "bread"] },
  { id: 16, name: l("Sambuusa, tiefgekühlt", "Frozen sambuusa", "Sambuusa"), size: pcs(12), price: 649, was: 749, category: "bakery", icon: "pastry", hue: 28, keywords: ["sambuusa", "sambusa", "samosa"], homeFavourite: true, photo: "/photos/sambuusa.jpg" },
  { id: 17, name: l("Malawax Pfannkuchen", "Malawax pancakes", "Malawax"), size: pcs(8), price: 449, category: "bakery", icon: "flatbread", hue: 42, keywords: ["malawax", "pfannkuchen", "pancake"] },

  { id: 18, name: l("Ziegenfleisch", "Goat meat", "Hilib ari"), size: kg, price: 1499, category: "meat", icon: "meat", hue: 356, keywords: ["ziege", "goat", "hilib ari"], homeFavourite: true },
  { id: 19, name: l("Lammfleisch mit Knochen", "Lamb on the bone", "Hilib ido"), size: kg, price: 1399, was: 1599, category: "meat", icon: "meat", hue: 10, keywords: ["lamm", "lamb", "hilib ido"] },
  { id: 20, name: l("Hähnchenschenkel", "Chicken thighs", "Bawdo digaag"), size: kg, price: 699, category: "meat", icon: "drumstick", hue: 24, keywords: ["hähnchen", "huhn", "chicken", "digaag"] },
  { id: 21, name: l("Rinderhack", "Beef mince", "Hilib lo'aad shiidan"), size: g(500), price: 549, category: "meat", icon: "meat", hue: 0, keywords: ["rinderhack", "hack", "beef", "mince", "lo'aad"] },
  { id: 22, name: l("Oodkac (Trockenfleisch)", "Oodkac dried beef", "Oodkac"), size: g(250), price: 1299, category: "meat", icon: "meat", hue: 14, keywords: ["oodkac", "odkac", "muqmad", "trockenfleisch"], homeFavourite: true },
  { id: 23, name: l("Tilapia, ganz", "Whole tilapia", "Kalluun tilapia"), size: kg, price: 899, category: "meat", icon: "fish", hue: 196, keywords: ["fisch", "fish", "tilapia", "kalluun"] },

  { id: 24, name: l("Basmatireis", "Basmati rice", "Bariis basmati"), size: l("5 kg", "5 kg", "5 kg"), price: 1199, was: 1399, category: "pantry", icon: "grains", hue: 44, keywords: ["reis", "rice", "bariis", "basmati"] },
  { id: 25, name: l("Spaghetti", "Spaghetti", "Baasto"), size: g(500), price: 129, category: "pantry", icon: "pasta", hue: 46, keywords: ["spaghetti", "nudeln", "pasta", "baasto"] },
  { id: 26, name: l("Sorghummehl", "Sorghum flour", "Bur haruur"), size: kg, price: 349, category: "pantry", icon: "grains", hue: 30, keywords: ["sorghum", "haruur", "mehl", "flour", "bur"] },
  { id: 27, name: l("Xawaash Gewürzmischung", "Xawaash spice blend", "Xawaash"), size: g(200), price: 449, category: "pantry", icon: "spice", hue: 18, keywords: ["xawaash", "gewürz", "spice"], homeFavourite: true, photo: "/photos/xawaash.jpg" },
  { id: 28, name: l("Grüner Kardamom", "Green cardamom", "Heyl"), size: g(100), price: 499, category: "pantry", icon: "spice", hue: 90, keywords: ["kardamom", "cardamom", "heyl"] },
  { id: 29, name: l("Rote Linsen", "Red lentils", "Misir"), size: kg, price: 249, category: "pantry", icon: "bean", hue: 16, keywords: ["linsen", "lentil", "misir"] },
  { id: 30, name: l("Medjool Datteln", "Medjool dates", "Timir"), size: kg, price: 899, was: 1099, category: "pantry", icon: "date", hue: 22, keywords: ["datteln", "dattel", "dates", "timir"], photo: "/photos/dates.jpg" },
  { id: 31, name: l("Sesamöl", "Sesame oil", "Saliid macsaro"), size: l("1 L", "1 L", "1 L"), price: 699, category: "pantry", icon: "oil", hue: 52, keywords: ["sesam", "sesamöl", "sesame", "oil", "saliid", "macsaro"] },

  { id: 32, name: l("Schwarzer Tee, lose", "Loose black tea", "Shaah"), size: g(500), price: 399, category: "drinks", icon: "tea", hue: 20, keywords: ["tee", "tea", "shaah"] },
  { id: 33, name: l("Mangosaft", "Mango juice", "Casiir cambe"), size: l("1 L", "1 L", "1 L"), price: 199, category: "drinks", icon: "juice", hue: 38, keywords: ["saft", "juice", "casiir"] },
  { id: 34, name: l("Fruchtsirup", "Fruit cordial", "Sharoobo miro"), size: l("710 ml", "710 ml", "710 ml"), price: 349, category: "drinks", icon: "juice", hue: 320, keywords: ["sirup", "cordial", "sharoobo", "vimto"] },
  { id: 35, name: l("Mineralwasser", "Still water", "Biyo"), size: l("6 x 1,5 L", "6 x 1.5 L", "6 x 1.5 L"), price: 299, was: 349, category: "drinks", icon: "water", hue: 200, keywords: ["wasser", "water", "biyo"] },

  { id: 36, name: l("Xalwo (Halwa)", "Somali xalwo", "Xalwo"), size: g(500), price: 799, category: "snacks", icon: "sweet", hue: 12, keywords: ["xalwo", "halwa", "halva"], homeFavourite: true },
  { id: 37, name: l("Teekekse", "Tea biscuits", "Buskud"), size: g(400), price: 199, category: "snacks", icon: "cookie", hue: 32, keywords: ["kekse", "biscuit", "cookie", "buskud"] },
  { id: 38, name: l("Geröstete Erdnüsse", "Roasted peanuts", "Looska la dubay"), size: g(500), price: 299, was: 349, category: "snacks", icon: "nuts", hue: 30, keywords: ["erdnüsse", "nüsse", "peanut", "nuts", "loos"] },

  { id: 39, name: l("Spülmittel", "Washing-up liquid", "Saabuun weel"), size: l("500 ml", "500 ml", "500 ml"), price: 149, category: "home", icon: "soap", hue: 150, keywords: ["spülmittel", "washing up", "dish", "saabuun"] },
  { id: 40, name: l("Waschmittel", "Laundry detergent", "Saabuunta dharka"), size: l("20 Waschgänge", "20 washes", "20 jeer"), price: 599, was: 749, category: "home", icon: "laundry", hue: 220, keywords: ["waschmittel", "laundry", "detergent", "dhar"] },
  { id: 41, name: l("Uunsi Räucherwerk", "Uunsi incense", "Uunsi"), size: g(100), price: 649, category: "home", icon: "incense", hue: 28, keywords: ["uunsi", "foox", "weihrauch", "incense", "frankincense"], homeFavourite: true, photo: "/photos/uunsi.jpg" },

  { id: 42, name: l("Windeln Größe 4", "Nappies, size 4", "Xafaayad cabbir 4"), size: pcs(44), price: 1199, was: 1399, category: "baby", icon: "baby", hue: 260, keywords: ["windel", "nappy", "nappies", "diaper", "xafaayad"] },
  { id: 43, name: l("Feuchttücher", "Baby wipes", "Masaxaad ilmo"), size: l("3 x 64", "3 x 64", "3 x 64"), price: 349, category: "baby", icon: "baby", hue: 180, keywords: ["feuchttücher", "wipes", "masaxaad"] },
];

const weekdays = l("Mo-Sa 8-21 Uhr", "Mon-Sat 8:00-21:00", "Isniin-Sabti 8:00-21:00");

export const STORES: Store[] = [
  { id: "frankfurt", name: "Frankfurt Gallus", city: "Frankfurt am Main", area: "Mainzer Landstraße 214", hours: weekdays },
  { id: "koeln", name: "Köln Kalk", city: "Köln", area: "Kalker Hauptstraße 88", hours: weekdays },
  { id: "muenchen", name: "München Hasenbergl", city: "München", area: "Dülferstraße 31", hours: l("Mo-Sa 9-20 Uhr", "Mon-Sat 9:00-20:00", "Isniin-Sabti 9:00-20:00") },
  { id: "hamburg", name: "Hamburg St. Georg", city: "Hamburg", area: "Steindamm 47", hours: weekdays },
];
