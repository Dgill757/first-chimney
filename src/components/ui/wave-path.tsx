'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type WavePathProps = React.ComponentProps<'div'>;

export function WavePath({ className, ...props }: WavePathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef(0);
  const controlXRef = useRef(0.5);
  const reqIdRef = useRef<number | null>(null);
  const timeRef = useRef(Math.PI / 2);

  const setPath = (progress: number, controlX: number) => {
    if (!pathRef.current || !containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const centerY = 100;
    const pull = progress * 0.52;
    const swing = (controlX - 0.5) * 30;

    pathRef.current.setAttributeNS(
      null,
      'd',
      `M0 ${centerY} C${width * 0.24} ${centerY + pull - swing * 0.2}, ${width * 0.76} ${centerY + pull + swing * 0.2}, ${width} ${centerY}`,
    );
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const resetAnimation = () => {
    timeRef.current = Math.PI / 2;
    progressRef.current = 0;
  };

  const animateOut = () => {
    const newProgress = progressRef.current * Math.sin(timeRef.current);
    progressRef.current = lerp(progressRef.current, 0, 0.07);
    timeRef.current += 0.18;
    setPath(newProgress, controlXRef.current);

    if (Math.abs(progressRef.current) > 0.45) {
      reqIdRef.current = requestAnimationFrame(animateOut);
    } else {
      setPath(0, controlXRef.current);
      resetAnimation();
    }
  };

  useEffect(() => {
    setPath(0, 0.5);

    const handleResize = () => setPath(progressRef.current, controlXRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const manageMouseEnter = () => {
    if (reqIdRef.current) {
      cancelAnimationFrame(reqIdRef.current);
      reqIdRef.current = null;
    }
    resetAnimation();
  };

  const manageMouseMove = (e: React.MouseEvent) => {
    if (!pathRef.current) return;

    const { movementY, clientX } = e;
    const pathBound = pathRef.current.getBoundingClientRect();

    controlXRef.current = Math.min(0.85, Math.max(0.15, (clientX - pathBound.left) / pathBound.width));
    progressRef.current = Math.min(72, Math.max(-72, progressRef.current + movementY));

    setPath(progressRef.current, controlXRef.current);
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  return (
    <div ref={containerRef} className={cn('relative h-px w-[70vw] max-w-[900px]', className)} {...props}>
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        className="relative -top-5 z-10 h-10 w-full md:hover:-top-[120px] md:hover:h-[240px]"
      />
      <svg className="absolute -top-[100px] h-[240px] w-full">
        <path ref={pathRef} className="fill-none stroke-current" strokeWidth={2.1} strokeLinecap="round" />
      </svg>
    </div>
  );
}
