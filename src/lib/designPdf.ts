/**
 * Branded "Your Fireplace Design" PDF, generated in the browser with no library.
 *
 * 1. Compose a letter-size page (1275x1650 px = 8.5x11 in at 150 dpi) on a canvas:
 *    logo, the live SVG fireplace render, a spec sheet with swatches, next steps, contact.
 * 2. Encode as JPEG and wrap it in a minimal single-page PDF (pure function below,
 *    unit tested) with a clickable link that reopens the exact design.
 */
import { CREDENTIALS, SITE } from './site';


/* ------------------------------ PDF writer ------------------------------ */

const enc = new TextEncoder();
const pdfStr = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7e]/g, '');

/**
 * Builds a valid one-page PDF that draws `jpeg` full-bleed on a US Letter page.
 * `link` is in page points (612x792, origin bottom-left).
 */
export function jpegToPdf(jpeg: Uint8Array, px: { w: number; h: number }, meta: { title: string; link?: { url: string; rect: [number, number, number, number] } }): Uint8Array {
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: Uint8Array | string) => {
    const b = typeof chunk === 'string' ? enc.encode(chunk) : chunk;
    parts.push(b);
    length += b.length;
  };
  const obj = (n: number, body: () => void) => {
    offsets[n] = length;
    push(`${n} 0 obj\n`);
    body();
    push('\nendobj\n');
  };

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'.replace(/[^\x00-\x7f]/g, '~'));
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'));
  obj(3, () =>
    push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R${meta.link ? ' /Annots [6 0 R]' : ''} >>`),
  );
  obj(4, () => {
    push(`<< /Type /XObject /Subtype /Image /Width ${px.w} /Height ${px.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    push(jpeg);
    push('\nendstream');
  });
  const content = 'q 612 0 0 792 0 0 cm /Im0 Do Q';
  obj(5, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
  if (meta.link) {
    const [x1, y1, x2, y2] = meta.link.rect;
    obj(6, () => push(`<< /Type /Annot /Subtype /Link /Rect [${x1} ${y1} ${x2} ${y2}] /Border [0 0 0] /A << /S /URI /URI (${pdfStr(meta.link!.url)}) >> >>`));
  }
  const infoN = meta.link ? 7 : 6;
  obj(infoN, () => push(`<< /Title (${pdfStr(meta.title)}) /Author (${pdfStr(SITE.name)}) /Producer (firstchimneycontracting.com) >>`));

  const xrefAt = length;
  const count = infoN + 1;
  push(`xref\n0 ${count}\n0000000000 65535 f \n`);
  for (let i = 1; i < count; i++) push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size ${count} /Root 1 0 R /Info ${infoN} 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

/* ------------------------------ Page layout ------------------------------ */

const W = 1275;
const H = 1650;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fit(ctx: CanvasRenderingContext2D, t: string, max: number): string {
  let v = t;
  while (ctx.measureText(v).width > max && v.length > 4) v = `${v.slice(0, -4)}...`;
  return v;
}

function wrap(ctx: CanvasRenderingContext2D, t: string, max: number): string[] {
  const words = t.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export function buildRef(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `FB-${h.toString(36).toUpperCase().slice(0, 6)}`;
}

export type BuildPdfInput = {
  brandName: string;
  productName: string;
  subtitle: string;
  /** Image layers drawn in order (layered preview art) or a single product photo. */
  layers: string[];
  options: [string, string][];
  specs: [string, string][];
  notes: string[];
  shareUrl: string;
  forName?: string;
};

/** Branded one-page PDF of a customer's build: product imagery, choices, specs and next steps. */
export async function buildBuildPdf(b: BuildPdfInput): Promise<Blob> {
  await Promise.all([document.fonts.load('760 60px Archivo'), document.fonts.load('500 24px Geist')]).catch(() => undefined);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const display = (px: number, weight = 760) => `${weight} ${px}px Archivo, "Segoe UI", sans-serif`;
  const text = (px: number, weight = 400) => `${weight} ${px}px Geist, "Segoe UI", sans-serif`;
  const ref = buildRef(b.shareUrl);

  ctx.fillStyle = '#121110';
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 560, 60, W / 2, 560, 820);
  glow.addColorStop(0, 'rgba(240,122,50,0.18)');
  glow.addColorStop(1, 'rgba(240,122,50,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f07a32';
  ctx.fillRect(0, 0, W, 12);

  const logo = await loadImage(SITE.logoPng);
  ctx.drawImage(logo, 70, 52, 250, (logo.height / logo.width) * 250);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f07a32';
  ctx.font = text(20, 600);
  ctx.fillText('YOUR FIREPLACE BUILD', W - 70, 84);
  ctx.fillStyle = '#b9b0a4';
  ctx.font = text(20);
  ctx.fillText(`${ref}  ·  ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, W - 70, 116);
  if (b.forName) ctx.fillText(`Prepared for ${b.forName}`, W - 70, 146);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f6c56f';
  ctx.font = text(22, 700);
  ctx.fillText(b.brandName.toUpperCase(), 70, 232);
  ctx.fillStyle = '#f3ede4';
  ctx.font = display(56);
  ctx.fillText(fit(ctx, b.productName, W - 140), 70, 292);
  ctx.fillStyle = '#b9b0a4';
  ctx.font = text(22, 500);
  ctx.fillText(b.subtitle, 70, 330);

  // Product imagery on a warm stage, contained (never cropped).
  const sx = 70, sy = 360, sw = W - 140, sh = 640;
  ctx.save();
  roundRect(ctx, sx, sy, sw, sh, 28);
  ctx.clip();
  ctx.fillStyle = '#f4f1ea';
  ctx.fillRect(sx, sy, sw, sh);
  for (const src of b.layers) {
    try {
      const im = await loadImage(src);
      const s = Math.min(sw / im.width, sh / im.height);
      const w = im.width * s, h = im.height * s;
      ctx.drawImage(im, sx + (sw - w) / 2, sy + (sh - h) / 2, w, h);
    } catch {
      /* a missing layer is skipped rather than failing the PDF */
    }
  }
  ctx.restore();

  // Choices (left) and maker specs (right)
  const top = 1050;
  const colW = (W - 140 - 50) / 2;
  const list = (title: string, rows: [string, string][], x: number) => {
    ctx.fillStyle = '#f07a32';
    ctx.font = text(19, 700);
    ctx.fillText(title.toUpperCase(), x, top);
    rows.slice(0, 7).forEach(([k, v], i) => {
      const y = top + 42 + i * 40;
      ctx.fillStyle = '#948b80';
      ctx.font = text(18, 500);
      ctx.fillText(fit(ctx, k, 200), x, y);
      ctx.fillStyle = '#f3ede4';
      ctx.font = text(19, 500);
      ctx.fillText(fit(ctx, v, colW - 220), x + 215, y);
    });
  };
  list('Your choices', b.options.length ? b.options : [['Options', 'Maker defaults']], 70);
  list('From the maker', b.specs, 70 + colW + 50);

  // Next steps
  const ny = 1370;
  ctx.fillStyle = 'rgba(255,244,230,0.05)';
  roundRect(ctx, 70, ny, W - 140, 170, 20);
  ctx.fill();
  ctx.fillStyle = '#f3ede4';
  ctx.font = text(22, 600);
  ctx.fillText('What happens next', 100, ny + 44);
  ctx.fillStyle = '#b9b0a4';
  ctx.font = text(18);
  const steps = [b.notes[0] ?? '', 'We measure and confirm every dimension on site before ordering. Pricing comes after that visit, in writing.'].filter(Boolean).join(' ');
  wrap(ctx, steps, W - 200).slice(0, 4).forEach((l, i) => ctx.fillText(l, 100, ny + 82 + i * 28));

  ctx.fillStyle = '#f07a32';
  ctx.font = text(24, 700);
  ctx.fillText(`Call or text ${SITE.phoneDisplay}`, 70, H - 50);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#b9b0a4';
  ctx.font = text(19);
  ctx.fillText(`${CREDENTIALS.fire.label}  ·  VA · NJ · CT · MA  ·  Open this build online`, W - 70, H - 50);

  const url = canvas.toDataURL('image/jpeg', 0.9);
  const bin = atob(url.split(',')[1]);
  const jpeg = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) jpeg[i] = bin.charCodeAt(i);
  const k = 612 / W;
  const pdf = jpegToPdf(jpeg, { w: W, h: H }, { title: `First Chimney fireplace build ${ref}: ${b.brandName} ${b.productName}`, link: { url: b.shareUrl, rect: [Math.round(640 * k), Math.round(28 * k), Math.round((W - 70) * k), Math.round(78 * k)] } });
  return new Blob([pdf as BlobPart], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
