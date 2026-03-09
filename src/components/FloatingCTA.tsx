import { useState, useEffect } from 'react';
import { Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { SITE } from '@/lib/site';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down a bit
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 w-full z-40 lg:hidden"
        >
          <div className="bg-soft-black/95 backdrop-blur-lg border-t border-white/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
            <div className="flex gap-4">
              <a 
                href={SITE.phoneHref}
                className="flex-1 flex items-center justify-center gap-2 bg-midnight border border-white/10 text-white py-3 rounded-xl font-medium"
              >
                <Phone className="w-4 h-4 text-copper-ember" />
                Call Now
              </a>
              <Link 
                to="/contact" 
                className="flex-1 flex items-center justify-center gap-2 bg-copper-ember text-white py-3 rounded-xl font-medium shadow-[0_0_15px_rgba(198,106,43,0.3)]"
              >
                <Calendar className="w-4 h-4" />
                Book Online
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
