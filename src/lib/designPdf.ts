/**
 * Branded "Your Fireplace Design" PDF, generated in the browser with no library.
 *
 * 1. Compose a letter-size page (1275x1650 px = 8.5x11 in at 150 dpi) on a canvas:
 *    logo, the live SVG fireplace render, a spec sheet with swatches, next steps, contact.
 * 2. Encode as JPEG and wrap it in a minimal single-page PDF (pure function below,
 *    unit tested) with a clickable link that reopens the exact design.
 */
import { PROJECT_TYPES, resolveDesign, type Design } from '../data/designer';
import { CREDENTIALS, SITE } from './site';

const W = 1275;
const H = 1650;

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

export function designRef(d: Design): string {
  const s = JSON.stringify(d);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return `FD-${h.toString(36).toUpperCase().slice(0, 6)}`;
}

export async function buildDesignPdf(svg: SVGSVGElement, design: Design, shareUrl: string, forName?: string): Promise<Blob> {
  const r = resolveDesign(design);
  await Promise.all([document.fonts.load('760 60px Archivo'), document.fonts.load('500 24px Geist')]).catch(() => undefined);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const display = (px: number, weight = 760) => `${weight} ${px}px Archivo, "Segoe UI", sans-serif`;
  const text = (px: number, weight = 400) => `${weight} ${px}px Geist, "Segoe UI", sans-serif`;

  // Ground
  ctx.fillStyle = '#121110';
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 520, 50, W / 2, 520, 800);
  glow.addColorStop(0, 'rgba(240,122,50,0.16)');
  glow.addColorStop(1, 'rgba(240,122,50,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f07a32';
  ctx.fillRect(0, 0, W, 12);

  // Header
  const logo = await loadImage(SITE.logoPng);
  const lw = 260;
  ctx.drawImage(logo, 70, 52, lw, (logo.height / logo.width) * lw);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f07a32';
  ctx.font = text(20, 600);
  ctx.fillText('FIREPLACE DESIGN', W - 70, 84);
  ctx.fillStyle = '#b9b0a4';
  ctx.font = text(20);
  ctx.fillText(`${designRef(design)}  ·  ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, W - 70, 116);
  if (forName) ctx.fillText(`Prepared for ${forName}`, W - 70, 146);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f3ede4';
  ctx.font = display(62);
  ctx.fillText('Your fireplace design', 70, 262);

  // Preview
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '1600');
  clone.setAttribute('height', '1200');
  clone.removeAttribute('class');
  const svgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
  try {
    const pic = await loadImage(svgUrl);
    const px = 70;
    const py = 300;
    const pw = W - 140;
    const ph = Math.round(pw * 0.75);
    ctx.save();
    roundRect(ctx, px, py, pw, ph, 28);
    ctx.clip();
    ctx.drawImage(pic, px, py, pw, ph);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,244,230,0.12)';
    ctx.lineWidth = 2;
    roundRect(ctx, px, py, pw, ph, 28);
    ctx.stroke();
  } finally {
    URL.revokeObjectURL(svgUrl);
  }

  // Spec sheet: two columns
  const rows: [string, string, string?][] = [
    ['Project', PROJECT_TYPES.find((p) => p.id === design.project)?.name ?? 'Not specified'],
    ['Timeline', design.timeline ?? 'Not specified'],
    ['Style', r.style.name],
    ['Surround', r.surround.name, r.surround.base],
    ['Mantel', r.mantel.name, r.mantel.color === 'transparent' ? undefined : r.mantel.color],
    ['Hearth', r.hearth.name, r.hearth.color],
    ['Fire', r.fire.name],
    ['Extras', r.extras.length ? r.extras.map((e) => e.name).join(', ') : 'None'],
  ];
  const top = 1150;
  const colW = (W - 140 - 40) / 2;
  rows.forEach(([k, v, sw], i) => {
    const col = i < 4 ? 0 : 1;
    const x = 70 + col * (colW + 40);
    const y = top + (i % 4) * 62;
    ctx.fillStyle = '#948b80';
    ctx.font = text(19, 500);
    ctx.fillText(k.toUpperCase(), x, y);
    let tx = x + 150;
    if (sw) {
      ctx.fillStyle = sw;
      roundRect(ctx, tx, y - 20, 24, 24, 6);
      ctx.fill();
      tx += 36;
    }
    ctx.fillStyle = '#f3ede4';
    ctx.font = text(22, 500);
    let val = v;
    while (ctx.measureText(val).width > colW - (tx - x) && val.length > 4) val = `${val.slice(0, -4)}...`;
    ctx.fillText(val, tx, y);
    ctx.fillStyle = 'rgba(255,244,230,0.08)';
    ctx.fillRect(x, y + 20, colW, 1);
  });

  // Next steps
  const ny = 1430;
  ctx.fillStyle = 'rgba(255,244,230,0.04)';
  roundRect(ctx, 70, ny, W - 140, 120, 20);
  ctx.fill();
  ctx.fillStyle = '#f3ede4';
  ctx.font = text(22, 600);
  ctx.fillText('What happens next', 100, ny + 42);
  ctx.fillStyle = '#b9b0a4';
  ctx.font = text(19);
  ctx.fillText('First Chimney reviews your design, then visits to measure and confirm what fits your home. Pricing comes after', 100, ny + 76);
  ctx.fillText('that visit, in writing. This illustration is for inspiration and is not a quote, code review or venting plan.', 100, ny + 104);

  // Footer
  ctx.fillStyle = '#f07a32';
  ctx.font = text(24, 700);
  ctx.fillText(`Call or text ${SITE.phoneDisplay}`, 70, H - 52);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#b9b0a4';
  ctx.font = text(19);
  ctx.fillText(`${CREDENTIALS.fire.label}  ·  VA · NJ · CT · MA  ·  Open this design online`, W - 70, H - 52);

  const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);
  const bin = atob(jpegUrl.split(',')[1]);
  const jpeg = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) jpeg[i] = bin.charCodeAt(i);

  // Link rect over the footer right text, converted px -> pt (612/1275) with origin bottom-left.
  const k = 612 / W;
  const pdf = jpegToPdf(jpeg, { w: W, h: H }, { title: `First Chimney fireplace design ${designRef(design)}`, link: { url: shareUrl, rect: [Math.round(640 * k), Math.round(30 * k), Math.round((W - 70) * k), Math.round(80 * k)] } });
  return new Blob([pdf as BlobPart], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
