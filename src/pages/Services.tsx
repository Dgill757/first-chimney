import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, CircleAlert } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { Breadcrumbs, CallLink, Faq, FireButton, PageIntro, Reveal, SERVICE_ICONS } from '@/components/ui';
import { ARTICLES } from '@/data/blog';
import { SERVICES, serviceById } from '@/data/services';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { routeFor } from '@/lib/routes';
import { CREDENTIALS, STATE_LIST_TEXT } from '@/lib/site';
import { track } from '@/lib/track';
import NotFound from './NotFound';

export function ServicesOverview() {
  const r = routeFor('/services')!;
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Chimney and fireplace services" lede={`Inspection, cleaning and repair for homeowners in ${STATE_LIST_TEXT}. Every visit ends with plain-English findings and quotes before any repair.`} />
      <section className="section">
        <div className="wrap grid gap-5">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <Reveal key={s.id} delay={0.03 * (i % 4)}>
                <Link to={`/services/${s.id}`} className="card lift group grid items-center gap-6 overflow-hidden p-4 sm:grid-cols-[14rem_1fr_auto] sm:p-5">
                  <div className="zoom aspect-[16/10] overflow-hidden rounded-[14px] sm:aspect-[4/3]">
                    <img src={s.image} alt={s.imageAlt} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="px-2 sm:px-0">
                    <h2 className="flex items-center gap-3 text-2xl text-bone">
                      <Icon className="h-6 w-6 text-ember" strokeWidth={1.75} aria-hidden /> {s.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-mute">{s.short}</p>
                  </div>
                  <ArrowUpRight className="mx-2 hidden h-6 w-6 text-dim transition-colors group-hover:text-ember sm:block" aria-hidden />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

export function ServiceDetail() {
  const { serviceId = '' } = useParams();
  const s = serviceById(serviceId);
  const r = routeFor(`/services/${serviceId}`);
  if (!s || !r) return <NotFound />;
  const Icon = SERVICE_ICONS[s.icon];
  const live = promoIsLive();
  const promoFit = live && (s.id === 'chimney-sweeping' || s.id === 'chimney-inspection');
  const articles = ARTICLES.filter((a) => a.relatedServices.includes(s.id)).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div aria-hidden className="absolute inset-0">
          <img src={s.image} alt="" className="h-full w-full object-cover opacity-30" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>
        <div className="wrap relative">
          <Breadcrumbs crumbs={r.crumbs} />
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-mute">
            <Icon className="h-5 w-5 text-ember" strokeWidth={1.75} aria-hidden /> {s.title}
          </p>
          <h1 className="display-xl mt-4 max-w-4xl text-bone">{s.headline}</h1>
          <p className="lede mt-6">{s.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            {promoFit ? (
              <Link to={HOLIDAY_PROMO.path} onClick={() => track('promo_cta_click', { placement: `service_${s.id}` })} className="btn btn-primary btn-lg">
                {HOLIDAY_PROMO.priceLabel} holiday special
              </Link>
            ) : (
              <a href="#request" className="btn btn-primary btn-lg">
                Request this service <ArrowRight className="h-5 w-5" aria-hidden />
              </a>
            )}
            <CallLink placement={`service_${s.id}`} className="btn btn-ghost btn-lg" />
            {s.id === 'fireplace-repair' && <FireButton placement="service_fireplace" size="lg" />}
          </div>
        </div>
      </section>

      {/* Direct answer, written to be quoted */}
      <section className="border-y hairline bg-ink-2">
        <div className="wrap grid gap-6 py-12 md:grid-cols-[14rem_1fr] md:py-16">
          <h2 className="text-lg text-bone" style={{ fontFamily: 'var(--font-sans)', fontStretch: '100%', letterSpacing: 0 }}>
            The short answer
          </h2>
          <p className="max-w-3xl text-[1.15rem] leading-relaxed text-bone/90">{s.answer}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-6 lg:grid-cols-2">
          <Reveal className="card p-7 sm:p-9">
            <h2 className="display-md text-bone">Signs you need it</h2>
            <ul className="mt-7 grid gap-4">
              {s.signs.map((x) => (
                <li key={x} className="flex gap-3 text-mute">
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-ember" strokeWidth={1.75} aria-hidden /> {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="card p-7 sm:p-9">
            <h2 className="display-md text-bone">What is included</h2>
            <ul className="mt-7 grid gap-4">
              {s.included.map((x) => (
                <li key={x} className="flex gap-3 text-mute">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-ember" strokeWidth={2} aria-hidden /> {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section border-t hairline">
        <div className="wrap">
          <h2 className="display-md text-bone">How we do it</h2>
          <ol className={`mt-10 grid gap-px overflow-hidden rounded-[20px] border hairline bg-white/[0.06] sm:grid-cols-2 ${s.process.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {s.process.map((p, i) => (
              <li key={p.title} className="bg-ink p-7">
                <span className="font-display text-3xl font-bold text-ember/80" style={{ fontStretch: '112%' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-lg text-bone">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{p.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-dim">Inspections are performed with {CREDENTIALS.fire.fullName}.</p>
        </div>
      </section>

      <section className="section border-t hairline">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="display-md text-bone">{s.title} questions</h2>
          <Faq items={s.faqs} />
        </div>
      </section>

      <section className="section border-t hairline bg-ink-2">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div>
            <h2 className="display-md text-bone">Related</h2>
            <ul className="mt-8 grid gap-3">
              {s.related.map((id) => {
                const x = serviceById(id)!;
                const I = SERVICE_ICONS[x.icon];
                return (
                  <li key={id}>
                    <Link to={`/services/${id}`} className="card lift flex items-center gap-4 p-4">
                      <I className="h-5 w-5 text-ember" strokeWidth={1.75} aria-hidden />
                      <span className="flex-1 text-bone">{x.title}</span>
                      <ArrowRight className="h-4 w-4 text-dim" aria-hidden />
                    </Link>
                  </li>
                );
              })}
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link to={`/blog/${a.slug}`} className="flex items-center gap-4 rounded-2xl px-4 py-3 text-mute hover:text-bone">
                    <span className="text-xs uppercase tracking-[0.12em] text-dim">Guide</span>
                    <span className="flex-1">{a.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div id="request" className="card scroll-mt-28 p-6 sm:p-8">
            <h2 className="text-xl text-bone">Request {s.title.toLowerCase()}</h2>
            <div className="mt-5">
              <LeadForm formId="service-request" defaultService={s.title} fields={['name', 'phone', 'email', 'zip', 'service', 'message']} required={['name', 'phone', 'zip']} submitLabel="Send my request" dense />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
