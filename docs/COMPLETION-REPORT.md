# First Chimney Contracting: Rebuild Completion Report

Date: November 14, 2026. Branch `feature/premium-rebuild-holiday-199`, fast-forwarded to `main` and deployed to production at Dan's direction.

## 1. Initial audit (what was live before)

| Finding | Severity | Status |
| --- | --- | --- |
| Every URL except `/` returned a Vercel 404 (no SPA rewrite). Shared links were dead. | Critical | Fixed: per-route prerendered HTML + clean URLs |
| Contact form was a `setTimeout` that showed "Message Sent" and sent nothing | Critical | Fixed: real CRM pipeline, honest failure states |
| Six fabricated customer reviews with invented names and towns | Critical | Removed |
| "CSIA Certified", "NFI Ready", "5-State Coverage", "5-Star" badges | High | Removed; F.I.R.E. added per Andrew |
| Service area VA/MD/WV/PA | High | Now VA/NJ/CT/MA |
| Gallery of stock photos, several showing other chimney companies' uniforms and before/afters, implied as our work | High | Removed; honest empty state + ready gallery system |
| "Financing available", Sunday "emergency service", fixed hours: unverified | Medium | Removed (financing redirects to contact) |
| Canonicals/OG pointed at apex domain, which 307s to www | Medium | Canonical is now www |
| 38 MB hero video, 200+ MB of 4K video in the deploy | Medium | 1.75 MB hero; deploy is 5.8 MB |
| React had no type definitions; TypeScript not strict | Medium | Strict TS, real types |
| Unused server deps (better-sqlite3 native build, @google/genai, express) | Low | Removed |

## 2. Andrew's requested changes

| Request | Done |
| --- | --- |
| States: Virginia, New Jersey, Connecticut, Massachusetts | Yes. Header, footer, contact, FAQ, schema, state pages, llms.txt |
| Remove CSI(A) references | Yes, zero remaining |
| Show FIRE certification | Yes as "F.I.R.E. Certified". Exact title to confirm (see approvals) |
| Keep the 757 number | Yes, centralized in `src/lib/site.ts`. 804 number not published |
| $199 holiday cleaning + inspection | Yes: banner, homepage section, landing page, form, social creative, CRM tag |

## 3. What was built

- **Design system:** self-hosted Archivo (expanded display) + Geist, ember on charcoal, gold reserved for the price, one radius system, custom easing, reduced-motion honored, CSS layered so utilities always win.
- **Homepage:** video hero, verified-facts marquee, services bento, $199 feature, live mini fireplace designer, "What are you noticing?" symptom finder, process timeline, four-state section, FAQ, closing request form.
- **Holiday campaign:** `/holiday-chimney-special` (and short link `/199`) with above-the-fold form, share/copy/save image, non-sensitive offer code, FAQ, final CTA; announcement bar; mobile action bar; Offer JSON-LD; Facebook/iMessage preview image.
- **Design Your Fireplace:** original parametric SVG renderer (4 styles, 8 surrounds, 5 mantels, 4 hearths, 5 fire types, 5 extras, 4 presets, surprise me), 7-step flow, saved to URL and browser, shareable link, sends the design to the CRM. Clear "not a quote or code check" disclaimer.
- **Fireplace Shop:** 6 categories, 14 product types, product pages with features and "good to know", saved quote list, quote request to CRM. Inquiry only, no prices or checkout, clearly labeled.
- **Reference repo comparison (Chim Chim Churee):** adapted the builder's patterns (step progress, URL + localStorage persistence, sticky preview, plain-text summary feeding the lead, quote store via `useSyncExternalStore`, seasonal promo config, GHL adapter design). Did **not** copy its manufacturer catalog, licensed product artwork, family photos, address or business claims.
- **Pages rebuilt:** services hub + 8 service pages (direct-answer block for AI search, signs, inclusions, process, FAQs, related, request form), service-areas hub + 4 state pages (distinct climate/housing content), city route gated, blog hub + 6 sourced articles, about, FAQ, contact, gallery, reviews, privacy & SMS terms, 404.

