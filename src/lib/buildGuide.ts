/**
 * Content for the customer's "Your Fireplace Build" guide PDF.
 *
 * Pure function: product data + the visitor's choices in, structured sections out.
 * Every number comes from the manufacturer's published data or from the visitor's
 * own room and opening inputs. Nothing is invented, and anything that depends on
 * the house is labeled "confirmed at the measure".
 */
import type { BuildState } from '../data/catalog/buildState';
import { checkFit, formatInches } from '../data/catalog/fit';
import { assessSize, estimateHeat, isHeatInputValid } from '../data/catalog/heat';
import { selectedOptions } from '../data/catalog/select';
import { installNotes } from '../data/catalog/summary';
import { FUEL_LABEL, KIND_LABEL, type Product } from '../data/catalog/types';

export type GuideItem = { item: string; detail: string; part?: string };

export type BuildGuide = {
  brand: string;
  model: string;
  kindLine: string;
  sku?: string;
  summary: string;
  description: string;
  questions: string[];
  stats: { label: string; value: string }[];
  choices: [string, string][];
  items: GuideItem[];
  alsoNeeded: string[];
  canWarm: string[];
  cannotWarm: string[];
  sizeVerdict?: string;
  fitNote?: string;
  steps: { title: string; body: string }[];
  prep: string[];
  tips: string[];
  specs: [string, string][];
};

const n = (v: number) => v.toLocaleString('en-US');

function alsoNeededFor(p: Product): string[] {
  const out: string[] = [];
  if (p.kind === 'insert' && p.fuel !== 'electric') out.push('Stainless steel chimney liner sized to the unit, run to the top of the chimney');
  if (p.fuel === 'gas') out.push('Gas line to the unit with an accessible shutoff valve, pressure-tested before the first burn');
  if (p.fuel === 'gas' && p.kind !== 'insert') out.push('Direct-vent pipe and termination through the wall or roof, routed on site');
  if (p.kind === 'fireplace' && p.fuel !== 'electric') out.push('Framing, non-combustible finish materials and required clearances around the unit');
  if (p.kind === 'stove' && p.fuel === 'wood') out.push('Approved hearth pad and a chimney or Class A chimney system sized for the stove');
  if (p.fuel === 'pellet') out.push('Dedicated pellet vent and a nearby electrical outlet');
  if (p.fuel === 'electric') out.push('A standard outlet or a dedicated circuit, depending on the model');
  if (p.kind === 'insert') out.push('Inspection of the existing fireplace and flue before ordering (NFPA 211 recommends a Level 2 inspection when changing an appliance)');
  out.push('Permit, where your town requires one');
  return out;
}

