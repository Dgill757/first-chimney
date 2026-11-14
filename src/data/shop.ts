/**
 * Fireplace Shop: INQUIRY-ONLY preview catalog.
 *
 * Status: preview. First Chimney has not yet confirmed which brands, models or
 * suppliers it carries, so products are described by type, never by brand or
 * model number, and no prices are shown. Every product page says so, and every
 * "add" puts the item on a quote request, not in a cart. No checkout or payment.
 *
 * When Andrew confirms suppliers: add `brand`, `model`, `specs` and real photos
 * per product, flip CATALOG_STATUS to 'confirmed', and update the disclaimers.
 */
import type { Design } from './designer';

export const CATALOG_STATUS: 'preview' | 'confirmed' = 'preview';

export type ShopCategory = {
  id: string;
  name: string;
  blurb: string;
  /** Design preset used to draw the category art in SVG. */
  art: Design;
};

export type Product = {
  id: string;
  category: string;
  name: string;
  summary: string;
  bestFor: string;
  features: string[];
  considerations: string[];
  art: Design;
};

const d = (style: string, surround: string, mantel: string, hearth: string, fire: string, extras: string[] = []): Design => ({ style, surround, mantel, hearth, fire, extras });

export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: 'wood-inserts', name: 'Wood Inserts', blurb: 'Turn a drafty open fireplace into an efficient heater.', art: d('traditional', 'red-brick', 'oak-beam', 'raised-stone', 'wood-insert') },
  { id: 'gas-fireplaces', name: 'Gas Inserts & Log Sets', blurb: 'Real flame with the convenience of a switch or remote.', art: d('transitional', 'whitewash-brick', 'white-shelf', 'bluestone', 'gas-logs') },
  { id: 'electric-fireplaces', name: 'Electric Fireplaces', blurb: 'No venting, no gas line. Install almost anywhere.', art: d('modern', 'concrete-tile', 'walnut-float', 'flush-slate', 'electric') },
  { id: 'mantels-surrounds', name: 'Mantels & Surrounds', blurb: 'Change the whole look of the room without touching the firebox.', art: d('farmhouse', 'ledgestone', 'oak-beam', 'raised-stone', 'open-wood') },
  { id: 'doors-screens', name: 'Glass Doors & Screens', blurb: 'Safety and efficiency for open wood-burning fireplaces.', art: d('traditional', 'charcoal-brick', 'stone-mantel', 'flush-slate', 'open-wood', ['glass-doors']) },
  { id: 'caps-dampers', name: 'Caps, Covers & Dampers', blurb: 'The parts that keep weather, animals and drafts out.', art: d('transitional', 'red-brick', 'none', 'brick-hearth', 'open-wood', ['chimney-cap']) },
];

