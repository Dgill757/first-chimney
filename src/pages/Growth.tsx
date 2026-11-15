/**
 * Growth pages: the parts of the site that work for Andrew while he is on a roof.
 *  - Chimney Health Check: 10-question self-assessment that educates, then captures the lead
 *  - Real estate: Level 2 inspections for buyers, sellers, realtors and inspectors (B2B referrals)
 *  - Careers: recruiting a helper / technician / mason
 *  - Refer a friend: word of mouth, captured
 *  - How to choose a chimney company: comparison against the market without naming anyone
 * Plus ReminderSignup, the annual-reminder list that turns one-time jobs into yearly customers.
 */
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BellRing, Briefcase, Check, CheckCircle2, ClipboardCheck, Gift, HardHat, Home as HomeIcon, KeyRound, Phone, ShieldAlert, Sparkles, Users, XCircle } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { CallLink, EASE, Faq, PageIntro, Reveal } from '@/components/ui';
import { CAREER_FAQS, CHOOSE_QUESTIONS, HEALTH_CHECK, PARTNER_ROLES, POSITIONS, REAL_ESTATE_FAQS, RED_FLAGS, REFERRAL_REWARD, scoreHealthCheck, type CheckLevel } from '@/data/growth';
import { SERVICES } from '@/data/services';
import { EXPERIENCE, TEAM } from '@/data/team';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { routeFor } from '@/lib/routes';
import { CREDENTIALS, SITE } from '@/lib/site';
import { track } from '@/lib/track';

const serviceById = (id: string) => SERVICES.find((s) => s.id === id);

/* --------------------------- Shared pieces --------------------------- */

