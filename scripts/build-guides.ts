/**
 * Builds the five partner guides as branded PDFs in public/guides/.
 * Run: npx tsx scripts/build-guides.ts   (needs Google Chrome installed)
 *
 * Content rules: standards and code references are stated as general guidance with the
 * section cited; local codes can amend them. Cost ranges are national figures with their
 * source named. No invented statistics.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { RED_FLAGS } from '../src/data/growth';
import { PARTNER_INDUSTRIES, PARTNER_PROGRAM, type PartnerIndustry } from '../src/data/partners';
import { NEWS_STATS } from '../src/data/news';
import { EXPERIENCE } from '../src/data/team';
import { CREDENTIALS, SITE } from '../src/lib/site';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'guides');
const TMP = join(ROOT, 'marketing', 'guides');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const img = (name: string) => pathToFileURL(join(ROOT, 'public', 'media', 'team', `${name}-sm.webp`)).href;
const font = (name: string) => pathToFileURL(join(ROOT, 'public', 'fonts', name)).href;
const logo = pathToFileURL(join(ROOT, 'public', 'brand', 'logo-light.png')).href;

const HOMEGUIDE_INSPECTION = 'https://homeguide.com/costs/chimney-inspection-cost';
const HOMEGUIDE_REPAIR = 'https://homeguide.com/costs/chimney-repair-cost';
const HOMEGUIDE_CROWN = 'https://homeguide.com/costs/cost-to-repair-replace-chimney-crown';
const HOMEGUIDE_REBUILD = 'https://homeguide.com/costs/chimney-rebuild-cost';

type Chapter = { title: string; html: string };

/* ----------------------------- Industry chapters ----------------------------- */
const INDUSTRY_CHAPTER: Record<string, Chapter> = {
  realtors: {
    title: 'For your listings and your buyers',
    html: `
      <h3>Listing prep checklist</h3>
      <ul class="check"><li>Ask the seller when the chimney was last inspected and cleaned. Get the receipt.</li><li>Order a Level 2 inspection before listing if there is a wood-burning fireplace or stove.</li><li>Fix safety items first, document the rest, and attach the report to the disclosure packet.</li><li>Photograph the clean firebox and new cap for the listing.</li></ul>
      <h3>When your buyer's home inspection says "further evaluation"</h3>
      <ol><li>Text Andrew the address and the inspection deadline.</li><li>Level 2 inspection with camera. Photos and findings go to your client, copied to you.</li><li>Findings are sorted: <strong>safety now</strong>, <strong>this year</strong>, <strong>monitor</strong>. Negotiate on facts, not fear.</li><li>Need a repair quote for a credit? It comes separately, so the report stays objective.</li></ol>
      <h3>What to tell clients</h3>
      <div class="script">"A general home inspection usually looks at the chimney from the outside. The national fire safety standard calls for a Level 2 chimney inspection when a home is sold, which looks inside the whole flue with a camera. It's a small cost compared to finding a cracked liner after you own the house."</div>
      <h3>Red flags that often kill deals</h3>
      <ul><li>Cracked or missing flue tiles (fire can reach framing)</li><li>No liner on a gas furnace or water heater flue</li><li>Crown cracks and water damage in the attic or ceiling</li><li>Evidence of a past chimney fire (glazed creosote, warped damper, cracked tiles)</li></ul>`,
  },
  'home-inspectors': {
    title: 'What to flag, and how to refer it',
    html: `
      <h3>Flag for a chimney specialist when you see</h3>
      <ul class="check"><li>Any wood-burning fireplace or stove at sale (NFPA 211 calls for a Level 2 at transfer)</li><li>Crown cracks, missing or rusted cap, damaged spark arrestor</li><li>Efflorescence, spalling brick, open mortar joints</li><li>Water staining near the chimney inside, or in the attic</li><li>Visible creosote, glazed deposits or a warped damper</li><li>Appliance changes (new furnace, water heater or insert) on an old flue</li><li>Termination that looks short of the 3-2-10 rule</li><li>Combustibles close to the chimney in the attic</li></ul>
      <h3>Suggested report language</h3>
      <div class="script">"The chimney interior and flue liner were not visible for inspection. A Level 2 chimney inspection by a qualified chimney professional is recommended prior to closing, per NFPA 211."</div>
      <h3>How a referral protects you</h3>
      <ul><li>Hidden defects get documented by a specialist with photos.</li><li>You get a copy of the findings, with your client's permission.</li><li>No referral fees: your clients get the partner rate instead, so there is no conflict of interest.</li></ul>`,
  },
  contractors: {
    title: 'Field guide for roofers, remodelers and HVAC',
    html: `
      <h3>Roof replacement: check the chimney before tear-off</h3>
      <ul class="check"><li>Crown: cracks, no overhang or drip edge, separating from the flue tile</li><li>Flashing: step and counter flashing condition, sealant only "repairs"</li><li>Cap: present, rusted, mesh intact, sized to the flue</li><li>Masonry: loose brick, open joints, spalling above the roofline</li><li>Height: at least 3 feet above the roof and 2 feet above anything within 10 feet</li></ul>
      <p>The best time to fix a crown and flashing is during the roof job. Send Andrew the tear-off date.</p>
      <h3>HVAC and water heater changeouts</h3>
      <ul><li>High-efficiency appliances produce cooler exhaust that condenses in an unlined or oversized masonry flue, which damages the masonry over time.</li><li>Follow the appliance manufacturer's venting requirements. A properly sized stainless liner is often the fix.</li><li>When an appliance is removed from a shared flue, the remaining appliance may no longer vent correctly. Have it checked.</li></ul>
      <h3>Remodels near a fireplace or chimney</h3>
      <ul><li>Masonry chimneys need airspace clearance to combustibles: 2 inches inside the building, 1 inch when entirely outside the exterior walls.</li><li>Hearth extensions: 16 inches in front and 8 inches to each side of the opening (20 and 12 inches for openings of 6 square feet or more).</li><li>Mantels and trim have their own clearances. When in doubt, ask before you build.</li></ul>`,
  },
  'property-managers': {
    title: 'Maintenance schedule and tenant safety',
    html: `
      <h3>Yearly schedule</h3>
      <table><tr><th>When</th><th>What</th></tr>
      <tr><td>August–September</td><td>Inspection and cleaning for every unit with a fireplace, stove or insert (before heating season)</td></tr>
      <tr><td>Every turnover</td><td>Visual check of firebox, damper, cap, smoke and CO alarms</td></tr>
      <tr><td>After any event</td><td>Level 2 after a chimney fire, lightning strike, storm or earthquake</td></tr>
      <tr><td>Appliance change</td><td>Level 2 and venting check when a furnace, water heater or insert is replaced</td></tr></table>
      <h3>Tenant safety checklist (give one to every tenant)</h3>
      <ul class="check"><li>Burn only dry, seasoned wood. Never burn trash, cardboard or wrapping paper.</li><li>Use a screen. Keep 3 feet clear in front of the fireplace.</li><li>Open the damper before lighting. Never leave a fire unattended.</li><li>Ashes go in a metal container with a lid, outside, away from the house.</li><li>Test smoke and carbon monoxide alarms monthly.</li><li>Report smoke in the room, a strong odor or loud roaring from the chimney right away.</li></ul>
      <h3>Records to keep for every unit</h3>
      <ul><li>Inspection date, level and report with photos</li><li>Cleaning dates and any repairs with invoices</li><li>Alarm tests and tenant acknowledgements</li></ul>`,
  },
  insurance: {
    title: 'Underwriting and claims',
    html: `
      <h3>Underwriting questions for homes with wood heat</h3>
      <ul class="check"><li>When was the chimney last inspected, and at what level?</li><li>Is there a professional cleaning record for the last 12 months?</li><li>What appliance is connected (open fireplace, insert, stove)? Was it professionally installed?</li><li>Is there a cap and a liner? Any history of chimney fires?</li><li>Are smoke and CO alarms installed and working?</li></ul>
      <h3>After an event: what to document</h3>
      <ul><li>A Level 2 inspection with camera is the standard after a chimney fire or an event like lightning, storms or earthquakes.</li><li>Photos of the crown, cap, flashing, masonry and the full flue.</li><li>Signs of a past chimney fire: puffy or glazed creosote, cracked or displaced tiles, warped damper or cap, heat damage to nearby framing.</li><li>Water intrusion paths: crown, flashing, masonry and cap.</li></ul>
      <h3>Common causes of chimney fires</h3>
      <ul><li>Creosote buildup from infrequent cleaning, wet wood or smoldering fires</li><li>Blockages: nests, leaves, collapsed tiles or clogged caps</li><li>Damaged liners that let heat reach combustible framing</li></ul>`,
  },
};

