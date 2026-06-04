"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB } from "@/lib/motion/mercedes";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  { value: 200, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Businesses Modernized" },
  { value: 99, suffix: "%", label: "Deployment Success" },
];

function ScrubCounter({
  target,
  suffix,
  progress,
}: {
  target: number;
  suffix: string;
  progress: number;
}) {
  const display = Math.round(target * progress);
  return (
    <span className="metric-value font-display text-[clamp(4rem,10vw,8rem)] font-light leading-none tracking-[-0.04em] text-foreground">
      {display}
      {suffix}
    </span>
  );
}

export function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrubProgress, setScrubProgress] = useState(0);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => setPhase("metrics"),
        onEnterBack: () => setPhase("metrics"),
      });

      if (reducedMotion) {
        setScrubProgress(1);
        return;
      }

      gsap.fromTo(
        ".metric-block",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: MB.easeScroll,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 25%",
            scrub: MB.scrub,
          },
        }
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "top 20%",
        scrub: MB.scrub,
        onUpdate: (self) => setScrubProgress(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setPhase]);

  return (
    <section
      ref={sectionRef}
      id="metrics"
      className="section-pad"
      aria-label="Key metrics"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-line mb-16 overflow-hidden text-center">
          <p className="mb-intro-label section-label">Impact</p>
        </div>

        <div className="grid gap-16 md:grid-cols-3 md:gap-8">
          {METRICS.map((metric) => (
            <div key={metric.label} className="metric-block text-center opacity-0">
              <ScrubCounter
                target={metric.value}
                suffix={metric.suffix}
                progress={scrubProgress}
              />
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
