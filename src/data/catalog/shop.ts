/**
 * Storefront data helpers. Categories are derived from the catalog (fuel plus
 * type), so a category appears the moment a product exists for it and never
 * shows empty. Pure functions, no React.
 */
import type { Fuel, Install, Kind, Product } from "./types";
import { FUEL_LABEL } from "./types";
import { encodeBuild, defaultPicks, emptyBuild } from "./buildState";

const KIND_PLURAL: Record<Kind, string> = { fireplace: "fireplaces", insert: "inserts", stove: "stoves", "log-set": "log sets" };

export interface Category {
  slug: string;
  fuel: Fuel;
  kind: Kind;
  title: string;
  blurb: string;
  products: Product[];
}

const BLURB: Partial<Record<`${Fuel}-${Kind}`, string>> = {
  "gas-fireplace": "Built into a wall or chase. They vent through a wall or the roof and need a gas line.",
  "gas-insert": "Slide into the fireplace you already have, so a drafty open hearth becomes a real heater.",
  "gas-stove": "Freestanding stoves that burn gas. A stove look with a flip-the-switch start.",
  "wood-fireplace": "High-efficiency wood-burning fireplaces framed into the wall.",
  "wood-insert": "A wood insert turns an open fireplace that mostly heats the chimney into one that heats the room.",
  "wood-stove": "Freestanding wood stoves for serious heat, connected to a proper chimney.",
  "pellet-stove": "Fuel pellets in a hopper and a thermostat on the wall. Steady heat with less tending.",
  "pellet-insert": "Pellet heat in the fireplace you already have.",
  "electric-fireplace": "No gas line and no chimney. Plug in or hardwire, and the flames run with or without heat.",
  "electric-insert": "Electric flames and heat that slide into the fireplace you have.",
};

export const categorySlug = (p: Pick<Product, "fuel" | "kind">) => `${p.fuel}-${KIND_PLURAL[p.kind]}`;

const FUEL_ORDER: Fuel[] = ["gas", "wood", "pellet", "electric"];
const KIND_ORDER: Kind[] = ["insert", "fireplace", "stove", "log-set"];

export function categorize(products: Product[]): Category[] {
  const map = new Map<string, Category>();
  for (const p of products) {
    const slug = categorySlug(p);
    let c = map.get(slug);
    if (!c) {
      const title = `${FUEL_LABEL[p.fuel]} ${KIND_PLURAL[p.kind]}`;
      c = { slug, fuel: p.fuel, kind: p.kind, title, blurb: BLURB[`${p.fuel}-${p.kind}`] ?? "", products: [] };
      map.set(slug, c);
    }
    c.products.push(p);
  }
  return Array.from(map.values()).sort((a, b) => FUEL_ORDER.indexOf(a.fuel) - FUEL_ORDER.indexOf(b.fuel) || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}

export const productPath = (p: Product) => `/fireplace-shop/${categorySlug(p)}/${p.slug}`;

const INSTALL_FOR_KIND: Record<Kind, Install> = { fireplace: "new-build", insert: "existing-fireplace", stove: "freestanding", "log-set": "existing-fireplace" };

/** A builder link that opens this unit with its default options already chosen. */
export function buildLink(p: Product): string {
  const state = { ...emptyBuild(), install: INSTALL_FOR_KIND[p.kind], fuel: p.fuel, productId: p.id, picks: defaultPicks(p) };
  return `/build-your-fireplace?step=customize&${encodeBuild(state)}`;
}

/** schema.org Product. An offer is added only when a real, approved price exists. Never a rating. */
export function productLd(p: Product, origin: string, brandName: string, image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${brandName} ${p.name}`,
    ...(p.sku ? { sku: p.sku, mpn: p.sku } : {}),
    brand: { "@type": "Brand", name: brandName },
    description: p.summary,
    category: `${FUEL_LABEL[p.fuel]} ${KIND_PLURAL[p.kind]}`,
    url: `${origin}${productPath(p)}`,
    ...(image ? { image } : {}),
    ...(p.price ? { offers: { "@type": "Offer", price: p.price.amount, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${origin}${productPath(p)}` } } : {}),
  };
}
