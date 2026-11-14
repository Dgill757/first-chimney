/**
 * Client side of the lead pipeline:
 *   form -> submitLead() -> POST /api/lead (Vercel function) -> GoHighLevel
 *
 * The browser never sees a CRM credential. It sends plain JSON to our own
 * endpoint; the function holds the webhook URL / private token in env vars.
 *
 * A submission only counts as success when the server says the CRM accepted it.
 * If the CRM is not configured or is down, the visitor is told plainly and shown
 * the phone number. We never fake a success screen.
 */
import { getAttribution, track, type Attribution } from './track';

export type FormId =
  | 'holiday-199'
  | 'contact'
  | 'service-request'
  | 'fireplace-designer'
  | 'shop-quote'
  | 'promo-save';

export type LeadInput = {
  formId: FormId;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  service?: string;
  timeframe?: string;
  message?: string;
  /** Free text: fireplace configuration summary or selected products. */
  details?: string;
  products?: string[];
  promo?: string;
  consent: boolean;
  smsConsent?: boolean;
  /** Honeypot. Real people never fill this. */
  website?: string;
};

export type LeadPayload = LeadInput & {
  sourcePage: string;
  attribution: Attribution;
  submittedAt: string;
};

type FailCode = 'not_configured' | 'invalid' | 'rate_limited' | 'crm_error' | 'network';

export type LeadResult =
  | { ok: true; ref: string }
  | { ok: false; code: FailCode; message: string; fields?: Record<string, string> };

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const payload: LeadPayload = {
    ...input,
    sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
    attribution: getAttribution(),
    submittedAt: new Date().toISOString(),
  };
  track('form_submit', { form: input.formId });
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      ref?: string;
      code?: FailCode;
      message?: string;
      fields?: Record<string, string>;
    };
    if (res.ok && data.ok && data.ref) {
      track('form_success', { form: input.formId, promo: input.promo });
      return { ok: true, ref: data.ref };
    }
    const result: LeadResult = {
      ok: false,
      code: data.code ?? 'crm_error',
      message: data.message ?? 'We could not send your request.',
      fields: data.fields,
    };
    track('form_error', { form: input.formId, code: result.code });
    return result;
  } catch {
    track('form_error', { form: input.formId, code: 'network' });
    return { ok: false, code: 'network', message: 'Your connection dropped before the request was sent.' };
  }
}

/* ------------------------------------------------------------------ */
/* Validation shared by every form (the server re-validates).          */
/* ------------------------------------------------------------------ */

export function digits(v: string): string {
  return v.replace(/\D/g, '');
}

export function isValidPhone(v: string): boolean {
  const d = digits(v);
  return d.length === 10 || (d.length === 11 && d.startsWith('1'));
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function isValidZip(v: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(v.trim());
}

/** Formats as (757) 589-0783 while typing. */
export function formatPhone(v: string): string {
  let d = digits(v);
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