## 4. SEO / AI search

52 prerendered routes, 51 in `sitemap.xml`; per-route title, description, canonical, OG/Twitter, JSON-LD (HomeAndConstructionBusiness, WebSite, Service, Offer, FAQPage, BreadcrumbList, BlogPosting, AboutPage, ContactPage); crawlable text inside each HTML for non-JS crawlers; `robots.txt` (explicitly allows major AI crawlers); `llms.txt` + `llms-full.txt` generated from the same data; real 404 status; redirects for retired URLs.

## 5. CRM

`/api/lead` validates and delivers to GHL via inbound webhook and/or Private Integration (upsert, tags, note, optional opportunity). Exact tag `Holiday Special - $199`. UTM/referrer attribution. Honeypot, rate limit, retries. **Live status: awaiting credentials.** Until `GHL_WEBHOOK_URL` (or token + location) is set in Vercel, forms show "please call or text". Setup: `docs/CRM-SETUP.md`.

## 6. Testing performed

- `npm test`: 13/13 API tests (validation, tags, note, webhook, token path, no retry on 401, 503 when unconfigured, honeypot, method guard).
- Strict `tsc --noEmit`: clean.
- Clean clone + `pnpm install --frozen-lockfile` + build: pass.
- Browser E2E (real Chrome): holiday form empty submit shows 7 inline errors; valid submit shows success with reference; mock GHL received contact with `Holiday Special - $199`, `Source: facebook`, `Campaign: holiday-199`; funnel events page_view, promo_view, form_start, form_submit, form_success; unconfigured CRM shows honest call/text alert with nothing delivered; unknown URL returns 404; deep link returns 200.
- Responsive sweep: 14 pages at 390, 768 and 1440 px: no console errors, no horizontal overflow (one designer overflow found and fixed).
- Copy scan: zero em/en dashes.

## 7. Approvals and missing information

| Item | Owner | Why it matters |
| --- | --- | --- |
| GHL webhook URL or Private Integration token + location ID for **Andrew's** sub-account | Dan | Forms do not reach the CRM until set |
| Exact F.I.R.E. credential title as printed | Andrew | Edit `CREDENTIALS` in `src/lib/site.ts` |
| $199 terms: cleaning always included? one flue or whole home? end date? | Andrew | Edit `src/lib/promo.ts`; site currently says "tell us how many, we confirm pricing before the visit" |
| Confirmed towns per state | Andrew | Unlocks city pages (`docs/SERVICE-AREAS.md`) |
| Business hours | Andrew | `SITE.hours` |
| Confirm `info@firstchimneycontracting.com` receives mail | Dan | Shown site-wide |
| Facebook / Instagram profile URLs | Andrew | Footer links appear when set |
| Google Business Profile review link | Andrew | Enables "Leave a review" + review workflow |
| Which fireplace products/brands he actually sells and installs | Andrew | Shop is labeled preview until then |
| Licensed, levels 1-3, camera inspection, dryer vent service claims carried over from the old site | Andrew | Confirm or remove |
| Real job photos with homeowner permission | Andrew | Fills Our Work gallery |
| Stock photo licensing: several technician photos came from the old site's folder and may originate from other companies' sites | Dan | Replace with Andrew's own photos when available |
| Analytics (GA4/GTM/Meta Pixel) | Dan | Events already fire into `dataLayer`; just add the tag |
| 804 number | Andrew | Do not publish until purchased |

## 8. Future enhancements

Real project gallery and reviews; city pages; GA4 + Search Console + Bing Webmaster submission of the sitemap; online booking calendar embed from GHL; replace stock photography; confirmed product catalog with photos; image CDN for responsive `srcset`.

## 9. Round 2 additions (same day, at Dan's direction)

