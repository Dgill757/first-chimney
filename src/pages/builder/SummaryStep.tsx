import { useId, useState, type FormEvent } from "react";
import { FileDown, ArrowLeft, Check, CalendarDays, Copy, LoaderCircle, Mail, Phone, Printer, RotateCcw, Send } from "lucide-react";
import { toast } from "@/lib/toast";
import { BUSINESS } from "@/data/siteData";
import { trpc } from "@/lib/trpc";
import { BookNow } from "@/components/BookNow";
import { FUEL_LABEL, KIND_LABEL, type Product } from "@/data/catalog";
import { assessSize } from "@/data/catalog/heat";
import { checkFit, formatInches } from "@/data/catalog/fit";
import { previewLayers, selectedOptions } from "@/data/catalog/select";
import { buildBuildPdf, buildRef, downloadBlob } from "@/lib/designPdf";
import { buildSummaryText, installNotes } from "@/data/catalog/summary";
import type { BuildApi } from "./useBuild";
import PreviewStage from "./PreviewStage";

type Sent = "idle" | "sent" | "failed";

function SendForm({ api, product, summary, onSent }: { api: BuildApi; product: Product; summary: string; onSent?: (firstName: string) => void }) {
  const uid = useId();
  const submit = trpc.leads.submit.useMutation();
  const [v, setV] = useState({ firstName: "", phone: "", email: "", notes: "", consent: false });
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<Sent>("idle");
  const errors = {
    firstName: !v.firstName.trim() ? "Tell us your first name." : "",
    phone: v.phone.replace(/\D/g, "").length < 7 ? "Add a phone number we can reach you at." : "",
    email: v.email && !/^\S+@\S+\.\S+$/.test(v.email) ? "That email does not look right." : "",
    consent: !v.consent ? "Please tick the box so we can contact you." : "",
  };
  const valid = !Object.values(errors).some(Boolean);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV(s => ({ ...s, [k]: k === "consent" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const mailto = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`My build: ${product.name}`)}&body=${encodeURIComponent(`${summary}\n\n${v.notes ? `Notes: ${v.notes}\n` : ""}Name: ${v.firstName}\nPhone: ${v.phone}`)}`;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    try {
      await submit.mutateAsync({
        firstName: v.firstName.trim(), phone: v.phone.trim(), email: v.email.trim() || undefined,
        serviceCategory: "Fireplace build", serviceRequested: `${product.name} (${FUEL_LABEL[product.fuel]} ${KIND_LABEL[product.kind].toLowerCase()})`,
        projectDescription: `${v.notes ? `${v.notes.trim()}\n\n` : ""}${summary}`.slice(0, 4900),
        leadSource: "build-my-fireplace", landingPage: window.location.pathname, referrer: document.referrer || undefined,
        preferredContactMethod: "either", consent: v.consent,
      });
      setState("sent");
      onSent?.(v.firstName.trim());
    } catch {
      // The backend is not wired everywhere yet. The build is saved in this
      // browser and in the link, so nothing is lost: offer email and phone.
      setState("failed");
    }
  };

  if (state === "sent") {
    return (
      <div className="bmf-card bmf-rise p-6" role="status">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-ink"><Check size={22} strokeWidth={3} /></span>
        <h3 className="mt-4 font-serif text-2xl font-bold">We have your build.</h3>
        <p className="mt-2 text-paper/80">Andrew will look it over and reach out about the next step, usually a visit to measure. Your build stays saved here if you want to keep tweaking it.</p>
        <div className="mt-5 flex flex-wrap gap-3"><BookNow className="btn-ember" label="Book a visit (opens in a new tab)">Book a visit <CalendarDays size={16} /></BookNow><a className="btn-ghost-ember" href={BUSINESS.phoneHref}><Phone size={16} /> {BUSINESS.phone}</a></div>
      </div>
    );
  }

  const field = (k: "firstName" | "phone" | "email", label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="bmf-label" htmlFor={`${uid}-${k}`}>{label}</label>
      <input id={`${uid}-${k}`} className="bmf-input" value={v[k]} onChange={set(k)} aria-invalid={touched && !!errors[k]} aria-describedby={touched && errors[k] ? `${uid}-${k}-e` : undefined} {...props} />
      {touched && errors[k] && <p id={`${uid}-${k}-e`} className="bmf-error">{errors[k]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="bmf-card grid gap-4 p-5 sm:p-6">
      <div>
        <h3 className="font-serif text-2xl font-bold">Send this build to First Chimney</h3>
        <p className="mt-1 text-[.95rem] text-paper/75">We get the exact build below and your branded PDF downloads. No price is promised until we have measured.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("firstName", "First name", { autoComplete: "given-name" })}
        {field("phone", "Phone", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
      </div>
      {field("email", "Email (optional)", { type: "email", autoComplete: "email" })}
      <div>
        <label className="bmf-label" htmlFor={`${uid}-notes`}>Anything we should know?</label>
        <textarea id={`${uid}-notes`} className="bmf-input min-h-24" value={v.notes} onChange={set("notes")} placeholder="The room, the existing fireplace, your timeline" />
      </div>
      <div>
        <label className="flex min-h-[2.75rem] cursor-pointer items-start gap-3 text-[.9rem] leading-relaxed text-paper/85">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#e6a13a]" checked={v.consent} onChange={set("consent")} aria-invalid={touched && !!errors.consent} />
          <span>I agree that First Chimney Contracting may contact me by phone, text or email about this request.</span>
        </label>
        {touched && errors.consent && <p className="bmf-error">{errors.consent}</p>}
      </div>

      {state === "failed" && (
        <div role="alert" className="rounded-xl border border-[#ffb4a3]/50 bg-[#ffb4a3]/10 p-4 text-[.92rem]">
          <p className="font-semibold">We could not send that just now.</p>
          <p className="mt-1 text-paper/85">Your build is saved. Email it to us instead, or call and read us the link.</p>
          <div className="mt-3 flex flex-wrap gap-3"><a className="btn-ghost-ember" href={mailto}><Mail size={16} /> Email my build</a><a className="btn-ghost-ember" href={BUSINESS.phoneHref}><Phone size={16} /> Call {BUSINESS.phone}</a></div>
        </div>
      )}

      <button type="submit" className="btn-ember w-full sm:w-auto sm:justify-self-start" disabled={submit.isPending}>
        {submit.isPending ? <><LoaderCircle size={17} className="animate-spin" /> Sending</> : <><Send size={16} /> Send my build + get the PDF</>}
      </button>
    </form>
  );
}

export default function SummaryStep({ api, product }: { api: BuildApi; product: Product }) {
  const { build, need } = api;
  const brand = api.catalog.brands.find(b => b.id === product.brandId);
  const brandName = [brand?.name, ...(product.altBrandIds ?? []).map(id => api.catalog.brands.find(b => b.id === id)?.name)].filter(Boolean).join(" / ");
  const chosen = selectedOptions(product, build.picks);
  const size = need ? assessSize(need, product.heat ?? {}) : undefined;
  const fit = build.opening && product.kind === "insert" ? checkFit(product.fit, build.opening) : undefined;
  const summary = buildSummaryText(product, build, brandName);
  const topSpecs = product.specs.slice(0, 10);

  const [pdfBusy, setPdfBusy] = useState(false);
  const makePdf = async (forName?: string) => {
    setPdfBusy(true);
    try {
      const layers = product.preview ? previewLayers(product, build.picks) : product.images.hero ? [product.images.hero.src] : [];
      const blob = await buildBuildPdf({
        brandName,
        productName: product.name,
        subtitle: `${FUEL_LABEL[product.fuel]} ${KIND_LABEL[product.kind].toLowerCase()}${product.sku ? `, ${product.sku}` : ""}`,
        layers,
        options: chosen.map(({ group, option }) => [group.label, option.name] as [string, string]),
        specs: topSpecs.slice(0, 7).map(s => [s.label, s.value] as [string, string]),
        notes: installNotes(product),
        shareUrl: api.shareUrl(),
        forName,
      });
      downloadBlob(blob, `First-Chimney-Build-${buildRef(api.shareUrl())}.pdf`);
    } catch {
      toast.error("The PDF could not be created. Use Copy link to save your build.");
    } finally {
      setPdfBusy(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(api.shareUrl()); toast.success("Link copied. Anyone with it sees this build."); }
    catch { toast.error("Could not copy. Select the address bar and copy it from there."); }
  };

  return (
    <div className="container pb-24 pt-6">
      <button type="button" onClick={() => api.setStep("customize")} className="bmf-noprint inline-flex min-h-[2.75rem] items-center gap-2 text-[.82rem] font-bold uppercase tracking-[.1em] text-paper/80 hover:text-gold"><ArrowLeft size={16} /> Keep customizing</button>
      <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Your build</h1>
      <p className="mt-2 max-w-2xl text-paper/75">Here is everything you picked, what it means for the install and a way to send it to us.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="grid content-start gap-6">
          <PreviewStage product={product} picks={build.picks} />
          <div className="bmf-noprint flex flex-wrap gap-3">
            <button type="button" className="btn-ghost-ember" onClick={copy}><Copy size={16} /> Copy link</button>
            <button type="button" className="btn-ember" onClick={() => makePdf()} disabled={pdfBusy}>{pdfBusy ? <LoaderCircle size={16} className="animate-spin" /> : <FileDown size={16} />} Download branded PDF</button>
            <button type="button" className="btn-ghost-ember" onClick={() => window.print()}><Printer size={16} /> Print</button>
            <button type="button" className="btn-ghost-ember" onClick={() => { if (window.confirm("Start over and clear this build?")) api.reset(); }}><RotateCcw size={16} /> Start over</button>
          </div>
        </div>

        <div className="grid content-start gap-6">
          <section className="bmf-card p-5 sm:p-6">
            <p className="text-[.76rem] font-bold uppercase tracking-[.12em] text-gold">{brandName}</p>
            <h2 className="font-serif text-2xl font-bold">{product.name}</h2>
            <p className="text-[.85rem] font-semibold uppercase tracking-[.08em] text-paper/70">{FUEL_LABEL[product.fuel]} {KIND_LABEL[product.kind].toLowerCase()}{product.sku ? `, ${product.sku}` : ""}</p>
            {chosen.length > 0 && (
              <ul className="mt-5 grid gap-2 text-[.92rem]">
                {chosen.map(({ group, option }) => <li key={option.id} className="flex justify-between gap-4 border-b border-paper/10 pb-2"><span className="text-paper/70">{group.label}</span><span className="text-right font-semibold">{option.name}{option.part && <span className="block text-[.74rem] font-normal text-paper/60">Part {option.part}</span>}</span></li>)}
              </ul>
            )}
            {(size || fit) && (
              <div className="mt-5 grid gap-2 text-[.9rem] text-paper/85">
                {size && <p>{size.message}</p>}
                {fit && <p>{fit.message}{fit.surround ? ` Covers with the ${fit.surround.name.toLowerCase()} (${formatInches(fit.surround.width)} by ${formatInches(fit.surround.height)}).` : ""}</p>}
              </div>
            )}
          </section>

          {topSpecs.length > 0 && (
            <section className="bmf-card p-5 sm:p-6">
              <h2 className="font-serif text-xl font-bold">Specs from the maker</h2>
              <dl className="mt-4 grid gap-x-6 gap-y-3 text-[.9rem] sm:grid-cols-2">
                {topSpecs.map(s => <div key={s.label}><dt className="text-paper/65">{s.label}</dt><dd className="font-semibold">{s.value}</dd></div>)}
              </dl>
            </section>
          )}

          <section className="bmf-card p-5 sm:p-6">
            <h2 className="font-serif text-xl font-bold">What we check on the visit</h2>
            <ul className="mt-4 grid gap-3 text-[.93rem] leading-relaxed text-paper/85">
              {installNotes(product).map(n => <li key={n} className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-gold" /><span>{n}</span></li>)}
            </ul>
            <p className="mt-4 text-[.84rem] text-paper/65">No prices are shown online. Gas appliances need a measure, a gas line and a venting review before anyone can quote them honestly.</p>
          </section>

          <div className="bmf-noprint grid gap-6">
            <SendForm api={api} product={product} summary={summary} onSent={(name) => void makePdf(name)} />
            <div className="flex flex-wrap items-center gap-3">
              <BookNow className="btn-ember" label="Book a visit (opens in a new tab)">Book a visit <CalendarDays size={16} /></BookNow>
              <a className="btn-ghost-ember" href={BUSINESS.phoneHref}><Phone size={16} /> {BUSINESS.phone}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bmf-print-only mt-8">
        <p>First Chimney Contracting, {BUSINESS.phone}, {BUSINESS.email}</p>
        <p>Share this build: {api.shareUrl()}</p>
      </div>
    </div>
  );
}
