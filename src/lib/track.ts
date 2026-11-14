/**
 * Analytics + attribution.
 *
 * No analytics vendor is installed yet. `track()` pushes to whichever of these
 * exist on the page, so adding GA4 / GTM / Meta Pixel later needs zero code
 * changes: window.dataLayer (GTM), window.gtag (GA4), window.fbq (Meta).
 *
 * Attribution is first-touch for the session plus last-touch UTMs, captured on
 * the first page view and attached to every lead so the CRM knows which post,
 * ad or link produced the inquiry.
 */

type Props = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type EventName =
  | 'page_view'
  | 'promo_view'
  | 'promo_cta_click'
  | 'promo_save'
  | 'promo_share'
  | 'form_start'
  | 'form_submit'
  | 'form_success'
  | 'form_error'
  | 'click_to_call'
  | 'click_to_text'
  | 'designer_step'
  | 'designer_save'
  | 'shop_quote_add'
  | 'cta_click';

export function track(event: EventName, props: Props = {}): void {
  if (typeof window === 'undefined') return;
  const payload = { ...props, ...pickUtm(getAttribution()) };
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
    window.gtag?.('event', event, payload);
    window.fbq?.('trackCustom', event, payload);
    if (import.meta.env.DEV) console.debug('[track]', event, payload);
  } catch {
    /* analytics must never break the page */
  }
}

export type Attribution = {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  firstSeen?: string;
};

const KEY = 'fc.attr.v1';

function safeRead(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

/** Call once on app start. Keeps first landing page/referrer; refreshes UTMs if new ones arrive. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  const q = new URLSearchParams(window.location.search);
  const prev = safeRead() ?? {};
  const fresh: Attribution = {
    utmSource: q.get('utm_source') ?? undefined,
    utmMedium: q.get('utm_medium') ?? undefined,
    utmCampaign: q.get('utm_campaign') ?? undefined,
    utmContent: q.get('utm_content') ?? undefined,
    utmTerm: q.get('utm_term') ?? undefined,
    gclid: q.get('gclid') ?? undefined,
    fbclid: q.get('fbclid') ?? undefined,
  };
  const hasFresh = Object.values(fresh).some(Boolean);
  const next: Attribution = {
    landingPage: prev.landingPage ?? window.location.pathname + window.location.search,
    referrer: prev.referrer ?? (document.referrer || undefined),
    firstSeen: prev.firstSeen ?? new Date().toISOString(),
    ...(hasFresh ? fresh : pickUtm(prev)),
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
}

export function getAttribution(): Attribution {
  return safeRead() ?? {};
}

function pickUtm(a: Attribution): Attribution {
  const out: Attribution = {};
  (['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm', 'gclid', 'fbclid'] as const).forEach((k) => {
    if (a[k]) out[k] = a[k];
  });
  return out;
}
