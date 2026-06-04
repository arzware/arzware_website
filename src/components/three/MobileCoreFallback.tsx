"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/lib/stores/scroll-store";

/**
 * Mobile / reduced-motion fallback — CSS-based living core.
 * Maintains narrative continuity without WebGL overhead.
 */
export function MobileCoreFallback() {
  const ref = useRef<HTMLDivElement>(null);
  const coreEvolution = useScrollStore((s) => s.coreEvolution);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.opacity = String(0.4 + coreEvolution * 0.4);
    ref.current.style.transform = `scale(${0.85 + coreEvolution * 0.15})`;
  }, [coreEvolution]);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        ref={ref}
        className="relative h-[min(70vw,320px)] w-[min(70vw,320px)] transition-[opacity,transform] duration-[1800ms] ease-luxury"
      >
        <div className="absolute inset-0 animate-[spin_60s_linear_infinite] rounded-full border border-accent/20" />
        <div className="absolute inset-[12%] animate-[spin_45s_linear_infinite_reverse] rounded-full border border-accent-light/10" />
        <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-[38%] rounded-full border border-accent/30 bg-surface-secondary/80 shadow-[0_0_60px_rgba(212,175,55,0.12)]" />
      </div>
    </div>
  );
}
