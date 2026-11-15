import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowRight, BellRing, Check, Copy, ImageDown, Share2, X } from 'lucide-react';
import { HOLIDAY_PROMO, promoIsLive, reminderIcs, shouldShowPopup } from '@/lib/promo';
import { IMAGES, SITE } from '@/lib/site';
import { track } from '@/lib/track';
import LeadForm from './LeadForm';
import { CallLink, EASE, Reveal } from './ui';

/* ------------------------------------------------------------------ */
/* Save-to-phone helpers (no app, account or wallet certificate needed) */
/* ------------------------------------------------------------------ */

const SHARE_URL = `${SITE.domain}/199?utm_source=share&utm_medium=referral&utm_campaign=${HOLIDAY_PROMO.campaign}`;

/** Phones: opens the native share sheet with the coupon image so it can be saved to Photos. Desktop: downloads it. */
export async function saveCouponToPhone(placement: string) {
  track('promo_save', { method: 'coupon_image', placement });
  try {
    const blob = await (await fetch(HOLIDAY_PROMO.couponImage)).blob();
    const file = new File([blob], 'First-Chimney-Holiday-199-Coupon.jpg', { type: 'image/jpeg' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'First Chimney holiday coupon', text: `${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel}. Code ${HOLIDAY_PROMO.code}.` });
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  } catch {
    /* share sheet cancelled or offline: open the image so it can be long-pressed */
    window.open(HOLIDAY_PROMO.couponImage, '_blank', 'noopener');
  }
}

