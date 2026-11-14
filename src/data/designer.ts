/**
 * Build Your Fireplace: option catalog.
 *
 * This is an AESTHETIC tool. It does not check code compliance, clearances,
 * venting or structural feasibility, and it never shows a price. Every design
 * ends in a consultation where First Chimney confirms what is possible.
 *
 * The preview (components/FireplacePreview.tsx) is drawn in SVG from these
 * values, so every combination renders instantly with no image downloads.
 */

export type Pattern = 'brick' | 'stone' | 'stacked' | 'plaster' | 'tile' | 'slab';

export type Surround = { id: string; name: string; note: string; pattern: Pattern; base: string; mortar: string; accent: string };
export type Style = { id: string; name: string; note: string; opening: 'arch' | 'square' | 'linear' | 'tall'; width: number; height: number };
export type Mantel = { id: string; name: string; note: string; kind: 'none' | 'beam' | 'shelf' | 'floating' | 'stone'; color: string };
export type Hearth = { id: string; name: string; note: string; kind: 'raised' | 'flush' | 'slab'; color: string; pattern: 'solid' | 'brick' | 'slate' };
export type Fire = { id: string; name: string; note: string; kind: 'open-wood' | 'wood-insert' | 'gas-logs' | 'linear-gas' | 'electric' };
export type Extra = { id: string; name: string; note: string };

export const STYLES: Style[] = [
  { id: 'traditional', name: 'Traditional', note: 'Classic proportions with an arched opening.', opening: 'arch', width: 0.4, height: 0.36 },
  { id: 'transitional', name: 'Transitional', note: 'Clean square opening that works in any room.', opening: 'square', width: 0.42, height: 0.34 },
  { id: 'modern', name: 'Modern Linear', note: 'Long, low opening for a contemporary look.', opening: 'linear', width: 0.62, height: 0.2 },
  { id: 'farmhouse', name: 'Farmhouse', note: 'Tall opening with room for a big beam mantel.', opening: 'tall', width: 0.44, height: 0.4 },
];

export const SURROUNDS: Surround[] = [
  { id: 'red-brick', name: 'Classic Red Brick', note: 'Warm, timeless, forgiving of soot.', pattern: 'brick', base: '#8a3b26', mortar: '#c9b9a6', accent: '#a34a30' },
  { id: 'whitewash-brick', name: 'Whitewashed Brick', note: 'Brick texture with a bright, airy finish.', pattern: 'brick', base: '#d9d2c7', mortar: '#efeae3', accent: '#c7bdb0' },
  { id: 'charcoal-brick', name: 'Painted Charcoal Brick', note: 'Moody and modern without losing texture.', pattern: 'brick', base: '#3a3b3d', mortar: '#55575a', accent: '#2e2f31' },
  { id: 'ledgestone', name: 'Stacked Ledgestone', note: 'Layered stone with deep shadow lines.', pattern: 'stacked', base: '#8f8a83', mortar: '#5f5b56', accent: '#a7a199' },
  { id: 'fieldstone', name: 'Fieldstone', note: 'Rounded natural stone, rustic and substantial.', pattern: 'stone', base: '#9a8f80', mortar: '#6b635a', accent: '#b4a998' },
  { id: 'limewash', name: 'Smooth Limewash', note: 'Soft, hand-troweled plaster look.', pattern: 'plaster', base: '#cfc6b8', mortar: '#cfc6b8', accent: '#bfb5a6' },
  { id: 'concrete-tile', name: 'Large-Format Concrete Tile', note: 'Minimal seams, architectural feel.', pattern: 'tile', base: '#7d7f80', mortar: '#6a6c6d', accent: '#8a8c8d' },
  { id: 'marble', name: 'Marble Slab', note: 'Polished stone with soft veining.', pattern: 'slab', base: '#e8e6e2', mortar: '#cfcac3', accent: '#b9b3ab' },
];

