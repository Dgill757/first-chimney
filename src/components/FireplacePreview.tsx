/**
 * Parametric fireplace illustration. Original artwork drawn in SVG from the
 * option data in src/data/designer.ts, so every combination renders instantly,
 * scales to any size and costs no image downloads.
 *
 * It is an aesthetic preview. Proportions are illustrative, not to scale.
 */
import { useId } from 'react';
import { resolveDesign, type Design, type Surround } from '@/data/designer';

const W = 800;
const H = 600;
const FLOOR = 512;
const BREAST_L = 170;
const BREAST_R = 630;

function SurroundPattern({ id, s }: { id: string; s: Surround }) {
  switch (s.pattern) {
    case 'brick':
      return (
        <pattern id={id} width="120" height="48" patternUnits="userSpaceOnUse">
          <rect width="120" height="48" fill={s.mortar} />
          <rect x="1.5" y="1.5" width="57" height="21" rx="1.5" fill={s.base} />
          <rect x="61.5" y="1.5" width="57" height="21" rx="1.5" fill={s.accent} />
          <rect x="-28.5" y="25.5" width="57" height="21" rx="1.5" fill={s.accent} />
          <rect x="31.5" y="25.5" width="57" height="21" rx="1.5" fill={s.base} />
          <rect x="91.5" y="25.5" width="57" height="21" rx="1.5" fill={s.base} />
          <rect x="4" y="4" width="20" height="3" fill="#fff" opacity="0.06" />
          <rect x="70" y="30" width="18" height="3" fill="#000" opacity="0.08" />
        </pattern>
      );
    case 'stacked':
      return (
        <pattern id={id} width="160" height="40" patternUnits="userSpaceOnUse">
          <rect width="160" height="40" fill={s.mortar} />
          <rect x="0" y="1" width="62" height="9" fill={s.base} />
          <rect x="64" y="1" width="94" height="8" fill={s.accent} />
          <rect x="0" y="12" width="38" height="11" fill={s.accent} />
          <rect x="40" y="12" width="70" height="10" fill={s.base} />
          <rect x="112" y="12" width="48" height="11" fill={s.base} opacity="0.85" />
          <rect x="0" y="25" width="88" height="7" fill={s.base} />
          <rect x="90" y="25" width="70" height="8" fill={s.accent} />
          <rect x="0" y="34" width="120" height="5" fill={s.accent} opacity="0.8" />
          <rect x="122" y="34" width="38" height="5" fill={s.base} />
        </pattern>
      );
    case 'stone':
      return (
        <pattern id={id} width="140" height="110" patternUnits="userSpaceOnUse">
          <rect width="140" height="110" fill={s.mortar} />
          <path d="M6 8 Q30 2 52 9 Q58 30 48 44 Q22 50 8 40 Q2 22 6 8Z" fill={s.base} />
          <path d="M60 6 Q92 2 118 10 Q124 26 114 38 Q84 42 62 36 Q56 20 60 6Z" fill={s.accent} />
          <path d="M122 14 Q136 12 140 16 L140 46 Q128 48 120 40Z" fill={s.base} />
          <path d="M4 50 Q26 52 40 56 Q44 80 32 96 Q10 100 2 88Z" fill={s.accent} />
          <path d="M48 52 Q78 46 98 54 Q104 76 92 92 Q62 98 46 86 Q42 66 48 52Z" fill={s.base} />
          <path d="M104 50 Q126 46 138 54 Q140 78 132 96 Q112 98 102 84Z" fill={s.accent} />
          <path d="M36 100 Q60 98 76 104 L74 110 L34 110Z" fill={s.base} />
        </pattern>
      );
    case 'tile':
      return (
        <pattern id={id} width="116" height="116" patternUnits="userSpaceOnUse">
          <rect width="116" height="116" fill={s.mortar} />
          <rect x="1" y="1" width="114" height="114" fill={s.base} />
          <rect x="1" y="1" width="114" height="40" fill="#fff" opacity="0.025" />
        </pattern>
      );
    case 'slab':
      return (
        <pattern id={id} width="460" height="520" patternUnits="userSpaceOnUse">
          <rect width="460" height="520" fill={s.base} />
          <path d="M-20 80 C 90 60, 160 150, 260 120 S 420 40, 480 110" stroke={s.accent} strokeWidth="2.5" fill="none" opacity="0.55" />
          <path d="M-10 300 C 80 260, 200 340, 300 290 S 430 230, 470 280" stroke={s.accent} strokeWidth="1.5" fill="none" opacity="0.45" />
          <path d="M120 0 C 140 120, 90 220, 160 360 S 150 480, 200 520" stroke={s.mortar} strokeWidth="1.2" fill="none" opacity="0.7" />
        </pattern>
      );
    case 'plaster':
    default:
      return (
        <pattern id={id} width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill={s.base} />
          <path d="M0 40 Q60 20 120 50 T 200 30" stroke={s.accent} strokeWidth="18" fill="none" opacity="0.18" />
          <path d="M0 140 Q80 110 140 150 T 200 130" stroke={s.accent} strokeWidth="22" fill="none" opacity="0.14" />
        </pattern>
      );
  }
}

