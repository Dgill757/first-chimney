/** Small shared pieces for the builder. Kept dependency-free and fully keyboard accessible. */
import { useEffect, useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";

/** A radio-style row of chips. Arrow keys move the selection, like native radios. */
export function Segmented<T extends string>({ label, value, options, onChange }: {
  label: string; value: T | undefined; options: { value: T; label: string; hint?: string }[]; onChange: (v: T) => void;
}) {
  const id = useId();
  const move = (dir: number) => {
    const i = Math.max(0, options.findIndex(o => o.value === value));
    onChange(options[(i + dir + options.length) % options.length].value);
  };
  return (
    <div role="radiogroup" aria-labelledby={id} className="grid gap-2">
      <span id={id} className="bmf-label !mb-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} tabIndex={value === o.value || (!value && o === options[0]) ? 0 : -1}
            className="bmf-chip" title={o.hint}
            onClick={() => onChange(o.value)}
            onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1); } }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuestionBlock({ title, deck, done, children }: { title: string; deck?: string; done?: boolean; children: ReactNode }) {
  return (
    <section className="py-10 sm:py-12">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className={`mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[.7rem] font-bold transition-colors duration-200 ${done ? "border-gold bg-gold text-ink" : "border-paper/30 text-transparent"}`}>{done ? "✓" : "."}</span>
        <div>
          <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">{title}</h2>
          {deck && <p className="mt-2 max-w-2xl text-[.98rem] leading-relaxed text-paper/75">{deck}</p>}
          {done !== undefined && <span className="sr-only">{done ? "Answered" : "Not answered yet"}</span>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Staggered, spring-settled entrance. Reduced motion is handled by MotionConfig at the app root. */
export function Rise({ children, i = 0, className = "" }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: Math.min(i, 8) * 0.045 }}>
      {children}
    </motion.div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading models">
      {Array.from({ length: count }, (_, i) => <div key={i} className="bmf-skeleton aspect-[4/5]" />)}
    </div>
  );
}

/**
 * An image that never shows the browser's broken-image icon. If the file fails
 * to load it swaps in a plain labelled placeholder, which is honest about the
 * photo being missing instead of leaving an empty frame.
 */
export function SafeImg({ fallback = "Photo on the way", className = "", ...img }: React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [img.src]);
  if (failed || !img.src) {
    return <span role="img" aria-label={img.alt || fallback} className={`grid place-items-center text-center text-[.78rem] font-semibold leading-snug text-ink/55 ${className}`}>{fallback}</span>;
  }
  return <img {...img} className={className} onError={() => setFailed(true)} />;
}

export const fmt =(n: number) => n.toLocaleString("en-US");
