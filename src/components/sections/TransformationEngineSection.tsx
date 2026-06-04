"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbPinnedTimeline, mbSectionIntro } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { id: "clients", label: "Clients", x: 15, y: 20, metric: "360° view" },
  { id: "sales", label: "Sales", x: 75, y: 15, metric: "+34% pipeline" },
  { id: "operations", label: "Operations", x: 85, y: 55, metric: "−62% manual" },
  { id: "finance", label: "Finance", x: 55, y: 75, metric: "Real-time" },
  { id: "inventory", label: "Inventory", x: 20, y: 65, metric: "Synced" },
  { id: "automation", label: "Automation", x: 50, y: 45, metric: "24/7 flows" },
  { id: "reporting", label: "Reporting", x: 30, y: 42, metric: "Live KPIs" },
];

const CONNECTIONS: [string, string][] = [
  ["clients", "sales"],
  ["sales", "operations"],
  ["operations", "finance"],
  ["operations", "inventory"],
  ["clients", "automation"],
  ["automation", "reporting"],
  ["finance", "reporting"],
  ["inventory", "operations"],
  ["sales", "automation"],
];

export function TransformationEngineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setEngineProgress = useScrollStore((s) => s.setEngineProgress);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => setPhase("engine"),
        onEnterBack: () => setPhase("engine"),
      });

      mbSectionIntro(sectionRef.current!, reducedMotion);

      if (reducedMotion) {
        setEngineProgress(1);
        return;
      }

      const tl = mbPinnedTimeline(
        sectionRef.current!,
        "+=130%",
        (p) => setEngineProgress(p)
      );

      tl.fromTo(
        ".engine-intro",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: MB.easeScroll, duration: 0.25 },
        0
      )
        .fromTo(
          ".engine-node",
          { opacity: 0, scale: 0.85, y: 12 },
          { opacity: 1, scale: 1, y: 0, stagger: 0.04, ease: MB.easeScroll, duration: 0.35 },
          0.15
        )
        .fromTo(
          ".engine-connection",
          { strokeDashoffset: 180, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.55, stagger: 0.03, ease: MB.easeScroll, duration: 0.3 },
          0.25
        )
        .fromTo(
          ".engine-metric",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, stagger: 0.05, ease: MB.easeScroll, duration: 0.25 },
          0.5
        )
        .fromTo(
          ".data-flow",
          { opacity: 0 },
          { opacity: 1, ease: MB.easeScroll, duration: 0.2 },
          0.55
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setEngineProgress, setPhase]);

  const getNode = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <section
      ref={sectionRef}
      id="engine"
      className="relative min-h-[100dvh]"
      aria-label="Business transformation engine"
    >
      <div className="flex min-h-[100dvh] flex-col justify-center section-pad">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="engine-intro mb-16">
            <div className="mb-line mb-6 overflow-hidden">
              <p className="mb-intro-label section-label">Transformation Engine</p>
            </div>
            <h2 className="headline-editorial mb-4 max-w-[16ch] text-balance">
              <MaskLines text="One connected business nervous system" />
            </h2>
            <p className="mb-intro-body body-large max-w-[48ch] opacity-0">
              We map every operational node, activate the connections, and
              illuminate the data flows that drive modern businesses.
            </p>
          </div>

          <div className="relative aspect-[16/10] w-full max-w-[1000px]">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {CONNECTIONS.map(([from, to], i) => {
                const a = getNode(from);
                const b = getNode(to);
                return (
                  <line
                    key={i}
                    className="engine-connection"
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#D4AF37"
                    strokeWidth="0.15"
                    strokeDasharray="2 1"
                    opacity="0"
                  />
                );
              })}
              {CONNECTIONS.slice(0, 4).map(([from, to], i) => {
                const a = getNode(from);
                const b = getNode(to);
                return (
                  <circle
                    key={`flow-${i}`}
                    className="data-flow"
                    r="0.4"
                    fill="#E5E5E5"
                    opacity="0"
                  >
                    <animateMotion
                      dur={`${3 + i}s`}
                      repeatCount="indefinite"
                      path={`M${a.x},${a.y} L${b.x},${b.y}`}
                    />
                  </circle>
                );
              })}
            </svg>

            {NODES.map((node) => (
              <div
                key={node.id}
                className="engine-node absolute -translate-x-1/2 -translate-y-1/2 opacity-0"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-3 w-3 items-center justify-center rounded-full border border-accent/60 bg-surface-secondary shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <div className="h-1 w-1 rounded-full bg-accent" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                    {node.label}
                  </span>
                  <span className="engine-metric font-mono text-[9px] text-accent opacity-0">
                    {node.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
