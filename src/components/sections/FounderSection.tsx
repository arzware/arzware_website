"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbParallax, mbSectionIntro } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

export function FounderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => setPhase("founder"),
        onEnterBack: () => setPhase("founder"),
      });

      mbSectionIntro(sectionRef.current!.querySelector(".founder-copy")!, reducedMotion);

      if (reducedMotion) return;

      if (imageRef.current) {
        mbParallax(sectionRef.current!, imageRef.current, -12, reducedMotion);
        gsap.fromTo(
          imageRef.current,
          { scale: 1.08 },
          {
            scale: 1,
            ease: MB.easeScroll,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: MB.scrub,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setPhase]);

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="section-pad overflow-hidden"
      aria-label="Founder vision"
    >
      <div className="mx-auto grid max-w-[1600px] items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div
          ref={imageRef}
          className="relative aspect-[4/5] overflow-hidden bg-surface-secondary will-change-transform"
        >
          <Image
            src="/arzware_mascot_.png"
            alt="Arzware founder vision"
            fill
            className="object-cover object-center opacity-80 grayscale-[30%]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="founder-copy">
          <div className="mb-line mb-6 overflow-hidden">
            <p className="mb-intro-label section-label">Vision</p>
          </div>
          <h2 className="headline-editorial text-balance">
            <MaskLines text="Building the next generation software modernization studio" />
          </h2>
          <p className="mb-intro-body body-large mt-8 opacity-0">
            Arzware exists because most businesses don&apos;t need another
            website — they need the right first system. One that captures
            requests, follows up automatically, shows the truth clearly, and
            gives teams back their focus.
          </p>
          <p className="body-large mt-6">
            We combine strategy, design, engineering, and AI-assisted workflows
            from the first conversation — operating with the precision of
            software, not the chaos of traditional agencies.
          </p>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            — Arzware Studio
          </p>
        </div>
      </div>
    </section>
  );
}
