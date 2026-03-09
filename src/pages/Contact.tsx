import { useState, FormEvent } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';
import { SITE } from '@/lib/site';

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1200);
  };

  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO
        title="Contact First Chimney"
        description="Request chimney inspection, sweeping, repair, or leak diagnostics from First Chimney. Call 757-589-0783 or send a message online."
        path="/contact"
      />

      <section className="relative bg-soft-black border-b border-white/5">
        <BackgroundPaths
          title="Let's Secure Your Home."
          description="Contact First Chimney to schedule an inspection, request an estimate, or get expert guidance on chimney safety and repair options."
        />
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-soft-black p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-copper-ember/10 rounded-full blur-3xl" />
              <h2 className="text-3xl font-display font-bold mb-8 relative z-10 text-white">Send Us a Message</h2>

              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 text-white">Message Sent</h3>
                    <p className="text-warm-ivory/85 mb-8">Thank you for contacting First Chimney. We will follow up shortly.</p>
                    <button onClick={() => setFormStatus('idle')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl">
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                    aria-label="Contact request form"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-warm-ivory/85 mb-2">First Name *</label>
                        <input type="text" id="firstName" name="first_name" autoComplete="given-name" minLength={2} required className="w-full bg-midnight border border-white/15 rounded-xl px-4 py-3 text-white" placeholder="John" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-warm-ivory/85 mb-2">Last Name *</label>
                        <input type="text" id="lastName" name="last_name" autoComplete="family-name" minLength={2} required className="w-full bg-midnight border border-white/15 rounded-xl px-4 py-3 text-white" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-warm-ivory/85 mb-2">Email Address *</label>
                        <input type="email" id="email" name="email" autoComplete="email" required className="w-full bg-midnight border border-white/15 rounded-xl px-4 py-3 text-white" placeholder="name@email.com" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-warm-ivory/85 mb-2">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" pattern="^\\+?[0-9()\\-\\s]{10,}$" required className="w-full bg-midnight border border-white/15 rounded-xl px-4 py-3 text-white" placeholder="757-589-0783" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-warm-ivory/85 mb-2">Service Needed</label>
                      <select id="service" name="service" className="w-full bg-midnight border border-white/15 rounded-xl px-4 py-3 text-white appearance-none">
                        <option value="">Select a service...</option>
                        <option value="inspection">Chimney Inspection</option>
                        <option value="sweeping">Chimney Sweeping</option>
                        <option value="repair">Chimney Repair</option>
                        <option value="masonry">Masonry & Rebuilds</option>
                        <option value="leak">Leak Repair</option>
                        <option value="cap">Cap & Chase Cover</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-warm-ivory/85 mb-2">How can we help? *</label>
                      <textarea id="message" name="message" minLength={20} required rows={4} className="w-full bg-midnight border border-white/15 rounded-xl px-4 py-3 text-white resize-none" placeholder="Tell us what you are seeing..." />
                    </div>

                    <div className="flex items-start gap-3 bg-midnight/60 border border-white/10 rounded-xl p-3">
                      <input id="consent" name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-copper-ember" />
                      <label htmlFor="consent" className="text-sm text-warm-ivory/80">
                        I agree to be contacted by First Chimney regarding this request.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {formStatus === 'submitting' ? 'Sending...' : (
                        <>
                          Request My Estimate
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-warm-ivory/55">
                      Form is structured for webhook/CRM connection and currently shows an on-page success confirmation.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-12 lg:pl-12">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">Get in Touch</h2>
                <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">We're Here to Help</h3>
                <p className="text-warm-ivory/85 text-lg leading-relaxed mb-8">
                  For active leaks, smoke issues, failed chimney components, or routine annual service, our team is ready to help.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-soft-black border border-white/10 rounded-xl flex items-center justify-center shrink-0"><Phone className="w-6 h-6 text-copper-ember" /></div>
                  <div>
                    <h4 className="font-display font-bold text-xl mb-2 text-white">Call Us</h4>
                    <p className="text-warm-ivory/75 mb-2">Fast response for urgent chimney concerns.</p>
                    <a href={SITE.phoneHref} className="text-2xl font-display font-bold text-white hover:text-copper-ember">{SITE.phoneDisplay}</a>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-soft-black border border-white/10 rounded-xl flex items-center justify-center shrink-0"><Mail className="w-6 h-6 text-copper-ember" /></div>
                  <div>
                    <h4 className="font-display font-bold text-xl mb-2 text-white">Email Us</h4>
                    <p className="text-warm-ivory/75 mb-2">General questions and scheduling support.</p>
                    <a href={`mailto:${SITE.email}`} className="text-lg font-medium text-white hover:text-copper-ember">{SITE.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-soft-black border border-white/10 rounded-xl flex items-center justify-center shrink-0"><MapPin className="w-6 h-6 text-copper-ember" /></div>
                  <div>
                    <h4 className="font-display font-bold text-xl mb-2 text-white">Service Coverage</h4>
                    <p className="text-warm-ivory/75 mb-2">Proudly serving homeowners throughout the Mid-Atlantic.</p>
                    <p className="text-lg font-medium text-white">VA, MD, WV, & PA</p>
                  </div>
                </div>
              </div>

              <div className="bg-soft-black p-8 rounded-2xl border border-white/10 mt-12">
                <h4 className="font-display font-bold text-xl mb-4 text-white">Business Hours</h4>
                <ul className="space-y-3 text-warm-ivory/85">
                  <li className="flex justify-between border-b border-white/10 pb-2"><span>Monday - Friday</span><span className="text-white font-medium">8:00 AM - 6:00 PM</span></li>
                  <li className="flex justify-between border-b border-white/10 pb-2"><span>Saturday</span><span className="text-white font-medium">9:00 AM - 4:00 PM</span></li>
                  <li className="flex justify-between pt-1"><span>Sunday</span><span className="text-copper-ember font-medium">Emergency Service Only</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
