/**
 * Small accessible overlay used to stand in for the Radix Dialog and Vaul Drawer
 * APIs the ported builder calls. Portal, backdrop, Escape, scroll lock, focus on open.
 */
import { createContext, useContext, useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type Ctx = { open: boolean; close: () => void; titleId: string; descId: string; variant: 'dialog' | 'drawer' };
const OverlayCtx = createContext<Ctx | null>(null);

export function OverlayRoot({ open, onOpenChange, variant, children }: { open: boolean; onOpenChange: (v: boolean) => void; variant: Ctx['variant']; children: ReactNode }) {
  const id = useId();
  return <OverlayCtx.Provider value={{ open, close: () => onOpenChange(false), titleId: `${id}-t`, descId: `${id}-d`, variant }}>{children}</OverlayCtx.Provider>;
}

export function OverlayContent({ className = '', children }: { className?: string; children: ReactNode }) {
  const ctx = useContext(OverlayCtx)!;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!ctx.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const back = document.activeElement as HTMLElement | null;
    window.setTimeout(() => ref.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && ctx.close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      back?.focus?.();
    };
  }, [ctx.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const drawer = ctx.variant === 'drawer';
  return createPortal(
    <AnimatePresence>
      {ctx.open && (
        <div className={`fixed inset-0 z-[70] flex ${drawer ? 'items-end' : 'items-center justify-center p-3'}`}>
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={ctx.close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} aria-hidden />
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ctx.titleId}
            aria-describedby={ctx.descId}
            initial={reduce ? { opacity: 0 } : drawer ? { transform: 'translateY(100%)' } : { opacity: 0, transform: 'scale(0.97)' }}
            animate={drawer ? { transform: 'translateY(0%)' } : { opacity: 1, transform: 'scale(1)' }}
            exit={reduce ? { opacity: 0 } : drawer ? { transform: 'translateY(100%)' } : { opacity: 0, transform: 'scale(0.97)' }}
            transition={{ duration: drawer ? 0.4 : 0.22, ease: [0.32, 0.72, 0, 1] }}
            className={`relative flex flex-col border outline-none ${drawer ? 'w-full rounded-t-[22px] pb-[env(safe-area-inset-bottom)]' : 'rounded-[20px]'} ${className}`}
          >
            {drawer && <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-white/20" aria-hidden />}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function OverlayTitle({ className, children }: { className?: string; children: ReactNode }) {
  const ctx = useContext(OverlayCtx)!;
  return (
    <h2 id={ctx.titleId} className={className}>
      {children}
    </h2>
  );
}

export function OverlayDescription({ className, children }: { className?: string; children: ReactNode }) {
  const ctx = useContext(OverlayCtx)!;
  return (
    <p id={ctx.descId} className={className}>
      {children}
    </p>
  );
}
