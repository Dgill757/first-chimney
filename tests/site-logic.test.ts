import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jpegToPdf } from '../src/lib/designPdf.ts';
import { decodeDesign, DEFAULT_DESIGN, designSummary, encodeDesign } from '../src/data/designer.ts';
import { HOLIDAY_PROMO, reminderIcs, shouldShowPopup } from '../src/lib/promo.ts';
import { isPublishableCity, SERVICE_AREAS } from '../src/data/serviceAreas.ts';
import { buildRoutes } from '../src/lib/routes.ts';

test('jpegToPdf writes a structurally valid PDF with correct xref offsets', () => {
  const fakeJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 0xff, 0xd9]);
  const pdf = jpegToPdf(fakeJpeg, { w: 10, h: 10 }, { title: 'Test (design)', link: { url: 'https://example.com/a?b=c', rect: [1, 2, 3, 4] } });
  const text = new TextDecoder('latin1').decode(pdf);
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.ok(text.trimEnd().endsWith('%%EOF'));
  const startxref = Number(text.match(/startxref\n(\d+)/)![1]);
  assert.equal(text.slice(startxref, startxref + 4), 'xref');
  const entries = [...text.slice(startxref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
  assert.equal(entries.length, 7);
  entries.forEach((off, i) => assert.equal(text.slice(off, off + `${i + 1} 0 obj`.length), `${i + 1} 0 obj`));
  assert.match(text, /\/Title \(Test \\\(design\\\)\)/);
  assert.match(text, /\/URI \(https:\/\/example.com\/a\?b=c\)/);
});

test('design encode/decode round-trips including project and timeline', () => {
  const d = { ...DEFAULT_DESIGN, project: 'insert', timeline: 'Next 1 to 3 months', extras: ['glass-doors', 'built-ins'] };
  const back = decodeDesign(encodeDesign(d));
  assert.deepEqual(back, d);
  assert.match(designSummary(d), /Project: Add an insert or switch to gas/);
  assert.equal(decodeDesign('s=traditional&m=hacker&x=evil.screen')?.surround, DEFAULT_DESIGN.surround);
});

test('popup rules: never on the promo page, after a claim, or within cooldown', () => {
  const base = { pathname: '/', preview: false, now: Date.now(), shownThisSession: false, dismissedAt: null, claimed: false };
  assert.equal(shouldShowPopup(base), HOLIDAY_PROMO.live);
  assert.equal(shouldShowPopup({ ...base, pathname: HOLIDAY_PROMO.path }), false);
  assert.equal(shouldShowPopup({ ...base, claimed: true }), false);
  assert.equal(shouldShowPopup({ ...base, shownThisSession: true }), false);
  assert.equal(shouldShowPopup({ ...base, dismissedAt: base.now - 60_000 }), false);
  assert.equal(shouldShowPopup({ ...base, dismissedAt: base.now - 10 * 86_400_000 }), HOLIDAY_PROMO.live);
  assert.equal(shouldShowPopup({ ...base, pathname: HOLIDAY_PROMO.path, preview: true }), true);
});

test('reminder .ics is a valid VEVENT with the offer code', () => {
  const ics = reminderIcs(new Date('2026-11-14T15:00:00Z'), '(757) 589-0783', 'https://x');
  assert.match(ics, /^BEGIN:VCALENDAR/);
  assert.match(ics, /BEGIN:VEVENT[\s\S]*DTSTART:\d{8}T\d{6}Z[\s\S]*END:VEVENT/);
  assert.match(ics, new RegExp(HOLIDAY_PROMO.code));
});

test('every published city has unique, substantial content and a route', () => {
  const routes = new Set(buildRoutes().map((r) => r.path));
  const intros = new Set<string>();
  for (const s of SERVICE_AREAS) {
    for (const c of s.cities.filter((x) => x.published)) {
      assert.ok(isPublishableCity(c), `${c.name} is too thin to publish`);
      assert.ok(!intros.has(c.intro), `${c.name} intro is duplicated`);
      intros.add(c.intro);
      assert.ok(routes.has(`/service-areas/${s.slug}/${c.slug}`), `${c.name} has no route`);
    }
  }
});
