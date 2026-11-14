import { AlertTriangle, Check, Ruler, Scale } from "lucide-react";
import type { Product } from "@/data/catalog";
import { KIND_LABEL, FUEL_LABEL } from "@/data/catalog";
import { assessSize, type HeatResult } from "@/data/catalog/heat";
import { checkFit, formatInches, type Opening } from "@/data/catalog/fit";
import { SafeImg, fmt } from "./ui";

export default function ProductCard({ product, brandName, need, opening, comparing, compareFull, onCompare, onChoose }: {
  product: Product; brandName: string; need?: HeatResult; opening?: Opening;
  comparing: boolean; compareFull: boolean; onCompare: () => void; onChoose: () => void;
}) {
  const size = need ? assessSize(need, product.heat ?? {}) : undefined;
  const fit = opening && product.kind === "insert" ? checkFit(product.fit, opening) : undefined;
  const hero = product.images.hero;
  const optionCount = product.options.reduce((n, g) => n + g.options.length, 0);

  return (
    <article className="bmf-card flex h-full flex-col overflow-hidden" data-selected={comparing}>
      <div className="relative aspect-[4/3] bg-[#f4f1ea]">
        {hero ? (
          <SafeImg src={hero.src} alt={hero.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-3" />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-[.85rem] font-semibold text-ink/60">Photo on the way</div>
        )}
        {product.preview && <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[.68rem] font-bold uppercase tracking-[.1em] text-gold">Live preview</span>}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[.74rem] font-bold uppercase tracking-[.12em] text-gold">{brandName}</p>
        <h3 className="mt-1 font-serif text-xl font-bold leading-snug">{product.name}</h3>
        <p className="mt-1 text-[.82rem] font-semibold uppercase tracking-[.08em] text-paper/70">{FUEL_LABEL[product.fuel]} {KIND_LABEL[product.kind].toLowerCase()}{product.style === "linear" ? ", linear" : ""}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[.9rem]">
          {product.heat?.btuMax && <div><dt className="text-paper/70">Max output</dt><dd className="font-bold">{fmt(product.heat.btuMax)} BTU</dd></div>}
          {product.heat?.areaSqFt && <div><dt className="text-paper/70">Heats up to</dt><dd className="font-bold">{fmt(product.heat.areaSqFt)} sq ft</dd></div>}
          {optionCount > 0 && <div><dt className="text-paper/70">Ways to customize</dt><dd className="font-bold">{optionCount} options</dd></div>}
        </dl>

        {size && size.verdict !== "unknown" && (
          <p className={`mt-4 flex items-start gap-2 text-[.88rem] leading-snug ${size.verdict === "good-fit" ? "text-[#9fe0a3]" : "text-[#ffc977]"}`}>
            {size.verdict === "good-fit" ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
            <span>{size.verdict === "good-fit" ? "Right-sized for your room." : <>{size.verdict === "oversized" ? "Bigger than your room needs." : "Smaller than your room needs."} <span className="text-paper/75">{size.message}</span></>}</span>
          </p>
        )}

        {fit && (
          <p className={`mt-3 flex items-start gap-2 text-[.88rem] leading-snug ${fit.status === "fits" || fit.status === "fits-with-trim" ? "text-[#9fe0a3]" : fit.status === "unknown" ? "text-paper/75" : "text-[#ffc977]"}`}>
            <Ruler size={16} className="mt-0.5 shrink-0" />
            <span>{fit.message}{fit.surround ? ` Covers with the ${fit.surround.name.toLowerCase()} (${formatInches(fit.surround.width)} by ${formatInches(fit.surround.height)}).` : ""}</span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <button type="button" className="btn-ember btn-ember-sm" onClick={onChoose}>Build this one</button>
          <button type="button" className="bmf-chip" aria-pressed={comparing} disabled={!comparing && compareFull} onClick={onCompare}
            title={!comparing && compareFull ? "Compare holds three. Remove one first." : undefined}>
            <Scale size={14} /> {comparing ? "Comparing" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}
