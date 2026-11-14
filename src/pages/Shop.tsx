/**
 * Fireplace Shop on the real manufacturer catalog (src/data/catalog).
 * Quote-request store: no prices online, no checkout. Every product links into
 * the Build Your Fireplace configurator with its defaults preselected.
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink, FileText, Flame, Heart, Plus, Trash2, X } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { applyHead } from '@/components/RouteHead';
import { FireButton, PageIntro, Reveal } from '@/components/ui';
import { buildLink, categorize, categorySlug, productPath } from '@/data/catalog/shop';
import { installNotes } from '@/data/catalog/summary';
import { FUEL_LABEL, KIND_LABEL, type Product } from '@/data/catalog/types';
import { brandNameFor, buildCatalogRoutes, catalogProducts } from '@/lib/catalogRoutes';
import { routeFor } from '@/lib/routes';
import { track } from '@/lib/track';
import NotFound from './NotFound';

const PRODUCTS = catalogProducts();
const CATS = categorize(PRODUCTS);
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
const ROUTES = new Map(buildCatalogRoutes().map((r) => [r.path, r]));

/* --------------------------- quote list store --------------------------- */
const KEY = 'fc.quote.v2';
const MAX = 8;
let ids: string[] = read();
const subs = new Set<() => void>();
function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string' && byId.has(x)).slice(0, MAX) : [];
  } catch {
    return [];
  }
}
function commit(next: string[]) {
  ids = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  subs.forEach((f) => f());
}
const quote = {
  toggle: (id: string) => {
    if (ids.includes(id)) commit(ids.filter((x) => x !== id));
    else if (ids.length < MAX) {
      commit([...ids, id]);
      track('shop_quote_add', { product: id });
    }
  },
  remove: (id: string) => commit(ids.filter((x) => x !== id)),
  clear: () => commit([]),
};
const useQuote = () =>
  useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => ids,
    () => [],
  );

/* --------------------------------- bits --------------------------------- */
const kindLine = (p: Product) => `${FUEL_LABEL[p.fuel]} ${KIND_LABEL[p.kind].toLowerCase()}`;
const title = (s: string) => s.replace(/^\w/, (x) => x.toUpperCase());

function ProductImg({ p, className = '' }: { p: Product; className?: string }) {
  const hero = p.images.hero;
  return (
    <div className={`grid place-items-center overflow-hidden bg-[#f4f1ea] ${className}`}>
      {hero ? (
        <img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.04]" />
      ) : (
        <Flame className="h-10 w-10 text-ember/50" aria-hidden />
      )}
    </div>
  );
}

function SaveButton({ id, full = false }: { id: string; full?: boolean }) {
  const list = useQuote();
  const on = list.includes(id);
  if (full)
    return (
      <button type="button" aria-pressed={on} onClick={() => quote.toggle(id)} className={`btn btn-lg ${on ? 'btn-ghost' : 'btn-primary'}`}>
        {on ? <Check className="h-5 w-5" aria-hidden /> : <Plus className="h-5 w-5" aria-hidden />}
        {on ? 'On your quote list' : 'Add to quote request'}
      </button>
    );
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        quote.toggle(id);
      }}
      className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-colors ${on ? 'border-ember bg-ember text-[#1a0d05]' : 'border-black/10 bg-white/80 text-[#1a0d05] hover:border-ember'}`}
      aria-label={on ? 'Remove from quote list' : 'Save to quote list'}
    >
      <Heart className={`h-4 w-4 ${on ? 'fill-current' : ''}`} aria-hidden />
    </button>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  return (
    <Reveal delay={(i % 4) * 0.04}>
      <Link to={productPath(p)} className="card lift group flex h-full flex-col overflow-hidden">
        <div className="relative">
          <ProductImg p={p} className="aspect-square" />
          <div className="absolute right-3 top-3">
            <SaveButton id={p.id} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">{brandNameFor(p)}</p>
          <h3 className="mt-1.5 text-lg leading-snug text-bone">{p.name}</h3>
          <p className="mt-1 text-sm text-dim">
            {kindLine(p)}
            {p.heat?.btuMax ? ` · up to ${p.heat.btuMax.toLocaleString()} BTU` : ''}
          </p>
          <span className="link-arrow mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-ember">
            View details <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function QuoteBar() {
  const list = useQuote();
  if (!list.length) return null;
  return (
    <div className="no-print fixed inset-x-3 bottom-[calc(5.2rem+env(safe-area-inset-bottom))] z-[44] mx-auto flex max-w-md items-center justify-between gap-3 rounded-full border border-ember/40 bg-ink-2/95 py-2 pl-5 pr-2 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl lg:bottom-6">
      <span className="text-sm text-bone">
        <Heart className="mr-1.5 inline h-4 w-4 fill-ember text-ember" aria-hidden />
        {list.length} saved for a quote
      </span>
      <Link to="/fireplace-shop/quote" className="btn btn-primary btn-sm">
        Request pricing <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

function BrandFilter({ products, brand, setBrand }: { products: Product[]; brand: string; setBrand: (b: string) => void }) {
  const brands = useMemo(() => [...new Set(products.map(brandNameFor))].sort(), [products]);
  if (brands.length < 2) return null;
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by brand">
      {['All brands', ...brands].map((b) => {
        const on = brand === b || (b === 'All brands' && !brand);
        return (
          <button key={b} type="button" aria-pressed={on} onClick={() => setBrand(b === 'All brands' ? '' : b)} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:text-bone'}`}>
            {b}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- pages --------------------------------- */
