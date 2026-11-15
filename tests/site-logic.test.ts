import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jpegsToPdf } from '../src/lib/designPdf.ts';
import { buildGuide } from '../src/lib/buildGuide.ts';
import { HOLIDAY_PROMO, reminderIcs, shouldShowPopup } from '../src/lib/promo.ts';
import { isPublishableCity, SERVICE_AREAS } from '../src/data/serviceAreas.ts';
import { buildRoutes } from '../src/lib/routes.ts';

test('jpegsToPdf writes a structurally valid multi-page PDF with correct xref offsets', () => {
  const fakeJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 0xff, 0xd9]);
  const link = { url: 'https://example.com/a?b=c', rect: [1, 2, 3, 4] as [number, number, number, number] };
  const pdf = jpegsToPdf([1, 2, 3].map(() => ({ jpeg: fakeJpeg, w: 10, h: 10, links: [link] })), { title: 'Test (build)' });
  const text = new TextDecoder('latin1').decode(pdf);
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.ok(text.trimEnd().endsWith('%%EOF'));
  assert.match(text, /\/Count 3/);
  const startxref = Number(text.match(/startxref\n(\d+)/)![1]);
  assert.equal(text.slice(startxref, startxref + 4), 'xref');
  const entries = [...text.slice(startxref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
  assert.equal(entries.length, 2 + 3 * 4 + 1);
  entries.forEach((off, i) => assert.equal(text.slice(off, off + `${i + 1} 0 obj`.length), `${i + 1} 0 obj`));
  assert.ok(text.includes('/Title (Test \\(build\\))'));
});

test('build guide: insert guide is itemized, sized against the room and lists real install needs', async () => {
  const { catalogProducts } = await import('../src/lib/catalogRoutes.ts');
  const products = catalogProducts();
  const insert = products.find((p) => p.kind === 'insert' && p.fuel === 'gas' && p.heat?.btuMax && p.options.length)!;
  const g = buildGuide(insert, 'Brand', { picks: {}, compare: [], room: { sqft: 400, ceiling: 8, openness: 'closed', tightness: 'average' } });
  assert.equal(g.items[0].item, `Brand ${insert.name}`);
  assert.ok(g.stats.some((s) => s.label === 'Heat rating' && /^Up to/.test(s.value)));
  assert.ok(g.alsoNeeded.some((a) => /liner/i.test(a)));
  assert.ok(g.alsoNeeded.some((a) => /gas line/i.test(a)));
  assert.ok(g.canWarm.some((c) => /Your space: about 400 sq ft/.test(c)));
  // A good fit is reported under "It can"; a mismatch under "Keep in mind".
  assert.ok(Boolean(g.sizeVerdict) || g.canWarm.length >= 4);
  assert.ok(g.questions.length >= 4 && g.description.length > 20);
  assert.equal(g.steps.length, 6);
  assert.ok(g.prep.some((x) => /cleaned and inspected/.test(x)));
  const electric = products.find((p) => p.fuel === 'electric')!;
  const e = buildGuide(electric, 'Brand', { picks: {}, compare: [] });
  assert.ok(e.cannotWarm.some((c) => /supplemental heat/.test(c)));
  assert.ok(!e.alsoNeeded.some((a) => /liner/i.test(a)));
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
  for (const p of ['/chimney-health-check', '/careers', '/reviews']) assert.equal(shouldShowPopup({ ...base, pathname: p }), false, p);
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

test('catalog: every product route is unique with a title, image and Product schema', async () => {
  const { buildCatalogRoutes, catalogProducts } = await import('../src/lib/catalogRoutes.ts');
  const products = catalogProducts();
  assert.ok(products.length > 200);
  const routes = buildCatalogRoutes();
  const paths = new Set(routes.map((r) => r.path));
  assert.equal(paths.size, routes.length);
  const productRoutes = routes.filter((r) => r.path.split('/').length === 4);
  assert.equal(productRoutes.length, products.length);
  for (const r of productRoutes) assert.ok(r.jsonLd.some((j: any) => j['@type'] === 'Product'), r.path);
});