export function addReminder(placement: string) {
  track('promo_save', { method: 'calendar', placement });
  const blob = new Blob([reminderIcs(new Date(), SITE.phoneDisplay, `${SITE.domain}${HOLIDAY_PROMO.path}`)], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'First-Chimney-Holiday-Reminder.ics';
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export function CouponActions({ placement, compact = false }: { placement: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    track('promo_share', { method: 'link', placement });
    const data = { title: `${HOLIDAY_PROMO.eyebrow} ${HOLIDAY_PROMO.priceLabel}`, text: `${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel} from ${SITE.name}.`, url: SHARE_URL };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked */
    }
  };
  const size = compact ? 'btn-sm' : '';
  return (
    <div className={`grid gap-2.5 ${compact ? 'grid-cols-1 sm:grid-cols-3' : 'sm:grid-cols-3'}`}>
      <button type="button" onClick={() => saveCouponToPhone(placement)} className={`btn btn-ghost ${size}`}>
        <ImageDown className="h-4 w-4" aria-hidden /> Save coupon to phone
      </button>
      <button type="button" onClick={() => addReminder(placement)} className={`btn btn-ghost ${size}`}>
        <BellRing className="h-4 w-4" aria-hidden /> Remind me
      </button>
      <button type="button" onClick={share} className={`btn btn-ghost ${size}`} aria-live="polite">
        {copied ? <Check className="h-4 w-4 text-ok" aria-hidden /> : typeof navigator !== 'undefined' && 'share' in navigator ? <Share2 className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {copied ? 'Link copied' : 'Share with a friend'}
      </button>
    </div>
  );
}

/** The big $199 lockup. */
export function PriceLockup({ size = 'lg' }: { size?: 'lg' | 'xl' | 'sm' }) {
  const cls = size === 'xl' ? 'text-[clamp(5.5rem,17vw,12.5rem)]' : size === 'sm' ? 'text-[4.5rem]' : 'text-[clamp(5rem,12vw,9rem)]';
  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
      <span className={`price-199 ${cls}`} aria-label={HOLIDAY_PROMO.priceLabel}>
        <span className="align-top text-[0.42em] font-bold" aria-hidden>
          $
        </span>
        <span aria-hidden>{HOLIDAY_PROMO.price}</span>
      </span>
      <span className="mb-[0.6em] max-w-[11rem] text-sm font-medium leading-snug text-mute">
        Chimney cleaning <span className="text-bone">+</span> inspection
      </span>
    </div>
  );
}

/** Homepage section. */
export function HolidayFeature() {
  return (
    <section aria-labelledby="holiday-h" className="relative overflow-hidden border-y hairline bg-ink-2">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 rounded-full bg-ember/10 blur-3xl" />
      <div className="wrap relative grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <Reveal className="min-w-0">
          <p className="eyebrow">{HOLIDAY_PROMO.eyebrow}</p>
          <h2 id="holiday-h" className="display-lg mt-4 text-bone">
            Host the holidays with a fireplace you trust.
          </h2>
          <div className="mt-8">
            <PriceLockup />
          </div>
          <p className="lede mt-6">{HOLIDAY_PROMO.pitch}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={HOLIDAY_PROMO.path} onClick={() => track('promo_cta_click', { placement: 'home_feature' })} className="btn btn-primary btn-lg">
              Claim your {HOLIDAY_PROMO.priceLabel} special <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <CallLink placement="home_feature" className="btn btn-ghost btn-lg" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">
          <div className="relative pb-10 sm:pb-0">
            <div className="media aspect-[4/5] shadow-[0_40px_120px_-40px_rgb(240_122_50/0.55)]">
              <img src={IMAGES.brickArch} alt="A fire burning in a clean brick fireplace" loading="lazy" width={800} height={1000} />
            </div>
            <ul className="card absolute -bottom-2 left-4 right-4 grid gap-3 p-5 backdrop-blur-xl sm:-bottom-8 sm:left-auto sm:right-[-1.5rem] sm:w-80" style={{ background: 'rgb(24 22 20 / 0.92)' }}>
              {HOLIDAY_PROMO.includes.map((i) => (
                <li key={i.title} className="flex gap-3 text-sm text-bone">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ember/15 text-ember">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {i.title}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Landing-page "save this offer" card. No personal information required. */
export function SaveOffer() {
  return (
    <div className="card p-6 sm:p-7">
      <h3 className="text-xl text-bone">Save this offer</h3>
      <p className="mt-2 text-sm text-mute">Not ready to book? Save the coupon to your phone, set a reminder, or send it to someone hosting this year.</p>
      <div className="mt-5">
        <CouponActions placement="landing_save" compact />
      </div>
      <p className="mt-4 text-sm text-dim">
        Coupon code <span className="font-mono text-bone">{HOLIDAY_PROMO.code}</span>. Mention it when you call. It is an offer code, not a reservation.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Popup                                                               */
/* ------------------------------------------------------------------ */

const SESSION_KEY = `fc.popup.shown:${HOLIDAY_PROMO.id}`;
const DISMISS_KEY = `fc.popup.dismissed:${HOLIDAY_PROMO.id}`;
const CLAIMED_KEY = `fc.popup.claimed:${HOLIDAY_PROMO.id}`;
const store = {
  get: (s: Storage | undefined, k: string) => {
    try {
      return s?.getItem(k) ?? null;
    } catch {
      return null;
    }
  },
  set: (s: Storage | undefined, k: string, v: string) => {
    try {
      s?.setItem(k, v);
    } catch {
      /* ignore */
    }
  },
};

export function HolidayPopup() {
  const { pathname, search } = useLocation();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const allowed = useCallback(
    () =>
      shouldShowPopup({
        pathname,
        preview: new URLSearchParams(search).get('promo') === 'preview',
        now: Date.now(),
        shownThisSession: store.get(window.sessionStorage, SESSION_KEY) === '1',
        dismissedAt: Number(store.get(window.localStorage, DISMISS_KEY)) || null,
        claimed: store.get(window.localStorage, CLAIMED_KEY) === '1',
      }),
    [pathname, search],
  );

  const show = useCallback(() => {
    if (!allowed()) return;
    // Never interrupt someone who is typing into a form.
    if (document.activeElement?.closest('form, input, textarea, select')) return;
    store.set(window.sessionStorage, SESSION_KEY, '1');
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(true);
    track('promo_view', { promo: HOLIDAY_PROMO.id, placement: 'popup' });
  }, [allowed]);

  // Arm a timer per page; preview links open almost immediately.
  useEffect(() => {
    if (!promoIsLive() || !allowed()) return;
    setArmed(true);
    const preview = new URLSearchParams(search).get('promo') === 'preview';
    const t = window.setTimeout(show, preview ? 400 : HOLIDAY_PROMO.popup.delayMs);
    return () => {
      window.clearTimeout(t);
      setArmed(false);
    };
  }, [pathname, search, allowed, show]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (armed && !open && p >= HOLIDAY_PROMO.popup.scrollFraction) show();
  });

  const close = useCallback(() => {
    if (!claimed) store.set(window.localStorage, DISMISS_KEY, String(Date.now()));
    setOpen(false);
    track('cta_click', { placement: 'popup_close' });
    window.setTimeout(() => lastFocus.current?.focus?.(), 0);
  }, [claimed]);

  // Escape, focus trap and scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const f = [...dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([tabindex="-1"]),select,textarea')].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button
            type="button"
            aria-label="Close holiday offer"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(24px) scale(0.98)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px) scale(0.98)', transition: { duration: 0.18 } }}
            transition={{ duration: 0.32, ease: EASE }}
            className="relative grid max-h-[92dvh] w-full overflow-y-auto rounded-t-[24px] border border-white/10 bg-ink-2 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)] sm:max-w-[54rem] sm:rounded-[24px] md:grid-cols-[0.9fr_1.1fr] md:overflow-hidden"
          >
            <div className="relative hidden md:block">
              <img src={HOLIDAY_PROMO.couponImage} alt={`Holiday coupon: ${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel}, code ${HOLIDAY_PROMO.code}`} className="h-full w-full bg-[#121110] object-contain" />
            </div>
            <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-8 md:max-h-[92dvh] md:overflow-y-auto">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15 sm:hidden" aria-hidden />
              <button type="button" onClick={close} data-autofocus className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink/70 text-bone hover:border-ember" aria-label="Close">
                <X className="h-5 w-5" aria-hidden />
              </button>
              <p className="eyebrow">{HOLIDAY_PROMO.eyebrow}</p>
              <h2 id="popup-title" className="mt-3 pr-10 text-[1.9rem] leading-tight text-bone">
                {claimed ? 'Coupon claimed.' : 'Claim your holiday coupon.'}
              </h2>
              <div className="mt-3 md:hidden">
                <PriceLockup size="sm" />
              </div>
              <p className="mt-3 text-mute">
                {HOLIDAY_PROMO.title} for <span className="font-semibold text-gold">{HOLIDAY_PROMO.priceLabel}</span>. {HOLIDAY_PROMO.short}
              </p>
              <div className="mt-6">
                <LeadForm
                  formId="holiday-199"
                  promo={HOLIDAY_PROMO.campaign}
                  fields={['name', 'phone', 'zip']}
                  required={['name', 'phone', 'zip']}
                  submitLabel={`Claim my ${HOLIDAY_PROMO.priceLabel} coupon`}
                  successTitle="You're on the list."
                  successBody={<p>We will call or text to set up your {HOLIDAY_PROMO.priceLabel} visit. Save your coupon below so it is on your phone. Code {HOLIDAY_PROMO.code}.</p>}
                  onSuccess={() => {
                    setClaimed(true);
                    store.set(window.localStorage, CLAIMED_KEY, '1');
                  }}
                  dense
                />
              </div>
              <div className="mt-6 border-t hairline pt-5">
                <p className="mb-3 text-sm text-dim">{claimed ? 'Keep it handy:' : 'Not ready? Keep the coupon:'}</p>
                <CouponActions placement="popup" compact />
              </div>
              <Link to={HOLIDAY_PROMO.path} onClick={close} className="link-arrow mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ember">
                See everything that's included <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
