/**
 * The whole state of one "build", plus how it travels: into a shareable URL, into
 * localStorage so a refresh keeps it, and back out again.
 *
 * Decoding is defensive on purpose. A link someone shared last month may point
 * at a model or option that has since been retired, and a half-broken link must
 * degrade to "as much of your build as still exists", never to a crash.
 */
import type { Fuel, Install, Kind, OptionGroup, Product } from "./types";
import type { Openness, Tightness } from "./heat";

export interface BuildState {
  install?: Install;
  fuel?: Fuel;
  /** Room details for the heat estimator. */
  room?: { sqft: number; ceiling: number; openness: Openness; tightness: Tightness };
  /** Fireplace opening for the fit checker, in inches. */
  opening?: { frontWidth: number; height: number; depth?: number; rearWidth?: number; factoryBuilt: boolean };
  productId?: string;
  /** groupId to chosen option ids. */
  picks: Record<string, string[]>;
  /** Up to three product ids being compared. */
  compare: string[];
}

export const MAX_COMPARE = 3;
export const emptyBuild = (): BuildState => ({ picks: {}, compare: [] });

const INSTALLS: Install[] = ["new-build", "existing-fireplace", "freestanding"];
const FUELS: Fuel[] = ["gas", "wood", "pellet", "electric"];
const OPENNESS: Openness[] = ["closed", "open-one", "open-plan"];
const TIGHTNESS: Tightness[] = ["tight", "average", "drafty"];

const num = (v: string | null, lo: number, hi: number) => {
  if (v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= lo && n <= hi ? n : undefined;
};

/** Which kinds a visitor's install answer points at. */
export function kindsFor(install: Install | undefined): Kind[] {
  if (install === "new-build") return ["fireplace"];
  if (install === "existing-fireplace") return ["insert"];
  if (install === "freestanding") return ["stove"];
  return ["fireplace", "insert", "stove"];
}

export function encodeBuild(state: BuildState): string {
  const q = new URLSearchParams();
  if (state.install) q.set("i", state.install);
  if (state.fuel) q.set("f", state.fuel);
  if (state.room) q.set("r", [state.room.sqft, state.room.ceiling, state.room.openness, state.room.tightness].join("~"));
  if (state.opening) {
    const o = state.opening;
    q.set("o", [o.frontWidth, o.height, o.depth ?? "", o.rearWidth ?? "", o.factoryBuilt ? 1 : 0].join("~"));
  }
  if (state.productId) q.set("p", state.productId);
  const picks = Object.entries(state.picks).filter(([, ids]) => ids.length).map(([g, ids]) => `${g}:${ids.join("~")}`);
  if (picks.length) q.set("s", picks.join(","));
  if (state.compare.length) q.set("c", state.compare.join(","));
  return q.toString();
}

export function decodeBuild(search: string, lookup: (id: string) => Product | undefined): BuildState {
  const q = new URLSearchParams(search.replace(/^[?#]/, ""));
  const state = emptyBuild();

  const install = q.get("i") as Install | null;
  if (install && INSTALLS.includes(install)) state.install = install;
  const fuel = q.get("f") as Fuel | null;
  if (fuel && FUELS.includes(fuel)) state.fuel = fuel;

  // "~" separates fields because "." is needed inside decimals like 20.625.
  const r = q.get("r")?.split("~");
  if (r && r.length === 4) {
    const sqft = num(r[0], 100, 6000), ceiling = num(r[1], 7, 20);
    const openness = r[2] as Openness, tightness = r[3] as Tightness;
    if (sqft && ceiling && OPENNESS.includes(openness) && TIGHTNESS.includes(tightness)) state.room = { sqft, ceiling, openness, tightness };
  }

  const o = q.get("o")?.split("~");
  if (o && o.length === 5) {
    const frontWidth = num(o[0], 6, 120), height = num(o[1], 6, 120);
    if (frontWidth && height) state.opening = { frontWidth, height, depth: num(o[2], 1, 80), rearWidth: num(o[3], 1, 120), factoryBuilt: o[4] === "1" };
  }

  const pid = q.get("p");
  const product = pid ? lookup(pid) : undefined;
  if (product) {
    state.productId = product.id;
    const groups = new Map(product.options.map(g => [g.id, g] as const));
    for (const chunk of (q.get("s") ?? "").split(",")) {
      const [gid, ids] = chunk.split(":");
      const group = groups.get(gid ?? "");
      if (!group || !ids) continue;
      const valid = ids.split("~").filter(id => group.options.some(o => o.id === id)).slice(0, Math.max(1, group.limit));
      if (valid.length) state.picks[group.id] = valid;
    }
  }

  state.compare = (q.get("c") ?? "").split(",").filter(id => id && lookup(id)).slice(0, MAX_COMPARE);
  return state;
}

/** Switching model resets picks, because option groups differ between models. */
export function withProduct(state: BuildState, product: Product): BuildState {
  return { ...state, productId: product.id, picks: defaultPicks(product) };
}

export function defaultPicks(product: Product): Record<string, string[]> {
  const picks: Record<string, string[]> = {};
  for (const g of product.options) {
    const def = g.options.find(o => o.isDefault);
    if (def) picks[g.id] = [def.id];
    else if (g.required && g.options[0]) picks[g.id] = [g.options[0].id];
  }
  return picks;
}

/** Toggle an option, respecting the group's pick limit (1 = radio behaviour). */
export function togglePick(picks: Record<string, string[]>, group: OptionGroup, optionId: string): Record<string, string[]> {
  const current = picks[group.id] ?? [];
  const has = current.includes(optionId);
  let next: string[];
  if (group.limit <= 1) next = has ? (group.required ? current : []) : [optionId];
  else next = has ? current.filter(id => id !== optionId) : [...current, optionId].slice(-group.limit);
  const out = { ...picks };
  if (next.length) out[group.id] = next;
  else delete out[group.id];
  return out;
}

export function toggleCompare(compare: string[], productId: string): string[] {
  if (compare.includes(productId)) return compare.filter(id => id !== productId);
  return [...compare, productId].slice(-MAX_COMPARE);
}

const STORAGE_KEY = "ccc.build.v1";
export function saveBuild(state: BuildState) {
  try { localStorage.setItem(STORAGE_KEY, encodeBuild(state)); } catch { /* private mode or blocked storage: the URL still works */ }
}
export function loadBuild(lookup: (id: string) => Product | undefined): BuildState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? decodeBuild(raw, lookup) : emptyBuild();
  } catch { return emptyBuild(); }
}
export function clearBuild() { try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }
