/**
 * The builder's brain: one hook that owns the build, keeps it in the URL and in
 * localStorage, and exposes small intent-named actions to the steps.
 *
 * The URL is the source of truth when it carries a build (that is what makes a
 * link shareable); otherwise localStorage restores the last session. History is
 * updated with replaceState so the Back button leaves the builder instead of
 * stepping through every click.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCatalog, productLookup, type Catalog, type Product, type Fuel, type Install } from "@/data/catalog";
import { decodeBuild, defaultPicks, emptyBuild, encodeBuild, kindsFor, loadBuild, saveBuild, clearBuild, toggleCompare, type BuildState } from "@/data/catalog/buildState";
import { estimateHeat, isHeatInputValid, type HeatResult } from "@/data/catalog/heat";
import { filterProducts, pickOption, type Filters } from "@/data/catalog/select";

export type StepId = "start" | "choose" | "customize" | "build";
export const STEPS: { id: StepId; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "choose", label: "Choose" },
  { id: "customize", label: "Customize" },
  { id: "build", label: "Your build" },
];
const isStep = (v: string | null): v is StepId => !!v && STEPS.some(s => s.id === v);

function readUrl(): { step: StepId | null; search: string } {
  if (typeof window === "undefined") return { step: null, search: "" };
  const q = new URLSearchParams(window.location.search);
  const step = q.get("step");
  q.delete("step");
  return { step: isStep(step) ? step : null, search: q.toString() };
}

export interface BuildApi {
  catalog: Catalog;
  build: BuildState;
  step: StepId;
  setStep: (s: StepId) => void;
  product: Product | undefined;
  need: HeatResult | undefined;
  kinds: ReturnType<typeof kindsFor>;
  setInstall: (i: Install | undefined) => void;
  setFuel: (f: Fuel | undefined) => void;
  setRoom: (r: BuildState["room"]) => void;
  setOpening: (o: BuildState["opening"]) => void;
  chooseProduct: (p: Product) => void;
  pick: (groupId: string, optionId: string) => void;
  toggleCompare: (id: string) => void;
  results: (f?: Partial<Filters>) => Product[];
  reset: () => void;
  shareUrl: () => string;
}

export function useBuildState(): { status: "loading" } | { status: "error"; retry: () => void } | ({ status: "ready" } & BuildApi) {
  const state = useCatalog();
  const [build, setBuildState] = useState<BuildState | null>(null);
  const [step, setStepState] = useState<StepId>("start");
  const hydrated = useRef(false);

  // Hydrate once the catalog is here, so decoded ids can be validated against it.
  useEffect(() => {
    if (state.status !== "ready" || hydrated.current) return;
    hydrated.current = true;
    const lookup = productLookup(state.catalog);
    const { step: urlStep, search } = readUrl();
    const fromUrl = search ? decodeBuild(search, lookup) : null;
    const restored = fromUrl && (fromUrl.productId || fromUrl.install || fromUrl.fuel) ? fromUrl : loadBuild(lookup);
    // A shared link with a product but no picks should still start complete.
    const product = restored.productId ? lookup(restored.productId) : undefined;
    if (product && !Object.keys(restored.picks).length) restored.picks = defaultPicks(product);
    setBuildState(restored);
    setStepState(urlStep ?? (restored.productId ? "customize" : "start"));
  }, [state]);

  // Persist on every change.
  useEffect(() => {
    if (!build || state.status !== "ready") return;
    saveBuild(build);
    const q = encodeBuild(build);
    const url = `${window.location.pathname}?${new URLSearchParams({ step }).toString()}${q ? `&${q}` : ""}`;
    window.history.replaceState(window.history.state, "", url);
  }, [build, step, state.status]);

  const update = useCallback((fn: (b: BuildState) => BuildState) => setBuildState(b => fn(b ?? emptyBuild())), []);

  const catalog = state.status === "ready" ? state.catalog : undefined;
  const lookup = useMemo(() => (catalog ? productLookup(catalog) : () => undefined), [catalog]);

  const api = useMemo<BuildApi | null>(() => {
    if (!catalog || !build) return null;
    const product = build.productId ? lookup(build.productId) : undefined;
    const need = build.room && isHeatInputValid(build.room) ? estimateHeat(build.room) : undefined;
    const kinds = kindsFor(build.install);
    return {
      catalog, build, step, product, need, kinds,
      setStep: s => { setStepState(s); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }); },
      // Changing the install type invalidates a model that no longer fits it.
      setInstall: install => update(b => ({ ...b, install, ...(b.productId && lookup(b.productId) && !kindsFor(install).includes(lookup(b.productId)!.kind) ? { productId: undefined, picks: {} } : {}) })),
      setFuel: fuel => update(b => ({ ...b, fuel })),
      setRoom: room => update(b => ({ ...b, room })),
      setOpening: opening => update(b => ({ ...b, opening })),
      chooseProduct: p => update(b => ({ ...b, productId: p.id, picks: defaultPicks(p), fuel: b.fuel ?? p.fuel })),
      pick: (groupId, optionId) => update(b => {
        const p = b.productId ? lookup(b.productId) : undefined;
        return p ? { ...b, picks: pickOption(p, b.picks, groupId, optionId) } : b;
      }),
      toggleCompare: id => update(b => ({ ...b, compare: toggleCompare(b.compare, id) })),
      results: (extra = {}) => filterProducts(catalog.products, { kinds, fuel: build.fuel, need, ...extra }),
      reset: () => { clearBuild(); setBuildState(emptyBuild()); setStepState("start"); },
      shareUrl: () => `${window.location.origin}${window.location.pathname}?${new URLSearchParams({ step: "build" }).toString()}&${encodeBuild(build)}`,
    };
  }, [catalog, build, step, lookup, update]);

  if (state.status === "loading" || (state.status === "ready" && !api)) return { status: "loading" };
  if (state.status === "error") return { status: "error", retry: state.retry };
  return { status: "ready", ...(api as BuildApi) };
}
