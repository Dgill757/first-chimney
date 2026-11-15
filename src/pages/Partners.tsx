/**
 * Partner program (hub + one page per industry), the chimney fire news section,
 * and the Resources hub that links every guide, tool and article.
 */
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Briefcase, Building2, Check, ClipboardCheck, Download, FileText, Flame, HardHat, Home as HomeIcon, KeyRound, Newspaper, Phone, Search, ShieldCheck, Sparkles, Users } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { CallLink, Faq, PageIntro, Reveal } from '@/components/ui';
import { ARTICLES } from '@/data/blog';
import { NEWS, NEWS_STATS, type NewsTag } from '@/data/news';
import { PARTNER_INDUSTRIES, PARTNER_PROGRAM, partnerBySlug, type PartnerIndustry } from '@/data/partners';
import { EXPERIENCE, TEAM } from '@/data/team';
import { routeFor } from '@/lib/routes';
import { CREDENTIALS, SITE } from '@/lib/site';
import { track } from '@/lib/track';
import NotFound from './NotFound';

const INDUSTRY_ICON: Record<string, typeof Check> = { realtors: KeyRound, 'home-inspectors': Search, contractors: HardHat, 'property-managers': Building2, insurance: ShieldCheck };

/* ------------------------------ Partners hub ------------------------------ */

