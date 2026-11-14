/**
 * Pure selectors over a loaded catalog: filtering, sorting, option visibility.
 * No React in here, so all of it is unit-tested.
 */
import type { Fuel, Kind, Option, OptionGroup, Product, Style } from "./types";
import { assessSize, type HeatResult } from "./heat";
import { checkFit, type Opening } from "./fit";

/** How many sides of the fire can be seen. Read from the model name, since makers encode it there. */
export type Sides = "single" | "see-through" | "corner" | "multi-sided";
export const SIDES_LABEL: Record<Sides, string> = { single: "Single-sided", "see-through": "See-through", corner: "Corner", "multi-sided": "Multi-sided" };
export function sidesOf(p: Pick<Product, "name" | "kind">): Sides {
  if (p.kind !== "fireplace") return "single";
  const n = p.name.toLowerCase();
  if (/see[- ]?thr/.test(n)) return "see-through";
  if (/corner/.test(n)) return "corner";
  // Word boundaries matter: "bay" must not match Kozy's Bayport.
  if (/\b(3[- ]?sided|three[- ]sided|bay|pier|peninsula|multi[- ]?sided)\b/.test(n)) return "multi-sided";
  return "single";
}

export interface Filters {
  sides?: Sides;
  kinds?: Kind[];
  fuel?: Fuel;
  style?: Style;
  brandId?: string;
  query?: string;
  /** Only units that fit this opening (insert fit checker). */
  opening?: Opening;
  /** Rank by closeness to what the room needs. */
  need?: HeatResult;
}

const isDefiniteMiss = (status: ReturnType<typeof checkFit>["status"]) => status === "too-small" || status === "needs-depth";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function filterProducts(products: Product[], f: Filters): Product[] {
  const q = f.query ? norm(f.query) : "";
  let list = products.filter(p => {
    if (f.kinds?.length && !f.kinds.includes(p.kind)) return false;
    if (f.fuel && p.fuel !== f.fuel) return false;
    if (f.style && p.style !== f.style) return false;
    if (f.sides && sidesOf(p) !== f.sides) return false;
    if (f.brandId && p.brandId !== f.brandId && !p.altBrandIds?.includes(f.brandId)) return false;
    if (q && !norm(`${p.name} ${p.sku ?? ""} ${p.brandId}`).includes(q)) return false;
    // Only a definite "no" hides a unit. One with no published opening size stays
    // in the list, labelled as something we confirm on the visit.
    if (f.opening && isDefiniteMiss(checkFit(p.fit, f.opening).status)) return false;
    return true;
  });
  if (f.need) {
    const need = f.need;
    // Closest output to the target first; units with no published output last.
    const distance = (p: Product) => p.heat?.btuMax ? Math.abs(Math.log(p.heat.btuMax / need.btuTarget)) : Infinity;
    list = [...list].sort((a, b) => distance(a) - distance(b));
  }
  return list;
}

/** Counts per value, for filter chips that show how many results each would give. */
export function facetCounts<T extends string>(products: Product[], pick: (p: Product) => T[]): Map<T, number> {
  const out = new Map<T, number>();
  for (const p of products) for (const v of Array.from(new Set(pick(p)))) out.set(v, (out.get(v) ?? 0) + 1);
  return out;
}

/**
 * Options a visitor may currently choose in a group. An option that lists
 * `requires` is only available while one of those options is selected anywhere
 * in the build, which is how a panel stays tied to the fronts it fits.
 */
export function optionAvailable(option: Option, selectedIds: Set<string>): boolean {
  if (!option.requires?.length) return true;
  return option.requires.some(id => selectedIds.has(id));
}

export function selectedIdSet(picks: Record<string, string[]>): Set<string> {
  return new Set(Object.values(picks).flat());
}

