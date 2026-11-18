/**
 * Service content. Slugs are unchanged from the original site so existing links keep working.
 * Only services that were already on Andrew's site are listed. Do not add services he has not confirmed.
 *
 * `answer` is a 40-70 word direct answer written to be quoted by search and AI assistants.
 * Technical statements follow NFPA 211 and U.S. Fire Administration guidance; see src/data/sources.ts.
 */
import { IMAGES } from '../lib/site';
import { TEAM } from './team';

export type IconName = 'camera' | 'brush' | 'brick' | 'droplet' | 'cap' | 'crown' | 'flame' | 'wind' | 'liner';

export type Service = {
  id: string;
  title: string;
  short: string;
  icon: IconName;
  image: string;
  imageAlt: string;
  headline: string;
  answer: string;
  intro: string;
  signs: string[];
  included: string[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
  metaTitle: string;
  metaDescription: string;
};

export const SERVICES: Service[] = [
  {
    id: 'chimney-inspection',
    title: 'Chimney Inspection',
    short: 'A certified look at the whole system, from firebox to crown, with plain-English findings.',
    icon: 'camera',
    image: TEAM.inspectionRoof.src,
    imageAlt: TEAM.inspectionRoof.alt,
    headline: 'Know exactly what shape your chimney is in.',
    answer:
      'A chimney inspection checks the firebox, damper, smoke chamber, flue liner, crown, cap and flashing for damage, blockages and fire hazards. NFPA 211 recommends an inspection every year, and a more detailed Level 2 inspection when you buy or sell a home, change fuel or appliance, or after a chimney fire or major storm.',
    intro:
      'Most chimney problems stay hidden until they become expensive: a cracked flue tile, a crown that lets water in, creosote that has glazed onto the liner. A First Chimney inspection is performed by a F.I.R.E. Certified Technician, and you get a clear explanation of what we saw and what, if anything, needs attention.',
    signs: [
      'You are buying or selling a home',
      'It has been more than a year since the last inspection',
      'You are switching fuels or adding an insert or stove',
      'There was a chimney fire, lightning strike or storm damage',
      'You see water stains, smoke backing up or crumbling masonry',
    ],
    included: [
      'Firebox, damper and smoke chamber condition',
      'Flue liner check for cracks, gaps and buildup',
      'Exterior masonry, crown, cap and flashing',
      'Clearances to combustibles where accessible',
      'Photo documentation of anything that needs attention',
      'Straight recommendations, prioritized by safety',
    ],
    process: [
      { title: 'Protect the room', body: 'Drop cloths go down around the hearth before any tool comes out.' },
      { title: 'Inside the system', body: 'Firebox, damper, smoke chamber and the flue are checked from below.' },
      { title: 'Outside and up top', body: 'Crown, cap, flashing and masonry are checked where safely accessible.' },
      { title: 'Walk through findings', body: 'We show you what we found and explain your options. No pressure.' },
    ],
    faqs: [
      {
        q: 'What is the difference between a Level 1, 2 and 3 inspection?',
        a: 'NFPA 211 defines three levels. Level 1 covers the readily accessible parts of the chimney and is right for a system with no changes. Level 2 adds accessible attics, crawl spaces and a video scan of the flue, and is recommended at a home sale, fuel or appliance change, or after an event like a chimney fire. Level 3 involves removing parts of the structure and is only done when a hidden hazard is suspected.',
      },
      {
        q: 'How long does an inspection take?',
        a: 'A typical single-flue inspection takes about an hour. Multiple flues, a Level 2 video scan or hard roof access can take longer. We will tell you what to expect when we schedule.',
      },
      {
        q: 'Do I need an inspection if I rarely use my fireplace?',
        a: 'Yes. Animals nest in unused flues, water damage continues whether you burn or not, and a chimney that sits unused for years is often the one that surprises people the first cold night.',
      },
    ],
    related: ['chimney-sweeping', 'leak-repair', 'chimney-crown'],
    metaTitle: 'Chimney Inspection by a F.I.R.E. Certified Technician',
    metaDescription:
      'Chimney inspections in Virginia, New Jersey, Connecticut, Massachusetts and Rhode Island. Firebox to crown, photo-documented findings and plain-English recommendations.',
  },
  {
    id: 'chimney-sweeping',
    title: 'Chimney Cleaning & Sweeping',
    short: 'Creosote and soot removed from the flue, with your living room protected the whole time.',
    icon: 'brush',
    image: TEAM.sweeping.src,
    imageAlt: TEAM.sweeping.alt,
    headline: 'A clean flue burns safer and drafts better.',
    answer:
      'Chimney cleaning removes creosote, soot and debris from the flue, smoke chamber and firebox. Creosote is a flammable byproduct of burning wood, and buildup in the flue is a leading cause of chimney fires. Wood-burning chimneys should be inspected yearly and cleaned when buildup is found, typically once a season for regular use.',
    intro:
      'Every fire leaves something behind. Over a season, soot and creosote coat the inside of the flue and narrow the path your smoke needs to escape. We clean it out completely, protect your room while we do it, and look the system over while we are in there.',
    signs: [
      'A strong campfire smell, especially in humid weather',
      'Black flakes or debris falling into the firebox',
      'Smoke rolling into the room instead of up the flue',
      'Fires that are hard to start or keep burning',
      'It has been a full season of use since the last cleaning',
    ],
    included: [
      'Drop cloths and containment around the hearth',
      'Rotary or brush cleaning of the flue',
      'Smoke chamber and smoke shelf cleaning',
      'Firebox and damper area cleaned out',
      'Visual check of the system while we work',
      'Debris removed from your home',
    ],
    process: [
      { title: 'Set up clean', body: 'Floors and furniture near the fireplace get covered before we start.' },
      { title: 'Brush the flue', body: 'The full flue is brushed to break loose soot and creosote.' },
      { title: 'Clear the chamber', body: 'Smoke chamber, shelf and firebox are cleaned out by hand.' },
      { title: 'Check and report', body: 'We tell you how much buildup there was and anything worth watching.' },
    ],
    faqs: [
      {
        q: 'How often should a chimney be cleaned?',
        a: 'NFPA 211 calls for an annual inspection and cleaning when it is needed. For a fireplace used regularly through the winter, that usually means a cleaning every year. Light use may go longer, which the inspection will tell you.',
      },
      {
        q: 'Will it make a mess in my house?',
        a: 'It should not. We cover the area around the fireplace and contain the debris as we work. Leaving your room as clean as we found it is part of the job.',
      },
      {
        q: 'Can you clean a gas fireplace or wood stove flue?',
        a: 'Gas appliances produce far less soot but their vents still need checking for blockages and corrosion. Wood stove and insert flues can be cleaned too. Tell us what you have when you book.',
      },
    ],
    related: ['chimney-inspection', 'fireplace-repair', 'chimney-cap'],
    metaTitle: 'Chimney Cleaning & Sweeping',
    metaDescription:
      'Professional chimney cleaning that removes creosote and soot, protects your home and leaves you with a clear picture of your chimney. VA, NJ, CT, MA and RI.',
  },
  {
    id: 'chimney-relining',
    title: 'Chimney Relining',
    short: 'Stainless steel liners for damaged flues, inserts and appliance changes.',
    icon: 'liner',
    image: TEAM.liner.src,
    imageAlt: TEAM.liner.alt,
    headline: 'A sound liner is what keeps the fire inside the chimney.',
    answer:
      'A chimney liner is the protective channel inside the chimney that contains heat, smoke and combustion gases and carries them safely outside. Cracked or missing clay tile liners can let heat and gases reach the masonry and the house framing. Relining installs a new liner, usually stainless steel, sized to the fireplace, insert, stove or heating appliance it serves.',
    intro:
      'Most homeowners never see their chimney liner, but it does the most important job in the system. Clay tiles crack with age, after a chimney fire or from years of acidic condensation, and a new insert or furnace almost always needs a liner sized to it. Andrew inspects the flue first and tells you plainly whether it can be repaired or needs relining.',
    signs: [
      'An inspection found cracked, shifted or missing flue tiles',
      'You are adding a wood or gas insert or a new stove',
      'You replaced your furnace or water heater and it vents into the chimney',
      'There was a chimney fire',
      'Flakes of tile or mortar falling into the firebox',
    ],
    included: [
      'Flue inspection, including a camera look where needed',
      'Liner sized to the appliance it serves',
      'Stainless steel liner installation from appliance to chimney top',
      'Top plate and cap to finish the termination',
      'Connection to the insert, stove or appliance',
      'A plain-English walkthrough of what was done',
    ],
    process: [
      { title: 'Inspect the flue', body: 'We find out what shape the existing liner is in and why.' },
      { title: 'Size it right', body: 'The liner is sized to the appliance, not just the chimney.' },
      { title: 'Install and connect', body: 'New liner run top to bottom, connected and capped.' },
      { title: 'Verify', body: 'We check draft and connections before we leave.' },
    ],
    faqs: [
      {
        q: 'Does my fireplace insert need a liner?',
        a: 'Almost always. Wood and gas inserts need a liner sized to the unit that runs from the insert to the top of the chimney. It is what makes the insert draft properly and safely.',
      },
      {
        q: 'Can a cracked clay liner be repaired instead of replaced?',
        a: 'Sometimes. Minor damage can occasionally be repaired, but widespread cracking or an appliance change usually calls for a new stainless steel liner. The inspection tells you which.',
      },
    ],
    related: ['chimney-inspection', 'fireplace-repair', 'chimney-cap'],
    metaTitle: 'Chimney Relining: Stainless Steel Chimney Liners',
    metaDescription:
      'Chimney relining with stainless steel liners for cracked flues, fireplace inserts, stoves and furnace changes. Serving VA, NJ, CT, MA and RI.',
  },
  {
    id: 'masonry-rebuilds',
    title: 'Masonry Repair & Rebuilds',
    short: 'Tuckpointing, brick replacement and partial or full rebuilds above the roofline.',
    icon: 'brick',
    image: TEAM.rebuild.src,
    imageAlt: TEAM.rebuild.alt,
    headline: 'Brick and mortar that stand up to real weather.',
    answer:
      'Chimney masonry repair restores mortar joints (tuckpointing), replaces cracked or spalling brick, and rebuilds sections that have become loose or unsafe. Water is the main cause of masonry damage: it soaks into brick and mortar, freezes, expands and breaks the material apart. Fixing it early usually costs far less than a rebuild.',
    intro:
      'The part of your chimney above the roof takes more weather than any other part of the house. When mortar washes out and bricks start to flake, water gets in faster every season. We repair what can be repaired and rebuild what cannot, so the chimney is solid again.',
    signs: [
      'Mortar joints that are recessed, sandy or missing',
      'Brick faces flaking or popping off (spalling)',
      'White staining on the brick (efflorescence)',
      'A chimney that leans or has loose top courses',
      'Pieces of brick or mortar on the roof or ground',
    ],
    included: [
      'Tuckpointing and mortar joint restoration',
      'Damaged brick removal and replacement',
      'Partial rebuilds of the top courses',
      'Full rebuilds above the roofline when needed',
      'Crown work to finish the repair',
      'Recommendations to keep water out afterward',
    ],
    process: [
      { title: 'Assess', body: 'We find where the damage starts and how far it goes.' },
      { title: 'Quote in writing', body: 'You get a clear scope and price before work begins.' },
      { title: 'Repair or rebuild', body: 'Mortar, brick and crown work done to last, not to patch.' },
      { title: 'Protect it', body: 'We finish by addressing how water was getting in.' },
    ],
    faqs: [
      {
        q: 'Can you match my existing brick?',
        a: 'We work to match brick and mortar color and texture as closely as available materials allow. On older homes an exact match is not always possible, and we will show you options before we start.',
      },
      {
        q: 'Do I need a full rebuild?',
        a: 'Often not. Many chimneys only need repointing and a few replacement bricks. A rebuild is recommended when the structure is loose, leaning or the damage is too widespread to repair safely.',
      },
    ],
    related: ['chimney-crown', 'leak-repair', 'chimney-inspection'],
    metaTitle: 'Chimney Masonry Repair, Tuckpointing & Rebuilds',
    metaDescription:
      'Chimney tuckpointing, brick replacement and rebuilds that last. Written quotes before work begins. Serving VA, NJ, CT, MA and RI.',
  },
  {
    id: 'leak-repair',
    title: 'Leak Repair & Waterproofing',
    short: 'We find where water gets in, fix it at the source and help keep it out.',
    icon: 'droplet',
    image: TEAM.roofProtection.src,
    imageAlt: TEAM.roofProtection.alt,
    headline: 'Stop the leak where it starts.',
    answer:
      'Chimney leaks usually come from one of four places: failed flashing where the chimney meets the roof, a cracked crown, a missing or damaged cap, or porous brick and mortar. Repair means finding the actual entry point first, then fixing flashing, sealing or rebuilding the crown, installing a cap, or applying a breathable masonry water repellent.',
    intro:
      'A stain on the ceiling next to the chimney is rarely the end of the story. Water travels, and the spot you see inside is often far from where it gets in. We trace the leak to its source before recommending a fix, so you are not paying for guesses.',
    signs: [
      'Water stains on ceilings or walls near the chimney',
      'Dripping or damp smell in the firebox after rain',
      'Rust on the damper or firebox components',
      'Peeling paint or wallpaper near the chimney',
      'Flashing that is lifted, rusted or caulked over',
    ],
    included: [
      'Leak source investigation',
      'Flashing repair or replacement',
      'Crown sealing or rebuild',
      'Chimney cap installation',
      'Breathable masonry waterproofing',
      'Clear explanation of what failed and why',
    ],
    process: [
      { title: 'Trace it', body: 'Inside and outside checks to find the true entry point.' },
      { title: 'Explain it', body: 'We show you what failed, with photos, before we fix anything.' },
      { title: 'Fix the source', body: 'Flashing, crown, cap or masonry, whichever is the cause.' },
      { title: 'Seal it up', body: 'Waterproofing where it helps, so the repair lasts longer.' },
    ],
    faqs: [
      {
        q: 'Is chimney waterproofing the same as sealing with paint or caulk?',
        a: 'No. Masonry needs a breathable water repellent that keeps rain out but lets moisture vapor escape. Paint and non-breathable sealers can trap water inside the brick and make freeze damage worse.',
      },
      {
        q: 'Should a roofer or a chimney company fix flashing?',
        a: 'Either can, but chimney flashing ties into the masonry. Working on both sides of the joint means the flashing and the brick are addressed together, which is where many repeat leaks come from.',
      },
    ],
    related: ['chimney-crown', 'chimney-cap', 'masonry-rebuilds'],
    metaTitle: 'Chimney Leak Repair, Flashing & Waterproofing',
    metaDescription:
      'Chimney leak repair that finds the real source: flashing, crown, cap or masonry. Breathable waterproofing. Serving VA, NJ, CT, MA and RI.',
  },
  {
    id: 'chimney-cap',
    title: 'Chimney Caps & Chase Covers',
    short: 'Keep rain, animals and debris out of the flue with a properly fitted cap.',
    icon: 'cap',
    image: TEAM.capCrown.src,
    imageAlt: TEAM.capCrown.alt,
    headline: 'The cheapest protection your chimney can have.',
    answer:
      'A chimney cap is a metal cover with mesh sides that sits over the flue opening. It keeps rain, birds, raccoons, leaves and debris out of the chimney and helps stop sparks from landing on the roof. A chase cover does the same job for the top of a framed (factory-built) chimney chase.',
    intro:
      'An open flue is an invitation to rain, nesting animals and wet leaves. A well-fitted cap costs little compared to the damage it prevents, and on factory-built chimneys a rusted chase cover is one of the most common leak sources we see.',
    signs: [
      'No cap on top of the flue',
      'Birds or animal noises in the chimney',
      'Water in the firebox after rain',
      'A rusted or sagging metal chase cover',
      'Leaves or debris falling into the fireplace',
    ],
    included: [
      'Measurement of the flue or chase top',
      'Cap or cover sized to your chimney',
      'Secure installation',
      'Check of the crown underneath while we are up there',
    ],
    process: [
      { title: 'Measure', body: 'Flue tile or chase dimensions measured on site.' },
      { title: 'Match the fit', body: 'Cap or chase cover sized to your chimney.' },
      { title: 'Install', body: 'Secured so it stays put through wind and storms.' },
    ],
    faqs: [
      {
        q: 'Does a chimney cap affect draft?',
        a: 'A correctly sized cap should not hurt draft and can help by blocking wind from pushing down the flue. The mesh does need to stay clear, so it is checked during regular inspections.',
      },
    ],
    related: ['leak-repair', 'chimney-crown', 'chimney-inspection'],
    metaTitle: 'Chimney Cap & Chase Cover Installation',
    metaDescription:
      'Chimney caps and chase covers that keep rain, animals and debris out. Measured and installed to fit. Serving VA, NJ, CT, MA and RI.',
  },
  {
    id: 'chimney-crown',
    title: 'Chimney Crown Repair',
    short: 'Seal or rebuild the cement crown that sheds water off the top of your chimney.',
    icon: 'crown',
    image: TEAM.crown.src,
    imageAlt: TEAM.crown.alt,
    headline: 'A cracked crown lets water straight in.',
    answer:
      'The chimney crown is the cement slab that covers the top of a masonry chimney around the flue. It sheds rain away from the brick. Small cracks can be sealed with a crown coating, but a crown that is crumbling, too flat or built from regular mortar usually needs to be rebuilt to stop water from soaking into the chimney.',
    intro:
      'You cannot see it from the ground, so the crown is easy to forget. But it is the roof of your chimney, and when it cracks, water goes straight into the masonry and the flue. We repair small problems before they grow and rebuild crowns that are past saving.',
    signs: [
      'Cracks across the top of the chimney',
      'Pieces of cement on the roof',
      'Spalling brick on the top courses',
      'Water in the firebox or leaks near the chimney',
    ],
    included: [
      'Crown crack sealing',
      'Crown rebuild with proper slope and overhang',
      'Check of the cap and flue tiles at the same time',
    ],
    process: [
      { title: 'Inspect', body: 'We check the crown, flue tiles and top courses together.' },
      { title: 'Seal or rebuild', body: 'Sealant for hairline cracks, rebuild for failing crowns.' },
      { title: 'Finish', body: 'Correct slope and overhang so water runs off and away.' },
    ],
    faqs: [
      {
        q: 'Can a cracked crown be repaired, or does it need replacing?',
        a: 'Hairline cracks can usually be sealed. Wide cracks, missing pieces, or a crown made from thin mortar instead of a proper crown mix are better rebuilt.',
      },
    ],
    related: ['leak-repair', 'chimney-cap', 'masonry-rebuilds'],
    metaTitle: 'Chimney Crown Repair & Rebuilds',
    metaDescription:
      'Chimney crown sealing and rebuilds to stop water at the top of your chimney. Serving Virginia, New Jersey, Connecticut, Massachusetts and Rhode Island.',
  },
  {
    id: 'fireplace-repair',
    title: 'Fireplace Repair',
    short: 'Firebox, damper and draft problems fixed so your fireplace works the way it should.',
    icon: 'flame',
    image: IMAGES.fireboxBrush,
    imageAlt: 'Brick firebox being serviced with a brush',
    headline: 'A fireplace you can actually enjoy.',
    answer:
      'Fireplace repair covers the parts you use every time you light a fire: the firebox walls and joints, the damper, the smoke chamber and the hearth. Cracked firebricks, a stuck or rusted damper, and smoke spilling into the room are the most common problems, and most are repairable without replacing the fireplace.',
    intro:
      'Smoke in the room, a damper that will not close, gaps in the firebrick. These are the problems that make people stop using their fireplace. We diagnose why it is happening and repair the fireplace so it is safe to use again.',
    signs: [
      'Smoke coming into the room',
      'Damper that sticks, will not seal or is rusted through',
      'Cracked, loose or missing firebrick',
      'Gaps in the mortar joints inside the firebox',
      'Drafts or cold air coming down the chimney',
    ],
    included: [
      'Firebox and firebrick repair',
      'Damper repair or replacement',
      'Smoke and draft troubleshooting',
      'Hearth and surround repairs',
      'A test fire check after work where appropriate',
    ],
    process: [
      { title: 'Diagnose', body: 'We find out why the fireplace is misbehaving.' },
      { title: 'Quote', body: 'Clear options with prices before any work.' },
      { title: 'Repair', body: 'Firebox, damper or draft fixes done properly.' },
      { title: 'Verify', body: 'We confirm the fix before we leave.' },
    ],
    faqs: [
      {
        q: 'Why does my fireplace smoke into the room?',
        a: 'Common causes include a dirty or blocked flue, a damper that is not fully open, a chimney that is too short for the house, or a house that is too airtight for the fire to draw. Cracking a window can tell you a lot. An inspection finds the actual cause.',
      },
      {
        q: 'Can you help me redesign my fireplace?',
        a: 'Yes. Try our Build Your Fireplace tool to explore styles and finishes, then send your design to us for a consultation.',
      },
    ],
    related: ['chimney-sweeping', 'chimney-inspection', 'masonry-rebuilds'],
    metaTitle: 'Fireplace Repair: Firebox, Damper & Draft',
    metaDescription:
      'Fireplace repair for smoke problems, damaged firebrick and broken dampers. Serving Virginia, New Jersey, Connecticut, Massachusetts and Rhode Island.',
  },
  {
    id: 'dryer-vent-cleaning',
    title: 'Dryer Vent Cleaning',
    short: 'Clear lint from the full vent run to cut fire risk and drying time.',
    icon: 'wind',
    image: IMAGES.dropCloths,
    imageAlt: 'Service equipment and drop cloths set up inside a home',
    headline: 'Lint in the vent is fuel waiting for heat.',
    answer:
      'Dryer vent cleaning removes lint and blockages from the duct that runs from your dryer to the outside. The U.S. Fire Administration reports that failure to clean is the leading cause of home clothes dryer fires. Signs you need it: clothes taking more than one cycle to dry, a hot laundry room, or a burning smell.',
    intro:
      'The lint trap catches most lint, not all of it. The rest builds up inside the vent, where heat and airflow problems make it a fire risk and make every load take longer. We clear the full run, from the back of the dryer to the outside hood.',
    signs: [
      'Clothes taking two cycles or longer to dry',
      'Dryer or laundry room getting unusually hot',
      'A burning smell while the dryer runs',
      'Lint around the outside vent hood',
      'It has been over a year since the vent was cleaned',
    ],
    included: [
      'Full-length duct cleaning',
      'Outside vent hood cleared',
      'Airflow check after cleaning',
      'Notes on any crushed or damaged duct',
    ],
    process: [
      { title: 'Disconnect', body: 'The dryer is pulled out and the duct disconnected carefully.' },
      { title: 'Clear the run', body: 'Lint is removed from the full length to the outside.' },
      { title: 'Reconnect and test', body: 'Everything goes back together and airflow is checked.' },
    ],
    faqs: [
      {
        q: 'How often should a dryer vent be cleaned?',
        a: 'At least once a year for most households, more often for large families or long vent runs.',
      },
    ],
    related: ['chimney-sweeping', 'chimney-inspection'],
    metaTitle: 'Dryer Vent Cleaning',
    metaDescription:
      'Dryer vent cleaning that clears the full duct to reduce fire risk and shorten drying times. Serving VA, NJ, CT, MA and RI.',
  },
];

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);
