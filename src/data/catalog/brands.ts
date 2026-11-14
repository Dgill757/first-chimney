import type { Brand } from "./types";

/**
 * Every brand the builder and shop know about. Flip `enabled` to false to drop a
 * brand, and every model, filter chip and sitemap entry for it disappears with
 * no other change. Seeded with the full set of lines a hearth dealer in this
 * market typically offers, because this is a preview for Andrew and nobody has
 * confirmed which ones he carries yet.
 */
export const BRANDS: Brand[] = [
  {
    id: "fpx", name: "Fireplace Xtrordinair", enabled: true,
    site: "https://www.fireplacex.com/products/",
    designCenter: "https://firebuilder.travisindustries.com/#/select",
    blurb: "Gas, wood and electric fireplaces and inserts.",
    fuels: ["gas", "wood", "electric"],
  },
  {
    id: "lopi", name: "Lopi", enabled: true,
    site: "https://www.lopistoves.com/products/",
    designCenter: "https://firebuilder.travisindustries.com/#/select",
    blurb: "Wood, gas and pellet stoves, inserts and fireplaces.",
    fuels: ["wood", "gas", "pellet", "electric"],
  },
  {
    id: "kozy", name: "Kozy Heat", enabled: true,
    site: "https://www.kozyheat.com/products/",
    designCenter: "https://buildyourfire.com/",
    blurb: "Gas and electric fireplaces, inserts and stoves.",
    fuels: ["gas", "electric"],
  },
  {
    id: "valor", name: "Valor", enabled: true,
    site: "https://www.valorfireplaces.com/gas-products/",
    designCenter: "https://design.valorfireplaces.com/",
    blurb: "Gas and electric fireplaces and inserts.",
    fuels: ["gas", "electric"],
  },
  {
    id: "enviro", name: "Enviro", enabled: true,
    site: "https://enviro.com/",
    designCenter: "https://enviro.com/resources/fireplace-builder/",
    blurb: "Gas fireplaces and inserts.",
    fuels: ["gas"],
  },
  {
    id: "mf", name: "Modern Flames", enabled: true,
    site: "https://www.modernflames.com/",
    blurb: "Electric fireplaces.",
    fuels: ["electric"],
  },
  {
    id: "sf", name: "SimpliFire", enabled: true,
    site: "https://www.simplifire.com/",
    blurb: "Electric fireplaces and inserts.",
    fuels: ["electric"],
  },
];

export const brandById = (id: string) => BRANDS.find(b => b.id === id);