export const MANTELS: Mantel[] = [
  { id: 'none', name: 'No Mantel', note: 'Let the surround speak for itself.', kind: 'none', color: 'transparent' },
  { id: 'oak-beam', name: 'Rustic Oak Beam', note: 'A chunky reclaimed-look beam.', kind: 'beam', color: '#7a5233' },
  { id: 'white-shelf', name: 'Painted Shelf', note: 'Crisp white shelf with classic trim.', kind: 'shelf', color: '#e9e6e0' },
  { id: 'walnut-float', name: 'Floating Walnut', note: 'Thin, dark, no visible brackets.', kind: 'floating', color: '#4a3326' },
  { id: 'stone-mantel', name: 'Cast Stone', note: 'Heavy stone shelf, very traditional.', kind: 'stone', color: '#b9b2a6' },
];

export const HEARTHS: Hearth[] = [
  { id: 'raised-stone', name: 'Raised Stone Hearth', note: 'A seat-height ledge for sitting by the fire.', kind: 'raised', color: '#6f6a63', pattern: 'slate' },
  { id: 'flush-slate', name: 'Flush Slate', note: 'Level with the floor for a clean line.', kind: 'flush', color: '#34363a', pattern: 'slate' },
  { id: 'bluestone', name: 'Bluestone Slab', note: 'A single heavy slab with a soft blue-gray tone.', kind: 'slab', color: '#5c6670', pattern: 'solid' },
  { id: 'brick-hearth', name: 'Brick Hearth', note: 'Matches a brick surround for a unified look.', kind: 'raised', color: '#7d3a26', pattern: 'brick' },
];

export const FIRES: Fire[] = [
  { id: 'open-wood', name: 'Open Wood-Burning', note: 'The real thing: crackle, smell and glow.', kind: 'open-wood' },
  { id: 'wood-insert', name: 'Wood Insert', note: 'A closed, efficient firebox that turns a fireplace into a heater.', kind: 'wood-insert' },
  { id: 'gas-logs', name: 'Gas Log Set', note: 'Realistic logs, flame at the flip of a switch.', kind: 'gas-logs' },
  { id: 'linear-gas', name: 'Linear Gas', note: 'A ribbon of flame over a glass or stone bed.', kind: 'linear-gas' },
  { id: 'electric', name: 'Electric', note: 'No venting, no gas line, flame effect on demand.', kind: 'electric' },
];

export const EXTRAS: Extra[] = [
  { id: 'glass-doors', name: 'Glass Doors', note: 'Keep embers in and warm air from escaping up the flue.' },
  { id: 'screen', name: 'Mesh Screen', note: 'Simple spark protection for open fires.' },
  { id: 'wood-niche', name: 'Log Storage Niche', note: 'A built-in nook to stack firewood.' },
  { id: 'built-ins', name: 'Side Built-Ins', note: 'Shelving or cabinets flanking the fireplace.' },
  { id: 'chimney-cap', name: 'New Chimney Cap', note: 'Keep rain and animals out of the flue.' },
];

export const PROJECT_TYPES = [
  { id: 'refresh', name: 'Refresh my fireplace', note: 'New surround, mantel or hearth on the fireplace I have.' },
  { id: 'insert', name: 'Add an insert or switch to gas', note: 'More heat, less mess, same opening.' },
  { id: 'new', name: 'Build a new fireplace', note: 'A fireplace where there is not one today.' },
  { id: 'exploring', name: 'Just exploring ideas', note: 'Getting inspired before deciding anything.' },
];
export const TIMELINES = ['As soon as possible', 'Next 1 to 3 months', 'Next 3 to 6 months', 'Just browsing'];

export type Design = {
  project?: string;
  timeline?: string;
  style: string;
  surround: string;
  mantel: string;
  hearth: string;
  fire: string;
  extras: string[];
};

export const DEFAULT_DESIGN: Design = {
  style: 'traditional',
  surround: 'red-brick',
  mantel: 'oak-beam',
  hearth: 'raised-stone',
  fire: 'open-wood',
  extras: ['screen'],
};

