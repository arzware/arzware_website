"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbHorizontalChapter, mbSectionIntro } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

const CASES = [
  {
    id: "leadops",
    client: "LeadOps",
    industry: "Sales Operations",
    problem:
      "Scattered client requests across WhatsApp, spreadsheets, and memory — no pipeline visibility.",
    transformation:
      "Unified website funnel, CRM-lite dashboard, automated follow-ups, and weekly AI summaries.",
    outcome: "3× clearer follow-up without adding admin overhead.",
    metric: "3×",
  },
  {
    id: "flowdesk",
    client: "FlowDesk",
    industry: "Professional Services",
    problem:
      "Manual invoicing, disconnected project tracking, and zero reporting infrastructure.",
    transformation:
      "Integrated client portal, automated billing workflows, and real-time operational dashboard.",
    outcome: "62% reduction in manual administration time.",
    metric: "62%",
  },
  {
    id: "inventory",
    client: "StockLine",
    industry: "Retail & Inventory",
    problem:
      "Inventory managed in spreadsheets with no sync between sales, stock, and finance.",
    transformation:
      "Connected inventory system with automated reorder triggers and live financial reporting.",
    outcome: "Real-time visibility across all operational nodes.",
    metric: "100%",
  },
];

export function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        onEnter: () => setPhase("cases"),
        onEnterBack: () => setPhase("cases"),
      });

      if (reducedMotion) return;

      mbHorizontalChapter(sectionRef.current!, trackRef.current!, reducedMotion);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setPhase]);

  return (
    <section
      ref={sectionRef}
      id="cases"
      className="relative overflow-hidden"
      aria-label="Case studies"
    >
      <div className="section-pad pb-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-line mb-6 overflow-hidden">
            <p className="mb-intro-label section-label">Evolution Stories</p>
          </div>
          <h2 className="headline-editorial max-w-[12ch] text-balance">
            <MaskLines text="Business transformation in motion" />
          </h2>
        </div>
      </div>

      <div ref={trackRef} className="flex w-max gap-0 px-[clamp(1.25rem,4vw,4rem)]">
        {CASES.map((study, i) => (
          <article
            key={study.id}
            className="case-panel flex w-[min(85vw,720px)] shrink-0 flex-col justify-between border-r border-white/5 px-[clamp(2rem,5vw,5rem)] py-16 lg:w-[720px]"
            aria-label={`Case study: ${study.client}`}
          >
            <div>
              <div className="mb-12 flex items-baseline justify-between">
                <span className="font-mono text-[11px] tracking-[0.25em] text-muted">
                  {String(i + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  {study.industry}
                </span>
              </div>

              <h3 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light tracking-[-0.03em]">
                {study.client}
              </h3>
            </div>

            <div className="mt-16 space-y-12">
              <div>
                <p className="section-label mb-3">Problem</p>
                <p className="text-[clamp(1rem,1.3vw,1.125rem)] leading-[1.7] text-muted">
                  {study.problem}
                </p>
              </div>
              <div>
                <p className="section-label mb-3">Transformation</p>
                <p className="text-[clamp(1rem,1.3vw,1.125rem)] leading-[1.7] text-foreground/90">
                  {study.transformation}
                </p>
              </div>
              <div className="flex items-end justify-between border-t border-white/5 pt-8">
                <div>
                  <p className="section-label mb-3">Outcome</p>
                  <p className="text-[clamp(1rem,1.3vw,1.125rem)] text-accent">
                    {study.outcome}
                  </p>
                </div>
                <span className="font-display text-[clamp(3rem,6vw,5rem)] font-light leading-none text-accent/30">
                  {study.metric}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
