import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Copy, Download, Share2 } from 'lucide-react';
import { HOLIDAY_PROMO, makeOfferRef } from '@/lib/promo';
import { SITE } from '@/lib/site';
import { track } from '@/lib/track';
import { CallLink, Reveal } from './ui';

export const PROMO_IMAGE = '/promo/first-chimney-holiday-199.jpg';

/** The big $199 lockup. Used on the homepage and the landing page hero. */
export function PriceLockup({ size = 'lg' }: { size?: 'lg' | 'xl' }) {
  return (
    <div className="flex items-end gap-4">
      <span className={`price-199 ${size === 'xl' ? 'text-[clamp(6rem,17vw,12.5rem)]' : 'text-[clamp(5rem,12vw,9rem)]'}`} aria-label={`${HOLIDAY_PROMO.priceLabel}`}>
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
        <Reveal>
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
        <Reveal delay={0.1}>
          <div className="relative">
            <div className="media aspect-[4/5] shadow-[0_40px_120px_-40px_rgb(240_122_50/0.55)]">
              <img src={IMAGES_HERO} alt="A fire burning in a clean brick fireplace" loading="lazy" width={800} height={1000} />
            </div>
            <ul className="card absolute -bottom-8 left-4 right-4 grid gap-3 p-5 backdrop-blur-xl sm:left-auto sm:right-[-1.5rem] sm:w-80" style={{ background: 'rgb(24 22 20 / 0.92)' }}>
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
const IMAGES_HERO = '/media/photos/fireplace-brick-arch.webp';

const REF_KEY = 'fc.offer-ref';

/** Share / save the offer without asking for any personal information. */
export function SaveOffer() {
  const [ref, setRef] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(REF_KEY);
      if (existing) return setRef(existing);
    } catch {
      /* ignore */
    }
  }, []);

  const ensureRef = () => {
    if (ref) return ref;
    const r = makeOfferRef();
    setRef(r);
    try {
      localStorage.setItem(REF_KEY, r);
    } catch {
      /* ignore */
    }
    return r;
  };

  const shareUrl = `${SITE.domain}${HOLIDAY_PROMO.path}?utm_source=share&utm_medium=referral&utm_campaign=${HOLIDAY_PROMO.campaign}`;
  const shareText = `${HOLIDAY_PROMO.eyebrow}: ${HOLIDAY_PROMO.title} for ${HOLIDAY_PROMO.priceLabel} from ${SITE.name}.`;

  async function share() {
    ensureRef();
    track('promo_share', { method: 'native' });
    if (navigator.share) {
      try {
        await navigator.share({ title: `${HOLIDAY_PROMO.eyebrow} ${HOLIDAY_PROMO.priceLabel}`, text: shareText, url: shareUrl });
        return;
      } catch {
        /* cancelled: fall through to copy */
      }
    }
    await copy();
  }

  async function copy() {
    ensureRef();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      track('promo_share', { method: 'copy' });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Copy this link', shareUrl);
    }
  }

  return (
    <div className="card p-6 sm:p-7">
      <h3 className="text-xl text-bone">Save this offer</h3>
      <p className="mt-2 text-sm text-mute">Not ready to book? Keep it for later or send it to someone hosting this year. No sign-up needed.</p>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        <button type="button" onClick={share} className="btn btn-ghost btn-sm">
          <Share2 className="h-4 w-4" aria-hidden /> Share
        </button>
        <button type="button" onClick={copy} className="btn btn-ghost btn-sm" aria-live="polite">
          {copied ? <Check className="h-4 w-4 text-ok" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        <a
          href={PROMO_IMAGE}
          download="First-Chimney-Holiday-199-Special.jpg"
          onClick={() => {
            ensureRef();
            track('promo_save', { method: 'image' });
          }}
          className="btn btn-ghost btn-sm"
        >
          <Download className="h-4 w-4" aria-hidden /> Save image
        </a>
      </div>
      {ref && (
        <p className="mt-4 text-sm text-dim">
          Your offer code: <span className="font-mono text-bone">{ref}</span>. Mention it when you call. It is a reference, not a reservation.
        </p>
      )}
    </div>
  );
}
