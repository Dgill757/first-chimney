import { Star, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';

export default function Reviews() {
  const reviews = [
    { name: 'Sarah Jenkins', location: 'Fairfax, VA', service: 'Chimney Inspection', rating: 5, text: 'The camera report was clear, and the team explained everything without pressure. We knew exactly what to fix first.' },
    { name: 'Michael Chen', location: 'Bethesda, MD', service: 'Masonry Rebuild', rating: 5, text: 'Our chimney was leaking and deteriorating. The rebuild quality was excellent and cleanup was spotless.' },
    { name: 'Emily Davis', location: 'Arlington, VA', service: 'Chimney Sweeping', rating: 5, text: 'Fast, clean, and professional. They left the room cleaner than when they arrived.' },
    { name: 'David Thompson', location: 'Frederick, MD', service: 'Leak Repair', rating: 5, text: 'After years of recurring leaks, First Chimney fixed the flashing and crown issues in one visit.' },
    { name: 'Jessica Martinez', location: 'Washington, DC', service: 'Dryer Vent Cleaning', rating: 5, text: 'Huge airflow improvement and clear explanation of what caused the blockage.' },
    { name: 'Robert Wilson', location: 'Loudoun County, VA', service: 'Fireplace Repair', rating: 5, text: 'Craftsmanship was top-tier. Our fireplace is safe, efficient, and looks fantastic again.' },
  ];

  return (
    <div className="pt-24 pb-16">
      <SEO
        title="Customer Reviews"
        description="See what homeowners across VA, MD, DC, WV, and PA are saying about First Chimney's premium service and craftsmanship."
        path="/reviews"
      />

      <section className="relative bg-soft-black border-b border-white/5">
        <BackgroundPaths title="Don't Just Take Our Word For It." description="Real homeowner feedback on quality, communication, and results.">
          <div className="flex flex-col items-center">
            <div className="flex justify-center mb-6">{[...Array(5)].map((_, i) => <Star key={i} className="w-8 h-8 text-fire-gold fill-current" />)}</div>
            <div className="flex justify-center w-full mt-2"><WavePath className="text-copper-ember/30" /></div>
          </div>
        </BackgroundPaths>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="bg-soft-black p-8 rounded-2xl border border-white/10 hover:border-copper-ember/35 transition-colors">
                <Quote className="w-10 h-10 text-copper-ember/25 mb-6" />
                <div className="flex text-fire-gold mb-4">{[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}</div>
                <p className="text-warm-ivory/90 mb-6 italic leading-relaxed">"{review.text}"</p>
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-display font-bold text-white">{review.name}</h4>
                  <div className="flex justify-between items-center mt-1 gap-2">
                    <span className="text-sm text-warm-ivory/60">{review.location}</span>
                    <span className="text-xs font-medium text-copper-ember bg-copper-ember/10 px-2 py-1 rounded-full">{review.service}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-soft-black border-t border-white/5">
        <BackgroundPaths title="Experience 5-Star Service" description="Join homeowners who trust First Chimney for safety-first solutions.">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]">
            Book Your Inspection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </BackgroundPaths>
      </section>
    </div>
  );
}