/**
 * ROUTE REGISTRY: one entry per public URL.
 *
 * Used by:
 *  - components/RouteHead.tsx (sets <title>, meta, canonical, JSON-LD in the browser)
 *  - scripts/prerender.ts (writes per-route HTML with the same head + crawlable text,
 *    sitemap.xml, robots.txt, llms.txt, llms-full.txt)
 *
 * Pure data, no React, so it runs in Node at build time.
 */
import { ARTICLES } from '../data/blog';
import { GENERAL_FAQS } from '../data/content';
import { PRODUCTS, SHOP_CATEGORIES } from '../data/shop';
import { SERVICE_AREAS, publishedCities } from '../data/serviceAreas';
import { SERVICES } from '../data/services';
import { SOURCES } from '../data/sources';
import { HOLIDAY_PROMO, promoIsLive } from './promo';
import { CREDENTIALS, SITE, STATE_LIST_TEXT, STATES } from './site';

export type Crumb = { name: string; path: string };

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  image: string;
  h1: string;
  /** Plain-text paragraphs for the prerendered, crawlable HTML (and llms-full.txt). */
  summary: string[];
  links: { label: string; path: string }[];
  crumbs: Crumb[];
  jsonLd: object[];
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  noindex?: boolean;
};

const abs = (p: string) => (p.startsWith('http') ? p : `${SITE.domain}${p}`);
export const ORG_ID = `${SITE.domain}/#business`;

export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.domain,
    logo: abs(SITE.logoDark),
    image: abs(SITE.ogImage),
    telephone: SITE.phoneE164,
    email: SITE.email,
    founder: { '@type': 'Person', name: SITE.owner },
    areaServed: STATES.map((s) => ({ '@type': 'State', name: s.name })),
    knowsAbout: ['Chimney inspection', 'Chimney cleaning', 'Chimney repair', 'Masonry repair', 'Fireplace repair', 'Chimney leak repair'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Chimney and fireplace services',
      itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, url: abs(`/services/${s.id}`) } })),
    },
  };
}

function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

const HOME: Crumb = { name: 'Home', path: '/' };

function promoOfferLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Holiday ${HOLIDAY_PROMO.title}`,
    serviceType: 'Chimney cleaning and inspection',
    provider: { '@id': ORG_ID },
    areaServed: STATES.map((s) => ({ '@type': 'State', name: s.name })),
    offers: {
      '@type': 'Offer',
      price: String(HOLIDAY_PROMO.price),
      priceCurrency: 'USD',
      url: abs(HOLIDAY_PROMO.path),
      availability: 'https://schema.org/InStock',
      ...(HOLIDAY_PROMO.validThrough ? { priceValidUntil: HOLIDAY_PROMO.validThrough } : {}),
      seller: { '@id': ORG_ID },
    },
  };
}

export function buildRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [];
  const add = (r: Omit<RouteMeta, 'jsonLd' | 'priority' | 'changefreq'> & Partial<Pick<RouteMeta, 'jsonLd' | 'priority' | 'changefreq'>>) =>
    routes.push({ priority: 0.6, changefreq: 'monthly', ...r, jsonLd: [...(r.jsonLd ?? []), ...(r.crumbs.length > 1 ? [breadcrumbLd(r.crumbs)] : [])] });

  const serviceLinks = SERVICES.map((s) => ({ label: s.title, path: `/services/${s.id}` }));
  const stateLinks = SERVICE_AREAS.map((s) => ({ label: `Chimney service in ${s.name}`, path: `/service-areas/${s.slug}` }));

  add({
    path: '/',
    title: `Chimney Cleaning, Inspection & Repair in ${STATE_LIST_TEXT}`,
    description: `${SITE.name}: ${CREDENTIALS.fire.label} chimney inspection, cleaning, masonry and leak repair in Virginia, New Jersey, Connecticut and Massachusetts. Holiday special: cleaning + inspection for $199.`,
    image: SITE.ogImage,
    h1: 'Chimney service done right the first time.',
    summary: [
      `${SITE.name} is a chimney and fireplace company owned by ${SITE.owner}, serving homeowners in ${STATE_LIST_TEXT}.`,
      `Services include chimney inspection, chimney cleaning and sweeping, masonry repair and rebuilds, leak repair and waterproofing, chimney caps and chase covers, crown repair, fireplace repair and dryer vent cleaning.`,
      `Inspections are performed with ${CREDENTIALS.fire.fullName}. Every job ends with a plain-English explanation of what we found, and repairs are always quoted before any work begins.`,
      promoIsLive() ? `Holiday special: ${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel}.` : '',
      `Call or text ${SITE.phoneDisplay}.`,
    ].filter(Boolean),
    links: [{ label: 'Holiday $199 special', path: HOLIDAY_PROMO.path }, ...serviceLinks, ...stateLinks, { label: 'Build your fireplace', path: '/design-your-fireplace' }, { label: 'Contact', path: '/contact' }],
    crumbs: [HOME],
    jsonLd: [
      businessJsonLd(),
      { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE.domain}/#website`, url: SITE.domain, name: SITE.name, publisher: { '@id': ORG_ID } },
      ...(promoIsLive() ? [promoOfferLd()] : []),
      faqLd(GENERAL_FAQS.slice(0, 6)),
    ],
    priority: 1,
    changefreq: 'weekly',
  });

  add({
    path: HOLIDAY_PROMO.path,
    title: `Holiday Special: ${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel}`,
    description: `${HOLIDAY_PROMO.pitch} ${HOLIDAY_PROMO.priceLabel} holiday special in ${STATE_LIST_TEXT}. Request your appointment online or call ${SITE.phoneDisplay}.`,
    image: HOLIDAY_PROMO.ogImage,
    h1: `Holiday Chimney Special: ${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel}`,
    summary: [
      HOLIDAY_PROMO.pitch,
      ...HOLIDAY_PROMO.includes.map((i) => `${i.title}: ${i.body}`),
      ...HOLIDAY_PROMO.finePrint,
      `Call or text ${SITE.phoneDisplay} to schedule.`,
    ],
    links: [{ label: 'Chimney cleaning', path: '/services/chimney-sweeping' }, { label: 'Chimney inspection', path: '/services/chimney-inspection' }, { label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'Holiday Special', path: HOLIDAY_PROMO.path }],
    jsonLd: [promoOfferLd()],
    priority: 0.95,
    changefreq: 'weekly',
    noindex: !promoIsLive(),
  });

  add({
    path: '/services',
    title: 'Chimney & Fireplace Services',
    description: `Chimney inspection, cleaning, masonry, leak repair, caps, crowns, fireplace repair and dryer vent cleaning in ${STATE_LIST_TEXT}.`,
    image: SITE.ogImage,
    h1: 'Chimney and fireplace services',
    summary: SERVICES.map((s) => `${s.title}: ${s.short}`),
    links: serviceLinks,
    crumbs: [HOME, { name: 'Services', path: '/services' }],
    priority: 0.9,
  });

  for (const s of SERVICES) {
    const path = `/services/${s.id}`;
    add({
      path,
      title: s.metaTitle,
      description: s.metaDescription,
      image: s.image,
      h1: s.title,
      summary: [s.answer, s.intro, `Signs you need it: ${s.signs.join('; ')}.`, `What is included: ${s.included.join('; ')}.`],
      links: [...s.related.map((id) => serviceLinks.find((l) => l.path === `/services/${id}`)!).filter(Boolean), { label: 'Request service', path: '/contact' }],
      crumbs: [HOME, { name: 'Services', path: '/services' }, { name: s.title, path }],
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.title,
          serviceType: s.title,
          description: s.answer,
          url: abs(path),
          image: abs(s.image),
          provider: { '@id': ORG_ID },
          areaServed: STATES.map((st) => ({ '@type': 'State', name: st.name })),
        },
        faqLd(s.faqs),
      ],
      priority: 0.85,
    });
  }

  add({
    path: '/service-areas',
    title: `Service Areas: ${STATE_LIST_TEXT}`,
    description: `First Chimney Contracting serves homeowners in ${STATE_LIST_TEXT}. See what chimneys face in your state and confirm coverage for your address.`,
    image: SITE.ogImage,
    h1: 'Where we work',
    summary: SERVICE_AREAS.map((s) => `${s.name}: ${s.intro}`),
    links: stateLinks,
    crumbs: [HOME, { name: 'Service Areas', path: '/service-areas' }],
    priority: 0.8,
  });

  for (const st of SERVICE_AREAS) {
    const path = `/service-areas/${st.slug}`;
    add({
      path,
      title: `Chimney Inspection, Cleaning & Repair in ${st.name}`,
      description: `${SITE.name} serves ${st.name} homeowners with chimney inspection, cleaning, masonry, leak repair and fireplace service. ${st.climate.split('.')[0]}.`,
      image: SITE.ogImage,
      h1: st.headline,
      summary: [st.intro, st.climate, st.housing, ...st.watchFor.map((w) => `${w.title}: ${w.body}`)],
      links: [...serviceLinks, ...publishedCities(st).map((c) => ({ label: c.name, path: `${path}/${c.slug}` }))],
      crumbs: [HOME, { name: 'Service Areas', path: '/service-areas' }, { name: st.name, path }],
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'Service', name: `Chimney services in ${st.name}`, serviceType: 'Chimney inspection, cleaning and repair', provider: { '@id': ORG_ID }, areaServed: { '@type': 'State', name: st.name } },
        faqLd(st.faqs),
      ],
      priority: 0.8,
    });
    for (const c of publishedCities(st)) {
      const cpath = `${path}/${c.slug}`;
      add({
        path: cpath,
        title: `Chimney Service in ${c.name}, ${st.code}`,
        description: c.intro.slice(0, 155),
        image: SITE.ogImage,
        h1: `Chimney service in ${c.name}, ${st.name}`,
        summary: [c.intro, ...c.localNotes],
        links: serviceLinks,
        crumbs: [HOME, { name: 'Service Areas', path: '/service-areas' }, { name: st.name, path }, { name: c.name, path: cpath }],
        jsonLd: [
          { '@context': 'https://schema.org', '@type': 'Service', name: `Chimney services in ${c.name}, ${st.code}`, provider: { '@id': ORG_ID }, areaServed: { '@type': 'City', name: c.name, containedInPlace: { '@type': 'State', name: st.name } } },
          faqLd(c.faqs),
        ],
        priority: 0.7,
      });
    }
  }

  add({
    path: '/design-your-fireplace',
    title: 'Build Your Fireplace',
    description: 'Explore fireplace styles, brick and stone surrounds, mantels, hearths and fire types, preview your design live, then send it to First Chimney for a consultation.',
    image: '/og/og-designer.jpg',
    h1: 'Build your fireplace',
    summary: [
      'An interactive tool to explore fireplace styles (traditional, transitional, modern linear, farmhouse), surround materials (brick, stone, limewash, tile, marble), mantels, hearths and fire types (wood, wood insert, gas logs, linear gas, electric).',
      'Your design is a visual starting point, not a quote or a code review. First Chimney confirms what is possible for your home during a consultation.',
    ],
    links: [{ label: 'Fireplace shop', path: '/fireplace-shop' }, { label: 'Fireplace repair', path: '/services/fireplace-repair' }],
    crumbs: [HOME, { name: 'Build Your Fireplace', path: '/design-your-fireplace' }],
    priority: 0.8,
  });

  add({
    path: '/fireplace-shop',
    title: 'Fireplace Shop: Inserts, Gas, Electric, Mantels & Caps',
    description: 'Browse fireplace inserts, gas and electric fireplaces, mantels, doors and chimney caps. Request pricing and a consultation from First Chimney.',
    image: '/og/og-designer.jpg',
    h1: 'Fireplace shop',
    summary: [
      'Explore fireplace products by type and add them to a quote request. Availability, brands and pricing are confirmed with First Chimney during your consultation. There is no online checkout.',
      ...SHOP_CATEGORIES.map((c) => `${c.name}: ${c.blurb}`),
    ],
    links: SHOP_CATEGORIES.map((c) => ({ label: c.name, path: `/fireplace-shop/${c.id}` })),
    crumbs: [HOME, { name: 'Fireplace Shop', path: '/fireplace-shop' }],
    priority: 0.7,
  });

  for (const c of SHOP_CATEGORIES) {
    const path = `/fireplace-shop/${c.id}`;
    const items = PRODUCTS.filter((p) => p.category === c.id);
    add({
      path,
      title: `${c.name} | Fireplace Shop`,
      description: `${c.blurb} Request pricing and installation from First Chimney Contracting.`,
      image: '/og/og-designer.jpg',
      h1: c.name,
      summary: [c.blurb, ...items.map((p) => `${p.name}: ${p.summary}`)],
      links: items.map((p) => ({ label: p.name, path: `${path}/${p.id}` })),
      crumbs: [HOME, { name: 'Fireplace Shop', path: '/fireplace-shop' }, { name: c.name, path }],
      priority: 0.6,
    });
    for (const p of items) {
      const ppath = `${path}/${p.id}`;
      add({
        path: ppath,
        title: `${p.name} | ${c.name}`,
        description: `${p.summary} Request pricing and installation from First Chimney.`,
        image: '/og/og-designer.jpg',
        h1: p.name,
        summary: [p.summary, `Best for: ${p.bestFor}`, `Features: ${p.features.join('; ')}.`, `Good to know: ${p.considerations.join('; ')}.`],
        links: [{ label: c.name, path }, { label: 'Request a quote', path: '/fireplace-shop/quote' }],
        crumbs: [HOME, { name: 'Fireplace Shop', path: '/fireplace-shop' }, { name: c.name, path }, { name: p.name, path: ppath }],
        priority: 0.5,
      });
    }
  }

  add({
    path: '/fireplace-shop/quote',
    title: 'Your Quote Request',
    description: 'Review the fireplace products you saved and request pricing from First Chimney.',
    image: '/og/og-designer.jpg',
    h1: 'Your quote request',
    summary: ['Review saved products and send a quote request.'],
    links: [],
    crumbs: [HOME, { name: 'Fireplace Shop', path: '/fireplace-shop' }, { name: 'Quote', path: '/fireplace-shop/quote' }],
    noindex: true,
    priority: 0.1,
  });

  add({
    path: '/gallery',
    title: 'Our Work',
    description: 'Real First Chimney Contracting projects: chimney repairs, masonry, caps, crowns and fireplace work, documented start to finish.',
    image: SITE.ogImage,
    h1: 'Our work',
    summary: ['Project photos from real First Chimney jobs, published with homeowner permission.'],
    links: serviceLinks,
    crumbs: [HOME, { name: 'Our Work', path: '/gallery' }],
    priority: 0.5,
  });

  add({
    path: '/reviews',
    title: 'Customer Reviews',
    description: 'Reviews from First Chimney Contracting customers. Worked with us? We would love to hear how it went.',
    image: SITE.ogImage,
    h1: 'Reviews',
    summary: ['Verified reviews from First Chimney Contracting customers.'],
    links: [{ label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'Reviews', path: '/reviews' }],
    priority: 0.4,
  });

  add({
    path: '/about',
    title: 'About First Chimney Contracting',
    description: `Owned and run by ${SITE.owner}, ${CREDENTIALS.fire.label}. Honest inspections, clean work and straight answers for homeowners in ${STATE_LIST_TEXT}.`,
    image: SITE.ogImage,
    h1: 'About First Chimney Contracting',
    summary: [
      `${SITE.name} is owned and operated by ${SITE.owner}, who holds F.I.R.E. certification for chimney inspection.`,
      'The company was built on a simple standard: show homeowners what we see, explain it plainly, quote before we work and leave the house clean.',
      `We serve homeowners in ${STATE_LIST_TEXT}.`,
    ],
    links: [{ label: 'Services', path: '/services' }, { label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'About', path: '/about' }],
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'AboutPage', about: { '@id': ORG_ID } }],
    priority: 0.6,
  });

  add({
    path: '/faq',
    title: 'Chimney & Fireplace FAQ',
    description: 'Answers to common questions about chimney inspection, cleaning, repairs, the $199 holiday special, service areas and scheduling.',
    image: SITE.ogImage,
    h1: 'Frequently asked questions',
    summary: GENERAL_FAQS.map((f) => `${f.q} ${f.a}`),
    links: serviceLinks,
    crumbs: [HOME, { name: 'FAQ', path: '/faq' }],
    jsonLd: [faqLd(GENERAL_FAQS)],
    priority: 0.6,
  });

  add({
    path: '/contact',
    title: 'Contact & Schedule Service',
    description: `Request chimney inspection, cleaning or repair. Call or text ${SITE.phoneDisplay} or send a request online. Serving ${STATE_LIST_TEXT}.`,
    image: SITE.ogImage,
    h1: 'Schedule chimney service',
    summary: [`Call or text ${SITE.phoneDisplay}. Email ${SITE.email}.`, `Serving ${STATE_LIST_TEXT}.`],
    links: serviceLinks,
    crumbs: [HOME, { name: 'Contact', path: '/contact' }],
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'ContactPage', about: { '@id': ORG_ID } }],
    priority: 0.8,
  });

  add({
    path: '/blog',
    title: 'Chimney Care Resource Center',
    description: 'Straightforward guides on chimney inspections, cleaning, creosote, leaks and getting your fireplace ready for winter.',
    image: SITE.ogImage,
    h1: 'Chimney care resource center',
    summary: ARTICLES.map((a) => `${a.title}: ${a.description}`),
    links: ARTICLES.map((a) => ({ label: a.title, path: `/blog/${a.slug}` })),
    crumbs: [HOME, { name: 'Resources', path: '/blog' }],
    priority: 0.6,
    changefreq: 'weekly',
  });

  for (const a of ARTICLES) {
    const path = `/blog/${a.slug}`;
    const text = a.body.map((b) => (b.type === 'list' ? b.items.join('; ') : b.type === 'callout' ? `${b.title}: ${b.text}` : b.text));
    add({
      path,
      title: a.title,
      description: a.description,
      image: a.image,
      h1: a.title,
      summary: [a.description, ...a.takeaways, ...text, `Sources: ${a.sources.map((id) => `${SOURCES[id].publisher}, ${SOURCES[id].label} (${SOURCES[id].url})`).join('; ')}`],
      links: a.relatedServices.map((id) => serviceLinks.find((l) => l.path === `/services/${id}`)!).filter(Boolean),
      crumbs: [HOME, { name: 'Resources', path: '/blog' }, { name: a.title, path }],
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: a.title,
          description: a.description,
          image: abs(a.image),
          datePublished: a.datePublished,
          dateModified: a.dateModified,
          author: { '@type': 'Organization', name: SITE.name, url: SITE.domain },
          publisher: { '@id': ORG_ID },
          mainEntityOfPage: abs(path),
          citation: a.sources.map((id) => SOURCES[id].url),
        },
      ],
      priority: 0.6,
    });
  }

  add({
    path: '/privacy-policy',
    title: 'Privacy Policy & SMS Terms',
    description: 'How First Chimney Contracting collects, uses and protects your information, and the terms for text messages.',
    image: SITE.ogImage,
    h1: 'Privacy policy and SMS terms',
    summary: ['How we handle the information you send through this website, and the terms for text messages.'],
    links: [{ label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'Privacy', path: '/privacy-policy' }],
    priority: 0.2,
    changefreq: 'yearly',
  });

  return routes;
}

let cache: Map<string, RouteMeta> | null = null;
export function routeFor(path: string): RouteMeta | undefined {
  if (!cache) cache = new Map(buildRoutes().map((r) => [r.path, r]));
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return cache.get(clean);
}

export const NOT_FOUND_META: RouteMeta = {
  path: '/404',
  title: 'Page Not Found',
  description: 'That page could not be found.',
  image: SITE.ogImage,
  h1: 'Page not found',
  summary: [],
  links: [],
  crumbs: [],
  jsonLd: [],
  priority: 0,
  changefreq: 'yearly',
  noindex: true,
};

export function fullTitle(r: RouteMeta): string {
  return r.path === '/' ? `${SITE.name} | ${r.title}` : `${r.title} | ${SITE.shortName}`;
}
