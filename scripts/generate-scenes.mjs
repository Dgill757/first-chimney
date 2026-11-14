/**
 * Ultra-realistic scene generator (OpenAI gpt-image-1). Optional; run locally.
 *
 *   OPENAI_API_KEY=sk-... node scripts/generate-scenes.mjs            # all scenes
 *   OPENAI_API_KEY=sk-... node scripts/generate-scenes.mjs stone-hearth  # one scene
 *
 * Writes WebP-ready PNGs to public/media/ai/<id>.png. Review every image before using it.
 *
 * Rules (do not remove):
 *  - Ambiance and material scenes only: rooms, fireplaces, masonry, chimneys, weather.
 *  - Never generate people presented as First Chimney staff, and never present a
 *    generated image as a completed First Chimney job. Real job photos come from Andrew.
 *  - Never generate logos or other companies' branded products.
 *
 * Cost: roughly $0.04-0.19 per image depending on size/quality (check current OpenAI pricing).
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error('Set OPENAI_API_KEY first. Nothing was generated.');
  process.exit(1);
}

const STYLE =
  'Ultra-realistic architectural interior photograph, shot on a full-frame camera with a 35mm lens, natural window light mixed with warm firelight, true-to-life materials and textures, subtle depth of field, editorial home magazine quality. No people, no text, no logos, no watermarks.';

const SCENES = [
  { id: 'hero-living-room', size: '1536x1024', prompt: `A cozy, upscale living room at dusk with a crackling wood fire in a classic red-brick fireplace, thick oak beam mantel, raised bluestone hearth, soft throw blankets on a linen sofa, winter evening light through tall windows. ${STYLE}` },
  { id: 'stone-hearth', size: '1536x1024', prompt: `A floor-to-ceiling stacked ledgestone fireplace with a modern gas insert burning, walnut floating mantel, flush slate hearth, minimalist Scandinavian living room. ${STYLE}` },
  { id: 'whitewash-cottage', size: '1536x1024', prompt: `A bright coastal cottage living room with a whitewashed brick fireplace, painted white mantel shelf, glass fireplace doors, gas log set glowing, light oak floors. ${STYLE}` },
  { id: 'modern-linear', size: '1536x1024', prompt: `A long linear gas fireplace set into a smooth limewash plaster wall, glass ember bed, low media console, contemporary open-plan home at night. ${STYLE}` },
  { id: 'farmhouse-fieldstone', size: '1536x1024', prompt: `A rustic farmhouse great room with a tall fieldstone fireplace, reclaimed timber beam mantel, wood insert burning, firewood stacked in a built-in niche. ${STYLE}` },
  { id: 'chimney-exterior-winter', size: '1536x1024', prompt: 'Ultra-realistic exterior photograph of a well-maintained red-brick chimney with a stainless steel chimney cap on a slate roof of a colonial New England home, light snow, clear winter sky, golden hour. No people, no text, no logos.' },
  { id: 'holiday-hearth', size: '1024x1536', prompt: `A welcoming holiday living room with a warm fire in a brick fireplace, simple evergreen garland placed safely away from the opening, mantel with candles unlit, soft bokeh string lights in the background. ${STYLE}` },
];

const only = process.argv[2];
mkdirSync('public/media/ai', { recursive: true });

for (const s of SCENES.filter((x) => !only || x.id === only)) {
  process.stdout.write(`generating ${s.id}... `);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt: s.prompt, size: s.size, quality: 'high', n: 1 }),
  });
  if (!res.ok) {
    console.log(`failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    continue;
  }
  const data = await res.json();
  writeFileSync(`public/media/ai/${s.id}.png`, Buffer.from(data.data[0].b64_json, 'base64'));
  console.log('saved');
}
