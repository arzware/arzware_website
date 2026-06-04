"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbSectionIntro } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  { step: "01", name: "Audit", detail: "Map leaks in time, trust, and data." },
  { step: "02", name: "Research", detail: "Understand workflows before interfaces." },
  { step: "03", name: "Prototype", detail: "Validate direction with working models." },
  { step: "04", name: "Architecture", detail: "Design systems that scale in stages." },
  { step: "05", name: "Development", detail: "Engineer with precision and restraint." },
  { step: "06", name: "Deployment", detail: "Launch with zero-drama reliability." },
  { step: "07", name: "Optimization", detail: "Refine based on real operational data." },
];

export function HowWeWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => setPhase("process"),
        onEnterBack: () => setPhase("process"),
      });

      mbSectionIntro(sectionRef.current!.querySelector(".process-intro")!, reducedMotion);

      if (reducedMotion) return;

      gsap.fromTo(
        ".process-stage",
        { opacity: 0, x: -50, y: 20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          ease: MB.easeScroll,
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".process-track",
            start: "top 80%",
            end: "bottom 25%",
            scrub: MB.scrub,
          },
        }
      );

      gsap.fromTo(
        ".process-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: MB.easeScroll,
          scrollTrigger: {
            trigger: ".process-track",
            start: "top 75%",
            end: "bottom 20%",
            scrub: MB.scrubLight,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setPhase]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-pad"
      aria-label="How we work"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="process-intro mb-20 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-line mb-6 overflow-hidden">
              <p className="mb-intro-label section-label">Methodology</p>
            </div>
            <h2 className="headline-editorial text-balance">
              <MaskLines text="Precision at every stage" />
            </h2>
          </div>
          <p className="mb-intro-body body-large self-end max-w-[42ch] opacity-0">
            Not marketing theater — a deliberate engineering process designed
            to deliver systems your team can operate from day one.
          </p>
        </div>

        <div className="process-track relative">
          <div className="process-line absolute bottom-0 left-[19px] top-0 w-px origin-top bg-gradient-to-b from-accent/40 via-accent/20 to-transparent lg:left-[23px]" />

          <div className="space-y-0">
            {STAGES.map((stage) => (
              <div
                key={stage.step}
                className="process-stage group grid grid-cols-[48px_1fr] gap-8 border-t border-white/5 py-10 opacity-0 lg:grid-cols-[56px_1fr_1fr] lg:gap-12"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  {stage.step}
                </span>
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-light tracking-[-0.02em] text-foreground transition-colors duration-[800ms] group-hover:text-accent-light">
                  {stage.name}
                </h3>
                <p className="body-large col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1">
                  {stage.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
