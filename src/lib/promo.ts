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
  /** Short line for tight spaces (popup, hero card). */
  short: 'Get your fireplace ready before the guests arrive.',
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
  /** Code printed on the coupon. Customers mention it when booking; Andrew sees it on the CRM tag. */
  code: 'HOLIDAY199',
  couponImage: '/promo/first-chimney-holiday-coupon.jpg',
  /** On-site popup. Shown once per session after a delay or scroll; respects dismissal for `cooldownDays`. */
  popup: { enabled: true, delayMs: 9000, scrollFraction: 0.35, cooldownDays: 3 },
} as const;

/** Whether the offer should render right now. */
export function promoIsLive(now: Date = new Date()): boolean {
  if (!HOLIDAY_PROMO.live) return false;
  if (!HOLIDAY_PROMO.validThrough) return true;
  return now <= new Date(`${HOLIDAY_PROMO.validThrough}T23:59:59`);
}

/** Pure decision for whether the popup may open on this visit. Unit tested. */
export function shouldShowPopup(o: { pathname: string; preview: boolean; now: number; shownThisSession: boolean; dismissedAt: number | null; claimed: boolean }): boolean {
  if (o.preview) return true;
  if (!HOLIDAY_PROMO.popup.enabled || !promoIsLive(new Date(o.now))) return false;
  if (o.claimed || o.shownThisSession) return false;
  if (['/holiday-chimney-special', '/design-your-fireplace', '/fireplace-shop/quote', '/contact', '/privacy-policy'].some((p) => o.pathname.startsWith(p))) return false;
  if (o.dismissedAt && o.now - o.dismissedAt < HOLIDAY_PROMO.popup.cooldownDays * 86_400_000) return false;
  return true;
}

/** A calendar file reminding the visitor to book. Opens "Add to Calendar" on phones. */
export function reminderIcs(now: Date, phone: string, url: string): string {
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start.getTime() + 15 * 60_000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//First Chimney Contracting//Holiday Special//EN',
    'BEGIN:VEVENT',
    `UID:holiday199-${start.getTime()}@firstchimneycontracting.com`,
    `DTSTAMP:${f(now)}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:Book First Chimney $199 holiday chimney special`,
    `DESCRIPTION:Chimney cleaning + inspection for $199. Code ${HOLIDAY_PROMO.code}. Call or text ${phone}. ${url}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
