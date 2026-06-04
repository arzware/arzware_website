"use client";

import { Suspense, lazy, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useDeviceTier } from "@/hooks/useMediaQuery";
import { MB } from "@/lib/motion/mercedes";

gsap.registerPlugin(ScrollTrigger);

const DigitalCoreCanvas = lazy(() =>
  import("@/components/three/DigitalCoreCanvas").then((m) => ({
    default: m.DigitalCoreCanvas,
  }))
);

const MobileCoreFallback = lazy(() =>
  import("@/components/three/MobileCoreFallback").then((m) => ({
    default: m.MobileCoreFallback,
  }))
);

function CanvasLoader() {
  return (
    <div className="absolute inset-0 bg-background" aria-hidden="true" />
  );
}

/**
 * Persistent 3D layer — Mercedes-style Ken Burns drift on scroll.
 */
export function SceneLayer() {
  const { isMobile } = useDeviceTier();
  const reducedMotion = useScrollStore((s) => s.reducedMotion);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layerRef.current || isMobile || reducedMotion) return;

    gsap.fromTo(
      layerRef.current,
      { scale: 1.06, opacity: 0.5 },
      {
        scale: 1,
        opacity: 1,
        ease: MB.easeScroll,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "30% top",
          scrub: MB.scrub,
        },
      }
    );
  }, [isMobile, reducedMotion]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-0 will-change-transform"
      aria-hidden="true"
    >
      <Suspense fallback={<CanvasLoader />}>
        {isMobile || reducedMotion ? (
          <MobileCoreFallback />
        ) : (
          <DigitalCoreCanvas />
        )}
      </Suspense>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_72%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
    </div>
  );
}
