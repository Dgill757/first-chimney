import { Suspense, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { CalendarCheck, Phone } from 'lucide-react';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { SITE } from '@/lib/site';
import { track } from '@/lib/track';
import Footer from './Footer';
import Header from './Header';
import RouteHead from './RouteHead';
import { EASE } from './ui';

/** Phone-only bottom bar: call + the single most valuable action. Hidden where the page has its own sticky bar. */
function MobileActionBar() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 320));

  const live = promoIsLive();
  const hidden = pathname.startsWith('/design-your-fireplace') || pathname === HOLIDAY_PROMO.path;
  const cta = live ? { to: HOLIDAY_PROMO.path, label: `${HOLIDAY_PROMO.priceLabel} Holiday Special` } : { to: '/contact', label: 'Schedule' };

  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { transform: 'translateY(100%)' }}
          animate={{ transform: 'translateY(0%)', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { transform: 'translateY(100%)' }}
          transition={{ duration: 0.35, ease: EASE }}
          className="no-print fixed inset-x-0 bottom-0 z-[45] border-t border-white/10 bg-ink-2/95 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto grid max-w-md grid-cols-[auto_1fr] gap-2.5">
            <a href={SITE.phoneHref} onClick={() => track('click_to_call', { placement: 'mobile_bar' })} className="btn btn-ghost px-5" aria-label={`Call ${SITE.phoneDisplay}`}>
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <Link to={cta.to} onClick={() => live && track('promo_cta_click', { placement: 'mobile_bar' })} className="btn btn-primary">
              <CalendarCheck className="h-4 w-4" aria-hidden /> {cta.label}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PageFallback() {
  return (
    <div className="wrap min-h-[70dvh] pt-40" aria-busy="true" aria-live="polite">
      <div className="h-4 w-40 animate-pulse rounded-full bg-white/[0.06]" />
      <div className="mt-6 h-14 w-3/4 max-w-2xl animate-pulse rounded-2xl bg-white/[0.06]" />
      <div className="mt-4 h-5 w-1/2 max-w-md animate-pulse rounded-full bg-white/[0.05]" />
    </div>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a href="#main" className="sr-only z-[80] rounded-full bg-ember px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <RouteHead />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
