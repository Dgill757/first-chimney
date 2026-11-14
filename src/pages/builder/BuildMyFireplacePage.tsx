/**
 * /build-my-fireplace. Lazy-loaded as one chunk with its styles, so none of it
 * weighs on the entry bundle. The page is dark and ember-lit on purpose: it is
 * the one place on the site where the product is the fire.
 */
import { Fragment, useEffect } from "react";
import { Check, Phone } from "lucide-react";
import "@/styles/build.css";
import { BUSINESS } from "@/data/siteData";
import { STEPS, useBuildState, type BuildApi, type StepId } from "./useBuild";
import StartStep, { StartHero } from "./StartStep";
import ChooseStep from "./ChooseStep";
import CustomizeStep from "./CustomizeStep";
import SummaryStep from "./SummaryStep";
import { SkeletonGrid } from "./ui";

function Progress({ api }: { api: BuildApi }) {
  const reached = (id: StepId) => {
    if (id === "start") return true;
    if (id === "choose") return !!api.build.install && !!api.build.fuel || !!api.build.productId;
    return !!api.product;
  };
  const index = STEPS.findIndex(s => s.id === api.step);
  return (
    <nav aria-label="Build progress" className="bmf-noprint z-30 border-b border-paper/10 bg-[#131214]/90 backdrop-blur-md sticky top-[4.25rem] lg:top-[4.75rem]">
      <ol className="container flex min-h-[3.75rem] items-center gap-1 overflow-x-auto py-2 sm:gap-2">
        {STEPS.map((s, i) => {
          const current = s.id === api.step;
          const done = i < index;
          const enabled = reached(s.id);
          return (
            <Fragment key={s.id}>
              {i > 0 && <li aria-hidden="true" className={`h-px w-4 shrink-0 sm:w-8 ${i <= index ? "bg-gold" : "bg-paper/20"}`} />}
              <li className="shrink-0">
                <button type="button" disabled={!enabled} aria-current={current ? "step" : undefined} onClick={() => api.setStep(s.id)}
                  className={`flex min-h-[2.75rem] items-center gap-2 rounded-full px-3 text-[.76rem] font-bold uppercase tracking-[.08em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${current ? "bg-paper text-ink" : "text-paper/85 hover:text-gold"}`}>
                  <span aria-hidden="true" className={`grid h-6 w-6 place-items-center rounded-full text-[.7rem] ${current ? "bg-ink text-paper" : done ? "bg-gold text-ink" : "border border-paper/35"}`}>{done ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                  {/* On a phone only the current step keeps its label, so all four fit without scrolling. */}
                  <span className={current ? "" : "sr-only sm:not-sr-only"}>{s.label}</span>
                </button>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * What shows while the catalog loads. A fresh visit gets the real hero straight
 * away (it needs no data), inside a progress bar of the final height, so when the
 * catalog arrives nothing above the fold moves. A shared deep link, which will
 * land on a different step, gets a plain skeleton instead of a hero it will not show.
 */
function LoadingShell() {
  const q = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const fresh = !q.get("p") && (!q.get("step") || q.get("step") === "start");
  return (
    <div aria-busy="true">
      <div className="z-30 h-[3.75rem] border-b border-paper/10 bg-[#131214]/90 sticky top-[4.25rem] lg:top-[4.75rem]" aria-hidden="true" />
      {fresh ? (
        <>
          <StartHero onStart={() => undefined} />
          <div className="container pb-24"><SkeletonGrid count={3} /></div>
        </>
      ) : (
        <div className="container py-16">
          <div className="bmf-skeleton mb-8 h-14 w-2/3 max-w-xl" />
          <div className="bmf-skeleton mb-12 h-6 w-1/2 max-w-md" />
          <SkeletonGrid count={3} />
        </div>
      )}
    </div>
  );
}

export default function BuildMyFireplacePage() {
  const state = useBuildState();

  // Moving between steps should land the reader at the top of the new step.
  useEffect(() => { if (state.status === "ready") window.scrollTo({ top: 0, behavior: "auto" }); }, [state.status === "ready" ? state.step : null]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bmf min-h-[100dvh] pt-[6.75rem] lg:pt-[7.25rem]">
      {state.status === "loading" && <LoadingShell />}

      {state.status === "error" && (
        <div className="container grid min-h-[60dvh] place-items-center py-16 text-center" role="alert">
          <div>
            <h1 className="font-serif text-3xl font-bold">The builder did not load.</h1>
            <p className="mx-auto mt-3 max-w-md text-paper/80">That is on us. Check your connection and try again, or call and we will walk you through it.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn-ember" onClick={state.retry}>Try again</button>
              <a className="btn-ghost-ember" href={BUSINESS.phoneHref}><Phone size={16} /> {BUSINESS.phone}</a>
            </div>
          </div>
        </div>
      )}

      {state.status === "ready" && (() => {
        const api: BuildApi = state;
        // Guard steps that need a model, so a stale link can never render a blank page.
        const needsProduct = api.step === "customize" || api.step === "build";
        const step: StepId = needsProduct && !api.product ? "choose" : api.step;
        return (
          <>
            <Progress api={api} />
            {step === "start" && <StartStep api={api} />}
            {step === "choose" && <ChooseStep api={api} />}
            {step === "customize" && api.product && <CustomizeStep api={api} product={api.product} />}
            {step === "build" && api.product && <SummaryStep api={api} product={api.product} />}
          </>
        );
      })()}
    </div>
  );
}
