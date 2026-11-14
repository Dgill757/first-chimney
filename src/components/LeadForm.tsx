import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Check, LoaderCircle, MessageSquareText, Phone } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { formatPhone, isValidEmail, isValidPhone, isValidZip, submitLead, type FormId } from '@/lib/leads';
import { HOLIDAY_PROMO } from '@/lib/promo';
import { SITE, STATES } from '@/lib/site';
import { track } from '@/lib/track';
import { Swap } from './ui';

export type FieldName = 'name' | 'phone' | 'email' | 'address' | 'city' | 'state' | 'zip' | 'service' | 'timeframe' | 'message';

type Props = {
  formId: FormId;
  fields: FieldName[];
  required?: FieldName[];
  submitLabel: string;
  promo?: string;
  defaultService?: string;
  /** Extra context sent to the CRM (designer summary, product list). Evaluated at submit time. */
  details?: () => string;
  products?: string[];
  messageLabel?: string;
  messagePlaceholder?: string;
  successTitle?: string;
  successBody?: ReactNode;
  onSuccess?: (ref: string) => void;
  dense?: boolean;
  /** Adds a required checkbox granting permission to publish the person's words (testimonials). */
  publishConsent?: boolean;
};

const TIMEFRAMES = ['As soon as possible', 'Within the next week', 'Within 2 weeks', 'Before the holidays', 'I am flexible'];

type Values = Record<FieldName, string> & { consent: boolean; smsConsent: boolean; publish: boolean; website: string };
const EMPTY: Values = { name: '', phone: '', email: '', address: '', city: '', state: '', zip: '', service: '', timeframe: '', message: '', consent: false, smsConsent: false, publish: false, website: '' };

