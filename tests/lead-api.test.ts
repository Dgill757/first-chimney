/**
 * Tests for api/lead.ts using a mocked fetch, so no real CRM is touched.
 * Run: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler, { buildNote, buildTags, checkResume, customFieldValues, deliver, HOLIDAY_TAG, isConfigured, normalizePhone, pipelineFor, splitName, validateLead } from '../api/lead.ts';

const base = {
  formId: 'holiday-199',
  name: 'Pat Example Homeowner',
  phone: '(757) 555-0142',
  email: 'pat@example.com',
  address: '12 Hearth Lane',
  city: 'Norfolk',
  state: 'VA',
  zip: '23510',
  timeframe: 'Before the holidays',
  promo: 'holiday-199-cleaning-inspection',
  consent: true,
  smsConsent: true,
  sourcePage: '/holiday-chimney-special',
  attribution: { utmSource: 'facebook', utmCampaign: 'holiday-199', landingPage: '/holiday-chimney-special?utm_source=facebook' },
};

function mockRes() {
  const r: { code: number; body: any; headers: Record<string, string> } = { code: 0, body: null, headers: {} };
  const res = {
    status(c: number) { r.code = c; return res; },
    json(b: unknown) { r.body = b; },
    setHeader(k: string, v: string) { r.headers[k] = v; },
    end() {},
  };
  return { r, res };
}

test('splitName and normalizePhone', () => {
  assert.deepEqual(splitName('Pat Example Homeowner'), { firstName: 'Pat', lastName: 'Example Homeowner' });
  assert.deepEqual(splitName('Pat'), { firstName: 'Pat', lastName: '' });
  assert.equal(normalizePhone('757-555-0142'), '+17575550142');
  assert.equal(normalizePhone('1 (757) 555 0142'), '+17575550142');
  assert.equal(normalizePhone('555-0142'), '');
});

test('validateLead accepts a complete holiday request', () => {
  const v = validateLead(base);
  assert.equal(v.ok, true);
  if (v.ok) {
    assert.equal(v.lead.phone, '+17575550142');
    assert.equal(v.lead.firstName, 'Pat');
  }
});

test('validateLead requires consent, a name and a phone for holiday requests', () => {
  const v = validateLead({ ...base, consent: false, name: 'x', phone: '' });
  assert.equal(v.ok, false);
  if (!v.ok) {
    assert.ok(v.fields.consent);
    assert.ok(v.fields.name);
    assert.ok(v.fields.phone);
  }
});

test('validateLead rejects unknown forms and bad zip', () => {
  const v = validateLead({ ...base, formId: 'evil', zip: '12' });
  assert.equal(v.ok, false);
  if (!v.ok) {
    assert.ok(v.fields.formId);
    assert.ok(v.fields.zip);
  }
});

test('holiday leads carry the exact CRM tag and attribution tags', () => {
  const v = validateLead(base);
  assert.ok(v.ok);
  if (!v.ok) return;
  const tags = buildTags(v.lead);
  assert.ok(tags.includes(HOLIDAY_TAG));
  assert.equal(HOLIDAY_TAG, 'Holiday Special - $199');
  assert.ok(tags.includes('Source: facebook'));
  assert.ok(tags.includes('Campaign: holiday-199'));
  assert.ok(tags.includes('SMS Consent: Yes'));
  const note = buildNote(v.lead, 'FC-TEST');
  assert.match(note, /Not a confirmed appointment/);
  assert.match(note, /12 Hearth Lane, Norfolk, VA, 23510/);
});

test('isConfigured needs a webhook or token+location', () => {
  assert.equal(isConfigured({}), false);
  assert.equal(isConfigured({ GHL_PRIVATE_TOKEN: 'pit-x' }), false);
  assert.equal(isConfigured({ GHL_PRIVATE_TOKEN: 'pit-x', GHL_LOCATION_ID: 'loc' }), true);
  assert.equal(isConfigured({ GHL_WEBHOOK_URL: 'https://example.test/hook' }), true);
});

test('deliver: API path upserts contact, adds note and opportunity', async () => {
  const v = validateLead(base);
  assert.ok(v.ok);
  if (!v.ok) return;
  const calls: { url: string; body: any; auth?: string }[] = [];
  const fake = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)), auth: (init.headers as Record<string, string>).Authorization });
    if (url.endsWith('/contacts/upsert')) return new Response(JSON.stringify({ contact: { id: 'c_123' } }), { status: 200 });
    return new Response('{}', { status: 200 });
  }) as typeof fetch;
  const out = await deliver(v.lead, 'FC-T1', { GHL_PRIVATE_TOKEN: 'pit-test', GHL_LOCATION_ID: 'loc_1', GHL_PIPELINE_ID: 'p1', GHL_PIPELINE_STAGE_ID: 's1' }, fake);
  assert.equal(out.api, true);
  assert.equal(out.contactId, 'c_123');
  assert.equal(calls.length, 3);
  assert.ok(calls[0].body.tags.includes(HOLIDAY_TAG));
  assert.equal(calls[0].auth, 'Bearer pit-test');
  assert.match(calls[1].url, /contacts\/c_123\/notes$/);
  assert.equal(calls[2].body.monetaryValue, 199);
});

test('deliver: webhook path posts flat mappable JSON', async () => {
  const v = validateLead({ ...base, formId: 'fireplace-designer', details: 'Style: Modern linear' });
  assert.ok(v.ok);
  if (!v.ok) return;
  let sent: any = null;
  const fake = (async (_url: string, init: RequestInit) => {
    sent = JSON.parse(String(init.body));
    return new Response('ok', { status: 200 });
  }) as typeof fetch;
  const out = await deliver(v.lead, 'FC-T2', { GHL_WEBHOOK_URL: 'https://example.test/hook' }, fake);
  assert.equal(out.webhook, true);
  assert.equal(sent.first_name, 'Pat');
  assert.equal(sent.postal_code, '23510');
  assert.match(sent.tags, /Fireplace Design Request/);
  assert.equal(sent.details, 'Style: Modern linear');
});

test('deliver: does not retry a 401', async () => {
  const v = validateLead(base);
  assert.ok(v.ok);
  if (!v.ok) return;
  let n = 0;
  const fake = (async (url: string) => { if (String(url).endsWith('/contacts/upsert')) n++; return new Response('nope', { status: 401 }); }) as typeof fetch;
  const out = await deliver(v.lead, 'FC-T3', { GHL_PRIVATE_TOKEN: 'bad', GHL_LOCATION_ID: 'loc' }, fake);
  assert.equal(out.api, false);
  assert.equal(n, 1);
});

test('handler: 503 not_configured instead of a fake success', async () => {
  const saved = { ...process.env };
  delete process.env.GHL_WEBHOOK_URL;
  delete process.env.GHL_PRIVATE_TOKEN;
  delete process.env.GHL_LOCATION_ID;
  const { r, res } = mockRes();
  await handler({ method: 'POST', headers: { 'x-forwarded-for': '10.0.0.1' }, body: base }, res);
  assert.equal(r.code, 503);
  assert.equal(r.body.code, 'not_configured');
  process.env = saved;
});

test('handler: 422 with field errors', async () => {
  const { r, res } = mockRes();
  await handler({ method: 'POST', headers: { 'x-forwarded-for': '10.0.0.2' }, body: { ...base, consent: false } }, res);
  assert.equal(r.code, 422);
  assert.ok(r.body.fields.consent);
});

test('handler: honeypot is silently accepted and not delivered', async () => {
  const { r, res } = mockRes();
  await handler({ method: 'POST', headers: { 'x-forwarded-for': '10.0.0.3' }, body: { ...base, website: 'http://spam' } }, res);
  assert.equal(r.code, 200);
  assert.equal(r.body.ok, true);
});

test('testimonial form is accepted and tagged', () => {
  const v = validateLead({ ...base, formId: 'testimonial', message: 'Andrew was great.' });
  assert.ok(v.ok);
  if (v.ok) assert.ok(buildTags(v.lead).includes('Testimonial'));
});

test('handler: rejects GET', async () => {
  const { r, res } = mockRes();
  await handler({ method: 'GET', headers: {} }, res);
  assert.equal(r.code, 405);
});

test('health check leads are sales leads tagged with their result', () => {
  const v = validateLead({ ...base, formId: 'safety-check', promo: '', details: 'Chimney Health Check\nResult: Urgent\nScore: 11' });
  assert.ok(v.ok);
  if (!v.ok) return;
  const tags = buildTags(v.lead);
  assert.ok(tags.includes('Website Lead'));
  assert.ok(tags.includes('Chimney Health Check'));
  assert.ok(tags.includes('Health Check: Urgent'));
});

test('job applicants are kept out of the sales pipeline', async () => {
  const v = validateLead({ ...base, formId: 'job-application', promo: '', details: 'Position: Helper / apprentice\nDriver license: Yes' });
  assert.ok(v.ok);
  if (!v.ok) return;
  const tags = buildTags(v.lead);
  assert.ok(!tags.includes('Website Lead'));
  assert.ok(tags.includes('Job Applicant'));
  assert.ok(tags.includes('Applied: Helper / apprentice'));
  const opps: any[] = [];
  const fake = (async (url: string, init: RequestInit = {}) => {
    if (url.endsWith('/contacts/upsert')) return new Response(JSON.stringify({ contact: { id: 'c_9' } }), { status: 200 });
    if (url.includes('/opportunities/pipelines'))
      return new Response(JSON.stringify({ pipelines: [{ id: 'jobs', name: 'Jobs', stages: [{ id: 'j1', name: 'New Lead' }] }, { id: 'rec', name: 'Recruiting', stages: [{ id: 'r1', name: 'Applied' }] }] }), { status: 200 });
    if (url.endsWith('/opportunities/')) opps.push(JSON.parse(String(init.body)));
    return new Response('{}', { status: 200 });
  }) as typeof fetch;
  // The Jobs override env must not capture applicants; they route to Recruiting by name.
  await deliver(v.lead, 'FC-T9', { GHL_PRIVATE_TOKEN: 'pit-test', GHL_LOCATION_ID: 'loc_1', GHL_PIPELINE_ID: 'jobs', GHL_PIPELINE_STAGE_ID: 'j1' }, fake);
  assert.equal(opps.length, 1);
  assert.equal(opps[0].pipelineId, 'rec');
  assert.equal(opps[0].pipelineStageId, 'r1');
});

test('job applications need a phone number', () => {
  const v = validateLead({ ...base, formId: 'job-application', phone: '' });
  assert.equal(v.ok, false);
  if (!v.ok) assert.ok(v.fields.phone);
});

test('partner, referral and reminder forms get their own tags', () => {
  const partner = validateLead({ ...base, formId: 'partner', promo: '', details: 'Role: Realtor' });
  const referral = validateLead({ ...base, formId: 'referral', promo: '' });
  const reminder = validateLead({ ...base, formId: 'reminder', promo: '', phone: '' });
  assert.ok(partner.ok && referral.ok && reminder.ok);
  if (!partner.ok || !referral.ok || !reminder.ok) return;
  assert.ok(buildTags(partner.lead).includes('Partner: Realtor'));
  assert.ok(!buildTags(partner.lead).includes('Website Lead'));
  assert.ok(buildTags(referral.lead).includes('Referral'));
  assert.ok(buildTags(referral.lead).includes('Website Lead'));
  assert.ok(buildTags(reminder.lead).includes('Annual Reminder'));
  assert.ok(!buildTags(reminder.lead).includes('Website Lead'));
});

test('custom fields are filled from the form, and resumes are validated', () => {
  const v = validateLead({ ...base, formId: 'job-application', promo: '', details: 'Position: Mason' + String.fromCharCode(10) + 'Driver license: Yes' + String.fromCharCode(10) + 'Years of experience: 6', resume: { name: 'cv.pdf', type: 'application/pdf', data: Buffer.from('%PDF-1.4 test').toString('base64') } });
  assert.ok(v.ok);
  if (!v.ok) return;
  assert.equal(v.lead.resume?.name, 'cv.pdf');
  const f = customFieldValues(v.lead, 'FC-X', 'https://files/cv.pdf');
  assert.equal(f['contact.position_applied'], 'Mason');
  assert.equal(f['contact.years_of_experience'], '6');
  assert.equal(f['contact.resume_link'], 'https://files/cv.pdf');
  const bad = validateLead({ ...base, formId: 'job-application', resume: { name: 'virus.exe', type: 'application/x-msdownload', data: 'AAAA' } });
  assert.equal(bad.ok, false);
  const big = checkResume({ name: 'cv.pdf', type: 'application/pdf', data: 'A'.repeat(5_000_000) });
  assert.ok(big.error);
});

test('forms route to the right pipeline by name', () => {
  assert.deepEqual(pipelineFor('holiday-199'), { pipeline: 'Jobs', stage: 'New Lead' });
  assert.equal(pipelineFor('fireplace-designer')?.pipeline, 'Fireplace Projects');
  assert.equal(pipelineFor('partner')?.pipeline, 'Partners');
  assert.equal(pipelineFor('job-application')?.pipeline, 'Recruiting');
  assert.equal(pipelineFor('reminder'), null);
});
