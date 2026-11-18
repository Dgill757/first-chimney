/**
 * Post-build: turn the single-page app into a crawlable, shareable site.
 *
 * For every route in src/lib/routes.ts this writes dist/<route>.html containing:
 *  - the correct <title>, description, canonical, Open Graph / Twitter tags and JSON-LD
 *    (Facebook, iMessage and most AI crawlers do not run JavaScript, so this is what they see)
 *  - a plain-HTML summary of the page inside #root, replaced by the app on load
 *
 * Then writes sitemap.xml, robots.txt, llms.txt, llms-full.txt and 404.html.
 * vercel.json uses cleanUrls, so /services/chimney-inspection serves services/chimney-inspection.html,
 * and unknown URLs get a real 404 status.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ARTICLES } from '../src/data/blog';
import { SERVICE_AREAS } from '../src/data/serviceAreas';
import { SERVICES } from '../src/data/services';
import { EXPERIENCE } from '../src/data/team';
import { HOLIDAY_PROMO, promoIsLive } from '../src/lib/promo';
import { buildRoutes, fullTitle, NOT_FOUND_META, type RouteMeta } from '../src/lib/routes';
import { buildCatalogRoutes } from '../src/lib/catalogRoutes';
import { CREDENTIALS, SITE, STATE_LIST_TEXT } from '../src/lib/site';

const DIST = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<!--head:start-->') || !template.includes('<!--app-->')) {
  throw new Error('dist/index.html is missing the prerender markers. Check index.html.');
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p: string) => (p.startsWith('http') ? p : `${SITE.domain}${p}`);
const urlFor = (path: string) => `${SITE.domain}${path === '/' ? '/' : path}`;

function head(r: RouteMeta): string {
  const t = esc(fullTitle(r));
  const d = esc(r.description);
  const img = abs(r.image);
  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${r.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />`,
    r.path !== '/404' ? `<link rel="canonical" href="${urlFor(r.path)}" />` : '',
    `<meta property="og:type" content="${r.path.startsWith('/blog/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${urlFor(r.path)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    ...r.jsonLd.map((ld) => `<script type="application/ld+json" data-route-ld="1">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`),
  ];
  return tags.filter(Boolean).join('\n    ');
}

function body(r: RouteMeta): string {
  const crumbs = r.crumbs.length > 1 ? `<nav aria-label="Breadcrumb"><p>${r.crumbs.map((c) => `<a href="${c.path}">${esc(c.name)}</a>`).join(' / ')}</p></nav>` : '';
  const paras = r.summary.map((p) => `<p>${esc(p)}</p>`).join('');
  const links = r.links.length ? `<ul>${r.links.map((l) => `<li><a href="${l.path}">${esc(l.label)}</a></li>`).join('')}</ul>` : '';
  return `<div class="ssr-shell">${crumbs}<h1>${esc(r.h1)}</h1>${paras}${links}<p><a href="${SITE.phoneHref}">Call or text ${esc(SITE.phoneDisplay)}</a></p></div>`;
}

function render(r: RouteMeta): string {
  return template.replace(/<!--head:start-->[\s\S]*?<!--head:end-->/, head(r)).replace('<!--app-->', body(r));
}

function write(rel: string, content: string) {
  const file = join(DIST, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const routes = buildRoutes(buildCatalogRoutes());
const seen = new Set<string>();
for (const r of routes) {
  if (seen.has(r.path)) throw new Error(`Duplicate route ${r.path}`);
  seen.add(r.path);
  write(r.path === '/' ? 'index.html' : `${r.path.slice(1)}.html`, render(r));
}
write('404.html', render(NOT_FOUND_META));

/* ---------------- sitemap.xml ---------------- */
const today = new Date().toISOString().slice(0, 10);
const indexable = routes.filter((r) => !r.noindex);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((r) => `  <url><loc>${urlFor(r.path)}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority.toFixed(2)}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
);

/* ---------------- robots.txt ---------------- */
write(
  'robots.txt',
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /fireplace-shop/quote',
    '',
    '# AI assistants and search crawlers are welcome to read this site.',
    ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'].flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${SITE.domain}/sitemap.xml`,
    '',
  ].join('\n'),
);

