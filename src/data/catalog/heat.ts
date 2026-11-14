/**
 * Heat estimator.
 *
 * Industry rule of thumb for the mid-Atlantic: roughly 25 to 45 BTU per square
 * foot of space actually being heated, scaled for ceiling height. It is a
 * starting point, not a Manual J load calculation, and the copy says so. What
 * matters is that it is honest in both directions: it flags an undersized unit
 * and, just as loudly, an oversized one, because an oversized stove that has to
 * be damped down all winter burns dirty and overheats the room.
 */

export type Openness = "closed" | "open-one" | "open-plan";
export type Tightness = "tight" | "average" | "drafty";

export interface HeatInput {
  sqft: number;
  /** Ceiling height in feet. */
  ceiling: number;
  openness: Openness;
  tightness: Tightness;
}

export interface HeatResult {
  /** Square footage that effectively has to be heated, after openness. */
  effectiveSqft: number;
  btuLow: number;
  btuHigh: number;
  /** Midpoint, handy for sorting products by closeness. */
  btuTarget: number;
}

const BTU_PER_SQFT: Record<Tightness, number> = { tight: 25, average: 35, drafty: 45 };
/** A fireplace in a room that opens to more space heats more space. */
const OPENNESS_FACTOR: Record<Openness, number> = { closed: 1, "open-one": 1.25, "open-plan": 1.5 };

export const MIN_SQFT = 100;
export const MAX_SQFT = 6000;
/** No residential hearth appliance is sized for more than this much space. */
const MAX_EFFECTIVE_SQFT = 4000;

/** Clamp to a sane range so a typo cannot produce a six-figure BTU answer. */
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function isHeatInputValid(input: Partial<HeatInput>): input is HeatInput {
  return (
    typeof input.sqft === "number" && input.sqft >= MIN_SQFT && input.sqft <= MAX_SQFT &&
    typeof input.ceiling === "number" && input.ceiling >= 7 && input.ceiling <= 20 &&
    !!input.openness && !!input.tightness
  );
}

export function estimateHeat(input: HeatInput): HeatResult {
  const sqft = clamp(input.sqft, MIN_SQFT, MAX_SQFT);
  const ceiling = clamp(input.ceiling, 7, 20);
  // Eight feet is the baseline the rule of thumb assumes.
  const ceilingFactor = ceiling / 8;
  const effectiveSqft = Math.min(MAX_EFFECTIVE_SQFT, Math.round(sqft * OPENNESS_FACTOR[input.openness]));
  const target = effectiveSqft * BTU_PER_SQFT[input.tightness] * ceilingFactor;
  return {
    effectiveSqft,
    btuLow: roundTo(target * 0.8, 500),
    btuHigh: roundTo(target * 1.2, 500),
    btuTarget: roundTo(target, 500),
  };
}

export type SizeVerdict = "good-fit" | "undersized" | "oversized" | "unknown";

export interface SizeAssessment {
  verdict: SizeVerdict;
  /** Plain-language sentence for the card or the build summary. */
  message: string;
}

/**
 * How a unit's published output compares with what the room needs. A unit is
 * judged on its maximum output against the target, because that is what it
 * reaches on a cold night, and on its minimum output where the maker gives one
 * (a gas unit that turns down low is far more forgiving of oversizing).
 */
export function assessSize(need: HeatResult, unit: { btuMin?: number; btuMax?: number }): SizeAssessment {
  const max = unit.btuMax;
  if (!max) return { verdict: "unknown", message: "The maker does not publish an output figure for this unit, so we size it on the visit." };
  if (max < need.btuLow * 0.85) {
    return { verdict: "undersized", message: `Tops out near ${max.toLocaleString()} BTU. Your room wants about ${need.btuLow.toLocaleString()} to ${need.btuHigh.toLocaleString()}, so this would run flat out and still fall short on the coldest days.` };
  }
  if (max > need.btuHigh * 1.6) {
    const turnsDown = unit.btuMin !== undefined && unit.btuMin <= need.btuHigh * 0.6;
    return {
      verdict: "oversized",
      message: turnsDown
        ? `More output than this room needs (${max.toLocaleString()} BTU at full burn). It turns down to ${unit.btuMin!.toLocaleString()} BTU, so it can still be comfortable, but a smaller unit is the safer choice.`
        : `Well over what this room needs. At ${max.toLocaleString()} BTU it would overheat the space or have to be choked down, which wastes fuel. Look one size smaller.`,
    };
  }
  return { verdict: "good-fit", message: `Output of ${max.toLocaleString()} BTU lines up with what your room needs.` };
}