export default function LeadForm({
  formId,
  fields,
  required = ['name', 'phone'],
  submitLabel,
  promo,
  defaultService = '',
  details,
  products,
  messageLabel = 'Anything we should know?',
  messagePlaceholder = 'What are you noticing? Roof access, number of fireplaces, best time to call...',
  successTitle = 'Request received.',
  successBody,
  onSuccess,
  dense = false,
  publishConsent = false,
}: Props) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const [v, setV] = useState<Values>({ ...EMPTY, service: defaultService });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [failMsg, setFailMsg] = useState('');
  const [ref, setRef] = useState('');
  const started = useRef(false);
  const has = (f: FieldName) => fields.includes(f);
  const req = (f: FieldName) => required.includes(f);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track('form_start', { form: formId });
  };

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : k === 'phone' ? formatPhone(target.value) : target.value;
    setV((s) => ({ ...s, [k]: value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: '' }));
  };

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (v.name.trim().length < 2) e.name = 'Please enter your name.';
    if (has('phone') && (req('phone') || v.phone) && !isValidPhone(v.phone)) e.phone = 'Please enter a 10-digit phone number.';
    if (has('email') && (req('email') || v.email) && !isValidEmail(v.email)) e.email = 'Please enter a valid email.';
    if (has('phone') && has('email') && !v.phone && !v.email) e.phone = 'Add a phone number or email so we can reach you.';
    if (has('zip') && (req('zip') || v.zip) && !isValidZip(v.zip)) e.zip = 'Please enter a 5-digit ZIP.';
    for (const f of ['address', 'city', 'state', 'service', 'timeframe', 'message'] as FieldName[]) {
      if (has(f) && req(f) && !v[f].trim()) e[f] = 'This field is required.';
    }
    if (!v.consent) e.consent = 'Please check this box so we can contact you about your request.';
    if (publishConsent && !v.publish) e.publish = 'Please check this box so we can share your words.';
    return e;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      const first = Object.keys(found).find((k) => found[k]);
      document.getElementById(id(first!))?.focus();
      return;
    }
    setState('sending');
    const result = await submitLead({
      formId,
      name: v.name.trim(),
      phone: v.phone,
      email: v.email.trim(),
      address: v.address,
      city: v.city,
      state: v.state,
      zip: v.zip,
      service: v.service,
      timeframe: v.timeframe,
      message: v.message,
      details: [details?.(), publishConsent && v.publish ? `Permission to publish: YES. ${v.name.split(' ')[0]} agreed First Chimney may publish their first name, town and comments.` : ''].filter(Boolean).join('\n') || undefined,
      products,
      promo,
      consent: v.consent,
      smsConsent: v.smsConsent,
      website: v.website,
    });
    if (result.ok) {
      setRef(result.ref);
      setState('done');
      onSuccess?.(result.ref);
      return;
    }
    if (result.fields) setErrors(result.fields);
    setFailMsg(result.message);
    setState(result.code === 'invalid' ? 'idle' : 'failed');
  }

  // Error styling comes from aria-invalid in index.css.
  const cls = (_f: string) => 'input';
  const Err = ({ f }: { f: string }) => (errors[f] ? <p id={id(`${f}-err`)} className="err">{errors[f]}</p> : null);
  const aria = (f: string) => ({ 'aria-invalid': errors[f] ? true : undefined, 'aria-describedby': errors[f] ? id(`${f}-err`) : undefined });
  const star = (f: FieldName) => (req(f) ? <span className="text-ember"> *</span> : <span className="font-normal text-dim"> (optional)</span>);

  if (state === 'done') {
    return (
      <Swap k="done">
        <div role="status" className="py-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-ok/15 text-ok">
            <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden />
          </span>
          <h3 className="mt-5 text-2xl text-bone">{successTitle}</h3>
          <div className="mt-3 max-w-md text-mute">
            {successBody ?? (
              <p>
                Thanks, {v.name.split(' ')[0]}. We will call or text you to confirm a time. Your appointment is set once we have confirmed it with you.
              </p>
            )}
          </div>
          <p className="mt-5 text-sm text-dim">
            Reference <span className="font-mono text-bone">{ref}</span>. Mention it if you call us.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={SITE.phoneHref} onClick={() => track('click_to_call', { placement: `${formId}_success` })} className="btn btn-ghost btn-sm">
              <Phone className="h-4 w-4" aria-hidden /> {SITE.phoneDisplay}
            </a>
            <Link to="/" className="btn btn-ghost btn-sm">
              Back to home
            </Link>
          </div>
        </div>
      </Swap>
    );
  }

  const gap = dense ? 'gap-4' : 'gap-5';

  return (
    <Swap k="form">
      <form noValidate onSubmit={onSubmit} onFocusCapture={onStart} className={`grid ${gap}`} aria-label="Service request form">
        {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
          <label htmlFor={id('website')}>Website</label>
          <input id={id('website')} tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
        </div>

        <div className={`grid ${gap} sm:grid-cols-2`}>
          <div className="field sm:col-span-2">
            <label htmlFor={id('name')}>Full name{star('name')}</label>
            <input id={id('name')} className={cls('name')} autoComplete="name" value={v.name} onChange={set('name')} {...aria('name')} />
            <Err f="name" />
          </div>
          {has('phone') && (
            <div className="field">
              <label htmlFor={id('phone')}>Phone{star('phone')}</label>
              <input id={id('phone')} className={cls('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(757) 555-0100" value={v.phone} onChange={set('phone')} {...aria('phone')} />
              <Err f="phone" />
            </div>
          )}
          {has('email') && (
            <div className="field">
              <label htmlFor={id('email')}>Email{star('email')}</label>
              <input id={id('email')} className={cls('email')} type="email" inputMode="email" autoComplete="email" value={v.email} onChange={set('email')} {...aria('email')} />
              <Err f="email" />
            </div>
          )}
        </div>

        {has('address') && (
          <div className="field">
            <label htmlFor={id('address')}>Service address{star('address')}</label>
            <input id={id('address')} className={cls('address')} autoComplete="street-address" value={v.address} onChange={set('address')} {...aria('address')} />
            <Err f="address" />
          </div>
        )}

        {(has('city') || has('state') || has('zip')) && (
          <div className={`grid ${gap} grid-cols-2 ${has('city') ? 'sm:grid-cols-[1.4fr_1fr_1fr]' : 'sm:grid-cols-2'}`}>
            {has('city') && (
              <div className="field col-span-2 sm:col-span-1">
                <label htmlFor={id('city')}>City{star('city')}</label>
                <input id={id('city')} className={cls('city')} autoComplete="address-level2" value={v.city} onChange={set('city')} {...aria('city')} />
                <Err f="city" />
              </div>
            )}
            {has('state') && (
              <div className="field">
                <label htmlFor={id('state')}>State{star('state')}</label>
                <select id={id('state')} className={cls('state')} autoComplete="address-level1" value={v.state} onChange={set('state')} {...aria('state')}>
                  <option value="">Select</option>
                  {STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                <Err f="state" />
              </div>
            )}
            {has('zip') && (
              <div className="field">
                <label htmlFor={id('zip')}>ZIP{star('zip')}</label>
                <input id={id('zip')} className={cls('zip')} inputMode="numeric" autoComplete="postal-code" maxLength={10} value={v.zip} onChange={set('zip')} {...aria('zip')} />
                <Err f="zip" />
              </div>
            )}
          </div>
        )}

        {(has('service') || has('timeframe')) && (
          <div className={`grid ${gap} sm:grid-cols-2`}>
            {has('service') && (
              <div className="field">
                <label htmlFor={id('service')}>What do you need?{star('service')}</label>
                <select id={id('service')} className={cls('service')} value={v.service} onChange={set('service')} {...aria('service')}>
                  <option value="">Choose a service</option>
                  <option value={`Holiday ${HOLIDAY_PROMO.priceLabel} cleaning + inspection`}>Holiday {HOLIDAY_PROMO.priceLabel} cleaning + inspection</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Fireplace design or product">Fireplace design or product</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
                <Err f="service" />
              </div>
            )}
            {has('timeframe') && (
              <div className="field">
                <label htmlFor={id('timeframe')}>Preferred timeframe{star('timeframe')}</label>
                <select id={id('timeframe')} className={cls('timeframe')} value={v.timeframe} onChange={set('timeframe')} {...aria('timeframe')}>
                  <option value="">Choose one</option>
                  {TIMEFRAMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <Err f="timeframe" />
              </div>
            )}
          </div>
        )}

        {has('message') && (
          <div className="field">
            <label htmlFor={id('message')}>
              {messageLabel}
              {star('message')}
            </label>
            <textarea id={id('message')} className={cls('message')} rows={dense ? 3 : 4} placeholder={messagePlaceholder} value={v.message} onChange={set('message')} {...aria('message')} />
            <Err f="message" />
          </div>
        )}

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-ink/60 p-4">
          <label className="flex gap-3 text-[0.88rem] leading-relaxed text-mute" htmlFor={id('consent')}>
            <input id={id('consent')} type="checkbox" className="check" checked={v.consent} onChange={set('consent')} {...aria('consent')} />
            <span>
              I agree that {SITE.name} may contact me by phone, text or email about this request.<span className="text-ember"> *</span>
            </span>
          </label>
          <Err f="consent" />
          {publishConsent && (
            <>
              <label className="flex gap-3 text-[0.88rem] leading-relaxed text-mute" htmlFor={id('publish')}>
                <input id={id('publish')} type="checkbox" className="check" checked={v.publish} onChange={set('publish')} {...aria('publish')} />
                <span>
                  I give {SITE.name} permission to publish my first name, town and comments on its website and marketing.<span className="text-ember"> *</span>
                </span>
              </label>
              <Err f="publish" />
            </>
          )}
          <label className="flex gap-3 text-[0.82rem] leading-relaxed text-dim" htmlFor={id('sms')}>
            <input id={id('sms')} type="checkbox" className="check" checked={v.smsConsent} onChange={set('smsConsent')} />
            <span>
              Optional: text me appointment reminders and updates from {SITE.name}. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of service. See our{' '}
              <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-bone">
                Privacy &amp; SMS Terms
              </Link>
              .
            </span>
          </label>
        </div>

        {state === 'failed' && (
          <div role="alert" className="flex gap-3 rounded-2xl border border-err/40 bg-err/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-err" aria-hidden />
            <div>
              <p className="font-medium text-bone">{failMsg}</p>
              <p className="mt-1 text-mute">Your details are still filled in. Nothing was booked.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={SITE.phoneHref} onClick={() => track('click_to_call', { placement: `${formId}_error` })} className="btn btn-primary btn-sm">
                  <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phoneDisplay}
                </a>
                <a href={SITE.smsHref} onClick={() => track('click_to_text', { placement: `${formId}_error` })} className="btn btn-ghost btn-sm">
                  <MessageSquareText className="h-4 w-4" aria-hidden /> Text us
                </a>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={state === 'sending'}>
          {state === 'sending' ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> Sending
            </>
          ) : (
            <>
              {submitLabel} <ArrowRight className="h-5 w-5" aria-hidden />
            </>
          )}
        </button>
        <p className="-mt-1 text-center text-xs text-dim">This sends a request. We will call or text to confirm your appointment.</p>
      </form>
    </Swap>
  );
}
