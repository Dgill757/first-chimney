import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowRight, ChevronDown, Flame, Menu, Phone, X } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { SITE } from '@/lib/site';
import { track } from '@/lib/track';
import { EASE, FireButton, SERVICE_ICONS } from './ui';

type Group = { label: string; items: { label: string; to: string; note?: string }[]; footer?: { label: string; to: string } };

const SERVICES_GROUP: Group = {
  label: 'Services',
  items: SERVICES.map((s) => ({ label: s.title, to: `/services/${s.id}`, note: s.short })),
  footer: { label: 'All services', to: '/services' },
};
const FIREPLACE_GROUP: Group = {
  label: 'Fireplaces',
  items: [
    { label: 'Build Your Fireplace', to: '/build-your-fireplace', note: 'Pick a real model, customize it, get a PDF.' },
    { label: 'Fireplace Shop', to: '/fireplace-shop', note: 'Inserts, gas, electric, mantels and caps.' },
    { label: 'Fireplace Repair', to: '/services/fireplace-repair', note: 'Smoke, damper and firebox problems.' },
  ],
};
const LINKS = [
  { label: 'Service Areas', to: '/service-areas' },
  { label: 'Resources', to: '/blog' },
  { label: 'About', to: '/about' },
];

function AnnouncementBar() {
  return (
    <Link
      to={HOLIDAY_PROMO.path}
      onClick={() => track('promo_cta_click', { placement: 'announcement_bar' })}
      className="group flex min-h-10 items-center justify-center gap-2 bg-ember px-4 py-2 text-center text-[0.86rem] font-semibold text-[#1a0d05] sm:text-sm"
    >
      <Flame className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
      <span>
        <span className="hidden sm:inline">{HOLIDAY_PROMO.barText}</span>
        <span className="sm:hidden">Holiday: Cleaning + Inspection {HOLIDAY_PROMO.priceLabel}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

function Dropdown({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const location = useLocation();
  const reduce = useReducedMotion();
  const active = group.items.some((i) => location.pathname.startsWith(i.to)) || (group.footer && location.pathname.startsWith(group.footer.to));

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const enter = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };
  const wide = group.items.length > 4;

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-[0.94rem] font-medium transition-colors ${active ? 'text-ember' : 'text-bone/90 hover:text-bone'}`}
      >
        {group.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px) scale(0.98)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{ transformOrigin: 'top center' }}
            className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 ${wide ? 'w-[min(44rem,90vw)]' : 'w-[22rem]'}`}
          >
            <div className="rounded-[20px] border border-white/10 bg-ink-2/95 p-3 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl">
              <ul className={`grid gap-1 ${wide ? 'grid-cols-2' : ''}`}>
                {group.items.map((item) => {
                  const svc = SERVICES.find((s) => `/services/${s.id}` === item.to);
                  const Icon = svc ? SERVICE_ICONS[svc.icon] : Flame;
                  return (
                    <li key={item.to}>
                      <Link to={item.to} className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.05]">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-ink text-ember transition-colors group-hover:border-ember/50">
                          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        </span>
                        <span>
                          <span className="block text-[0.93rem] font-medium text-bone">{item.label}</span>
                          {item.note && <span className="mt-0.5 line-clamp-1 block text-[0.8rem] text-dim">{item.note}</span>}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {group.footer && (
                <Link to={group.footer.to} className="link-arrow mt-2 flex items-center justify-between rounded-xl border-t border-white/[0.07] px-3 pb-1 pt-3 text-sm font-medium text-ember">
                  {group.footer.label} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ open, onClose, live }: { open: boolean; onClose: () => void; live: boolean }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-12px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.28, ease: EASE }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink/[0.98] px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5 backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Link to="/" onClick={onClose} aria-label={`${SITE.name} home`}>
              <img src={SITE.logo} alt="" width={140} height={80} className="h-11 w-auto" />
            </Link>
            <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full border border-white/15" aria-label="Close menu">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {live && (
            <Link
              to={HOLIDAY_PROMO.path}
              onClick={() => {
                track('promo_cta_click', { placement: 'mobile_menu' });
                onClose();
              }}
              className="mt-6 flex items-center justify-between rounded-[20px] border border-ember/40 bg-ember/10 p-4"
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ember">Holiday special</span>
                <span className="mt-1 block font-medium text-bone">{HOLIDAY_PROMO.title}</span>
              </span>
              <span className="price-199 text-4xl">{HOLIDAY_PROMO.priceLabel}</span>
            </Link>
          )}

          <FireButton placement="mobile_menu" size="lg" onClick={onClose} className="mt-4 w-full [&>span]:w-full [&>span]:justify-center" />

          <nav className="mt-6 grid gap-7" aria-label="Mobile">
            {[SERVICES_GROUP, FIREPLACE_GROUP].map((g) => (
              <div key={g.label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-dim">{g.label}</p>
                <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                  {g.items.map((i) => (
                    <li key={i.to}>
                      <Link to={i.to} onClick={onClose} className="block rounded-lg py-2.5 text-[1.05rem] text-bone">
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ul className="grid gap-0.5 border-t border-white/10 pt-5">
              {[...LINKS, { label: 'FAQ', to: '/faq' }, { label: 'Contact', to: '/contact' }].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} onClick={onClose} className="block py-2.5 font-display text-xl font-semibold text-bone" style={{ fontStretch: '110%' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
            <a href={SITE.phoneHref} onClick={() => track('click_to_call', { placement: 'mobile_menu' })} className="btn btn-ghost">
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <Link to="/contact" onClick={onClose} className="btn btn-primary">
              Schedule
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const live = promoIsLive();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));
  useEffect(() => setMenu(false), [location.pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        {live && (
          <div className={`grid transition-[grid-template-rows] duration-300 ${scrolled ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
            <div className="overflow-hidden">
              <AnnouncementBar />
            </div>
          </div>
        )}
        <div
          className={`transition-[background-color,border-color,backdrop-filter] duration-300 ${
            scrolled ? 'border-b border-white/[0.07] bg-ink/85 backdrop-blur-xl' : 'border-b border-transparent bg-gradient-to-b from-ink/80 to-transparent'
          }`}
        >
          <div className="wrap flex h-[4.25rem] items-center gap-4 lg:h-[4.75rem]">
            <Link to="/" className="shrink-0" aria-label={`${SITE.name} home`}>
              <img src={SITE.logo} alt={`${SITE.name} logo`} width={160} height={92} className="h-11 w-auto lg:h-[3.15rem]" />
            </Link>

            <nav className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex xl:ml-6" aria-label="Primary">
              <Dropdown group={SERVICES_GROUP} />
              <FireButton placement="header" className="mx-2" />
              <NavLink to="/fireplace-shop" className={({ isActive }) => `rounded-full px-3 py-2 text-[0.94rem] font-medium transition-colors ${isActive ? 'text-ember' : 'text-bone/90 hover:text-bone'}`}>
                Shop
              </NavLink>
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-[0.94rem] font-medium transition-colors ${l.to === '/blog' ? 'hidden xl:block' : ''} ${isActive ? 'text-ember' : 'text-bone/90 hover:text-bone'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <a
                href={SITE.phoneHref}
                onClick={() => track('click_to_call', { placement: 'header' })}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-[0.94rem] font-medium text-bone transition-colors hover:text-ember xl:flex"
              >
                <Phone className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden />
                {SITE.phoneDisplay}
              </a>
              <a
                href={SITE.phoneHref}
                onClick={() => track('click_to_call', { placement: 'header_icon' })}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-bone xl:hidden"
                aria-label={`Call ${SITE.phoneDisplay}`}
              >
                <Phone className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.75} aria-hidden />
              </a>
              <Link
                to={live ? HOLIDAY_PROMO.path : '/contact'}
                onClick={() => live && track('promo_cta_click', { placement: 'header_button' })}
                className="btn btn-primary btn-sm hidden sm:inline-flex"
              >
                {live ? `Book the ${HOLIDAY_PROMO.priceLabel} special` : 'Schedule service'}
              </Link>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden"
                aria-label="Open menu"
                aria-expanded={menu}
                aria-controls="mobile-menu"
                onClick={() => setMenu(true)}
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} live={live} />
    </>
  );
}
