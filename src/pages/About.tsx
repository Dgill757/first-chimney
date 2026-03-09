import { Link } from 'react-router-dom';
import { Shield, CheckCircle, ArrowRight, Users, Award } from 'lucide-react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS } from '@/lib/site';

export default function About() {
  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO
        title="About First Chimney"
        description="Learn how First Chimney combines diagnostic transparency, safety-first service, and expert craftsmanship for homeowners across the Mid-Atlantic."
        path="/about"
        image={IMAGE_ASSETS.inspection}
      />

      <section className="relative bg-soft-black border-b border-white/5">
        <BackgroundPaths
          title="Raising the Standard in Chimney Care."
          description="First Chimney was built on one principle: homeowners deserve clarity, craftsmanship, and uncompromising safety."
        >
          <div className="flex justify-center w-full mt-8">
            <WavePath className="text-copper-ember/30" />
          </div>
        </BackgroundPaths>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">Our Story</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Built on Trust and Expertise</h3>
              <div className="space-y-6 text-warm-ivory/90 text-lg leading-relaxed">
                <p>
                  We saw too many homeowners dealing with vague chimney advice, unclear pricing, and rushed service. First Chimney was created to deliver a better standard: evidence-based diagnostics and clean, accountable workmanship.
                </p>
                <p>
                  Whether it is a routine sweep or a complex structural rebuild, we document findings, explain risk clearly, and execute repairs with long-term performance in mind.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src={IMAGE_ASSETS.chimneySweep2} alt="Chimney professional sweeping flue" className="w-full h-64 object-cover rounded-2xl border border-white/10" />
                <div className="bg-soft-black p-6 rounded-2xl border border-white/10">
                  <Shield className="w-8 h-8 text-copper-ember mb-4" />
                  <h4 className="font-display font-bold text-xl mb-2 text-white">Safety First</h4>
                  <p className="text-warm-ivory/80 text-sm">Every recommendation starts with risk mitigation and code-conscious planning.</p>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-soft-black p-6 rounded-2xl border border-white/10">
                  <Users className="w-8 h-8 text-copper-ember mb-4" />
                  <h4 className="font-display font-bold text-xl mb-2 text-white">Homeowner Clarity</h4>
                  <p className="text-warm-ivory/80 text-sm">You see what we see before any major work begins.</p>
                </div>
                <img src={IMAGE_ASSETS.inspectionAlt} alt="Internal chimney camera inspection" className="w-full h-64 object-cover rounded-2xl border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-soft-black border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">What Drives Us</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Our Core Values</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Uncompromising Safety', desc: 'We protect your home and family with methodical inspections and disciplined workmanship.', icon: Shield },
              { title: 'Transparent Diagnostics', desc: 'HD camera findings, documented evidence, and clear language every step of the way.', icon: CheckCircle },
              { title: 'Craftsmanship That Lasts', desc: 'From repairs to rebuilds, work is designed for longevity in real weather conditions.', icon: Award },
            ].map((value, i) => (
              <div key={i} className="bg-midnight p-8 rounded-2xl border border-white/10 text-center">
                <div className="w-16 h-16 mx-auto bg-soft-black border border-white/15 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-copper-ember" />
                </div>
                <h4 className="text-xl font-display font-bold mb-4 text-white">{value.title}</h4>
                <p className="text-warm-ivory/85">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-midnight border-t border-white/5">
        <BackgroundPaths title="Experience the First Chimney Difference" description="Ready to work with a team that puts safety and quality first?">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]">
            Schedule Your Service
            <ArrowRight className="w-5 h-5" />
          </Link>
        </BackgroundPaths>
      </section>
    </div>
  );
}
