/**
 * Content for the growth pages: Chimney Health Check (lead magnet), real estate
 * partners, careers, referrals and "how to choose a chimney company".
 *
 * Rules: no invented prices, pay, benefits, insurance claims or statistics.
 * Anything Andrew decides later (referral reward, open positions) is a setting here.
 */
import { EXPERIENCE } from './team';

/* ----------------------------- Health check ----------------------------- */

export type CheckFlag = 'urgent' | 'leak' | 'masonry' | 'animals' | 'buildup' | 'overdue' | 'cap';

export type CheckOption = {
  label: string;
  points: number;
  flags?: CheckFlag[];
};
export type CheckQuestion = {
  id: string;
  q: string;
  hint?: string;
  options: CheckOption[];
};

export const HEALTH_CHECK: CheckQuestion[] = [
  {
    id: 'last',
    q: 'When was your chimney last inspected?',
    hint: 'NFPA 211, the national chimney safety standard, calls for an inspection at least once a year.',
    options: [
      { label: 'Within the last 12 months', points: 0 },
      { label: '1 to 2 years ago', points: 2, flags: ['overdue'] },
      { label: '3 or more years ago', points: 3, flags: ['overdue'] },
      { label: 'Never, or I am not sure', points: 3, flags: ['overdue'] },
    ],
  },
  {
    id: 'use',
    q: 'How often do you use the fireplace or stove in winter?',
    options: [
      { label: 'Most days', points: 2, flags: ['buildup'] },
      { label: 'A few times a month', points: 1 },
      { label: 'A few times a year', points: 0 },
      { label: 'It has been sitting unused', points: 1, flags: ['animals'] },
    ],
  },
  {
    id: 'smoke',
    q: 'Does smoke ever drift into the room when a fire is going?',
    hint: 'Smoke coming back into the house can mean a blockage, a draft problem or a damaged flue.',
    options: [
      { label: 'Yes', points: 4, flags: ['urgent'] },
      {
        label: 'Sometimes, when the fire starts',
        points: 2,
        flags: ['buildup'],
      },
      { label: 'No', points: 0 },
    ],
  },
  {
    id: 'smell',
    q: 'Do you notice a strong campfire smell indoors, especially on humid days?',
    options: [
      { label: 'Yes', points: 2, flags: ['buildup'] },
      { label: 'No', points: 0 },
    ],
  },
  {
    id: 'flakes',
    q: 'Do black flakes or chunks fall into the firebox?',
    hint: 'Flaky black debris is often creosote, the flammable residue wood fires leave in the flue.',
    options: [
      { label: 'Yes', points: 3, flags: ['buildup'] },
      { label: 'No', points: 0 },
      { label: 'Not sure', points: 1 },
    ],
  },
  {
    id: 'water',
    q: 'Any water stains, dampness or rust near the fireplace or on the ceiling around the chimney?',
    options: [
      { label: 'Yes', points: 3, flags: ['leak'] },
      { label: 'No', points: 0 },
    ],
  },
  {
    id: 'outside',
    q: 'From outside, do you see cracked or loose bricks, crumbling mortar or white staining?',
    options: [
      { label: 'Yes', points: 3, flags: ['masonry'] },
      { label: 'No', points: 0 },
      { label: 'I cannot see the chimney well', points: 1 },
    ],
  },
  {
    id: 'cap',
    q: 'Does the top of your chimney have a metal cap with mesh sides?',
    hint: 'A cap keeps out rain, animals and debris.',
    options: [
      { label: 'Yes', points: 0 },
      { label: 'No', points: 2, flags: ['cap'] },
      { label: 'Not sure', points: 1 },
    ],
  },
  {
    id: 'animals',
    q: 'Have you heard scratching, chirping or other noises inside the chimney?',
    options: [
      { label: 'Yes', points: 3, flags: ['animals'] },
      { label: 'No', points: 0 },
    ],
  },
  {
    id: 'fire',
    q: 'Have you ever heard a loud roaring or popping from the chimney, or seen dense smoke or sparks pouring out of the top?',
    hint: 'Those are classic signs of a chimney fire. A chimney fire can crack the flue even if it burned out on its own.',
    options: [
      { label: 'Yes', points: 6, flags: ['urgent'] },
      { label: 'No', points: 0 },
    ],
  },
];

export type CheckLevel = 'Urgent' | 'Soon' | 'Good';
export type CheckResult = {
  level: CheckLevel;
  title: string;
  body: string;
  /** Service ids, most relevant first. */
  services: string[];
};

const FLAG_SERVICE: Record<CheckFlag, string> = {
  urgent: 'chimney-inspection',
  overdue: 'chimney-inspection',
  buildup: 'chimney-sweeping',
  leak: 'leak-repair',
  masonry: 'masonry-rebuilds',
  cap: 'chimney-cap',
  animals: 'chimney-cap',
};

