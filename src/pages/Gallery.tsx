import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WavePath } from '../components/ui/wave-path';
import { BackgroundPaths } from '../components/ui/background-paths';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS } from '@/lib/site';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    { src: IMAGE_ASSETS.chimneySweep1, alt: 'Chimney sweeping in progress', category: 'Sweeping' },
    { src: IMAGE_ASSETS.inspection, alt: 'Camera inspection setup', category: 'Inspection' },
    { src: IMAGE_ASSETS.beforeAfter1, alt: 'Before and after fireplace transformation', category: 'Before & After' },
    { src: IMAGE_ASSETS.beforeAfter2, alt: 'Finished stone chimney restoration', category: 'Masonry' },
    { src: IMAGE_ASSETS.cap, alt: 'Installed chimney cap for weather protection', category: 'Cap Installation' },
    { src: IMAGE_ASSETS.crown, alt: 'Chimney crown repair detail', category: 'Leak Repair' },
    { src: IMAGE_ASSETS.chimneySweep2, alt: 'Professional chimney cleaning team', category: 'Sweeping' },
    { src: IMAGE_ASSETS.masonry, alt: 'Masonry repair craftsmanship', category: 'Masonry' },
    { src: IMAGE_ASSETS.inspectionAlt, alt: 'Internal flue video inspection', category: 'Inspection' },
  ];

  return (
    <div className="pt-24 pb-16">
      <SEO
        title="Project Gallery"
        description="View First Chimney project photos including inspections, sweeping, leak repairs, masonry restoration, and before/after results."
        path="/gallery"
        image={IMAGE_ASSETS.beforeAfter1}
      />

      <section className="relative bg-soft-black border-b border-white/5">
        <BackgroundPaths title="Our Craftsmanship on Display." description="Real work. Real homes. See the quality and detail First Chimney brings to every project.">
          <div className="flex flex-col items-center">
            <Camera className="w-12 h-12 text-copper-ember mb-6" />
            <div className="flex justify-center w-full mt-2">
              <WavePath className="text-copper-ember/30" />
            </div>
          </div>
        </BackgroundPaths>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group border border-white/10" onClick={() => setSelectedImage(img.src)}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-copper-ember uppercase mb-1 block">{img.category}</span>
                    <h3 className="text-lg font-display font-bold text-white">{img.alt}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-midnight/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={() => setSelectedImage(null)} aria-label="Close image viewer">
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}