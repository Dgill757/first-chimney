/** Chimney Health Check scoring and growth page routes. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HEALTH_CHECK, scoreHealthCheck } from '../src/data/growth.ts';
import { SERVICES } from '../src/data/services.ts';
import { routeFor } from '../src/lib/routes.ts';

const pick = (labels: Record<string, string>) =>
  Object.fromEntries(HEALTH_CHECK.map((q) => [q.id, q.options.findIndex((o) => o.label === (labels[q.id] ?? q.options.find((x) => x.points === 0)!.label))]));

test('a healthy, recently inspected chimney scores Good', () => {
  const r = scoreHealthCheck(pick({}));
  assert.equal(r.result.level, 'Good');
  assert.equal(r.score, 0);
});

test('smoke in the room or a past chimney fire is always Urgent', () => {
  assert.equal(scoreHealthCheck(pick({ smoke: 'Yes' })).result.level, 'Urgent');
  assert.equal(scoreHealthCheck(pick({ fire: 'Yes' })).result.level, 'Urgent');
});

test('an overdue inspection with a leak is Soon and recommends leak repair', () => {
  const r = scoreHealthCheck(pick({ last: '3 or more years ago', water: 'Yes' }));
  assert.equal(r.result.level, 'Soon');
  assert.ok(r.result.services.includes('leak-repair'));
  assert.equal(r.result.services[0], 'chimney-inspection');
});

test('every recommended service exists and every question has a zero-point answer', () => {
  const ids = new Set(SERVICES.map((s) => s.id));
  const all = scoreHealthCheck(Object.fromEntries(HEALTH_CHECK.map((q) => [q.id, q.options.reduce((b, o, i, a) => (o.points > a[b].points ? i : b), 0)])));
  for (const id of all.result.services) assert.ok(ids.has(id), id);
  for (const q of HEALTH_CHECK) assert.ok(q.options.some((o) => o.points === 0), q.id);
});

test('growth pages are registered for prerender and SEO', () => {
  for (const p of ['/chimney-health-check', '/real-estate-chimney-inspections', '/how-to-choose-a-chimney-company', '/careers', '/refer-a-friend']) {
    const r = routeFor(p);
    assert.ok(r, p);
    assert.ok(r!.description.length > 60, p);
  }
});

import { existsSync } from 'node:fs';
import { NEWS } from '../src/data/news.ts';
import { PARTNER_INDUSTRIES } from '../src/data/partners.ts';

test('every partner industry has a route, a guide PDF on disk and complete content', () => {
  for (const p of PARTNER_INDUSTRIES) {
    assert.ok(routeFor(`/partners/${p.slug}`), p.slug);
    assert.ok(existsSync(`public${p.guide.file}`), `missing ${p.guide.file}`);
    assert.ok(p.pains.length >= 3 && p.benefits.length >= 5 && p.faqs.length >= 3, p.slug);
  }
  assert.ok(routeFor('/partners') && routeFor('/news') && routeFor('/resources'));
});

test('news items link to real https sources, are unique and newest first', () => {
  const urls = new Set<string>();
  let prev = '9999';
  for (const n of NEWS) {
    assert.match(n.url, /^https:\/\//, n.title);
    assert.ok(!urls.has(n.url), `duplicate ${n.url}`);
    urls.add(n.url);
    assert.ok(n.summary.length > 40 && n.lesson.length > 20, n.title);
    assert.ok(n.date <= prev, `${n.title} out of order`);
    prev = n.date;
  }
});
