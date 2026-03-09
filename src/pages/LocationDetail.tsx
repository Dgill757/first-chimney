import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Shield, CheckCircle, ArrowRight, Phone, Camera, Wrench, Droplets } from 'lucide-react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS, SITE } from '@/lib/site';

export default function LocationDetail() {
  const { locationId } = useParams<{ locationId: string }>();
  const locationName = useMemo(
    () => (locationId ? locationId.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Your Area'),
    [locationId],
  );

  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO
        title={`Chimney Services in ${locationName}`}
        description={`First Chimney provides inspections, sweeping, leak repair, masonry restoration, and fireplace service in ${locationName} and surrounding communities.`}
        path={`/service-areas/${locationId || ''}`}
        image={IMAGE_ASSETS.inspection}
      />

      <section className="relative py-24 bg-soft-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img src={IMAGE_ASSETS.heroAlt} alt={`Chimney services in ${locationName}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-transparent" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <MapPin className="w-4 h-4 text-copper-ember" />
              <span className="text-sm font-semibold tracking-wide uppercase">Local Service Area</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">Premium Chimney Services in {locationName}</h1>
            <p className="text-xl text-warm-ivory/90 leading-relaxed mb-10">
              Protect your home with detailed inspections, reliable repairs, and clean professional service from technicians who understand Mid-Atlantic weather and chimney wear patterns.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/contact" className="w-full sm:w-auto bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)] flex items-center justify-center gap-2">
                Schedule Service
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href={SITE.phoneHref} className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 flex items-center justify-center gap-2">
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
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Core Services for {locationName} Homes</h2>
            <p className="text-warm-ivory/80 text-lg">Targeted solutions for safety, leak prevention, and long-term chimney performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Chimney Inspection', desc: 'HD camera diagnostics for hidden risks and code concerns.', icon: Camera },
              { title: 'Chimney Sweeping', desc: 'Creosote and blockage removal for safer operation.', icon: Shield },
              { title: 'Masonry & Rebuilds', desc: 'Structural restoration for damaged brick and mortar.', icon: Wrench },
              { title: 'Leak Repair', desc: 'Flashing and water-entry correction.', icon: Droplets },
              { title: 'Cap & Crown Protection', desc: 'Top-of-chimney defense against weather intrusion.', icon: CheckCircle },
              { title: 'Fireplace Repair', desc: 'Performance and safety repairs for your fireplace system.', icon: Shield },
            ].map((service, i) => (
              <div key={i} className="bg-soft-black p-8 rounded-2xl border border-white/10">
                <service.icon className="w-8 h-8 text-copper-ember mb-6" />
                <h3 className="text-xl font-display font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-warm-ivory/80">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-soft-black border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-white">Why {locationName} Homeowners Choose First Chimney</h2>
              <ul className="space-y-6">
                {[
                  'Evidence-backed diagnostics with clear documentation',
                  'Safety-focused recommendations without pressure selling',
                  'Consistent communication from estimate to completion',
                  'Licensed and insured professionals for every project',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 bg-midnight p-6 rounded-2xl border border-white/10">
                    <CheckCircle className="w-6 h-6 text-copper-ember shrink-0 mt-1" />
                    <span className="text-lg text-warm-ivory/95">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img src={IMAGE_ASSETS.beforeAfter3} alt="Chimney repair project" className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-midnight border-t border-white/5">
        <BackgroundPaths title="Ready to Secure Your Home?" description={`Contact First Chimney today for trusted service in ${locationName}.`}>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]">
            Request an Estimate
            <ArrowRight className="w-5 h-5" />
          </Link>
        </BackgroundPaths>
      </section>
    </div>
  );
}