/* ------------------------------- Shared pages ------------------------------- */
function guideHtml(p: PartnerIndustry) {
  const ch = INDUSTRY_CHAPTER[p.slug];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${p.guide.title}</title><style>
@font-face { font-family: Archivo; src: url('${font('archivo.woff2')}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: Geist; src: url('${font('geist.woff2')}') format('woff2'); font-weight: 100 900; }
:root { --ink:#121110; --ink2:#211e1b; --bone:#f3ede4; --ember:#f07a32; --deep:#b8501c; --mute:#5d5650; --line:#e4ddd2; --soft:#faf6f0; }
@page { size: Letter; margin: 0.7in 0.75in 0.8in; @bottom-left { content: "${SITE.name} · ${p.guide.title.replace(/"/g, '')}"; font: 7.5pt Geist; color: #8a8178; } @bottom-right { content: counter(page); font: 8pt Geist; color: #8a8178; } }
@page cover { margin: 0; @bottom-left { content: none } @bottom-right { content: none } }
* { box-sizing: border-box } html { -webkit-print-color-adjust: exact; print-color-adjust: exact }
body { margin: 0; font: 10pt/1.5 Geist, sans-serif; color: #26221f }
h1, h2, h3 { font-family: Archivo, sans-serif; color: var(--ink); line-height: 1.12; margin: 0 }
h2, h3 { break-after: avoid }
h1 { font-size: 24pt; font-stretch: 112%; font-weight: 800 }
h2 { font-size: 14pt; font-weight: 750; margin-top: 16pt }
h3 { font-size: 11.5pt; font-weight: 700; margin-top: 13pt }
p { margin: 5pt 0 } ul, ol { margin: 5pt 0; padding-left: 16pt } li { margin: 2pt 0 } a { color: var(--deep); text-decoration: none } strong { color: var(--ink) }
.cover { page: cover; height: 11in; width: 8.5in; position: relative; background: var(--ink); color: var(--bone); overflow: hidden }
.cover .hero { position: absolute; inset: 0; width: 100%; height: 58%; object-fit: cover }
.cover .fade { position: absolute; left: 0; right: 0; top: 28%; height: 31%; background: linear-gradient(transparent, var(--ink)) }
.cover .t { position: absolute; left: .75in; right: .75in; bottom: .8in }
.cover .logo { height: 52pt } .cover .k { margin-top: 22pt; color: var(--ember); font: 600 9pt Geist; letter-spacing: .22em; text-transform: uppercase }
.cover h1 { color: var(--bone); font-size: 34pt; margin-top: 8pt; line-height: 1.03 } .cover .s { color: #cfc6ba; font-size: 11.5pt; margin-top: 12pt; max-width: 5.8in }
.cover .by { margin-top: 22pt; font-size: 9pt; color: #a99f93 } .cover .by b { color: var(--bone) }
.ch { break-before: page } .head { border-bottom: 2pt solid var(--ember); padding-bottom: 8pt; margin-bottom: 10pt } .num { font: 700 8.5pt Geist; color: var(--ember); letter-spacing: .2em; text-transform: uppercase }
.box { background: var(--soft); border: 1pt solid var(--line); border-left: 3pt solid var(--ember); border-radius: 6pt; padding: 8pt 11pt; margin: 9pt 0; break-inside: avoid }
.dark { background: var(--ink2); color: #e9e1d6; border-color: var(--ink2); border-left-color: var(--ember) } .dark strong { color: #fff }
.script { background: #fff; border: 1pt dashed #d6c9b8; border-radius: 6pt; padding: 8pt 11pt; margin: 7pt 0; break-inside: avoid }
table { width: 100%; border-collapse: collapse; margin: 7pt 0; font-size: 9pt } th { text-align: left; background: var(--ink); color: var(--bone); font-family: Archivo; padding: 5pt 7pt } td { border-bottom: .75pt solid var(--line); padding: 4pt 7pt; vertical-align: top } tr { break-inside: avoid }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11pt } .card { border: 1pt solid var(--line); border-radius: 6pt; overflow: hidden; break-inside: avoid } .card img { width: 100%; height: 1.45in; object-fit: cover; display: block } .card div { padding: 6pt 9pt } .card h3 { margin-top: 0; font-size: 10.5pt } .card p { font-size: 8.8pt; margin: 3pt 0 }
.check { list-style: none; padding-left: 0 } .check li { padding-left: 15pt; position: relative } .check li::before { content: ''; position: absolute; left: 0; top: 3pt; width: 8pt; height: 8pt; border: 1.2pt solid var(--deep); border-radius: 2pt }
.small { font-size: 8.3pt; color: var(--mute) } .src li { font-size: 8.3pt; word-break: break-all }
</style></head><body>

<section class="cover"><img class="hero" src="${img('chimney-inspection-roof-truck')}" alt=""><div class="fade"></div><div class="t">
<img class="logo" src="${logo}" alt="${SITE.name}"><div class="k">Free guide for ${p.short.toLowerCase()}</div>
<h1>${p.guide.title}</h1><p class="s">${p.guide.blurb}</p>
<p class="by">Prepared by <b>${SITE.owner}</b>, ${CREDENTIALS.fire.title} · ${SITE.name} · ${SITE.phoneDisplay} · ${SITE.displayDomain}</p></div></section>

<section class="ch"><div class="head"><div class="num">01</div><h1>Why the chimney matters</h1></div>
<p>${NEWS_STATS.lines[0]} ${NEWS_STATS.lines[1]} (${NEWS_STATS.source})</p>
<p>Most chimney problems are invisible from the ground: cracked flue tiles, gaps in liners, creosote and water damage inside the masonry. They become expensive surprises, failed deals, claims and fires.</p>
<h2>What this means for ${p.name.toLowerCase()}</h2>
${p.pains.map((x) => `<div class="box"><strong>${x.t}.</strong> ${x.b}</div>`).join('')}
<h2>The standard: inspect every year</h2>
<p>NFPA 211, the national fire safety standard for chimneys, fireplaces, vents and solid fuel-burning appliances, calls for chimneys to be inspected at least once a year and cleaned, maintained and repaired as needed.</p>
</section>

<section class="ch"><div class="head"><div class="num">02</div><h1>The three inspection levels</h1></div>
<table><tr><th>Level</th><th>What it covers</th><th>When it applies</th><th>Typical national cost*</th></tr>
<tr><td><strong>Level 1</strong></td><td>Readily accessible parts of the chimney, appliance and connections. Confirms the chimney is structurally sound and free of obstructions and combustible deposits.</td><td>Yearly maintenance when nothing has changed</td><td>$100–$250</td></tr>
<tr><td><strong>Level 2</strong></td><td>Everything in Level 1 plus accessible attics, crawl spaces and basements, and a camera inspection of the full flue.</td><td>Sale or transfer of property · after a chimney fire, storm, earthquake or other event · change of appliance or fuel · relining</td><td>$250–$600</td></tr>
<tr><td><strong>Level 3</strong></td><td>Removal of parts of the building or chimney to reach concealed areas.</td><td>When a Level 1 or 2 points to a hidden hazard that cannot be confirmed otherwise</td><td>$900–$5,000</td></tr></table>
<p class="small">*National averages reported by HomeGuide (2026). A combined sweep and Level 1 inspection typically runs $125–$300. Actual prices depend on the number of flues, access and condition. First Chimney quotes before any work.</p>
<div class="grid" style="margin-top:12pt">
<div class="card"><img src="${img('andrew-brushing-chimney-flue-roof')}" alt=""><div><h3>From the top</h3><p>Crown, cap, flashing and masonry above the roofline.</p></div></div>
<div class="card"><img src="${img('andrew-cleaning-fireplace-chimney-brush')}" alt=""><div><h3>From inside</h3><p>Firebox, damper, smoke chamber and the flue, with drop cloths down.</p></div></div>
</div></section>

<section class="ch"><div class="head"><div class="num">03</div><h1>Codes and standards in plain English</h1></div>
<p>These are general requirements from widely adopted standards. Local jurisdictions can amend them, so confirm with the local building official for any specific property.</p>
<table><tr><th>Topic</th><th>Requirement</th><th>Reference</th></tr>
<tr><td>Yearly inspection</td><td>Chimneys, fireplaces and vents inspected at least once a year; cleaned and repaired as needed</td><td>NFPA 211</td></tr>
<tr><td>Inspection at sale</td><td>Level 2 inspection upon sale or transfer of the property</td><td>NFPA 211</td></tr>
<tr><td>Termination height (3-2-10 rule)</td><td>At least 3 ft above where it passes through the roof, and 2 ft higher than any part of the building within 10 ft</td><td>IRC R1003.9</td></tr>
<tr><td>Clearance to combustibles</td><td>2 in airspace for masonry chimneys inside the building or within exterior walls; 1 in when entirely outside the exterior walls</td><td>IRC R1003.18</td></tr>
<tr><td>Hearth extension</td><td>16 in in front and 8 in each side of the opening; 20 in and 12 in for openings of 6 sq ft or more</td><td>IRC R1001.10</td></tr>
<tr><td>Flue liners</td><td>Masonry chimneys require an approved flue lining system</td><td>IRC R1003.11</td></tr>
<tr><td>Gas appliance venting</td><td>Vents sized and installed to the appliance listing and manufacturer's instructions</td><td>NFPA 54 / IRC Ch. 24 (fuel gas)</td></tr></table>
<div class="box">A chimney can look fine from the street and still fail every one of these inside. That is why the inspection level matters.</div>
</section>

<section class="ch"><div class="head"><div class="num">04</div><h1>Common problems, with real photos</h1></div>
<div class="grid">
<div class="card"><img src="${img('andrew-chimney-crown-repair')}" alt=""><div><h3>Cracked crown</h3><p>Lets water into the masonry and flue, the start of most chimney leaks. Repair $200–$700; full replacement $1,000–$3,000.</p></div></div>
<div class="card"><img src="${img('andrew-chimney-cap-crown-seal')}" alt=""><div><h3>Missing or failed cap</h3><p>Lets in rain, animals and debris. Cap replacement typically $200–$850.</p></div></div>
<div class="card"><img src="${img('andrew-carrying-stainless-chimney-liner')}" alt=""><div><h3>Damaged or missing liner</h3><p>Lets heat and gases reach the masonry and framing. Stainless relining typically $1,500–$4,000.</p></div></div>
<div class="card"><img src="${img('chimney-rebuild-scaffolding-new-brick')}" alt=""><div><h3>Deteriorated masonry</h3><p>Spalling brick and open joints. Partial top rebuild $600–$1,000; stack above the roofline $1,000–$3,500.</p></div></div>
<div class="card"><img src="${img('andrew-cleaning-fireplace-chimney-brush')}" alt=""><div><h3>Creosote buildup</h3><p>The fuel for chimney fires. Removed with a professional cleaning. Wet wood and smoldering fires make it worse.</p></div></div>
<div class="card"><img src="${img('chimney-repair-roof-protection')}" alt=""><div><h3>Flashing leaks</h3><p>Water at the roofline often blamed on the roof. Repair cost depends on the flashing and roof type.</p></div></div>
</div>
<p class="small">Cost ranges are national averages from HomeGuide (2026). Every chimney is different; First Chimney provides a written quote after inspection.</p>
</section>

<section class="ch"><div class="head"><div class="num">05</div><h1>${ch.title}</h1></div>${ch.html}</section>

<section class="ch"><div class="head"><div class="num">06</div><h1>Choosing a chimney company</h1></div>
<div class="grid"><div><h3>Red flags</h3><ul>${RED_FLAGS.map((r) => `<li>${r}</li>`).join('')}</ul></div>
<div><h3>Ask every company</h3><ul class="check"><li>Is the technician certified, and where can I verify it?</li><li>Who will actually come to the property?</li><li>Will I get photos of every finding?</li><li>Is the repair quote separate from the inspection report?</li><li>How do you protect the home during the work?</li></ul></div></div>

<h2>Working with First Chimney</h2>
<div class="box dark"><strong>Partner offer: ${PARTNER_PROGRAM.discount}.</strong> ${p.offer}</div>
<ul>${PARTNER_PROGRAM.perks.map((x) => `<li>${x}</li>`).join('')}</ul>
<p><strong>${SITE.owner}</strong>, owner. ${CREDENTIALS.fire.title}, listed in the official F.I.R.E. directory. ${EXPERIENCE.ownerYears} years in the chimney trade, ${EXPERIENCE.teamYears} years of combined crew experience. Serving Virginia, New Jersey, Connecticut and Massachusetts.</p>
<p><strong>Call or text:</strong> ${SITE.phoneDisplay} · <strong>Partner page:</strong> ${SITE.displayDomain}/partners/${p.slug} · <strong>Free homeowner check:</strong> ${SITE.displayDomain}/check</p>

<h3>Sources</h3><ul class="src">
<li>NFPA 211, Standard for Chimneys, Fireplaces, Vents, and Solid Fuel-Burning Appliances: nfpa.org/codes-and-standards/nfpa-211-standard-development/211</li>
<li>International Residential Code (IRC), Chapter 10, Chimneys and Fireplaces (R1001, R1003), as adopted locally</li>
<li>${NEWS_STATS.source}, Heating Fires in Residential Buildings: ${NEWS_STATS.url}</li>
<li>HomeGuide, Chimney inspection cost (2026): ${HOMEGUIDE_INSPECTION}</li>
<li>HomeGuide, Chimney repair cost (2026): ${HOMEGUIDE_REPAIR}</li>
<li>HomeGuide, Chimney crown cost (2026): ${HOMEGUIDE_CROWN}</li>
<li>HomeGuide, Chimney rebuild cost (2026): ${HOMEGUIDE_REBUILD}</li>
<li>F.I.R.E. Service directory: ${CREDENTIALS.fire.verifyUrl}</li></ul>
<p class="small">This guide is general information, not legal, insurance or engineering advice. Requirements vary by jurisdiction.</p>
</section></body></html>`;
}

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}. Set CHROME_PATH.`);
for (const p of PARTNER_INDUSTRIES) {
  const html = join(TMP, `${p.slug}.html`);
  writeFileSync(html, guideHtml(p));
  const pdf = join(ROOT, 'public', p.guide.file);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files', '--virtual-time-budget=8000', `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: 'ignore' });
  console.log('guide', p.guide.file);
}
// Shrink embedded photos (Chrome stores them uncompressed). Optional: needs Python with PyMuPDF.
try {
  const pdfs = PARTNER_INDUSTRIES.map((p) => join(ROOT, 'public', p.guide.file));
  execFileSync('python', [join(ROOT, 'scripts', 'compress-pdf.py'), ...pdfs], { stdio: 'inherit' });
} catch {
  console.warn('PyMuPDF not available; PDFs left uncompressed');
}
