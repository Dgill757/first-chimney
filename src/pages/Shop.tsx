/**
 * Fireplace Shop. Quote-request store, not a checkout (see src/data/shop.ts).
 * The quote list is a tiny external store so the header badge, product pages and
 * the quote page stay in sync, and a real cart could replace it later.
 */
import { useSyncExternalStore } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Heart, Info, Plus, Trash2, X } from 'lucide-react';
import FireplacePreview from '@/components/FireplacePreview';
import LeadForm from '@/components/LeadForm';
import { PageIntro, Reveal } from '@/components/ui';
import { CATALOG_STATUS, PRODUCTS, SHOP_CATEGORIES, categoryById, productById, productsIn, type Product } from '@/data/shop';
import { encodeDesign } from '@/data/designer';
import { routeFor } from '@/lib/routes';
import { track } from '@/lib/track';
import NotFound from './NotFound';

const KEY = 'fc.quote.v1';
const MAX = 8;
let ids: string[] = read();
const subs = new Set<() => void>();
function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string' && productById(x)).slice(0, MAX) : [];
  } catch {
    return [];
  }
}
function commit(next: string[]) {
  ids = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: works for this tab */
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
function useQuote(): string[] {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => ids,
    () => [],
  );
}

function PreviewNotice() {
  if (CATALOG_STATUS !== 'preview') return null;
  return (
    <p className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-ink-2 p-4 text-sm text-mute">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
      Products are shown by type. Brands, models, availability and pricing are confirmed with First Chimney during your consultation. There is no online checkout.
    </p>
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

function SaveButton({ id, full = false }: { id: string; full?: boolean }) {
  const list = useQuote();
  const on = list.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        quote.toggle(id);
      }}
      className={full ? `btn ${on ? 'btn-ghost' : 'btn-primary'} btn-lg` : `grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-colors ${on ? 'border-ember bg-ember text-[#1a0d05]' : 'border-white/20 bg-ink/60 text-bone hover:border-ember'}`}
      aria-label={full ? undefined : on ? 'Remove from quote list' : 'Save to quote list'}
    >
      {full ? (
        on ? (
          <>
            <Check className="h-5 w-5" aria-hidden /> Saved to quote list
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" aria-hidden /> Add to quote request
          </>
        )
      ) : (
        <Heart className={`h-4 w-4 ${on ? 'fill-current' : ''}`} aria-hidden />
      )}
    </button>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  const cat = categoryById(p.category)!;
  return (
    <Reveal delay={(i % 3) * 0.05}>
      <Link to={`/fireplace-shop/${p.category}/${p.id}`} className="card lift group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden border-b hairline">
          <FireplacePreview design={p.art} animate={false} className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.03]" title={`${p.name} illustration`} />
          <div className="absolute right-3 top-3">
            <SaveButton id={p.id} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-medium text-dim">{cat.name}</p>
          <h3 className="mt-1.5 text-lg text-bone">{p.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">{p.summary}</p>
          <span className="link-arrow mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-ember">
            Details <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function ShopHome() {
  const r = routeFor('/fireplace-shop')!;
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Fireplace shop" lede="Explore inserts, gas and electric fireplaces, mantels, doors and chimney caps. Save what you like and we will price it for your home.">
        <div className="flex flex-wrap gap-3">
          <a href="#categories" className="btn btn-primary">
            Browse categories
          </a>
          <Link to="/design-your-fireplace" className="btn btn-ghost">
            Design your fireplace first
          </Link>
        </div>
      </PageIntro>
      <section id="categories" className="section scroll-mt-24">
        <div className="wrap">
          <PreviewNotice />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SHOP_CATEGORIES.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 0.05}>
                <Link to={`/fireplace-shop/${c.id}`} className="card lift group block overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden border-b hairline">
                    <FireplacePreview design={c.art} animate={false} className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.03]" title={`${c.name} illustration`} />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl text-bone">{c.name}</h2>
                      <span className="text-sm text-dim">{productsIn(c.id).length} options</span>
                    </div>
                    <p className="mt-2 text-sm text-mute">{c.blurb}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <h2 className="display-md mt-24 text-bone">All products</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryPage({ id }: { id: string }) {
  const c = categoryById(id);
  const r = routeFor(`/fireplace-shop/${id}`);
  if (!c || !r) return <NotFound />;
  const items = productsIn(id);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title={c.name} lede={c.blurb} />
      <section className="section">
        <div className="wrap">
          <nav aria-label="Categories" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <ul className="flex min-w-max gap-2">
              {SHOP_CATEGORIES.map((x) => (
                <li key={x.id}>
                  <Link to={`/fireplace-shop/${x.id}`} aria-current={x.id === id ? 'page' : undefined} className={`block rounded-full border px-4 py-2 text-sm transition-colors ${x.id === id ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:text-bone'}`}>
                    {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8">
            <PreviewNotice />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductPage({ cat, id }: { cat: string; id: string }) {
  const p = productById(id);
  const r = routeFor(`/fireplace-shop/${cat}/${id}`);
  if (!p || p.category !== cat || !r) return <NotFound />;
  const related = productsIn(cat).filter((x) => x.id !== id);
  return (
    <>
      <section className="pb-16 pt-32 md:pt-40">
        <div className="wrap grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="media aspect-[4/3] border hairline">
            <FireplacePreview design={p.art} className="h-full w-full" title={`${p.name} illustration`} />
          </div>
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-dim">
              <Link to="/fireplace-shop" className="hover:text-bone">
                Fireplace Shop
              </Link>{' '}
              /{' '}
              <Link to={`/fireplace-shop/${cat}`} className="hover:text-bone">
                {categoryById(cat)?.name}
              </Link>
            </nav>
            <h1 className="display-lg mt-5 text-bone">{p.name}</h1>
            <p className="lede mt-4">{p.summary}</p>
            <p className="mt-5 text-bone">
              <span className="text-dim">Best for: </span>
              {p.bestFor}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SaveButton id={p.id} full />
              <Link to={`/design-your-fireplace?${encodeDesign(p.art)}`} className="btn btn-ghost btn-lg">
                Try it in the designer
              </Link>
            </div>
            <div className="mt-8">
              <PreviewNotice />
            </div>
          </div>
        </div>
      </section>
      <section className="section border-t hairline pt-16">
        <div className="wrap grid gap-6 md:grid-cols-2">
          <div className="card p-7">
            <h2 className="text-xl text-bone">Features</h2>
            <ul className="mt-5 grid gap-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-mute">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ember" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-7">
            <h2 className="text-xl text-bone">Good to know before you buy</h2>
            <ul className="mt-5 grid gap-3">
              {p.considerations.map((f) => (
                <li key={f} className="flex gap-3 text-mute">
                  <Info className="mt-1 h-4 w-4 shrink-0 text-ember" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {related.length > 0 && (
          <div className="wrap mt-20">
            <h2 className="display-md text-bone">Compare with</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  const items = list.map((id) => productById(id)!).filter(Boolean);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Your quote request" lede="Send the products you saved and we will follow up with options and pricing for your home." />
      <section className="section pt-14">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div>
            {items.length === 0 ? (
              <div className="card grid place-items-center p-12 text-center">
                <Heart className="h-8 w-8 text-ember" aria-hidden />
                <h2 className="mt-5 text-xl text-bone">Nothing saved yet</h2>
                <p className="mt-2 max-w-sm text-mute">Tap the heart on any product to add it here, or just send a request and tell us what you are looking for.</p>
                <Link to="/fireplace-shop" className="btn btn-primary mt-7">
                  Browse the shop
                </Link>
              </div>
            ) : (
              <ul className="grid gap-3">
                {items.map((p) => (
                  <li key={p.id} className="card flex items-center gap-4 p-3 pr-4">
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                      <FireplacePreview design={p.art} animate={false} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-dim">{categoryById(p.category)?.name}</p>
                      <Link to={`/fireplace-shop/${p.category}/${p.id}`} className="font-medium text-bone hover:text-ember">
                        {p.name}
                      </Link>
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
                products={items.map((p) => `${p.name} (${categoryById(p.category)?.name})`)}
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
  let page;
  if (!category) page = <ShopHome />;
  else if (category === 'quote') page = <QuotePage />;
  else if (!product) page = <CategoryPage id={category} />;
  else page = <ProductPage cat={category} id={product} />;
  return (
    <>
      {page}
      {category !== 'quote' && <QuoteBar />}
    </>
  );
}
