"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbPinnedTimeline, mbSectionIntro } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

const CHAOS_WORDS = [
  "Spreadsheets",
  "WhatsApp",
  "Manual Processes",
  "Disconnected Systems",
  "Data Silos",
  "Repeated Work",
];

const SYSTEM_WORDS = [
  "Dashboards",
  "Automation",
  "Workflows",
  "Reporting",
  "AI Assistance",
  "Visibility",
];

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setProblemProgress = useScrollStore((s) => s.setProblemProgress);
  const setCoreEvolution = useScrollStore((s) => s.setCoreEvolution);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => setPhase("problem"),
        onEnterBack: () => setPhase("problem"),
      });

      mbSectionIntro(sectionRef.current!, reducedMotion);

      if (reducedMotion) {
        setCoreEvolution(1);
        return;
      }

      const tl = mbPinnedTimeline(
        sectionRef.current!,
        MB.pinLong,
        (p) => {
          setProblemProgress(p);
          setCoreEvolution(p);
        }
      );

      // Mercedes crossfade — clean opacity + vertical drift, no blur
      tl.fromTo(
        ".chaos-word",
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, stagger: 0.07, ease: MB.easeScroll, duration: 0.35 },
        0
      )
        .to(
          ".chaos-word",
          {
            opacity: 0,
            y: -40,
            stagger: 0.05,
            ease: MB.easeScroll,
            duration: 0.3,
          },
          0.42
        )
        .fromTo(
          ".system-word",
          { opacity: 0, y: 56, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.07,
            ease: MB.easeScroll,
            duration: 0.4,
          },
          0.48
        )
        .fromTo(
          ".problem-statement",
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, ease: MB.easeScroll, duration: 0.35 },
          0.72
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setProblemProgress, setCoreEvolution, setPhase]);

  return (
    <section
      ref={sectionRef}
      id="problem"
      className="relative min-h-[100dvh]"
      aria-label="The transformation narrative"
    >
      <div className="flex min-h-[100dvh] items-center">
        <div className="mx-auto w-full max-w-[1600px] px-[clamp(1.25rem,4vw,4rem)]">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <div className="mb-line mb-6 overflow-hidden">
                <p className="mb-intro-label section-label">The Problem</p>
              </div>
              <h2 className="headline-editorial text-balance">
                <MaskLines text="From operational chaos to intelligent systems" />
              </h2>
              <p className="problem-statement body-large mt-8 max-w-[42ch] opacity-0">
                Every outdated process costs clarity. We replace fragmentation
                with connected infrastructure that scales with your business.
              </p>
            </div>

            <div className="relative min-h-[320px]">
              <div className="absolute inset-0 flex flex-wrap content-center gap-x-6 gap-y-4 lg:gap-x-8 lg:gap-y-6">
                {CHAOS_WORDS.map((word) => (
                  <span
                    key={word}
                    className="chaos-word font-display text-[clamp(1.25rem,2.5vw,2rem)] font-light tracking-[-0.02em] text-muted/80"
                  >
                    {word}
                  </span>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-wrap content-center gap-x-6 gap-y-4 lg:gap-x-8 lg:gap-y-6">
                {SYSTEM_WORDS.map((word) => (
                  <span
                    key={word}
                    className="system-word font-display text-[clamp(1.25rem,2.5vw,2rem)] font-light tracking-[-0.02em] text-accent opacity-0"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