export function buildGuide(p: Product, brand: string, build: BuildState): BuildGuide {
  const kindLine = `${FUEL_LABEL[p.fuel]} ${KIND_LABEL[p.kind].toLowerCase()}`;
  const chosen = selectedOptions(p, build.picks);

  const stats: { label: string; value: string }[] = [];
  if (p.heat?.btuMax) stats.push({ label: 'Heat rating', value: `Up to ${n(p.heat.btuMax)} BTU` });
  if (p.heat?.areaSqFt) stats.push({ label: 'Heats up to', value: `${n(p.heat.areaSqFt)} sq ft` });
  if (p.heat?.efficiency) stats.push({ label: 'Efficiency', value: p.heat.efficiency });
  stats.push({ label: 'Fuel', value: FUEL_LABEL[p.fuel] });
  if (stats.length < 4 && p.venting) stats.push({ label: 'Venting', value: p.venting.slice(0, 28) });

  const items: GuideItem[] = [{ item: `${brand} ${p.name}`, detail: kindLine, part: p.sku }];
  for (const { group, option } of chosen) items.push({ item: group.label, detail: option.name + (option.detail ? `, ${option.detail}` : ''), part: option.part });
  if (!chosen.length) items.push({ item: 'Options', detail: 'Maker standard configuration. Fronts, liners and media can be chosen at the consultation.' });

  // Heat: what it can and cannot do, from published data and the visitor's own room.
  const canWarm: string[] = [];
  const cannotWarm: string[] = [];
  let sizeVerdict: string | undefined;
  if (p.heat?.areaSqFt) canWarm.push(`Rated by ${brand} to heat up to about ${n(p.heat.areaSqFt)} sq ft in typical conditions.`);
  if (p.heat?.btuMax) canWarm.push(`Rated by ${brand} at up to ${n(p.heat.btuMax)} BTU at full fire${p.heat.btuMin ? `, turning down to about ${n(p.heat.btuMin)} BTU for mild nights` : ''}. See the specs for input and output figures.`);
  if (build.room && isHeatInputValid(build.room)) {
    const need = estimateHeat(build.room);
    canWarm.push(`Your space: about ${n(build.room.sqft)} sq ft with ${build.room.ceiling} ft ceilings. Estimated need: ${n(need.btuLow)} to ${n(need.btuHigh)} BTU.`);
    const a = assessSize(need, p.heat ?? {});
    if (a.verdict === 'good-fit') canWarm.push(a.message);
    else if (a.verdict !== 'unknown') sizeVerdict = a.message;
    if (a.verdict === 'undersized') cannotWarm.push('It is likely undersized for the space you described. It will take the chill off but may not keep the whole area warm on the coldest nights.');
    if (a.verdict === 'oversized') cannotWarm.push('It is likely more heat than the space you described needs. Oversized units get turned down a lot, which can overheat the room.');
  }
  if (p.fuel === 'electric') {
    canWarm.push('Adds comfort heat to the room it is in, and the flame effect can run with the heat off.');
    cannotWarm.push('Electric fireplaces are supplemental heat for one room. Most plug-in models top out around 5,000 BTU on a standard household circuit.');
  } else {
    canWarm.push('Heats best in the room it is in and in spaces open to it.');
  }
  cannotWarm.push('Heat does not travel well around corners, down hallways or up to closed bedrooms on its own. A blower or open floor plan helps.');
  cannotWarm.push('It is not a whole-house heating system for a multi-level home unless sized and planned that way with us.');

  let fitNote: string | undefined;
  if (p.kind === 'insert' && build.opening) {
    const f = checkFit(p.fit, build.opening);
    fitNote = `Your opening: ${formatInches(build.opening.frontWidth)} wide by ${formatInches(build.opening.height)} high${build.opening.depth ? `, ${formatInches(build.opening.depth)} deep` : ''}. ${f.message}`;
  }

  const steps = [
    { title: 'We review your build', body: 'We look over this build and reach out to talk through your goals, the room and your timeline.' },
    { title: 'On-site measure and inspection', body: p.kind === 'insert' ? 'We measure the fireplace opening and inspect the existing firebox and flue so the unit and liner are sized correctly.' : 'We measure the space, check the vent route, clearances, gas or electrical access and the finish you want.' },
    { title: 'Written, itemized quote', body: 'You get the price in writing with every part listed. Nothing is ordered until you approve it.' },
    { title: 'Ordering', body: `We order the ${brand} unit and the parts it needs. Lead times depend on the manufacturer and the season.` },
    { title: 'Install day', body: 'We protect the room, set the unit, connect venting and gas or power, and test everything before we leave.' },
    { title: 'Walkthrough and first fire', body: 'We show you how to run it, care for it and what to expect in the first few uses.' },
  ];

  const prep = [
    'Clear about three feet around the fireplace and a path from the door, and move decor and photos off the mantel.',
    'Plan for kids and pets to stay out of the work area on install day.',
    p.fuel === 'gas' ? 'Know where your gas meter and main shutoff are, and tell us if you use propane.' : p.fuel === 'electric' ? 'Know where your electrical panel is and whether there is an outlet near the fireplace.' : 'Let us know how you get onto the roof or into the attic, if at all.',
    p.kind === 'insert' ? 'Have the existing fireplace cleaned and inspected before the insert goes in. We can do both in one visit.' : 'Decide where you want the TV, art or shelving, since clearances above a fireplace matter.',
    'Check with your HOA if you have one, and tell us about any permit requirements you know of.',
    'Write down anything you want the fireplace to do: heat a room, ambiance, run during outages, a certain look.',
  ];

  const tips = [
    p.fuel === 'electric' ? 'Keep the area in front of the unit clear and plug it directly into the wall, not an extension cord.' : 'The first few fires can smell as the paint and materials cure. Keep them small and open a window.',
    'Install a carbon monoxide alarm on every level and near sleeping areas, and test it monthly.',
    p.fuel === 'wood' ? 'Burn only dry, seasoned wood. Wet wood makes more smoke and creosote.' : 'Use only manufacturer-approved media, logs and parts with this model.',
    'Book a yearly inspection and service so it keeps running safely and efficiently.',
  ];

  const questions = [
    ...(p.kind === 'insert' ? ['Will it fit my opening, and do I need a trim kit or surround?', 'What size liner does it need, and what shape is my flue in?'] : []),
    ...(p.kind === 'fireplace' ? ['Where will it vent, and what framing and finish work does the wall need?'] : []),
    ...(p.fuel === 'gas' ? ['Natural gas or propane, and how far is the gas line run?', 'Will this model run during a power outage, and does it need a battery backup?'] : []),
    ...(p.fuel === 'wood' ? ['Is my chimney and hearth ready for this unit, or does anything need upgrading first?'] : []),
    ...(p.fuel === 'electric' ? ['Can it plug into an existing outlet, or does it need its own circuit?'] : []),
    'How will it look with my mantel, hearth and the rest of the room?',
    'How long from order to install, and how long does install day take?',
    'What yearly maintenance does it need, and what does the warranty cover?',
  ].slice(0, 7);

  const description = (p.makerDescription && p.makerDescription.length > 60 ? p.makerDescription : p.summary).replace(/\s+/g, ' ').trim();

  return {
    brand,
    description,
    questions,
    model: p.name,
    kindLine,
    sku: p.sku,
    summary: p.summary,
    stats: stats.slice(0, 4),
    choices: chosen.map(({ group, option }) => [group.label, option.name]),
    items,
    alsoNeeded: alsoNeededFor(p),
    canWarm,
    cannotWarm,
    sizeVerdict,
    fitNote,
    steps,
    prep,
    tips,
    specs: p.specs.slice(0, 14).map((s) => [s.label, s.value]),
  };
}

export { installNotes };