export const PRESETS: { id: string; name: string; design: Design }[] = [
  { id: 'cozy-classic', name: 'Cozy Classic', design: DEFAULT_DESIGN },
  { id: 'modern-calm', name: 'Modern Calm', design: { style: 'modern', surround: 'concrete-tile', mantel: 'walnut-float', hearth: 'flush-slate', fire: 'linear-gas', extras: [] } },
  { id: 'cabin', name: 'Mountain Cabin', design: { style: 'farmhouse', surround: 'fieldstone', mantel: 'oak-beam', hearth: 'raised-stone', fire: 'wood-insert', extras: ['wood-niche'] } },
  { id: 'bright-cottage', name: 'Bright Cottage', design: { style: 'transitional', surround: 'whitewash-brick', mantel: 'white-shelf', hearth: 'bluestone', fire: 'gas-logs', extras: ['glass-doors', 'built-ins'] } },
];

const by = <T extends { id: string }>(list: T[], id: string, fallback: T) => list.find((x) => x.id === id) ?? fallback;

export function resolveDesign(d: Design) {
  return {
    style: by(STYLES, d.style, STYLES[0]),
    surround: by(SURROUNDS, d.surround, SURROUNDS[0]),
    mantel: by(MANTELS, d.mantel, MANTELS[0]),
    hearth: by(HEARTHS, d.hearth, HEARTHS[0]),
    fire: by(FIRES, d.fire, FIRES[0]),
    extras: EXTRAS.filter((e) => d.extras.includes(e.id)),
  };
}

/* ---------- URL encoding so a design can be shared or reopened ---------- */

export function encodeDesign(d: Design): string {
  const q = new URLSearchParams({ s: d.style, m: d.surround, t: d.mantel, h: d.hearth, f: d.fire });
  if (d.extras.length) q.set('x', d.extras.join('.'));
  if (d.project) q.set('p', d.project);
  if (d.timeline) q.set('w', String(TIMELINES.indexOf(d.timeline)));
  return q.toString();
}

export function decodeDesign(search: string): Design | null {
  const q = new URLSearchParams(search);
  if (!q.get('s')) return null;
  const pick = <T extends { id: string }>(list: T[], v: string | null, def: string) => (list.some((x) => x.id === v) ? (v as string) : def);
  return {
    style: pick(STYLES, q.get('s'), DEFAULT_DESIGN.style),
    surround: pick(SURROUNDS, q.get('m'), DEFAULT_DESIGN.surround),
    mantel: pick(MANTELS, q.get('t'), DEFAULT_DESIGN.mantel),
    hearth: pick(HEARTHS, q.get('h'), DEFAULT_DESIGN.hearth),
    fire: pick(FIRES, q.get('f'), DEFAULT_DESIGN.fire),
    extras: (q.get('x') ?? '').split('.').filter((x) => EXTRAS.some((e) => e.id === x)),
    project: PROJECT_TYPES.some((p) => p.id === q.get('p')) ? (q.get('p') as string) : undefined,
    timeline: TIMELINES[Number(q.get('w'))] ?? undefined,
  };
}

/** Plain-text summary that goes into the CRM note. */
export function designSummary(d: Design, shareUrl?: string): string {
  const r = resolveDesign(d);
  const lines = [
    'FIREPLACE DESIGN (aesthetic concept, not a quote)',
    `Project: ${PROJECT_TYPES.find((p) => p.id === d.project)?.name ?? 'Not specified'}`,
    `Timeline: ${d.timeline ?? 'Not specified'}`,
    `Style: ${r.style.name}`,
    `Surround: ${r.surround.name}`,
    `Mantel: ${r.mantel.name}`,
    `Hearth: ${r.hearth.name}`,
    `Fire type: ${r.fire.name}`,
    `Extras: ${r.extras.length ? r.extras.map((e) => e.name).join(', ') : 'None'}`,
  ];
  if (shareUrl) lines.push(`Design link: ${shareUrl}`);
  return lines.join('\n');
}
