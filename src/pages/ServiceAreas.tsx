import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';

export default function ServiceAreas() {
  const states = [
    {
      name: 'Virginia',
      cities: ['Alexandria', 'Arlington', 'Fairfax', 'Loudoun County', 'Prince William County'],
    },
    {
      name: 'Maryland',
      cities: ['Bethesda', 'Silver Spring', 'Rockville', 'Annapolis', 'Frederick'],
    },
    {
      name: 'Washington D.C.',
      cities: ['Northwest DC', 'Northeast DC', 'Capitol Hill', 'Georgetown'],
    },
    {
      name: 'West Virginia',
      cities: ['Martinsburg', 'Charles Town', 'Harpers Ferry'],
    },
    {
      name: 'Pennsylvania',
      cities: ['Gettysburg', 'Chambersburg', 'Waynesboro'],
    },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO
        title="Service Areas"
        description="First Chimney serves homeowners across Virginia, Maryland, Washington DC, West Virginia, and Pennsylvania with premium chimney and fireplace services."
        path="/service-areas"
      />

      <section className="relative bg-soft-black border-b border-white/5">
        <BackgroundPaths
          title="Serving the Mid-Atlantic."
          description="Premium chimney and fireplace service across five states with local scheduling and responsive support."
        >
          <div className="flex flex-col items-center">
            <MapPin className="w-12 h-12 text-copper-ember mb-6" />
            <div className="flex justify-center w-full mt-2">
              <WavePath className="text-copper-ember/30" />
            </div>
          </div>
        </BackgroundPaths>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {states.map((state) => (
              <div key={state.name} className="bg-soft-black p-8 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-display font-bold mb-6 text-copper-ember border-b border-white/10 pb-4">{state.name}</h2>
                <ul className="space-y-4">
                  {state.cities.map((city) => (
                    <li key={city}>
                      <Link to={`/service-areas/${city.toLowerCase().replace(/ /g, '-')}`} className="flex items-center justify-between text-warm-ivory/85 hover:text-white group">
                        <span>{city}</span>
                        <ArrowRight className="w-4 h-4 text-copper-ember opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-soft-black border-t border-white/5">
        <BackgroundPaths title="Don't See Your City?" description="Reach out anyway. We frequently accommodate nearby communities and expanding routes.">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]">
            Check Availability
            <ArrowRight className="w-5 h-5" />
          </Link>
        </BackgroundPaths>
      </section>
    </div>
  );
}
