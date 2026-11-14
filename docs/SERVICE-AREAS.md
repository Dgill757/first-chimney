# Adding a City Page

City pages are deliberately off until Andrew confirms the towns he actually serves. Thin "doorway" pages that only swap the city name hurt rankings and mislead customers, so the build refuses to publish a city without real content.

1. Get the confirmed town list from Andrew (and how far he travels in each state).
2. In `src/data/serviceAreas.ts`, add to that state's `cities` array:

```ts
{
  slug: 'virginia-beach',
  name: 'Virginia Beach',
  county: 'Independent city',
  published: true,
  intro: 'At least 200 characters of genuinely local, accurate content: housing stock, weather exposure, what Andrew sees there...',
  localNotes: ['A specific, true local observation.', 'Another one.'],
  faqs: [
    { q: 'Do you serve all of Virginia Beach?', a: '...' },
    { q: 'A real local question', a: '...' },
  ],
},
```

3. Push. The page appears at `/service-areas/virginia/virginia-beach`, is linked from the state page, gets its own title, meta, JSON-LD and sitemap entry, and is listed in `llms.txt`.

Rules: no invented offices or addresses, no fake local reviews, no copy-paste intros.