export const PRODUCTS: Product[] = [
  {
    id: 'high-efficiency-wood-insert', category: 'wood-inserts', name: 'High-Efficiency Wood Insert',
    summary: 'A closed steel or cast-iron firebox that slides into your existing masonry fireplace and pushes heat into the room.',
    bestFor: 'Homeowners who burn wood often and want real heat from their fireplace.',
    features: ['Glass door with air-wash to keep the view clear', 'Blower options to circulate warm air', 'Far more heat and less wood than an open fireplace', 'Choice of surround panels and finishes'],
    considerations: ['Requires a stainless steel liner sized to the unit', 'Firebox opening must be measured on site', 'EPA-certified models only'],
    art: d('traditional', 'red-brick', 'oak-beam', 'raised-stone', 'wood-insert'),
  },
  {
    id: 'compact-wood-insert', category: 'wood-inserts', name: 'Compact Wood Insert',
    summary: 'A smaller insert sized for shallow or narrow fireplace openings.',
    bestFor: 'Older or smaller fireplaces where a standard insert will not fit.',
    features: ['Fits tighter openings', 'Steady heat for a single room', 'Clean-burning modern design'],
    considerations: ['Lower heat output than full-size inserts', 'Liner and on-site measurement required'],
    art: d('transitional', 'charcoal-brick', 'white-shelf', 'flush-slate', 'wood-insert'),
  },
  {
    id: 'gas-insert', category: 'gas-fireplaces', name: 'Direct-Vent Gas Insert',
    summary: 'A sealed gas firebox that installs in an existing fireplace and vents through the chimney with a liner kit.',
    bestFor: 'Anyone who wants fire with no wood, ash or creosote.',
    features: ['Remote or wall-switch ignition', 'Sealed glass front for efficiency', 'Log, stone or glass media options', 'Thermostat control on many models'],
    considerations: ['Needs a gas line run by a licensed professional', 'Venting kit through the existing flue', 'Annual service is still recommended'],
    art: d('transitional', 'whitewash-brick', 'white-shelf', 'bluestone', 'gas-logs', ['glass-doors']),
  },
  {
    id: 'gas-log-set', category: 'gas-fireplaces', name: 'Gas Log Set',
    summary: 'Realistic ceramic logs and a burner that sit in your existing open fireplace.',
    bestFor: 'Mostly decorative fires with the look of wood and none of the work.',
    features: ['Quick on and off', 'Realistic log and ember detail', 'Vented and vent-free configurations exist'],
    considerations: ['Vented sets need the damper open and a sound chimney', 'Not a primary heat source', 'Gas line required'],
    art: d('traditional', 'red-brick', 'stone-mantel', 'raised-stone', 'gas-logs'),
  },
  {
    id: 'linear-gas-fireplace', category: 'gas-fireplaces', name: 'Linear Gas Fireplace',
    summary: 'A wide, contemporary gas fireplace with a ribbon of flame over glass or stone media.',
    bestFor: 'Modern rooms and new wall builds.',
    features: ['Long, clean flame line', 'Glass, stone or driftwood media', 'Built into a new wall or chase'],
    considerations: ['Usually requires framing and finish work', 'Venting route planned on site', 'Gas line required'],
    art: d('modern', 'concrete-tile', 'walnut-float', 'flush-slate', 'linear-gas'),
  },
  {
    id: 'electric-linear', category: 'electric-fireplaces', name: 'Built-In Electric Fireplace',
    summary: 'A wall-mounted or recessed electric unit with a realistic flame effect and optional heat.',
    bestFor: 'Bedrooms, basements, condos and anywhere venting is not possible.',
    features: ['No chimney, vent or gas line', 'Flame effect with or without heat', 'Recessed or surface mount'],
    considerations: ['Needs an outlet or dedicated circuit', 'Heat output is supplemental'],
    art: d('modern', 'limewash', 'walnut-float', 'flush-slate', 'electric', ['built-ins']),
  },
  {
    id: 'electric-insert', category: 'electric-fireplaces', name: 'Electric Fireplace Insert',
    summary: 'An electric firebox that slides into an unused masonry fireplace.',
    bestFor: 'Retiring a fireplace you no longer want to burn wood in.',
    features: ['Plugs in, no venting', 'Instant ambiance', 'Fits standard openings'],
    considerations: ['Chimney should be capped or sealed above', 'Outlet needed near the fireplace'],
    art: d('transitional', 'whitewash-brick', 'white-shelf', 'raised-stone', 'electric'),
  },
  {
    id: 'beam-mantel', category: 'mantels-surrounds', name: 'Rustic Beam Mantel',
    summary: 'A solid timber-look beam mounted above the opening.',
    bestFor: 'Farmhouse, cabin and transitional rooms.',
    features: ['Multiple lengths and finishes', 'Concealed mounting', 'Pairs with brick or stone'],
    considerations: ['Clearance to the firebox opening must meet code', 'Mounting depends on what is behind the surround'],
    art: d('farmhouse', 'fieldstone', 'oak-beam', 'raised-stone', 'open-wood'),
  },
  {
    id: 'stone-veneer-surround', category: 'mantels-surrounds', name: 'Stone Veneer Surround',
    summary: 'Stacked or natural stone applied over your existing fireplace face.',
    bestFor: 'A dated brick or tile fireplace that needs a new look.',
    features: ['Ledgestone, fieldstone and more', 'Floor-to-ceiling or surround only', 'Big visual change, no new firebox'],
    considerations: ['Existing surface must be assessed first', 'Non-combustible materials near the opening'],
    art: d('farmhouse', 'ledgestone', 'none', 'raised-stone', 'open-wood'),
  },
  {
    id: 'glass-door-set', category: 'doors-screens', name: 'Fireplace Glass Doors',
    summary: 'Framed tempered glass doors custom fit to your opening.',
    bestFor: 'Open wood-burning fireplaces.',
    features: ['Keeps embers in', 'Reduces warm-air loss up the flue when not in use', 'Several frame finishes'],
    considerations: ['Measured to your exact opening', 'Doors are usually kept open or vented while burning per the maker'],
    art: d('traditional', 'charcoal-brick', 'stone-mantel', 'flush-slate', 'open-wood', ['glass-doors']),
  },
  {
    id: 'mesh-screen', category: 'doors-screens', name: 'Spark Screen',
    summary: 'A freestanding or mounted mesh screen for open fires.',
    bestFor: 'Families with kids and pets around the hearth.',
    features: ['Stops popping embers', 'Freestanding or attached', 'Simple and affordable'],
    considerations: ['Sized to the opening'],
    art: d('traditional', 'red-brick', 'oak-beam', 'brick-hearth', 'open-wood', ['screen']),
  },
  {
    id: 'stainless-chimney-cap', category: 'caps-dampers', name: 'Stainless Chimney Cap',
    summary: 'A mesh-sided cap that covers the flue opening.',
    bestFor: 'Every chimney without one.',
    features: ['Keeps rain and animals out', 'Spark arrestor mesh', 'Single and multi-flue sizes'],
    considerations: ['Measured to your flue tile or crown'],
    art: d('transitional', 'red-brick', 'none', 'brick-hearth', 'open-wood', ['chimney-cap']),
  },
  {
    id: 'top-sealing-damper', category: 'caps-dampers', name: 'Top-Sealing Damper',
    summary: 'A damper at the top of the chimney that seals tight when the fireplace is not in use.',
    bestFor: 'Drafty fireplaces and rusted throat dampers.',
    features: ['Tighter seal than most throat dampers', 'Operated by a cable in the firebox', 'Often doubles as a cap'],
    considerations: ['Flue size and crown condition checked first'],
    art: d('traditional', 'red-brick', 'white-shelf', 'raised-stone', 'open-wood', ['chimney-cap']),
  },
  {
    id: 'stainless-chase-cover', category: 'caps-dampers', name: 'Stainless Chase Cover',
    summary: 'A custom-fit metal top for factory-built chimney chases.',
    bestFor: 'Prefab chimneys with a rusted or flat chase top.',
    features: ['Sloped to shed water', 'Custom sized', 'Stops a very common leak source'],
    considerations: ['Measured on site'],
    art: d('modern', 'concrete-tile', 'none', 'flush-slate', 'gas-logs', ['chimney-cap']),
  },
];

export const categoryById = (id: string) => SHOP_CATEGORIES.find((c) => c.id === id);
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productsIn = (cat: string) => PRODUCTS.filter((p) => p.category === cat);