function Flames({ x, y, w, h, kind, animate, p }: { x: number; y: number; w: number; h: number; kind: string; animate: boolean; p: string }) {
  const cx = x + w / 2;
  const base = y + h - 14;
  if (kind === 'electric') {
    return (
      <g>
        <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx="4" fill="#0b0b0c" />
        {[0.2, 0.38, 0.55, 0.72].map((t, i) => (
          <ellipse key={i} className={animate ? 'fp-flicker' : undefined} style={{ animationDelay: `${i * 0.35}s` }} cx={x + w * t + 10} cy={base - h * 0.18} rx={w * 0.08} ry={h * 0.26} fill={`url(#${p}-flame)`} opacity="0.75" />
        ))}
        <rect x={x + 16} y={base - 6} width={w - 32} height="8" rx="3" fill="#ff7a2e" opacity="0.6" />
      </g>
    );
  }
  if (kind === 'linear-gas') {
    const n = Math.max(6, Math.round(w / 34));
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const fx = x + 18 + ((w - 36) / (n - 1)) * i;
          const fh = h * (0.45 + ((i * 37) % 5) * 0.06);
          return (
            <path
              key={i}
              className={animate ? 'fp-flicker' : undefined}
              style={{ animationDelay: `${(i % 4) * 0.22}s` }}
              d={`M${fx - 10} ${base} Q${fx - 12} ${base - fh * 0.5} ${fx} ${base - fh} Q${fx + 12} ${base - fh * 0.5} ${fx + 10} ${base} Z`}
              fill={`url(#${p}-flame)`}
            />
          );
        })}
        {Array.from({ length: Math.round(w / 9) }, (_, i) => (
          <circle key={i} cx={x + 8 + i * 9} cy={base + 4 + (i % 2) * 3} r="3.4" fill={['#5aa1b8', '#c9d6dc', '#3a6f86', '#e6a35c'][i % 4]} opacity="0.85" />
        ))}
      </g>
    );
  }
  const logs = (
    <g>
      <rect x={cx - w * 0.3} y={base - 10} width={w * 0.6} height="18" rx="9" fill="#4a2f1e" transform={`rotate(-6 ${cx} ${base})`} />
      <rect x={cx - w * 0.26} y={base - 18} width={w * 0.5} height="16" rx="8" fill="#5d3a24" transform={`rotate(8 ${cx} ${base})`} />
      <rect x={cx - w * 0.3} y={base - 4} width={w * 0.6} height="6" rx="3" fill="#ff8a3d" opacity="0.7" />
    </g>
  );
  // Organic tongue of flame: asymmetric bezier with a curling tip.
  const tongue = (fx: number, fh: number, fw: number, lean: number) =>
    `M${fx - fw} ${base - 4} C${fx - fw * 1.35} ${base - fh * 0.38} ${fx - fw * 0.2 + lean * 0.4} ${base - fh * 0.62} ${fx + lean} ${base - fh} C${fx + fw * 0.35 + lean * 0.3} ${base - fh * 0.66} ${fx + fw * 1.3} ${base - fh * 0.36} ${fx + fw} ${base - 4} Z`;
  const scale = kind === 'gas-logs' ? 0.42 : 0.6;
  const flames = [
    { o: -0.2, s: 0.7, l: -10 },
    { o: -0.08, s: 1, l: 6 },
    { o: 0.05, s: 0.88, l: -8 },
    { o: 0.17, s: 0.66, l: 10 },
    { o: -0.01, s: 0.55, l: 0 },
  ];
  const flameSet = flames.map((f, i) => {
    const fx = cx + w * f.o;
    const fh = h * scale * f.s;
    const fw = Math.max(12, w * 0.06);
    return (
      <g key={i} className={animate ? 'fp-flicker' : undefined} style={{ animationDelay: `${i * 0.23}s`, animationDuration: `${1.3 + (i % 3) * 0.35}s` }}>
        <path d={tongue(fx, fh, fw, f.l)} fill={`url(#${p}-flame)`} />
        <path d={tongue(fx, fh * 0.58, fw * 0.5, f.l * 0.5)} fill={`url(#${p}-core)`} />
      </g>
    );
  });
  return (
    <g>
      <ellipse cx={cx} cy={base - h * 0.12} rx={w * 0.34} ry={h * 0.28} fill="#ff8a3d" opacity="0.35" filter={`url(#${p}-blur)`} />
      {flameSet}
      {logs}
      {kind === 'gas-logs' && <rect x={cx - w * 0.28} y={base + 4} width={w * 0.56} height="4" rx="2" fill="#4da3ff" opacity="0.55" />}
    </g>
  );
}