function ShopHome() {
  const r = routeFor('/fireplace-shop')!;
  const [brand, setBrand] = useState('');
  const featured = PRODUCTS.filter((p) => p.images.hero && (!brand || brandNameFor(p) === brand));
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Fireplace shop" lede={`${PRODUCTS.length} gas, wood, pellet and electric fireplaces, inserts and stoves from the brands homeowners trust. Save what you like and we will price it for your home.`}>
        <div className="flex flex-wrap gap-3">
          <a href="#categories" className="btn btn-primary">
            Browse by type
          </a>
          <FireButton placement="shop_intro" />
        </div>
      </PageIntro>
      <section id="categories" className="section scroll-mt-24">
        <div className="wrap">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATS.map((c, i) => {
              const lead = c.products.find((p) => p.images.gallery.length)?.images.gallery[0] ?? c.products[0]?.images.hero;
              return (
                <Reveal key={c.slug} delay={(i % 3) * 0.05}>
                  <Link to={`/fireplace-shop/${c.slug}`} className="card lift group block overflow-hidden">
                    <div className="zoom aspect-[16/10] overflow-hidden bg-[#f4f1ea]">
                      {lead && <img src={lead.src} alt={lead.alt} loading="lazy" className="h-full w-full object-cover" />}
                    </div>
                    <div className="p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-xl text-bone">{title(c.title)}</h2>
                        <span className="shrink-0 text-sm text-dim">{c.products.length} models</span>
                      </div>
                      <p className="mt-2 text-sm text-mute">{c.blurb}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-24 flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-md text-bone">All models</h2>
            <BrandFilter products={PRODUCTS} brand={brand} setBrand={setBrand} />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.slice(0, 48).map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} />
            ))}
          </div>
          {featured.length > 48 && <p className="mt-8 text-center text-mute">Browse a category above to see every model.</p>}
          <p className="mt-12 max-w-3xl text-sm text-dim">
            Product names, images and specifications are from each manufacturer. Availability and pricing are confirmed by First Chimney after an on-site measure. No prices or checkout online.
          </p>
        </div>
      </section>
    </>
  );
}

