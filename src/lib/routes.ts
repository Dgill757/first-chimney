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
import { SERVICE_AREAS, publishedCities } from '../data/serviceAreas';
import { SERVICES } from '../data/services';
import { SOURCES } from '../data/sources';
import { HOLIDAY_PROMO, promoIsLive } from './promo';
import { CREDENTIALS, SITE, STATE_LIST_TEXT, STATES } from './site';
import { EXPERIENCE, JOB_PHOTOS, TEAM } from '../data/team';
import { NEWS, NEWS_STATS } from '../data/news';
import { PARTNER_INDUSTRIES, PARTNER_PROGRAM } from '../data/partners';
import { CAREER_FAQS, CHOOSE_QUESTIONS, HEALTH_CHECK, POSITIONS, REAL_ESTATE_FAQS, RED_FLAGS } from '../data/growth';

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
    description: `Chimney inspection, cleaning and repair company owned by ${SITE.owner}, ${CREDENTIALS.fire.label}, with ${EXPERIENCE.ownerYears} years in the chimney industry and a crew with ${EXPERIENCE.teamYears} years of combined experience.`,
    founder: { '@type': 'Person', name: SITE.owner, jobTitle: 'Owner', image: abs(TEAM.portrait.src) },
    employee: { '@type': 'Person', name: SITE.owner, jobTitle: 'Owner', image: abs(TEAM.portrait.src) },
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

