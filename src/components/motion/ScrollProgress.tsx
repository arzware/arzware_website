"use client";

import { useScrollStore } from "@/lib/stores/scroll-store";

/** Mercedes-style scroll progress indicators */
export function ScrollProgress() {
  const progress = useScrollStore((s) => s.progress);

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] origin-left bg-accent"
        style={{
          width: `${progress * 100}%`,
          opacity: 0.35 + progress * 0.45,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed right-6 top-1/2 z-[60] hidden h-28 w-px -translate-y-1/2 bg-white/[0.08] md:block"
        aria-hidden="true"
      >
        <div
          className="w-full bg-accent/60"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </>
  );
}
