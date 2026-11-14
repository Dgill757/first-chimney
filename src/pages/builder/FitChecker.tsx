import { useState } from "react";
import { parseInches, formatInches, type Opening } from "@/data/catalog/fit";
import type { BuildApi } from "./useBuild";

/**
 * The insert fit checker. Fields accept what a person reads off a tape measure
 * (29, 29 1/2, 29.5). The opening is only committed once width and height both
 * parse, so half-typed numbers never flicker the results list.
 */
export default function FitChecker({ api }: { api: BuildApi }) {
  const o = api.build.opening;
  const [raw, setRaw] = useState({
    frontWidth: o ? String(o.frontWidth) : "", height: o ? String(o.height) : "", depth: o?.depth ? String(o.depth) : "", rearWidth: o?.rearWidth ? String(o.rearWidth) : "",
  });
  const [factoryBuilt, setFactoryBuilt] = useState(o?.factoryBuilt ?? false);

  const commit = (next: typeof raw, fb: boolean) => {
    const frontWidth = parseInches(next.frontWidth), height = parseInches(next.height);
    if (!frontWidth || !height) { if (!next.frontWidth && !next.height) api.setOpening(undefined); return; }
    api.setOpening({ frontWidth, height, depth: parseInches(next.depth), rearWidth: parseInches(next.rearWidth), factoryBuilt: fb });
  };
  const set = (k: keyof typeof raw) => (e: React.ChangeEvent<HTMLInputElement>) => { const next = { ...raw, [k]: e.target.value }; setRaw(next); commit(next, factoryBuilt); };
  const bad = (v: string) => v.trim() !== "" && parseInches(v) === undefined;

  const field = (k: keyof typeof raw, label: string, help?: string) => (
    <div>
      <label className="bmf-label" htmlFor={`fit-${k}`}>{label}</label>
      <input id={`fit-${k}`} className="bmf-input" inputMode="decimal" autoComplete="off" placeholder="inches" value={raw[k]} onChange={set(k)} aria-invalid={bad(raw[k])} aria-describedby={`fit-${k}-h`} />
      <p id={`fit-${k}-h`} className={bad(raw[k]) ? "bmf-error" : "bmf-help"}>{bad(raw[k]) ? "Use numbers like 29 or 29 1/2." : help ?? " "}</p>
    </div>
  );

  return (
    <div className="bmf-card p-5">
      <h3 className="font-serif text-lg font-bold">Will an insert fit?</h3>
      <p className="mt-1 text-[.9rem] leading-relaxed text-paper/75">Measure the opening of the fireplace you have. We hide only the units that cannot work and show which surround covers the rest.</p>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
        {field("frontWidth", "Front width")}
        {field("height", "Height")}
        {field("depth", "Depth", "Optional")}
        {field("rearWidth", "Rear width", "Optional")}
      </div>
      <label className="mt-1 flex min-h-[2.75rem] cursor-pointer items-center gap-3 text-[.92rem]">
        <input type="checkbox" className="h-5 w-5 accent-[#e6a13a]" checked={factoryBuilt} onChange={e => { setFactoryBuilt(e.target.checked); commit(raw, e.target.checked); }} />
        <span>It is a factory-built (metal) fireplace</span>
      </label>
      <p className="bmf-help">Masonry can often be opened up for depth. A metal firebox cannot. We confirm every measurement on site before anything is ordered.</p>
      {o && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-paper/10 px-4 py-3 text-[.9rem]">
          <span>Checking against <strong>{formatInches(o.frontWidth)}</strong> by <strong>{formatInches(o.height)}</strong></span>
          <button type="button" className="font-bold text-gold underline underline-offset-4" onClick={() => { setRaw({ frontWidth: "", height: "", depth: "", rearWidth: "" }); setFactoryBuilt(false); api.setOpening(undefined); }}>Clear</button>
        </div>
      )}
    </div>
  );
}
