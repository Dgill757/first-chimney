/**
 * HOLIDAY $199 CHIMNEY CLEANING + INSPECTION
 *
 * Source: Andrew Paterini voice messages. Most recent:
 *   "...if you could do a 199 cleaning and inspection cleaning discount for the
 *    holiday season promo, I would love that right now so I can post it to my friends."
 * Earlier messages described it as a Level 1 inspection with cleaning.
 *
 * Every word that appears on the banner, landing page, homepage section, social
 * creative and CRM tag comes from this object. Change it here, rebuild, done.
 *
 * NOT INVENTED: no expiration date, no per-flue limit, no extra fees and no
 * eligibility rules are published, because Andrew has not given any. When he
 * does, fill `validThrough` / `finePrint` and the whole site updates.
 */
export const HOLIDAY_PROMO = {
  id: 'holiday-2026-199',
  /** Master switch. false hides the bar, the homepage section and the nav badge. */
  live: true,
  campaign: 'holiday-199-cleaning-inspection',
  /** Exact CRM tag requested in the brief. */
  crmTag: 'Holiday Special - $199',
  eyebrow: 'Holiday Chimney Special',
  price: 199,
  priceLabel: '$199',
  title: 'Chimney Cleaning + Inspection',
  /** Andrew's earlier message: Level 1 inspection. Confirm before adding "Level 1" to headlines. */
  inspectionLevel: 'Level 1',
  pitch:
    'Get your fireplace ready for the holiday season with professional chimney cleaning and inspection from First Chimney Contracting.',
  barText: 'Holiday Special: Chimney Cleaning + Inspection for $199',
  path: '/holiday-chimney-special',
  /** ISO date or null. null = "holiday season" with no hard end date published. */
  validThrough: null as string | null,
  validThroughLabel: null as string | null,
  includes: [
    {
      title: 'Professional chimney cleaning',
      body: 'Soot and creosote are brushed out of the flue and smoke chamber, with the firebox and hearth protected so the room stays clean.',
    },
    {
      title: 'Chimney inspection',
      body: 'A visual check of the readily accessible parts of the chimney and fireplace: firebox, damper, smoke chamber, flue, crown and cap where reachable.',
    },
    {
      title: 'Straight answers on what we find',
      body: 'You get a plain-English walkthrough of the condition of your chimney. If anything needs attention, we explain it and quote it before any extra work happens.',
    },
  ],
  /** Shown under the price everywhere. Only facts, no invented restrictions. */
  finePrint: [
    'Holiday season pricing for chimney cleaning and inspection.',
    'Repairs are never started without your approval. If we find something, you get a quote first.',
    'Submitting the form is a request, not a confirmed booking. We call or text to set your appointment.',
  ],
  image: '/media/photos/fireplace-logs-glow.webp',
  ogImage: '/og/og-holiday-199.jpg',
} as const;

/** Whether the offer should render right now. */
export function promoIsLive(now: Date = new Date()): boolean {
  if (!HOLIDAY_PROMO.live) return false;
  if (!HOLIDAY_PROMO.validThrough) return true;
  return now <= new Date(`${HOLIDAY_PROMO.validThrough}T23:59:59`);
}

/**
 * Non-sensitive reference shown to a visitor who saves the offer, so they can
 * mention it on the phone. Derived from time + randomness only; contains no
 * personal data and is not a reservation.
 */
export function makeOfferRef(now: number = Date.now(), rand: () => number = Math.random): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let s = '';
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(rand() * alphabet.length)];
  const day = new Date(now).toISOString().slice(5, 10).replace('-', '');
  return `FC199-${day}-${s}`;
}