export function buildRoutes(extra: RouteMeta[] = []): RouteMeta[] {
  const routes: RouteMeta[] = [];
  const add = (r: Omit<RouteMeta, 'jsonLd' | 'priority' | 'changefreq'> & Partial<Pick<RouteMeta, 'jsonLd' | 'priority' | 'changefreq'>>) =>
    routes.push({ priority: 0.6, changefreq: 'monthly', ...r, jsonLd: [...(r.jsonLd ?? []), ...(r.crumbs.length > 1 ? [breadcrumbLd(r.crumbs)] : [])] });

  const serviceLinks = SERVICES.map((s) => ({ label: s.title, path: `/services/${s.id}` }));
  const stateLinks = SERVICE_AREAS.map((s) => ({ label: `Chimney service in ${s.name}`, path: `/service-areas/${s.slug}` }));

  add({
    path: '/',
    title: `Chimney Cleaning, Inspection & Repair in ${STATE_LIST_TEXT}`,
    description: `${SITE.name}: ${CREDENTIALS.fire.label} chimney inspection, cleaning, masonry and leak repair in Virginia, New Jersey, Connecticut, Massachusetts and Rhode Island. Holiday special: cleaning + inspection for $199.`,
    image: SITE.ogImage,
    h1: 'Chimney service done right the first time.',
    summary: [
      `${SITE.name} is a chimney and fireplace company owned by ${SITE.owner}, serving homeowners in ${STATE_LIST_TEXT}.`,
      `Services include chimney inspection, chimney cleaning and sweeping, masonry repair and rebuilds, leak repair and waterproofing, chimney caps and chase covers, crown repair, fireplace repair and dryer vent cleaning.`,
      `Inspections are performed with ${CREDENTIALS.fire.fullName}. Every job ends with a plain-English explanation of what we found, and repairs are always quoted before any work begins.`,
      promoIsLive() ? `Holiday special: ${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel}.` : '',
      `Call or text ${SITE.phoneDisplay}.`,
    ].filter(Boolean),
    links: [{ label: 'Holiday $199 special', path: HOLIDAY_PROMO.path }, ...serviceLinks, ...stateLinks, { label: 'Build your fireplace', path: '/build-your-fireplace' }, { label: 'Contact', path: '/contact' }],
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
    path: '/build-your-fireplace',
    title: 'Build Your Fireplace: Gas, Wood, Electric Fireplaces & Inserts',
    description: `Build your fireplace online with real models from Fireplace Xtrordinair, Lopi, Valor, Kozy Heat, Enviro, Modern Flames and SimpliFire. Customize fronts and finishes, check heat and fit, and get a branded PDF from First Chimney.`,
    image: '/og/og-designer.jpg',
    h1: 'Build your fireplace',
    summary: [
      'Tell us what it goes into (a new wall, an existing fireplace or the middle of the room), what it burns (gas, wood, pellet or electric) and how much space you heat. Then pick a real model, customize its fronts, liners, media and finishes, and see it previewed.',
      'The builder estimates the heat your room needs and checks whether an insert fits your opening, using the published manufacturer dimensions.',
      'Send your build to First Chimney and download a branded PDF. Pricing is confirmed in writing after an on-site measure.',
    ],
    links: [{ label: 'Fireplace shop', path: '/fireplace-shop' }, { label: 'Fireplace repair', path: '/services/fireplace-repair' }],
    crumbs: [HOME, { name: 'Build Your Fireplace', path: '/build-your-fireplace' }],
    priority: 0.85,
  });

  add({
    path: '/fireplace-shop',
    title: 'Fireplace Shop: Gas, Wood & Electric Fireplaces, Inserts and Stoves',
    description: `Shop gas, wood, pellet and electric fireplaces, inserts and stoves from leading manufacturers. Request a quote and installation from First Chimney in ${STATE_LIST_TEXT}.`,
    image: '/og/og-designer.jpg',
    h1: 'Fireplace shop',
    summary: [
      'Browse fireplaces, inserts and stoves from Fireplace Xtrordinair, Lopi, Valor, Kozy Heat, Enviro, Modern Flames and SimpliFire. Save models to a quote request; First Chimney confirms fit, venting and pricing after measuring.',
    ],
    links: [{ label: 'Build your fireplace', path: '/build-your-fireplace' }],
    crumbs: [HOME, { name: 'Fireplace Shop', path: '/fireplace-shop' }],
    priority: 0.75,
  });

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
    title: 'Our Work: Chimney Rebuilds, Crowns, Caps & Cleaning',
    description: `Photos of real First Chimney jobs: chimney rebuilds, crowns, caps, liners and cleanings by ${SITE.owner} and the crew.`,
    image: SITE.ogImage,
    h1: 'Our work',
    summary: [`${JOB_PHOTOS.length} photos of First Chimney jobs and crew: chimney rebuilds, crowns, caps, liners, cleanings and inspections.`, ...JOB_PHOTOS.map((p) => p.alt)],
    links: serviceLinks,
    crumbs: [HOME, { name: 'Our Work', path: '/gallery' }],
    priority: 0.5,
  });

  add({
    path: '/reviews',
    title: 'Reviews: What People Say About Andrew Paterini',
    description: `Real reviews of ${SITE.owner} and First Chimney Contracting, published with permission. ${CREDENTIALS.fire.title} with ${EXPERIENCE.ownerYears} years in the chimney trade.`,
    image: SITE.ogImage,
    h1: 'Reviews',
    summary: ['Reviews from real customers, published with their permission.', `${SITE.owner} is listed in the official F.I.R.E. directory as an ${CREDENTIALS.fire.title}: ${CREDENTIALS.fire.verifyUrl}`],
    links: [{ label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'Reviews', path: '/reviews' }],
    priority: 0.4,
  });

  add({
    path: '/about',
    title: 'About First Chimney Contracting',
    description: `Meet ${SITE.owner}: ${EXPERIENCE.ownerYears} years in the chimney industry, ${CREDENTIALS.fire.label}, leading a crew with ${EXPERIENCE.teamYears} years of combined experience across ${STATE_LIST_TEXT}.`,
    image: TEAM.withTruck.src,
    h1: 'Built by someone who genuinely loves chimneys',
    summary: [
      `${SITE.name} is owned and operated by ${SITE.owner}, who has spent ${EXPERIENCE.ownerYears} years in the chimney industry and holds F.I.R.E. certification for chimney inspection. The crew brings ${EXPERIENCE.teamYears} years of combined chimney and masonry experience.`,
      'Andrew genuinely loves chimneys and loves seeing families use their fireplaces safely, and he started First Chimney to take care of every home like his own.',
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
    path: '/chimney-health-check',
    title: 'Free Chimney Health Check: Is Your Chimney Safe to Use?',
    description: `Answer ${HEALTH_CHECK.length} quick questions and get a plain-English read on your chimney: warning signs, what to do next and when to stop using the fireplace. Free, 2 minutes.`,
    image: TEAM.inspectionRoof.src,
    h1: 'Is your chimney safe to use?',
    summary: [
      `A free ${HEALTH_CHECK.length}-question chimney self-check built from the warning signs ${SITE.owner}, ${CREDENTIALS.fire.fullName}, looks for on every inspection.`,
      ...HEALTH_CHECK.map((q) => `${q.q}${q.hint ? ` ${q.hint}` : ''}`),
      'Smoke drifting into the room or signs of a past chimney fire mean the fireplace should not be used until it is inspected.',
    ],
    links: [{ label: 'Chimney inspection', path: '/services/chimney-inspection' }, { label: 'Chimney cleaning', path: '/services/chimney-sweeping' }, { label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'Chimney Health Check', path: '/chimney-health-check' }],
    priority: 0.8,
  });

  add({
    path: '/real-estate-chimney-inspections',
    title: 'Level 2 Chimney Inspections for Home Buyers, Sellers & Realtors',
    description: `Level 2 chimney inspections for home sales in ${STATE_LIST_TEXT}. NFPA 211 calls for a Level 2 inspection when a property is sold. ${CREDENTIALS.fire.title}.`,
    image: TEAM.inspectionRoof.src,
    h1: 'Chimney inspections that keep closings on track',
    summary: [
      'A general home inspection usually looks at the chimney from the outside. A Level 2 chimney inspection includes a camera look inside the flue.',
      ...REAL_ESTATE_FAQS.map((f) => `${f.q} ${f.a}`),
      'Realtors, home inspectors and property managers can partner with First Chimney for chimney questions in their deals.',
    ],
    links: [{ label: 'Inspection levels explained', path: '/blog/what-is-a-level-2-chimney-inspection' }, { label: 'Chimney inspection', path: '/services/chimney-inspection' }],
    crumbs: [HOME, { name: 'Real Estate Inspections', path: '/real-estate-chimney-inspections' }],
    jsonLd: [
      faqLd(REAL_ESTATE_FAQS),
      { '@context': 'https://schema.org', '@type': 'Service', name: 'Level 2 chimney inspection for real estate transactions', serviceType: 'Chimney inspection', provider: { '@id': ORG_ID }, areaServed: STATES.map((s) => ({ '@type': 'State', name: s.name })) },
    ],
    priority: 0.7,
  });

  add({
    path: '/how-to-choose-a-chimney-company',
    title: 'How to Choose a Chimney Company: 6 Questions & Red Flags',
    description: 'Six questions to ask any chimney sweep or chimney company before they get on your roof, the red flags of chimney scams, and how First Chimney answers each one.',
    image: SITE.ogImage,
    h1: 'How to choose a chimney company',
    summary: [
      ...CHOOSE_QUESTIONS.map((x) => `${x.q} ${x.why} First Chimney: ${x.us}`),
      `Red flags: ${RED_FLAGS.join('; ')}.`,
      'Homeowners can send an existing chimney repair quote to Andrew for a second opinion.',
    ],
    links: [{ label: 'About Andrew', path: '/about' }, { label: 'Reviews', path: '/reviews' }, { label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'How to Choose a Chimney Company', path: '/how-to-choose-a-chimney-company' }],
    jsonLd: [faqLd(CHOOSE_QUESTIONS.map((x) => ({ q: x.q, a: `${x.why} ${x.us}` })))],
    priority: 0.7,
  });

  add({
    path: '/careers',
    title: 'Careers: Chimney Technician, Mason, Installer, Sales & Office Jobs',
    description: `Work with ${SITE.owner} at ${SITE.name}. Chimney technician, helper / apprentice and mason positions. Learn the trade from a ${CREDENTIALS.fire.title}.`,
    image: TEAM.liner.src,
    h1: 'Learn a real trade from someone who loves it',
    summary: [...POSITIONS.map((p) => `${p.title} (${p.type}): ${p.summary} Requirements: ${p.requirements.join('; ')}.`), ...CAREER_FAQS.map((f) => `${f.q} ${f.a}`)],
    jsonLd: POSITIONS.map((p) => ({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: p.title,
      description: `${p.summary} Responsibilities: ${p.responsibilities.join('; ')}. Requirements: ${p.requirements.join('; ')}.`,
      datePosted: '2026-11-15',
      employmentType: p.type.includes('Part') ? 'PART_TIME' : p.type === 'Seasonal' ? 'TEMPORARY' : 'FULL_TIME',
      hiringOrganization: { '@type': 'Organization', name: SITE.name, sameAs: SITE.domain, logo: abs(SITE.logoDark) },
      jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Virginia Beach', addressRegion: 'VA', addressCountry: 'US' } },
      directApply: true,
    })),
    links: [{ label: 'About', path: '/about' }],
    crumbs: [HOME, { name: 'Careers', path: '/careers' }],
    priority: 0.4,
  });

  add({
    path: '/refer-a-friend',
    title: 'Refer a Friend: Give $25, Get $25',
    description: `Give $25, get $25. Refer a friend to ${SITE.name}: they get $25 off their first chimney service and you get $25 off your next one.`,
    image: TEAM.headshot.src,
    h1: 'Refer a friend',
    summary: [`Send a referral and ${SITE.owner} will reach out personally and mention who sent them.`],
    links: [{ label: 'Contact', path: '/contact' }],
    crumbs: [HOME, { name: 'Refer a Friend', path: '/refer-a-friend' }],
    priority: 0.3,
  });

  add({
    path: '/partners',
    title: 'Partner Program for Realtors, Inspectors, Contractors & Property Managers',
    description: `Partner with ${SITE.owner}, ${CREDENTIALS.fire.title}. ${PARTNER_PROGRAM.discount}, priority scheduling and photo reports for realtors, home inspectors, contractors, property managers and insurance professionals.`,
    image: TEAM.inspectionRoof.src,
    h1: 'Work with First Chimney',
    summary: [...PARTNER_PROGRAM.perks, ...PARTNER_INDUSTRIES.map((p) => `${p.name} (${p.short}): ${p.lede}`)],
    links: PARTNER_INDUSTRIES.map((p) => ({ label: `${p.name} partner program`, path: `/partners/${p.slug}` })),
    crumbs: [HOME, { name: 'Partners', path: '/partners' }],
    priority: 0.7,
  });

  for (const p of PARTNER_INDUSTRIES) {
    const path = `/partners/${p.slug}`;
    add({
      path,
      title: `Chimney Partner Program for ${p.name}`,
      description: `${p.title} ${PARTNER_PROGRAM.discount} for ${p.short.toLowerCase()}, priority scheduling and a free guide: ${p.guide.title}.`,
      image: TEAM.inspectionRoof.src,
      h1: p.title,
      summary: [p.lede, ...p.pains.map((x) => `${x.t}: ${x.b}`), ...p.benefits.map((x) => `${x.t}: ${x.b}`), p.offer, `Free download: ${p.guide.title}. ${p.guide.blurb}`, ...p.faqs.map((f) => `${f.q} ${f.a}`)],
      links: [{ label: 'Partner program', path: '/partners' }, { label: 'Chimney inspection', path: '/services/chimney-inspection' }, { label: p.guide.title, path: p.guide.file }],
      crumbs: [HOME, { name: 'Partners', path: '/partners' }, { name: p.name, path }],
      jsonLd: [faqLd(p.faqs)],
      priority: 0.6,
    });
  }

  add({
    path: '/news',
    title: 'Chimney Fire News: Real Reports and the Lessons Behind Them',
    description: 'Chimney fire news from local outlets across the U.S., including Massachusetts, New Jersey and Connecticut, with links to the original reporting and what each fire teaches homeowners.',
    image: SITE.ogImage,
    h1: 'Chimney fires happen every week',
    summary: [...NEWS_STATS.lines, ...NEWS.map((n) => `${n.title} (${n.place}, ${n.state}, ${n.source}): ${n.summary} Lesson: ${n.lesson} ${n.url}`)],
    links: [{ label: 'Chimney Health Check', path: '/chimney-health-check' }, { label: 'Chimney cleaning', path: '/services/chimney-sweeping' }],
    crumbs: [HOME, { name: 'News', path: '/news' }],
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Chimney fire news', about: { '@id': ORG_ID }, hasPart: NEWS.map((n) => ({ '@type': 'NewsArticle', headline: n.title, url: n.url, publisher: { '@type': 'Organization', name: n.source } })) }],
    priority: 0.6,
    changefreq: 'weekly',
  });

  add({
    path: '/resources',
    title: 'Chimney Resources: Tools, Guides, Downloads and News',
    description: 'Free chimney tools and resources: the 2-minute health check, plain-English guides, downloadable guides for realtors, inspectors, contractors and property managers, and chimney fire news.',
    image: SITE.ogImage,
    h1: 'Everything you need to know about your chimney',
    summary: ['Free tools, plain-English guides, downloadable partner guides and chimney fire news.', ...PARTNER_INDUSTRIES.map((p) => `${p.guide.title}: ${p.guide.blurb}`)],
    links: [{ label: 'Chimney Health Check', path: '/chimney-health-check' }, { label: 'Guides', path: '/blog' }, { label: 'News', path: '/news' }, { label: 'Partners', path: '/partners' }],
    crumbs: [HOME, { name: 'Resources', path: '/resources' }],
    priority: 0.6,
  });

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

  routes.push(...extra);
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
