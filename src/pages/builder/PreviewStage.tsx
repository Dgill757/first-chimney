import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/data/catalog";
import { SafeImg } from "./ui";
import { previewLayers } from "@/data/catalog/select";

/**
 * Resolves only once every image in `srcs` has decoded, and hands back the last
 * complete set. That is what lets the stage crossfade between two finished
 * pictures instead of flashing a half-loaded stack.
 */
function useLoadedLayers(srcs: string[]) {
  const [shown, setShown] = useState<string[] | null>(null);
  const key = srcs.join("|");
  const latest = useRef(key);
  useEffect(() => {
    latest.current = key;
    if (!srcs.length) { setShown([]); return; }
    let cancelled = false;
    // A layer that fails to load is dropped rather than shown broken.
    Promise.all(srcs.map(src => new Promise<string | null>(resolve => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    }))).then(ok => { if (!cancelled && latest.current === key) setShown(ok.filter((s): s is string => !!s)); });
    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return shown;
}

export default function PreviewStage({ product, picks, className = "" }: { product: Product; picks: Record<string, string[]>; className?: string }) {
  const layers = previewLayers(product, picks);
  const shown = useLoadedLayers(layers);
  const hero = product.images.hero;

  // No licensed layered art for this unit: show the maker's photograph and say
  // so plainly. A fake preview would misrepresent what the customer is buying.
  if (!product.preview) {
    return (
      <div className={`bmf-stage ${className}`}>
        <div className="relative aspect-[4/3] w-full bg-[#f4f1ea]">
          {hero ? <SafeImg src={hero.src} alt={hero.alt} className="absolute inset-0 h-full w-full object-contain p-6" /> : <div className="grid h-full place-items-center text-ink/60">Photo on the way</div>}
        </div>
        <p className="relative z-[1] border-t border-paper/10 bg-[#171514] px-5 py-3 text-[.86rem] leading-relaxed text-paper/75">The maker does not publish layered artwork for this unit, so you will not see your choices drawn onto it. Pick from the swatches and we will show you the real thing on the visit.</p>
      </div>
    );
  }

  return (
    <div className={`bmf-stage ${className}`}>
      {/* Square art whose every layer sits in the middle of the canvas (measured, see
          prune-and-report.mjs) is shown in a 4:3 frame: the empty margin is cropped, the fireplace
          is bigger and the stage shorter on a phone. Units that fill their canvas are never cropped. */}
      <div className="bmf-stagebox relative mx-auto" style={{ ["--ar" as string]: product.preview.cropSafe ? 4 / 3 : (product.preview.height > 0 ? product.preview.width / product.preview.height : 1), aspectRatio: "var(--ar)" }}>
        {shown === null && <div className="bmf-skeleton absolute inset-6" aria-hidden="true" />}
        <AnimatePresence>
          {(shown ?? []).map((src, i) => (
            <motion.img key={src} src={src} alt={i === 0 ? `${product.name} with your selections` : ""} aria-hidden={i === 0 ? undefined : true}
              width={product.preview!.width} height={product.preview!.height || product.preview!.width} draggable={false}
              className={`absolute inset-0 h-full w-full ${product.preview!.cropSafe ? "object-cover" : "object-contain"}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }} />
          ))}
        </AnimatePresence>
      </div>
      <span className="sr-only" aria-live="polite">Preview updated</span>
    </div>
  );
}

/** A small live picture of the build for the phone's bottom bar, so choices stay visible without scrolling back up. */
export function PreviewThumb({ product, picks }: { product: Product; picks: Record<string, string[]> }) {
  const shown = useLoadedLayers(previewLayers(product, picks));
  const hero = product.images.hero;
  if (!product.preview) {
    return <span aria-hidden="true" className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f4f1ea]">{hero && <SafeImg src={hero.src} alt="" fallback="" className="h-full w-full object-contain p-0.5" />}</span>;
  }
  const fit = product.preview.cropSafe ? "object-cover" : "object-contain";
  return (
    <span aria-hidden="true" className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[#241f1c]">
      {(shown ?? []).map(src => <img key={src} src={src} alt="" className={`absolute inset-0 h-full w-full ${fit}`} />)}
    </span>
  );
}
