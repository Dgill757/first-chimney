/**
 * Catalog schema. Everything the builder and the shop render comes from data
 * that matches these types, so adding a brand, a model or an option is a data
 * change and never a code change.
 *
 * Hard rules baked into the shape:
 *  - Nothing here is invented. Every product carries the manufacturer URL it
 *    was taken from, and any field the manufacturer did not publish is simply
 *    absent (optional), never guessed.
 *  - Price is optional. We only ever show one that Andrew has been cleared to
 *    publish; the default everywhere is "Request a quote".
 */

export type Fuel = "gas" | "wood" | "pellet" | "electric";
export type Kind = "fireplace" | "insert" | "stove" | "log-set";
export type Style = "traditional" | "linear" | "contemporary" | "freestanding";

/** What the visitor is putting it into. Drives which kinds are suggested. */
export type Install = "new-build" | "existing-fireplace" | "freestanding";

export interface Brand {
  id: string;
  name: string;
  /** One flag switches a whole brand off if Andrew does not carry it. */
  enabled: boolean;
  /** Where each fuel line of this brand is sold, for the "official page" link. */
  site: string;
  /** The maker's own design center, offered as a courtesy link. */
  designCenter?: string;
  blurb: string;
  fuels: Fuel[];
}

export interface SpecRow {
  label: string;
  value: string;
  /** Optional footnote the manufacturer attached to the figure. */
  note?: string;
}

export interface Dimensions {
  /** All inches. Only the fields the maker published are present. */
  width?: number;
  height?: number;
  depth?: number;
  viewingWidth?: number;
  viewingHeight?: number;
  /** Free text exactly as published, for display when numbers are not clean. */
  text?: string;
}

/**
 * Minimum opening a unit needs, used by the insert fit checker.
 * All inches. `rearWidth` is only checked when the maker publishes it.
 */
export interface FitSpec {
  minFrontWidth: number;
  minHeight: number;
  minDepth?: number;
  minRearWidth?: number;
  /** A smaller opening that works only with the trim-panel / reduced-fit kit. */
  withTrim?: { frontWidth: number; height: number; depth?: number };
  /** Surround panels that cover an oversized opening, in inches. */
  surrounds?: { name: string; width: number; height: number; sides?: number; part?: string }[];
  /** A fabricated backing plate or custom panel is possible for tight cases. */
  customNote?: string;
  /** Installation-manual guidance, shown as plain text. */
  note?: string;
}

export interface Option {
  id: string;
  name: string;
  /** Manufacturer part number when published. */
  part?: string;
  detail?: string;
  /** Small swatch image (WebP, ~320px). */
  thumb?: string;
  /** Layer image for the live preview, only where licensed layered art exists. */
  layer?: string;
  /** Preview stacking order, lower is further back. */
  z?: number;
  /** Option ids this one needs / unlocks. Empty means independent. */
  requires?: string[];
  unlocks?: string[];
  /** True when the maker marks it as the default or required pick. */
  isDefault?: boolean;
}

export interface OptionGroup {
  id: string;
  /** Customer-facing label such as "Fronts", "Liners", "Log sets". */
  label: string;
  /** Which part of the build this belongs to. */
  area: "exterior" | "interior" | "burner" | "extras";
  required?: boolean;
  /** How many may be chosen. 1 = pick one. */
  limit: number;
  options: Option[];
}

export interface ProductImage {
  src: string;
  alt: string;
  /** Intrinsic size, so we can reserve space and never shift layout. */
  width: number;
  height: number;
}

export interface DocLink {
  label: string;
  url: string;
}

/**
 * Layered live preview, only for units where licensed layered artwork exists.
 * Fronts, panels and accents are overlays (see Option.layer). The firebox
 * interior is a pre-rendered image per combination of liner, log set and media,
 * named by joining the part numbers, so it is looked up and never composed.
 */
export interface Preview {
  /** Intrinsic size of every layer image, so the stage reserves its space. */
  width: number;
  height: number;
  /** Part number the interior images are prefixed with. */
  modelSku: string;
  /** Group ids whose selected part numbers form the interior key, in order. */
  interiorOrder: string[];
  /** Joined part-number key mapped to image path. */
  interior: Record<string, string>;
  /**
   * True when every layer of this unit keeps its visible pixels inside the middle 75% of
   * the canvas height, so the stage can show it in a shorter 4:3 frame without cutting any
   * of it. Computed by scripts/catalog/prune-and-report.mjs, never set by hand.
   */
  cropSafe?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  brandId: string;
  /** The same unit is often sold under a sister brand (Fireplace Xtrordinair and Lopi). */
  altBrandIds?: string[];
  name: string;
  /** Maker's model/part number. */
  sku?: string;
  fuel: Fuel;
  kind: Kind;
  style: Style;
  /** Our own words, written for a homeowner from the published facts. */
  summary: string;
  /** The manufacturer's own description, shown only when labelled as theirs. */
  makerDescription?: string;
  /** Maker's wording is never reused; this is the factual spec list. */
  specs: SpecRow[];
  heat?: { btuMin?: number; btuMax?: number; areaSqFt?: number; efficiency?: string };
  dimensions?: Dimensions;
  venting?: string;
  fit?: FitSpec;
  options: OptionGroup[];
  preview?: Preview;
  images: { hero?: ProductImage; gallery: ProductImage[] };
  docs: DocLink[];
  /** Official manufacturer page or design center this was sourced from. */
  sourceUrl: string;
  /** Only set when Andrew has approved publishing a price. */
  price?: { amount: number; note?: string };
  /** Set false to hide one model without touching the rest. */
  enabled: boolean;
  discontinued?: boolean;
}

export interface Catalog {
  version: number;
  brands: Brand[];
  products: Product[];
}

export const FUEL_LABEL: Record<Fuel, string> = { gas: "Gas", wood: "Wood", pellet: "Pellet", electric: "Electric" };
export const KIND_LABEL: Record<Kind, string> = { fireplace: "Fireplace", insert: "Insert", stove: "Stove", "log-set": "Log set" };
