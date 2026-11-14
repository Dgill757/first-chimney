/**
 * Resource Center articles. A small library of genuinely useful pieces, not a content farm.
 * Original slugs from the first site are kept so existing links keep working.
 * Authored as the company (no invented personal anecdotes or project stories).
 */
import { IMAGES } from '../lib/site';
import type { SourceId } from './sources';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: 'Inspections' | 'Maintenance' | 'Safety' | 'Repairs' | 'Seasonal';
  datePublished: string;
  dateModified: string;
  readMinutes: number;
  image: string;
  imageAlt: string;
  takeaways: string[];
  body: Block[];
  sources: SourceId[];
  relatedServices: string[];
  cta: 'holiday' | 'inspection' | 'repair';
};

export const ARTICLES: Article[] = [
  {
    slug: 'how-often-should-you-sweep-your-chimney',
    title: 'How Often Should You Have Your Chimney Inspected and Cleaned?',
    description:
      'The short answer is an inspection every year and a cleaning when buildup calls for it. Here is how to know which applies to your fireplace.',
    category: 'Maintenance',
    datePublished: '2026-01-12',
    dateModified: '2026-11-14',
    readMinutes: 5,
    image: IMAGES.sweepRotary,
    imageAlt: 'Chimney sweep using a rotary cleaning system at a fireplace',
    takeaways: [
      'NFPA 211 recommends having chimneys, fireplaces and vents inspected at least once a year.',
      'Cleaning is done when the inspection finds buildup, which for regular wood burners is usually every season.',
      'Heavy wood stove users may need cleaning more than once a winter.',
      'Unused chimneys still need inspection because water and animals do damage either way.',
    ],
    body: [
      { type: 'p', text: 'People ask how often to "sweep" a chimney, but the better question is how often to have it inspected. Cleaning is the fix. Inspection is how you know whether you need it, and whether anything else is wrong.' },
      { type: 'h2', text: 'The standard: inspect every year' },
      { type: 'p', text: 'NFPA 211, the national fire safety standard for chimneys, fireplaces and vents, calls for chimneys to be inspected at least once a year, and cleaned, maintained and repaired as needed. The U.S. Fire Administration gives homeowners the same advice: have your chimney inspected and cleaned annually by a professional.' },
      { type: 'h2', text: 'When cleaning is needed' },
      { type: 'p', text: 'Every wood fire leaves soot and creosote on the inside of the flue. How fast it builds depends on how often you burn, what you burn and how hot your fires run. As a rough guide:' },
      { type: 'list', items: [
        'Occasional fires a few weekends a year: inspection yearly, cleaning when buildup is found.',
        'Regular winter use of an open fireplace: plan on a cleaning every year.',
        'A wood stove or insert running most days: you may need cleaning more than once a season.',
        'Gas fireplaces: very little soot, but the vent and components still need a yearly check.',
      ] },
      { type: 'h2', text: 'Signs you should not wait' },
      { type: 'list', items: [
        'A strong campfire odor in the house, especially on humid days',
        'Black flakes or chunks falling into the firebox',
        'Smoke drifting into the room',
        'Fires that are harder to start or will not draw',
      ] },
      { type: 'callout', title: 'Burn smarter between cleanings', text: 'The EPA recommends burning only dry, seasoned wood and keeping fires hot enough to burn cleanly. Wet wood and smoldering fires create more creosote, faster.' },
      { type: 'h2', text: 'What about a chimney you never use?' },
      { type: 'p', text: 'It still needs a look. Birds and animals nest in unused flues, leaves pile up, and water damage to masonry and crowns happens whether you burn or not. Many of the worst surprises come from a fireplace that sat unused for years and then got lit on the first cold night.' },
      { type: 'h2', text: 'The easiest way to stay on schedule' },
      { type: 'p', text: 'Book your inspection and cleaning at the same time every year, ideally late summer or early fall, before you need the fireplace and before the busy season. That way any repair can be done before winter.' },
    ],
    sources: ['nfpa211', 'usfaHeating', 'epaBurnWise'],
    relatedServices: ['chimney-sweeping', 'chimney-inspection'],
    cta: 'holiday',
  },
  {
    slug: 'the-dangers-of-creosote-buildup',
    title: 'Creosote Buildup: What It Is and Why It Matters',
    description:
      'Creosote is the flammable residue every wood fire leaves in your chimney. Here is how it forms, the three stages, and how to keep it under control.',
    category: 'Safety',
    datePublished: '2026-01-28',
    dateModified: '2026-11-14',
    readMinutes: 4,
    image: IMAGES.fireboxBrush,
    imageAlt: 'Brush cleaning soot from a brick firebox',
    takeaways: [
      'Creosote forms when smoke cools and condenses on the inside of the flue.',
      'It is combustible, and buildup in the flue is a leading cause of chimney fires.',
      'Glazed, tar-like creosote is the hardest to remove and the most dangerous.',
      'Dry wood, hot fires and annual inspections keep it in check.',
    ],
    body: [
      { type: 'p', text: 'Creosote is what is left behind when wood smoke cools on its way up the chimney. Gases, unburned wood particles and moisture condense on the cooler walls of the flue and stick there. Over a season, that coating builds up, and creosote burns.' },
      { type: 'h2', text: 'Why it matters' },
      { type: 'p', text: 'A thick layer of creosote can ignite if a hot fire sends enough heat or a spark up the flue. Chimney fires can crack flue liners, damage masonry and spread to the structure of the house. The U.S. Fire Administration identifies creosote buildup as a leading cause of chimney fires and recommends annual inspection and cleaning.' },
      { type: 'h2', text: 'The three stages' },
      { type: 'list', items: [
        'Stage one: loose, flaky soot. Easy to brush out during a normal cleaning.',
        'Stage two: crunchy, tar-flecked deposits. Takes more work to remove and signals cooler, smokier fires.',
        'Stage three: glazed creosote. A shiny, hard coating that is difficult to remove and very flammable. It usually needs specialized treatment.',
      ] },
      { type: 'h2', text: 'What makes it build faster' },
      { type: 'list', items: [
        'Burning wet or unseasoned wood',
        'Low, smoldering fires with the air supply turned down',
        'A flue that is too large for the appliance, so smoke cools quickly',
        'Cold exterior chimneys that cool smoke before it exits',
      ] },
      { type: 'callout', title: 'A simple wood test', text: 'Seasoned firewood is lighter, has cracks in the ends and sounds hollow when two pieces are knocked together. If it hisses or bubbles in the fire, it is still wet.' },
      { type: 'h2', text: 'How to keep it under control' },
      { type: 'p', text: 'Burn dry, seasoned wood, give fires enough air to burn hot and bright, and have the chimney inspected every year. The inspection tells you how much buildup there is and how fast it is forming, which tells you how often you need cleaning.' },
    ],
    sources: ['usfaHeating', 'nfpa211', 'epaBurnWise'],
    relatedServices: ['chimney-sweeping', 'chimney-inspection'],
    cta: 'holiday',
  },
  {
    slug: 'what-is-a-level-2-chimney-inspection',
    title: 'Chimney Inspection Levels 1, 2 and 3 Explained',
    description:
      'NFPA 211 defines three levels of chimney inspection. Here is what each one covers and when you actually need a Level 2.',
    category: 'Inspections',
    datePublished: '2026-02-11',
    dateModified: '2026-11-14',
    readMinutes: 5,
    image: IMAGES.inspectionCloseup,
    imageAlt: 'Close inspection of a fireplace firebox',
    takeaways: [
      'Level 1 checks the readily accessible parts of a system with no changes. It is the standard annual inspection.',
      'Level 2 adds attics, crawl spaces and a video scan of the flue. It is recommended at a home sale, a fuel or appliance change, or after a chimney fire or storm.',
      'Level 3 removes parts of the structure and is only for suspected hidden hazards.',
    ],
    body: [
      { type: 'p', text: 'Not every chimney inspection is the same. NFPA 211 describes three levels, and the right one depends on what has happened to your chimney since it was last checked.' },
      { type: 'h2', text: 'Level 1: the annual check' },
      { type: 'p', text: 'A Level 1 inspection covers the readily accessible parts of the chimney, the exterior and the accessible interior, plus the appliance and its connection. It confirms the chimney is structurally sound, free of obstructions and clear of combustible deposits. It is appropriate when nothing about the system has changed and you plan to keep using it the same way.' },
      { type: 'h2', text: 'Level 2: when something changed' },
      { type: 'p', text: 'A Level 2 inspection includes everything in Level 1, plus accessible attics, crawl spaces and basements, and a video scan or similar examination of the inside of the flue. It is recommended when:' },
      { type: 'list', items: [
        'A home is being bought or sold',
        'You change the fuel type or replace or add an appliance, such as an insert or stove',
        'There has been a chimney fire, earthquake, lightning strike or severe weather event',
        'A Level 1 inspection found a problem that needs a closer look',
      ] },
      { type: 'h2', text: 'Level 3: when a hidden hazard is suspected' },
      { type: 'p', text: 'A Level 3 inspection is rare. It involves removing parts of the building or chimney, such as drywall or masonry, to examine concealed areas. It is only done when a Level 1 or Level 2 inspection points to a serious hidden hazard that cannot be evaluated any other way.' },
      { type: 'callout', title: 'Buying a home?', text: 'A general home inspector usually looks at the chimney from the outside. A Level 2 chimney inspection looks inside the flue, which is where the expensive problems hide.' },
      { type: 'h2', text: 'What you should get afterward' },
      { type: 'p', text: 'Whatever the level, you should come away understanding the condition of your chimney, with anything that needs attention explained in plain language and documented with photos where possible.' },
    ],
    sources: ['nfpa211'],
    relatedServices: ['chimney-inspection'],
    cta: 'inspection',
  },
  {
    slug: 'chimney-inspection-vs-chimney-cleaning',
    title: 'Chimney Inspection vs. Chimney Cleaning: What Is the Difference?',
    description:
      'An inspection tells you the condition of your chimney. A cleaning removes the buildup. You usually want both, and here is why.',
    category: 'Maintenance',
    datePublished: '2026-11-14',
    dateModified: '2026-11-14',
    readMinutes: 3,
    image: IMAGES.cleaningSetup,
    imageAlt: 'Chimney cleaning equipment set up in front of a brick fireplace',
    takeaways: [
      'Inspection finds problems. Cleaning removes soot and creosote.',
      'A clean chimney can still be unsafe if the liner is cracked or the crown leaks.',
      'Booking both together saves a trip and gives the clearest picture.',
    ],
    body: [
      { type: 'p', text: 'They are often booked together, so it is easy to think they are the same thing. They are not, and knowing the difference helps you ask for the right service.' },
      { type: 'h2', text: 'A cleaning removes buildup' },
      { type: 'p', text: 'Chimney cleaning, or sweeping, removes soot, creosote and debris from the flue, smoke chamber and firebox. It reduces fire risk and helps the chimney draft properly.' },
      { type: 'h2', text: 'An inspection checks condition' },
      { type: 'p', text: 'An inspection looks at whether the chimney is sound: the liner, the damper, the smoke chamber, the crown, the cap, the flashing and the masonry. It answers the question "is this safe to use?"' },
      { type: 'h2', text: 'Why you want both' },
      { type: 'list', items: [
        'A spotless flue with a cracked liner is still a hazard.',
        'Cleaning first makes the inspection more accurate because the surfaces are visible.',
        'One visit covers both, with one setup and one cleanup.',
      ] },
      { type: 'callout', title: 'Holiday special', text: 'This season First Chimney is offering chimney cleaning plus inspection for $199. It is the simplest way to get both done before you host.' },
    ],
    sources: ['nfpa211', 'usfaHeating'],
    relatedServices: ['chimney-sweeping', 'chimney-inspection'],
    cta: 'holiday',
  },
  {
    slug: 'signs-your-chimney-is-leaking',
    title: 'Signs Your Chimney Is Leaking (and Where the Water Gets In)',
    description:
      'Water is the number one enemy of masonry chimneys. Learn the warning signs of a leak and the four places water usually gets in.',
    category: 'Repairs',
    datePublished: '2026-11-14',
    dateModified: '2026-11-14',
    readMinutes: 5,
    image: IMAGES.flueRoof,
    imageAlt: 'Chimney top with flue and crown visible on a shingled roof',
    takeaways: [
      'Most chimney leaks come from flashing, the crown, a missing cap or porous masonry.',
      'The stain inside is often far from where water enters.',
      'Freeze-thaw cycles turn small leaks into masonry damage.',
      'Waterproofing should be breathable, never paint or a non-breathable sealer.',
    ],
    body: [
      { type: 'p', text: 'A chimney leak rarely announces itself all at once. It usually starts as a small stain, a damp smell or a little rust on the damper, then gets worse each season as water works its way into the masonry.' },
      { type: 'h2', text: 'Warning signs' },
      { type: 'list', items: [
        'Water stains on the ceiling or walls next to the chimney',
        'A musty or damp smell from the fireplace after rain',
        'Rust on the damper, firebox or fireplace doors',
        'White powdery staining on the brick (efflorescence)',
        'Crumbling mortar or flaking brick faces',
      ] },
      { type: 'h2', text: 'The four usual suspects' },
      { type: 'list', items: [
        'Flashing: the metal seal where the chimney meets the roof. It lifts, rusts or gets patched with caulk that fails.',
        'The crown: the cement top of the chimney. Cracks let water straight into the structure.',
        'The cap: without one, rain falls directly down the flue.',
        'The masonry itself: brick and mortar are porous and absorb water over time.',
      ] },
      { type: 'h2', text: 'Why it gets worse in winter' },
      { type: 'p', text: 'Water that soaks into brick and mortar freezes, expands and breaks the material apart from the inside. Each freeze-thaw cycle makes the cracks bigger, which lets in more water next time. That is how a small leak becomes a rebuild.' },
      { type: 'callout', title: 'About waterproofing', text: 'Masonry needs a breathable water repellent that keeps liquid water out but lets vapor escape. Paint and non-breathable sealers can trap moisture inside the brick and speed up freeze damage.' },
      { type: 'h2', text: 'What to do' },
      { type: 'p', text: 'Have the source traced before anything is repaired. Fixing the flashing will not help if the crown is the problem. A proper inspection finds the entry point so you only pay for the fix that works.' },
    ],
    sources: ['nfpa211'],
    relatedServices: ['leak-repair', 'chimney-crown', 'chimney-cap'],
    cta: 'repair',
  },
  {
    slug: 'preparing-your-fireplace-for-winter',
    title: 'Preparing Your Fireplace for Winter and the Holidays',
    description:
      'A simple checklist to get your fireplace safe and ready before the first cold night and the holiday gatherings.',
    category: 'Seasonal',
    datePublished: '2026-11-14',
    dateModified: '2026-11-14',
    readMinutes: 4,
    image: IMAGES.brickArch,
    imageAlt: 'Fire burning in a brick arched fireplace',
    takeaways: [
      'Get the chimney inspected and cleaned before the season, not during it.',
      'Test smoke and carbon monoxide alarms.',
      'Keep decorations, stockings and greenery away from the fire.',
      'Burn dry wood and never use the fireplace to burn wrapping paper or trash.',
    ],
    body: [
      { type: 'p', text: 'The holidays are when fireplaces get the most use and when homes are full of people. A little preparation now means the only thing you think about in December is the fire itself.' },
      { type: 'h2', text: 'Before the first fire' },
      { type: 'list', items: [
        'Schedule a chimney inspection and cleaning',
        'Open and close the damper to make sure it moves and seals',
        'Look up the flue with a flashlight for nests or debris',
        'Check that the chimney cap is still in place',
        'Test smoke alarms and carbon monoxide alarms, and replace batteries',
      ] },
      { type: 'h2', text: 'Stock the right fuel' },
      { type: 'p', text: 'The EPA recommends burning only dry, seasoned wood. It lights easier, burns hotter and produces less smoke and creosote. Store it off the ground and covered on top, with the sides open to air.' },
      { type: 'h2', text: 'Holiday-specific safety' },
      { type: 'list', items: [
        'Keep stockings, garland and greenery well away from the opening and do not hang anything flammable directly over an active fire',
        'Never burn wrapping paper, boxes or a Christmas tree in the fireplace. They burn too hot and throw sparks up the chimney',
        'Use a screen or glass doors to keep embers in',
        'Keep at least three feet clear around the hearth, especially with kids and pets visiting',
        'Put ashes in a metal container with a lid, outside and away from the house',
      ] },
      { type: 'callout', title: 'The $199 holiday special', text: 'First Chimney is offering chimney cleaning plus inspection for $199 this holiday season. It covers the most important item on this list in one visit.' },
    ],
    sources: ['usfaHeating', 'nfpaHeating', 'epaBurnWise'],
    relatedServices: ['chimney-sweeping', 'chimney-inspection', 'fireplace-repair'],
    cta: 'holiday',
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
