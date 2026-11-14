/**
 * Insert fit checker.
 *
 * Rules, confirmed by probing a reference builder at the boundary values:
 *  - Front width and height are hard gates: the opening must be at least the
 *    unit's published minimum in both.
 *  - Depth is advisory on a masonry fireplace, because a mason can open the
 *    firebox up. On a factory-built (metal) fireplace it cannot be changed, so
 *    short depth is a real "no".
 *  - Rear width is only checked when the maker publishes it.
 *  - A trim-panel or reduced-fit kit may lower the minimum.
 *  - An opening bigger than the unit needs a surround panel to cover the gap,
 *    and a bigger one still needs a custom backing plate.
 * We measure on site before anything is ordered, and every message says so.
 */
import type { FitSpec, Product } from "./types";

export interface Opening {
  frontWidth: number;
  height: number;
  depth?: number;
  rearWidth?: number;
  factoryBuilt: boolean;
}

export type FitStatus = "fits" | "fits-with-trim" | "needs-depth" | "too-small" | "unknown";

export interface FitResult {
  status: FitStatus;
  /** Plain-language line for the card. */
  message: string;
  /** Surround that covers the gap, when one is needed and one exists. */
  surround?: { name: string; width: number; height: number; part?: string };
  /** True when the opening is bigger than any published surround. */
  needsCustomPlate?: boolean;
}

const EPS = 1e-6;
const ge = (a: number, b: number) => a + EPS >= b;
const inch = (n: number) => {
  const whole = Math.floor(n + EPS);
  const frac = Math.round((n - whole) * 16);
  const names: Record<number, string> = { 0: "", 2: " 1/8", 4: " 1/4", 6: " 3/8", 8: " 1/2", 10: " 5/8", 12: " 3/4", 14: " 7/8" };
  if (frac === 16) return `${whole + 1}`;
  return `${whole}${names[frac] ?? ` ${frac}/16`}`;
};
export const formatInches = (n: number) => `${inch(n)}″`;

export function parseInches(raw: string): number | undefined {
  const text = raw.trim().replace(/["″”]/g, "");
  if (!text) return undefined;
  // Accept 29, 29.5, 29 1/2 and 1/2.
  const mixed = text.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = text.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function checkFit(fit: FitSpec | undefined, opening: Opening): FitResult {
  if (!fit) return { status: "unknown", message: "No published opening size for this unit yet. We confirm the fit on the visit." };

  const widthOk = ge(opening.frontWidth, fit.minFrontWidth);
  const heightOk = ge(opening.height, fit.minHeight);
  const rearOk = fit.minRearWidth === undefined || opening.rearWidth === undefined || ge(opening.rearWidth, fit.minRearWidth);
  const depthKnown = opening.depth !== undefined && fit.minDepth !== undefined;
  const depthOk = !depthKnown || ge(opening.depth!, fit.minDepth!);

  const trim = fit.withTrim;
  const trimOk = !!trim && ge(opening.frontWidth, trim.frontWidth) && ge(opening.height, trim.height) && (trim.depth === undefined || !depthKnown || ge(opening.depth!, trim.depth));

  const fullFit = widthOk && heightOk && rearOk;
  if (!fullFit && !trimOk) {
    const w = fit.minFrontWidth - opening.frontWidth;
    const h = fit.minHeight - opening.height;
    const parts = [w > EPS ? `${formatInches(w)} wider` : "", h > EPS ? `${formatInches(h)} taller` : ""].filter(Boolean);
    return {
      status: "too-small",
      message: parts.length ? `Needs an opening about ${parts.join(" and ")}. ${fit.customNote ? fit.customNote : "A mason can sometimes enlarge a masonry opening."}` : "The rear of the opening is narrower than this unit needs.",
    };
  }

  if (!depthOk && opening.factoryBuilt) {
    return { status: "needs-depth", message: `Your factory-built firebox is ${formatInches(fit.minDepth! - opening.depth!)} too shallow, and a metal firebox cannot be opened up. A different unit is the answer here.` };
  }

  const usingTrim = !fullFit && trimOk;
  const surround = pickSurround(fit, opening);
  const base: FitResult = {
    status: usingTrim ? "fits-with-trim" : "fits",
    message: usingTrim ? "Fits with the maker's trim-panel kit." : "Fits your opening as measured.",
    surround: surround.pick,
    needsCustomPlate: surround.custom,
  };
  if (!depthOk) base.message += ` Depth is ${formatInches(fit.minDepth! - opening.depth!)} short, which a mason can usually open up on a masonry fireplace.`;
  if (surround.custom) base.message += ` Your opening is bigger than the standard surrounds, so it needs a custom backing plate.`;
  return base;
}

function pickSurround(fit: FitSpec, opening: Opening) {
  const list = fit.surrounds ?? [];
  if (!list.length) return { pick: undefined, custom: false };
  // Smallest panel that fully covers the opening.
  const covering = list.filter(s => ge(s.width, opening.frontWidth) && ge(s.height, opening.height)).sort((a, b) => a.width * a.height - b.width * b.height);
  if (covering[0]) return { pick: covering[0], custom: false };
  return { pick: undefined, custom: true };
}

/** Convenience for lists: a fit status for every product that publishes a spec. */
export function fitAll(products: Product[], opening: Opening): Map<string, FitResult> {
  const out = new Map<string, FitResult>();
  for (const p of products) out.set(p.id, checkFit(p.fit, opening));
  return out;
}

export const fitIsMatch = (r: FitResult) => r.status === "fits" || r.status === "fits-with-trim";
