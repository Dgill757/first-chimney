import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
      <SEO title="Page Not Found" description="The page you requested could not be found." path="/404" />
      <div className="w-24 h-24 bg-soft-black border border-white/10 rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl font-display font-bold text-copper-ember">404</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">Page Not Found</h1>
      <p className="text-xl text-warm-ivory/85 max-w-2xl mx-auto mb-10 leading-relaxed">
        The page may have moved or no longer exists. Use the links below to get back on track.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link to="/" className="w-full sm:w-auto bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)] flex items-center justify-center gap-2">
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <Link to="/contact" className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 flex items-center justify-center gap-2">
          Contact Support
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}