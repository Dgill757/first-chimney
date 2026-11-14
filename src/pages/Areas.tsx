import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CloudRain, Home, MapPin } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { Faq, FireButton, PageIntro, Reveal, SERVICE_ICONS } from '@/components/ui';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { JOB_PHOTOS, TEAM } from '@/data/team';

const STATE_PHOTO: Record<string, (typeof JOB_PHOTOS)[number]> = { virginia: TEAM.inspectionRoof, 'new-jersey': TEAM.rebuild, connecticut: TEAM.crown, massachusetts: TEAM.capCrown };
const photoFor = (slug: string) => {
  const pool = JOB_PHOTOS.filter((p) => p.category !== 'Andrew & the crew');
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
};
import { SERVICE_AREAS, isPublishableCity, publishedCities, stateBySlug } from '@/data/serviceAreas';
import { SERVICES } from '@/data/services';
import { routeFor } from '@/lib/routes';
import { SITE } from '@/lib/site';
import NotFound from './NotFound';

export function ServiceAreasHub() {
  const r = routeFor('/service-areas')!;
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Where we work" lede="First Chimney Contracting serves homeowners in four states. Not sure if we reach your town? Send your address and we will confirm before you book." />
      <section className="section">
        <div className="wrap grid gap-5 md:grid-cols-2">
          {SERVICE_AREAS.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.06}>
              <Link to={`/service-areas/${s.slug}`} className="card lift group flex h-full flex-col p-8">
                <div className="flex items-start justify-between">
                  <span className="font-display text-6xl font-bold text-ember/25" style={{ fontStretch: '115%' }} aria-hidden>
                    {s.code}
                  </span>
                  <ArrowRight className="h-6 w-6 text-dim transition-colors group-hover:text-ember" aria-hidden />
                </div>
                <h2 className="mt-6 text-3xl text-bone">{s.name}</h2>
                <p className="mt-3 leading-relaxed text-mute">{s.intro}</p>
              </Link>
              {publishedCities(s).length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2 px-1">
                  {publishedCities(s).map((c) => (
                    <li key={c.slug}>
                      <Link to={`/service-areas/${s.slug}/${c.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-sm text-mute hover:border-ember hover:text-bone">
                        <MapPin className="h-3.5 w-3.5 text-ember" aria-hidden /> {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function StateArea() {
  const { state = '', city } = useParams();
  const s = stateBySlug(state);
  if (!s) return <NotFound />;
  if (city) {
    const c = s.cities.find((x) => x.slug === city);
    if (!c || !isPublishableCity(c)) return <NotFound />;
    return <CityArea stateSlug={s.slug} citySlug={c.slug} />;
  }
  const r = routeFor(`/service-areas/${s.slug}`)!;
  const cities = publishedCities(s);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title={s.headline} lede={s.intro}>
        <div className="flex flex-wrap gap-3">
          <a href="#request" className="btn btn-primary">
            Request service in {s.name}
          </a>
          <a href={SITE.phoneHref} className="btn btn-ghost">
            {SITE.phoneDisplay}
          </a>
        </div>
      </PageIntro>

      <section className="pt-14">
        <div className="wrap">
          <figure className="media relative aspect-[21/9] border hairline">
            <img src={(STATE_PHOTO[s.slug] ?? TEAM.inspectionRoof).src} alt={(STATE_PHOTO[s.slug] ?? TEAM.inspectionRoof).alt} loading="lazy" />
            <figcaption className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-ink/75 px-3 py-1.5 text-sm text-bone backdrop-blur-md">First Chimney on the job</figcaption>
          </figure>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid gap-6 lg:grid-cols-2">
          <Reveal className="card p-8">
            <CloudRain className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-5 text-2xl text-bone">Weather your chimney deals with</h2>
            <p className="mt-3 leading-relaxed text-mute">{s.climate}</p>
          </Reveal>
          <Reveal delay={0.06} className="card p-8">
            <Home className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-5 text-2xl text-bone">The homes we see</h2>
            <p className="mt-3 leading-relaxed text-mute">{s.housing}</p>
          </Reveal>
        </div>
      </section>

      <section className="section border-t hairline bg-ink-2">
        <div className="wrap">
          <h2 className="display-md text-bone">What to watch for in {s.name}</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[20px] border hairline bg-white/[0.06] md:grid-cols-3">
            {s.watchFor.map((w) => (
              <div key={w.title} className="bg-ink-2 p-7">
                <h3 className="text-lg text-bone">{w.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t hairline">
        <div className="wrap">
          <h2 className="display-md text-bone">Services in {s.name}</h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((x) => {
              const I = SERVICE_ICONS[x.icon];
              return (
                <li key={x.id}>
                  <Link to={`/services/${x.id}`} className="card lift flex h-full items-center gap-3 p-4 text-bone">
                    <I className="h-5 w-5 shrink-0 text-ember" strokeWidth={1.75} aria-hidden /> {x.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          {cities.length > 0 && (
            <>
              <h3 className="mt-14 text-xl text-bone">Towns we serve in {s.name}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/service-areas/${s.slug}/${c.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-sm text-bone hover:border-ember">
                      <MapPin className="h-3.5 w-3.5 text-ember" aria-hidden /> {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="section border-t hairline">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div>
            <h2 className="display-md text-bone">{s.name} questions</h2>
            <Faq items={s.faqs} className="mt-8" />
          </div>
          <div id="request" className="card scroll-mt-28 p-6 sm:p-8">
            <h2 className="text-xl text-bone">Request service in {s.name}</h2>
            <div className="mt-5">
              <LeadForm formId="service-request" fields={['name', 'phone', 'email', 'city', 'state', 'zip', 'service', 'message']} required={['name', 'phone', 'zip']} submitLabel="Send my request" dense />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CityArea({ stateSlug, citySlug }: { stateSlug: string; citySlug: string }) {
  const s = stateBySlug(stateSlug)!;
  const c = s.cities.find((x) => x.slug === citySlug)!;
  const r = routeFor(`/service-areas/${stateSlug}/${citySlug}`)!;
  const others = publishedCities(s).filter((x) => x.slug !== c.slug);
  const live = promoIsLive();
  return (
    <>
      <PageIntro crumbs={r.crumbs} eyebrow={`${c.county ? `${c.county}, ` : ''}${s.name}`} title={r.h1} lede={c.intro}>
        <div className="flex flex-wrap gap-3">
          <a href="#request" className="btn btn-primary">
            Request service in {c.name}
          </a>
          <FireButton placement={`city_${c.slug}`} />
          <a href={SITE.phoneHref} className="btn btn-ghost">
            {SITE.phoneDisplay}
          </a>
        </div>
      </PageIntro>
      <section className="section">
        <div className="wrap">
          <figure className="media relative mb-12 aspect-[21/9] border hairline">
            <img src={photoFor(c.slug).src} alt={photoFor(c.slug).alt} loading="lazy" />
          </figure>
          <h2 className="display-md text-bone">What we see in {c.name}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {c.localNotes.map((n, i) => (
              <Reveal key={n} delay={i * 0.05} className="card p-7">
                <span className="font-display text-3xl font-bold text-ember/70" style={{ fontStretch: '112%' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 leading-relaxed text-mute">{n}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section border-t hairline bg-ink-2">
        <div className="wrap">
          <h2 className="display-md text-bone">Chimney services in {c.name}</h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((x) => {
              const I = SERVICE_ICONS[x.icon];
              return (
                <li key={x.id}>
                  <Link to={`/services/${x.id}`} className="card lift flex h-full items-center gap-3 p-4 text-bone">
                    <I className="h-5 w-5 shrink-0 text-ember" strokeWidth={1.75} aria-hidden /> {x.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          {live && (
            <Link to={HOLIDAY_PROMO.path} className="card lift mt-8 flex flex-wrap items-center justify-between gap-4 border-ember/30 p-6">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ember">{HOLIDAY_PROMO.eyebrow}</span>
                <span className="mt-1 block text-lg text-bone">{HOLIDAY_PROMO.title} in {c.name}</span>
              </span>
              <span className="price-199 text-5xl">{HOLIDAY_PROMO.priceLabel}</span>
            </Link>
          )}
        </div>
      </section>
      <section className="section border-t hairline">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div className="min-w-0">
            <h2 className="display-md text-bone">{c.name} questions</h2>
            <Faq items={c.faqs} className="mt-8" />
            {others.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg text-bone">Also serving in {s.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link to={`/service-areas/${s.slug}/${o.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-sm text-bone hover:border-ember">
                        <MapPin className="h-3.5 w-3.5 text-ember" aria-hidden /> {o.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div id="request" className="card scroll-mt-28 p-6 sm:p-8">
            <h2 className="text-xl text-bone">Request service in {c.name}</h2>
            <p className="mt-2 text-sm text-mute">We confirm we can reach your address before anything is booked.</p>
            <div className="mt-5">
              <LeadForm formId="service-request" fields={['name', 'phone', 'email', 'address', 'zip', 'service', 'message']} required={['name', 'phone', 'zip']} submitLabel="Send my request" dense />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
