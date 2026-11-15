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
 *   GHL_PIPELINE_ID      Optional override. Without it, opportunities are routed by pipeline
 *   GHL_PIPELINE_STAGE_ID  NAME (Jobs, Fireplace Projects, Partners, Recruiting), looked up once.
 *
 * With the token, every form also fills the sub-account's custom fields (matched by field
 * key, e.g. contact.health_check_result), and job applications upload the resume to the
 * GHL media library and save its link in "Resume Link".
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

export const FORM_IDS = [
  'holiday-199',
  'contact',
  'service-request',
  'fireplace-designer',
  'shop-quote',
  'promo-save',
  'testimonial',
  'safety-check',
  'partner',
  'job-application',
  'referral',
  'reminder',
] as const;
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
  resume: Resume | null;
};

export type Resume = { name: string; type: string; data: string };
const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/rtf'];
export const RESUME_MAX_BYTES = 3 * 1024 * 1024;

/** Validates a base64 resume. Returns an error message, or null when acceptable. */
export function checkResume(r: unknown): { resume: Resume | null; error?: string } {
  if (r == null || r === '') return { resume: null };
  if (typeof r !== 'object') return { resume: null, error: 'Resume upload failed. Please try again.' };
  const o = r as Record<string, unknown>;
  const name = typeof o.name === 'string' ? o.name.replace(/[^\w.\- ]/g, '').slice(0, 120) : '';
  const type = typeof o.type === 'string' ? o.type : '';
  const data = typeof o.data === 'string' ? o.data.replace(/^data:[^,]*,/, '') : '';
  if (!name || !data) return { resume: null, error: 'Resume upload failed. Please try again.' };
  if (!RESUME_TYPES.includes(type) && !/\.(pdf|docx?|txt|rtf)$/i.test(name)) return { resume: null, error: 'Please upload a PDF, Word or text file.' };
  if (Math.floor((data.length * 3) / 4) > RESUME_MAX_BYTES) return { resume: null, error: 'Please upload a file under 3 MB.' };
  if (!/^[A-Za-z0-9+/=\s]+$/.test(data)) return { resume: null, error: 'Resume upload failed. Please try again.' };
  return { resume: { name, type: type || 'application/octet-stream', data } };
}

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
  if (formId === 'job-application' && !phone && !fields.phone) fields.phone = 'Please add a phone number so Andrew can call you.';

  const zip = str(b.zip, 10);
  if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) fields.zip = 'Please enter a 5-digit ZIP code.';

  if (b.consent !== true) fields.consent = 'Please confirm we may contact you about this request.';

  const resumeCheck = checkResume(b.resume);
  if (resumeCheck.error) fields.resume = resumeCheck.error;

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
      resume: formId === 'job-application' ? resumeCheck.resume : null,
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
  'safety-check': 'Chimney Health Check',
  partner: 'Real Estate Partner',
  'job-application': 'Job Application',
  referral: 'Customer Referral',
  reminder: 'Annual Reminder Signup',
};

/**
 * Forms that represent a homeowner who may need work. Only these get `Website Lead`
 * (which fires Andrew's new-lead alert) and open a job opportunity. Applicants,
 * partners, testimonials and reminder sign-ups have their own tags and workflows.
 */
const SALES_FORMS: ReadonlySet<FormId> = new Set<FormId>(['holiday-199', 'contact', 'service-request', 'fireplace-designer', 'shop-quote', 'promo-save', 'safety-check', 'referral']);
export const isSalesLead = (formId: FormId) => SALES_FORMS.has(formId);

/** Tags that start GHL workflows. Re-applied for returning contacts so automations fire again. */
export const TRIGGER_TAGS: ReadonlySet<string> = new Set([
  'Website Lead',
  HOLIDAY_TAG,
  'Chimney Health Check',
  'Fireplace Design Request',
  'Product Quote Request',
  'Testimonial',
  'Referral',
  'Referral Partner',
  'Job Applicant',
  'Annual Reminder',
]);

/** Reads a "Key: value" line the site writes into `details`. */
export function detail(lead: Pick<Lead, 'details'>, key: string): string {
  const m = lead.details.match(new RegExp(`^${key}: (.+)$`, 'm'));
  return m ? m[1].trim().slice(0, 60) : '';
}

/** Which pipeline/stage each form opens an opportunity in (by name, so snapshots keep working). */
export function pipelineFor(formId: FormId): { pipeline: string; stage: string } | null {
  if (formId === 'fireplace-designer' || formId === 'shop-quote') return { pipeline: 'Fireplace Projects', stage: 'New Design Request' };
  if (formId === 'partner') return { pipeline: 'Partners', stage: 'New Partner' };
  if (formId === 'job-application') return { pipeline: 'Recruiting', stage: 'Applied' };
  if (formId === 'testimonial' || formId === 'reminder') return null;
  return { pipeline: 'Jobs', stage: 'New Lead' };
}

