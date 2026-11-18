/**
 * SINGLE SOURCE OF TRUTH for business facts.
 *
 * Everything a customer could hold us to (phone, coverage, credentials) lives
 * here and only here. Pages, structured data, the prerender script, llms.txt
 * and the sitemap all read from this file, so a change here propagates
 * everywhere on the next build.
 *
 * Rules (from Andrew's instructions):
 *  - Coverage is VA, NJ, CT, MA, RI only. Do not list cities until Andrew confirms them
 *    (see src/data/serviceAreas.ts).
 *  - FIRE certification is confirmed. CSIA/CSI references were removed at Andrew's request.
 *  - The 757 number is the approved line. An 804 number is under consideration but is NOT
 *    purchased; do not publish it until it is live.
 */

export const SITE = {
  name: 'First Chimney Contracting',
  shortName: 'First Chimney',
  owner: 'Andrew Paterini',
  /** Canonical origin. The apex domain 307-redirects to www, so www is canonical. */
  domain: 'https://www.firstchimneycontracting.com',
  displayDomain: 'firstchimneycontracting.com',
  phoneDisplay: '(757) 589-0783',
  phoneE164: '+17575890783',
  phoneHref: 'tel:+17575890783',
  smsHref: 'sms:+17575890783',
  email: 'info@firstchimneycontracting.com',
  /** Business hours are not confirmed. Leave null until Andrew provides them. */
  hours: null as null | { days: string; time: string }[],
  logo: '/brand/logo-light.webp',
  logoPng: '/brand/logo-light.png',
  logoDark: '/brand/logo-dark.png',
  ogImage: '/og/og-default.jpg',
  social: {
    // Not yet confirmed as active profiles. Only links listed here are rendered.
    facebook: '',
    instagram: '',
  },
};

export type StateCode = 'VA' | 'NJ' | 'CT' | 'MA' | 'RI';

export const STATES: { code: StateCode; name: string; slug: string }[] = [
  { code: 'VA', name: 'Virginia', slug: 'virginia' },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey' },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut' },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts' },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island' },
];

export const STATE_LIST_TEXT = 'Virginia, New Jersey, Connecticut, Massachusetts & Rhode Island';
export const STATE_CODES_TEXT = 'VA · NJ · CT · MA · RI';

/**
 * Credentials shown on the site.
 * Verified 2026-11-14: the official F.I.R.E. Service directory lists Andrew Paterini
 * (Virginia Beach, VA) as an F.I.R.E. Certified Technician. FIRE certification is
 * an individual certification. CSIA/CSI references were removed at Andrew's request.
 */
export const CREDENTIALS = {
  fire: {
    label: 'F.I.R.E. Certified',
    title: 'F.I.R.E. Certified Technician',
    fullName: 'a F.I.R.E. Certified Technician',
    short: 'FIRE Certified',
    verifyUrl: 'http://f-i-r-e-service.com/certified_inspectors_VA.php',
    verifyLabel: 'F.I.R.E. Service directory of Virginia certified technicians',
  },
};

/**
 * Stock / illustrative photography. Not First Chimney job photos; never caption
 * these as "our work". Andrew's real photos live in src/data/team.ts.
 */
const P = '/media/photos/';
export const IMAGES = {
  heroVideo: '/media/hero-fire.mp4',
  heroPoster: '/media/hero-fire-poster.jpg',
  stoveVideo: '/media/stove-fire.mp4',
  stovePoster: '/media/stove-fire-poster.jpg',
  brickArch: `${P}fireplace-brick-arch.webp`,
  logsGlow: `${P}fireplace-logs-glow.webp`,
  brickWide: `${P}fireplace-brick-wide.webp`,
  capSky: `${P}chimney-cap-sky.webp`,
  crownFlue: `${P}chimney-crown-flue.webp`,
  sweepStone: `${P}chimney-sweep-stone-fireplace.webp`,
  techRooftop: `${P}chimney-tech-rooftop.webp`,
  sweepRotary: `${P}chimney-sweep-rotary.webp`,
  dropCloths: `${P}chimney-cleaning-drop-cloths.webp`,
  inspectionCloseup: `${P}fireplace-inspection-closeup.webp`,
  rooftopWide: `${P}rooftop-sweep-wide.webp`,
  rooftopBrush: `${P}rooftop-sweep-brush.webp`,
  chimneyTopSky: `${P}chimney-top-brush-sky.webp`,
  cleaningSetup: `${P}fireplace-cleaning-setup.webp`,
  outdoorStone: `${P}outdoor-stone-fireplace.webp`,
  fireboxBrush: `${P}firebox-brush.webp`,
  flueRoof: `${P}chimney-flue-inspection-roof.webp`,
};