/** Pure scoring so it can be tested and reused. `answers` maps question id to option index. */
export function scoreHealthCheck(answers: Record<string, number>): {
  score: number;
  flags: CheckFlag[];
  result: CheckResult;
} {
  let score = 0;
  const flags = new Set<CheckFlag>();
  for (const q of HEALTH_CHECK) {
    const opt = q.options[answers[q.id]];
    if (!opt) continue;
    score += opt.points;
    opt.flags?.forEach((f) => flags.add(f));
  }
  const services = [...new Set(['chimney-inspection', ...[...flags].map((f) => FLAG_SERVICE[f])])];
  const urgent = flags.has('urgent') || score >= 12;
  const result: CheckResult = urgent
    ? {
        level: 'Urgent',
        title: 'Please stop using the fireplace until it is inspected.',
        body: 'What you described can point to a blockage, a damaged flue or a past chimney fire. None of that is safe to keep burning through. Book an inspection and Andrew will tell you exactly what is going on before anything else happens.',
        services,
      }
    : score >= 4
      ? {
          level: 'Soon',
          title: 'Your chimney is due for a professional look.',
          body: 'Nothing you described sounds like an emergency, but a few answers are worth checking before your next fire. An inspection now catches small problems while they are still small.',
          services,
        }
      : {
          level: 'Good',
          title: 'Sounds like you are in good shape.',
          body: 'Keep it that way with a yearly inspection, which is what NFPA 211 calls for. Get a reminder from us once a year so it never slips.',
          services,
        };
  return { score, flags: [...flags], result };
}

/* ------------------------------ Real estate ------------------------------ */

export const PARTNER_ROLES = ['Home buyer', 'Home seller', 'Realtor', 'Home inspector', 'Property manager', 'Other'] as const;

export const REAL_ESTATE_FAQS = [
  {
    q: 'Why does a home sale call for a Level 2 chimney inspection?',
    a: 'NFPA 211, the national fire safety standard for chimneys, calls for a Level 2 inspection when a property is sold or transferred. A Level 2 inspection includes a camera look inside the flue, which is where the expensive problems hide.',
  },
  {
    q: 'Is a home inspection not enough?',
    a: 'A general home inspector checks hundreds of items in a few hours and usually looks at the chimney from the outside. Cracked flue tiles, gaps in a liner and hidden water damage are found from the inside, with a camera.',
  },
  {
    q: 'Who should order the chimney inspection?',
    a: 'Usually the buyer, during the inspection period. Sellers who order one before listing can fix issues on their own terms and hand buyers a clean report instead of a surprise.',
  },
  {
    q: 'Can you work around a closing date?',
    a: 'Tell us the inspection deadline when you request a time and we will do everything we can to fit it. The sooner you reach out, the easier that is.',
  },
];

/* -------------------------------- Careers -------------------------------- */

