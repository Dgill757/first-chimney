import { Link } from 'react-router-dom';
import { Camera, Shield, Wrench, CheckCircle, Star, FileText, ArrowRight, CircleDashed, Droplets } from 'lucide-react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS } from '@/lib/site';

export default function ServicesOverview() {
  const services = [
    {
      id: 'chimney-inspection',
      title: 'Chimney Inspection',
      desc: 'Level 1, 2, and 3 inspections using HD camera diagnostics to identify hidden hazards.',
      icon: Camera,
      image: IMAGE_ASSETS.inspection,
    },
    {
      id: 'chimney-sweeping',
      title: 'Chimney Sweeping',
      desc: 'Thorough removal of dangerous creosote buildup to prevent chimney fires and improve draft.',
      icon: Shield,
      image: IMAGE_ASSETS.chimneySweep1,
    },
    {
      id: 'masonry-rebuilds',
      title: 'Masonry & Rebuilds',
      desc: 'Tuckpointing, crown repair, and complete structural rebuilds for lasting safety and beauty.',
      icon: Wrench,
      image: IMAGE_ASSETS.masonry,
    },
    {
      id: 'leak-repair',
      title: 'Leak Repair & Waterproofing',
      desc: 'Flashing repair and moisture-entry solutions that stop recurring water damage at the source.',
      icon: Droplets,
      image: IMAGE_ASSETS.crown,
    },
    {
      id: 'chimney-cap',
      title: 'Chimney Caps & Chase Covers',
      desc: 'Custom cap and chase cover installations to protect your system from rain and animal intrusion.',
      icon: CircleDashed,
      image: IMAGE_ASSETS.cap,
    },
    {
      id: 'chimney-crown',
      title: 'Chimney Crown Repair',
      desc: 'Repair and sealing of cracked crowns to prevent freeze-thaw damage and interior leaks.',
      icon: CheckCircle,
      image: IMAGE_ASSETS.crown,
    },
    {
      id: 'fireplace-repair',
      title: 'Fireplace Repair',
      desc: 'Restoring functionality and aesthetics to masonry and factory-built fireplace systems.',
      icon: Star,
      image: IMAGE_ASSETS.fireplace,
    },
    {
      id: 'dryer-vent-cleaning',
      title: 'Dryer Vent Cleaning',
      desc: 'Professional vent clearing to reduce fire risk, lower energy bills, and extend appliance life.',
      icon: FileText,
      image: IMAGE_ASSETS.chimneySweep2,
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <SEO
        title="Chimney Services"
        description="Explore First Chimney services including inspections, sweeping, leak repair, masonry rebuilds, cap installation, and fireplace restoration."
        path="/services"
        image={IMAGE_ASSETS.inspection}
      />

      <section className="relative bg-soft-black border-b border-white/5">
        <BackgroundPaths
          title="Comprehensive Chimney Care."
          description="From routine maintenance to structural restoration, every First Chimney service is designed for safety, transparency, and long-term value."
        >
          <div className="flex justify-center w-full mt-8">
            <WavePath className="text-copper-ember/30" />
          </div>
        </BackgroundPaths>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Link key={service.id} to={`/services/${service.id}`} className="glass-card rounded-2xl overflow-hidden hover-lift group border border-white/10 hover:border-copper-ember/40">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-soft-black border border-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:border-copper-ember/60">
                    <service.icon className="w-6 h-6 text-copper-ember" />
                  </div>
                  <h2 className="text-xl font-display font-bold mb-3 text-white group-hover:text-copper-ember">{service.title}</h2>
                  <p className="text-warm-ivory/80 mb-6 leading-relaxed text-sm">{service.desc}</p>
                  <div className="flex items-center text-sm font-semibold text-white group-hover:text-copper-ember">
                    Explore Service <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-soft-black border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">Our Standard</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Why Choose First Chimney?</h3>
              <ul className="space-y-6">
                {[
                  { title: 'Certified Field Technicians', desc: 'Work is performed by experienced pros with safety-first protocols.' },
                  { title: 'Photo-Backed Diagnostics', desc: 'You receive clear evidence and findings before we recommend work.' },
                  { title: 'Transparent Scope & Pricing', desc: 'No hidden fees and no fear-based upsell tactics.' },
                  { title: 'Clean, Respectful Job Sites', desc: 'Containment systems and cleanup are standard, not optional.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-copper-ember shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-white">{item.title}</h4>
                      <p className="text-warm-ivory/80">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img src={IMAGE_ASSETS.beforeAfter1} alt="Chimney masonry craftsmanship" className="w-full h-auto rounded-2xl border border-white/10" />
              <div className="absolute -bottom-8 -left-8 bg-midnight p-6 rounded-2xl border border-white/10 shadow-2xl max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex text-fire-gold">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
                  <span className="text-sm font-bold">5.0 Client Rating</span>
                </div>
                <p className="text-sm text-warm-ivory/85 italic">"Thorough, clean, and honest. We finally understood exactly what was happening with our chimney."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-midnight border-t border-white/5">
        <BackgroundPaths title="Need an Expert Opinion?" description="Schedule a comprehensive inspection and get a clear game plan for your chimney.">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]">
            Book Your Service
            <ArrowRight className="w-5 h-5" />
          </Link>
        </BackgroundPaths>
      </section>
    </div>
  );
}