/** Values for the sub-account's custom fields, keyed by GHL field key. Empty values are skipped. */
export function customFieldValues(lead: Lead, ref: string, resumeUrl = ''): Record<string, string> {
  const a = lead.attribution;
  const v: Record<string, string> = {
    'contact.lead_form': FORM_LABEL[lead.formId],
    'contact.website_reference': ref,
    'contact.service_requested': lead.service,
    'contact.preferred_timeframe': lead.timeframe,
    'contact.promo_code': lead.promo,
    'contact.first_landing_page': a.landingPage ?? '',
    'contact.utm_source': a.utmSource ?? '',
    'contact.utm_medium': a.utmMedium ?? '',
    'contact.utm_campaign': a.utmCampaign ?? '',
  };
  if (lead.formId === 'safety-check') {
    v['contact.health_check_result'] = detail(lead, 'Result');
    v['contact.health_check_answers'] = lead.details;
  }
  if (lead.formId === 'partner') {
    v['contact.partner_role'] = detail(lead, 'Role');
    v['contact.partner_company'] = detail(lead, 'Company');
  }
  if (lead.formId === 'job-application') {
    v['contact.position_applied'] = detail(lead, 'Position');
    v['contact.driver_license'] = detail(lead, 'Driver license');
    v['contact.comfortable_on_roofs'] = detail(lead, 'Comfortable on roofs and ladders');
    v['contact.years_of_experience'] = detail(lead, 'Years of experience');
    v['contact.available_start_date'] = detail(lead, 'Available to start');
    v['contact.resume_link'] = resumeUrl;
  }
  if (lead.formId === 'referral') {
    v['contact.referred_friend_details'] = lead.message;
    v['contact.referral_code'] = detail(lead, 'Referral code');
  }
  if (lead.formId === 'testimonial') {
    v['contact.testimonial_text'] = lead.message;
    v['contact.publish_permission'] = /Permission to publish: YES/.test(lead.details) ? 'Yes' : 'No';
  }
  if (lead.formId === 'fireplace-designer') v['contact.fireplace_design_summary'] = lead.details;
  if (lead.products.length) v['contact.products_of_interest'] = lead.products.join('\n');
  for (const k of Object.keys(v)) if (!v[k]) delete v[k];
  return v;
}

/* Per-instance caches of the sub-account's field ids and pipelines. */
let fieldCache: Promise<Map<string, string>> | null = null;
let pipelineCache: Promise<{ id: string; name: string; stages: { id: string; name: string }[] }[]> | null = null;

