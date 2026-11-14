import { useId, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Brush,
  Camera,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Droplets,
  Flame,
  Landmark,
  MessageSquareText,
  Phone,
  Wind,
  BrickWall,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/data/services';
import type { Crumb } from '@/lib/routes';
import { SITE } from '@/lib/site';
import { track } from '@/lib/track';

export const EASE = [0.23, 1, 0.32, 1] as const;

/** Fade-and-rise on first scroll into view. Static under reduced motion. */
export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const reduce = useReducedMotion();
  const M = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, transform: 'translateY(18px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

export const SERVICE_ICONS: Record<IconName, LucideIcon> = {
  camera: Camera,
  brush: Brush,
  brick: BrickWall,
  droplet: Droplets,
  cap: CircleDashed,
  crown: Landmark,
  flame: Flame,
  wind: Wind,
};

export function SectionHeading({ eyebrow, title, lede, align = 'left', id }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; align?: 'left' | 'center'; id?: string }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 id={id} className="display-lg text-bone">
        {title}
      </h2>
      {lede && <p className={`lede mt-5 ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p>}
    </div>
  );
}

export function CallLink({ placement, className = 'btn btn-ghost', children }: { placement: string; className?: string; children?: ReactNode }) {
  return (
    <a href={SITE.phoneHref} className={className} onClick={() => track('click_to_call', { placement })}>
      {children ?? (
        <>
          <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          {SITE.phoneDisplay}
        </>
      )}
    </a>
  );
}

export function TextLink({ placement, className = 'btn btn-ghost', children }: { placement: string; className?: string; children?: ReactNode }) {
  return (
    <a href={SITE.smsHref} className={className} onClick={() => track('click_to_text', { placement })}>
      {children ?? (
        <>
          <MessageSquareText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Text us
        </>
      )}
    </a>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-dim">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-mute">
                {c.name}
              </span>
            ) : (
              <Link to={c.path} className="transition-colors hover:text-bone">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Accessible accordion. One open at a time. Height animates via grid-rows, no layout thrash. */
export function Faq({ items, className = '' }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className={`divide-y divide-white/[0.08] border-y border-white/[0.08] ${className}`}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3 className="m-0 text-base font-normal" style={{ fontFamily: 'var(--font-sans)', fontStretch: '100%', letterSpacing: 0 }}>
              <button
                type="button"
                id={`${base}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-medium text-bone transition-colors hover:text-ember-2"
              >
                {f.q}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-ember transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={`${base}-a${i}`}
              role="region"
              aria-labelledby={`${base}-q${i}`}
              className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-strong)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="max-w-[68ch] pb-6 leading-relaxed text-mute">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Small crossfade for swapping content (form states etc). */
export function Swap({ k, children }: { k: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={k}
        initial={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)', transform: 'translateY(6px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }}
        exit={{ opacity: 0, filter: 'blur(4px)' }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Page-top intro block for interior pages. */
export function PageIntro({ crumbs, eyebrow, title, lede, children }: { crumbs: Crumb[]; eyebrow?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b hairline pb-14 pt-32 md:pb-20 md:pt-40">
      <div aria-hidden className="ember-glow pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-60" />
      <div className="wrap relative">
        <Breadcrumbs crumbs={crumbs} />
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className={`display-xl max-w-4xl text-bone ${eyebrow ? 'mt-4' : 'mt-8'}`}>{title}</h1>
        {lede && <p className="lede mt-6">{lede}</p>}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  );
}
