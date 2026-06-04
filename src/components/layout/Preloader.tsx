"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Lock scroll while preloader is active
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete?.();
          // Keep mounted briefly so exit animation finishes, then unmount
          gsap.delayedCall(0.1, () => setVisible(false));
        },
      });

      // ── Initial states ──────────────────────────────────────────
      gsap.set(logoRef.current, { opacity: 0, yPercent: 20 });
      gsap.set(labelRef.current, { opacity: 0, yPercent: 30 });
      gsap.set(lineTopRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(lineBotRef.current, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(counterRef.current, { opacity: 0 });

      // ── Phase 1: Reveal logo + lines ─────────────────────────────
      tl.to(
        lineTopRef.current,
        { scaleX: 1, duration: 1.0, ease: "power3.out" },
        0.2
      )
        .to(
          lineBotRef.current,
          { scaleX: 1, duration: 1.0, ease: "power3.out" },
          0.3
        )
        .to(
          logoRef.current,
          { opacity: 1, yPercent: 0, duration: 1.0, ease: "power3.out" },
          0.4
        )
        .to(
          labelRef.current,
          { opacity: 1, yPercent: 0, duration: 0.8, ease: "power3.out" },
          0.65
        )
        .to(
          counterRef.current,
          { opacity: 1, duration: 0.4, ease: "none" },
          0.8
        );

      // ── Phase 2: Progress bar fill + counter ─────────────────────
      const counter = { val: 0 };
      tl.to(
        progressBarRef.current,
        { scaleX: 1, duration: 1.8, ease: "power2.inOut" },
        1.0
      ).to(
        counter,
        {
          val: 100,
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate() {
            if (counterRef.current) {
              counterRef.current.textContent = `${Math.round(counter.val)}`;
            }
          },
        },
        "<" // sync with bar
      );

      // ── Phase 3: Exit — panel wipe up then overlay splits ─────────
      tl.to(
        [logoRef.current, labelRef.current, lineTopRef.current, lineBotRef.current, progressBarRef.current?.parentElement],
        { opacity: 0, y: -20, duration: 0.5, ease: "power2.in", stagger: 0.04 },
        "+=0.25"
      ).to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "power4.inOut",
        },
        "-=0.1"
      );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="preloader-overlay"
      aria-hidden="true"
      role="presentation"
    >
      {/* Decorative horizontal lines */}
      <div ref={lineTopRef} className="preloader-line preloader-line-top" />
      <div ref={lineBotRef} className="preloader-line preloader-line-bot" />

      {/* Center content */}
      <div className="preloader-center">
        <div ref={logoRef} className="preloader-logo">
          <Image
            src="/AR_logo_transparent_dark.png"
            alt="Arzware"
            width={120}
            height={60}
            priority
            style={{ objectFit: "contain", filter: "invert(1)" }}
          />
        </div>

        <p ref={labelRef} className="preloader-label">
          Software Modernization Studio
        </p>
      </div>

      {/* Bottom progress strip */}
      <div className="preloader-progress-wrap">
        <div className="preloader-progress-track">
          <div ref={progressBarRef} className="preloader-progress-bar" />
        </div>
        <span className="preloader-counter">
          <span ref={counterRef}>0</span>
          <span className="preloader-counter-pct">%</span>
        </span>
      </div>
    </div>
  );
}
