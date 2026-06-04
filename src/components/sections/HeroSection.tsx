"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { DURATION, HERO_SEQUENCE, STAGGER } from "@/lib/motion/constants";
import { MB, mbHeroScrollOut, mbLoadReveal } from "@/lib/motion/mercedes";
import { MaskWords } from "@/components/motion/MaskReveal";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setPhase("hero");
  }, [setPhase]);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (reducedMotion) {
      gsap.set(sectionRef.current.querySelectorAll(".mb-line-inner, .hero-sub, .hero-cta"), {
        yPercent: 0,
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const scope = sectionRef.current!;

      // Initial state — black frame
      gsap.set(".hero-curtain", { opacity: 1 });
      gsap.set(".hero-ambient", { opacity: 0, scale: 1.08 });
      gsap.set(".mb-line-inner", { yPercent: 110 });
      gsap.set(".hero-sub", { opacity: 0, y: 32 });
      gsap.set(".hero-cta", { opacity: 0, y: 24 });
      gsap.set(".hero-scroll-hint", { opacity: 0, y: 16 });
      gsap.set(".mb-intro-label", { yPercent: 100, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: MB.easeStrong } });

      // Curtain lift — Mercedes slow reveal from black
      tl.to(".hero-curtain", { opacity: 0, duration: 1.8, ease: MB.ease }, HERO_SEQUENCE.ambientLight);

      tl.to(
        ".hero-ambient",
        { opacity: 1, scale: 1, duration: DURATION.cinematic, ease: MB.easeStrong },
        HERO_SEQUENCE.ambientLight
      );

      tl.to(
        ".mb-intro-label",
        { yPercent: 0, opacity: 1, duration: DURATION.medium, ease: MB.easeStrong },
        HERO_SEQUENCE.digitalCore
      );

      tl.to(
        ".mb-line-inner",
        { yPercent: 0, duration: DURATION.cinematic, stagger: STAGGER.tight, ease: MB.easeStrong },
        HERO_SEQUENCE.headline
      );

      tl.to(
        ".hero-sub",
        { opacity: 1, y: 0, duration: DURATION.medium, ease: MB.ease },
        HERO_SEQUENCE.subheadline
      );

      tl.to(
        ".hero-cta",
        { opacity: 1, y: 0, duration: DURATION.fast, ease: MB.ease },
        HERO_SEQUENCE.cta
      );

      tl.to(
        ".hero-scroll-hint",
        { opacity: 1, y: 0, duration: DURATION.medium, ease: MB.ease },
        HERO_SEQUENCE.cta + 0.5
      );

      mbLoadReveal(scope, ".hero-inner", 0.2);
      mbHeroScrollOut(scope, reducedMotion);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const headline =
    "Transforming Outdated Operations Into Intelligent Systems";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] items-end pb-[clamp(3rem,8vh,6rem)] pt-32"
      aria-label="Introduction"
    >
      {/* Black curtain — Mercedes opening frame */}
      <div className="hero-curtain pointer-events-none absolute inset-0 z-20 bg-background" />

      <div className="hero-ambient pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(212,175,55,0.05)_0%,transparent_60%)]" />

      <div className="hero-inner relative z-10 mx-auto w-full max-w-[1600px] px-[clamp(1.25rem,4vw,4rem)]">
        <div className="mb-line mb-8 overflow-hidden">
          <p className="mb-intro-label section-label">Software Modernization Studio</p>
        </div>

        <h1 className="hero-headline headline-display max-w-[14ch] text-balance">
          <MaskWords text={headline} />
        </h1>

        <p className="hero-sub body-large mt-8 max-w-[52ch]">
          Software. Automation. Business Systems. AI-Native Solutions.
        </p>

        <div className="hero-cta mt-12">
          <Link href="#cta" className="luxury-button mb-btn">
            <span className="relative z-10">Start Your Transformation</span>
          </Link>
        </div>
      </div>

      <div className="hero-scroll-hint absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
          Scroll to explore
        </span>
        <div className="mb-scroll-line h-14 w-px bg-gradient-to-b from-accent/70 to-transparent" />
      </div>
    </section>
  );
}
