import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });

// Absolute base for share images: NEXT_PUBLIC_SITE_URL if set, else the Vercel production domain.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dalab Fresh: Somalischer Supermarkt",
  description:
    "Somalische und ostafrikanische Lebensmittel in Deutschland: Canjeero, Halal Fleisch, Xawaash und mehr. Lieferung am selben Tag oder Abholung in Frankfurt, Köln, München und Hamburg.",
  applicationName: "Dalab Fresh",
  appleWebApp: { capable: true, title: "Dalab Fresh", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    title: "Dalab Fresh",
    description: "Somali groceries in Germany. Raashin Soomaaliyeed oo Jarmalka ah.",
    locale: "de_DE",
    alternateLocale: ["en_GB", "so_SO"],
    type: "website",
    images: [{ url: "/photos/mat-spices.jpg", alt: "Spices in woven bowls on a Somali mat" }],
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-dvh bg-bg font-sans text-[15px] leading-relaxed text-ink">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