/* ---------------- llms.txt ---------------- */
const live = promoIsLive();
const llms = [
  `# ${SITE.name}`,
  '',
  `> ${SITE.name} is a chimney and fireplace service company owned by ${SITE.owner}, serving homeowners in ${STATE_LIST_TEXT}. Services: chimney inspection (${CREDENTIALS.fire.label}), chimney cleaning and sweeping, masonry repair and rebuilds, leak repair and waterproofing, chimney caps and chase covers, crown repair, fireplace repair and dryer vent cleaning. Phone: ${SITE.phoneDisplay}. Email: ${SITE.email}.`,
  '',
  'Key facts:',
  `- Service area: ${STATE_LIST_TEXT} (VA, NJ, CT, MA, RI). Call to confirm coverage for a specific address.`,
  `- Credential: ${CREDENTIALS.fire.label} (chimney inspection). Owner ${SITE.owner} has ${EXPERIENCE.ownerYears} years in the chimney industry; the crew has ${EXPERIENCE.teamYears} years of combined experience.`,
  '- Repairs are quoted before any work begins. Online forms are requests; appointments are confirmed by phone or text.',
  live ? `- Current offer: ${HOLIDAY_PROMO.eyebrow}, ${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel}. Details: ${SITE.domain}${HOLIDAY_PROMO.path}` : '',
  '- The fireplace designer and fireplace shop are inquiry tools. No online prices or checkout.',
  '',
  '## Services',
  ...SERVICES.map((s) => `- [${s.title}](${SITE.domain}/services/${s.id}): ${s.short}`),
  '',
  '## Service areas',
  ...SERVICE_AREAS.map((s) => `- [${s.name}](${SITE.domain}/service-areas/${s.slug}): ${s.climate.split('.')[0]}.`),
  '',
  '## Guides',
  ...ARTICLES.map((a) => `- [${a.title}](${SITE.domain}/blog/${a.slug}): ${a.description}`),
  '',
  '## Tools',
  `- [Build your fireplace](${SITE.domain}/build-your-fireplace): Pick a real gas, wood, pellet or electric model, customize it, check heat and fit, get a branded PDF.`,
  `- [Fireplace shop](${SITE.domain}/fireplace-shop): Browse fireplace product types and request pricing.`,
  `- [Chimney health check](${SITE.domain}/chimney-health-check): Free 10-question self-check. Tells a homeowner whether their chimney looks safe, needs a look soon, or should not be used until inspected.`,
  `- [How to choose a chimney company](${SITE.domain}/how-to-choose-a-chimney-company): Six questions to ask any chimney company, red flags of chimney scams, and a free second opinion on existing quotes.`,
  `- [Real estate chimney inspections](${SITE.domain}/real-estate-chimney-inspections): Level 2 inspections for home buyers, sellers, realtors and home inspectors.`,
  '',
  '## Company',
  `- [About](${SITE.domain}/about)`,
  `- [Reviews](${SITE.domain}/reviews)`,
  `- [Careers](${SITE.domain}/careers)`,
  `- [Partner program](${SITE.domain}/partners): realtors, home inspectors, contractors, property managers and insurance professionals.`,
  `- [Chimney fire news](${SITE.domain}/news): real reports from local news with lessons for homeowners.`,
  `- [Resources](${SITE.domain}/resources): tools, guides and downloadable partner guides.`,
  `- [FAQ](${SITE.domain}/faq)`,
  `- [Contact](${SITE.domain}/contact)`,
  '',
  '## Optional',
  `- [Full text of every page](${SITE.domain}/llms-full.txt)`,
  '',
]
  .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
  .join('\n');
write('llms.txt', llms);

write(
  'llms-full.txt',
  [`# ${SITE.name}: full site text`, '', `Generated ${today}. Canonical site: ${SITE.domain}`, ''].concat(
    indexable.map((r) => [`## ${r.h1}`, `URL: ${urlFor(r.path)}`, '', ...r.summary, ''].join('\n')),
  ).join('\n'),
);

console.log(`prerender: ${routes.length} routes, ${indexable.length} in sitemap, llms.txt + llms-full.txt written`);
