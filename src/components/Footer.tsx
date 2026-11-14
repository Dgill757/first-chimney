import { Link } from 'react-router-dom';
import { ArrowUpRight, BadgeCheck, Mail, MapPin, Phone } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { SERVICE_AREAS } from '@/data/serviceAreas';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';
import { CREDENTIALS, SITE, STATE_LIST_TEXT } from '@/lib/site';
import { track } from '@/lib/track';

export default function Footer() {
  const live = promoIsLive();
  const socials = Object.entries(SITE.social).filter(([, url]) => Boolean(url));
  return (
    <footer className="relative border-t hairline bg-ink-2 pb-28 pt-20 lg:pb-12">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label={`${SITE.name} home`}>
              <img src={SITE.logo} alt={`${SITE.name} logo`} width={200} height={115} loading="lazy" className="h-16 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-mute">
              Chimney inspection, cleaning and repair for homeowners in {STATE_LIST_TEXT}. Owned and run by {SITE.owner}.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-bone">
              <BadgeCheck className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden />
              {CREDENTIALS.fire.label}
            </p>
            <div className="mt-8 grid gap-3 text-[0.95rem]">
              <a href={SITE.phoneHref} onClick={() => track('click_to_call', { placement: 'footer' })} className="flex items-center gap-3 text-bone hover:text-ember">
                <Phone className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden /> {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-bone hover:text-ember">
                <Mail className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden /> {SITE.email}
              </a>
              <span className="flex items-center gap-3 text-mute">
                <MapPin className="h-4 w-4 text-ember" strokeWidth={1.75} aria-hidden /> Serving VA, NJ, CT and MA
              </span>
            </div>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-4 text-sm">
                {socials.map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" className="capitalize text-mute hover:text-bone">
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-dim" style={{ fontFamily: 'var(--font-sans)', fontStretch: '100%' }}>
              Services
            </h2>
            <ul className="mt-5 grid gap-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className="text-[0.95rem] text-mute transition-colors hover:text-bone">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-dim" style={{ fontFamily: 'var(--font-sans)', fontStretch: '100%' }}>
              Explore
            </h2>
            <ul className="mt-5 grid gap-2.5">
              {[
                ...(live ? [{ label: `Holiday ${HOLIDAY_PROMO.priceLabel} special`, to: HOLIDAY_PROMO.path }] : []),
                { label: 'Design your fireplace', to: '/design-your-fireplace' },
                { label: 'Fireplace shop', to: '/fireplace-shop' },
                { label: 'Our work', to: '/gallery' },
                { label: 'Reviews', to: '/reviews' },
                { label: 'Resource center', to: '/blog' },
                { label: 'FAQ', to: '/faq' },
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[0.95rem] text-mute transition-colors hover:text-bone">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-dim" style={{ fontFamily: 'var(--font-sans)', fontStretch: '100%' }}>
              Service areas
            </h2>
            <ul className="mt-5 grid gap-2.5">
              {SERVICE_AREAS.map((s) => (
                <li key={s.slug}>
                  <Link to={`/service-areas/${s.slug}`} className="text-[0.95rem] text-mute transition-colors hover:text-bone">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="link-arrow mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ember">
              Check your address <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t hairline pt-8 text-sm text-dim md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy-policy" className="hover:text-bone">
              Privacy &amp; SMS terms
            </Link>
            <Link to="/service-areas" className="hover:text-bone">
              Service areas
            </Link>
            <a href="/sitemap.xml" className="hover:text-bone">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
