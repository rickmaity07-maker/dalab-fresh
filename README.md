# Dalab Fresh

Online shop for a Somali grocery store in Germany. German, English and Somali; prices in euros;
same-day delivery or click and collect from branches in Frankfurt, Köln, München and Hamburg.

Built with Next.js 16 (App Router, Cache Components), Tailwind CSS 4, Neon Postgres, Nodemailer and Cloudinary.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in what you have
npm run dev
```

Everything works without keys: products come from `src/lib/catalog.ts`, orders are written to
`data/orders.json`, emails go to a throwaway Ethereal inbox (the preview link is printed in the terminal)
and products show illustrated tiles instead of photos.

## Connect the services

| Service | Keys in `.env.local` | Then run |
| --- | --- | --- |
| Neon (database) | `DATABASE_URL` | `npm run db:setup` creates the tables and loads the catalogue |
| SMTP, e.g. Brevo (email) | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `STORE_EMAIL` | restart the dev server |
| Cloudinary (photos) | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | put photos in `product-photos/<product id>.jpg`, then `npm run images:upload` |

After changing prices or products in Neon, refresh the cached catalogue:

```bash
curl -X POST http://localhost:3000/api/revalidate -H "Authorization: Bearer $REVALIDATE_SECRET"
```

## Where things live

- `src/lib/i18n.ts`: all interface text in German, English and Somali
- `src/lib/catalog.ts`: seed products, categories and stores (names in all three languages)
- `src/lib/schema.sql`: database tables
- `src/app/api/orders`: checkout, validation and confirmation emails
- `src/app/globals.css`: colours and the woven-mat patterns

## Photos

Bundled photos in `public/photos` come from [Unsplash](https://unsplash.com/license) (free for commercial use, no attribution required).
The hero and woven-mat photos show a Somali culture fair ("Dhaqan Goob").
Replace them with your own shop photography when you have it: keep the file names, or change the paths in `src/lib/catalog.ts`.

## The app

The site is also an installable app (a PWA), built from the same code:

- **Android (Chrome):** open the site, then menu > "App installieren" / "Install app".
- **iPhone (Safari):** Share > "Zum Home-Bildschirm" / "Add to Home Screen".

It opens full screen with the Dalab Fresh icon, uses the phone layout with the bottom menu, and starts
even without internet (the last shop page is cached by `public/sw.js`). Installing needs HTTPS, so it works
once the site is deployed (and on `localhost` for testing). The service worker only runs in production builds.

Files: `src/app/manifest.ts` (name, colours, icons, shortcuts), `public/icons/` (home-screen icons),
`public/sw.js` (offline cache), `src/components/service-worker.tsx` (registration).
