/**
 * SEO routes for the fireplace shop: one page per category and per model.
 *
 * Imports the catalog JSON directly, so it is used only by the build-time
 * prerender and the lazily loaded shop page, never by the main bundle.
 */
import enviro from '../data/catalog/products/enviro.json';
import kozy from '../data/catalog/products/kozy.json';
import modernflames from '../data/catalog/products/modernflames.json';
import simplifire from '../data/catalog/products/simplifire.json';
import travis from '../data/catalog/products/travis.json';
import valor from '../data/catalog/products/valor.json';
import { BRANDS } from '../data/catalog/brands';
import { categorize, categorySlug, productLd, productPath } from '../data/catalog/shop';
import { FUEL_LABEL, KIND_LABEL, type Product } from '../data/catalog/types';
import type { RouteMeta } from './routes';
import { SITE, STATE_LIST_TEXT } from './site';

export function catalogProducts(): Product[] {
  const enabled = new Set(BRANDS.filter((b) => b.enabled).map((b) => b.id));
  const seen = new Set<string>();
  return ([...travis, ...valor, ...enviro, ...kozy, ...modernflames, ...simplifire] as unknown as Product[])
    .filter((p) => p.enabled && enabled.has(p.brandId))
    .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
}

export const brandNameFor = (p: Product) =>
  [BRANDS.find((b) => b.id === p.brandId)?.name, ...(p.altBrandIds ?? []).map((id) => BRANDS.find((b) => b.id === id)?.name)].filter(Boolean).join(' / ');

const abs = (p: string) => `${SITE.domain}${p}`;
const crumbsBase = [
  { name: 'Home', path: '/' },
  { name: 'Fireplace Shop', path: '/fireplace-shop' },
];

export function buildCatalogRoutes(): RouteMeta[] {
  const products = catalogProducts();
  const cats = categorize(products);
  const out: RouteMeta[] = [];
  for (const c of cats) {
    const path = `/fireplace-shop/${c.slug}`;
    const brands = [...new Set(c.products.map(brandNameFor))].join(', ');
    out.push({
      path,
      title: `${c.title.replace(/^\w/, (x) => x.toUpperCase())}: ${brands}`,
      description: `${c.blurb} Browse ${c.products.length} ${c.title} from ${brands}. Sourced, installed and serviced by First Chimney in ${STATE_LIST_TEXT}.`.slice(0, 300),
      image: c.products[0]?.images.hero?.src ?? SITE.ogImage,
      h1: c.title.replace(/^\w/, (x) => x.toUpperCase()),
      summary: [c.blurb, ...c.products.map((p) => `${brandNameFor(p)} ${p.name}: ${p.summary}`)],
      links: c.products.map((p) => ({ label: `${brandNameFor(p)} ${p.name}`, path: productPath(p) })),
      crumbs: [...crumbsBase, { name: c.title, path }],
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [...crumbsBase, { name: c.title, path }].map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: abs(x.path) })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: c.title,
          itemListElement: c.products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productPath(p)), name: `${brandNameFor(p)} ${p.name}` })),
        },
      ],
      priority: 0.6,
      changefreq: 'monthly',
    });
    for (const p of c.products) {
      const brand = brandNameFor(p);
      const ppath = productPath(p);
      const kind = `${FUEL_LABEL[p.fuel]} ${KIND_LABEL[p.kind].toLowerCase()}`;
      out.push({
        path: ppath,
        title: `${brand} ${p.name} ${kind}`,
        description: `${brand} ${p.name}: ${p.summary} Request pricing and installation from First Chimney Contracting in ${STATE_LIST_TEXT}.`.slice(0, 300),
        image: p.images.hero?.src ?? SITE.ogImage,
        h1: `${brand} ${p.name}`,
        summary: [
          p.summary,
          `${brand} ${p.name} is a ${kind}${p.sku ? ` (model ${p.sku})` : ''}.`,
          ...(p.heat?.btuMax ? [`Maker rating: up to ${p.heat.btuMax.toLocaleString()} BTU${p.heat.areaSqFt ? `, heats up to ${p.heat.areaSqFt.toLocaleString()} sq ft` : ''}.`] : []),
          ...p.specs.slice(0, 8).map((s) => `${s.label}: ${s.value}`),
          `First Chimney measures, checks venting and confirms fit on site, then provides a written quote. Manufacturer page: ${p.sourceUrl}`,
        ],
        links: [
          { label: c.title, path: `/fireplace-shop/${categorySlug(p)}` },
          { label: 'Build your fireplace', path: '/build-your-fireplace' },
        ],
        crumbs: [...crumbsBase, { name: c.title, path: `/fireplace-shop/${c.slug}` }, { name: `${brand} ${p.name}`, path: ppath }],
        jsonLd: [
          productLd(p, SITE.domain, brand, p.images.hero ? abs(p.images.hero.src) : undefined),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [...crumbsBase, { name: c.title, path: `/fireplace-shop/${c.slug}` }, { name: `${brand} ${p.name}`, path: ppath }].map((x, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: x.name,
              item: abs(x.path),
            })),
          },
        ],
        priority: 0.5,
        changefreq: 'monthly',
      });
    }
  }
  return out;
}
