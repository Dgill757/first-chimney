import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, BadgeCheck, Camera, ClipboardList, Hammer, MessageSquareText, Phone, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { HolidayFeature } from '@/components/Holiday';
import LeadForm from '@/components/LeadForm';
import { CallLink, EASE, Faq, FireButton, Reveal, SectionHeading, SERVICE_ICONS } from '@/components/ui';
import { GENERAL_FAQS, PROJECTS, REVIEWS } from '@/data/content';
import { EXPERIENCE, JOB_PHOTOS, TEAM } from '@/data/team';
import { SERVICE_AREAS } from '@/data/serviceAreas';
import { SERVICES, serviceById } from '@/data/services';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { CREDENTIALS, IMAGES, SITE } from '@/lib/site';
import { track } from '@/lib/track';

function Hero() {
  const reduce = useReducedMotion();
  const live = promoIsLive();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], ['0%', reduce ? '0%' : '12%']);
  const fade = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.35]);
  // Warm glow that follows the cursor. Motion values + spring: no React re-renders.
  const mx = useMotionValue(0.3);
  const my = useMotionValue(0.55);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const glow = useMotionTemplate`radial-gradient(38rem 28rem at ${useTransform(sx, (v) => `${v * 100}%`)} ${useTransform(sy, (v) => `${v * 100}%`)}, rgb(240 122 50 / 0.22), transparent 70%)`;

  const embers = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 37 + 11) % 100}%`,
    dur: `${10 + (i % 5) * 2.5}s`,
    delay: `${(i * 0.9) % 12}s`,
    drift: `${(i % 2 ? 1 : -1) * (12 + (i % 6) * 6)}px`,
    size: 2 + (i % 3),
  }));

  return (
    <section
      className="relative flex min-h-[100dvh] items-end overflow-hidden pb-14 pt-36 md:items-center md:pb-20"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
    >
      <motion.div aria-hidden className="absolute inset-0" style={{ y }}>
        {reduce ? (
          <img src={IMAGES.heroPoster} alt="" className="h-full w-full object-cover" fetchPriority="high" />
        ) : (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={IMAGES.heroPoster}>
            <source src={IMAGES.heroVideo} type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/60" />
      {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: glow }} />}
      {!reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {embers.map((e, i) => (
            <span key={i} className="ember" style={{ left: e.left, width: e.size, height: e.size, animationDuration: e.dur, animationDelay: e.delay, ['--drift' as string]: e.drift }} />
          ))}
        </div>
      )}

      <motion.div className="wrap relative grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]" style={{ opacity: fade }}>
        <div className="min-w-0 max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, transform: 'translateY(10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/50 px-3.5 py-1.5 text-sm text-bone backdrop-blur-md"
          >
            <BadgeCheck className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden />
            {CREDENTIALS.fire.label} <span className="text-dim">/</span> Owner-operated
          </motion.p>
          <h1 className="mt-6 text-[clamp(2.6rem,5.4vw,4.75rem)] text-bone">
            {['Chimney service', 'done right'].map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={reduce ? false : { opacity: 0, transform: 'translateY(24px)', filter: 'blur(6px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.08 + i * 0.1, ease: EASE }}
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              className="block bg-gradient-to-r from-ember via-[#ffb066] to-ember bg-clip-text pb-1 text-transparent"
              initial={reduce ? false : { opacity: 0, transform: 'translateY(24px)', filter: 'blur(6px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
            >
              the first time.
            </motion.span>
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.45 }} className="lede mt-6 text-bone/80">
            Cleaning, inspection and repair for homes in Virginia, New Jersey, Connecticut and Massachusetts.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, transform: 'translateY(10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {live ? (
              <Link to={HOLIDAY_PROMO.path} onClick={() => track('promo_cta_click', { placement: 'home_hero' })} className="btn btn-primary btn-lg">
                Book the {HOLIDAY_PROMO.priceLabel} special <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            ) : (
              <Link to="/contact" className="btn btn-primary btn-lg">
                Schedule service <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            )}
            <FireButton placement="home_hero" size="lg" />
          </motion.div>
          <motion.a
            href={SITE.phoneHref}
            onClick={() => track('click_to_call', { placement: 'home_hero' })}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-5 inline-flex items-center gap-2 text-[0.98rem] text-bone/85 hover:text-ember"
          >
            <Phone className="h-4 w-4 text-ember" aria-hidden /> Or call or text {SITE.owner.split(' ')[0]}: <span className="font-semibold text-bone">{SITE.phoneDisplay}</span>
          </motion.a>
        </div>

        {/* Floating offer + trust card (desktop) */}
        <motion.aside
          aria-label="Holiday special and our promise"
          initial={reduce ? false : { opacity: 0, transform: 'translateY(30px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
          className="hidden lg:block"
        >
          <div className="rounded-[24px] border border-white/12 bg-ink/55 p-6 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl">
            <Link to="/about" className="group mb-5 flex items-center gap-4">
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-ember/60">
                <img src={TEAM.headshot.sm} alt={TEAM.headshot.alt} width={96} height={96} className="h-full w-full object-cover object-[50%_30%]" />
              </span>
              <span>
                <span className="block font-semibold text-bone group-hover:text-ember">{SITE.owner}</span>
                <span className="block text-sm text-mute">
                  Owner · {EXPERIENCE.ownerYears} years in the chimney trade
                </span>
              </span>
            </Link>
            {live && (
              <Link to={HOLIDAY_PROMO.path} onClick={() => track('promo_cta_click', { placement: 'hero_card' })} className="group block rounded-2xl border border-ember/30 bg-gradient-to-br from-ember/15 to-transparent p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ember">{HOLIDAY_PROMO.eyebrow}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <span className="price-199 text-[4.2rem]">{HOLIDAY_PROMO.priceLabel}</span>
                  <ArrowRight className="mb-3 h-5 w-5 text-ember transition-transform group-hover:translate-x-1" aria-hidden />
                </div>
                <p className="mt-1 text-sm text-bone">{HOLIDAY_PROMO.title}</p>
              </Link>
            )}
            <ul className="mt-5 grid gap-3.5 text-[0.93rem] text-bone/90">
              {[
                [BadgeCheck, `${CREDENTIALS.fire.label} inspector`],
                [ClipboardList, 'Written quote before any repair'],
                [Sparkles, 'Drop cloths down, house left clean'],
                [Camera, 'Photos of what we find'],
              ].map(([I, t]) => {
                const Icon = I as typeof BadgeCheck;
                return (
                  <li key={t as string} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] text-ember">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    {t as string}
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}

const FACTS = [
  `${CREDENTIALS.fire.label} inspection`,
  `${EXPERIENCE.ownerYears} years in the chimney trade`,
  `Owned and run by ${SITE.owner}`,
  `${EXPERIENCE.teamYears} years of combined crew experience`,
  'Quote before any repair',
  'Drop cloths down, every visit',
  'Virginia / New Jersey / Connecticut / Massachusetts',
  'Plain-English findings',
];

function FactsMarquee() {
  const row = [...FACTS, ...FACTS];
  return (
    <div className="relative overflow-hidden border-y hairline bg-ink-2 py-5" aria-label="Why homeowners choose First Chimney">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-2 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-2 to-transparent" />
      <ul className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {row.map((f, i) => (
          <li key={i} aria-hidden={i >= FACTS.length} className="flex items-center gap-3 font-display text-lg text-bone/85" style={{ fontStretch: '108%' }}>
            <Sparkles className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServicesBento() {
  const [a, b, ...rest] = SERVICES;
  const Big = ({ s, i }: { s: typeof a; i: number }) => {
    const Icon = SERVICE_ICONS[s.icon];
    return (
      <Reveal delay={i * 0.06} className="md:col-span-3 lg:col-span-3">
        <Link to={`/services/${s.id}`} className="zoom group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[20px] border hairline">
          <img src={s.image} alt={s.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/5" />
          <div className="relative p-7">
            <Icon className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
            <h3 className="mt-4 text-2xl text-bone">{s.title}</h3>
            <p className="mt-2 max-w-md text-mute">{s.short}</p>
            <span className="link-arrow mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ember">
              Learn more <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </Link>
      </Reveal>
    );
  };
  return (
    <section className="section" aria-labelledby="services-h">
      <div className="wrap">
        <SectionHeading id="services-h" title="Everything your chimney needs, from the firebox to the crown." />
        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <Big s={a} i={0} />
          <Big s={b} i={1} />
          {rest.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <Reveal key={s.id} delay={(i % 3) * 0.06} className="md:col-span-3 lg:col-span-2">
                <Link to={`/services/${s.id}`} className="card lift group flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-ink text-ember">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-dim transition-colors group-hover:text-ember" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-lg text-bone">{s.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-mute">{s.short}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const LOOKS = [
  { label: 'Modern linear gas', brand: 'Kozy Heat', model: 'Generation 7220', src: '/catalog/kozy/gallery/gen-7220-single-livingroomb-horz-copy.webp', alt: 'Kozy Heat Generation 7220 linear gas fireplace in a bright open living room', to: '/fireplace-shop/gas-fireplaces/generation-7220-gas-fireplace' },
  { label: 'Insert in classic brick', brand: 'Kozy Heat', model: 'Chaska 29', src: '/catalog/kozy/gallery/chaska29-crushed-glass-livingroom-e1760551265147.webp', alt: 'Kozy Heat Chaska 29 gas insert in a red brick fireplace', to: '/fireplace-shop/gas-inserts/chaska-29-gas-insert' },
  { label: 'Stacked stone refresh', brand: 'Kozy Heat', model: 'Chaska 34', src: '/catalog/kozy/gallery/chaska-34-bak-room-e1760551659771.webp', alt: 'Kozy Heat Chaska 34 gas insert in a stacked stone surround', to: '/fireplace-shop/gas-inserts/chaska-34-gas-insert' },
  { label: 'Clean contemporary', brand: 'Enviro', model: 'Q2', src: '/catalog/enviro/gallery/q2-3.webp', alt: 'Enviro Q2 gas fireplace in a minimalist concrete wall with stacked firewood', to: '/fireplace-shop/gas-fireplaces/q2-gas-fireplace' },
  { label: 'Electric with wood niche', brand: 'Modern Flames', model: 'Landscape Pro Multi', src: '/catalog/modernflames/gallery/multi-56-roomw.webp', alt: 'Modern Flames Landscape Pro Multi electric fireplace beside a firewood niche', to: '/fireplace-shop/electric-fireplaces/landscape-pro-multi-44-fireplace' },
  { label: 'Freestanding stove', brand: 'Kozy Heat', model: 'Oakport 18', src: '/catalog/kozy/gallery/oakport-prairie-room.webp', alt: 'Kozy Heat Oakport 18 freestanding gas stove in a living room', to: '/fireplace-shop/gas-stoves/oakport-18-gas-stove' },
];

function DesignerTeaser() {
  const [pick, setPick] = useState(0);
  const reduce = useReducedMotion();
  const look = LOOKS[pick];
  return (
    <section className="section relative overflow-hidden" aria-labelledby="designer-h">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="order-2 min-w-0 lg:order-1">
          <div className="media relative aspect-[3/2] border hairline shadow-[0_40px_120px_-50px_rgb(240_122_50/0.6)]">
            <AnimatePresence initial={false}>
              <motion.img
                key={look.src}
                src={look.src}
                alt={look.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(1.04)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-16">
              <Link to={look.to} className="link-arrow inline-flex items-center gap-2 text-sm text-bone">
                <span className="font-semibold text-gold">{look.brand}</span> {look.model} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
        <div className="order-1 min-w-0 lg:order-2">
          <p className="eyebrow">Build your fireplace</p>
          <h2 id="designer-h" className="display-lg mt-4 text-bone">
            See it before anyone lifts a trowel.
          </h2>
          <p className="lede mt-5">Real fireplaces from the brands we install. Pick a look, then build your own: choose the model, fronts, finishes and fire, and get a branded PDF of your build.</p>
          <div className="mt-8 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Fireplace looks">
            {LOOKS.map((l, i) => (
              <button
                key={l.src}
                type="button"
                role="radio"
                aria-checked={pick === i}
                onClick={() => setPick(i)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${pick === i ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:border-white/30'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <FireButton placement="home_teaser" size="lg" />
            <Link to="/fireplace-shop" className="btn btn-ghost btn-lg">
              Browse the shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { i: Camera, t: 'We show you what we see', b: 'Findings come with photos where possible, so you are never asked to take a repair on faith.' },
    { i: ClipboardList, t: 'Quote first, work second', b: 'Anything beyond what you booked is explained and priced before a single tool comes out.' },
    { i: ShieldCheck, t: 'Certified, careful work', b: `${CREDENTIALS.fire.label} inspection, done the same careful way on every chimney.` },
    { i: Sparkles, t: 'Your home, respected', b: 'Drop cloths and containment go down first. We leave the room the way we found it.' },
  ];
  return (
    <section className="section border-y hairline bg-ink-2" aria-labelledby="why-h">
      <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div className="media relative mb-8 aspect-[4/3]">
            <img src={TEAM.portrait.src} alt={TEAM.portrait.alt} width={TEAM.portrait.w} height={TEAM.portrait.h} loading="lazy" />
            <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-ink/75 px-3 py-1.5 text-sm text-bone backdrop-blur-md">
              {SITE.owner}, owner
            </span>
          </div>
          <p className="eyebrow">Who we are</p>
          <h2 id="why-h" className="display-md mt-4 text-bone">
            A new name. {EXPERIENCE.ownerYears === 10 ? 'Ten' : EXPERIENCE.ownerYears} years of doing it right.
          </h2>
          <p className="lede mt-5">
            {SITE.owner} has spent {EXPERIENCE.ownerYears} years in the chimney industry, and he genuinely loves this work. With a crew bringing {EXPERIENCE.teamYears} years of combined experience, he built First Chimney to take care of every home like it was his own. When you call, you reach the person accountable for the work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/about" className="btn btn-ghost">
              Meet First Chimney <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <CallLink placement="why_us" className="btn btn-ghost" />
          </div>
        </div>
        <div className="grid content-start gap-4 self-start sm:grid-cols-2 lg:pt-6">
          {items.map((x, i) => (
            <Reveal key={x.t} delay={i * 0.06} className={`card p-7 ${i % 2 ? 'sm:translate-y-10' : ''}`}>
              <x.i className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
              <h3 className="mt-6 text-xl text-bone">{x.t}</h3>
              <p className="mt-3 leading-relaxed text-mute">{x.b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Mid-page lead capture for visitors who know they want help but not which service. */
function CallbackBand() {
  return (
    <section className="relative overflow-hidden border-y hairline" aria-labelledby="callback-h">
      <div aria-hidden className="ember-glow absolute inset-0 opacity-70" />
      <div className="wrap relative grid items-center gap-10 py-16 lg:grid-cols-[1fr_minmax(0,30rem)] lg:py-20">
        <div className="min-w-0">
          <h2 id="callback-h" className="display-md text-bone">
            Not sure what you need? Talk it through with {SITE.owner.split(' ')[0]}.
          </h2>
          <p className="lede mt-4">Leave your number and we will call you back to talk about what you are seeing. No pressure, no sales script.</p>
        </div>
        <div className="card p-6" style={{ background: 'rgb(24 22 20 / 0.94)' }}>
          <LeadForm formId="service-request" fields={['name', 'phone', 'zip']} required={['name', 'phone', 'zip']} submitLabel="Call me back" defaultService="Phone consultation" dense />
        </div>
      </div>
    </section>
  );
}

/** Our work + reviews, presented honestly while real photos and reviews are collected. */
function WorkAndReviews() {
  const projects = PROJECTS.filter((p) => p.permission);
  return (
    <section className="section" aria-labelledby="work-h">
      <div className="wrap grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Reveal className="card overflow-hidden">
          <div className="grid grid-cols-3 gap-1">
            {[TEAM.rebuild, TEAM.crown, TEAM.sweeping].map((p) => ({ src: p.sm, alt: p.alt })).map((im) => (
              <div key={im.src} className="aspect-[4/5] overflow-hidden">
                <img src={im.src} alt={im.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="p-7">
            <h2 id="work-h" className="text-2xl text-bone">
              Our work
            </h2>
            <p className="mt-3 max-w-xl text-mute">
              {`Rebuilds, crowns, caps, liners and cleanings by Andrew and the crew, photographed on the job.${projects.length ? ' Before-and-after projects are in the gallery too.' : ''}`}
            </p>
            <Link to="/gallery" className="link-arrow mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ember">
              See all {JOB_PHOTOS.length} photos <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="card flex flex-col p-7">
          <div className="flex gap-1 text-gold" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`h-5 w-5 ${REVIEWS.length ? 'fill-current' : ''}`} strokeWidth={1.5} />
            ))}
          </div>
          <h2 className="mt-5 text-2xl text-bone">Reviews</h2>
          {REVIEWS.length ? (
            <figure className="mt-4">
              <blockquote className="text-lg leading-relaxed text-bone">&ldquo;{REVIEWS[0].text}&rdquo;</blockquote>
              <figcaption className="mt-3 text-sm text-mute">
                {REVIEWS[0].author}
                {REVIEWS[0].city ? `, ${REVIEWS[0].city}` : ''} on {REVIEWS[0].source}
              </figcaption>
            </figure>
          ) : (
            <p className="mt-3 text-mute">We are a new business and every review here will be real. We never buy, script or filter reviews. Our first customers&rsquo; reviews will appear here as they come in.</p>
          )}
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <Link to="/reviews" className="btn btn-ghost btn-sm">
              Read reviews
            </Link>
            {promoIsLive() && (
              <Link to={HOLIDAY_PROMO.path} onClick={() => track('promo_cta_click', { placement: 'reviews_card' })} className="btn btn-primary btn-sm">
                Be one of our first
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const SYMPTOMS = [
  { label: 'Smoke comes into the room', service: 'chimney-sweeping', note: 'Often a dirty or blocked flue, or a damper issue. A cleaning and inspection usually finds the cause.' },
  { label: 'Water stains near the chimney', service: 'leak-repair', note: 'Usually flashing, the crown, a missing cap or porous masonry. We trace it to the source first.' },
  { label: 'Crumbling brick or mortar', service: 'masonry-rebuilds', note: 'Freeze-thaw damage. Repointing early costs far less than a rebuild later.' },
  { label: 'Campfire smell in summer', service: 'chimney-sweeping', note: 'Creosote odor pulled in by humidity. Cleaning plus a good damper seal usually fixes it.' },
  { label: 'Animals or debris in the flue', service: 'chimney-cap', note: 'An open flue invites nesting animals and rain. A properly fitted cap stops it.' },
  { label: 'Buying or selling a home', service: 'chimney-inspection', note: 'NFPA 211 recommends a Level 2 inspection at a property sale.' },
  { label: 'Damper sticks or will not seal', service: 'fireplace-repair', note: 'Rusted or warped dampers can be repaired or replaced, including top-sealing options.' },
  { label: 'Dryer takes forever', service: 'dryer-vent-cleaning', note: 'Lint buildup in the vent. Failure to clean is the leading cause of home dryer fires.' },
];

function SymptomFinder() {
  const [pick, setPick] = useState(0);
  const s = SYMPTOMS[pick];
  const svc = serviceById(s.service)!;
  const Icon = SERVICE_ICONS[svc.icon];
  const reduce = useReducedMotion();
  return (
    <section className="section" aria-labelledby="symptom-h">
      <div className="wrap">
        <SectionHeading id="symptom-h" title="What are you noticing?" lede="Pick what you are seeing at home. We will point you to the right service." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-wrap content-start gap-2.5" role="radiogroup" aria-label="Symptoms">
            {SYMPTOMS.map((x, i) => (
              <button
                key={x.label}
                type="button"
                role="radio"
                aria-checked={pick === i}
                onClick={() => setPick(i)}
                className={`rounded-full border px-4 py-2.5 text-[0.95rem] transition-colors ${pick === i ? 'border-ember bg-ember text-[#1a0d05]' : 'border-white/12 text-bone hover:border-white/35'}`}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="card relative min-h-[17rem] overflow-hidden p-7 sm:p-9" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pick}
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)', filter: 'blur(4px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <p className="text-sm text-dim">Most likely you need</p>
                <h3 className="mt-2 flex items-center gap-3 text-2xl text-bone">
                  <Icon className="h-6 w-6 text-ember" strokeWidth={1.75} aria-hidden /> {svc.title}
                </h3>
                <p className="mt-4 leading-relaxed text-mute">{s.note}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={`/services/${svc.id}`} className="btn btn-primary btn-sm">
                    About {svc.title.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link to={`/contact?service=${encodeURIComponent(svc.title)}`} className="btn btn-ghost btn-sm">
                    Request this service
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { i: MessageSquareText, t: 'Reach out', b: 'Call, text or send a request. We confirm a time that works for you.' },
    { i: Sparkles, t: 'We protect your home', b: 'Drop cloths and containment go down before any work starts.' },
    { i: Camera, t: 'Clean, inspect, document', b: 'We do the work and photograph anything you should see.' },
    { i: Hammer, t: 'You decide what is next', b: 'Plain-English findings. Written quotes for repairs, no pressure.' },
  ];
  return (
    <section className="section border-t hairline" aria-labelledby="process-h">
      <div className="wrap">
        <SectionHeading id="process-h" title="How a visit works" align="center" />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <div aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 0.08} className="relative text-center">
              <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-ember/40 bg-ink text-ember">
                <s.i className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-6 text-lg text-bone">{s.t}</h3>
              <p className="mx-auto mt-2 max-w-[16rem] text-[0.95rem] leading-relaxed text-mute">{s.b}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section className="section border-t hairline bg-ink-2" aria-labelledby="areas-h">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow">Service areas</p>
            <h2 id="areas-h" className="display-lg mt-4 text-bone">
              Four states. One standard.
            </h2>
          </div>
          <p className="lede lg:justify-self-end">Chimneys in coastal Virginia and New England fail in different ways. We know what to look for in each.</p>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[20px] border hairline bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_AREAS.map((s) => (
            <li key={s.slug}>
              <Link to={`/service-areas/${s.slug}`} className="group flex h-full flex-col justify-between gap-10 bg-ink-2 p-7 transition-colors hover:bg-ink-3">
                <span className="font-display text-sm text-dim" style={{ fontStretch: '110%' }}>
                  {s.code}
                </span>
                <span>
                  <span className="block font-display text-[1.7rem] font-bold leading-tight text-bone" style={{ fontStretch: '112%' }}>
                    {s.name}
                  </span>
                  <span className="mt-2 block text-sm text-mute">{s.watchFor[0].title}</span>
                  <span className="link-arrow mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ember">
                    See {s.name} service <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FaqBlock() {
  return (
    <section className="section border-t hairline" aria-labelledby="faq-h">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 id="faq-h" className="display-lg text-bone">
            Good questions.
          </h2>
          <p className="lede mt-5">Straight answers about scheduling, pricing and what to expect.</p>
          <Link to="/faq" className="link-arrow mt-7 inline-flex items-center gap-1.5 font-medium text-ember">
            All FAQs <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <Faq items={GENERAL_FAQS.slice(0, 6)} />
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t hairline" aria-labelledby="final-h">
      <div aria-hidden className="ember-glow absolute inset-0 opacity-80" />
      <div className="wrap relative grid gap-12 py-20 lg:grid-cols-[1fr_minmax(0,32rem)] lg:py-28">
        <div>
          <h2 id="final-h" className="display-lg text-bone">
            Ready when you are.
          </h2>
          <p className="lede mt-5">Tell us what you need and we will reach out to schedule. Prefer to talk? Call or text {SITE.owner.split(' ')[0]} directly.</p>
          <div className="mt-9 grid max-w-sm gap-3">
            <a href={SITE.phoneHref} onClick={() => track('click_to_call', { placement: 'home_final' })} className="card lift flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ember text-[#1a0d05]">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm text-dim">Call or text</span>
                <span className="block text-xl font-medium text-bone">{SITE.phoneDisplay}</span>
              </span>
            </a>
          </div>
        </div>
        <div className="card p-6 sm:p-8" style={{ background: 'rgb(24 22 20 / 0.94)' }}>
          <h3 className="text-xl text-bone">Request service</h3>
          <div className="mt-5">
            <LeadForm formId="service-request" fields={['name', 'phone', 'email', 'zip', 'service', 'message']} required={['name', 'phone', 'zip']} submitLabel="Send my request" dense />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <FactsMarquee />
      <ServicesBento />
      {promoIsLive() && <HolidayFeature />}
      <DesignerTeaser />
      <WhyUs />
      <WorkAndReviews />
      <SymptomFinder />
      <CallbackBand />
      <Process />
      <Areas />
      <FaqBlock />
      <FinalCta />
    </>
  );
}