export type Position = {
  id: string;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Seasonal' | 'Full-time or part-time' | 'Part-time / freelance';
  group: 'Field' | 'Sales & marketing' | 'Office';
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

/**
 * Every role a growing chimney company eventually needs. Pay and benefits are
 * deliberately not listed: Andrew sets them per hire. Remove a role here to hide it.
 */
export const POSITIONS: Position[] = [
  {
    id: 'technician',
    title: 'Chimney technician',
    type: 'Full-time',
    group: 'Field',
    summary: 'The core of the company. Sweeps, inspections, caps, dampers and the plain-English walkthrough that earns a homeowner’s trust.',
    responsibilities: [
      'Clean chimneys, fireplaces, wood stoves, inserts and dryer vents',
      'Perform Level 1 and Level 2 inspections with camera and photo documentation',
      'Install chimney caps, top-sealing dampers and spark arrestors',
      'Walk homeowners through findings with photos, honestly and without pressure',
      'Protect every home: drop cloths, clean work area, respect for the customer',
    ],
    requirements: ['Chimney or masonry field experience', 'Comfortable on ladders and steep roofs', 'Valid driver’s license and a clean driving record', 'Clear communication with homeowners'],
    niceToHave: ['F.I.R.E., CSIA or NFI certification (or willingness to earn one)', 'Experience with inspection cameras', 'Basic masonry repair'],
  },
  {
    id: 'lead-technician',
    title: 'Lead technician / crew lead',
    type: 'Full-time',
    group: 'Field',
    summary: 'Run a truck. Lead a helper, own the quality of every job and help train the next technician.',
    responsibilities: [
      'Lead daily jobs and keep the schedule on time',
      'Train and supervise helpers on safety and technique',
      'Diagnose leaks, draft problems and flue damage',
      'Write clear findings and repair recommendations in the CRM',
      'Keep the truck stocked, organized and inspected',
    ],
    requirements: ['3+ years in the chimney trade', 'Proven ability to lead a small crew', 'Valid driver’s license', 'Strong safety habits on roofs and ladders'],
    niceToHave: ['Chimney inspection certification', 'Relining and stainless liner installation', 'Smoke chamber parging'],
  },
  {
    id: 'helper',
    title: 'Helper / apprentice',
    type: 'Full-time or part-time',
    group: 'Field',
    summary: 'No chimney experience needed. Learn a real trade from a F.I.R.E. Certified Technician, one job at a time.',
    responsibilities: [
      'Set up and protect the work area, carry and set ladders safely',
      'Run vacuums and equipment, haul debris, clean up',
      'Learn to sweep, take the standard photo set and help on repairs',
      'Mix mortar and assist on caps, crowns and masonry work',
    ],
    requirements: ['Shows up on time, every time', 'Not afraid of heights or hard work', 'Can lift 50 lb and work outdoors in all seasons', 'Treats a customer’s home like their own'],
    niceToHave: ['Construction, roofing or trade school background', 'Valid driver’s license'],
  },
  {
    id: 'mason',
    title: 'Mason (brick and stone)',
    type: 'Full-time',
    group: 'Field',
    summary: 'Crowns, rebuilds, tuckpointing and brickwork that has to survive decades of freeze and thaw.',
    responsibilities: [
      'Rebuild chimneys from the roofline up',
      'Pour and form chimney crowns, repoint and tuckpoint joints',
      'Repair spalled brick, stone and firebox walls',
      'Set flue tiles and work cleanly around finished homes',
    ],
    requirements: ['Brick and block experience', 'Comfortable working from roofs and scaffolding', 'Clean, careful work and pride in a straight line'],
    niceToHave: ['Stone and historic masonry', 'Refractory and firebox work', 'Own hand tools'],
  },
  {
    id: 'masonry-laborer',
    title: 'Masonry laborer',
    type: 'Full-time or part-time',
    group: 'Field',
    summary: 'Keep the mason moving: mix, carry, stage, clean. A great path into the masonry trade.',
    responsibilities: ['Mix mortar and concrete', 'Stage brick, block and materials on roofs and scaffolding', 'Set up and break down scaffolding and tarps', 'Keep the site safe and clean'],
    requirements: ['Physically fit and comfortable at heights', 'Reliable transportation', 'Willing to learn'],
    niceToHave: ['Scaffolding experience', 'Construction labor background'],
  },
  {
    id: 'hearth-installer',
    title: 'Hearth installer (gas, wood and inserts)',
    type: 'Full-time',
    group: 'Field',
    summary: 'Install the fireplaces, inserts and stoves homeowners design on our website, and service them for years after.',
    responsibilities: [
      'Install gas, wood and pellet inserts, stoves and fireplaces to manufacturer specs',
      'Install liners, venting and surrounds',
      'Start up, test and walk the homeowner through their new unit',
      'Service and troubleshoot existing gas appliances',
    ],
    requirements: ['Hearth or HVAC installation experience', 'Understanding of venting and clearances', 'Valid driver’s license'],
    niceToHave: ['NFI certification (gas, wood or pellet)', 'Gas fitter license where required'],
  },
  {
    id: 'inspection-sales',
    title: 'Inspection and sales rep (estimator)',
    type: 'Full-time',
    group: 'Sales & marketing',
    summary: 'Turn inspections into clear, honest proposals. The person homeowners trust to explain what their chimney really needs.',
    responsibilities: [
      'Run inspections and present findings with photos',
      'Build good, better, best repair proposals in the CRM',
      'Follow up on estimates and keep the pipeline moving',
      'Build relationships with realtors and home inspectors',
    ],
    requirements: ['Sales or estimating experience in home services', 'Comfortable on roofs for inspections', 'Organized and responsive', 'Valid driver’s license'],
    niceToHave: ['Chimney or masonry background', 'CRM experience (GoHighLevel a plus)'],
  },
  {
    id: 'canvasser',
    title: 'Canvasser / door-to-door marketing rep',
    type: 'Seasonal',
    group: 'Sales & marketing',
    summary: 'Knock doors in neighborhoods we are already working in. Friendly, honest, no pressure: you set appointments, Andrew does the rest.',
    responsibilities: [
      'Visit homes near active jobs with door hangers and the health check card',
      'Start friendly conversations and book free-to-ask appointments',
      'Log every conversation in the CRM app',
      'Follow local soliciting rules and respect "no soliciting" signs',
    ],
    requirements: ['Outgoing and comfortable talking to strangers', 'Reliable and coachable', 'Smartphone for the CRM app'],
    niceToHave: ['Door-to-door or field marketing experience', 'Bilingual'],
  },
  {
    id: 'office-manager',
    title: 'Office manager / scheduler',
    type: 'Part-time',
    group: 'Office',
    summary: 'The voice on the phone and the calendar behind the trucks. Can start part-time and partly remote.',
    responsibilities: [
      'Answer calls and texts, book and confirm appointments',
      'Keep the CRM pipelines current and follow up on estimates',
      'Send invoices and collect payments',
      'Coordinate permits, materials and the weekly schedule',
    ],
    requirements: ['Excellent phone manner', 'Organized and detail-oriented', 'Comfortable with software and a CRM'],
    niceToHave: ['Home services or contractor office experience', 'QuickBooks or GoHighLevel experience'],
  },
  {
    id: 'content-creator',
    title: 'Social media and content creator',
    type: 'Part-time / freelance',
    group: 'Sales & marketing',
    summary: 'Show the real work. Short videos and photos from job sites that teach homeowners something.',
    responsibilities: ['Film and edit short job-site videos and before and afters (with homeowner permission)', 'Post to Facebook, Instagram, Google and Nextdoor on a schedule', 'Write simple, helpful captions', 'Track what gets calls'],
    requirements: ['Portfolio of short-form video', 'Can work around a field schedule', 'Comfortable on job sites'],
    niceToHave: ['Experience with trades or home service brands', 'Drone experience'],
  },
];

export const CAREER_FAQS = [
  {
    q: 'Do I need experience?',
    a: 'Not for the helper, laborer or canvasser roles. Good habits matter more than experience: be on time, be careful, be respectful in people’s homes. The rest can be taught.',
  },
  {
    q: 'Where is the work?',
    a: 'At homes across our service area in Virginia, New Jersey, Connecticut, Massachusetts and Rhode Island. Most field roles need a valid driver’s license.',
  },
  {
    q: 'Do I need a resume?',
    a: 'No. Upload one if you have it. If not, just tell Andrew about yourself in the form.',
  },
  {
    q: 'What happens after I apply?',
    a: 'Andrew reads every application himself. If it looks like a fit, he will call for a short phone chat, then a paid working interview on a real job.',
  },
  {
    q: 'Will you help me get certified?',
    a: 'Training comes from a F.I.R.E. Certified Technician. Ask about certification during your interview.',
  },
];

/* ------------------------------- Referrals ------------------------------- */

/** Give $25, get $25. Approved by Dan and Andrew on 2026-11-15. */
export const REFERRAL = {
  friendCode: 'NEIGHBOR25',
  friendOffer: '$25 off their first service',
  referrerOffer: '$25 off your next service',
  terms: 'One referral credit per new household. The new customer mentions the code when booking. Cannot be combined with other offers. Credit is applied after the friend’s first completed job.',
};
export const REFERRAL_REWARD: string | null = `${REFERRAL.referrerOffer} when they book, and ${REFERRAL.friendOffer}`;

/* --------------------------- How to choose us ---------------------------- */

export const CHOOSE_QUESTIONS: { q: string; why: string; us: string }[] = [
  {
    q: 'Is the technician certified, and can I check it myself?',
    why: 'Anyone can print "certified" on a truck. A real credential has a directory you can look up.',
    us: 'Andrew is listed by name in the F.I.R.E. Service directory as a F.I.R.E. Certified Technician.',
  },
  {
    q: 'Who is actually coming to my house?',
    why: 'Big call centers book the job and send whoever is free that day.',
    us: 'You talk to Andrew, the owner. He does the work and stands behind it.',
  },
  {
    q: 'Will you show me what you found?',
    why: 'You cannot see inside a flue. You should not have to take a repair on faith.',
    us: 'Findings come with photos where possible, explained in plain English.',
  },
  {
    q: 'Do I get a quote before any repair work?',
    why: 'Surprise invoices are one of the most common complaints about home service work.',
    us: 'Always. We quote first, and nothing is done without your approval.',
  },
  {
    q: 'How do you protect my home?',
    why: 'Soot gets everywhere when a sweep is careless.',
    us: 'Drop cloths down, work area protected, and we leave it clean.',
  },
  {
    q: 'How much experience do you have?',
    why: 'Chimney work is part fire safety, part masonry. Experience shows in both.',
    us: `${EXPERIENCE.ownerYears} years in the chimney trade for Andrew, and ${EXPERIENCE.teamYears} years of combined experience across the crew.`,
  },
];

export const RED_FLAGS = [
  'A rock-bottom cleaning price by phone or flyer, followed by scary news once they are on your roof',
  'Pressure to approve a big repair today, before you can get a second opinion',
  'No photos of the problem, or photos that could be of any chimney',
  'A "certification" you cannot find in any directory',
  'Cash only, no written quote, no business name on the truck',
];
