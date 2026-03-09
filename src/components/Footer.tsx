import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Globe } from 'lucide-react';
import { SITE, SERVICES } from '@/lib/site';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Service Areas', path: '/service-areas' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Financing', path: '/financing' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-soft-black border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center">
              <img src={SITE.logo} alt="First Chimney logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_14px_rgba(231,163,75,0.16)]" />
            </Link>
            <p className="text-warm-ivory/80 text-sm leading-relaxed max-w-xs">
              Premium chimney inspection, sweeping, repair, masonry, leak repair, and fireplace service across the Mid-Atlantic.
            </p>
            <a
              href={SITE.domain}
              className="inline-flex items-center gap-2 text-warm-ivory/80 hover:text-copper-ember text-sm transition-colors"
            >
              <Globe className="w-4 h-4" />
              {SITE.displayDomain}
            </a>
            <div className="flex items-center gap-4">
              <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="First Chimney Facebook" className="w-10 h-10 rounded-full bg-midnight border border-white/10 flex items-center justify-center text-warm-ivory/70 hover:text-copper-ember hover:border-copper-ember/50 transition-all"><Facebook className="w-4 h-4" /></a>
              <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="First Chimney Instagram" className="w-10 h-10 rounded-full bg-midnight border border-white/10 flex items-center justify-center text-warm-ivory/70 hover:text-copper-ember hover:border-copper-ember/50 transition-all"><Instagram className="w-4 h-4" /></a>
              <a href={SITE.social.linkedin} target="_blank" rel="noreferrer" aria-label="First Chimney LinkedIn" className="w-10 h-10 rounded-full bg-midnight border border-white/10 flex items-center justify-center text-warm-ivory/70 hover:text-copper-ember hover:border-copper-ember/50 transition-all"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-warm-ivory/75 hover:text-copper-ember text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-copper-ember/60"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Core Services</h4>
            <ul className="space-y-4">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.id}`}
                    className="text-warm-ivory/75 hover:text-copper-ember text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-copper-ember/60"></span>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-midnight border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-copper-ember" />
                </div>
                <div>
                  <p className="text-xs text-warm-ivory/50 uppercase tracking-wider mb-1">Call</p>
                  <a href={SITE.phoneHref} className="text-white font-medium hover:text-copper-ember transition-colors">{SITE.phoneDisplay}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-midnight border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-copper-ember" />
                </div>
                <div>
                  <p className="text-xs text-warm-ivory/50 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${SITE.email}`} className="text-white font-medium hover:text-copper-ember transition-colors">{SITE.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-midnight border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-copper-ember" />
                </div>
                <div>
                  <p className="text-xs text-warm-ivory/50 uppercase tracking-wider mb-1">Coverage</p>
                  <p className="text-white font-medium text-sm leading-relaxed">Serving {SITE.serviceRegions}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-warm-ivory/50 text-xs">&copy; {new Date().getFullYear()} First Chimney. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-warm-ivory/50">
            <Link to="/contact" className="hover:text-white transition-colors">Request Service</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQs</Link>
            <Link to="/service-areas" className="hover:text-white transition-colors">Service Areas</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
