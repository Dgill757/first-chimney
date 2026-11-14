/**
 * Catalog loader. Every JSON file dropped into ./products is picked up here
 * automatically (one lazy chunk per file), so adding a brand's models is a data
 * change with no code edit. Nothing in the entry bundle depends on this file:
 * the builder and shop import it only inside their own lazy routes.
 */
import { useEffect, useState } from "react";
import { BRANDS } from "./brands";
import type { Brand, Catalog, Product } from "./types";

const files = import.meta.glob<{ default: Product[] }>("./products/*.json");

let pending: Promise<Catalog> | null = null;

export function loadCatalog(): Promise<Catalog> {
  if (!pending) {
    pending = Promise.all(Object.values(files).map(load => load())).then(mods => {
      const enabledBrands = new Set(BRANDS.filter(b => b.enabled).map(b => b.id));
      const seen = new Set<string>();
      const products = mods
        .flatMap(m => m.default)
        .filter(p => p.enabled && enabledBrands.has(p.brandId))
        .filter(p => (seen.has(p.id) ? false : (seen.add(p.id), true)));
      return { version: 1, brands: BRANDS.filter(b => b.enabled), products };
    });
    // A failed chunk (offline, deploy in progress) must be retryable.
    pending.catch(() => { pending = null; });
  }
  return pending;
}

export type CatalogState = { status: "loading" } | { status: "error"; retry: () => void } | { status: "ready"; catalog: Catalog };

export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    setState({ status: "loading" });
    loadCatalog().then(
      catalog => { if (live) setState({ status: "ready", catalog }); },
      () => { if (live) setState({ status: "error", retry: () => setAttempt(n => n + 1) }); },
    );
    return () => { live = false; };
  }, [attempt]);
  return state;
}

export const productLookup = (catalog: Catalog) => {
  const byId = new Map(catalog.products.map(p => [p.id, p] as const));
  return (id: string) => byId.get(id);
};

export const brandLabel = (brand: Brand | undefined, product: Product, all: Brand[]) => {
  const names = [brand?.name, ...(product.altBrandIds ?? []).map(id => all.find(b => b.id === id)?.name)].filter(Boolean);
  return names.join(" / ");
};

export * from "./types";