function Chips<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`rounded-full border px-4 py-2 text-sm transition-colors active:scale-[0.98] ${value === o ? 'border-ember bg-ember text-[#1a0d05]' : 'border-white/12 text-mute hover:border-white/25 hover:text-bone'}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Point({ icon: Icon, title, children }: { icon: typeof Check; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/12 text-ember">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="font-medium text-bone">{title}</p>
        <p className="mt-1 text-mute">{children}</p>
      </div>
    </li>
  );
}

/** Annual reminder list. One-time jobs become yearly customers. */
export function ReminderSignup({ placement, compact = false }: { placement: string; compact?: boolean }) {
  return (
    <div id="reminder" className={`card scroll-mt-28 ${compact ? 'p-6' : 'p-6 sm:p-8'}`}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-ember/15 text-ember">
        <BellRing className="h-5 w-5" aria-hidden />
      </span>
      <h2 className="mt-5 text-2xl text-bone">Never forget your yearly inspection.</h2>
      <p className="mt-2 text-mute">One reminder a year, before the busy season, so you can book early and burn safely. No spam, ever.</p>
      <div className="mt-6">
        <LeadForm
          formId="reminder"
          fields={['name', 'email', 'phone', 'city']}
          required={['name']}
          submitLabel="Remind me every year"
          successTitle="You are on the list."
          successBody={<p>We will reach out once a year, ahead of fireplace season. Need something sooner? Call or text anytime.</p>}
          details={() => `Reminder signup from: ${placement}`}
          dense
        />
      </div>
    </div>
  );
}

/* --------------------------- Health check ---------------------------- */

const LEVEL_STYLE: Record<CheckLevel, { ring: string; text: string; icon: typeof Check }> = {
  Urgent: {
    ring: 'border-red-400/40 bg-red-500/10',
    text: 'text-red-300',
    icon: ShieldAlert,
  },
  Soon: {
    ring: 'border-ember/40 bg-ember/10',
    text: 'text-ember',
    icon: AlertTriangle,
  },
  Good: { ring: 'border-ok/40 bg-ok/10', text: 'text-ok', icon: CheckCircle2 },
};

export function HealthCheck() {
  const r = routeFor('/chimney-health-check')!;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const done = step >= HEALTH_CHECK.length;
  const scored = useMemo(() => scoreHealthCheck(answers), [answers]);
  const q = HEALTH_CHECK[Math.min(step, HEALTH_CHECK.length - 1)];
  const live = promoIsLive();

  const choose = (i: number) => {
    const next = { ...answers, [q.id]: i };
    setAnswers(next);
    track('health_check_answer', { question: q.id, step: step + 1 });
    if (step + 1 >= HEALTH_CHECK.length)
      track('health_check_result', {
        level: scoreHealthCheck(next).result.level,
      });
    setStep(step + 1);
  };

  const summary = () => ['Chimney Health Check', `Result: ${scored.result.level}`, `Score: ${scored.score}`, ...HEALTH_CHECK.map((x) => `- ${x.q} ${x.options[answers[x.id]]?.label ?? '(skipped)'}`)].join('\n');

  const res = scored.result;
  const style = LEVEL_STYLE[res.level];
  const firstService = serviceById(res.services[0]);

  return (
    <>
      <PageIntro
        crumbs={r.crumbs}
        eyebrow="Free 2-minute check"
        title="Is your chimney safe to use?"
        lede={`Answer ${HEALTH_CHECK.length} quick questions. You will get a plain-English read on your chimney, what to do next and what to watch for. Built from the warning signs ${SITE.owner} looks for on every inspection.`}
      />
      <section className="section pt-12">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="card min-w-0 p-6 sm:p-9">
            {!done ? (
              <>
                <div className="flex items-center justify-between gap-4 text-sm text-dim">
                  <span>
                    Question {step + 1} of {HEALTH_CHECK.length}
                  </span>
                  {step > 0 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 text-mute hover:text-bone">
                      <ArrowLeft className="h-4 w-4" aria-hidden /> Back
                    </button>
                  )}
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8" aria-hidden>
                  <motion.div
                    className="h-full rounded-full bg-ember"
                    initial={false}
                    animate={{
                      width: `${(step / HEALTH_CHECK.length) * 100}%`,
                    }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22, ease: EASE }}>
                    <h2 className="mt-8 text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-bone">{q.q}</h2>
                    {q.hint && <p className="mt-3 text-mute">{q.hint}</p>}
                    <div className="mt-7 grid gap-3">
                      {q.options.map((o, i) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => choose(i)}
                          className={`group flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-colors active:scale-[0.99] ${answers[q.id] === i ? 'border-ember bg-ember/10 text-bone' : 'border-white/10 text-bone hover:border-white/25 hover:bg-white/[0.03]'}`}
                        >
                          <span>{o.label}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-ember" aria-hidden />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                <div className={`rounded-2xl border p-6 ${style.ring}`} role="status">
                  <p className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] ${style.text}`}>
                    <style.icon className="h-5 w-5" aria-hidden /> {res.level === 'Good' ? 'Looking good' : res.level === 'Soon' ? 'Worth a look' : 'Act now'}
                  </p>
                  <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug text-bone">{res.title}</h2>
                  <p className="mt-3 text-mute">{res.body}</p>
                  {res.level === 'Urgent' && <p className="mt-4 text-sm text-mute">If you smell gas or a carbon monoxide alarm sounds, get everyone outside and call 911.</p>}
                </div>

                <h3 className="mt-9 text-lg text-bone">What we would look at</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {res.services.map((id) => {
                    const s = serviceById(id);
                    return s ? (
                      <li key={id}>
                        <Link to={`/services/${id}`} className="card lift flex h-full flex-col p-5">
                          <span className="font-medium text-bone">{s.title}</span>
                          <span className="mt-1 text-sm text-mute">{s.short}</span>
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>

                {res.level !== 'Good' ? (
                  <div className="mt-10 border-t hairline pt-8">
                    <h3 className="text-2xl text-bone">Have Andrew take a look</h3>
                    <p className="mt-2 text-mute">Your answers are sent with your request, so he shows up already knowing what you noticed.</p>
                    <div className="mt-6">
                      <LeadForm
                        formId="safety-check"
                        fields={['name', 'phone', 'email', 'city', 'state', 'zip', 'service', 'message']}
                        required={['name', 'phone', 'zip']}
                        defaultService={live && res.level === 'Soon' ? `Holiday ${HOLIDAY_PROMO.priceLabel} cleaning + inspection` : (firstService?.title ?? '')}
                        submitLabel="Request my inspection"
                        details={summary}
                        dense
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-10 border-t hairline pt-8">
                    <ReminderSignup placement="health-check-good" compact />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({});
                    setStep(0);
                  }}
                  className="mt-8 text-sm text-mute underline-offset-4 hover:text-bone hover:underline"
                >
                  Start over
                </button>
              </motion.div>
            )}
          </div>

          <aside className="grid h-fit gap-4">
            <div className="card overflow-hidden">
              <img src={TEAM.inspectionRoof.sm} alt={TEAM.inspectionRoof.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <p className="font-semibold text-bone">This check is a starting point.</p>
                <p className="mt-1 text-sm text-mute">
                  Only an inspection can see inside the flue. {SITE.owner} is {CREDENTIALS.fire.fullName} with {EXPERIENCE.ownerYears} years in the trade.
                </p>
              </div>
            </div>
            {live && (
              <Link to={HOLIDAY_PROMO.path} onClick={() => track('promo_cta_click', { placement: 'health_check_aside' })} className="card lift flex items-center justify-between gap-4 border-ember/30 p-5">
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ember">Holiday special</span>
                  <span className="mt-1 block text-bone">{HOLIDAY_PROMO.title}</span>
                </span>
                <span className="price-199 text-4xl">{HOLIDAY_PROMO.priceLabel}</span>
              </Link>
            )}
            <CallLink placement="health_check_aside" className="btn btn-ghost w-full justify-center">
              <Phone className="h-4 w-4" aria-hidden /> Rather talk? {SITE.phoneDisplay}
            </CallLink>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ---------------------------- Real estate ---------------------------- */

export function RealEstate() {
  const r = routeFor('/real-estate-chimney-inspections')!;
  const [role, setRole] = useState<(typeof PARTNER_ROLES)[number]>('Home buyer');
  const isPartner = role === 'Realtor' || role === 'Home inspector' || role === 'Property manager';
  return (
    <>
      <PageIntro
        crumbs={r.crumbs}
        eyebrow="Buying or selling a home"
        title="Chimney inspections that keep closings on track."
        lede="A home inspection usually looks at the chimney from the outside. The expensive problems are inside the flue. A Level 2 inspection finds them before they become a surprise at the closing table."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#request" className="btn btn-primary btn-lg">
            Request an inspection
          </a>
          <CallLink placement="real_estate_hero" className="btn btn-ghost btn-lg">
            <Phone className="h-5 w-5" aria-hidden /> {SITE.phoneDisplay}
          </CallLink>
        </div>
      </PageIntro>

      <section className="section">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
          {[
            {
              icon: KeyRound,
              t: 'Buyers',
              b: 'Know what you are buying. Hidden flue damage can cost thousands to fix after you own the house. Find out while you can still negotiate.',
            },
            {
              icon: HomeIcon,
              t: 'Sellers',
              b: 'Inspect before you list. Fix issues on your schedule and hand buyers a clean report instead of a last-minute repair request.',
            },
            {
              icon: Users,
              t: 'Realtors and inspectors',
              b: 'One reliable call for every chimney question in a deal. Clear findings, photos where possible and quick answers for your clients.',
            },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.05} className="card p-7">
              <x.icon className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
              <h2 className="mt-5 text-xl text-bone">{x.t}</h2>
              <p className="mt-2 text-mute">{x.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <p className="eyebrow">Why Level 2</p>
            <h2 className="display-md mt-4 text-bone">The national standard calls for it at every sale.</h2>
            <p className="mt-5 text-mute">
              NFPA 211, the fire safety standard for chimneys, fireplaces and vents, calls for a Level 2 inspection when a property is sold or transferred. It goes beyond a visual check: the flue is examined with a camera from top to
              bottom.
            </p>
            <ul className="mt-8 grid gap-6">
              <Point icon={ClipboardCheck} title="Everything a Level 1 covers, plus the inside of the flue">
                Firebox, damper, smoke chamber, exterior masonry, crown and cap, and a camera look at the liner.
              </Point>
              <Point icon={BadgeCheck} title={CREDENTIALS.fire.title}>
                Andrew is listed in the official F.I.R.E. directory. Verifiable credentials matter when a report goes to a lender or a negotiation.
              </Point>
              <Point icon={Sparkles} title="Plain-English findings">
                What is fine, what needs attention and what can wait. If repairs are needed, a written quote comes separately, so the report stays a report.
              </Point>
            </ul>
            <Link to="/blog/what-is-a-level-2-chimney-inspection" className="link-arrow mt-8 inline-flex items-center gap-1.5 text-ember">
              Inspection levels 1, 2 and 3 explained <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div id="request" className="card min-w-0 scroll-mt-28 p-6 sm:p-8">
            <h2 className="text-2xl text-bone">{isPartner ? 'Work with First Chimney' : 'Request a home-sale inspection'}</h2>
            <p className="mt-2 text-mute">{isPartner ? 'Tell us a little about you. Andrew will reach out to set up how you send clients our way.' : 'Include your inspection deadline and we will do our best to fit it.'}</p>
            <div className="mt-6">
              <p className="mb-3 text-sm text-dim">I am a...</p>
              <Chips options={PARTNER_ROLES} value={role} onChange={setRole} label="Your role" />
            </div>
            <div className="mt-6">
              <LeadForm
                key={isPartner ? 'partner' : 'client'}
                formId={isPartner ? 'partner' : 'service-request'}
                fields={isPartner ? ['name', 'phone', 'email', 'city', 'state', 'message'] : ['name', 'phone', 'email', 'address', 'city', 'state', 'zip', 'timeframe', 'message']}
                required={isPartner ? ['name'] : ['name', 'phone', 'zip']}
                defaultService={isPartner ? '' : 'Chimney Inspection'}
                messageLabel={isPartner ? 'Company and how you would like to work together' : 'Inspection deadline or closing date'}
                messagePlaceholder={isPartner ? 'Brokerage or company, areas you cover, typical volume...' : 'Example: inspection period ends March 14, closing April 2'}
                details={() => `Role: ${role}\nInterest: ${isPartner ? 'Referral partnership' : 'Level 2 inspection for a home sale'}`}
                submitLabel={isPartner ? 'Start the conversation' : 'Request my inspection'}
                dense
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap max-w-3xl">
          <h2 className="display-md text-bone">Questions from buyers, sellers and agents</h2>
          <Faq items={REAL_ESTATE_FAQS} className="mt-8" />
        </div>
      </section>
    </>
  );
}

/* ------------------------------ Careers ------------------------------ */

export function Careers() {
  const r = routeFor('/careers')!;
  const [position, setPosition] = useState<string>(POSITIONS[1].title);
  const [license, setLicense] = useState<'Yes' | 'No'>('Yes');
  const [roofs, setRoofs] = useState<'Yes' | 'No'>('Yes');
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div aria-hidden className="ember-glow pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-60" />
        <div className="wrap relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <p className="eyebrow">Careers at First Chimney</p>
            <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.2rem)] text-bone">Learn a real trade from someone who loves it.</h1>
            <p className="lede mt-6">
              {SITE.owner} has spent {EXPERIENCE.ownerYears} years in the chimney industry. He is looking for good people who show up, work carefully and treat every home like their own.
            </p>
            <a href="#apply" className="btn btn-primary btn-lg mt-9">
              Apply in 2 minutes
            </a>
          </div>
          <Reveal className="min-w-0">
            <div className="media aspect-[4/3]">
              <img src={TEAM.liner.src} alt={TEAM.liner.alt} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
          {POSITIONS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05} className="card flex flex-col p-7">
              {i === 0 ? (
                <Briefcase className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
              ) : i === 1 ? (
                <HardHat className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
              ) : (
                <ClipboardCheck className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
              )}
              <h2 className="mt-5 text-xl text-bone">{p.title}</h2>
              <p className="mt-2 text-mute">{p.summary}</p>
              <ul className="mt-5 grid gap-2 text-sm text-mute">
                {p.fit.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0">
            <h2 className="display-md text-bone">What the work is like</h2>
            <ul className="mt-8 grid gap-6">
              <Point icon={HardHat} title="Hands-on, every day">
                Roofs, ladders, fireboxes and masonry. Every job is a little different and you see the result before you leave.
              </Point>
              <Point icon={BadgeCheck} title="Learn it the right way">
                Training comes from a {CREDENTIALS.fire.title}. Safety first, then quality, then speed.
              </Point>
              <Point icon={HomeIcon} title="Respect for the customer">
                Drop cloths down, honest findings, clean work area. That is the standard here.
              </Point>
            </ul>
            <div className="mt-10">
              <Faq items={CAREER_FAQS} />
            </div>
          </div>
          <div id="apply" className="card min-w-0 scroll-mt-28 p-6 sm:p-8">
            <h2 className="text-2xl text-bone">Apply</h2>
            <p className="mt-2 text-mute">No resume needed. Andrew reads every application himself.</p>
            <div className="mt-6 grid gap-5">
              <div>
                <p className="mb-3 text-sm text-dim">Position</p>
                <Chips options={POSITIONS.map((p) => p.title)} value={position} onChange={setPosition} label="Position" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm text-dim">Valid driver’s license?</p>
                  <Chips options={['Yes', 'No'] as const} value={license} onChange={setLicense} label="Valid driver's license" />
                </div>
                <div>
                  <p className="mb-3 text-sm text-dim">Comfortable on roofs and ladders?</p>
                  <Chips options={['Yes', 'No'] as const} value={roofs} onChange={setRoofs} label="Comfortable on roofs and ladders" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <LeadForm
                formId="job-application"
                fields={['name', 'phone', 'email', 'city', 'state', 'message']}
                required={['name', 'phone', 'message']}
                messageLabel="Tell Andrew about yourself"
                messagePlaceholder="Work experience, trades you know, when you can start, anything else he should know."
                details={() => `Position: ${position}\nDriver license: ${license}\nComfortable on roofs and ladders: ${roofs}`}
                submitLabel="Send my application"
                successTitle="Application received."
                successBody={<p>Thanks for your interest in First Chimney. Andrew reads every application and will call if it looks like a fit.</p>}
                dense
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ Referral ----------------------------- */

export function Refer() {
  const r = routeFor('/refer-a-friend')!;
  return (
    <>
      <PageIntro
        crumbs={r.crumbs}
        eyebrow="Refer a friend"
        title="Know someone whose chimney needs a look?"
        lede={`Most of our work comes from neighbors telling neighbors. Send their name and number and ${SITE.owner} will reach out personally, and mention you sent them.`}
      />
      <section className="section pt-12">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="card min-w-0 p-6 sm:p-9">
            <h2 className="text-2xl text-bone">Send a referral</h2>
            <p className="mt-2 text-mute">Your details first, then tell us who to contact. Please let them know we will be calling.</p>
            <div className="mt-6">
              <LeadForm
                formId="referral"
                fields={['name', 'phone', 'email', 'message']}
                required={['name', 'message']}
                messageLabel="Who should we contact?"
                messagePlaceholder="Their name, phone number, town and what they need (cleaning, a leak, a rebuild...)"
                details={() => 'Referral: the person in the message was referred by this contact. Call them, mention who sent you, and thank the referrer.'}
                submitLabel="Send referral"
                successTitle="Thank you."
                successBody={<p>We will reach out to them soon and let them know you sent us. Referrals are the best compliment a small business can get.</p>}
                dense
              />
            </div>
          </div>
          <aside className="grid h-fit gap-4">
            <div className="card p-6">
              <Gift className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
              <p className="mt-4 text-lg text-bone">{REFERRAL_REWARD ? `As a thank-you: ${REFERRAL_REWARD}.` : 'Andrew will personally thank you.'}</p>
              <p className="mt-2 text-sm text-mute">Every referral goes straight to Andrew. Nobody gets added to a call list.</p>
            </div>
            <div className="card overflow-hidden">
              <img src={TEAM.headshot.sm} alt={TEAM.headshot.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <p className="font-semibold text-bone">{SITE.owner}</p>
                <p className="mt-1 text-sm text-mute">Owner, {CREDENTIALS.fire.title}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/* --------------------------- How to choose --------------------------- */

export function ChooseCompany() {
  const r = routeFor('/how-to-choose-a-chimney-company')!;
  return (
    <>
      <PageIntro
        crumbs={r.crumbs}
        eyebrow="Homeowner guide"
        title="How to choose a chimney company."
        lede="Six questions to ask any chimney company before you let them on your roof, the red flags that should end the call, and how First Chimney answers each one."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="btn btn-primary btn-lg">
            Schedule with Andrew
          </Link>
          <Link to="/chimney-health-check" className="btn btn-ghost btn-lg">
            Take the 2-minute health check
          </Link>
        </div>
      </PageIntro>

      <section className="section">
        <div className="wrap">
          <ol className="grid gap-5">
            {CHOOSE_QUESTIONS.map((x, i) => (
              <Reveal as="li" key={x.q} delay={i * 0.03} className="card grid grid-cols-[minmax(0,1fr)] gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                <div className="min-w-0">
                  <p className="font-mono text-sm text-ember">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="mt-2 text-xl text-bone">{x.q}</h2>
                  <p className="mt-2 text-mute">{x.why}</p>
                </div>
                <div className="min-w-0 rounded-2xl border border-ember/25 bg-ember/[0.06] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ember">First Chimney</p>
                  <p className="mt-2 text-bone">{x.us}</p>
                  {i === 0 && (
                    <a href={CREDENTIALS.fire.verifyUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-ember underline-offset-4 hover:underline">
                      Check the directory <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="card min-w-0 p-7 sm:p-9">
            <h2 className="display-md text-bone">Red flags</h2>
            <p className="mt-3 text-mute">If you hear any of these, get a second opinion before you pay for anything.</p>
            <ul className="mt-6 grid gap-4">
              {RED_FLAGS.map((f) => (
                <li key={f} className="flex gap-3 text-mute">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="card min-w-0 p-7 sm:p-9">
            <h2 className="display-md text-bone">Already have a quote?</h2>
            <p className="mt-3 text-mute">Someone told you that you need a new liner or a rebuild? Send it to Andrew for a second opinion. He will tell you honestly whether it is needed, even if that means there is no job for us.</p>
            <div className="mt-6">
              <LeadForm
                formId="contact"
                fields={['name', 'phone', 'email', 'zip', 'message']}
                required={['name', 'phone', 'message']}
                messageLabel="What were you told, and what was the quote?"
                messagePlaceholder="Example: told I need a full liner for $X after a $79 cleaning..."
                details={() => 'Second opinion request'}
                submitLabel="Get a second opinion"
                dense
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
