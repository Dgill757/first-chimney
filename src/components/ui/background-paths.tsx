"use client";

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    d: `M-${360 - i * 5 * position} -${180 + i * 6}C-${360 - i * 5 * position} -${180 + i * 6} -${300 - i * 5 * position} ${210 - i * 6} ${150 - i * 5 * position} ${336 - i * 6}C${610 - i * 5 * position} ${460 - i * 6} ${680 - i * 5 * position} ${860 - i * 6} ${680 - i * 5 * position} ${860 - i * 6}`,
    width: 0.6 + i * 0.025,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" aria-hidden="true">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={position > 0 ? 'rgba(231, 163, 75, 0.55)' : 'rgba(198, 106, 43, 0.42)'}
            strokeWidth={path.width}
            strokeOpacity={0.18 + path.id * 0.018}
            initial={{ pathLength: 0.2, opacity: 0.42 }}
            animate={{ pathLength: 1, opacity: [0.28, 0.7, 0.28], pathOffset: [0, 1, 0] }}
            transition={{ duration: 17 + Math.random() * 7, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_60%,rgba(198,106,43,0.18),transparent_55%),radial-gradient(circle_at_78%_38%,rgba(166,58,43,0.14),transparent_55%)]" />
    </div>
  );
}

export function BackgroundPaths({
  title = 'Background Paths',
  description,
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  const words = title.split(' ');

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden bg-transparent py-24">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white px-2">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-3 last:mr-0">
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: wordIndex * 0.06 + letterIndex * 0.02, type: 'spring', stiffness: 180, damping: 28 }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-lg md:text-xl text-warm-ivory/90 mb-10 max-w-2xl mx-auto px-2"
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