/** Drop any pick that is no longer allowed after something it depended on changed. */
export function prunePicks(product: Product, picks: Record<string, string[]>): Record<string, string[]> {
  let current = picks;
  // Removing one pick can orphan another, so settle until nothing changes.
  for (let i = 0; i < 4; i++) {
    const ids = selectedIdSet(current);
    const next: Record<string, string[]> = {};
    let changed = false;
    for (const g of product.options) {
      const kept = (current[g.id] ?? []).filter(id => {
        const opt = g.options.find(o => o.id === id);
        return opt && optionAvailable(opt, ids);
      });
      if (kept.length !== (current[g.id] ?? []).length) changed = true;
      if (kept.length) next[g.id] = kept;
    }
    current = next;
    if (!changed) break;
  }
  return current;
}

export const optionById = (product: Product, id: string): { group: OptionGroup; option: Option } | undefined => {
  for (const group of product.options) {
    const option = group.options.find(o => o.id === id);
    if (option) return { group, option };
  }
  return undefined;
};

/** Everything chosen, in group order, ready for the summary and the quote. */
export function selectedOptions(product: Product, picks: Record<string, string[]>) {
  return product.options.flatMap(group =>
    (picks[group.id] ?? []).map(id => group.options.find(o => o.id === id)).filter((o): o is Option => !!o).map(option => ({ group, option })));
}

const bitCount = (n: number) => { let c = 0; for (; n; n >>= 1) c += n & 1; return c; };

/** Layer images to stack for the live preview, back to front. */
export function previewLayers(product: Product, picks: Record<string, string[]>): string[] {
  if (!product.preview) return [];
  const { preview } = product;
  const layers: string[] = [];
  // Interior first: it sits behind the front. Try the full key, then back off to
  // a shorter one, so a combination the maker never rendered still shows a unit.
  const parts = preview.interiorOrder.map(gid => {
    const id = picks[gid]?.[0];
    return id ? optionById(product, id)?.option.part : undefined;
  });
  // Every subset of the chosen parts, most parts first, and among equals the one
  // that keeps the later parts (the log set reads more than the liner behind it).
  const masks = Array.from({ length: 1 << parts.length }, (_, m) => m)
    .sort((a, b) => bitCount(b) - bitCount(a) || b - a);
  for (const mask of masks) {
    const chosen = parts.filter((part, i) => part && (mask & (1 << i)));
    const key = [preview.modelSku, ...chosen].join("_");
    if (preview.interior[key]) { layers.push(preview.interior[key]); break; }
  }
  const overlays: { src: string; z: number }[] = [];
  for (const g of product.options) for (const id of picks[g.id] ?? []) {
    const o = g.options.find(x => x.id === id);
    if (o?.layer) overlays.push({ src: o.layer, z: o.z ?? 4 });
  }
  overlays.sort((a, b) => a.z - b.z);
  return [...layers, ...overlays.map(o => o.src)];
}

/**
 * Make one pick, then keep the whole build consistent: drop anything that
 * depended on a choice that just changed, and if the new choice unlocks a
 * group that now has nothing valid selected, fill it with the first allowed
 * option (so choosing a front brings its matching surround panel along).
 */
export function pickOption(product: Product, picks: Record<string, string[]>, groupId: string, optionId: string): Record<string, string[]> {
  const group = product.options.find(g => g.id === groupId);
  if (!group) return picks;
  const current = picks[groupId] ?? [];
  const has = current.includes(optionId);
  let next: string[];
  if (group.limit <= 1) next = has ? (group.required ? current : []) : [optionId];
  else next = has ? current.filter(id => id !== optionId) : [...current, optionId].slice(-group.limit);
  let out = { ...picks };
  if (next.length) out[groupId] = next; else delete out[groupId];
  out = prunePicks(product, out);

  const chosen = group.options.find(o => o.id === optionId);
  if (chosen?.unlocks?.length && next.includes(optionId)) {
    const ids = selectedIdSet(out);
    for (const g of product.options) {
      if (g.id === groupId || (out[g.id] ?? []).length) continue;
      const first = g.options.find(o => chosen.unlocks!.includes(o.id) && optionAvailable(o, ids));
      if (first) out[g.id] = [first.id];
    }
  }
  return out;
}

export { assessSize };
