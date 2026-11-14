/**
 * POST /api/lead  (Vercel Node function)
 *
 * Receives every website form and delivers it to Andrew's existing GoHighLevel
 * sub-account (provided by Summit Marketing Group). This is NOT a second CRM:
 * nothing is stored here.
 *
 * Delivery paths (configure one or both in Vercel > Settings > Environment Variables):
 *   GHL_WEBHOOK_URL      Inbound Webhook trigger URL from a GHL workflow. Simplest setup.
 *   GHL_PRIVATE_TOKEN    Private Integration token (pit-...) for Andrew's sub-account,
 *   GHL_LOCATION_ID      plus its Location ID. Upserts the contact, adds tags and a note.
 *   GHL_PIPELINE_ID      Optional. With GHL_PIPELINE_STAGE_ID, also opens an opportunity
 *   GHL_PIPELINE_STAGE_ID  in the job pipeline for every lead.
 *
 * Secrets never reach the browser, the repo or the logs. Logs contain only the
 * form id, reference and a redacted summary.
 *
 * Self-contained on purpose: Vercel compiles each function file on its own, so
 * this file imports nothing from src/.
 */

type Req = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
};
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};
type Fetch = typeof fetch;

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1200;

export const FORM_IDS = ['holiday-199', 'contact', 'service-request', 'fireplace-designer', 'shop-quote', 'promo-save', 'testimonial'] as const;
export type FormId = (typeof FORM_IDS)[number];

export const HOLIDAY_TAG = 'Holiday Special - $199';

export type Lead = {
  formId: FormId;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  service: string;
  timeframe: string;
  message: string;
  details: string;
  products: string[];
  promo: string;
  consent: boolean;
  smsConsent: boolean;
  sourcePage: string;
  submittedAt: string;
  attribution: Record<string, string>;
};

/* ------------------------------------------------------------------ */
/* Validation                                                           */
/* ------------------------------------------------------------------ */

const str = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : '';

export function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] ?? '', lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function normalizePhone(v: string): string {
  const d = v.replace(/\D/g, '');
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  return '';
}

export function validateLead(input: unknown): { ok: true; lead: Lead } | { ok: false; fields: Record<string, string> } {
  const b = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const fields: Record<string, string> = {};

  const formId = str(b.formId, 40) as FormId;
  if (!FORM_IDS.includes(formId)) fields.formId = 'Unknown form.';

  const name = str(b.name, 120);
  if (name.length < 2) fields.name = 'Please enter your name.';

  const rawPhone = str(b.phone, 40);
  const phone = rawPhone ? normalizePhone(rawPhone) : '';
  if (rawPhone && !phone) fields.phone = 'Please enter a 10-digit US phone number.';

  const email = str(b.email, 160).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fields.email = 'That email does not look right.';

  if (!phone && !email && !fields.phone && !fields.email) fields.phone = 'Add a phone number or email so we can reach you.';
  // The holiday and service forms are scheduling requests, so a phone number is required.
  if ((formId === 'holiday-199' || formId === 'service-request') && !phone && !fields.phone) fields.phone = 'Please add a phone number so we can schedule.';

  const zip = str(b.zip, 10);
  if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) fields.zip = 'Please enter a 5-digit ZIP code.';

  if (b.consent !== true) fields.consent = 'Please confirm we may contact you about this request.';

  if (Object.keys(fields).length) return { ok: false, fields };

  const attrIn = (b.attribution && typeof b.attribution === 'object' ? b.attribution : {}) as Record<string, unknown>;
  const attribution: Record<string, string> = {};
  for (const k of ['landingPage', 'referrer', 'utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm', 'gclid', 'fbclid', 'firstSeen']) {
    const v = str(attrIn[k], 300);
    if (v) attribution[k] = v;
  }

  const products = Array.isArray(b.products) ? b.products.map((p) => str(p, 120)).filter(Boolean).slice(0, 12) : [];

  return {
    ok: true,
    lead: {
      formId,
      ...splitName(name),
      name,
      phone,
      email,
      address: str(b.address, 160),
      city: str(b.city, 80),
      state: str(b.state, 40),
      zip,
      service: str(b.service, 120),
      timeframe: str(b.timeframe, 80),
      message: str(b.message, 2000),
      details: str(b.details, 4000),
      products,
      promo: str(b.promo, 80),
      consent: true,
      smsConsent: b.smsConsent === true,
      sourcePage: str(b.sourcePage, 200),
      submittedAt: str(b.submittedAt, 40) || new Date().toISOString(),
      attribution,
    },
  };
}

