"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbPinnedTimeline } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

export function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCtaProgress = useScrollStore((s) => s.setCtaProgress);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        onEnter: () => setPhase("cta"),
        onEnterBack: () => setPhase("cta"),
      });

      if (reducedMotion) {
        setCtaProgress(1);
        return;
      }

      const tl = mbPinnedTimeline(
        sectionRef.current!,
        "+=100%",
        (p) => setCtaProgress(p)
      );

      tl.fromTo(
        ".mb-line-inner",
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.06, ease: MB.easeScroll, duration: 0.4 },
        0
      )
        .fromTo(
          ".cta-button",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, ease: MB.easeScroll, duration: 0.3 },
          0.35
        )
        .fromTo(
          ".cta-inner",
          { scale: 1.05 },
          { scale: 1, ease: MB.easeScroll, duration: 0.5 },
          0
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setCtaProgress, setPhase]);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative flex min-h-[100dvh] items-center justify-center"
      aria-label="Get started"
    >
      <div className="cta-inner relative z-10 mx-auto max-w-[1600px] px-[clamp(1.25rem,4vw,4rem)] text-center">
        <div className="mb-line mb-8 overflow-hidden">
          <p className="mb-intro-label section-label">Begin</p>
        </div>
        <h2 className="cta-headline headline-display mx-auto max-w-[14ch] text-balance">
          <MaskLines text="Ready To Modernize Your Business?" />
        </h2>
        <div className="cta-button mt-14 opacity-0">
          <Link
            href="mailto:arzware.lb@gmail.com"
            className="luxury-button mb-btn px-12 py-5"
          >
            <span className="relative z-10">Start Your Transformation</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-[clamp(1.25rem,4vw,4rem)] py-10">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <strong className="font-mono text-[11px] tracking-[0.32em]">
          ARZWARE
        </strong>
        <span className="font-mono text-[10px] tracking-[0.15em] text-muted">
          Software Modernization Studio · © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
