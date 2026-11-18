import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Camera, ChevronLeft, ChevronRight, ClipboardList, Mail, MapPin, MessageSquareText, Phone, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { Breadcrumbs, CallLink, EASE, Faq, PageIntro, Reveal } from '@/components/ui';
import { EXPERIENCE, GALLERY_CATEGORIES, JOB_PHOTOS, TEAM, type GalleryCategory } from '@/data/team';
import { GENERAL_FAQS, PROJECTS, REVIEWS, REVIEW_LINK, type Project } from '@/data/content';
import { SERVICES } from '@/data/services';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { routeFor } from '@/lib/routes';
import { CREDENTIALS, IMAGES, SITE, STATE_LIST_TEXT, STATES } from '@/lib/site';
import { track } from '@/lib/track';

/* ------------------------------ ABOUT ------------------------------ */
export function About() {
  const r = routeFor('/about')!;
  const strip = [TEAM.liner, TEAM.crown, TEAM.rebuild, TEAM.capCrown, TEAM.roofBrush, TEAM.headshot];
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div aria-hidden className="ember-glow pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-60" />
        <div className="wrap relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <Breadcrumbs crumbs={r.crumbs} />
            <p className="eyebrow mt-8">Meet First Chimney</p>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.4rem)] text-bone">Built by someone who genuinely loves chimneys.</h1>
            <p className="lede mt-6">
              {SITE.owner} has spent {EXPERIENCE.ownerYears} years in the chimney industry. He started First Chimney Contracting to take care of homeowners the way he would want his own home taken care of.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CallLink placement="about_hero" className="btn btn-primary btn-lg">
                <Phone className="h-5 w-5" aria-hidden /> Talk to Andrew
              </CallLink>
              <Link to="/gallery" className="btn btn-ghost btn-lg">
                See our work
              </Link>
            </div>
          </div>
          <Reveal className="min-w-0">
            <figure className="media relative aspect-[4/3] border hairline shadow-[0_40px_120px_-50px_rgb(240_122_50/0.55)]">
              <img src={TEAM.withTruck.src} alt={TEAM.withTruck.alt} width={TEAM.withTruck.w} height={TEAM.withTruck.h} fetchPriority="high" />
              <figcaption className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-ink/75 px-4 py-2 text-sm text-bone backdrop-blur-md">
                {SITE.owner}, owner
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="border-y hairline bg-ink-2" aria-label="Experience">
        <dl className="wrap grid grid-cols-2 gap-px py-2 lg:grid-cols-4">
          {[
            { k: `${EXPERIENCE.ownerYears} years`, v: 'Andrew in the chimney trade' },
            { k: `${EXPERIENCE.teamYears} years`, v: 'Combined crew experience' },
            { k: 'F.I.R.E.', v: 'Certified chimney inspection' },
            { k: '5 states', v: 'VA, NJ, CT, MA and RI' },
          ].map((x) => (
            <div key={x.v} className="px-4 py-8 text-center">
              <dt className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold text-bone" style={{ fontStretch: '110%' }}>
                {x.k}
              </dt>
              <dd className="mt-1 text-sm text-mute">{x.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-2">
          <Reveal className="media aspect-[4/3] min-w-0">
            <img src={TEAM.sweeping.src} alt={TEAM.sweeping.alt} loading="lazy" />
          </Reveal>
          <div className="min-w-0">
            <h2 className="display-md text-bone">Why Andrew does this</h2>
            <div className="mt-6 grid gap-5 text-[1.05rem] leading-relaxed text-mute">
              <p>Andrew genuinely loves chimneys: the craft of good masonry, the character of an old brick chimney, and the satisfaction of a flue that draws perfectly. Most of all, he loves seeing people actually use their fireplaces, families gathered around a fire they can trust.</p>
              <p>After {EXPERIENCE.ownerYears} years in the chimney industry, he started First Chimney Contracting with a simple idea: treat every house like his own. That means showing you what he sees, explaining it plainly, quoting before any work begins and leaving your home cleaner than he found it.</p>
              <p>He is not doing it alone. The First Chimney crew brings {EXPERIENCE.teamYears} years of combined chimney and masonry experience to every job, from a routine cleaning to a full rebuild.</p>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-bone">
              <BadgeCheck className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden /> {CREDENTIALS.fire.label}
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t hairline bg-ink-2">
        <div className="wrap">
          <h2 className="display-md text-bone">What you can count on</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Sparkles, t: 'A clean house', b: 'Drop cloths and containment on every visit.' },
              { i: Camera, t: 'Proof, not pressure', b: 'Photos of what we find wherever we can get them.' },
              { i: ClipboardList, t: 'Quotes first', b: 'No extra work without your clear yes.' },
              { i: ShieldCheck, t: 'Certified care', b: `${CREDENTIALS.fire.label} chimney inspection.` },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 0.05} className="card p-7">
                <x.i className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-5 text-lg text-bone">{x.t}</h3>
                <p className="mt-2 text-mute">{x.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t hairline">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-md text-bone">On the job</h2>
            <Link to="/gallery" className="link-arrow inline-flex items-center gap-1.5 font-medium text-ember">
              Full gallery <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {strip.map((p, i) => (
              <Reveal as="li" key={p.src} delay={(i % 3) * 0.05} className="zoom media aspect-[4/3]">
                <img src={p.sm} alt={p.alt} loading="lazy" />
              </Reveal>
            ))}
          </ul>
          <p className="mt-10 text-mute">
            Serving homeowners in {STATE_LIST_TEXT}.{' '}
            <Link to="/service-areas" className="text-ember underline-offset-4 hover:underline">
              See service areas
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ FAQ ------------------------------ */
export function FaqPage() {
  const r = routeFor('/faq')!;
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Frequently asked questions" lede="Straight answers. If yours is not here, call or text and ask." />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Faq items={[...GENERAL_FAQS, ...SERVICES.flatMap((s) => s.faqs.slice(0, 1))]} />
          <aside className="card h-fit p-7 lg:sticky lg:top-28">
            <h2 className="text-xl text-bone">Still have a question?</h2>
            <p className="mt-2 text-mute">{SITE.owner.split(' ')[0]} is happy to talk it through.</p>
            <div className="mt-6 grid gap-3">
              <CallLink placement="faq_aside" className="btn btn-primary" />
              <a href={SITE.smsHref} onClick={() => track('click_to_text', { placement: 'faq_aside' })} className="btn btn-ghost">
                <MessageSquareText className="h-4 w-4" aria-hidden /> Text us
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ CONTACT ------------------------------ */
export function Contact() {
  const r = routeFor('/contact')!;
  const [params] = useSearchParams();
  const live = promoIsLive();
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Let's get your chimney sorted." lede="Send a request and we will reach out to confirm a time. Prefer to talk? Call or text anytime." />
      <section className="section pt-14">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <div className="card p-6 sm:p-9">
            <h2 className="text-2xl text-bone">Request service</h2>
            <div className="mt-6">
              <LeadForm
                formId="contact"
                defaultService={params.get('service') ?? ''}
                fields={['name', 'phone', 'email', 'address', 'city', 'state', 'zip', 'service', 'timeframe', 'message']}
                required={['name', 'phone', 'zip']}
                submitLabel="Send my request"
              />
            </div>
          </div>
          <aside className="grid h-fit gap-4">
            <div className="card overflow-hidden">
              <img src={TEAM.withTruck.sm} alt={TEAM.withTruck.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <p className="font-semibold text-bone">You will talk to Andrew.</p>
                <p className="mt-1 text-sm text-mute">
                  {SITE.owner}, owner. {EXPERIENCE.ownerYears} years in the chimney trade and a crew with {EXPERIENCE.teamYears} years of combined experience.
                </p>
              </div>
            </div>
            <a href={SITE.phoneHref} onClick={() => track('click_to_call', { placement: 'contact_aside' })} className="card lift flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ember text-[#1a0d05]">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm text-dim">Call or text</span>
                <span className="block text-xl font-medium text-bone">{SITE.phoneDisplay}</span>
              </span>
            </a>
            <a href={`mailto:${SITE.email}`} className="card lift flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/12 text-ember">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-dim">Email</span>
                <span className="block truncate text-bone">{SITE.email}</span>
              </span>
            </a>
            <div className="card p-5">
              <p className="flex items-center gap-2 text-sm text-dim">
                <MapPin className="h-4 w-4 text-ember" aria-hidden /> Service area
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {STATES.map((s) => (
                  <li key={s.code}>
                    <Link to={`/service-areas/${s.slug}`} className="text-bone hover:text-ember">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {live && (
              <Link to={HOLIDAY_PROMO.path} onClick={() => track('promo_cta_click', { placement: 'contact_aside' })} className="card lift flex items-center justify-between gap-4 border-ember/30 p-5">
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ember">Holiday special</span>
                  <span className="mt-1 block text-bone">{HOLIDAY_PROMO.title}</span>
                </span>
                <span className="price-199 text-4xl">{HOLIDAY_PROMO.priceLabel}</span>
              </Link>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ GALLERY ------------------------------ */
function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] touch-pan-y select-none overflow-hidden rounded-[20px]"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => e.buttons && move(e.clientX)}
    >
      <img src={after} alt={`After: ${alt}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <img src={before} alt={`Before: ${alt}`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false} />
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-bone" style={{ left: `${pos}%` }} />
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare before and after" className="absolute inset-x-0 bottom-3 mx-auto w-2/3 accent-[var(--color-ember)]" />
    </div>
  );
}

function Lightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const [i, setI] = useState(0);
  const n = project.photos.length;
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI((x) => (x + 1) % n);
      if (e.key === 'ArrowLeft') setI((x) => (x - 1 + n) % n);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [n, onClose]);
  return (
    <motion.div role="dialog" aria-modal="true" aria-label={project.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }} className="fixed inset-0 z-[60] grid place-items-center bg-ink/95 p-4 backdrop-blur" onClick={onClose}>
      <figure className="relative max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={project.photos[i].src} alt={project.photos[i].alt} className="max-h-[80dvh] rounded-[20px] object-contain" />
        <figcaption className="mt-3 text-sm text-mute">{project.photos[i].alt}</figcaption>
        {n > 1 && (
          <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
            <button type="button" onClick={() => setI((x) => (x - 1 + n) % n)} className="grid h-11 w-11 place-items-center rounded-full bg-ink/80" aria-label="Previous photo">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" onClick={() => setI((x) => (x + 1) % n)} className="grid h-11 w-11 place-items-center rounded-full bg-ink/80" aria-label="Next photo">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        )}
      </figure>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label="Close">
        <X className="h-5 w-5" aria-hidden />
      </button>
    </motion.div>
  );
}

function PhotoLightbox({ photos, index, onClose, onIndex }: { photos: typeof JOB_PHOTOS; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const n = photos.length;
  const p = photos[index];
  const startX = useRef<number | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % n);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n);
    };
    window.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = prev;
    };
  }, [index, n, onClose, onIndex]);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={p.alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="fixed inset-0 z-[75] grid place-items-center bg-ink/95 p-4 backdrop-blur"
      onClick={onClose}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 50) onIndex(dx < 0 ? (index + 1) % n : (index - 1 + n) % n);
      }}
    >
      <figure className="relative max-h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img key={p.src} src={p.src} alt={p.alt} className="mx-auto max-h-[78dvh] w-auto rounded-[20px] object-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />
        </AnimatePresence>
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-bone">{p.alt}</span>
          <span className="text-dim">
            {index + 1} / {n}
          </span>
        </figcaption>
        <div className="pointer-events-none absolute inset-x-2 top-[40%] flex justify-between">
          <button type="button" onClick={() => onIndex((index - 1 + n) % n)} className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-ink/80 text-bone" aria-label="Previous photo">
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button type="button" onClick={() => onIndex((index + 1) % n)} className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-ink/80 text-bone" aria-label="Next photo">
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </figure>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-bone" aria-label="Close">
        <X className="h-5 w-5" aria-hidden />
      </button>
    </motion.div>
  );
}

export function Gallery() {
  const r = routeFor('/gallery')!;
  const [cat, setCat] = useState<GalleryCategory | 'All'>('All');
  const [open, setOpen] = useState<number | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const projects = PROJECTS.filter((p) => p.permission);
  const photos = cat === 'All' ? JOB_PHOTOS : JOB_PHOTOS.filter((p) => p.category === cat);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Our work" lede={`Real First Chimney jobs and the crew behind them. ${EXPERIENCE.teamYears} years of combined experience, photographed on site.`}>
        <div className="flex flex-wrap gap-3">
          <Link to={promoIsLive() ? HOLIDAY_PROMO.path : '/contact'} className="btn btn-primary">
            {promoIsLive() ? `Book the ${HOLIDAY_PROMO.priceLabel} special` : 'Schedule service'} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <CallLink placement="gallery_intro" />
        </div>
      </PageIntro>
      <section className="section pt-12">
        <div className="wrap">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos">
            {(['All', ...GALLERY_CATEGORIES] as const).map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${cat === c ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:text-bone'}`}>
                {c}
                <span className="ml-1.5 text-dim">{c === 'All' ? JOB_PHOTOS.length : JOB_PHOTOS.filter((p) => p.category === c).length}</span>
              </button>
            ))}
          </div>
          <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {photos.map((p, i) => (
              <li key={p.src} className="mb-4 break-inside-avoid">
                <button type="button" onClick={() => setOpen(i)} className="zoom group relative block w-full overflow-hidden rounded-[20px] border hairline" aria-label={`Open photo: ${p.alt}`}>
                  <img src={p.sm} alt={p.alt} width={p.w} height={p.h} loading={i < 6 ? 'eager' : 'lazy'} className="h-auto w-full" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-4 pt-10 text-left text-sm text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {p.alt}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {projects.length > 0 && (
            <div className="mt-20">
              <h2 className="display-md text-bone">Before and after</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {projects.map((p) => (
                  <article key={p.slug} className="card overflow-hidden">
                    {p.before && p.after ? (
                      <BeforeAfter before={p.before} after={p.after} alt={p.title} />
                    ) : (
                      <button type="button" onClick={() => setOpenProject(p)} className="zoom block aspect-[4/3] w-full overflow-hidden">
                        <img src={p.photos[0]?.src} alt={p.photos[0]?.alt} loading="lazy" className="h-full w-full object-cover" />
                      </button>
                    )}
                    <div className="p-6">
                      <p className="text-sm text-dim">
                        {p.service} / {p.city}, {p.state}
                      </p>
                      <h3 className="mt-1 text-xl text-bone">{p.title}</h3>
                      <p className="mt-2 text-mute">{p.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <AnimatePresence>{open !== null && <PhotoLightbox photos={photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}</AnimatePresence>
      <AnimatePresence>{openProject && <Lightbox project={openProject} onClose={() => setOpenProject(null)} />}</AnimatePresence>
    </>
  );
}

/* ------------------------------ REVIEWS ------------------------------ */
export function Reviews() {
  const r = routeFor('/reviews')!;
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="What people say about Andrew" lede="Every review on this page comes from a real customer and is published with their permission. We never buy, script or filter reviews.">
        <div className="flex flex-wrap gap-3">
          <a href="#share" className="btn btn-primary">
            Share your experience
          </a>
          {REVIEW_LINK && (
            <a href={REVIEW_LINK} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Review us on Google
            </a>
          )}
        </div>
      </PageIntro>

      {REVIEWS.length > 0 && (
        <section className="section pb-0">
          <div className="wrap">
            <ul className="columns-1 gap-5 md:columns-2 lg:columns-3">
              {REVIEWS.map((x) => (
                <li key={x.author + x.date} className="card mb-5 break-inside-avoid p-7">
                  <div className="flex gap-0.5 text-gold" aria-label={`${x.rating} out of 5 stars`}>
                    {Array.from({ length: x.rating }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <p className="mt-4 leading-relaxed text-bone">&ldquo;{x.text}&rdquo;</p>
                  <p className="mt-5 text-sm text-mute">
                    {x.author}
                    {x.city ? `, ${x.city}` : ''}
                    {x.source !== 'Direct' ? ` on ${x.source}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0">
            <div className="media aspect-[4/3]">
              <img src={TEAM.headshot.src} alt={TEAM.headshot.alt} loading="lazy" />
            </div>
            <h2 className="display-md mt-10 text-bone">Trust you can check</h2>
            <ul className="mt-6 grid gap-5">
              <li className="flex gap-3">
                <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-ember" strokeWidth={1.75} aria-hidden />
                <p className="text-mute">
                  <span className="font-medium text-bone">{CREDENTIALS.fire.title}.</span> Andrew is listed by name in the{' '}
                  <a href={CREDENTIALS.fire.verifyUrl} target="_blank" rel="noreferrer" className="text-ember underline-offset-4 hover:underline">
                    {CREDENTIALS.fire.verifyLabel}
                  </a>
                  . FIRE certification is earned by the individual, not bought by a company.
                </p>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-ember" strokeWidth={1.75} aria-hidden />
                <p className="text-mute">
                  <span className="font-medium text-bone">{EXPERIENCE.ownerYears} years in the chimney trade.</span> Andrew leads a crew with {EXPERIENCE.teamYears} years of combined chimney and masonry experience.
                </p>
              </li>
              <li className="flex gap-3">
                <Camera className="mt-0.5 h-6 w-6 shrink-0 text-ember" strokeWidth={1.75} aria-hidden />
                <p className="text-mute">
                  <span className="font-medium text-bone">See the work.</span>{' '}
                  <Link to="/gallery" className="text-ember underline-offset-4 hover:underline">
                    Photos from real jobs
                  </Link>{' '}
                  are in our gallery.
                </p>
              </li>
            </ul>
          </div>
          <div id="share" className="card min-w-0 scroll-mt-28 p-6 sm:p-8">
            <h2 className="text-2xl text-bone">Worked with Andrew before?</h2>
            <p className="mt-2 text-mute">Whether it was a cleaning last winter or a rebuild years ago, we would love to hear how it went. With your permission, we may share your words here.</p>
            <div className="mt-6">
              <LeadForm
                formId="testimonial"
                fields={['name', 'email', 'phone', 'city', 'message']}
                required={['name', 'message']}
                messageLabel="Your experience with Andrew"
                messagePlaceholder="What did he do, how did it go, and what stood out to you?"
                submitLabel="Share my experience"
                successTitle="Thank you."
                successBody={<p>We received your words and really appreciate it. We only publish your first name and town, exactly as you gave permission.</p>}
                publishConsent
                dense
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ PRIVACY ------------------------------ */
export function Privacy() {
  const r = routeFor('/privacy-policy')!;
  const blocks: [string, string[]][] = [
    ['What we collect', ['When you send a form we collect what you enter: your name, phone, email, service address and any details about your request or fireplace design. We also record the page you came from and campaign tags in the link (for example utm_source) so we know which posts and ads are working.']],
    ['How we use it', ['To respond to your request, schedule and perform service, send estimates and follow up about your job. We do not sell your information.']],
    ['Where it goes', [`Requests are delivered to our customer management system so ${SITE.owner} and our team can respond. Service providers that host this website and that system process data on our behalf.`]],
    ['Text messages (SMS)', [
      `If you opt in, ${SITE.name} may text you about your request, appointment reminders, and service updates. Message frequency varies. Message and data rates may apply.`,
      'Reply STOP to opt out at any time and HELP for help. Consent to receive texts is not a condition of any purchase.',
      'Mobile opt-in information and consent are never shared with third parties for marketing purposes.',
    ]],
    ['Cookies and browser storage', ['This site stores small items in your browser to remember a fireplace design, your quote list, a saved offer reference and campaign attribution for your visit. Nothing is used to identify you across other websites.']],
    ['Your choices', [`Ask us to update or delete your information at any time: ${SITE.email} or ${SITE.phoneDisplay}.`]],
  ];
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Privacy policy and SMS terms" lede={`How ${SITE.name} handles the information you share with us.`} />
      <section className="section pt-14">
        <div className="wrap max-w-3xl">
          {blocks.map(([h, ps]) => (
            <div key={h} className="border-b hairline py-8 first:pt-0">
              <h2 className="text-xl text-bone">{h}</h2>
              {ps.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-mute">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <p className="mt-8 text-sm text-dim">Last updated November 14, 2026.</p>
        </div>
      </section>
    </>
  );
}
