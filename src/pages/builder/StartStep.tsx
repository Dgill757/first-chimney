import { useMemo, useRef, useState } from "react";
import { ArrowRight, Flame, Plug, Wind, Zap } from "lucide-react";
import { ASSETS } from "@/data/siteData";
import { heroAsset } from "@/data/assets";
import { filterProducts } from "@/data/catalog/select";
import { estimateHeat, isHeatInputValid, MAX_SQFT, MIN_SQFT, type Openness, type Tightness } from "@/data/catalog/heat";
import { kindsFor } from "@/data/catalog/buildState";
import type { Fuel, Install } from "@/data/catalog";
import type { BuildApi } from "./useBuild";
import EmberField from "./EmberField";
import { QuestionBlock, Rise, Segmented, fmt } from "./ui";

const INSTALLS: { id: Install; title: string; deck: string; folder: string }[] = [
  { id: "new-build", title: "A wall or chase I'm building", deck: "A new fireplace set into the wall, or replacing a worn-out prefab.", folder: "new-fireplace-installation" },
  { id: "existing-fireplace", title: "A fireplace I already have", deck: "An insert that slides into your existing masonry or factory-built firebox.", folder: "gas-inserts" },
  { id: "freestanding", title: "The middle of the room", deck: "A freestanding stove that sits on a hearth and vents up through the ceiling or out the wall.", folder: "freestanding-wood-stove" },
];

const FUELS: { id: Fuel; title: string; deck: string; Icon: typeof Flame }[] = [
  { id: "gas", title: "Gas", deck: "Flip a switch and it burns. Needs a gas line and a vent.", Icon: Flame },
  { id: "wood", title: "Wood", deck: "Real fire and serious heat. Needs a sound chimney.", Icon: Wind },
  { id: "pellet", title: "Pellet", deck: "Steady heat on a thermostat. Needs a vent and an outlet.", Icon: Zap },
  { id: "electric", title: "Electric", deck: "No gas, no chimney. Plugs in or is hardwired.", Icon: Plug },
];

const PRESETS: { label: string; sqft: number; openness: Openness }[] = [
  { label: "A cozy room", sqft: 250, openness: "closed" },
  { label: "A living room", sqft: 500, openness: "open-one" },
  { label: "An open main level", sqft: 900, openness: "open-plan" },
  { label: "A big open plan", sqft: 1600, openness: "open-plan" },
];

/**
 * The cinematic entry. It needs no catalog data, so the page renders it at once
 * while the catalog loads, and the swap from "loading" to "ready" never moves it.
 */
export function StartHero({ onStart }: { onStart: () => void }) {
  return (
      <section className="relative isolate overflow-hidden">
        <EmberField />
        <div className="container relative grid min-h-[min(calc(100dvh-8rem),46rem)] items-center gap-10 py-14 lg:grid-cols-[1.15fr_.85fr] lg:py-16">
          <div>
            <h1 className="font-storybook text-[clamp(2.8rem,7vw,5.6rem)] leading-[1.02]">Build your <em className="text-gold">fireplace.</em></h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">Pick what it goes into, what it burns and how much heat you need. We check the fit.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-ember" onClick={onStart}>
                Start building <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <figure className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            <div className="overflow-hidden rounded-[1.25rem] border border-paper/15 shadow-[0_30px_80px_-30px_rgb(0_0_0/.9),0_0_80px_-30px_rgb(236_71_7/.6)]">
              <img src={ASSETS.family} alt="Linear gas fireplace in a bright living room" width={1400} height={1018} fetchPriority="high" className="aspect-[4/3] w-full object-cover" />
            </div>
            <figcaption className="mt-4 font-storybook text-2xl leading-tight">Owner-operated. <span className="text-gold">F.I.R.E. certified.</span></figcaption>
          </figure>
        </div>
      </section>

  );
}