export function buildTags(lead: Lead): string[] {
  const tags = new Set<string>(['Website Form', `Form: ${FORM_LABEL[lead.formId]}`]);
  if (isSalesLead(lead.formId)) tags.add('Website Lead');
  if (lead.formId === 'holiday-199' || lead.formId === 'promo-save' || lead.promo === 'holiday-199-cleaning-inspection') tags.add(HOLIDAY_TAG);
  if (lead.formId === 'fireplace-designer') tags.add('Fireplace Design Request');
  if (lead.formId === 'shop-quote') tags.add('Product Quote Request');
  if (lead.formId === 'testimonial') tags.add('Testimonial');
  if (lead.formId === 'safety-check') {
    tags.add('Chimney Health Check');
    const result = detail(lead, 'Result');
    if (result) tags.add(`Health Check: ${result}`);
  }
  if (lead.formId === 'partner') {
    tags.add('Referral Partner');
    const role = detail(lead, 'Role');
    if (role) tags.add(`Partner: ${role}`);
  }
  if (lead.formId === 'job-application') {
    tags.add('Recruiting');
    tags.add('Job Applicant');
    const position = detail(lead, 'Position');
    if (position) tags.add(`Applied: ${position}`);
  }
  if (lead.formId === 'referral') tags.add('Referral');
  if (lead.formId === 'reminder') tags.add('Annual Reminder');
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
          let resumeUrl = '';
          if (lead.resume) {
            try {
              const fd = new FormData();
              const bytes = Uint8Array.from(atob(lead.resume.data.replace(/\s/g, '')), (c) => c.charCodeAt(0));
              fd.append('file', new Blob([bytes], { type: lead.resume.type }), `${ref}-${lead.resume.name}`);
              fd.append('name', `${ref}-${lead.resume.name}`);
              const up = await doFetch(`${GHL_BASE}/medias/upload-file`, { method: 'POST', headers: { Authorization: headers.Authorization, Version: GHL_VERSION }, body: fd });
              if (up.ok) resumeUrl = ((await up.json().catch(() => ({}))) as { url?: string }).url ?? '';
              else console.error(`[lead ${ref}] resume upload HTTP ${up.status}`);
            } catch (e) {
              console.error(`[lead ${ref}] resume upload failed: ${String(e).slice(0, 120)}`);
            }
          }

          fieldCache ??= doFetch(`${GHL_BASE}/locations/${env.GHL_LOCATION_ID}/customFields?model=all`, { headers })
            .then((r) => (r.ok ? r.json() : { customFields: [] }))
            .then((d: { customFields?: { id: string; fieldKey?: string }[] }) => new Map((d.customFields ?? []).filter((f) => f.fieldKey).map((f) => [f.fieldKey as string, f.id])))
            .catch(() => new Map<string, string>());
          const ids = await fieldCache;
          if (!ids.size) fieldCache = null;
          const customFields = Object.entries(customFieldValues(lead, ref, resumeUrl))
            .filter(([k]) => ids.has(k))
            .map(([k, value]) => ({ id: ids.get(k), field_value: value }));

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
            ...(customFields.length ? { customFields } : {}),
          };
          Object.keys(contact).forEach((k) => contact[k] === undefined && delete contact[k]);
          const res = await withRetry(doFetch, `${GHL_BASE}/contacts/upsert`, { method: 'POST', headers, body: JSON.stringify(contact) });
          const data = (await res.json().catch(() => ({}))) as { contact?: { id?: string }; id?: string; new?: boolean };
          const contactId = data.contact?.id ?? data.id;
          out.api = true;
          out.contactId = contactId;
          if (!contactId) return;
          // GHL only fires "tag added" for tags the contact does not already have. A returning
          // contact (new === false) would silently skip every automation, so remove the tags that
          // trigger workflows and add them back.
          if (data.new === false) {
            const current = buildTags(lead);
            if (lead.formId === 'safety-check') {
              const stale = ['Health Check: Urgent', 'Health Check: Soon', 'Health Check: Good'].filter((t) => !current.includes(t));
              await withRetry(doFetch, `${GHL_BASE}/contacts/${contactId}/tags`, { method: 'DELETE', headers, body: JSON.stringify({ tags: stale }) }).catch(() => undefined);
            }
            const triggers = current.filter((t) => TRIGGER_TAGS.has(t));
            if (triggers.length) {
              await withRetry(doFetch, `${GHL_BASE}/contacts/${contactId}/tags`, { method: 'DELETE', headers, body: JSON.stringify({ tags: triggers }) }).catch(() => undefined);
              await withRetry(doFetch, `${GHL_BASE}/contacts/${contactId}/tags`, { method: 'POST', headers, body: JSON.stringify({ tags: triggers }) }).catch((e) =>
                console.error(`[lead ${ref}] re-tag failed: ${String(e).slice(0, 120)}`),
              );
            }
          }
          // The contact is already saved; a failed note or opportunity must not fail the lead.
          await withRetry(doFetch, `${GHL_BASE}/contacts/${contactId}/notes`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ body: buildNote(lead, ref) + (resumeUrl ? `\nResume: ${resumeUrl}` : lead.resume ? '\nResume: upload failed, ask the applicant to email it.' : '') }),
          }).catch((e) => console.error(`[lead ${ref}] note failed: ${String(e).slice(0, 120)}`));
          const route = pipelineFor(lead.formId);
          let pipelineId = env.GHL_PIPELINE_ID && isSalesLead(lead.formId) ? env.GHL_PIPELINE_ID : '';
          let stageId = pipelineId ? (env.GHL_PIPELINE_STAGE_ID ?? '') : '';
          if (!pipelineId && route) {
            pipelineCache ??= doFetch(`${GHL_BASE}/opportunities/pipelines?locationId=${env.GHL_LOCATION_ID}`, { headers })
              .then((r) => (r.ok ? r.json() : { pipelines: [] }))
              .then((d: { pipelines?: { id: string; name: string; stages: { id: string; name: string }[] }[] }) => d.pipelines ?? [])
              .catch(() => []);
            const list = await pipelineCache;
            if (!list.length) pipelineCache = null;
            const p = list.find((x) => x.name.toLowerCase() === route.pipeline.toLowerCase());
            const st = p?.stages.find((x) => x.name.toLowerCase() === route.stage.toLowerCase()) ?? p?.stages[0];
            if (p && st) {
              pipelineId = p.id;
              stageId = st.id;
            }
          }
          if (pipelineId && stageId) {
            await withRetry(doFetch, `${GHL_BASE}/opportunities/`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                locationId: env.GHL_LOCATION_ID,
                pipelineId,
                pipelineStageId: stageId,
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
    if (body.length > 4_400_000) return res.status(413).json({ ok: false, code: 'invalid', message: 'Request too large.' });
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