/* ------------------------------------------------------------------ */
/* CRM mapping                                                          */
/* ------------------------------------------------------------------ */

const FORM_LABEL: Record<FormId, string> = {
  'holiday-199': 'Holiday $199 Cleaning + Inspection',
  contact: 'Contact Form',
  'service-request': 'Service Request',
  'fireplace-designer': 'Fireplace Designer',
  'shop-quote': 'Fireplace Shop Quote',
  'promo-save': 'Saved Holiday Offer',
  testimonial: 'Customer Testimonial',
};

export function buildTags(lead: Lead): string[] {
  const tags = new Set<string>(['Website Lead', `Form: ${FORM_LABEL[lead.formId]}`]);
  if (lead.formId === 'holiday-199' || lead.formId === 'promo-save' || lead.promo === 'holiday-199-cleaning-inspection') tags.add(HOLIDAY_TAG);
  if (lead.formId === 'fireplace-designer') tags.add('Fireplace Design Request');
  if (lead.formId === 'shop-quote') tags.add('Product Quote Request');
  if (lead.formId === 'testimonial') tags.add('Testimonial');
  if (lead.service) tags.add(`Service: ${lead.service}`);
  if (lead.state) tags.add(`State: ${lead.state}`);
  if (lead.attribution.utmSource) tags.add(`Source: ${lead.attribution.utmSource}`);
  if (lead.attribution.utmCampaign) tags.add(`Campaign: ${lead.attribution.utmCampaign}`);
  tags.add(lead.smsConsent ? 'SMS Consent: Yes' : 'SMS Consent: No');
  return [...tags];
}

export function buildNote(lead: Lead, ref: string): string {
  const a = lead.attribution;
  const lines = [
    `Website inquiry ${ref}`,
    `Form: ${FORM_LABEL[lead.formId]}`,
    lead.promo && `Promotion: ${lead.promo}`,
    lead.service && `Service requested: ${lead.service}`,
    lead.timeframe && `Preferred timeframe: ${lead.timeframe}`,
    (lead.address || lead.city || lead.state || lead.zip) &&
      `Service address: ${[lead.address, lead.city, lead.state, lead.zip].filter(Boolean).join(', ')}`,
    lead.message && `\nMessage:\n${lead.message}`,
    lead.products.length && `\nProducts of interest:\n- ${lead.products.join('\n- ')}`,
    lead.details && `\nDetails:\n${lead.details}`,
    `\nSubmitted from: ${lead.sourcePage || 'unknown page'}`,
    a.landingPage && `First landing page: ${a.landingPage}`,
    a.referrer && `Referrer: ${a.referrer}`,
    (a.utmSource || a.utmMedium || a.utmCampaign) &&
      `UTM: ${[a.utmSource, a.utmMedium, a.utmCampaign, a.utmContent].filter(Boolean).join(' / ')}`,
    `Contact consent: yes. SMS consent: ${lead.smsConsent ? 'yes' : 'no'}.`,
    'Status: inquiry only. Not a confirmed appointment.',
  ].filter(Boolean);
  return lines.join('\n');
}

/** Flat JSON for the GHL inbound-webhook trigger. Every key is mappable in the workflow builder. */
export function webhookBody(lead: Lead, ref: string) {
  return {
    ref,
    form: FORM_LABEL[lead.formId],
    form_id: lead.formId,
    first_name: lead.firstName,
    last_name: lead.lastName,
    full_name: lead.name,
    phone: lead.phone,
    email: lead.email,
    address1: lead.address,
    city: lead.city,
    state: lead.state,
    postal_code: lead.zip,
    service: lead.service,
    timeframe: lead.timeframe,
    message: lead.message,
    details: lead.details,
    products: lead.products.join('; '),
    promotion: lead.promo,
    tags: buildTags(lead).join(','),
    sms_consent: lead.smsConsent ? 'yes' : 'no',
    source_page: lead.sourcePage,
    landing_page: lead.attribution.landingPage ?? '',
    referrer: lead.attribution.referrer ?? '',
    utm_source: lead.attribution.utmSource ?? '',
    utm_medium: lead.attribution.utmMedium ?? '',
    utm_campaign: lead.attribution.utmCampaign ?? '',
    utm_content: lead.attribution.utmContent ?? '',
    note: buildNote(lead, ref),
    submitted_at: lead.submittedAt,
  };
}

/* ------------------------------------------------------------------ */
/* Delivery                                                             */
/* ------------------------------------------------------------------ */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withRetry(doFetch: Fetch, url: string, init: RequestInit): Promise<Response> {
  let last: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await doFetch(url, init);
      if (res.ok) return res;
      last = new Error(`HTTP ${res.status}`);
      // 4xx other than 429 will not fix itself.
      if (res.status < 500 && res.status !== 429) break;
    } catch (err) {
      last = err;
    }
    if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
  }
  throw last ?? new Error('request failed');
}

export type Env = {
  GHL_WEBHOOK_URL?: string;
  GHL_PRIVATE_TOKEN?: string;
  GHL_LOCATION_ID?: string;
  GHL_PIPELINE_ID?: string;
  GHL_PIPELINE_STAGE_ID?: string;
};

export function isConfigured(env: Env): boolean {
  return Boolean(env.GHL_WEBHOOK_URL || (env.GHL_PRIVATE_TOKEN && env.GHL_LOCATION_ID));
}

export async function deliver(lead: Lead, ref: string, env: Env, doFetch: Fetch = fetch): Promise<{ webhook?: boolean; api?: boolean; contactId?: string }> {
  const out: { webhook?: boolean; api?: boolean; contactId?: string } = {};
  const jobs: Promise<void>[] = [];

  if (env.GHL_WEBHOOK_URL) {
    jobs.push(
      withRetry(doFetch, env.GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody(lead, ref)),
      })
        .then(() => void (out.webhook = true))
        .catch((e) => {
          out.webhook = false;
          console.error(`[lead ${ref}] webhook failed: ${String(e).slice(0, 120)}`);
        }),
    );
  }

  if (env.GHL_PRIVATE_TOKEN && env.GHL_LOCATION_ID) {
    const headers = {
      Authorization: `Bearer ${env.GHL_PRIVATE_TOKEN}`,
      Version: GHL_VERSION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    jobs.push(
      (async () => {
        try {
          const contact: Record<string, unknown> = {
            locationId: env.GHL_LOCATION_ID,
            firstName: lead.firstName || undefined,
            lastName: lead.lastName || undefined,
            name: lead.name,
            email: lead.email || undefined,
            phone: lead.phone || undefined,
            address1: lead.address || undefined,
            city: lead.city || undefined,
            state: lead.state || undefined,
            postalCode: lead.zip || undefined,
            source: `Website - ${FORM_LABEL[lead.formId]}`,
            tags: buildTags(lead),
          };
          Object.keys(contact).forEach((k) => contact[k] === undefined && delete contact[k]);
          const res = await withRetry(doFetch, `${GHL_BASE}/contacts/upsert`, { method: 'POST', headers, body: JSON.stringify(contact) });
          const data = (await res.json().catch(() => ({}))) as { contact?: { id?: string }; id?: string };
          const contactId = data.contact?.id ?? data.id;
          out.api = true;
          out.contactId = contactId;
          if (!contactId) return;
          // The contact is already saved; a failed note or opportunity must not fail the lead.
          await withRetry(doFetch, `${GHL_BASE}/contacts/${contactId}/notes`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ body: buildNote(lead, ref) }),
          }).catch((e) => console.error(`[lead ${ref}] note failed: ${String(e).slice(0, 120)}`));
          if (env.GHL_PIPELINE_ID && env.GHL_PIPELINE_STAGE_ID) {
            await withRetry(doFetch, `${GHL_BASE}/opportunities/`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                locationId: env.GHL_LOCATION_ID,
                pipelineId: env.GHL_PIPELINE_ID,
                pipelineStageId: env.GHL_PIPELINE_STAGE_ID,
                contactId,
                name: `${lead.name} - ${FORM_LABEL[lead.formId]}`,
                status: 'open',
                source: 'Website',
                ...(lead.formId === 'holiday-199' ? { monetaryValue: 199 } : {}),
              }),
            }).catch((e) => console.error(`[lead ${ref}] opportunity failed: ${String(e).slice(0, 120)}`));
          }
        } catch (e) {
          out.api = false;
          console.error(`[lead ${ref}] contact upsert failed: ${String(e).slice(0, 160)}`);
        }
      })(),
    );
  }

  await Promise.all(jobs);
  return out;
}