function CategoryPage({ slug }: { slug: string }) {
  const c = CATS.find((x) => x.slug === slug);
  const [brand, setBrand] = useState('');
  if (!c) return <NotFound />;
  const r = ROUTES.get(`/fireplace-shop/${slug}`)!;
  const list = c.products.filter((p) => !brand || brandNameFor(p) === brand);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title={title(c.title)} lede={c.blurb} />
      <section className="section pt-12">
        <div className="wrap">
          <nav aria-label="Categories" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <ul className="flex min-w-max gap-2 lg:min-w-0 lg:flex-wrap">
              {CATS.map((x) => (
                <li key={x.slug}>
                  <Link to={`/fireplace-shop/${x.slug}`} aria-current={x.slug === slug ? 'page' : undefined} className={`block rounded-full border px-4 py-2 text-sm transition-colors ${x.slug === slug ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:text-bone'}`}>
                    {title(x.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8">
            <BrandFilter products={c.products} brand={brand} setBrand={setBrand} />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductPage({ cat, slug }: { cat: string; slug: string }) {
  const p = PRODUCTS.find((x) => x.slug === slug && categorySlug(x) === cat);
  const [shot, setShot] = useState(0);
  if (!p) return <NotFound />;
  const images = [p.images.hero, ...p.images.gallery].filter(Boolean) as NonNullable<Product['images']['hero']>[];
  const current = images[Math.min(shot, images.length - 1)];
  const related = CATS.find((c) => c.slug === cat)!.products.filter((x) => x.id !== p.id).slice(0, 4);
  const brand = brandNameFor(p);
  return (
    <>
      <section className="pb-16 pt-32 md:pt-40">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-w-0">
            <div className="media aspect-[4/3] border hairline bg-[#f4f1ea]">
              {current ? <img src={current.src} alt={current.alt} className="!object-contain p-6" /> : <ProductImg p={p} className="h-full" />}
            </div>
            {images.length > 1 && (
              <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="More photos">
                {images.slice(0, 12).map((im, i) => (
                  <li key={im.src} className="shrink-0">
                    <button type="button" onClick={() => setShot(i)} aria-pressed={i === shot} aria-label={`Photo ${i + 1}`} className={`block h-16 w-20 overflow-hidden rounded-xl border-2 bg-[#f4f1ea] ${i === shot ? 'border-ember' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                      <img src={im.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-sm text-dim">
              <Link to="/fireplace-shop" className="hover:text-bone">
                Fireplace Shop
              </Link>{' '}
              /{' '}
              <Link to={`/fireplace-shop/${cat}`} className="hover:text-bone">
                {title(CATS.find((c) => c.slug === cat)!.title)}
              </Link>
            </nav>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-gold">{brand}</p>
            <h1 className="display-lg mt-2 text-bone">{p.name}</h1>
            <p className="mt-2 text-mute">
              {kindLine(p)}
              {p.sku ? ` · Model ${p.sku}` : ''}
            </p>
            <p className="lede mt-5">{p.summary}</p>
            {(p.heat?.btuMax || p.heat?.areaSqFt) && (
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {p.heat?.btuMax && (
                  <div className="card p-4">
                    <dt className="text-xs text-dim">Max output</dt>
                    <dd className="mt-1 text-xl font-semibold text-bone">{p.heat.btuMax.toLocaleString()} BTU</dd>
                  </div>
                )}
                {p.heat?.areaSqFt && (
                  <div className="card p-4">
                    <dt className="text-xs text-dim">Heats up to</dt>
                    <dd className="mt-1 text-xl font-semibold text-bone">{p.heat.areaSqFt.toLocaleString()} sq ft</dd>
                  </div>
                )}
              </dl>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <FireButton placement="product_page" size="lg" label="Customize this model" to={buildLink(p)} />
              <SaveButton id={p.id} full />
            </div>
            <p className="mt-5 text-sm text-dim">No price online. We measure first, then send a written, itemized quote.</p>
          </div>
        </div>
      </section>
      <section className="section border-t hairline pt-16">
        <div className="wrap grid gap-6 lg:grid-cols-2">
          {p.specs.length > 0 && (
            <div className="card p-7">
              <h2 className="text-xl text-bone">Specs from the maker</h2>
              <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {p.specs.slice(0, 14).map((s) => (
                  <div key={s.label}>
                    <dt className="text-sm text-dim">{s.label}</dt>
                    <dd className="font-medium text-bone">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="card p-7">
            <h2 className="text-xl text-bone">What we check before it is ordered</h2>
            <ul className="mt-5 grid gap-3">
              {installNotes(p).map((n) => (
                <li key={n} className="flex gap-3 text-mute">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ember" aria-hidden /> {n}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-mute hover:text-bone">
                Manufacturer page <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
              {p.docs.slice(0, 3).map((d) => (
                <a key={d.url} href={d.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-mute hover:text-bone">
                  <FileText className="h-3.5 w-3.5" aria-hidden /> {d.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        {p.makerDescription && (
          <div className="wrap mt-6">
            <div className="card p-7">
              <h2 className="text-xl text-bone">About the {p.name}</h2>
              <p className="mt-4 max-w-4xl leading-relaxed text-mute">{p.makerDescription}</p>
            </div>
          </div>
        )}
        {related.length > 0 && (
          <div className="wrap mt-20">
            <h2 className="display-md text-bone">Compare with</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((x, i) => (
                <ProductCard key={x.id} p={x} i={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function QuotePage() {
  const r = routeFor('/fireplace-shop/quote')!;
  const list = useQuote();
  const items = list.map((id) => byId.get(id)!).filter(Boolean);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Your quote request" lede="Send the models you saved and we will follow up with options and pricing for your home." />
      <section className="section pt-14">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div className="min-w-0">
            {items.length === 0 ? (
              <div className="card grid place-items-center p-12 text-center">
                <Heart className="h-8 w-8 text-ember" aria-hidden />
                <h2 className="mt-5 text-xl text-bone">Nothing saved yet</h2>
                <p className="mt-2 max-w-sm text-mute">Tap the heart on any model to add it here, or just send a request and tell us what you are looking for.</p>
                <Link to="/fireplace-shop" className="btn btn-primary mt-7">
                  Browse the shop
                </Link>
              </div>
            ) : (
              <ul className="grid gap-3">
                {items.map((p) => (
                  <li key={p.id} className="card flex items-center gap-4 p-3 pr-4">
                    <ProductImg p={p} className="h-20 w-24 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gold">{brandNameFor(p)}</p>
                      <Link to={productPath(p)} className="font-medium text-bone hover:text-ember">
                        {p.name}
                      </Link>
                      <p className="text-xs text-dim">{kindLine(p)}</p>
                    </div>
                    <button type="button" onClick={() => quote.remove(p.id)} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-mute hover:text-err" aria-label={`Remove ${p.name}`}>
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={quote.clear} className="mt-2 inline-flex items-center gap-2 text-sm text-dim hover:text-bone">
                    <Trash2 className="h-4 w-4" aria-hidden /> Clear list
                  </button>
                </li>
              </ul>
            )}
          </div>
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl text-bone">Request pricing</h2>
            <p className="mt-2 text-sm text-mute">Pricing depends on your fireplace, venting and installation, so we confirm it with you directly.</p>
            <div className="mt-6">
              <LeadForm
                formId="shop-quote"
                fields={['name', 'phone', 'email', 'city', 'state', 'zip', 'message']}
                required={['name', 'zip']}
                products={items.map((p) => `${brandNameFor(p)} ${p.name} (${kindLine(p)}${p.sku ? `, ${p.sku}` : ''})`)}
                submitLabel="Request my quote"
                messageLabel="About your fireplace"
                messagePlaceholder="Existing fireplace size, fuel you have now, what you want to change..."
                successTitle="Quote request sent."
                successBody={<p>We received your list and will follow up with options and pricing. Nothing has been ordered or charged.</p>}
                onSuccess={() => quote.clear()}
                dense
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Shop() {
  const { category, product } = useParams();
  const path = category ? `/fireplace-shop/${category}${product ? `/${product}` : ''}` : '/fireplace-shop';
  useEffect(() => {
    const meta = ROUTES.get(path);
    if (meta) applyHead(meta);
  }, [path]);
  let page;
  if (!category) page = <ShopHome />;
  else if (category === 'quote') page = <QuotePage />;
  else if (!product) page = <CategoryPage slug={category} />;
  else page = <ProductPage cat={category} slug={product} />;
  return (
    <>
      {page}
      {category !== 'quote' && <QuoteBar />}
    </>
  );
}
