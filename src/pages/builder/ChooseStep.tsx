import { useMemo, useState } from "react";
import { ArrowLeft, Phone, Scale, Search, SlidersHorizontal, X } from "lucide-react";
import { BUSINESS } from "@/data/siteData";
import { FUEL_LABEL, brandLabel, type Fuel, type Install, type Product, type Style } from "@/data/catalog";
import { facetCounts, filterProducts, sidesOf, SIDES_LABEL, type Sides } from "@/data/catalog/select";
import { kindsFor, MAX_COMPARE } from "@/data/catalog/buildState";
import type { BuildApi } from "./useBuild";
import ProductCard from "./ProductCard";
import FitChecker from "./FitChecker";
import CompareDialog from "./CompareDialog";
import { Rise, SafeImg, SkeletonGrid } from "./ui";

const PAGE = 24;
const INSTALL_LABEL: Record<Install, string> = { "new-build": "Fireplaces", "existing-fireplace": "Inserts", freestanding: "Stoves" };
const STYLE_LABEL: Record<Style, string> = { traditional: "Traditional", linear: "Linear", contemporary: "Contemporary", freestanding: "Freestanding" };

export default function ChooseStep({ api }: { api: BuildApi }) {
  const { build, catalog, need } = api;
  const [query, setQuery] = useState("");
  const [style, setStyle] = useState<Style | undefined>();
  const [brandId, setBrandId] = useState<string | undefined>();
  const [sides, setSides] = useState<Sides | undefined>();
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const kinds = kindsFor(build.install);
  // Facets are counted against everything that matches the type, before the
  // facet itself is applied, so each chip shows what clicking it would give.
  const inType = useMemo(() => filterProducts(catalog.products, { kinds }), [catalog, build.install]); // eslint-disable-line react-hooks/exhaustive-deps
  const byFuel = useMemo(() => facetCounts(inType, p => [p.fuel]), [inType]);
  const inFuel = useMemo(() => filterProducts(inType, { fuel: build.fuel }), [inType, build.fuel]);
  const byStyle = useMemo(() => facetCounts(inFuel, p => [p.style]), [inFuel]);
  const bySides = useMemo(() => facetCounts(inFuel, p => [sidesOf(p)]), [inFuel]);
  const byBrand = useMemo(() => facetCounts(inFuel, p => [p.brandId, ...(p.altBrandIds ?? [])]), [inFuel]);

  const results = useMemo(
    () => filterProducts(catalog.products, { kinds, fuel: build.fuel, style, sides, brandId, query, need, opening: build.opening }),
    [catalog, build.install, build.fuel, style, sides, brandId, query, need, build.opening], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const hiddenByFit = build.opening ? filterProducts(catalog.products, { kinds, fuel: build.fuel, style, sides, brandId, query }).length - results.length : 0;

  const brandName = (p: Product) => brandLabel(catalog.brands.find(b => b.id === p.brandId), p, catalog.brands);
  const compared = build.compare.map(id => catalog.products.find(p => p.id === id)).filter((p): p is Product => !!p);
  const choose = (p: Product) => { api.chooseProduct(p); setCompareOpen(false); api.setStep("customize"); };
  const reset = () => { setQuery(""); setStyle(undefined); setSides(undefined); setBrandId(undefined); };
  const filtered = !!(query || style || sides || brandId);
  const styles = Array.from(byStyle.keys());

  const filterPanel = (
    <div className="grid gap-6">
      <div>
        <label className="bmf-label" htmlFor="bmf-search">Search models</label>
        <div className="relative">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/60" />
          <input id="bmf-search" className="bmf-input !pl-10" type="search" placeholder="Name or model number" value={query} onChange={e => { setQuery(e.target.value); setShown(PAGE); }} />
        </div>
      </div>

      <fieldset>
        <legend className="bmf-label">Type</legend>
        <div className="flex flex-wrap gap-2">
          {(["new-build", "existing-fireplace", "freestanding"] as Install[]).map(i => (
            <button key={i} type="button" className="bmf-chip" aria-pressed={build.install === i} onClick={() => { api.setInstall(i); reset(); }}>{INSTALL_LABEL[i]}</button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="bmf-label">Fuel</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="bmf-chip" aria-pressed={!build.fuel} onClick={() => api.setFuel(undefined)}>All</button>
          {(Object.keys(FUEL_LABEL) as Fuel[]).map(f => (
            <button key={f} type="button" className="bmf-chip" aria-pressed={build.fuel === f} disabled={!byFuel.get(f)} onClick={() => api.setFuel(f)}>{FUEL_LABEL[f]} <span className="opacity-70">{byFuel.get(f) ?? 0}</span></button>
          ))}
        </div>
      </fieldset>

      {styles.length > 1 && (
        <fieldset>
          <legend className="bmf-label">Style</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="bmf-chip" aria-pressed={!style} onClick={() => setStyle(undefined)}>All</button>
            {styles.map(s => <button key={s} type="button" className="bmf-chip" aria-pressed={style === s} onClick={() => setStyle(s)}>{STYLE_LABEL[s]} <span className="opacity-70">{byStyle.get(s)}</span></button>)}
          </div>
        </fieldset>
      )}

      {bySides.size > 1 && (
        <fieldset>
          <legend className="bmf-label">How many sides</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="bmf-chip" aria-pressed={!sides} onClick={() => setSides(undefined)}>All</button>
            {(Object.keys(SIDES_LABEL) as Sides[]).filter(s => bySides.has(s)).map(s => <button key={s} type="button" className="bmf-chip" aria-pressed={sides === s} onClick={() => setSides(s)}>{SIDES_LABEL[s]} <span className="opacity-70">{bySides.get(s)}</span></button>)}
          </div>
        </fieldset>
      )}

      {byBrand.size > 1 && (
        <fieldset>
          <legend className="bmf-label">Brand</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="bmf-chip" aria-pressed={!brandId} onClick={() => setBrandId(undefined)}>All</button>
            {catalog.brands.filter(b => byBrand.has(b.id)).map(b => <button key={b.id} type="button" className="bmf-chip" aria-pressed={brandId === b.id} onClick={() => setBrandId(b.id)}>{b.name} <span className="opacity-70">{byBrand.get(b.id)}</span></button>)}
          </div>
        </fieldset>
      )}

      {build.install === "existing-fireplace" && <FitChecker api={api} />}
    </div>
  );

  return (
    <div className="container pb-40 pt-8 lg:pb-24">
      <button type="button" onClick={() => api.setStep("start")} className="inline-flex min-h-[2.75rem] items-center gap-2 text-[.82rem] font-bold uppercase tracking-[.1em] text-paper/80 hover:text-gold"><ArrowLeft size={16} /> Change my answers</button>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">Pick your model</h1>
          <p className="mt-2 text-[.98rem] text-paper/75" aria-live="polite">
            {results.length} {results.length === 1 ? "unit" : "units"}{need ? ", closest to your heat need first" : ""}.
            {hiddenByFit > 0 && ` ${hiddenByFit} hidden because they will not fit your opening.`}
          </p>
        </div>
        {/* wrapper hides it: .bmf-chip sets display in unlayered CSS and would beat a lg:hidden utility on the button itself */}
        <div className="lg:hidden"><button type="button" className="bmf-chip" aria-expanded={filtersOpen} aria-controls="bmf-filters" onClick={() => setFiltersOpen(v => !v)}><SlidersHorizontal size={15} /> Filters</button></div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside id="bmf-filters" className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-[10rem] lg:max-h-[calc(100dvh-11rem)] lg:overflow-y-auto lg:pr-2">{filterPanel}</div>
        </aside>

        <section aria-label="Matching units">
          {results.length === 0 ? (
            <div className="bmf-card grid place-items-center p-10 text-center">
              <h2 className="font-serif text-2xl font-bold">Nothing matches that yet.</h2>
              <p className="mt-2 max-w-md text-paper/75">{build.opening ? "No unit in the catalog fits that opening as measured. A mason can sometimes enlarge a masonry opening, and we can tell you on a visit." : "Try clearing a filter, or call and we will point you to the right unit."}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {filtered && <button type="button" className="btn-ghost-ember" onClick={reset}>Clear filters</button>}
                {build.opening && <button type="button" className="btn-ghost-ember" onClick={() => api.setOpening(undefined)}>Clear my opening</button>}
                <a className="btn-ember" href={BUSINESS.phoneHref}><Phone size={16} /> Call {BUSINESS.phone}</a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, shown).map((p, i) => (
                  <Rise key={p.id} i={i % PAGE} className="h-full">
                    <ProductCard product={p} brandName={brandName(p)} need={need} opening={build.opening}
                      comparing={build.compare.includes(p.id)} compareFull={build.compare.length >= MAX_COMPARE}
                      onCompare={() => api.toggleCompare(p.id)} onChoose={() => choose(p)} />
                  </Rise>
                ))}
              </div>
              {results.length > shown && (
                <div className="mt-8 text-center"><button type="button" className="btn-ghost-ember" onClick={() => setShown(n => n + PAGE)}>Show {Math.min(PAGE, results.length - shown)} more</button></div>
              )}
            </>
          )}
        </section>
      </div>

      {compared.length > 0 && (
        <div className="bmf-noprint fixed inset-x-3 bottom-[calc(.75rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-3xl items-center gap-3 rounded-[1.25rem] border border-paper/20 bg-[#1b191b] p-3 shadow-2xl lg:bottom-6" role="region" aria-label="Units to compare">
          <div className="flex -space-x-2">
            {compared.map(p => <span key={p.id} className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#1b191b] bg-[#f4f1ea]">{p.images.hero && <SafeImg src={p.images.hero.src} alt="" fallback="" className="h-full w-full object-contain" />}</span>)}
          </div>
          <p className="min-w-0 flex-1 truncate text-[.9rem]"><strong>{compared.length}</strong> of {MAX_COMPARE} to compare</p>
          <button type="button" className="bmf-chip" onClick={() => compared.forEach(p => api.toggleCompare(p.id))} aria-label="Clear comparison"><X size={14} /></button>
          <button type="button" className="btn-ember btn-ember-sm" disabled={compared.length < 2} onClick={() => setCompareOpen(true)}><Scale size={15} /> {compared.length < 2 ? "Pick one more" : "Compare"}</button>
        </div>
      )}

      <CompareDialog open={compareOpen} onOpenChange={setCompareOpen} products={compared} brandName={brandName} need={need} onChoose={choose} onRemove={p => api.toggleCompare(p.id)} />
    </div>
  );
}

export { SkeletonGrid };
