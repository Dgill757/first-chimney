import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  Shield,
  CheckCircle,
  MapPin,
  ArrowRight,
  Camera,
  Wrench,
  FileText,
  ChevronRight,
  Droplets,
  Wind,
  AlertTriangle,
  CircleDashed,
  Flame,
  BrickWall,
  BadgeCheck,
  Star,
} from 'lucide-react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS, SITE } from '@/lib/site';

export default function Home() {
  const reduceMotion = useReducedMotion();

  const emberParticles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: 4 + ((i * 5) % 8),
        left: `${(i * 13) % 100}%`,
        delay: `${i * 0.8}s`,
        duration: `${8 + (i % 4) * 2}s`,
      })),
    [],
  );

  const services = [
    {
      title: 'Level 2 Inspections',
      desc: 'HD camera diagnostics to uncover hidden hazards before they become expensive repairs.',
      icon: Camera,
      path: '/services/chimney-inspection',
      image: IMAGE_ASSETS.inspection,
    },
    {
      title: 'Chimney Sweeping',
      desc: 'Mess-free sweeping to remove creosote buildup and restore healthy draft performance.',
      icon: Shield,
      path: '/services/chimney-sweeping',
      image: IMAGE_ASSETS.chimneySweep1,
    },
    {
      title: 'Masonry & Rebuilds',
      desc: 'Tuckpointing, structural repair, and full rebuilds designed for long-term durability.',
      icon: Wrench,
      path: '/services/masonry-rebuilds',
      image: IMAGE_ASSETS.masonry,
    },
    {
      title: 'Leak Resolution',
      desc: 'Flashing, waterproofing, and cap/crown solutions that stop recurring water intrusion.',
      icon: CheckCircle,
      path: '/services/leak-repair',
      image: IMAGE_ASSETS.crown,
    },
    {
      title: 'Fireplace Repair',
      desc: 'Restore function, airflow, and aesthetics for safe fires and a cleaner home.',
      icon: Flame,
      path: '/services/fireplace-repair',
      image: IMAGE_ASSETS.fireplace,
    },
    {
      title: 'Dryer Vent Cleaning',
      desc: 'Reduce fire risk and improve efficiency with complete lint and blockage removal.',
      icon: FileText,
      path: '/services/dryer-vent-cleaning',
      image: IMAGE_ASSETS.chimneySweep2,
    },
  ];

  const diagnostics = [
    {
      title: 'Smoke Problems',
      desc: 'Smoke backing up when the fireplace is running.',
      icon: Wind,
      image: IMAGE_ASSETS.chimneySweep2,
      path: '/services/chimney-sweeping',
    },
    {
      title: 'Water Stains',
      desc: 'Brown marks near your chimney chase or ceiling.',
      icon: Droplets,
      image: IMAGE_ASSETS.crown,
      path: '/services/leak-repair',
    },
    {
      title: 'Crumbling Mortar',
      desc: 'Spalling brick, cracked mortar joints, or loose masonry.',
      icon: BrickWall,
      image: IMAGE_ASSETS.beforeAfter2,
      path: '/services/masonry-rebuilds',
    },
    {
      title: 'Missing Caps',
      desc: 'Open flue tops inviting rain, animals, and debris.',
      icon: CircleDashed,
      image: IMAGE_ASSETS.cap,
      path: '/services/chimney-cap',
    },
    {
      title: 'Bad Odors',
      desc: 'Campfire smell or musty odors in warm weather.',
      icon: AlertTriangle,
      image: IMAGE_ASSETS.chimneySweep3,
      path: '/services/chimney-inspection',
    },
    {
      title: 'Draft Issues',
      desc: 'Poor airflow and difficulty keeping fires lit.',
      icon: Wind,
      image: IMAGE_ASSETS.inspectionAlt,
      path: '/services/chimney-inspection',
    },
  ];

  return (
    <div className="flex flex-col">
      <SEO
        title="Chimney Services Built for Safety and Long-Term Value"
        description="First Chimney delivers inspections, sweeping, chimney leak repair, masonry restoration, and fireplace services across VA, MD, WV, and PA."
        path="/"
        image={IMAGE_ASSETS.hero}
      />

      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 z-0">
          {!reduceMotion ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={IMAGE_ASSETS.hero}
              className="w-full h-full object-cover scale-[1.04]"
            >
              <source src={IMAGE_ASSETS.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img src={IMAGE_ASSETS.hero} alt="" className="w-full h-full object-cover scale-[1.04]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/86 via-midnight/72 to-midnight" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(198,106,43,0.14),transparent_52%)]" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {emberParticles.map((p) => (
            <span
              key={p.id}
              className="ember-particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: p.left,
                bottom: '-10px',
                animationDelay: p.delay,
                animationDuration: `${p.duration}, ${4 + p.id * 0.2}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center mt-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8"
            >
              <Shield className="w-4 h-4 text-copper-ember" />
              <span className="text-sm font-semibold tracking-wide uppercase">CSIA Certified | Licensed & Insured</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 text-white">
              <motion.span initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="block">
                Chimney Safety Done
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12 }}
                className="block text-gradient"
              >
                Right the First Time.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="text-lg md:text-xl text-warm-ivory/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Premium chimney inspection, sweeping, leak repair, and masonry restoration for homeowners across the Mid-Atlantic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_22px_rgba(198,106,43,0.45)] hover:shadow-[0_0_32px_rgba(231,163,75,0.62)] flex items-center justify-center gap-2 group"
              >
                Book Your Inspection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
              </Link>
              <a
                href={SITE.phoneHref}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/25 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 flex items-center justify-center gap-2"
              >
                Call {SITE.phoneDisplay}
              </a>
            </motion.div>

            <div className="flex justify-center w-full mt-8">
              <WavePath className="text-copper-ember/30" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-soft-black border-y border-white/5 py-8">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {[
              { label: 'CSIA Certified', icon: BadgeCheck },
              { label: 'NFI Ready', icon: Shield },
              { label: '5-State Coverage', icon: MapPin },
              { label: '5-Star Client Focus', icon: Star },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.38, delay: i * 0.06 }}
                className="trust-badge bg-midnight/60 border border-white/10 rounded-xl py-4 px-3 text-sm md:text-base font-semibold text-warm-ivory/90 flex flex-col items-center gap-2"
              >
                <item.icon className="w-5 h-5 text-copper-ember" />
                <span>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-midnight relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">Our Expertise</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Comprehensive Chimney Care</h3>
            <p className="text-warm-ivory/85 text-lg">From annual maintenance to structural rebuilds, every service is engineered for safety, performance, and longevity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Link key={i} to={service.path} className="glass-card rounded-2xl overflow-hidden hover-lift group">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 to-transparent" />
                </div>
                <div className="p-7">
                  <div className="w-12 h-12 bg-soft-black border border-white/15 rounded-xl flex items-center justify-center mb-5 group-hover:border-copper-ember/60 transition-colors">
                    <service.icon className="w-6 h-6 text-copper-ember" />
                  </div>
                  <h4 className="text-xl font-display font-bold mb-3 text-white group-hover:text-copper-ember transition-colors">{service.title}</h4>
                  <p className="text-warm-ivory/80 mb-6 line-clamp-2">{service.desc}</p>
                  <div className="flex items-center text-sm font-semibold text-white group-hover:text-copper-ember transition-colors">
                    Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 text-warm-ivory hover:text-copper-ember font-semibold transition-colors">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-soft-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-copper-ember/15 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">Transparent Diagnostics</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight text-white">Know What's Wrong Before You Spend Big.</h3>
              <p className="text-warm-ivory/90 text-lg mb-8 leading-relaxed">
                Every Level 2 inspection includes internal camera scanning and a digital report with photo evidence, so you can confidently prioritize repairs and avoid guesswork.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'HD internal flue camera scanning',
                  'Issue-by-issue findings with photo proof',
                  'Clear severity-based recommendations',
                  'Transparent pricing with no pressure tactics',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-copper-ember shrink-0" />
                    <span className="text-warm-ivory/95">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/services/chimney-inspection" className="inline-flex items-center gap-2 bg-white text-midnight px-6 py-3 rounded-xl font-semibold hover:bg-warm-ivory">
                Explore Our Inspection Process
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 relative">
                <img src={IMAGE_ASSETS.inspectionAlt} alt="Camera inspection inside chimney flue" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 to-transparent flex items-end p-8">
                  <div className="bg-midnight/80 backdrop-blur-md border border-white/20 p-4 rounded-xl w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">Flue Scan in Progress</span>
                      <span className="text-xs text-copper-ember animate-pulse">LIVE</span>
                    </div>
                    <div className="h-2 bg-soft-black rounded-full overflow-hidden">
                      <div className="h-full bg-copper-ember w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-midnight relative border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-copper-ember uppercase mb-4">Smart Diagnostic Tool</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Know What’s Wrong Before You Spend Big</h3>
            <p className="text-warm-ivory/85 text-lg">Click the issue you are seeing at home and go straight to the service page that solves it.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnostics.map((issue) => (
              <Link key={issue.title} to={issue.path} className="group relative overflow-hidden rounded-2xl min-h-64 flex items-end border border-white/10">
                <img src={issue.image} alt={issue.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/95 via-midnight/60 to-transparent" />
                <div className="relative z-10 p-6 w-full">
                  <issue.icon className="w-8 h-8 text-copper-ember mb-4" />
                  <h4 className="text-2xl font-display font-bold mb-2 text-white">{issue.title}</h4>
                  <p className="text-warm-ivory/85 text-sm">{issue.desc}</p>
                  <span className="inline-block mt-4 text-copper-ember font-semibold group-hover:text-fire-gold">View Service</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-midnight border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <MapPin className="w-12 h-12 text-copper-ember mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Serving the Mid-Atlantic</h2>
          <p className="text-warm-ivory/85 max-w-2xl mx-auto mb-12">Professional chimney and fireplace service across Virginia, Maryland, West Virginia, and Pennsylvania.</p>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {['Virginia', 'Maryland', 'West Virginia', 'Pennsylvania'].map((state) => (
              <Link
                key={state}
                to={`/service-areas/${state.toLowerCase().replace(/[.']/g, '').replace(/ /g, '-')}`}
                className="bg-soft-black border border-white/10 px-6 py-3 rounded-full text-warm-ivory hover:border-copper-ember hover:text-white transition-colors"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-midnight border-t border-white/5">
        <BackgroundPaths
          title="Ready to secure your home?"
          description="Don't wait until a minor issue becomes a major hazard. Schedule your comprehensive inspection today."
        >
          <Link
            to="/contact"
            className="w-full sm:w-auto bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]"
          >
            Request an Estimate
          </Link>
          <a
            href={SITE.phoneHref}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20"
          >
            Call {SITE.phoneDisplay}
          </a>
        </BackgroundPaths>
      </section>
    </div>
  );
}
