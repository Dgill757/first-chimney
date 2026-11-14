import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, ExternalLink, Lightbulb } from 'lucide-react';
import { Breadcrumbs, CallLink, PageIntro, Reveal } from '@/components/ui';
import { ARTICLES, articleBySlug, type Article } from '@/data/blog';
import { serviceById } from '@/data/services';
import { SOURCES } from '@/data/sources';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { routeFor } from '@/lib/routes';
import { SITE } from '@/lib/site';
import NotFound from './NotFound';

const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const CATS = ['All', ...Array.from(new Set(ARTICLES.map((a) => a.category)))];

function Card({ a, i, big = false }: { a: Article; i: number; big?: boolean }) {
  return (
    <Reveal delay={(i % 3) * 0.05} className={big ? 'md:col-span-2' : ''}>
      <Link to={`/blog/${a.slug}`} className={`card lift group grid h-full overflow-hidden ${big ? 'md:grid-cols-[1.2fr_1fr]' : ''}`}>
        <div className={`zoom overflow-hidden ${big ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}>
          <img src={a.image} alt={a.imageAlt} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col p-6 sm:p-7">
          <p className="flex items-center gap-3 text-xs text-dim">
            <span className="rounded-full border border-white/12 px-2.5 py-0.5 text-mute">{a.category}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {a.readMinutes} min
            </span>
          </p>
          <h2 className={`mt-4 text-bone ${big ? 'text-3xl' : 'text-xl'}`}>{a.title}</h2>
          <p className="mt-3 line-clamp-3 text-mute">{a.description}</p>
          <span className="link-arrow mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-ember">
            Read <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function BlogIndex() {
  const r = routeFor('/blog')!;
  const [cat, setCat] = useState('All');
  const list = ARTICLES.filter((a) => cat === 'All' || a.category === cat);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Chimney care, explained." lede="Practical guides for homeowners. No jargon, no scare tactics, and sources for every safety claim." />
      <section className="section pt-12">
        <div className="wrap">
          <div role="tablist" aria-label="Categories" className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${cat === c ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:text-bone'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => (
              <Card key={a.slug} a={a} i={i} big={i === 0 && cat === 'All'} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ArticleCta({ kind }: { kind: Article['cta'] }) {
  const live = promoIsLive();
  if (kind === 'holiday' && live) {
    return (
      <aside className="card my-12 flex flex-wrap items-center justify-between gap-6 border-ember/30 p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ember">{HOLIDAY_PROMO.eyebrow}</p>
          <p className="mt-2 text-xl text-bone">{HOLIDAY_PROMO.title}</p>
        </div>
        <div className="flex items-center gap-5">
          <span className="price-199 text-5xl">{HOLIDAY_PROMO.priceLabel}</span>
          <Link to={HOLIDAY_PROMO.path} className="btn btn-primary">
            Claim it
          </Link>
        </div>
      </aside>
    );
  }
  return (
    <aside className="card my-12 flex flex-wrap items-center justify-between gap-6 p-7">
      <p className="max-w-md text-lg text-bone">{kind === 'repair' ? 'Seeing any of these signs? We will find the source before recommending a fix.' : 'Want a professional look at your chimney?'}</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/contact" className="btn btn-primary">
          Schedule service
        </Link>
        <CallLink placement="article_cta" />
      </div>
    </aside>
  );
}

export function BlogPost() {
  const { slug = '' } = useParams();
  const a = articleBySlug(slug);
  const r = routeFor(`/blog/${slug}`);
  if (!a || !r) return <NotFound />;
  const mid = Math.floor(a.body.length / 2);
  const more = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <>
      <article>
        <header className="pb-12 pt-32 md:pt-40">
          <div className="wrap max-w-4xl">
            <Breadcrumbs crumbs={r.crumbs} />
            <p className="mt-8 flex flex-wrap items-center gap-3 text-sm text-dim">
              <span className="rounded-full border border-white/12 px-3 py-0.5 text-mute">{a.category}</span>
              <span>
                By {SITE.name}. Updated <time dateTime={a.dateModified}>{fmt(a.dateModified)}</time>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden /> {a.readMinutes} min read
              </span>
            </p>
            <h1 className="display-lg mt-5 text-bone">{a.title}</h1>
            <p className="lede mt-5">{a.description}</p>
          </div>
          <div className="wrap mt-12 max-w-5xl">
            <div className="media aspect-[2/1]">
              <img src={a.image} alt={a.imageAlt} fetchPriority="high" />
            </div>
          </div>
        </header>
        <div className="wrap max-w-3xl pb-16">
          <section className="card p-6 sm:p-7" aria-labelledby="takeaways">
            <h2 id="takeaways" className="flex items-center gap-2 text-lg text-bone">
              <Lightbulb className="h-5 w-5 text-ember" strokeWidth={1.75} aria-hidden /> Key takeaways
            </h2>
            <ul className="mt-4 grid gap-2.5 text-mute">
              {a.takeaways.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </section>
          <div className="mt-10 text-[1.08rem] leading-[1.8] text-bone/85">
            {a.body.map((b, i) => (
              <div key={i}>
                {i === mid && <ArticleCta kind={a.cta} />}
                {b.type === 'h2' && <h2 className="mb-4 mt-12 text-[1.65rem] text-bone">{b.text}</h2>}
                {b.type === 'p' && <p className="mt-5">{b.text}</p>}
                {b.type === 'list' && (
                  <ul className="mt-5 grid gap-2.5">
                    {b.items.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden /> {x}
                      </li>
                    ))}
                  </ul>
                )}
                {b.type === 'callout' && (
                  <aside className="mt-8 rounded-[20px] border-l-4 border-ember bg-ink-2 p-6">
                    <p className="font-medium text-bone">{b.title}</p>
                    <p className="mt-2 text-mute">{b.text}</p>
                  </aside>
                )}
              </div>
            ))}
          </div>
          <section className="mt-14 border-t hairline pt-8" aria-labelledby="sources">
            <h2 id="sources" className="flex items-center gap-2 text-base text-bone" style={{ fontFamily: 'var(--font-sans)', fontStretch: '100%', letterSpacing: 0 }}>
              <BookOpen className="h-4 w-4 text-ember" aria-hidden /> Sources
            </h2>
            <ul className="mt-4 grid gap-2 text-sm">
              {a.sources.map((id) => (
                <li key={id}>
                  <a href={SOURCES[id].url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-mute hover:text-bone">
                    {SOURCES[id].publisher}: {SOURCES[id].label} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-dim">
              Related services:{' '}
              {a.relatedServices.map((id, i) => (
                <span key={id}>
                  {i > 0 && ', '}
                  <Link to={`/services/${id}`} className="text-ember hover:underline">
                    {serviceById(id)?.title}
                  </Link>
                </span>
              ))}
            </p>
          </section>
        </div>
      </article>
      <section className="section border-t hairline bg-ink-2">
        <div className="wrap">
          <h2 className="display-md text-bone">Keep reading</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {more.map((x, i) => (
              <Card key={x.slug} a={x} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
