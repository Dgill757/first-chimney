# First Chimney Contracting: Website

Production: https://www.firstchimneycontracting.com (Vercel project `first-chimney`, auto-deploys from `main`).

Vite + React 19 + TypeScript + Tailwind v4 + Motion. One Vercel function (`api/lead.ts`) delivers every form to Andrew's GoHighLevel sub-account. A post-build script prerenders every route to static HTML for SEO, social previews and AI crawlers.

## Commands

```bash
npm ci            # or pnpm install (Vercel uses pnpm-lock.yaml)
npm run dev       # http://localhost:3000 (forms need the Vercel function; see below)
npm run build     # vite build + scripts/prerender.ts
npm test          # API tests (node:test, mocked CRM)
npm run typecheck # strict TypeScript
```

## Where things live

| Change | File |
| --- | --- |
| Phone, email, states, credential wording | `src/lib/site.ts` |
| Holiday offer (price, wording, end date, on/off) | `src/lib/promo.ts` |
| Services content | `src/data/services.ts` |
| States and (future) city pages | `src/data/serviceAreas.ts`, see `docs/SERVICE-AREAS.md` |
| Blog articles | `src/data/blog.ts` (sources in `src/data/sources.ts`) |
| FAQs, real projects, real reviews | `src/data/content.ts` |
| Fireplace designer options | `src/data/designer.ts` |
| Fireplace shop catalog | `src/data/shop.ts` |
| Titles, meta, JSON-LD, sitemap, llms.txt | `src/lib/routes.ts` (single registry) |
| Lead API → GoHighLevel | `api/lead.ts`, setup in `docs/CRM-SETUP.md` |
| Holiday social images | `marketing/holiday-2026/` (`render.sh` regenerates) |
| Merch, magnets, cards, invoice | `marketing/brand-kit/` |

## Environment variables (Vercel)

`GHL_WEBHOOK_URL` and/or `GHL_PRIVATE_TOKEN` + `GHL_LOCATION_ID`. Optional `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID`. Without them the forms show an honest "please call or text" message.

## Content rules

No fabricated reviews, projects, credentials, cities or offer terms. Stock photos are illustrative only and never captioned as First Chimney work.