- **Holiday popup** with lead capture and a coupon saved to the phone (native share sheet to Photos), calendar reminder and share link. Code `HOLIDAY199`. Shown once per session after 9s or 35% scroll; 3-day cooldown after close; never after a claim; never on the promo, contact, builder or quote pages. `?promo=preview` forces it for testing.
- **Hero upgrade**: cursor-following ember glow, rising embers, glass offer/trust card, glowing Build Your Fireplace button (also in nav, mobile menu, footer, shop, articles, fireplace repair, city pages).
- **Build Your Fireplace** (`/build-your-fireplace`) is now the Chim Chim Churee configurator ported to First Chimney: real catalog of 230 models (Fireplace Xtrordinair, Lopi, Kozy Heat, Valor, Enviro, Modern Flames, SimpliFire) with manufacturer photography and layered preview art, heat sizing, insert fit checker, compare, and a **branded PDF** (product imagery, choices, maker specs, next steps, clickable link back to the build) downloaded on demand and automatically when the build is sent to First Chimney. Old `/design-your-fireplace` and `/build-my-fireplace` links redirect.
- **Fireplace Shop** on the same catalog: 11 categories and 230 product pages, each prerendered with Product + BreadcrumbList schema (293 indexable routes total).
- **20 city pages** (5 per state) with unique local content. Proposed list, pending Andrew's confirmation (`src/data/cities.ts`; set `published: false` to remove one).
- **Articles** link into shop categories and the builder; footer links popular categories.
- **AI scene generator** ready (`scripts/generate-scenes.mjs`, OpenAI gpt-image-1). Needs `OPENAI_API_KEY`; generates ambiance and material scenes only, never staff or "our work".

### New approvals needed
| Item | Owner |
| --- | --- |
| Which brands Andrew is an authorized dealer/installer for. Turn off any others with `enabled: false` in `src/data/catalog/brands.ts` | Andrew |
| Confirm or edit the 20 proposed city pages | Andrew |
| Run the AI scene script (or approve its output) once an OpenAI key is provided | Dan |

## 10. Build guide PDF (round 3)

The builder's PDF is now a three-page "Your Fireplace Build" guide (`src/lib/buildGuide.ts` content, `src/lib/designPdf.ts` layout):
1. Cover: product render with the chosen options, heat rating, efficiency, fuel, maker description, choices at a glance, next-step band with the build code.
2. What you are getting: itemized breakdown with manufacturer part numbers; what a typical install also needs (liner, gas line, venting, inspection, permit), confirmed at the measure; heat and comfort "It can / Keep in mind" using the maker's ratings and the homeowner's own room size; questions answered at the measure.
3. From this PDF to your first fire: six-step install journey, how to prepare, good-to-know tips, maker specs, First Chimney promise.
Every page links back to the saved build. Heat figures are labeled as the maker's rating (input and output appear in the specs).

Final QA: 19 tests; all 25 location pages plus home, holiday, builder, shop, contact, about, FAQ, blog, gallery and reviews checked at 375/390/1440 with no errors, overflow or clipped text; builder walked to a downloaded 3-page guide.

## 11. Team photos and experience (round 4)

- 24 photos of Andrew, the crew, trucks and real jobs added (optimized from 80 MB of PNGs to 8.9 MB WebP, full + thumbnail, descriptive filenames and alt text) in `public/media/team`, catalogued in `src/data/team.ts`. Raw originals stay in `public/media/Team-photos/` but are git-ignored, so they never deploy.
- Experience set in one place (`EXPERIENCE` in `src/data/team.ts`): Andrew 10 years in the chimney industry, crew 25 years combined. Shown on Home (hero card, marquee, Who we are), About, Gallery, Contact, FAQ, structured data (founder with photo, business description) and llms.txt.
- About page rebuilt around Andrew: portrait hero, experience band, "Why Andrew does this", promise, on-the-job strip.
- Gallery: all photos with category filters and a swipe/keyboard lightbox; before/after project support kept for future jobs.
- Real photos replace stock on six service pages (inspection, cleaning, masonry, leak repair, caps, crowns), the homepage, holiday page, contact page, all 4 state pages and all 20 city pages.

To confirm with Andrew: the 10 / 25 year figures; that homeowners are OK with their homes appearing in the gallery (no addresses or towns are shown).

## 12. Reviews, credential verification, relining (round 5)

