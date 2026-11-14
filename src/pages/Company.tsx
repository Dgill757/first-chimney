import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Camera, ChevronLeft, ChevronRight, ClipboardList, Mail, MapPin, MessageSquareText, Phone, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { CallLink, EASE, Faq, PageIntro, Reveal } from '@/components/ui';
import { GENERAL_FAQS, PROJECTS, REVIEWS, REVIEW_LINK, type Project } from '@/data/content';
import { SERVICES } from '@/data/services';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { routeFor } from '@/lib/routes';
import { CREDENTIALS, IMAGES, SITE, STATE_LIST_TEXT, STATES } from '@/lib/site';
import { track } from '@/lib/track';

/* ------------------------------ ABOUT ------------------------------ */
export function About() {
  const r = routeFor('/about')!;
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="A chimney company built on doing it right the first time." lede={`${SITE.name} is owned and run by ${SITE.owner}. The idea is simple: show homeowners what we see, explain it plainly, quote before we work and leave the house clean.`} />
      <section className="section">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="media aspect-[4/5] max-h-[38rem]">
            <img src={IMAGES.chimneyTopSky} alt="Chimney technician working at the top of a chimney against a blue sky" loading="lazy" />
          </Reveal>
          <div>
            <h2 className="display-md text-bone">The standard</h2>
            <div className="mt-6 grid gap-5 text-[1.05rem] leading-relaxed text-mute">
              <p>A lot of homeowners have had the same experience with chimney service: a rushed visit, a vague warning, and a big number with no real explanation. First Chimney exists to be the opposite of that.</p>
              <p>{SITE.owner} holds F.I.R.E. certification for chimney inspection, and every visit is handled the same way. Protect the room. Do the work carefully. Document what matters. Explain it in plain English. Quote anything extra before it happens.</p>
              <p>First Chimney is a newer company. That means every job is a chance to earn a customer for life, and we treat it that way.</p>
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

export function Gallery() {
  const r = routeFor('/gallery')!;
  const [open, setOpen] = useState<Project | null>(null);
  const projects = PROJECTS.filter((p) => p.permission);
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Our work" lede="Real First Chimney jobs, photographed on site and published with each homeowner's permission." />
      <section className="section">
        <div className="wrap">
          {projects.length === 0 ? (
            <div className="card grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <Camera className="h-8 w-8 text-ember" strokeWidth={1.75} aria-hidden />
                <h2 className="display-md mt-6 text-bone">The first projects are being photographed now.</h2>
                <p className="lede mt-4">We only show jobs we actually did, with the homeowner's okay. Every visit is documented, so this page will fill with real before-and-afters from homes like yours.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={promoIsLive() ? HOLIDAY_PROMO.path : '/contact'} className="btn btn-primary">
                    {promoIsLive() ? `Book the ${HOLIDAY_PROMO.priceLabel} special` : 'Schedule service'} <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link to="/services" className="btn btn-ghost">
                    See our services
                  </Link>
                </div>
              </div>
              <div className="media aspect-[4/3]">
                <img src={IMAGES.techRooftop} alt="Chimney technician working on a brick chimney (illustrative photo)" loading="lazy" />
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((p) => (
                <article key={p.slug} className="card overflow-hidden">
                  {p.before && p.after ? (
                    <BeforeAfter before={p.before} after={p.after} alt={p.title} />
                  ) : (
                    <button type="button" onClick={() => setOpen(p)} className="zoom block aspect-[4/3] w-full overflow-hidden">
                      <img src={p.photos[0]?.src} alt={p.photos[0]?.alt} loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  )}
                  <div className="p-6">
                    <p className="text-sm text-dim">
                      {p.service} / {p.city}, {p.state}
                    </p>
                    <h2 className="mt-1 text-xl text-bone">{p.title}</h2>
                    <p className="mt-2 text-mute">{p.summary}</p>
                    {p.photos.length > 0 && (
                      <button type="button" onClick={() => setOpen(p)} className="mt-4 text-sm font-medium text-ember">
                        View {p.photos.length} photos
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <AnimatePresence>{open && <Lightbox project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </>
  );
}

/* ------------------------------ REVIEWS ------------------------------ */
export function Reviews() {
  const r = routeFor('/reviews')!;
  return (
    <>
      <PageIntro crumbs={r.crumbs} title="Reviews" lede="Every review here comes from a real First Chimney customer." />
      <section className="section">
        <div className="wrap">
          {REVIEWS.length === 0 ? (
            <div className="card mx-auto max-w-2xl p-10 text-center">
              <div className="flex justify-center gap-1 text-gold" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-6 w-6" strokeWidth={1.5} />
                ))}
              </div>
              <h2 className="display-md mt-6 text-bone">Our first reviews are on the way.</h2>
              <p className="lede mx-auto mt-4">We would rather show you nothing than show you something made up. Recently worked with us? We would love to hear how it went.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {REVIEW_LINK ? (
                  <a href={REVIEW_LINK} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Leave a review
                  </a>
                ) : (
                  <a href={SITE.smsHref} className="btn btn-primary">
                    Tell us how we did
                  </a>
                )}
                <Link to="/about" className="btn btn-ghost">
                  How we work
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((x) => (
                <li key={x.author + x.date} className="card p-7">
                  <div className="flex gap-0.5 text-gold" aria-label={`${x.rating} out of 5 stars`}>
                    {Array.from({ length: x.rating }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <p className="mt-4 leading-relaxed text-bone">&ldquo;{x.text}&rdquo;</p>
                  <p className="mt-5 text-sm text-mute">
                    {x.author}
                    {x.city ? `, ${x.city}` : ''} on {x.source}
                  </p>
                </li>
              ))}
            </ul>
          )}
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
