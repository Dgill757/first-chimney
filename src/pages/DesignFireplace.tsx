import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, Copy, FileDown, Info, LoaderCircle, RotateCcw, Shuffle } from 'lucide-react';
import FireplacePreview from '@/components/FireplacePreview';
import LeadForm from '@/components/LeadForm';
import { Breadcrumbs, EASE } from '@/components/ui';
import {
  DEFAULT_DESIGN,
  EXTRAS,
  FIRES,
  HEARTHS,
  MANTELS,
  PRESETS,
  PROJECT_TYPES,
  TIMELINES,
  STYLES,
  SURROUNDS,
  decodeDesign,
  designSummary,
  encodeDesign,
  resolveDesign,
  type Design,
} from '@/data/designer';
import { routeFor } from '@/lib/routes';
import { buildDesignPdf, designRef, downloadBlob } from '@/lib/designPdf';
import { IMAGES, SITE } from '@/lib/site';
import { track } from '@/lib/track';

type StepId = 'project' | 'style' | 'surround' | 'mantel' | 'hearth' | 'fire' | 'extras' | 'send';
const STEPS: { id: StepId; label: string; title: string }[] = [
  { id: 'project', label: 'Project', title: 'What are we building?' },
  { id: 'style', label: 'Style', title: 'Pick a style' },
  { id: 'surround', label: 'Surround', title: 'Choose the surround' },
  { id: 'mantel', label: 'Mantel', title: 'Add a mantel' },
  { id: 'hearth', label: 'Hearth', title: 'Choose a hearth' },
  { id: 'fire', label: 'Fire', title: 'What should it burn?' },
  { id: 'extras', label: 'Extras', title: 'Finishing touches' },
  { id: 'send', label: 'Send', title: 'Your design' },
];

const STORE = 'fc.design.v1';

function loadInitial(): Design {
  if (typeof window === 'undefined') return DEFAULT_DESIGN;
  const fromUrl = decodeDesign(window.location.search);
  if (fromUrl) return fromUrl;
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return decodeDesign(raw) ?? DEFAULT_DESIGN;
  } catch {
    /* ignore */
  }
  return DEFAULT_DESIGN;
}

type Opt = { id: string; name: string; note: string; swatch?: string };