/* ------------------------------------------------------------------ */
/* Abuse protection (best effort on serverless)                         */
/* ------------------------------------------------------------------ */

const hits = new Map<string, number[]>();
export function rateLimited(ip: string, now = Date.now(), limit = 6, windowMs = 10 * 60_000): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

export function makeRef(now = Date.now(), rand = Math.random): string {
  return `FC-${now.toString(36).toUpperCase().slice(-5)}${Math.floor(rand() * 1296).toString(36).toUpperCase().padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Handler                                                              */
/* ------------------------------------------------------------------ */

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, code: 'invalid', message: 'Method not allowed.' });

  let body: unknown = req.body;
  if (typeof body === 'string') {
    if (body.length > 20_000) return res.status(413).json({ ok: false, code: 'invalid', message: 'Request too large.' });
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, code: 'invalid', message: 'Malformed request.' });
    }
  }

  const ref = makeRef();
  const raw = (body ?? {}) as Record<string, unknown>;

  // Honeypot: answer like a success so bots learn nothing, deliver nothing.
  if (typeof raw.website === 'string' && raw.website.trim()) return res.status(200).json({ ok: true, ref });

  const fwd = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, code: 'rate_limited', message: 'Too many requests. Please call us instead.' });
  }

  const v = validateLead(raw);
  if (!v.ok) return res.status(422).json({ ok: false, code: 'invalid', message: 'Please fix the highlighted fields.', fields: v.fields });

  const env = process.env as Env;
  if (!isConfigured(env)) {
    console.warn(`[lead ${ref}] CRM not configured. form=${v.lead.formId} state=${v.lead.state || '-'} (contact details withheld from logs)`);
    return res.status(503).json({
      ok: false,
      code: 'not_configured',
      message: 'Online requests are not connected yet. Please call or text us and we will get you scheduled.',
    });
  }

  const result = await deliver(v.lead, ref, env);
  const delivered = result.webhook === true || result.api === true;
  console.log(`[lead ${ref}] form=${v.lead.formId} webhook=${result.webhook ?? 'off'} api=${result.api ?? 'off'}`);
  if (!delivered) {
    return res.status(502).json({ ok: false, code: 'crm_error', message: 'We could not send your request right now. Please call or text us.' });
  }
  return res.status(200).json({ ok: true, ref });
}
