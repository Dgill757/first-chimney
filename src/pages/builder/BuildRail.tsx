import { useState } from "react";
import { ArrowRight, ChevronUp, Flame, Phone } from "lucide-react";
import { BUSINESS } from "@/data/siteData";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { FUEL_LABEL, KIND_LABEL } from "@/data/catalog";
import { selectedOptions } from "@/data/catalog/select";
import type { BuildApi } from "./useBuild";
import { SafeImg, fmt } from "./ui";
import PreviewStage, { PreviewThumb } from "./PreviewStage";

const INSTALL_LABEL = { "new-build": "New wall or chase", "existing-fireplace": "Existing fireplace", freestanding: "Freestanding" } as const;

/** The live summary of the build. Sticky column on desktop, bottom sheet on a phone. */
function RailBody({ api, nextLabel, onNext }: { api: BuildApi; nextLabel: string; onNext: () => void }) {
  const { build, product, need } = api;
  const chosen = product ? selectedOptions(product, build.picks) : [];
  const brand = product ? api.catalog.brands.find(b => b.id === product.brandId) : undefined;
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {build.install && <span className="rounded-full border border-paper/20 px-3 py-1 text-[.76rem] font-semibold">{INSTALL_LABEL[build.install]}</span>}
        {build.fuel && <span className="rounded-full border border-paper/20 px-3 py-1 text-[.76rem] font-semibold">{FUEL_LABEL[build.fuel]}</span>}
        {need && <span className="rounded-full border border-paper/20 px-3 py-1 text-[.76rem] font-semibold">{fmt(need.btuLow)} to {fmt(need.btuHigh)} BTU</span>}
      </div>

      {product ? (
        <>
          <div className="flex items-center gap-3">
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4f1ea]">{product.images.hero && <SafeImg src={product.images.hero.src} alt="" fallback="" className="h-full w-full object-contain p-1" />}</span>
            <div className="min-w-0">
              <p className="text-[.72rem] font-bold uppercase tracking-[.12em] text-gold">{brand?.name}</p>
              <p className="font-serif text-lg font-bold leading-snug">{product.name}</p>
              <p className="text-[.8rem] text-paper/70">{FUEL_LABEL[product.fuel]} {KIND_LABEL[product.kind].toLowerCase()}{product.sku ? `, ${product.sku}` : ""}</p>
            </div>
          </div>
          {(product.heat?.btuMax || product.heat?.areaSqFt) && (
            <dl className="grid grid-cols-2 gap-3 text-[.88rem]">
              {product.heat?.btuMax && <div><dt className="text-paper/65">Max output</dt><dd className="font-bold">{fmt(product.heat.btuMax)} BTU</dd></div>}
              {product.heat?.areaSqFt && <div><dt className="text-paper/65">Heats up to</dt><dd className="font-bold">{fmt(product.heat.areaSqFt)} sq ft</dd></div>}
            </dl>
          )}
          <div>
            <p className="bmf-label">Your choices</p>
            {chosen.length ? (
              <ul className="grid gap-2 text-[.88rem]">
                {chosen.map(({ group, option }) => <li key={option.id} className="flex justify-between gap-3 border-b border-paper/10 pb-2"><span className="text-paper/70">{group.label}</span><span className="text-right font-semibold">{option.name}</span></li>)}
              </ul>
            ) : <p className="text-[.88rem] text-paper/70">Nothing picked yet. Your fronts, liners and log sets show up here.</p>}
          </div>
        </>
      ) : (
        <p className="flex items-center gap-2 text-[.92rem] text-paper/75"><Flame size={17} className="text-gold" /> Pick a model and your build starts here.</p>
      )}

      <button type="button" className="btn-ember w-full" disabled={!product} onClick={onNext}>{nextLabel} <ArrowRight size={17} /></button>
    </div>
  );
}

export default function BuildRail({ api, nextLabel, onNext }: { api: BuildApi; nextLabel: string; onNext: () => void }) {
  const [open, setOpen] = useState(false);
  const { product } = api;
  return (
    <>
      <aside className="hidden lg:block" aria-label="Your build so far">
        {/* The parent column is the sticky one (a sticky utility on .bmf-card would lose to its unlayered position: relative). */}
        <div className="bmf-card mt-4 max-h-[calc(100dvh-26rem)] min-h-[12rem] overflow-y-auto p-5">
          <h2 className="mb-4 font-serif text-xl font-bold">Your build</h2>
          <RailBody api={api} nextLabel={nextLabel} onNext={onNext} />
        </div>
      </aside>

      {/* Flush with the bottom of the screen and fully opaque: the site's own Call/Book bar is hidden on
          the builder, and a see-through bar let page text show through on iPhones. */}
      <div className="bmf-noprint fixed inset-x-0 bottom-0 z-40 border-t border-paper/15 bg-[#1b191b] px-3 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <button type="button" onClick={() => setOpen(true)} aria-label="See my build and the full preview" className="flex min-h-[3rem] min-w-0 flex-1 items-center gap-3 rounded-xl text-left">
            {product && <PreviewThumb product={product} picks={api.build.picks} />}
            <span className="min-w-0 flex-1"><span className="block text-[.7rem] font-bold uppercase tracking-[.1em] text-gold">Your build</span><span className="block truncate text-[.9rem] font-semibold">{product?.name ?? "Nothing picked yet"}</span></span>
            <ChevronUp size={18} className="shrink-0 text-gold" />
          </button>
          <button type="button" className="btn-ember btn-ember-sm" disabled={!product} onClick={onNext}>{nextLabel}</button>
        </div>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85dvh] border-paper/15 bg-[#161416] text-paper">
          <DrawerTitle className="px-5 pt-2 font-serif text-xl font-bold text-paper">Your build</DrawerTitle>
          <DrawerDescription className="sr-only">Everything you have picked so far.</DrawerDescription>
          <div className="grid gap-5 overflow-y-auto p-5 pb-8">
            {product && <PreviewStage product={product} picks={api.build.picks} />}
            <RailBody api={api} nextLabel={nextLabel} onNext={() => { setOpen(false); onNext(); }} />
            <a href={BUSINESS.phoneHref} className="btn-ghost-ember justify-center"><Phone size={16} /> Call {BUSINESS.phone}</a>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
