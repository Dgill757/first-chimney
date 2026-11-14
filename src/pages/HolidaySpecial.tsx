import { useEffect } from 'react';
import { ArrowDown, BadgeCheck, Brush, CalendarCheck, ClipboardCheck, Home, MessageSquareText, PhoneCall, SearchCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import LeadForm from '@/components/LeadForm';
import { PriceLockup, SaveOffer } from '@/components/Holiday';
import { Breadcrumbs, CallLink, Faq, Reveal, SectionHeading, TextLink } from '@/components/ui';
import { HOLIDAY_PROMO } from '@/lib/promo';
import { routeFor } from '@/lib/routes';
import { CREDENTIALS, IMAGES, SITE, STATE_LIST_TEXT } from '@/lib/site';
import { track } from '@/lib/track';
import { TEAM } from '@/data/team';

const INCLUDE_ICONS = [Brush, SearchCheck, ClipboardCheck];

const FAQS = [
  {
    q: 'What does the $199 holiday special include?',
    a: `${HOLIDAY_PROMO.title}. We clean the flue, smoke chamber and firebox, inspect the chimney and fireplace, and walk you through what we found in plain English.`,
  },
  {
    q: 'How do I claim it?',
    a: `Send the form on this page or call or text ${SITE.phoneDisplay} and mention the holiday special. We will reach out to confirm a time that works for you.`,
  },
  {
    q: 'I have more than one fireplace or flue. Is that covered?',
    a: 'Tell us how many fireplaces, stoves or flues you have when you request your appointment. We will confirm pricing for your home before the visit, so there are no surprises.',
  },
  {
    q: 'What happens if you find a problem?',
    a: 'We show you what we found and explain your options. If a repair is needed, you get a quote first. Nothing beyond the cleaning and inspection is done without your approval.',
  },
  {
    q: 'When does the offer end?',
    a: 'It runs through the holiday season. Appointments fill up as the holidays get closer, so earlier requests have the most scheduling options.',
  },
  {
    q: 'Do you serve my area?',
    a: `We serve homeowners in ${STATE_LIST_TEXT}. Put your address in the form and we will confirm we can reach you.`,
  },
];

export default function HolidaySpecial() {
  const crumbs = routeFor(HOLIDAY_PROMO.path)?.crumbs ?? [];
  const reduce = useReducedMotion();

  useEffect(() => {
    track('promo_view', { promo: HOLIDAY_PROMO.id });
  }, []);

  const toForm = () => {
    track('promo_cta_click', { placement: 'landing_hero' });
    document.getElementById('claim')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => document.querySelector<HTMLInputElement>('#claim input:not([tabindex="-1"])')?.focus({ preventScroll: true }), reduce ? 0 : 600);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pt-40 lg:pb-24">
        <div aria-hidden className="absolute inset-0">
          <img src={IMAGES.heroPoster} alt="" className="h-full w-full object-cover opacity-35" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
          {!reduce && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 16 }, (_, i) => (
                <span
                  key={i}
                  className="ember"
                  style={{ left: `${(i * 17 + 7) % 100}%`, animationDuration: `${9 + (i % 5) * 2}s`, animationDelay: `${i * 0.7}s`, ['--drift' as string]: `${(i % 2 ? 1 : -1) * (10 + i * 3)}px` }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="wrap relative grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-16">
          <div className="min-w-0 lg:pt-6">
            <Breadcrumbs crumbs={crumbs} />
            <p className="eyebrow mt-8">{HOLIDAY_PROMO.eyebrow}</p>
            <h1 className="mt-4 text-[2.05rem] text-bone sm:text-[clamp(2.5rem,4.6vw,4.4rem)]">
              The fire's ready
              <br />
              <span className="text-ember">when your guests are.</span>
            </h1>
            <div className="mt-6">
              <PriceLockup size="xl" />
            </div>
            <p className="lede mt-5">{HOLIDAY_PROMO.pitch}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <button type="button" onClick={toForm} className="btn btn-primary btn-lg col-span-2 lg:hidden">
                Claim your {HOLIDAY_PROMO.priceLabel} special <ArrowDown className="h-5 w-5" aria-hidden />
              </button>
              <CallLink placement="landing_hero" className="btn btn-ghost btn-lg px-4">
                <PhoneCall className="h-5 w-5" aria-hidden /> Call
              </CallLink>
              <TextLink placement="landing_hero" className="btn btn-ghost btn-lg px-4" />
            </div>
            <ul className="mt-10 grid max-w-xl gap-3 text-[0.95rem] text-mute sm:grid-cols-2">
              <li className="flex items-center gap-2.5">
                <BadgeCheck className="h-5 w-5 text-ember" strokeWidth={1.75} aria-hidden /> {CREDENTIALS.fire.title}
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-ember" strokeWidth={1.75} aria-hidden /> Quote before any repair
              </li>
              <li className="flex items-center gap-2.5">
                <Home className="h-5 w-5 text-ember" strokeWidth={1.75} aria-hidden /> Your room stays clean
              </li>
              <li className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-ember" strokeWidth={1.75} aria-hidden /> Owner-operated
              </li>
            </ul>
          </div>

          <div id="claim" className="card min-w-0 scroll-mt-28 p-5 sm:p-8" style={{ background: 'rgb(24 22 20 / 0.94)' }}>
            <h2 className="text-2xl text-bone">Claim the {HOLIDAY_PROMO.priceLabel} special</h2>
            <p className="mt-2 text-sm text-mute">Takes about a minute. We will call or text to confirm your appointment.</p>
            <div className="mt-6">
              <LeadForm
                formId="holiday-199"
                promo={HOLIDAY_PROMO.campaign}
                fields={['name', 'phone', 'email', 'address', 'city', 'state', 'zip', 'timeframe', 'message']}
                required={['name', 'phone', 'address', 'city', 'state', 'zip']}
                submitLabel={`Request my ${HOLIDAY_PROMO.priceLabel} appointment`}
                messageLabel="Anything we should know?"
                messagePlaceholder="Number of fireplaces or stoves, roof access, best time to reach you..."
                successTitle="You're on the list."
                successBody={
                  <p>
                    We received your {HOLIDAY_PROMO.priceLabel} holiday request and will call or text to confirm a time. Your appointment is set once we have confirmed it with you.
                  </p>
                }
                dense
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="section border-t hairline">
        <div className="wrap">
          <SectionHeading title={`What you get for ${HOLIDAY_PROMO.priceLabel}`} lede="One visit. A clean chimney, a clear picture of its condition, and no pressure." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {HOLIDAY_PROMO.includes.map((item, i) => {
              const Icon = INCLUDE_ICONS[i] ?? Brush;
              return (
                <Reveal key={item.title} delay={i * 0.06} className="card lift p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ember/12 text-ember" style={{ background: 'rgb(240 122 50 / 0.12)' }}>
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl text-bone">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-mute">{item.body}</p>
                </Reveal>
              );
            })}
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-dim">
            {HOLIDAY_PROMO.finePrint.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="section relative overflow-hidden bg-ink-2">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="media aspect-[5/4]">
            <img src={TEAM.sweeping.src} alt={TEAM.sweeping.alt} loading="lazy" width={TEAM.sweeping.w} height={TEAM.sweeping.h} />
          </Reveal>
          <div>
            <h2 className="display-md text-bone">Why book before the holidays</h2>
            <dl className="mt-10 grid gap-8">
              {[
                { t: 'Your fireplace gets its heaviest use in December.', b: 'A season of fires leaves creosote in the flue. Starting clean is the safest way into the busiest burning weeks of the year.' },
                { t: 'Problems are easier to fix before you need the fire.', b: 'If the inspection turns up a cracked crown or a stuck damper, there is still time to handle it before guests arrive.' },
                { t: 'The calendar fills up fast.', b: 'Chimney service demand peaks right before the holidays. Requesting now gives you the most choice of dates.' },
              ].map((x) => (
                <div key={x.t} className="border-l-2 border-ember/60 pl-5">
                  <dt className="text-lg font-medium text-bone">{x.t}</dt>
                  <dd className="mt-2 leading-relaxed text-mute">{x.b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="wrap">
          <SectionHeading title="How it works" />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[20px] border hairline bg-white/[0.06] md:grid-cols-4">
            {[
              { i: CalendarCheck, t: 'Request', b: 'Send the form or call. Takes a minute.' },
              { i: MessageSquareText, t: 'Confirm', b: 'We call or text to lock in a time that works for you.' },
              { i: Brush, t: 'Clean + inspect', b: 'Drop cloths down, chimney cleaned and inspected.' },
              { i: ClipboardCheck, t: 'Walkthrough', b: 'Plain-English findings. Quotes only if something needs work.' },
            ].map((s, n) => (
              <li key={s.t} className="bg-ink p-7">
                <div className="flex items-center justify-between">
                  <s.i className="h-6 w-6 text-ember" strokeWidth={1.75} aria-hidden />
                  <span className="font-display text-sm text-dim">{n + 1}/4</span>
                </div>
                <h3 className="mt-6 text-lg text-bone">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SAVE + FAQ */}
      <section className="section border-t hairline">
        <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid content-start gap-6">
            <h2 className="display-md text-bone">Questions about the special</h2>
            <SaveOffer />
          </div>
          <Faq items={FAQS} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t hairline">
        <div aria-hidden className="ember-glow absolute inset-0" />
        <div className="wrap relative py-20 text-center lg:py-28">
          <h2 className="display-lg mx-auto max-w-3xl text-bone">Get the fire ready before the guests arrive.</h2>
          <p className="lede mx-auto mt-5">{HOLIDAY_PROMO.title} for {HOLIDAY_PROMO.priceLabel}, this holiday season.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={toForm} className="btn btn-primary btn-lg">
              Claim your {HOLIDAY_PROMO.priceLabel} special
            </button>
            <CallLink placement="landing_footer" className="btn btn-ghost btn-lg" />
          </div>
        </div>
      </section>
    </>
  );
}
