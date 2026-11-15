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
