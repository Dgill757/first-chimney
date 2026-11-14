/**
 * Service areas.
 *
 * STATES are confirmed by Andrew: VA, NJ, CT, MA.
 *
 * CITIES ARE INTENTIONALLY EMPTY. A city page is only generated when its entry
 * has `published: true`, and an entry should only be added once Andrew confirms
 * he regularly serves that town. Each city needs its own `intro`, `localNotes`
 * and `faqs`; the build refuses to publish a city with missing content, which
 * prevents thin, copy-paste "doorway" pages.
 *
 * To add a city: copy the example in docs/SERVICE-AREAS.md into the right
 * state's `cities` array, write the unique content, set published: true, push.
 */
import type { StateCode } from '../lib/site';

export type City = {
  slug: string;
  name: string;
  county?: string;
  published: boolean;
  intro: string;
  localNotes: string[];
  faqs: { q: string; a: string }[];
};

export type StateArea = {
  code: StateCode;
  name: string;
  slug: string;
  headline: string;
  intro: string;
  climate: string;
  housing: string;
  watchFor: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  cities: City[];
};

export const SERVICE_AREAS: StateArea[] = [
  {
    code: 'VA',
    name: 'Virginia',
    slug: 'virginia',
    headline: 'Chimney service for Virginia homes',
    intro:
      'Virginia chimneys deal with a little of everything: humid summers, real winter freezes, and coastal storms that drive rain sideways into flashing and crowns. First Chimney inspects, cleans and repairs chimneys and fireplaces for Virginia homeowners, with clear findings and no pressure.',
    climate:
      'Long, humid summers followed by winters that swing above and below freezing. That freeze-thaw cycle is hard on brick and mortar, and heavy rain from coastal storms finds any gap in flashing or a cracked crown.',
    housing:
      'A wide mix of masonry fireplaces in older brick homes and factory-built (prefab) fireplaces in newer construction. Both need regular inspection, but they fail in different ways: masonry tends to crack and leak, prefab units rust and wear out their chase covers.',
    watchFor: [
      { title: 'Summer chimney odor', body: 'Humidity pulls creosote smell into the house in July and August. Cleaning and a cap with a good damper seal usually solve it.' },
      { title: 'Storm-driven leaks', body: 'Wind-driven rain tests flashing and crowns. Water stains near the chimney after a storm are worth a look before the next one.' },
      { title: 'Rusted chase covers', body: 'On prefab chimneys, a flat or rusted chase top is one of the most common leak sources.' },
    ],
    faqs: [
      { q: 'When should Virginia homeowners book chimney service?', a: 'Late summer and early fall are ideal. You beat the rush, and any repairs can be done before the first fires of the season.' },
      { q: 'Do you serve all of Virginia?', a: 'Call or text us with your address and we will confirm whether you are in our current service area before booking.' },
    ],
    cities: [],
  },
  {
    code: 'NJ',
    name: 'New Jersey',
    slug: 'new-jersey',
    headline: 'Chimney service for New Jersey homes',
    intro:
      'New Jersey has some of the oldest and densest housing in the country, and plenty of chimneys that have been working for the better part of a century. First Chimney helps New Jersey homeowners keep fireplaces and chimneys safe, dry and ready for winter.',
    climate:
      'Cold, wet winters with frequent freeze-thaw cycles and strong coastal storms. Moisture that gets into masonry in the fall expands when it freezes, which is how small cracks turn into spalling brick by spring.',
    housing:
      'Many older homes have masonry chimneys that also vent a furnace or boiler. When heating equipment is replaced, the flue often needs to be checked or relined so it matches the new appliance. Older clay tile liners can also crack with age.',
    watchFor: [
      { title: 'Shared furnace flues', body: 'If your chimney vents a furnace or water heater, an inspection after any equipment change is important for safe venting.' },
      { title: 'Freeze-thaw damage', body: 'Crumbling mortar and flaking brick on the top courses are the first signs. Early repointing is far cheaper than a rebuild.' },
      { title: 'Nor\'easter leaks', body: 'Hard, wind-driven rain exposes weak flashing. Leaks that only appear in big storms usually point to flashing or the crown.' },
    ],
    faqs: [
      { q: 'My chimney vents my furnace. Does it still need service?', a: 'Yes. Gas and oil appliances produce acidic condensation that can deteriorate a liner over time. Annual inspection is recommended for all chimneys and vents.' },
      { q: 'Do you serve all of New Jersey?', a: 'Call or text with your address and we will confirm coverage before we schedule.' },
    ],
    cities: [],
  },
  {
    code: 'CT',
    name: 'Connecticut',
    slug: 'connecticut',
    headline: 'Chimney service for Connecticut homes',
    intro:
      'From colonial-era center chimneys to newer prefab fireplaces, Connecticut homes ask a lot of their chimneys, and Connecticut winters make sure every weakness shows. First Chimney inspects, cleans and repairs chimneys for Connecticut homeowners.',
    climate:
      'Real New England winters: long stretches below freezing, snow sitting against masonry, and ice that works into every crack. Spring thaw is when a lot of chimney damage becomes visible.',
    housing:
      'A deep stock of older homes, including large masonry chimneys with multiple flues, alongside wood stoves and inserts that see heavy use through the winter.',
    watchFor: [
      { title: 'Heavy wood stove use', body: 'Stoves and inserts burned all winter build creosote quickly. Mid-season checks can make sense for heavy burners.' },
      { title: 'Multi-flue chimneys', body: 'Older center chimneys often have several flues serving different appliances. Each one needs to be checked.' },
      { title: 'Snow and ice damage', body: 'Snow load and ice around the chimney base stress flashing and the roof joint.' },
    ],
    faqs: [
      { q: 'How often should a wood stove chimney be cleaned in Connecticut?', a: 'At least once a year, and more often if you burn daily through the winter. The inspection tells you how fast buildup is forming in your system.' },
      { q: 'Do you serve all of Connecticut?', a: 'Call or text with your address and we will confirm coverage before we schedule.' },
    ],
    cities: [],
  },
  {
    code: 'MA',
    name: 'Massachusetts',
    slug: 'massachusetts',
    headline: 'Chimney service for Massachusetts homes',
    intro:
      'Massachusetts has some of the oldest homes in America and some of the hardest winters on masonry. First Chimney helps Massachusetts homeowners keep their chimneys sound, their fireplaces safe and their families warm.',
    climate:
      'Cold winters, nor\'easters and repeated freeze-thaw cycles. Ice dams and wind-driven snow put extra pressure on flashing and the roof-to-chimney joint.',
    housing:
      'Antique and century-old homes with original masonry chimneys sit alongside modern construction with factory-built fireplaces. Older chimneys may lack liners or have liners that have cracked with age.',
    watchFor: [
      { title: 'Older or missing liners', body: 'Many older chimneys were built without a modern liner or have cracked clay tiles. An inspection tells you where you stand.' },
      { title: 'Ice dam season', body: 'Ice building up around the chimney base can force water under flashing. Leaks during thaws are a common sign.' },
      { title: 'Masonry wear on historic homes', body: 'Old mortar is often softer than modern mixes. Repairs should be compatible with the original masonry.' },
    ],
    faqs: [
      { q: 'Can you work on an antique chimney?', a: 'Yes. On older chimneys we focus on compatible repairs that respect the original masonry. If a specialist is needed for historic restoration, we will tell you.' },
      { q: 'Do you serve all of Massachusetts?', a: 'Call or text with your address and we will confirm coverage before we schedule.' },
    ],
    cities: [],
  },
];

export const stateBySlug = (slug: string) => SERVICE_AREAS.find((s) => s.slug === slug);

/** A city is only rendered and listed if it is published AND has real content. */
export function isPublishableCity(c: City): boolean {
  return c.published && c.intro.length >= 200 && c.localNotes.length >= 2 && c.faqs.length >= 2;
}

export const publishedCities = (s: StateArea) => s.cities.filter(isPublishableCity);
