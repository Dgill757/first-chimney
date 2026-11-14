import { X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/data/catalog";
import { FUEL_LABEL, KIND_LABEL } from "@/data/catalog";
import { assessSize, type HeatResult } from "@/data/catalog/heat";
import { SafeImg, fmt } from "./ui";

/** Up to three units side by side. Rows that no unit publishes are left out. */
export default function CompareDialog({ open, onOpenChange, products, brandName, need, onChoose, onRemove }: {
  open: boolean; onOpenChange: (v: boolean) => void; products: Product[]; brandName: (p: Product) => string; need?: HeatResult;
  onChoose: (p: Product) => void; onRemove: (p: Product) => void;
}) {
  const specLabels = Array.from(new Set(products.flatMap(p => p.specs.map(s => s.label))));
  // Only labels at least two units share are useful in a comparison.
  const shared = specLabels.filter(l => products.filter(p => p.specs.some(s => s.label === l)).length >= 2).slice(0, 14);

  const rows: { label: string; cell: (p: Product) => React.ReactNode }[] = [
    { label: "Type", cell: p => `${FUEL_LABEL[p.fuel]} ${KIND_LABEL[p.kind].toLowerCase()}` },
    { label: "Max output", cell: p => (p.heat?.btuMax ? `${fmt(p.heat.btuMax)} BTU` : "Not published") },
    { label: "Heats up to", cell: p => (p.heat?.areaSqFt ? `${fmt(p.heat.areaSqFt)} sq ft` : "Not published") },
    ...(need ? [{ label: "For your room", cell: (p: Product) => assessSize(need, p.heat ?? {}).message }] : []),
    ...shared.map(label => ({ label, cell: (p: Product) => p.specs.find(s => s.label === label)?.value ?? "Not published" })),
    { label: "Customize", cell: p => `${p.options.reduce((n, g) => n + g.options.length, 0)} options` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-5xl gap-0 overflow-hidden border-paper/15 bg-[#161416] p-0 text-paper sm:max-w-5xl">
        <div className="flex items-start justify-between gap-4 border-b border-paper/15 p-5">
          <div>
            <DialogTitle className="font-serif text-2xl font-bold text-paper">Compare units</DialogTitle>
            <DialogDescription className="mt-1 text-[.92rem] text-paper/75">Only figures the manufacturer publishes are shown.</DialogDescription>
          </div>
          <button type="button" aria-label="Close comparison" onClick={() => onOpenChange(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/25 hover:border-gold hover:text-gold"><X size={18} /></button>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[.92rem]">
            <thead>
              <tr>
                <th className="sticky left-0 w-36 bg-[#161416] p-4" scope="col"><span className="sr-only">Feature</span></th>
                {products.map(p => (
                  <th key={p.id} scope="col" className="p-4 align-top">
                    <div className="aspect-[4/3] w-full max-w-[220px] bg-[#f4f1ea]">
                      {p.images.hero && <SafeImg src={p.images.hero.src} alt="" className="h-full w-full object-contain p-2" />}
                    </div>
                    <p className="mt-3 text-[.72rem] font-bold uppercase tracking-[.12em] text-gold">{brandName(p)}</p>
                    <p className="font-serif text-lg font-bold leading-snug">{p.name}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="btn-ember btn-ember-sm" onClick={() => onChoose(p)}>Build this one</button>
                      <button type="button" className="bmf-chip" onClick={() => onRemove(p)}>Remove</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.label} className="border-t border-paper/12">
                  <th scope="row" className="sticky left-0 bg-[#161416] p-4 align-top text-[.78rem] font-bold uppercase tracking-[.08em] text-paper/75">{r.label}</th>
                  {products.map(p => <td key={p.id} className="p-4 align-top">{r.cell(p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
