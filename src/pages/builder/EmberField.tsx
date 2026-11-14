/**
 * A quiet field of rising embers behind the entry screen. It is atmosphere, so it
 * follows three rules: it never runs for someone who asked for reduced motion
 * (they get the static glow from the page background instead), it stops while
 * the tab is hidden or the canvas is off screen, and it draws a small fixed
 * number of particles so it costs next to nothing on a phone.
 */
import { useEffect, useRef } from "react";

type Ember = { x: number; y: number; r: number; vy: number; drift: number; phase: number; hue: number };

export default function EmberField({ count = 46 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, running = false, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const spawn = (fromBottom: boolean): Ember => ({
      x: Math.random() * w, y: fromBottom ? h + Math.random() * 40 : Math.random() * h,
      r: 0.6 + Math.random() * 2.1, vy: 0.18 + Math.random() * 0.55, drift: (Math.random() - 0.5) * 0.35, phase: Math.random() * Math.PI * 2,
      hue: 18 + Math.random() * 28,
    });
    let embers: Ember[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      embers = Array.from({ length: count }, () => spawn(false));
    };

    const frame = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.y -= e.vy;
        e.x += e.drift + Math.sin(t / 900 + e.phase) * 0.22;
        // Fade out as an ember rises so the top of the screen stays clean.
        const life = Math.max(0, Math.min(1, e.y / h));
        const flicker = 0.65 + 0.35 * Math.sin(t / 240 + e.phase);
        const alpha = life * flicker * 0.9;
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5);
        g.addColorStop(0, `hsla(${e.hue}, 100%, 62%, ${alpha})`);
        g.addColorStop(1, `hsla(${e.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 5, 0, Math.PI * 2); ctx.fill();
        if (e.y < -10 || e.x < -20 || e.x > w + 20) Object.assign(e, spawn(true));
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [count]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
