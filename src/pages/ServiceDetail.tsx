import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Camera, Shield, Wrench, CheckCircle, Star, FileText, ArrowRight, Phone, CircleDashed, Droplets } from 'lucide-react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS, SITE } from '@/lib/site';

type ServiceDetailData = {
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
  image: string;
  benefits: string[];
};

const serviceData: Record<string, ServiceDetailData> = {
  'chimney-inspection': {
    title: 'Professional Chimney Inspection',
    subtitle: 'See What We See. Know What You Need.',
    desc: 'Our Level 1, 2, and 3 inspections combine certified expertise with internal camera scanning so hidden defects are identified before they become safety hazards.',
    icon: Camera,
    image: IMAGE_ASSETS.inspection,
    benefits: [
      'NFPA-compliant Level 1, 2, and 3 inspections',
      'HD camera scanning included with Level 2 and above',
      'Detailed digital report with image evidence',
      'Prioritized repair recommendations and next steps',
    ],
  },
  'chimney-sweeping': {
    title: 'Expert Chimney Sweeping',
    subtitle: 'Breathe Easier. Burn Safer.',
    desc: 'Our sweeping service removes dangerous creosote and obstructions using rotary systems and HEPA containment to keep your home clean and your chimney safer.',
    icon: Shield,
    image: IMAGE_ASSETS.chimneySweep1,
    benefits: [
      'Mess-free process with HEPA protection',
      'Creosote removal for safer operation',
      'Draft and airflow improvement',
      'Annual maintenance recommendations',
    ],
  },
  'masonry-rebuilds': {
    title: 'Masonry Rebuilds & Structural Repairs',
    subtitle: 'Restore Integrity Above the Roofline.',
    desc: 'From tuckpointing to complete rebuilds, we repair deteriorated masonry and chimney structures to protect the home and extend chimney lifespan.',
    icon: Wrench,
    image: IMAGE_ASSETS.masonry,
    benefits: [
      'Tuckpointing and mortar joint restoration',
      'Brick replacement and structural correction',
      'Full or partial chimney rebuild options',
      'Long-term weather resistance and stability',
    ],
  },
  'leak-repair': {
    title: 'Chimney Leak Repair & Waterproofing',
    subtitle: 'Stop Water at the Source.',
    desc: 'We diagnose and resolve chimney leaks at flashing, crown, cap, and masonry entry points to prevent recurring interior damage and mold risk.',
    icon: Droplets,
    image: IMAGE_ASSETS.crown,
    benefits: [
      'Flashing diagnostics and repair',
      'Crown sealing and waterproof coating',
      'Water-entry path isolation and correction',
      'Preventive recommendations for long-term protection',
    ],
  },
  'chimney-cap': {
    title: 'Chimney Cap & Chase Cover Installation',
    subtitle: 'Protect the Top, Protect the System.',
    desc: 'Custom-fitted chimney caps and chase covers block rain, animals, debris, and downdrafts while improving overall system reliability.',
    icon: CircleDashed,
    image: IMAGE_ASSETS.cap,
    benefits: [
      'Rust-resistant cap and cover options',
      'Animal and debris intrusion prevention',
      'Improved moisture control and draft management',
      'Proper fitment for masonry and prefab systems',
    ],
  },
  'chimney-crown': {
    title: 'Chimney Crown Repair',
    subtitle: 'Seal Cracks Before They Spread.',
    desc: 'A cracked crown allows water into your chimney system. We rebuild and seal crowns to stop moisture intrusion and protect the flue structure.',
    icon: CheckCircle,
    image: IMAGE_ASSETS.crown,
    benefits: [
      'Crown crack and spall remediation',
      'Rebuilds for heavily compromised crowns',
      'Elastomeric waterproof crown sealants',
      'Integrated leak prevention strategy',
    ],
  },
  'fireplace-repair': {
    title: 'Fireplace Repair',
    subtitle: 'Safe Performance with Better Ambience.',
    desc: 'We repair fireboxes, damper systems, and surrounding masonry to restore safer operation and improve fireplace performance and comfort.',
    icon: Star,
    image: IMAGE_ASSETS.fireplace,
    benefits: [
      'Firebox and refractory panel repairs',
      'Damper and draft issue correction',
      'Smoke and odor troubleshooting',
      'Performance checks after completion',
    ],
  },
  'dryer-vent-cleaning': {
    title: 'Dryer Vent Cleaning',
    subtitle: 'Reduce Fire Risk. Improve Efficiency.',
    desc: 'Our vent cleaning service removes lint buildup and obstructions that cause overheating, long dry times, and elevated fire risk.',
    icon: FileText,
    image: IMAGE_ASSETS.chimneySweep3,
    benefits: [
      'Full-path vent clearing',
      'Airflow and performance improvement',
      'Lower dryer strain and utility waste',
      'Reduced lint-related fire risk',
    ],
  },
};

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = useMemo(
    () => serviceData[serviceId || 'chimney-inspection'] || serviceData['chimney-inspection'],
    [serviceId],
  );

  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO
        title={service.title}
        description={service.desc}
        path={`/services/${serviceId || 'chimney-inspection'}`}
        image={service.image}
      />

      <section className="relative py-24 bg-soft-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-transparent" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <service.icon className="w-4 h-4 text-copper-ember" />
              <span className="text-sm font-semibold tracking-wide uppercase">Specialized Chimney Service</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">{service.title}</h1>
            <p className="text-2xl text-copper-ember font-display mb-6">{service.subtitle}</p>
            <p className="text-xl text-warm-ivory/90 leading-relaxed mb-10">{service.desc}</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)] flex items-center justify-center gap-2"
              >
                Schedule Service
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={SITE.phoneHref}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {SITE.phoneDisplay}
              </a>
            </div>
            <div className="flex justify-start w-full mt-12">
              <WavePath className="text-copper-ember/30" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-white">Why Choose First Chimney for {service.title}?</h2>
              <ul className="space-y-6">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-4 bg-soft-black p-6 rounded-2xl border border-white/10">
                    <CheckCircle className="w-6 h-6 text-copper-ember shrink-0 mt-1" />
                    <span className="text-lg text-warm-ivory/95">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img src={service.image} alt={`${service.title} process`} className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-soft-black border-t border-white/5">
        <BackgroundPaths title="Don't Compromise on Safety" description="Trust First Chimney to protect your home, your fireplace, and your family.">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]"
          >
            Request an Estimate
            <ArrowRight className="w-5 h-5" />
          </Link>
        </BackgroundPaths>
      </section>
    </div>
  );
}