export function PartnersHub() {
  const r = routeFor('/partners')!;
  return (
    <>
      <PageIntro
        crumbs={r.crumbs}
        eyebrow="Partner program"
        title="Work with First Chimney."
        lede={`Realtors, home inspectors, contractors, property managers and insurance pros see chimney problems every week. Partner with ${SITE.owner}, ${CREDENTIALS.fire.fullName}, and give your clients a fast, honest answer.`}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#industries" className="btn btn-primary btn-lg">
            Find your industry
          </a>
          <CallLink placement="partners_hero" className="btn btn-ghost btn-lg">
            <Phone className="h-5 w-5" aria-hidden /> Text Andrew
          </CallLink>
        </div>
      </PageIntro>

      <section className="section">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <p className="eyebrow">What partners get</p>
            <h2 className="display-md mt-4 text-bone">A {PARTNER_PROGRAM.discount}, priority scheduling and a specialist who answers.</h2>
            <ul className="mt-8 grid gap-4">
              {PARTNER_PROGRAM.perks.map((p) => (
                <li key={p} className="flex gap-3 text-mute">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden /> {p}
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="min-w-0">
            <div className="media aspect-[4/3]">
              <img src={TEAM.inspectionRoof.src} alt={TEAM.inspectionRoof.alt} />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="industries" className="section scroll-mt-24 pt-0">
        <div className="wrap">
          <h2 className="display-md text-bone">Choose your industry</h2>
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PARTNER_INDUSTRIES.map((p, i) => {
              const Icon = INDUSTRY_ICON[p.slug] ?? Users;
              return (
                <Reveal as="li" key={p.slug} delay={i * 0.04}>
                  <Link to={`/partners/${p.slug}`} className="card lift flex h-full flex-col p-7">
                    <Icon className="h-7 w-7 text-ember" strokeWidth={1.75} aria-hidden />
                    <h3 className="mt-5 text-xl text-bone">{p.name}</h3>
                    <p className="mt-1 text-sm text-dim">{p.short}</p>
                    <p className="mt-3 text-mute">{p.guide.title}</p>
                    <span className="link-arrow mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-ember">
                      See the partnership <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <PartnerForm industry={null} />
    </>
  );
}

/* ---------------------------- Industry page ---------------------------- */

export function PartnerIndustryPage() {
  const { industry = '' } = useParams();
  const p = partnerBySlug(industry);
  if (!p) return <NotFound />;
  const r = routeFor(`/partners/${p.slug}`)!;
  const Icon = INDUSTRY_ICON[p.slug] ?? Users;
  return (
    <>
      <PageIntro crumbs={r.crumbs} eyebrow={`Partners · ${p.name}`} title={p.title} lede={p.lede}>
        <div className="flex flex-wrap gap-3">
          <a href="#partner" className="btn btn-primary btn-lg">
            Become a partner
          </a>
          <a href="#guide" className="btn btn-ghost btn-lg">
            <Download className="h-5 w-5" aria-hidden /> Free guide
          </a>
        </div>
      </PageIntro>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Sound familiar?</p>
          <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
            {p.pains.map((x, i) => (
              <Reveal as="li" key={x.t} delay={i * 0.04} className="card p-7">
                <Flame className="h-6 w-6 text-ember" strokeWidth={1.75} aria-hidden />
                <h2 className="mt-4 text-lg text-bone">{x.t}</h2>
                <p className="mt-2 text-mute">{x.b}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-w-0">
            <h2 className="display-md text-bone">What working with Andrew looks like</h2>
            <ul className="mt-8 grid gap-6">
              {p.benefits.map((b) => (
                <li key={b.t} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/12 text-ember">
                    <BadgeCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-bone">{b.t}</p>
                    <p className="mt-1 text-mute">{b.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside className="grid h-fit gap-4">
            <div className="card border-ember/30 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ember">Partner offer</p>
              <p className="mt-3 font-display text-3xl text-bone">{PARTNER_PROGRAM.discount}</p>
              <p className="mt-3 text-mute">{p.offer}</p>
              <ul className="mt-5 grid gap-2 text-sm text-mute">
                {PARTNER_PROGRAM.perks.slice(1, 4).map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card overflow-hidden">
              <img src={TEAM.headshot.sm} alt={TEAM.headshot.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <p className="font-semibold text-bone">{SITE.owner}</p>
                <p className="mt-1 text-sm text-mute">
                  {CREDENTIALS.fire.title} · {EXPERIENCE.ownerYears} years in the chimney trade.{' '}
                  <a href={CREDENTIALS.fire.verifyUrl} target="_blank" rel="noreferrer" className="text-ember underline-offset-4 hover:underline">
                    Verify the credential
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="guide" className="section scroll-mt-24 pt-0">
        <div className="wrap">
          <div className="card grid grid-cols-[minmax(0,1fr)] gap-8 overflow-hidden p-6 sm:p-9 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="min-w-0">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ember/15 text-ember">
                <FileText className="h-6 w-6" aria-hidden />
              </span>
              <p className="eyebrow mt-6">Free download</p>
              <h2 className="display-md mt-3 text-bone">{p.guide.title}</h2>
              <p className="mt-4 text-mute">{p.guide.blurb}</p>
              <ul className="mt-5 grid gap-2 text-sm text-mute">
                {['Inspection levels and when each applies', 'Codes and standards in plain English', 'Common problems, with real photos', 'Typical costs from national data', 'How to work with First Chimney'].map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
              <h3 className="text-xl text-bone">Send me the guide and partner details</h3>
              <p className="mt-1 text-sm text-mute">Andrew will email the guide and reach out about partner pricing.</p>
              <div className="mt-5">
                <LeadForm
                  formId="partner"
                  fields={['name', 'email', 'phone', 'message']}
                  required={['name', 'email']}
                  messageLabel="Company"
                  messagePlaceholder="Brokerage, company or property portfolio"
                  details={() => `Role: ${p.role}\nRequested: ${p.guide.title}\nInterest: partner pricing`}
                  submitLabel="Get the guide"
                  successTitle="Here is your guide."
                  successBody={
                    <div>
                      <p>Thanks. Andrew will be in touch about partner pricing.</p>
                      <a href={p.guide.file} download onClick={() => track('cta_click', { placement: `guide_${p.slug}_after_form` })} className="btn btn-primary btn-sm mt-4">
                        <Download className="h-4 w-4" aria-hidden /> Download the PDF
                      </a>
                    </div>
                  }
                  dense
                />
              </div>
              <a href={p.guide.file} download onClick={() => track('cta_click', { placement: `guide_${p.slug}_direct` })} className="mt-4 inline-flex items-center gap-1.5 text-sm text-mute underline-offset-4 hover:text-bone hover:underline">
                Just want the PDF? Download it here <Download className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap max-w-3xl">
          <h2 className="display-md text-bone">Questions from {p.name.toLowerCase()}</h2>
          <Faq items={p.faqs} className="mt-8" />
        </div>
      </section>

      <PartnerForm industry={p} icon={Icon} />

      <section className="section pt-0">
        <div className="wrap">
          <p className="eyebrow">Other partner programs</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {PARTNER_INDUSTRIES.filter((x) => x.slug !== p.slug).map((x) => (
              <li key={x.slug}>
                <Link to={`/partners/${x.slug}`} className="inline-flex rounded-full border border-white/12 px-4 py-2 text-sm text-mute hover:border-white/30 hover:text-bone">
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function PartnerForm({ industry, icon: Icon = Briefcase }: { industry: PartnerIndustry | null; icon?: typeof Check }) {
  const [role, setRole] = useState(industry?.role ?? PARTNER_INDUSTRIES[0].role);
  return (
    <section id="partner" className="section scroll-mt-24 pt-0">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0">
          <Icon className="h-8 w-8 text-ember" strokeWidth={1.75} aria-hidden />
          <h2 className="display-md mt-5 text-bone">Book a 10-minute call with Andrew</h2>
          <p className="mt-4 text-mute">Tell him what you do and how you would like to work together. He will reach out, set up partner pricing and send you the guide for your industry.</p>
          <p className="mt-6 text-mute">
            Prefer to text? <a href={SITE.smsHref} className="text-ember underline-offset-4 hover:underline">{SITE.phoneDisplay}</a>
          </p>
        </div>
        <div className="card min-w-0 p-6 sm:p-8">
          {!industry && (
            <div className="field mb-5">
              <label htmlFor="partner-role">I am a…</label>
              <select id="partner-role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                {PARTNER_INDUSTRIES.map((x) => (
                  <option key={x.slug} value={x.role}>
                    {x.short}
                  </option>
                ))}
              </select>
            </div>
          )}
          <LeadForm
            formId="partner"
            fields={['name', 'phone', 'email', 'city', 'state', 'message']}
            required={['name', 'phone']}
            messageLabel="Company and how you would like to work together"
            messagePlaceholder="Brokerage or company, areas you cover, typical volume, upcoming deadlines…"
            details={() => `Role: ${role}\nInterest: partnership call`}
            submitLabel="Request a call"
            successTitle="Andrew will be in touch."
            successBody={<p>Thanks for reaching out. Expect a call or text within one business day.</p>}
            dense
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- News --------------------------------- */

const fmtDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric', ...(day ? { day: 'numeric' } : {}) });
};

export function News() {
  const r = routeFor('/news')!;
  const tags = useMemo(() => [...new Set(NEWS.flatMap((n) => n.tags))].sort() as NewsTag[], []);
  const states = useMemo(() => [...new Set(NEWS.map((n) => n.state))].sort(), []);
  const [tag, setTag] = useState<string>('All');
  const list = NEWS.filter((n) => tag === 'All' || n.tags.includes(tag as NewsTag) || n.state === tag);
  return (
    <>
      <PageIntro crumbs={r.crumbs} eyebrow="Chimney fire news" title="Chimney fires happen every week." lede="Real reports from local news across the country, each with the lesson behind it. Read the full stories at the source." />
      <section className="section pt-12">
        <div className="wrap">
          <div className="card grid grid-cols-[minmax(0,1fr)] gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ember">By the numbers</p>
              <ul className="mt-3 grid gap-2 text-mute">
                {NEWS_STATS.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <a href={NEWS_STATS.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-ember underline-offset-4 hover:underline">
                Source: {NEWS_STATS.source} <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <Link to="/chimney-health-check" className="btn btn-primary self-start md:self-center">
              Check your chimney in 2 minutes
            </Link>
          </div>

          <div role="tablist" aria-label="Filter news" className="mt-10 flex flex-wrap gap-2">
            {['All', ...tags, ...states].map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tag === t} onClick={() => setTag(t)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${tag === t ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:text-bone'}`}>
                {t}
              </button>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
            {list.map((n) => (
              <li key={n.url} className="card flex min-w-0 flex-col p-6 sm:p-7">
                <p className="text-sm text-dim">
                  {n.place}, {n.state} · {fmtDate(n.date)}
                </p>
                <h2 className="mt-2 text-xl text-bone">{n.title}</h2>
                <p className="mt-3 text-mute">{n.summary}</p>
                <p className="mt-4 rounded-2xl border border-ember/25 bg-ember/[0.06] p-4 text-sm text-bone">
                  <span className="font-semibold text-ember">The lesson: </span>
                  {n.lesson}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {n.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-dim">
                      {t}
                    </span>
                  ))}
                </div>
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-ember underline-offset-4 hover:underline">
                  Read the story at {n.source} <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-dim">Summaries are written by First Chimney. Each story belongs to the outlet that reported it. Details may change as investigations continue.</p>
        </div>
      </section>
    </>
  );
}

/* ------------------------------- Resources ------------------------------- */

export function Resources() {
  const r = routeFor('/resources')!;
  const tools = [
    { icon: ClipboardCheck, t: 'Chimney Health Check', b: '10 questions, a plain-English answer.', to: '/chimney-health-check' },
    { icon: Flame, t: 'Build Your Fireplace', b: 'Pick a real model, get a branded PDF.', to: '/build-your-fireplace' },
    { icon: Search, t: 'How to choose a chimney company', b: 'Six questions and the red flags.', to: '/how-to-choose-a-chimney-company' },
    { icon: KeyRound, t: 'Buying or selling a home', b: 'Level 2 inspections for closings.', to: '/real-estate-chimney-inspections' },
    { icon: Newspaper, t: 'Chimney fire news', b: 'Real reports and the lessons behind them.', to: '/news' },
    { icon: Sparkles, t: 'FAQ', b: 'Quick answers to common questions.', to: '/faq' },
  ];
  return (
    <>
      <PageIntro crumbs={r.crumbs} eyebrow="Resources" title="Everything you need to know about your chimney." lede="Free tools, plain-English guides, downloadable partner guides and real news. No jargon, no scare tactics." />
      <section className="section pt-12">
        <div className="wrap">
          <h2 className="display-md text-bone">Free tools</h2>
          <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((x) => (
              <li key={x.to}>
                <Link to={x.to} className="card lift flex h-full gap-4 p-6">
                  <x.icon className="mt-0.5 h-6 w-6 shrink-0 text-ember" strokeWidth={1.75} aria-hidden />
                  <span>
                    <span className="block font-medium text-bone">{x.t}</span>
                    <span className="mt-1 block text-sm text-mute">{x.b}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="display-md mt-16 text-bone">Guides</h2>
          <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link to={`/blog/${a.slug}`} className="card lift flex h-full gap-4 p-6">
                  <BookOpen className="mt-0.5 h-6 w-6 shrink-0 text-ember" strokeWidth={1.75} aria-hidden />
                  <span>
                    <span className="block font-medium text-bone">{a.title}</span>
                    <span className="mt-1 block text-sm text-mute">{a.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="display-md mt-16 text-bone">Free downloads for professionals</h2>
          <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PARTNER_INDUSTRIES.map((p) => (
              <li key={p.slug} className="card flex flex-col p-6">
                <FileText className="h-6 w-6 text-ember" strokeWidth={1.75} aria-hidden />
                <p className="mt-4 font-medium text-bone">{p.guide.title}</p>
                <p className="mt-1 text-sm text-mute">For {p.short.toLowerCase()}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-5">
                  <a href={p.guide.file} download className="btn btn-ghost btn-sm">
                    <Download className="h-4 w-4" aria-hidden /> PDF
                  </a>
                  <Link to={`/partners/${p.slug}`} className="btn btn-ghost btn-sm">
                    Partner program
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <div className="card mt-16 flex flex-wrap items-center justify-between gap-6 p-7">
            <div>
              <HomeIcon className="h-6 w-6 text-ember" aria-hidden />
              <p className="mt-3 text-lg text-bone">Not sure where to start?</p>
              <p className="mt-1 text-mute">Take the 2-minute health check or call Andrew directly.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/chimney-health-check" className="btn btn-primary">
                Start the health check
              </Link>
              <CallLink placement="resources_footer" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
