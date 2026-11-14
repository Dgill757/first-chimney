import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HOLIDAY_PROMO, promoIsLive } from '@/lib/promo';

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80dvh] place-items-center overflow-hidden px-5 pt-24">
      <div aria-hidden className="ember-glow absolute inset-0" />
      <div className="relative max-w-xl text-center">
        <p className="font-display text-[7rem] font-black leading-none text-ember/30" style={{ fontStretch: '120%' }}>
          404
        </p>
        <h1 className="display-md mt-2 text-bone">This flue is blocked.</h1>
        <p className="lede mx-auto mt-4">The page you were looking for is not here. These will get you where you need to go.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            Home <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to="/services" className="btn btn-ghost">
            Services
          </Link>
          {promoIsLive() && (
            <Link to={HOLIDAY_PROMO.path} className="btn btn-ghost">
              {HOLIDAY_PROMO.priceLabel} holiday special
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
