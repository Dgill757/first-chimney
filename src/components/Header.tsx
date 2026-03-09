import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SITE } from '@/lib/site';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Service Areas', path: '/service-areas' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Financing', path: '/financing' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-midnight/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] py-2.5'
          : 'bg-gradient-to-b from-midnight/90 via-midnight/55 to-transparent py-4.5'
      }`}
    >
      <div
        className={`hidden lg:flex justify-between items-center px-8 pb-4 border-b border-white/10 text-xs font-medium text-warm-ivory/90 transition-all duration-300 ${
          isScrolled ? 'opacity-0 h-0 overflow-hidden pb-0 border-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-copper-ember" />
          <span>Serving VA, MD, DC, WV & PA</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-copper-ember" />
            <span>Licensed & Insured</span>
          </div>
          <span className="text-white/20">|</span>
          <span>Fireplace & Chimney Safety Specialists</span>
        </div>
        <div className="flex items-center gap-6">
          <a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-copper-ember transition-colors">
            <Phone className="w-3 h-3" />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <Link
            to="/contact"
            className="bg-copper-ember text-white px-4 py-1.5 rounded-full hover:bg-fire-gold transition-all shadow-[0_0_15px_rgba(198,106,43,0.3)] hover:shadow-[0_0_22px_rgba(231,163,75,0.55)]"
          >
            Request Estimate
          </Link>
        </div>
      </div>

      <div className="px-4 lg:px-8 flex justify-between items-center mt-2 lg:mt-0 gap-6">
        <Link to="/" className="z-50 shrink-0">
          <img src={SITE.logo} alt="First Chimney logo" className="h-14 lg:h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(231,163,75,0.18)]" />
        </Link>

        <nav className="hidden lg:flex items-center justify-center flex-1 gap-7 xl:gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm xl:text-[15px] font-semibold tracking-[0.01em] transition-colors group ${
                isActivePath(link.path) ? 'text-copper-ember' : 'text-warm-ivory hover:text-white'
              }`}
            >
              <span className="copper-underline pb-1">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden 2xl:flex items-center gap-4 shrink-0">
          <a
            href={SITE.phoneHref}
            className="flex items-center justify-center gap-2 bg-white/6 border border-white/15 text-white px-4 py-2.5 rounded-full font-semibold text-sm hover:border-copper-ember/60 hover:text-copper-ember"
          >
            <Phone className="w-4 h-4" />
            {SITE.phoneDisplay}
          </a>
          <Link
            to="/contact"
            className="bg-copper-ember text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-fire-gold shadow-[0_0_18px_rgba(198,106,43,0.32)] hover:shadow-[0_0_24px_rgba(231,163,75,0.52)]"
          >
            Request Estimate
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden z-50 text-warm-ivory p-2 rounded-lg border border-white/10 bg-soft-black/40"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 230 }}
            className="fixed inset-0 bg-midnight/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 + 0.08 }}
                >
                  <Link
                    to={link.path}
                    className={`text-2xl font-display font-medium ${
                      isActivePath(link.path) ? 'text-copper-ember' : 'text-warm-ivory'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-auto mb-12 flex flex-col gap-4"
            >
              <a
                href={SITE.phoneHref}
                className="flex items-center justify-center gap-2 bg-soft-black py-4 rounded-xl text-warm-ivory font-medium border border-white/10"
              >
                <Phone className="w-5 h-5 text-copper-ember" />
                {SITE.phoneDisplay}
              </a>
              <Link
                to="/contact"
                className="flex items-center justify-center bg-copper-ember text-white py-4 rounded-xl font-medium shadow-[0_0_20px_rgba(198,106,43,0.4)]"
              >
                Request Estimate
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
