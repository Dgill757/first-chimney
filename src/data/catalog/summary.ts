/**
 * Plain-language build summary and install notes. Pure functions, so the same
 * text feeds the on-screen summary, the quote request, the email fallback and
 * the print sheet, and so it is easy to test.
 */
import type { Product } from "./types";
import { FUEL_LABEL, KIND_LABEL } from "./types";
import type { BuildState } from "./buildState";
import { estimateHeat, isHeatInputValid } from "./heat";
import { formatInches } from "./fit";
import { selectedOptions } from "./select";

export const MAX_QUOTE_CHARS = 4800; // the lead handler accepts 5000

/** What we check on the visit, by fuel and type. General practice, not a promise of scope or price. */
export function installNotes(p: Product): string[] {
  const notes: string[] = [];
  if (p.fuel === "gas") notes.push("Gas: we size and check the gas line, add a shutoff and pressure-test it before the first burn.");
  if (p.fuel === "wood" || p.fuel === "pellet") notes.push("We confirm the hearth, the clearances to anything that can burn and the chimney connection before anything is ordered.");
  if (p.fuel === "pellet") notes.push("Pellet: it needs a power outlet nearby and a short, dedicated vent.");
  if (p.fuel === "electric") notes.push("Electric: it plugs into a standard outlet or is hardwired. There is no gas line and no chimney to deal with.");
  if (p.kind === "insert" && p.fuel !== "electric") notes.push("Insert: it needs a stainless liner from the unit up to the top of the chimney. We inspect the flue first and tell you what it needs.");
  if (p.kind === "stove" && p.fuel === "wood") notes.push("Stove: it needs a code-compliant chimney or a new class A chimney, and a hearth pad rated for a wood stove.");
  if (p.kind === "fireplace" && p.fuel !== "electric") notes.push("Fireplace: we check the framing, the vent route and the finish materials around it.");
  notes.push("We measure the opening and confirm every dimension on site before we order. The price comes after that visit, and it is written and itemized.");
  return notes;
}

export function buildSummaryText(product: Product, build: BuildState, brandName: string): string {
  const lines: string[] = [];
  lines.push(`BUILD MY FIREPLACE`);
  lines.push(`${brandName} ${product.name}${product.sku ? ` (${product.sku})` : ""}`);
  lines.push(`${FUEL_LABEL[product.fuel]} ${KIND_LABEL[product.kind].toLowerCase()}`);
  if (build.install) lines.push(`Going into: ${({ "new-build": "a new wall or chase", "existing-fireplace": "an existing fireplace", freestanding: "the middle of a room" } as const)[build.install]}`);
  if (build.room && isHeatInputValid(build.room)) {
    const n = estimateHeat(build.room);
    lines.push(`Room: about ${build.room.sqft} sq ft, ${build.room.ceiling} ft ceiling. Estimated need ${n.btuLow.toLocaleString()} to ${n.btuHigh.toLocaleString()} BTU.`);
  }
  if (build.opening) {
    const o = build.opening;
    lines.push(`Opening: ${formatInches(o.frontWidth)} wide by ${formatInches(o.height)} high${o.depth ? `, ${formatInches(o.depth)} deep` : ""}${o.rearWidth ? `, ${formatInches(o.rearWidth)} rear width` : ""}. ${o.factoryBuilt ? "Factory-built (metal)." : "Masonry."}`);
  }
  if (product.heat?.btuMax) lines.push(`Maker rating: up to ${product.heat.btuMax.toLocaleString()} BTU${product.heat.areaSqFt ? `, heats up to ${product.heat.areaSqFt.toLocaleString()} sq ft` : ""}.`);
  const chosen = selectedOptions(product, build.picks);
  if (chosen.length) {
    lines.push("", "CHOICES");
    for (const { group, option } of chosen) lines.push(`- ${group.label}: ${option.name}${option.part ? ` (part ${option.part})` : ""}`);
  }
  lines.push("", `Maker page: ${product.sourceUrl}`);
  const text = lines.join("\n");
  return text.length > MAX_QUOTE_CHARS ? `${text.slice(0, MAX_QUOTE_CHARS - 20)}\n[trimmed]` : text;
}
