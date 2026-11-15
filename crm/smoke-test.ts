// Live smoke test of api/lead.ts against the real sub-account (job application = no customer messages).
// Usage: node --import tsx crm/smoke-test.ts
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { deliver, validateLead } from '../api/lead.ts';

const env = Object.fromEntries(readFileSync(process.env.GHL_ENV_FILE ?? join(homedir(), '.first-chimney-ghl.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const v = validateLead({
  formId: 'job-application',
  name: 'QA Test Applicant',
  email: 'qa-test-applicant@example.com',
  phone: '(757) 555-0100',
  city: 'Virginia Beach',
  state: 'VA',
  message: 'Automated website test. Safe to ignore.',
  details: 'Position: Helper / apprentice\nYears of experience: 1 to 3\nAvailable to start: in 2 weeks\nDriver license: Yes\nComfortable on roofs and ladders: Yes',
  consent: true,
  sourcePage: '/careers',
  attribution: { utmSource: 'qa' },
  resume: { name: 'qa-resume.pdf', type: 'application/pdf', data: Buffer.from('%PDF-1.4\n% QA resume\n').toString('base64') },
});
if (!v.ok) throw new Error(JSON.stringify(v.fields));
const out = await deliver(v.lead, 'FC-QATEST', { GHL_PRIVATE_TOKEN: env.GHL_PRIVATE_TOKEN, GHL_LOCATION_ID: env.GHL_LOCATION_ID });
console.log('delivered', JSON.stringify(out));