function OptionGrid({ options, value, onPick, multi = false, values = [] }: { options: Opt[]; value?: string; onPick: (id: string) => void; multi?: boolean; values?: string[] }) {
  return (
    <div role={multi ? 'group' : 'radiogroup'} className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const on = multi ? values.includes(o.id) : value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role={multi ? 'checkbox' : 'radio'}
            aria-checked={on}
            onClick={() => onPick(o.id)}
            className={`group relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] ${
              on ? 'border-ember bg-ember/[0.08]' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
            }`}
          >
            {o.swatch !== undefined && (
              <span className="mt-0.5 h-9 w-9 shrink-0 rounded-xl border border-white/15" style={{ background: o.swatch === 'transparent' ? 'repeating-linear-gradient(45deg,#2b2723 0 4px,#211e1b 4px 8px)' : o.swatch }} aria-hidden />
            )}
            <span className="flex-1">
              <span className="block font-medium text-bone">{o.name}</span>
              <span className="mt-1 block text-[0.86rem] leading-snug text-mute">{o.note}</span>
            </span>
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${on ? 'border-ember bg-ember text-[#1a0d05]' : 'border-white/25'}`} aria-hidden>
              {on && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function DesignFireplace() {
  const crumbs = routeFor('/design-your-fireplace')?.crumbs ?? [];
  const reduce = useReducedMotion();
  const [design, setDesign] = useState<Design>(loadInitial);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const wantsBuilder = useRef(typeof window !== 'undefined' && window.location.hash === '#builder');
  useEffect(() => {
    if (wantsBuilder.current) window.setTimeout(() => document.getElementById('builder')?.scrollIntoView({ block: 'start' }), 80);
  }, []);
  const r = resolveDesign(design);
  const current = STEPS[step];

  const query = encodeDesign(design);
  const shareUrl = `${SITE.domain}/design-your-fireplace?${query}`;

  const makePdf = async (forName?: string) => {
    const svg = previewRef.current?.querySelector('svg');
    if (!svg) return;
    setPdfBusy(true);
    try {
      const blob = await buildDesignPdf(svg, design, shareUrl, forName);
      downloadBlob(blob, `First-Chimney-Fireplace-Design-${designRef(design)}.pdf`);
      track('designer_save', { method: 'pdf' });
    } finally {
      setPdfBusy(false);
    }
  };

  useEffect(() => {
    window.history.replaceState(window.history.state, '', `/design-your-fireplace?${query}`);
    try {
      localStorage.setItem(STORE, query);
    } catch {
      /* ignore */
    }
  }, [query]);

  useEffect(() => {
    track('designer_step', { step: current.id });
  }, [current.id]);

  const set = (patch: Partial<Design>) => setDesign((d) => ({ ...d, ...patch }));
  const go = (i: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
    if (window.innerWidth < 1024) document.getElementById('designer-panel')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  const surprise = () => {
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
    const style = pick(STYLES);
    setDesign({
      style: style.id,
      surround: pick(SURROUNDS).id,
      mantel: pick(MANTELS).id,
      hearth: pick(HEARTHS).id,
      fire: style.id === 'modern' ? pick(['linear-gas', 'electric']) : pick(FIRES).id,
      extras: EXTRAS.filter(() => Math.random() > 0.65).map((e) => e.id),
    });
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      track('designer_save', { method: 'copy' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your design link', shareUrl);
    }
  };

  const chips = useMemo(() => [r.style.name, r.surround.name, r.mantel.name, r.hearth.name, r.fire.name, ...r.extras.map((e) => e.name)], [r]);

  const startBuilding = () => document.getElementById('builder')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  return (
    <div className="pb-24">
      <section className="relative flex min-h-[78dvh] items-end overflow-hidden pb-14 pt-32 md:pb-20">
        <div aria-hidden className="absolute inset-0">
          {reduce ? (
            <img src={IMAGES.stovePoster} alt="" className="h-full w-full object-cover" />
          ) : (
            <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={IMAGES.stovePoster}>
              <source src={IMAGES.stoveVideo} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        </div>
        <div className="wrap relative">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="display-xl mt-8 max-w-3xl text-bone">
            Build your <span className="text-ember">fireplace.</span>
          </h1>
          <p className="lede mt-5 text-bone/80">Pick a style, choose brick or stone, add a mantel and a hearth, choose how it burns. Watch it come to life, then get a branded PDF of your design.</p>
          <ol className="mt-8 flex flex-wrap gap-2 text-sm text-mute">
            {['Your project', 'Style', 'Materials', 'Fire type', 'Your PDF'].map((t, i) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-white/12 bg-ink/50 px-3 py-1.5 backdrop-blur">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-ember text-[0.7rem] font-semibold text-[#1a0d05]">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
          <button type="button" onClick={startBuilding} className="fire-btn fire-btn-lg mt-9">
            <span className="fire-btn-inner">
              Start building <ArrowDown className="h-5 w-5" aria-hidden />
            </span>
          </button>
        </div>
      </section>

      <div id="builder" className="wrap scroll-mt-20 pt-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="display-md text-bone">Your design</h2>
            <p className="mt-2 text-mute">Your design saves as you go. Come back anytime.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={surprise} className="btn btn-ghost btn-sm">
              <Shuffle className="h-4 w-4" aria-hidden /> Surprise me
            </button>
            <button type="button" onClick={() => setDesign(DEFAULT_DESIGN)} className="btn btn-ghost btn-sm">
              <RotateCcw className="h-4 w-4" aria-hidden /> Reset
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          {/* Preview */}
          <div className="sticky top-[4.4rem] z-30 -mx-5 min-w-0 self-start bg-ink/95 px-5 pb-3 pt-2 backdrop-blur-md sm:mx-0 sm:px-0 lg:top-28 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div ref={previewRef} className="media relative aspect-[16/10] border hairline shadow-[0_40px_120px_-50px_rgb(240_122_50/0.6)] lg:aspect-[4/3]">
              <FireplacePreview design={design} className="h-full w-full" />
            </div>
            <ul className="mt-3 hidden flex-wrap gap-2 lg:flex" aria-label="Your selections">
              {chips.map((c) => (
                <li key={c} className="rounded-full border border-white/10 px-3 py-1 text-xs text-mute">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-3 hidden items-start gap-2 text-xs text-dim lg:flex">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Illustration for inspiration only. Not to scale, not a quote, and not a check of code, clearances or venting. We confirm what is possible on site.
            </p>
          </div>

          {/* Controls */}
          <div id="designer-panel" className="min-w-0 scroll-mt-[22rem] lg:scroll-mt-32">
            <nav aria-label="Design steps" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <ol className="flex min-w-max gap-1.5 lg:min-w-0 lg:flex-wrap">
                {STEPS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={i === step ? 'step' : undefined}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.82rem] font-medium transition-colors ${
                        i === step ? 'bg-bone text-ink' : i < step ? 'text-bone hover:bg-white/[0.06]' : 'text-dim hover:text-bone'
                      }`}
                    >
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.68rem] ${i === step ? 'bg-ink text-bone' : i < step ? 'bg-ember text-[#1a0d05]' : 'border border-white/20'}`}>
                        {i < step ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                      </span>
                      {s.label}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-8 min-h-[26rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateX(12px)' }}
                  animate={{ opacity: 1, transform: 'translateX(0px)' }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <h2 className="text-2xl text-bone">{current.title}</h2>

                  {current.id === 'project' && (
                    <div className="mt-6 grid gap-7">
                      <OptionGrid options={PROJECT_TYPES} value={design.project} onPick={(id) => set({ project: id })} />
                      <div>
                        <p className="text-sm font-medium text-bone">When are you thinking?</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {TIMELINES.map((t) => (
                            <button key={t} type="button" aria-pressed={design.timeline === t} onClick={() => set({ timeline: t })} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${design.timeline === t ? 'border-ember bg-ember/10 text-bone' : 'border-white/12 text-mute hover:text-bone'}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {current.id === 'style' && (
                    <div className="mt-6 grid gap-6">
                      <OptionGrid options={STYLES} value={design.style} onPick={(id) => set({ style: id })} />
                      <div>
                        <p className="text-sm font-medium text-bone">Or start from a look</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {PRESETS.map((p) => (
                            <button key={p.id} type="button" onClick={() => setDesign(p.design)} className="rounded-full border border-white/12 px-3.5 py-1.5 text-sm text-mute transition-colors hover:border-ember hover:text-bone">
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {current.id === 'surround' && (
                    <div className="mt-6">
                      <OptionGrid options={SURROUNDS.map((s) => ({ ...s, swatch: s.base }))} value={design.surround} onPick={(id) => set({ surround: id })} />
                    </div>
                  )}
                  {current.id === 'mantel' && (
                    <div className="mt-6">
                      <OptionGrid options={MANTELS.map((m) => ({ ...m, swatch: m.color }))} value={design.mantel} onPick={(id) => set({ mantel: id })} />
                    </div>
                  )}
                  {current.id === 'hearth' && (
                    <div className="mt-6">
                      <OptionGrid options={HEARTHS.map((h) => ({ ...h, swatch: h.color }))} value={design.hearth} onPick={(id) => set({ hearth: id })} />
                    </div>
                  )}
                  {current.id === 'fire' && (
                    <div className="mt-6 grid gap-4">
                      <OptionGrid options={FIRES} value={design.fire} onPick={(id) => set({ fire: id })} />
                      <p className="text-sm text-dim">Gas, insert and electric options each have their own venting, gas line or electrical needs. We review those with you before anything is ordered.</p>
                    </div>
                  )}
                  {current.id === 'extras' && (
                    <div className="mt-6">
                      <OptionGrid
                        multi
                        options={EXTRAS}
                        values={design.extras}
                        onPick={(id) => set({ extras: design.extras.includes(id) ? design.extras.filter((x) => x !== id) : [...design.extras, id] })}
                      />
                    </div>
                  )}
                  {current.id === 'send' && (
                    <div className="mt-6 grid gap-8">
                      <dl className="card grid gap-3 p-5 text-sm">
                        {[
                          ['Style', r.style.name],
                          ['Surround', r.surround.name],
                          ['Mantel', r.mantel.name],
                          ['Hearth', r.hearth.name],
                          ['Fire', r.fire.name],
                          ['Extras', r.extras.length ? r.extras.map((e) => e.name).join(', ') : 'None'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-6 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                            <dt className="text-dim">{k}</dt>
                            <dd className="text-right text-bone">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => makePdf()} disabled={pdfBusy} className="btn btn-primary btn-sm">
                          {pdfBusy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : <FileDown className="h-4 w-4" aria-hidden />} Download my PDF
                        </button>
                        <button type="button" onClick={copy} className="btn btn-ghost btn-sm">
                          {copied ? <Check className="h-4 w-4 text-ok" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                          {copied ? 'Link copied' : 'Copy design link'}
                        </button>
                        <Link to="/fireplace-shop" className="btn btn-ghost btn-sm">
                          Browse matching products
                        </Link>
                      </div>
                      <div>
                        <h3 className="text-xl text-bone">Send it to First Chimney</h3>
                        <p className="mt-2 text-sm text-mute">Your design and its link go straight to First Chimney, and your branded PDF downloads automatically. We reach out about a consultation. No obligation and no pricing until we have seen your space.</p>
                        <div className="mt-5">
                          <LeadForm
                            formId="fireplace-designer"
                            fields={['name', 'phone', 'email', 'city', 'state', 'zip', 'timeframe', 'message']}
                            required={['name', 'phone', 'zip']}
                            details={() => designSummary(design, shareUrl)}
                            submitLabel="Send my design + get the PDF"
                            messageLabel="Tell us about the room"
                            messagePlaceholder="Existing fireplace or new wall? Room size, what you love or want to change..."
                            successTitle="Your design is on its way."
                            successBody={<p>We received your fireplace design and your PDF is downloading. We will reach out to talk it through and set up a consultation. Your design link keeps working if you want to keep tweaking.</p>}
                            onSuccess={() => {
                              track('designer_save', { method: 'submit' });
                              void makePdf();
                            }}
                            dense
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {current.id !== 'send' && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t hairline pt-6">
                <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn btn-ghost btn-sm">
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Back
                </button>
                <button type="button" onClick={() => go(step + 1)} className="btn btn-primary">
                  {step === STEPS.length - 2 ? 'Review and send' : `Next: ${STEPS[step + 1].label}`} <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
            <p className="mt-6 flex items-start gap-2 text-xs text-dim lg:hidden">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Illustration for inspiration only. Not to scale, not a quote, and not a check of code, clearances or venting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
