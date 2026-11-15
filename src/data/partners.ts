/**
 * Partner program: one page and one downloadable guide per industry.
 * The partner rate was approved by Dan and Andrew on 2026-11-15. Change it here and every page,
 * guide and the CRM copy stays consistent.
 */

export const PARTNER_PROGRAM = {
  discount: '10% partner rate',
  discountDetail: '10% off inspections and cleanings for your clients, your listings, your tenants and your own home',
  perks: [
    '10% partner rate on inspections and cleanings for your clients and your own properties',
    'Priority scheduling when there is a closing date, a tenant move-in or an insurance deadline',
    'A copy of every report you refer, with photos, in plain English',
    'Andrew’s cell number. You text, he answers.',
    'A free branded guide you can hand to clients',
  ],
};

export type PartnerIndustry = {
  slug: string;
  name: string;
  short: string;
  role: string;
  title: string;
  lede: string;
  pains: { t: string; b: string }[];
  benefits: { t: string; b: string }[];
  offer: string;
  faqs: { q: string; a: string }[];
  guide: { title: string; file: string; blurb: string };
};

export const PARTNER_INDUSTRIES: PartnerIndustry[] = [
  {
    slug: 'realtors',
    name: 'Realtors',
    short: 'Listing and buyer agents',
    role: 'Realtor',
    title: 'A chimney partner that keeps your closings on track.',
    lede: 'Chimney surprises kill deals and push closing dates. Andrew inspects your listings before they hit the market, and your buyers’ chimneys before inspection periods run out, with photos and a plain-English report.',
    pains: [
      { t: 'Late surprises', b: 'A cracked flue found in week three can blow up a deal or force a big credit.' },
      { t: 'Vague home inspection notes', b: '"Recommend evaluation by a qualified chimney professional" leaves your client guessing.' },
      { t: 'Slow vendors', b: 'Inspection periods are short. Waiting two weeks for a chimney company is not an option.' },
    ],
    benefits: [
      { t: 'Pre-listing inspections', b: 'Find and fix problems on the seller’s schedule. Hand buyers a clean report instead of a surprise.' },
      { t: 'Level 2 inspections for buyers', b: 'NFPA 211 calls for a Level 2 inspection at sale or transfer. Camera inside the flue, photo report.' },
      { t: 'Any listing, any time', b: 'Send Andrew every listing with a fireplace. One text with the address and the deadline.' },
      { t: 'Reports both sides understand', b: 'Safety now, this year, can wait. Written so buyers and sellers can negotiate on facts.' },
      { t: 'Verified credential', b: 'F.I.R.E. Certified Technician, listed by name in the F.I.R.E. directory. Lenders and attorneys can check it.' },
    ],
    offer: 'Partner agents get the 10% partner rate for every client they send and for their own home, plus priority scheduling around inspection deadlines.',
    faqs: [
      { q: 'How fast can you inspect?', a: 'Text the address and the deadline. Andrew prioritizes partner deals with closing dates and will tell you right away what he can do.' },
      { q: 'Who receives the report?', a: 'Whoever ordered it, with your permission to copy you. You always know what was found.' },
      { q: 'Do you do repairs too?', a: 'Yes. If repairs are needed, the quote is separate from the report, so the inspection stays objective. Your clients can use any qualified company.' },
    ],
    guide: { title: 'The Realtor’s Guide to a Safe, Inspected Chimney', file: '/guides/first-chimney-realtors-guide.pdf', blurb: 'Inspection levels, codes and standards, the problems that kill deals, typical costs, and the questions to ask any chimney company.' },
  },
  {
    slug: 'home-inspectors',
    name: 'Home inspectors',
    short: 'General home inspectors',
    role: 'Home inspector',
    title: 'Be the inspector who has a chimney specialist on speed dial.',
    lede: 'You see the chimney from the outside. Andrew sees inside the flue. Refer the "needs further evaluation" chimneys to a F.I.R.E. Certified Technician and give your clients a real answer.',
    pains: [
      { t: 'Liability', b: 'Chimney defects are hidden. A missed cracked liner can come back to you.' },
      { t: 'Unhappy clients', b: '"Get it evaluated" feels like a dead end without a name to call.' },
      { t: 'Unreliable referrals', b: 'Sending clients to a company that scares them into repairs reflects on you.' },
    ],
    benefits: [
      { t: 'A name you can trust', b: 'Honest findings, photos, quote first. Your clients are treated the way you would want.' },
      { t: 'Camera inspections', b: 'Level 2 inspections look inside the full length of the flue, where the expensive problems hide.' },
      { t: 'You get copied', b: 'With your client’s permission, you get the findings so your file is complete.' },
      { t: 'Fast turnaround', b: 'Inspection periods are short. Partner referrals get priority.' },
      { t: 'Verifiable credential', b: 'F.I.R.E. Certified Technician, listed in the official directory.' },
    ],
    offer: 'Your clients get the 10% partner rate when they mention you, and you get priority scheduling and a copy of the findings.',
    faqs: [
      { q: 'What should I flag for a chimney specialist?', a: 'Any wood-burning fireplace or stove at sale, visible crown cracks, missing caps, staining or efflorescence, creosote you can see from the firebox, and any appliance change. The free guide has a full checklist.' },
      { q: 'Will you contradict my report?', a: 'No. Andrew inspects what you cannot see from the outside and reports facts with photos.' },
      { q: 'Do you pay referral fees?', a: 'No. Referral payments between inspectors and contractors create conflicts of interest. Your clients get the partner rate instead.' },
    ],
    guide: { title: 'The Home Inspector’s Guide to Chimney Referrals', file: '/guides/first-chimney-home-inspectors-guide.pdf', blurb: 'What to flag, the NFPA 211 inspection levels, code references, red flags with photos, and how a chimney referral protects you.' },
  },
  {
    slug: 'contractors',
    name: 'Contractors',
    short: 'Roofers, remodelers, HVAC and handymen',
    role: 'Home improvement contractor',
    title: 'Stay in your lane. Hand the chimney to a specialist.',
    lede: 'You are on roofs and in houses every day. When you see a chimney that needs work, send it to Andrew. He does it right, stays in his lane and sends the customer back to you for anything that is yours.',
    pains: [
      { t: 'Leaks blamed on your roof', b: 'Most "roof leaks" at the chimney are crowns, flashing or masonry. They become your callback.' },
      { t: 'Out-of-scope work', b: 'Liners, flue tiles and smoke chambers are specialist work with fire-safety consequences.' },
      { t: 'Appliance changes', b: 'New furnaces, water heaters and inserts often need the flue relined to vent safely.' },
    ],
    benefits: [
      { t: 'Crowns, caps and flashing done right', b: 'So your new roof does not leak at the chimney.' },
      { t: 'Relining for HVAC changeouts', b: 'Stainless liners sized for the new appliance.' },
      { t: 'Masonry and rebuilds', b: 'Tuckpointing, crowns and rebuilds from the roofline up.' },
      { t: 'No poaching', b: 'Andrew does chimney work only. Your customer stays yours.' },
      { t: 'Coordinated scheduling', b: 'Work around your tear-off or remodel timeline.' },
    ],
    offer: 'Your customers get the 10% partner rate on chimney work, and you get scheduling that works around your project.',
    faqs: [
      { q: 'Can you work around my roof replacement?', a: 'Yes. The best time to fix a crown and flashing is during the roof job. Send the date and Andrew will plan around it.' },
      { q: 'Do you install liners for new furnaces?', a: 'Yes. Stainless steel liners sized to the appliance manufacturer’s venting requirements.' },
      { q: 'Will you take my customer?', a: 'No. Chimney work only. Anything outside that goes back to you.' },
    ],
    guide: { title: 'The Contractor’s Chimney Field Guide', file: '/guides/first-chimney-contractors-guide.pdf', blurb: 'Flashing and crown basics, termination and clearance rules, venting changes, red flags with photos and typical costs.' },
  },
  {
    slug: 'property-managers',
    name: 'Property managers',
    short: 'Property managers, landlords and HOAs',
    role: 'Property manager',
    title: 'Annual chimney inspections for every unit, on one schedule.',
    lede: 'A neglected chimney is a fire risk and a liability. Put every property with a fireplace on a yearly inspection schedule with photo reports for your files.',
    pains: [
      { t: 'Liability', b: 'Tenant fires and carbon monoxide are the worst calls you can get.' },
      { t: 'No records', b: 'When something goes wrong, you need proof of maintenance.' },
      { t: 'Scheduling headaches', b: 'Coordinating access across many units takes time you do not have.' },
    ],
    benefits: [
      { t: 'Yearly schedule', b: 'Every unit inspected and cleaned before heating season.' },
      { t: 'Photo reports per unit', b: 'A clean paper trail for owners, insurers and your files.' },
      { t: 'Tenant coordination', b: 'Andrew can confirm access directly with tenants if you prefer.' },
      { t: 'Turnover inspections', b: 'Check fireplaces between tenants.' },
      { t: 'Priority emergency response', b: 'Smoke, odor or a chimney fire scare gets moved to the front.' },
    ],
    offer: 'Managed properties get the 10% partner rate on every inspection and cleaning, plus a single schedule and photo reports for each unit.',
    faqs: [
      { q: 'How often should rentals be inspected?', a: 'NFPA 211 calls for chimneys, fireplaces and vents to be inspected at least once a year, and cleaned as needed.' },
      { q: 'Can you handle many units?', a: 'Send the list. Andrew will propose a schedule before heating season.' },
      { q: 'Do you inspect gas fireplaces?', a: 'Yes. Gas appliances still need their venting checked every year.' },
    ],
    guide: { title: 'The Property Manager’s Chimney Compliance Guide', file: '/guides/first-chimney-property-managers-guide.pdf', blurb: 'Annual inspection standards, a maintenance schedule, tenant safety checklist, record keeping and typical costs.' },
  },
  {
    slug: 'insurance',
    name: 'Insurance professionals',
    short: 'Agents, adjusters and restoration',
    role: 'Insurance or restoration',
    title: 'Credible chimney inspections for underwriting and claims.',
    lede: 'Chimney and flue fires are a major share of home heating fires. Whether you are writing a policy or adjusting a claim, Andrew delivers documented, photo-backed findings.',
    pains: [
      { t: 'Unknown risk', b: 'A wood-burning chimney with no maintenance history is a risk you cannot see.' },
      { t: 'Disputed claims', b: 'After a chimney fire or storm, the cause and extent of damage need documentation.' },
      { t: 'Slow vendors', b: 'Policyholders want answers quickly.' },
    ],
    benefits: [
      { t: 'Level 2 after events', b: 'NFPA 211 calls for a Level 2 inspection after a chimney fire, storm or other event that could damage the chimney.' },
      { t: 'Photo documentation', b: 'Clear photos and plain findings for the file.' },
      { t: 'Prevention for policyholders', b: 'Recommend yearly inspections to clients with wood heat.' },
      { t: 'Repairs available', b: 'If the claim is approved, First Chimney can do the work, quoted separately.' },
      { t: 'Verified credential', b: 'F.I.R.E. Certified Technician, listed in the official directory.' },
    ],
    offer: 'Policyholders you refer get the 10% partner rate, and post-event inspections get priority scheduling.',
    faqs: [
      { q: 'Do you inspect after a chimney fire?', a: 'Yes. A Level 2 inspection with a camera is the standard after a chimney fire or another damaging event.' },
      { q: 'Can you document storm or lightning damage?', a: 'Yes, with photos of the crown, flashing, masonry and flue.' },
      { q: 'Do you work with restoration companies?', a: 'Yes. Andrew can coordinate chimney work with the restoration schedule.' },
    ],
    guide: { title: 'The Insurance Professional’s Chimney Risk Guide', file: '/guides/first-chimney-insurance-guide.pdf', blurb: 'Fire statistics, inspection levels, what to document after an event, common causes and typical costs.' },
  },
];

export const partnerBySlug = (slug: string) => PARTNER_INDUSTRIES.find((p) => p.slug === slug);
