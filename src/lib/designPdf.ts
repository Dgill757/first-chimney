/**
 * "Your Fireplace Build" guide: a branded, multi-page PDF generated in the browser.
 *
 * Pages are drawn on canvases (letter, 1275x1650 px = 8.5x11 in at 150 dpi),
 * encoded as JPEG and wrapped by a tiny hand-written PDF writer (unit tested).
 * No dependencies. Content comes from src/lib/buildGuide.ts.
 */
import type { BuildGuide } from './buildGuide';
import { CREDENTIALS, SITE } from './site';

/* ------------------------------ PDF writer ------------------------------ */

const enc = new TextEncoder();
const pdfStr = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7e]/g, '');

type Link = { url: string; rect: [number, number, number, number] };

/** Multi-page PDF: one full-bleed JPEG per US Letter page, optional link annotations per page. */
export function jpegsToPdf(pages: { jpeg: Uint8Array; w: number; h: number; links?: Link[] }[], meta: { title: string }): Uint8Array {
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  let next = 3;
  const push = (chunk: Uint8Array | string) => {
    const b = typeof chunk === 'string' ? enc.encode(chunk) : chunk;
    parts.push(b);
    length += b.length;
  };
  const obj = (num: number, body: () => void) => {
    offsets[num] = length;
    push(`${num} 0 obj\n`);
    body();
    push('\nendobj\n');
  };

  const plan = pages.map((pg) => {
    const page = next++;
    const image = next++;
    const content = next++;
    const links = (pg.links ?? []).map(() => next++);
    return { page, image, content, links };
  });
  const info = next++;

  push('%PDF-1.4\n%~~~~\n');
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push(`<< /Type /Pages /Kids [${plan.map((p) => `${p.page} 0 R`).join(' ')}] /Count ${pages.length} >>`));
  pages.forEach((pg, i) => {
    const o = plan[i];
    obj(o.page, () =>
      push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im${i} ${o.image} 0 R >> >> /Contents ${o.content} 0 R${o.links.length ? ` /Annots [${o.links.map((l) => `${l} 0 R`).join(' ')}]` : ''} >>`),
    );
    obj(o.image, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${pg.w} /Height ${pg.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pg.jpeg.length} >>\nstream\n`);
      push(pg.jpeg);
      push('\nendstream');
    });
    const content = `q 612 0 0 792 0 0 cm /Im${i} Do Q`;
    obj(o.content, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
    (pg.links ?? []).forEach((l, j) => {
      const [x1, y1, x2, y2] = l.rect;
      obj(o.links[j], () => push(`<< /Type /Annot /Subtype /Link /Rect [${x1} ${y1} ${x2} ${y2}] /Border [0 0 0] /A << /S /URI /URI (${pdfStr(l.url)}) >> >>`));
    });
  });
  obj(info, () => push(`<< /Title (${pdfStr(meta.title)}) /Author (${pdfStr(SITE.name)}) /Producer (firstchimneycontracting.com) >>`));

  const xrefAt = length;
  push(`xref\n0 ${info + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= info; i++) push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size ${info + 1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

/* ------------------------------ Drawing kit ------------------------------ */

const W = 1275;
const H = 1650;
const M = 72;
const C = { ink: '#121110', panel: 'rgba(255,244,230,0.05)', line: 'rgba(255,244,230,0.10)', bone: '#f3ede4', mute: '#b9b0a4', dim: '#948b80', ember: '#f07a32', gold: '#f6c56f', ok: '#8fd3ae', warn: '#ffb08a' };
const display = (px: number, w = 760) => `${w} ${px}px Archivo, "Segoe UI", sans-serif`;
const text = (px: number, w = 400) => `${w} ${px}px Geist, "Segoe UI", sans-serif`;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, t: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const w of t.split(' ')) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws wrapped text and returns the y after the last line. */
function para(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, max: number, lh: number, font: string, color: string, maxLines = 99): number {
  ctx.font = font;
  ctx.fillStyle = color;
  const lines = wrap(ctx, t, max).slice(0, maxLines);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return y + lines.length * lh;
}

function fitText(ctx: CanvasRenderingContext2D, t: string, max: number): string {
  let v = t;
  while (ctx.measureText(v).width > max && v.length > 4) v = `${v.slice(0, -4)}...`;
  return v;
}

function newPage(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W * 0.75, -100, 50, W * 0.75, -100, 1100);
  g.addColorStop(0, 'rgba(240,122,50,0.16)');
  g.addColorStop(1, 'rgba(240,122,50,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.ember;
  ctx.fillRect(0, 0, W, 10);
  return [c, ctx];
}

function header(ctx: CanvasRenderingContext2D, logo: HTMLImageElement, label: string, ref: string) {
  ctx.drawImage(logo, M, 44, 170, (logo.height / logo.width) * 170);
  ctx.textAlign = 'right';
  ctx.fillStyle = C.ember;
  ctx.font = text(18, 700);
  ctx.fillText(label.toUpperCase(), W - M, 74);
  ctx.fillStyle = C.dim;
  ctx.font = text(17);
  ctx.fillText(ref, W - M, 102);
  ctx.textAlign = 'left';
}

function footer(ctx: CanvasRenderingContext2D, page: number, total: number) {
  ctx.fillStyle = C.line;
  ctx.fillRect(M, H - 96, W - 2 * M, 1);
  ctx.fillStyle = C.ember;
  ctx.font = text(21, 700);
  ctx.fillText(`Call or text ${SITE.phoneDisplay}`, M, H - 52);
  ctx.textAlign = 'right';
  ctx.fillStyle = C.dim;
  ctx.font = text(16);
  ctx.fillText(`Open this build online  ·  ${CREDENTIALS.fire.label}  ·  VA · NJ · CT · MA  ·  Page ${page} of ${total}`, W - M, H - 52);
  ctx.textAlign = 'left';
}

function sectionTitle(ctx: CanvasRenderingContext2D, t: string, x: number, y: number) {
  ctx.fillStyle = C.ember;
  ctx.font = text(17, 700);
  ctx.fillText(t.toUpperCase(), x, y);
}

function toJpeg(c: HTMLCanvasElement): Uint8Array {
  const bin = atob(c.toDataURL('image/jpeg', 0.9).split(',')[1]);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function buildRef(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `FB-${h.toString(36).toUpperCase().slice(0, 6)}`;
}

/* ------------------------------ The guide ------------------------------ */

export async function buildGuidePdf(g: BuildGuide, opts: { layers: string[]; shareUrl: string; forName?: string }): Promise<Blob> {
  await Promise.all([document.fonts.load('760 60px Archivo'), document.fonts.load('400 20px Geist'), document.fonts.load('700 20px Geist')]).catch(() => undefined);
  const logo = await loadImage(SITE.logoPng);
  const ref = buildRef(opts.shareUrl);
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const refLine = `${ref} · ${date}`;
  const pages: HTMLCanvasElement[] = [];
  const total = 3;

  /* ---------- Page 1: cover ---------- */
  {
    const [c, ctx] = newPage();
    header(ctx, logo, 'Your fireplace build', refLine);
    ctx.fillStyle = C.gold;
    ctx.font = text(22, 700);
    ctx.fillText(g.brand.toUpperCase(), M, 214);
    ctx.fillStyle = C.bone;
    ctx.font = display(66);
    ctx.fillText(fitText(ctx, g.model, W - 2 * M), M, 284);
    ctx.fillStyle = C.mute;
    ctx.font = text(22, 500);
    ctx.fillText(`${g.kindLine.replace(/^\w/, (x) => x.toUpperCase())}${g.sku ? ` · Model ${g.sku}` : ''}`, M, 324);
    if (opts.forName) {
      ctx.textAlign = 'right';
      ctx.fillStyle = C.bone;
      ctx.font = text(20, 600);
      ctx.fillText(`Prepared for ${opts.forName}`, W - M, 324);
      ctx.textAlign = 'left';
    }

    const sx = M, sy = 360, sw = W - 2 * M, sh = 640;
    ctx.save();
    rr(ctx, sx, sy, sw, sh, 30);
    ctx.clip();
    ctx.fillStyle = '#f4f1ea';
    ctx.fillRect(sx, sy, sw, sh);
    for (const src of opts.layers) {
      try {
        const im = await loadImage(src);
        const s = Math.min((sw - 40) / im.width, (sh - 40) / im.height);
        const w = im.width * s, h = im.height * s;
        ctx.drawImage(im, sx + (sw - w) / 2, sy + (sh - h) / 2, w, h);
      } catch {
        /* skip a missing layer */
      }
    }
    ctx.restore();

    const ty = 1040;
    const cols = Math.max(1, g.stats.length);
    const tw = (W - 2 * M - (cols - 1) * 20) / cols;
    g.stats.forEach((s, i) => {
      const x = M + i * (tw + 20);
      ctx.fillStyle = C.panel;
      rr(ctx, x, ty, tw, 128, 18);
      ctx.fill();
      ctx.fillStyle = C.dim;
      ctx.font = text(17, 600);
      ctx.fillText(s.label.toUpperCase(), x + 22, ty + 42);
      ctx.fillStyle = C.bone;
      let fs = 34;
      ctx.font = display(fs, 720);
      while (ctx.measureText(s.value).width > tw - 44 && fs > 20) ctx.font = display(--fs, 720);
      ctx.fillText(fitText(ctx, s.value, tw - 44), x + 22, ty + 94);
    });

    let y = para(ctx, g.description, M, 1226, W - 2 * M, 30, text(20), C.mute, 3);
    y += 22;
    sectionTitle(ctx, 'Your choices at a glance', M, y);
    y += 20;
    let x = M;
    ctx.font = text(18, 500);
    const chips = g.choices.length ? g.choices.map(([k, v]) => `${k}: ${v}`) : ['Maker standard configuration'];
    for (const chip of chips) {
      ctx.font = text(18, 500);
      const w = Math.min(ctx.measureText(chip).width + 36, W - 2 * M);
      if (x + w > W - M) {
        x = M;
        y += 52;
      }
      if (y > H - 170) break;
      ctx.strokeStyle = 'rgba(240,122,50,0.45)';
      ctx.lineWidth = 1.5;
      rr(ctx, x, y + 6, w, 40, 20);
      ctx.stroke();
      ctx.fillStyle = C.bone;
      ctx.fillText(fitText(ctx, chip, w - 36), x + 18, y + 33);
      x += w + 12;
    }
    // Next-step band
    const by = H - 218;
    ctx.fillStyle = 'rgba(240,122,50,0.10)';
    rr(ctx, M, by, W - 2 * M, 92, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(240,122,50,0.45)';
    ctx.lineWidth = 1.5;
    rr(ctx, M, by, W - 2 * M, 92, 18);
    ctx.stroke();
    ctx.fillStyle = C.bone;
    ctx.font = text(20, 700);
    ctx.fillText('Next step: an on-site measure, then a written, itemized quote.', M + 28, by + 40);
    ctx.fillStyle = C.mute;
    ctx.font = text(18);
    ctx.fillText(`Call or text ${SITE.phoneDisplay} and mention build ${ref}. Inside: your item breakdown, heat guide and install journey.`, M + 28, by + 70);
    footer(ctx, 1, total);
    pages.push(c);
  }

  /* ---------- Page 2: what you are getting + heat ---------- */
  {
    const [c, ctx] = newPage();
    header(ctx, logo, `${g.brand} ${g.model}`, refLine);
    ctx.fillStyle = C.bone;
    ctx.font = display(48);
    ctx.fillText('What you are getting', M, 220);

    let y = 268;
    sectionTitle(ctx, 'Item breakdown', M, y);
    y += 16;
    const colA = M + 24, colB = M + 360, colC = W - M - 24;
    const shown = g.items.slice(0, 9);
    const rowsH = shown.length * 56 + 56;
    ctx.fillStyle = C.panel;
    rr(ctx, M, y, W - 2 * M, rowsH, 20);
    ctx.fill();
    ctx.fillStyle = C.dim;
    ctx.font = text(16, 700);
    ctx.fillText('ITEM', colA, y + 36);
    ctx.fillText('YOUR SELECTION', colB, y + 36);
    ctx.textAlign = 'right';
    ctx.fillText('PART #', colC, y + 36);
    ctx.textAlign = 'left';
    shown.forEach((it, i) => {
      const ry = y + 56 + i * 56;
      ctx.fillStyle = C.line;
      ctx.fillRect(M + 20, ry, W - 2 * M - 40, 1);
      ctx.fillStyle = i === 0 ? C.gold : C.mute;
      ctx.font = text(19, i === 0 ? 700 : 500);
      ctx.fillText(fitText(ctx, it.item, colB - colA - 20), colA, ry + 36);
      ctx.fillStyle = C.bone;
      ctx.font = text(19, 500);
      ctx.fillText(fitText(ctx, it.detail, colC - colB - 190), colB, ry + 36);
      ctx.textAlign = 'right';
      ctx.fillStyle = C.dim;
      ctx.font = text(17);
      ctx.fillText(it.part ? fitText(ctx, it.part, 170) : '-', colC, ry + 36);
      ctx.textAlign = 'left';
    });
    y += rowsH + 44;

    sectionTitle(ctx, 'Also part of a typical install (confirmed at the measure)', M, y);
    y += 36;
    for (const a of g.alsoNeeded.slice(0, 6)) {
      ctx.fillStyle = C.ember;
      ctx.beginPath();
      ctx.arc(M + 8, y - 7, 5, 0, Math.PI * 2);
      ctx.fill();
      y = para(ctx, a, M + 28, y, W - 2 * M - 40, 28, text(19), C.bone, 2) + 10;
    }
    y += 20;

    sectionTitle(ctx, 'Heat and comfort: what it can and cannot do', M, y);
    y += 22;
    const half = (W - 2 * M - 24) / 2;
    const canLines = [...g.canWarm, ...(g.fitNote ? [g.fitNote] : [])];
    const keepLines = [...(g.sizeVerdict ? [g.sizeVerdict] : []), ...g.cannotWarm];
    const measure = (lines: string[]) => {
      ctx.font = text(18);
      return 84 + lines.reduce((h, l) => h + Math.min(4, wrap(ctx, l, half - 80).length) * 27 + 14, 0) + 10;
    };
    const boxH = Math.min(H - 420 - y, Math.max(measure(canLines), measure(keepLines)));
    const box = (x: number, title: string, color: string, mark: string, lines: string[]) => {
      ctx.fillStyle = C.panel;
      rr(ctx, x, y, half, boxH, 20);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = text(20, 700);
      ctx.fillText(title, x + 26, y + 44);
      let ly = y + 84;
      for (const l of lines) {
        if (ly > y + boxH - 40) break;
        ctx.fillStyle = color;
        ctx.font = text(19, 700);
        ctx.fillText(mark, x + 26, ly);
        ly = para(ctx, l, x + 52, ly, half - 80, 27, text(18), C.bone, 4) + 14;
      }
    };
    box(M, 'It can', C.ok, '+', canLines);
    box(M + half + 24, 'Keep in mind', C.warn, '!', keepLines);

    // Questions answered at the measure
    let qy = y + boxH + 52;
    sectionTitle(ctx, 'Questions we will answer at your measure', M, qy);
    qy += 36;
    const qCol = (W - 2 * M - 24) / 2;
    g.questions.forEach((q, i) => {
      const x = M + (i % 2) * (qCol + 24);
      const yy = qy + Math.floor(i / 2) * 62;
      if (yy > H - 140) return;
      ctx.fillStyle = C.gold;
      ctx.font = text(19, 700);
      ctx.fillText('?', x, yy);
      para(ctx, q, x + 24, yy, qCol - 36, 26, text(18), C.bone, 2);
    });
    footer(ctx, 2, total);
    pages.push(c);
  }

  /* ---------- Page 3: the journey, prep, tips, specs ---------- */
  {
    const [c, ctx] = newPage();
    header(ctx, logo, `${g.brand} ${g.model}`, refLine);
    ctx.fillStyle = C.bone;
    ctx.font = display(48);
    ctx.fillText('From this PDF to your first fire', M, 220);

    let y = 268;
    const colW = (W - 2 * M - 24) / 2;
    g.steps.forEach((s, i) => {
      const x = M + (i % 2) * (colW + 24);
      const sy = y + Math.floor(i / 2) * 150;
      ctx.fillStyle = C.panel;
      rr(ctx, x, sy, colW, 136, 18);
      ctx.fill();
      ctx.fillStyle = C.ember;
      ctx.font = display(34, 800);
      ctx.fillText(String(i + 1).padStart(2, '0'), x + 22, sy + 52);
      ctx.fillStyle = C.bone;
      ctx.font = text(21, 700);
      ctx.fillText(fitText(ctx, s.title, colW - 110), x + 90, sy + 44);
      para(ctx, s.body, x + 90, sy + 76, colW - 112, 25, text(17), C.mute, 3);
    });
    y += 3 * 150 + 30;

    const listCol = (title: string, items: string[], x: number) => {
      sectionTitle(ctx, title, x, y);
      let ly = y + 38;
      for (const t of items) {
        ctx.fillStyle = C.ember;
        ctx.font = text(19, 700);
        ctx.fillText('\u2713', x, ly);
        ly = para(ctx, t, x + 28, ly, colW - 40, 26, text(18), C.bone, 3) + 12;
      }
      return ly;
    };
    const a = listCol('How to prepare', g.prep, M);
    const b = listCol('Good to know', g.tips, M + colW + 24);
    y = Math.max(a, b) + 26;

    if (g.specs.length && y < H - 420) {
      sectionTitle(ctx, 'Specifications from the maker', M, y);
      y += 30;
      const rows = Math.min(g.specs.length, Math.floor((H - 330 - y) / 34) * 2);
      g.specs.slice(0, rows).forEach(([k, v], i) => {
        const x = M + (i % 2) * (colW + 24);
        const sy = y + Math.floor(i / 2) * 34;
        ctx.fillStyle = C.dim;
        ctx.font = text(16, 500);
        ctx.fillText(fitText(ctx, k, 230), x, sy);
        ctx.fillStyle = C.bone;
        ctx.font = text(17, 500);
        ctx.fillText(fitText(ctx, v, colW - 250), x + 240, sy);
      });
    }
    // Closing panel
    const py = H - 300;
    ctx.fillStyle = C.panel;
    rr(ctx, M, py, W - 2 * M, 150, 20);
    ctx.fill();
    ctx.drawImage(logo, M + 28, py + 30, 150, (logo.height / logo.width) * 150);
    ctx.fillStyle = C.bone;
    ctx.font = text(22, 700);
    ctx.fillText(`Ready when you are. Mention build ${ref}.`, M + 220, py + 56);
    para(ctx, `${SITE.name} is owned and run by ${SITE.owner}, ${CREDENTIALS.fire.label}. Every job gets a written quote before work starts, drop cloths down and a walkthrough when we are done.`, M + 220, py + 92, W - 2 * M - 250, 26, text(18), C.mute, 2);
    ctx.fillStyle = C.dim;
    ctx.font = text(15);
    ctx.fillText('Specifications are the manufacturer\u2019s. We confirm fit and requirements on site, and pricing is provided in writing after the measure.', M, H - 118);
    footer(ctx, 3, total);
    pages.push(c);
  }

  // The footer's right-hand text links back to the build on every page (PDF points).
  const k = 612 / W;
  const link: Link = { url: opts.shareUrl, rect: [Math.round((W - 760) * k), Math.round(30 * k), Math.round((W - M) * k), Math.round(78 * k)] };
  const pdf = jpegsToPdf(
    pages.map((cv) => ({ jpeg: toJpeg(cv), w: W, h: H, links: [link] })),
    { title: `First Chimney fireplace build ${ref}: ${g.brand} ${g.model}` },
  );
  return new Blob([pdf as BlobPart], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