export default function FireplacePreview({ design, animate = true, className = '', title }: { design: Design; animate?: boolean; className?: string; title?: string }) {
  const raw = useId();
  const p = `fp${raw.replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = resolveDesign(design);
  const { style, surround, mantel, hearth, fire } = r;
  const has = (id: string) => r.extras.some((e) => e.id === id);

  const ow = Math.round(style.width * 700);
  const oh = Math.round(style.height * 600);
  const hearthTop = hearth.kind === 'raised' ? FLOOR - 34 : hearth.kind === 'slab' ? FLOOR - 12 : FLOOR - 2;
  const oy = hearthTop - oh;
  const ox = W / 2 - ow / 2;
  const mantelY = oy - 58;
  const isInsert = fire.kind === 'wood-insert';
  const arch = style.opening === 'arch';
  const openingPath = arch
    ? `M${ox} ${oy + oh} L${ox} ${oy + 40} Q${ox} ${oy} ${W / 2} ${oy - 6} Q${ox + ow} ${oy} ${ox + ow} ${oy + 40} L${ox + ow} ${oy + oh} Z`
    : `M${ox} ${oy + oh} L${ox} ${oy} L${ox + ow} ${oy} L${ox + ow} ${oy + oh} Z`;
  const glow = fire.kind === 'electric' ? 0.35 : fire.kind === 'linear-gas' ? 0.55 : 0.75;
  const label = title ?? `${style.name} fireplace with ${surround.name.toLowerCase()}, ${mantel.name.toLowerCase()}, ${hearth.name.toLowerCase()} and ${fire.name.toLowerCase()}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <title>{label}</title>
      <defs>
        <SurroundPattern id={`${p}-sur`} s={surround} />
        <linearGradient id={`${p}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24201c" />
          <stop offset="1" stopColor="#161311" />
        </linearGradient>
        <linearGradient id={`${p}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a1f" />
          <stop offset="1" stopColor="#1c1410" />
        </linearGradient>
        <linearGradient id={`${p}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.38" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id={`${p}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="0.4" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${p}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9a4a" stopOpacity={glow} />
          <stop offset="1" stopColor="#ff9a4a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${p}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff1c2" />
          <stop offset="0.35" stopColor="#ffb347" />
          <stop offset="0.75" stopColor="#f0642a" />
          <stop offset="1" stopColor="#c2361a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${p}-core`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </linearGradient>
        <filter id={`${p}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <pattern id={`${p}-firebrick`} width="40" height="16" patternUnits="userSpaceOnUse">
          <rect width="40" height="16" fill="#1b1310" />
          <rect x="1" y="1" width="38" height="6.5" fill="#2a1a13" />
          <rect x="-19" y="9" width="38" height="6" fill="#2a1a13" />
          <rect x="21" y="9" width="38" height="6" fill="#24170f" />
        </pattern>
        <pattern id={`${p}-mesh`} width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 0 L5 5 M5 0 L0 5" stroke="#000" strokeWidth="0.8" opacity="0.55" />
        </pattern>
        <clipPath id={`${p}-open`}>
          <path d={openingPath} />
        </clipPath>
      </defs>

      {/* Room */}
      <rect width={W} height={H} fill={`url(#${p}-wall)`} />
      <rect y={FLOOR} width={W} height={H - FLOOR} fill={`url(#${p}-floor)`} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={i * 100 - 20} y1={FLOOR} x2={i * 100 - 60} y2={H} stroke="#000" strokeOpacity="0.25" />
      ))}

      {/* Built-ins */}
      {has('built-ins') &&
        [30, 650].map((bx) => (
          <g key={bx}>
            <rect x={bx} y="70" width="120" height={FLOOR - 70} fill="#2a2622" stroke="#3a342e" />
            {[150, 235, 320].map((sy) => (
              <rect key={sy} x={bx + 6} y={sy} width="108" height="6" fill="#3d3731" />
            ))}
            <rect x={bx + 6} y={FLOOR - 130} width="52" height="124" fill="#322d28" stroke="#423b34" />
            <rect x={bx + 62} y={FLOOR - 130} width="52" height="124" fill="#322d28" stroke="#423b34" />
            <rect x={bx + 20} y="110" width="22" height="40" fill="#5c4a3a" />
            <rect x={bx + 70} y="200" width="30" height="35" rx="15" fill="#6b5b4c" />
          </g>
        ))}

      {/* Wood storage */}
      {has('wood-niche') && (
        <g>
          <rect x={has('built-ins') ? 36 : 52} y={FLOOR - 120} width="96" height="118" fill="#141110" stroke="#3a342e" />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={(has('built-ins') ? 50 : 66) + (i % 4) * 22 + ((Math.floor(i / 4) % 2) * 11)} cy={FLOOR - 16 - Math.floor(i / 4) * 21} r="10" fill={i % 3 ? '#7a5636' : '#8c6642'} stroke="#4a3220" strokeWidth="2" />
          ))}
        </g>
      )}

      {/* Chimney breast */}
      <rect x={BREAST_L} y="0" width={BREAST_R - BREAST_L} height={FLOOR} fill={`url(#${p}-sur)`} />
      <rect x={BREAST_L} y="0" width={BREAST_R - BREAST_L} height={FLOOR} fill={`url(#${p}-shade)`} />
      <rect x={BREAST_L} y="0" width={BREAST_R - BREAST_L} height={FLOOR} fill={`url(#${p}-top)`} />
      <ellipse cx={W / 2} cy={oy + oh * 0.4} rx={ow * 0.9} ry={oh * 1.1} fill={`url(#${p}-glow)`} style={{ mixBlendMode: 'screen' }} />

      {/* Shelf mantel pilasters (behind mantel, beside opening) */}
      {mantel.kind === 'shelf' && (
        <g fill={mantel.color}>
          <rect x={ox - 46} y={mantelY + 18} width="30" height={hearthTop - mantelY - 18} />
          <rect x={ox + ow + 16} y={mantelY + 18} width="30" height={hearthTop - mantelY - 18} />
          <rect x={ox - 16} y={mantelY + 18} width={ow + 32} height="16" />
        </g>
      )}

      {/* Opening + firebox */}
      <path d={openingPath} fill="#090707" />
      <g clipPath={`url(#${p}-open)`}>
        {fire.kind !== 'electric' && fire.kind !== 'linear-gas' && !isInsert && <rect x={ox} y={oy - 10} width={ow} height={oh + 10} fill={`url(#${p}-firebrick)`} />}
        {isInsert ? (
          <g>
            <rect x={ox} y={oy - 10} width={ow} height={oh + 10} fill="#151515" />
            <rect x={ox + ow * 0.16} y={oy + oh * 0.2} width={ow * 0.68} height={oh * 0.66} rx="6" fill="#050505" stroke="#2c2c2c" strokeWidth="6" />
            <Flames x={ox + ow * 0.16 + 6} y={oy + oh * 0.2 + 6} w={ow * 0.68 - 12} h={oh * 0.66 - 12} kind="open-wood" animate={animate} p={p} />
            <rect x={ox + ow * 0.16 + 4} y={oy + oh * 0.2 + 4} width={ow * 0.25} height={oh * 0.66 - 8} fill="#fff" opacity="0.05" />
          </g>
        ) : (
          <Flames x={ox} y={oy} w={ow} h={oh} kind={fire.kind} animate={animate} p={p} />
        )}
        <rect x={ox} y={oy - 10} width={ow} height="30" fill="#000" opacity="0.45" />
      </g>
      <path d={openingPath} fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="4" />

      {/* Glass doors / screen */}
      {has('glass-doors') && !isInsert && fire.kind !== 'electric' && (
        <g>
          <path d={openingPath} fill="#9fb7c4" opacity="0.08" />
          <path d={openingPath} fill="none" stroke="#1c1c1c" strokeWidth="10" />
          <line x1={W / 2} y1={oy} x2={W / 2} y2={oy + oh} stroke="#1c1c1c" strokeWidth="6" />
          <path d={`M${ox + 20} ${oy + oh - 10} L${ox + ow * 0.35} ${oy + 20}`} stroke="#fff" strokeOpacity="0.12" strokeWidth="10" />
        </g>
      )}
      {has('screen') && !has('glass-doors') && !isInsert && fire.kind !== 'electric' && (
        <g>
          <rect x={ox + 8} y={oy + oh * 0.28} width={ow - 16} height={oh * 0.72} fill={`url(#${p}-mesh)`} />
          <rect x={ox + 8} y={oy + oh * 0.28} width={ow - 16} height={oh * 0.72} fill="none" stroke="#111" strokeWidth="4" />
        </g>
      )}

      {/* Mantel */}
      {mantel.kind === 'beam' && (
        <g>
          <rect x={ox - 70} y={mantelY + 34} width={ow + 140} height="10" fill="#000" opacity="0.35" />
          <rect x={ox - 70} y={mantelY} width={ow + 140} height="36" rx="3" fill={mantel.color} />
          <path d={`M${ox - 60} ${mantelY + 12} Q${W / 2} ${mantelY + 6} ${ox + ow + 60} ${mantelY + 14} M${ox - 50} ${mantelY + 24} Q${W / 2} ${mantelY + 30} ${ox + ow + 50} ${mantelY + 22}`} stroke="#000" strokeOpacity="0.22" fill="none" strokeWidth="2" />
          <rect x={ox - 70} y={mantelY} width={ow + 140} height="5" fill="#fff" opacity="0.08" />
        </g>
      )}
      {mantel.kind === 'shelf' && (
        <g>
          <rect x={ox - 62} y={mantelY + 18} width={ow + 124} height="8" fill="#000" opacity="0.3" />
          <rect x={ox - 62} y={mantelY} width={ow + 124} height="20" fill={mantel.color} />
          <rect x={ox - 62} y={mantelY + 16} width={ow + 124} height="4" fill="#000" opacity="0.08" />
        </g>
      )}
      {mantel.kind === 'floating' && (
        <g>
          <rect x={ox - 40} y={mantelY + 30} width={ow + 80} height="10" fill="#000" opacity="0.35" />
          <rect x={ox - 40} y={mantelY + 16} width={ow + 80} height="15" fill={mantel.color} />
        </g>
      )}
      {mantel.kind === 'stone' && (
        <g>
          <rect x={ox - 56} y={mantelY + 28} width={ow + 112} height="10" fill="#000" opacity="0.35" />
          <rect x={ox - 56} y={mantelY} width={ow + 112} height="30" fill={mantel.color} />
          <path d={`M${ox - 40} ${mantelY + 30} l0 26 l18 0 l0 -10 Z M${ox + ow + 40} ${mantelY + 30} l0 26 l-18 0 l0 -10 Z`} fill={mantel.color} />
        </g>
      )}

      {/* Decor on mantel */}
      {mantel.kind !== 'none' && (
        <g opacity="0.9">
          <rect x={ox - 30} y={mantelY - 44} width="16" height="44" rx="2" fill="#d9cfc0" />
          <rect x={ox - 10} y={mantelY - 30} width="14" height="30" rx="2" fill="#a89a88" />
          <circle cx={ox + ow + 18} cy={mantelY - 22} r="20" fill="#2f4a37" />
          <rect x={ox + ow + 14} y={mantelY - 6} width="8" height="6" fill="#4a3a2c" />
        </g>
      )}

      {/* Hearth */}
      {hearth.kind === 'raised' && (
        <g>
          <rect x={ox - 70} y={hearthTop} width={ow + 140} height={FLOOR - hearthTop} fill={hearth.color} />
          {hearth.pattern === 'brick' && Array.from({ length: Math.ceil((ow + 140) / 40) }, (_, i) => <line key={i} x1={ox - 70 + i * 40} y1={hearthTop + 8} x2={ox - 70 + i * 40} y2={FLOOR} stroke="#000" strokeOpacity="0.25" />)}
          <rect x={ox - 78} y={hearthTop - 6} width={ow + 156} height="10" fill={hearth.color} />
          <rect x={ox - 78} y={hearthTop - 6} width={ow + 156} height="3" fill="#fff" opacity="0.12" />
        </g>
      )}
      {hearth.kind === 'slab' && (
        <g>
          <rect x={ox - 90} y={hearthTop} width={ow + 180} height={FLOOR - hearthTop} fill={hearth.color} />
          <rect x={ox - 90} y={hearthTop} width={ow + 180} height="3" fill="#fff" opacity="0.14" />
        </g>
      )}
      {hearth.kind === 'flush' && (
        <g>
          <rect x={ox - 80} y={FLOOR} width={ow + 160} height="44" fill={hearth.color} />
          <line x1={W / 2} y1={FLOOR} x2={W / 2} y2={FLOOR + 44} stroke="#000" strokeOpacity="0.3" />
        </g>
      )}

      {/* Floor glow */}
      <ellipse cx={W / 2} cy={FLOOR + 30} rx={ow * 0.9} ry="44" fill={`url(#${p}-glow)`} style={{ mixBlendMode: 'screen' }} />
    </svg>
  );
}