export default function StartStep({ api }: { api: BuildApi }) {
  const { build, catalog } = api;
  const questions = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  const kinds = kindsFor(build.install);
  const countFor = useMemo(() => {
    const by = new Map<Fuel, number>();
    for (const f of FUELS) by.set(f.id, filterProducts(catalog.products, { kinds, fuel: f.id }).length);
    return by;
  }, [catalog, build.install]); // eslint-disable-line react-hooks/exhaustive-deps

  const room = build.room;
  const need = room && isHeatInputValid(room) ? estimateHeat(room) : undefined;
  const matches = useMemo(() => filterProducts(catalog.products, { kinds, fuel: build.fuel }).length, [catalog, build.install, build.fuel]); // eslint-disable-line react-hooks/exhaustive-deps
  const ready = !!build.install && !!build.fuel;
  const setRoom = (patch: Partial<NonNullable<typeof room>>) =>
    api.setRoom({ sqft: 500, ceiling: 8, openness: "open-one", tightness: "average", ...room, ...patch });

  return (
    <>
      <StartHero onStart={() => questions.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })} />

      {/* The three questions */}
      <div ref={questions} className="container scroll-mt-24 pb-24">
        <QuestionBlock title="What are you putting it into?" done={!!build.install}>
          <div className="grid gap-4 md:grid-cols-3" role="radiogroup" aria-label="Where it goes">
            {INSTALLS.map((o, i) => {
              const hero = heroAsset(o.folder);
              const on = build.install === o.id;
              return (
                <Rise key={o.id} i={i}>
                  <button type="button" role="radio" aria-checked={on} data-selected={on} onClick={() => api.setInstall(o.id)} className="bmf-card group block w-full overflow-hidden text-left">
                    <div className="aspect-[16/10] overflow-hidden bg-ink">
                      {hero && <img src={hero.file} alt="" loading="lazy" width={800} height={500} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-bold leading-snug">{o.title}</h3>
                      <p className="mt-2 text-[.95rem] leading-relaxed text-paper/75">{o.deck}</p>
                    </div>
                  </button>
                </Rise>
              );
            })}
          </div>
        </QuestionBlock>

        <QuestionBlock title="What do you want to burn?" deck={build.install ? undefined : "Pick where it goes first and we will show what is available."} done={!!build.fuel}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-label="Fuel">
            {FUELS.map(({ id, title, deck, Icon }, i) => {
              const n = countFor.get(id) ?? 0;
              const disabled = !!build.install && n === 0;
              const on = build.fuel === id;
              return (
                <Rise key={id} i={i}>
                  <button type="button" role="radio" aria-checked={on} aria-disabled={disabled} data-selected={on} disabled={disabled}
                    onClick={() => api.setFuel(id)} className="bmf-card flex h-full w-full flex-col p-5 text-left">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-paper/10 text-gold"><Icon size={22} /></span>
                    <h3 className="mt-4 font-serif text-xl font-bold">{title}</h3>
                    <p className="mt-2 flex-1 text-[.93rem] leading-relaxed text-paper/75">{deck}</p>
                    <p className="mt-4 text-[.78rem] font-bold uppercase tracking-[.1em] text-paper/70">{build.install ? (disabled ? "None for this setup yet" : `${n} ${n === 1 ? "model" : "models"}`) : " "}</p>
                  </button>
                </Rise>
              );
            })}
          </div>
        </QuestionBlock>

        <QuestionBlock title="How much heat do you need?" deck="Pick the closest space. We turn it into a heat range and flag any unit that is too big or too small." done={!!need}>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Space to heat">
            {PRESETS.map(p => {
              const on = !!room && room.sqft === p.sqft && room.openness === p.openness;
              return <button key={p.label} type="button" role="radio" aria-checked={on} className="bmf-chip" onClick={() => setRoom({ sqft: p.sqft, openness: p.openness })}>{p.label}</button>;
            })}
            <button type="button" className="bmf-chip" aria-pressed={fine} onClick={() => setFine(v => !v)}>Fine-tune it</button>
          </div>

          {fine && (
            <div className="bmf-card bmf-rise mt-5 grid gap-6 p-5 sm:p-6 md:grid-cols-2">
              <div>
                <label className="bmf-label" htmlFor="bmf-sqft">Square feet to heat</label>
                <input id="bmf-sqft" className="bmf-input" type="number" inputMode="numeric" min={MIN_SQFT} max={MAX_SQFT} step={25} value={room?.sqft ?? ""} placeholder="500"
                  aria-invalid={!!room && !isHeatInputValid(room)} aria-describedby="bmf-sqft-help"
                  onChange={e => setRoom({ sqft: Number(e.target.value) })} />
                <p id="bmf-sqft-help" className={room && !isHeatInputValid(room) ? "bmf-error" : "bmf-help"}>
                  {room && !isHeatInputValid(room) ? `Enter a number from ${fmt(MIN_SQFT)} to ${fmt(MAX_SQFT)}.` : "Count the room plus any space that opens straight into it."}
                </p>
              </div>
              <div>
                <label className="bmf-label" htmlFor="bmf-ceiling">Ceiling height</label>
                <select id="bmf-ceiling" className="bmf-input" value={room?.ceiling ?? 8} onChange={e => setRoom({ ceiling: Number(e.target.value) })}>
                  {[8, 9, 10, 12, 15].map(h => <option key={h} value={h}>{h} feet{h === 8 ? " (standard)" : h >= 12 ? " (vaulted)" : ""}</option>)}
                </select>
              </div>
              <Segmented<Openness> label="How open is the room?" value={room?.openness} onChange={openness => setRoom({ openness })}
                options={[{ value: "closed", label: "Closed off" }, { value: "open-one", label: "Open to one more room" }, { value: "open-plan", label: "Open plan" }]} />
              <Segmented<Tightness> label="How well does the house hold heat?" value={room?.tightness} onChange={tightness => setRoom({ tightness })}
                options={[{ value: "tight", label: "Tight and insulated" }, { value: "average", label: "About average" }, { value: "drafty", label: "Drafty or older" }]} />
            </div>
          )}

          <div aria-live="polite" className="mt-6">
            {need ? (
              <div className="bmf-card bmf-rise inline-flex max-w-2xl flex-col gap-1 p-5">
                <p className="text-[.78rem] font-bold uppercase tracking-[.12em] text-gold">Your heat range</p>
                <p className="font-serif text-3xl font-bold">{fmt(need.btuLow)} to {fmt(need.btuHigh)} BTU</p>
                <p className="text-[.93rem] leading-relaxed text-paper/75">That is a rule-of-thumb starting point for about {fmt(need.effectiveSqft)} square feet of heated space. We confirm it on the visit, and we will warn you if a unit is far bigger than the room.</p>
              </div>
            ) : (
              <p className="text-[.93rem] text-paper/70">Not sure yet? You can skip this and pick a model first.</p>
            )}
          </div>
        </QuestionBlock>

        <div className="sticky bottom-[calc(.75rem+env(safe-area-inset-bottom))] z-20 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-paper/15 bg-[#131214]/90 p-4 backdrop-blur-md lg:bottom-6">
          <p className="text-[.95rem] text-paper/80" aria-live="polite">
            {ready ? <><strong className="text-paper">{matches}</strong> {matches === 1 ? "model matches" : "models match"} so far.</> : "Answer the first two questions to see matches."}
          </p>
          <button type="button" className="btn-ember" disabled={!ready} onClick={() => api.setStep("choose")}>See matching models <ArrowRight size={17} /></button>
        </div>
      </div>
    </>
  );
}
