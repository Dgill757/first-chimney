// Idempotent setup of a chimney company's GoHighLevel sub-account:
// pipelines, custom fields, custom values and tags. Safe to re-run; existing items are skipped
// (custom values are updated). Usage: node crm/setup.mjs [pipelines|fields|values|tags|all]
//
// Built for First Chimney Contracting. To reuse for another chimney client, change VALUES and
// point GHL_ENV_FILE at that client's private env file.
import { ghl, LOC } from './ghl.mjs';

const SITE = 'https://www.firstchimneycontracting.com';

export const PIPELINES = [
  { name: 'Jobs', stages: ['New Lead', 'Contacted', 'Scheduled', 'Inspected / Cleaned', 'Estimate Sent', 'Approved', 'Job Complete', 'Review Requested', 'Lost'] },
  { name: 'Fireplace Projects', stages: ['New Design Request', 'Consult Scheduled', 'Proposal Sent', 'Approved / Ordered', 'Installed', 'Lost'] },
  { name: 'Partners', stages: ['New Partner', 'Intro Call', 'First Referral Sent', 'Active Partner', 'Inactive'] },
  { name: 'Recruiting', stages: ['Applied', 'Phone Screen', 'Working Interview', 'Offer', 'Hired', 'Not a Fit'] },
];

const YN = ['Yes', 'No'];
// [name, type, options]. The website maps to these by field key (contact.<snake_case name>).
export const CONTACT_FIELDS = [
  ['Fireplace Type', 'SINGLE_OPTIONS', ['Wood-burning fireplace', 'Gas fireplace', 'Wood stove', 'Fireplace insert', 'Pellet stove', 'Not sure']],
  ['Number of Flues', 'NUMERICAL'],
  ['Last Service Date', 'DATE'],
  ['Next Service Due', 'DATE'],
  ['Service Requested', 'TEXT'],
  ['Preferred Timeframe', 'TEXT'],
  ['Lead Form', 'TEXT'],
  ['Website Reference', 'TEXT'],
  ['Promo Code', 'TEXT'],
  ['Health Check Result', 'SINGLE_OPTIONS', ['Urgent', 'Soon', 'Good']],
  ['Health Check Answers', 'LARGE_TEXT'],
  ['Referred By', 'TEXT'],
  ['Referral Code', 'TEXT'],
  ['Referred Friend Details', 'LARGE_TEXT'],
  ['Partner Role', 'SINGLE_OPTIONS', ['Home buyer', 'Home seller', 'Realtor', 'Home inspector', 'Property manager', 'Home improvement contractor', 'Other']],
  ['Partner Company', 'TEXT'],
  ['Position Applied', 'TEXT'],
  ['Resume Link', 'TEXT'],
  ['Years of Experience', 'TEXT'],
  ['Driver License', 'SINGLE_OPTIONS', YN],
  ['Comfortable on Roofs', 'SINGLE_OPTIONS', YN],
  ['Available Start Date', 'TEXT'],
  ['Testimonial Text', 'LARGE_TEXT'],
  ['Publish Permission', 'SINGLE_OPTIONS', YN],
  ['Fireplace Design Summary', 'LARGE_TEXT'],
  ['Products of Interest', 'LARGE_TEXT'],
  ['First Landing Page', 'TEXT'],
  ['UTM Source', 'TEXT'],
  ['UTM Medium', 'TEXT'],
  ['UTM Campaign', 'TEXT'],
  ['Customer Since', 'DATE'],
  ['Lifetime Jobs', 'NUMERICAL'],
];
export const OPP_FIELDS = [
  ['Job Type', 'SINGLE_OPTIONS', ['Chimney Inspection', 'Chimney Cleaning', 'Holiday $199 Cleaning + Inspection', 'Chimney Relining', 'Masonry / Rebuild', 'Leak Repair', 'Chimney Cap', 'Chimney Crown', 'Fireplace Repair', 'Dryer Vent Cleaning', 'Fireplace / Insert Install', 'Other']],
  ['Inspection Level', 'SINGLE_OPTIONS', ['Level 1', 'Level 2', 'Level 3']],
  ['Findings', 'LARGE_TEXT'],
  ['Quote Amount', 'MONETORY'],
  ['Deposit Received', 'SINGLE_OPTIONS', YN],
  ['Job Photos', 'FILE_UPLOAD'],
  ['Scheduled Date', 'DATE'],
  // "Lost Reason" is built into GHL opportunities, so it is not created here.
];

