import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';

export default function Financing() {
  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO
        title="Financing Options"
        description="Explore flexible financing options for chimney repairs and rebuilds so critical safety work is never delayed."
        path="/financing"
      />

      <section className="relative bg-soft-black border-b border-white/5">
        <BackgroundPaths title="Invest in Safety. Pay Over Time." description="Flexible financing options make urgent chimney repairs more manageable.">
          <div className="flex flex-col items-center">
            <CreditCard className="w-12 h-12 text-copper-ember mb-6" />
            <div className="flex justify-center w-full mt-2"><WavePath className="text-copper-ember/30" /></div>
          </div>
        </BackgroundPaths>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">Flexible Options</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Don't Let Cost Delay Safety</h3>
              <p className="text-warm-ivory/85 text-lg mb-8 leading-relaxed">
                We partner with trusted lenders so homeowners can move forward with priority repairs and spread costs over predictable monthly payments.
              </p>
              <ul className="space-y-6 mb-10">
                {['Promotional APR options may be available', 'Low monthly payment plans', 'Simple, secure application process', 'No prepayment penalty on most plans'].map((item, i) => (
                  <li key={i} className="flex items-start gap-4"><CheckCircle className="w-6 h-6 text-copper-ember shrink-0 mt-1" /><span className="text-lg text-warm-ivory/95">{item}</span></li>
                ))}
              </ul>
            </div>

            <div className="bg-soft-black p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-copper-ember/10 rounded-full blur-3xl"></div>
              <Shield className="w-12 h-12 text-copper-ember mb-6" />
              <h4 className="text-2xl font-display font-bold mb-4 text-white">How It Works</h4>
              <ol className="space-y-6 text-warm-ivory/85">
                <li className="flex gap-4"><span className="font-display font-bold text-copper-ember text-xl">1.</span><div><strong className="text-white block mb-1">Get an Estimate</strong>Schedule a visit and receive a transparent scope of work.</div></li>
                <li className="flex gap-4"><span className="font-display font-bold text-copper-ember text-xl">2.</span><div><strong className="text-white block mb-1">Apply Online</strong>Complete your financing application through our lending partner.</div></li>
                <li className="flex gap-4"><span className="font-display font-bold text-copper-ember text-xl">3.</span><div><strong className="text-white block mb-1">Choose Plan</strong>Select a payment structure that fits your budget.</div></li>
                <li className="flex gap-4"><span className="font-display font-bold text-copper-ember text-xl">4.</span><div><strong className="text-white block mb-1">Start Project</strong>Work begins quickly so your home stays protected.</div></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-soft-black border-t border-white/5">
        <BackgroundPaths title="Ready to Explore Your Options?" description="Contact us today to discuss financing based on your project scope.">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </BackgroundPaths>
      </section>
    </div>
  );
}
