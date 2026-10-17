import type { MetadataRoute } from "next";

// Makes the site installable ("Add to home screen"): it then opens full screen with its own icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Dalab Fresh: Somalischer Supermarkt",
    short_name: "Dalab Fresh",
    description: "Somalische Lebensmittel bestellen: Lieferung am selben Tag oder Abholung.",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f4f1",
    theme_color: "#ffffff",
    lang: "de",
    categories: ["food", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Angebote", short_name: "Angebote", url: "/?aisle=offers#shop" },
      { name: "Bestellung verfolgen", short_name: "Verfolgen", url: "/#track" },
    ],
  };
}
