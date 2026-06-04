"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbSectionIntro } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

const OS_MODULES = [
  { name: "Lead Research", status: "active" },
  { name: "Business Analysis", status: "active" },
  { name: "Prototype Generation", status: "processing" },
  { name: "Project Planning", status: "active" },
  { name: "Development", status: "active" },
  { name: "QA", status: "standby" },
  { name: "Deployment", status: "standby" },
  { name: "Continuous Improvement", status: "active" },
];

export function OperatingSystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => setPhase("os"),
        onEnterBack: () => setPhase("os"),
      });

      mbSectionIntro(sectionRef.current!.querySelector(".os-header")!, reducedMotion);

      if (reducedMotion) return;

      gsap.fromTo(
        ".os-module",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: MB.easeScroll,
          scrollTrigger: {
            trigger: ".os-grid",
            start: "top 80%",
            end: "top 30%",
            scrub: MB.scrub,
          },
        }
      );

      gsap.fromTo(
        ".os-pulse",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: MB.easeScroll,
          scrollTrigger: {
            trigger: ".os-header",
            start: "top 75%",
            end: "top 40%",
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
      id="operating-system"
      className="section-pad bg-surface/50"
      aria-label="The Arzware operating system"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="os-header mb-16">
          <div className="mb-line mb-6 overflow-hidden">
            <p className="mb-intro-label section-label">Internal Machine</p>
          </div>
          <h2 className="headline-editorial max-w-[16ch] text-balance">
            <MaskLines text="The Arzware Operating System" />
          </h2>
          <p className="mb-intro-body body-large mt-8 max-w-[48ch] opacity-0">
            We operate as software — every engagement runs through an
            intelligent pipeline designed for precision delivery.
          </p>
          <div className="os-pulse mt-8 h-px w-full max-w-md origin-left bg-gradient-to-r from-accent/60 to-transparent" />
        </div>

        <div className="os-grid grid gap-px bg-white/5 md:grid-cols-2 lg:grid-cols-4">
          {OS_MODULES.map((mod) => (
            <div
              key={mod.name}
              className="os-module group bg-background p-8 opacity-0 transition-colors duration-[800ms] hover:bg-surface-secondary"
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    mod.status === "active"
                      ? "bg-accent shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                      : mod.status === "processing"
                        ? "animate-pulse bg-accent-light"
                        : "bg-muted/40"
                  }`}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
                  {mod.status}
                </span>
              </div>
              <h3 className="font-display text-[clamp(1.125rem,2vw,1.5rem)] font-light tracking-[-0.01em] text-foreground transition-colors duration-[800ms] group-hover:text-accent-light">
                {mod.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