export const VALUES = {
  'Business Name': 'First Chimney Contracting',
  'Owner Name': 'Andrew Paterini',
  'Owner First Name': 'Andrew',
  'Owner Title': 'Owner, F.I.R.E. Certified Technician',
  'Business Phone': '(757) 589-0783',
  Website: SITE,
  'Service Area': 'Virginia, New Jersey, Connecticut and Massachusetts',
  'Review Link': `${SITE}/reviews#share`,
  'Booking Link': `${SITE}/contact`,
  'Holiday Offer': 'Chimney cleaning + inspection for $199',
  'Holiday Offer Link': `${SITE}/holiday-chimney-special`,
  'Referral Offer': '$25 off for you and $25 off for your friend',
  'Referral Code': 'NEIGHBOR25',
  'Referral Link': `${SITE}/refer-a-friend`,
  'Health Check Link': `${SITE}/chimney-health-check`,
  'Realtor Link': `${SITE}/real-estate-chimney-inspections`,
  'Careers Link': `${SITE}/careers`,
  'Testimonial Link': `${SITE}/reviews#share`,
  'Reminder Link': `${SITE}/blog#reminder`,
  'FIRE Directory Link': 'http://f-i-r-e-service.com/certified_inspectors_VA.php',
};

export const TAGS = [
  // Website (applied by /api/lead)
  'Website Form', 'Website Lead', 'Holiday Special - $199', 'Fireplace Design Request', 'Product Quote Request', 'Testimonial',
  'Chimney Health Check', 'Health Check: Urgent', 'Health Check: Soon', 'Health Check: Good',
  'Referral', 'Referral Partner', 'Partner: Realtor', 'Partner: Home inspector', 'Partner: Property manager', 'Partner: Home improvement contractor',
  'Recruiting', 'Job Applicant', 'Annual Reminder', 'SMS Consent: Yes', 'SMS Consent: No',
  // Lifecycle (applied by workflows)
  'Contacted', 'Scheduled', 'Job Complete', 'Past Customer', 'Estimate - No Decision', 'Review Left', 'VIP / Repeat',
  'Referred Customer', 'Referral Reward Owed', 'Missed Call', 'Do Not Contact',
  // Field and campaigns (added by Andrew or bulk actions)
  'Door Knock', 'Canvass Lead', 'Campaign: Fall Rush', 'Campaign: Spring Masonry', 'Campaign: Reactivation', 'Campaign: Pre-Snow',
];

async function pipelines() {
  const have = (await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`)).pipelines;
  for (const p of PIPELINES) {
    if (have.some((h) => h.name === p.name)) continue;
    await ghl('POST', '/opportunities/pipelines', { locationId: LOC, name: p.name, stages: p.stages.map((name, position) => ({ name, position })), showInFunnel: true, showInPieChart: true });
    console.log('pipeline created', p.name);
  }
  console.log('pipelines ok', PIPELINES.length);
}

async function fields() {
  const have = (await ghl('GET', `/locations/${LOC}/customFields?model=all`)).customFields ?? [];
  const add = async (model, [name, dataType, options]) => {
    if (have.some((h) => h.name === name && (h.model ?? 'contact') === model)) return;
    await ghl('POST', `/locations/${LOC}/customFields`, { name, dataType, model, ...(options ? { options } : {}) });
    console.log('field created', model, name);
  };
  for (const f of CONTACT_FIELDS) await add('contact', f);
  for (const f of OPP_FIELDS) await add('opportunity', f);
  console.log('fields ok', CONTACT_FIELDS.length + OPP_FIELDS.length);
}

async function values() {
  const have = (await ghl('GET', `/locations/${LOC}/customValues`)).customValues ?? [];
  for (const [name, value] of Object.entries(VALUES)) {
    const h = have.find((x) => x.name === name);
    if (h) await ghl('PUT', `/locations/${LOC}/customValues/${h.id}`, { name, value });
    else await ghl('POST', `/locations/${LOC}/customValues`, { name, value });
  }
  console.log('values ok', Object.keys(VALUES).length);
}

async function tags() {
  const have = (await ghl('GET', `/locations/${LOC}/tags`)).tags ?? [];
  for (const name of TAGS) {
    if (have.some((h) => h.name.toLowerCase() === name.toLowerCase())) continue;
    await ghl('POST', `/locations/${LOC}/tags`, { name });
  }
  console.log('tags ok', TAGS.length);
}

const step = process.argv[2] ?? 'all';
for (const [k, fn] of Object.entries({ pipelines, fields, values, tags })) {
  if (step !== 'all' && step !== k) continue;
  try {
    await fn();
  } catch (e) {
    console.error(k, 'FAILED:', e.message);
    process.exitCode = 1;
  }
}