- **Credential verified:** the official F.I.R.E. Service directory lists Andrew Paterini (Virginia Beach) as an **F.I.R.E. Certified Technician** (individual certification). Site wording updated everywhere and linked to the directory as independent proof. This closes the "exact credential title" approval item.
- **Reviews:** no reviews from Andrew's previous employer are reused. Reviews of another business cannot be presented as First Chimney's (FTC 16 CFR Part 465, Google review policy). The homepage card now shows "Trust you can check" (directory link, experience, real-reviews-only promise) and switches to real reviews automatically once `REVIEWS` in `src/data/content.ts` has entries.
- **Testimonial collection:** `/reviews#share` collects past customers' experiences with Andrew, with explicit permission to publish first name, town and comments. Submissions reach the CRM tagged `Testimonial` with the permission recorded in the note. Approved ones are added to `REVIEWS` (`source: 'Direct'`).
- **Chimney Relining** service page added (Andrew's trucks list relining; liner photo used).
- Default social share image now shows Andrew with his truck.

### How to build reviews fast (and safely)
1. Send Andrew's past customers the link `firstchimneycontracting.com/reviews#share`. Real words, real permission, published on the site.
2. When the Google Business Profile is live, ask First Chimney's customers for a Google review after each job (the CRM review-request workflow automates this). Do not offer incentives, do not filter who gets asked, and never write reviews for customers.
3. Past customers can leave a Google review for First Chimney once First Chimney has done work for them.

## 13. Growth engine and back office (round 6)

Built so a solo owner gets found, converts more visitors, keeps customers for years and can hire.

**New pages (all prerendered, in the sitemap and llms.txt, linked from the header Resources menu and footer):**
- `/chimney-health-check`: a 10-question self-assessment. It scores Urgent, Soon or Good with tested logic, educates the homeowner, recommends services and sends the answers with the lead. Urgent tells them to stop using the fireplace. Good offers the yearly reminder.
- `/real-estate-chimney-inspections`: Level 2 inspections for home sales (NFPA 211), with a role picker. Buyers and sellers get a service request; realtors, inspectors and property managers become partner leads.
- `/how-to-choose-a-chimney-company`: six questions to ask any chimney company, red flags, how First Chimney answers each (with the F.I.R.E. directory link), and a free second-opinion form.
- `/careers`: three roles, an application form (position, license, roofs), tagged `Job Applicant`. It never enters the sales pipeline.
- `/refer-a-friend`: referral capture. The reward is a setting (`REFERRAL_REWARD` in `src/data/growth.ts`).
- Yearly reminder sign-up on the Resource Center and the health check result (`Annual Reminder` tag).
- Homepage link to the health check, under "What are you noticing?".

**Short links for print and the truck:** `/check`, `/refer`, `/review`, `/realtors`, `/jobs`, `/remind`.

**Lead API:** five new form types with their own tags. `Website Lead` and job opportunities only for homeowner leads. Applicants need a phone number.

**Popup:** no longer shows on form-heavy pages, and never opens while someone is typing in a form.

**Back office docs:**
- `docs/GHL-AUTOMATION-PLAYBOOK.md`: pipelines, custom fields, 14 workflows with exact messages, reporting, and a test checklist.
- `docs/OPERATIONS-PLAYBOOK.md`: weekly scorecard, pricing worksheet, phone script, on-site walkthrough, hiring, a 12-week training plan, marketing calendar, local search setup, realtor outreach.

**Testing:** 29 automated tests pass (health check scoring, new form tags, routing, popup exclusions). Clicked through the health check in a headless browser on both the Urgent and Good paths. No horizontal clipping at 375, 768 or 1280 px. Header verified at 1024, 1280 and 1440 px.

### Approvals for Andrew (round 6)
| Item | Where to change |
| --- | --- |
| Referral thank-you (for example a gift card) | `REFERRAL_REWARD` in `src/data/growth.ts` |
| Positions and requirements on the careers page | `POSITIONS` in `src/data/growth.ts` |
| Whether to offer free second opinions (promised on the choose page) | `src/pages/Growth.tsx` → `ChooseCompany` |
