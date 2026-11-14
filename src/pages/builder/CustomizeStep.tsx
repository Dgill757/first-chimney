import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import type { Option, OptionGroup, Product } from "@/data/catalog";
import { optionAvailable, selectedIdSet } from "@/data/catalog/select";
import type { BuildApi } from "./useBuild";
import PreviewStage from "./PreviewStage";
import BuildRail from "./BuildRail";
import { Rise, SafeImg } from "./ui";

const AREA_LABEL = { exterior: "Outside", interior: "Inside the firebox", burner: "Burner and flames", extras: "Extras and controls" } as const;

function OptionTile({ option, on, onPick }: { option: Option; on: boolean; onPick: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} data-selected={on} onClick={onPick} className="bmf-card group flex w-full flex-col overflow-hidden text-left">
      {option.thumb ? (
        <span className="relative block aspect-square w-full bg-[#f4f1ea]">
          <SafeImg src={option.thumb} alt="" loading="lazy" decoding="async" fallback="Swatch on the way" className="absolute inset-0 h-full w-full object-contain p-1.5 transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
          {on && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gold text-ink shadow"><Check size={16} strokeWidth={3} /></span>}
        </span>
      ) : on ? <span className="ml-auto mr-3 mt-3 grid h-6 w-6 place-items-center rounded-full bg-gold text-ink"><Check size={14} strokeWidth={3} /></span> : null}
      <span className="block p-3">
        <span className="block text-[.92rem] font-semibold leading-snug">{option.name}</span>
        {option.part && <span className="mt-1 block text-[.74rem] tracking-wide text-paper/65">Part {option.part}</span>}
        {option.detail && <span className="mt-1.5 block text-[.8rem] leading-snug text-paper/70">{option.detail}</span>}
      </span>
    </button>
  );
}

function GroupPanel({ group, picks, ids, open, onToggle, onPick }: {
  group: OptionGroup; picks: string[]; ids: Set<string>; open: boolean; onToggle: () => void; onPick: (id: string) => void;
}) {
  const options = group.options.filter(o => optionAvailable(o, ids));
  const chosen = options.filter(o => picks.includes(o.id)).map(o => o.name);
  const panelId = `grp-${group.id}`;
  return (
    <div className="rounded-[1.25rem] border border-paper/12 bg-paper/[.03]">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle} className="flex min-h-[3.75rem] w-full items-center justify-between gap-4 p-4 text-left sm:px-5">
          <span className="min-w-0">
            <span className="block font-serif text-lg font-bold">{group.label}{group.required && <span className="ml-2 align-middle text-[.66rem] font-bold uppercase tracking-[.12em] text-gold">Required</span>}</span>
            <span className="mt-0.5 block truncate text-[.88rem] text-paper/75">{chosen.length ? chosen.join(", ") : group.limit > 1 ? "Pick any you like" : "None chosen"}</span>
          </span>
          <ChevronDown size={20} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {open && (
        <div id={panelId} className="bmf-rise border-t border-paper/10 p-4 sm:p-5">
          <p className="mb-3 text-[.84rem] text-paper/70">{group.limit > 1 ? `Pick up to ${group.limit}.` : group.required ? "Pick one." : "Pick one, or tap it again to remove it."}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" role="group" aria-label={group.label}>
            {options.map(o => <OptionTile key={o.id} option={o} on={picks.includes(o.id)} onPick={() => onPick(o.id)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomizeStep({ api, product }: { api: BuildApi; product: Product }) {
  const { build } = api;
  const ids = useMemo(() => selectedIdSet(build.picks), [build.picks]);
  const visible = useMemo(() => product.options.filter(g => g.options.some(o => optionAvailable(o, ids))), [product, ids]);
  const [openId, setOpenId] = useState<string | undefined>(visible[0]?.id);
  const areas = (["exterior", "interior", "burner", "extras"] as const).filter(a => visible.some(g => g.area === a));
  const brand = api.catalog.brands.find(b => b.id === product.brandId);

  return (
    <div className="container pb-28 pt-3 lg:pb-24 lg:pt-6">
      <button type="button" onClick={() => api.setStep("choose")} className="inline-flex min-h-[2.75rem] items-center gap-2 text-[.82rem] font-bold uppercase tracking-[.1em] text-paper/80 hover:text-gold"><ArrowLeft size={16} /> Back to models</button>
      <div className="mt-2">
        <p className="text-[.76rem] font-bold uppercase tracking-[.12em] text-gold">{brand?.name}</p>
        <h1 className="font-serif text-2xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
      </div>

      {/* Desktop: options on the left, one sticky column on the right holding the preview and the build
          summary, so the picture stays in view while the options scroll. Phone: the preview is ordinary
          content at the top (it scrolls away, so the options get the whole screen) and a live thumbnail
          rides in the bottom bar. The preview column comes first in the markup so it leads on a phone. */}
      <div className="mt-3 grid gap-6 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
        <div className="min-w-0 lg:order-2">
          <div className="lg:sticky lg:top-[10rem]">
            <PreviewStage product={product} picks={build.picks} />
            <BuildRail api={api} nextLabel="Review my build" onNext={() => api.setStep("build")} />
          </div>
        </div>

        <div className="min-w-0 lg:order-1">
          {visible.length === 0 ? (
            <p className="bmf-card p-6 text-paper/80">The maker lists no options for this unit. Review it and we will confirm the details on the visit.</p>
          ) : (
            <div className="grid gap-8">
              {areas.map(area => (
                <section key={area} aria-labelledby={`area-${area}`}>
                  <h2 id={`area-${area}`} className="mb-3 font-serif text-xl font-bold text-paper/90">{AREA_LABEL[area]}</h2>
                  <div className="grid gap-3">
                    {visible.filter(g => g.area === area).map((g, i) => (
                      <Rise key={g.id} i={i}>
                        <GroupPanel group={g} ids={ids} picks={build.picks[g.id] ?? []} open={openId === g.id} onToggle={() => setOpenId(openId === g.id ? undefined : g.id)} onPick={id => api.pick(g.id, id)} />
                      </Rise>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-end gap-3 lg:hidden">
            <button type="button" className="btn-ember" onClick={() => api.setStep("build")}>Review my build <ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
