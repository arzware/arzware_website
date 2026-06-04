"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { MB } from "@/lib/motion/mercedes";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".nav-inner",
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, delay: 2.8, ease: MB.easeStrong }
    );
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-[1000ms] ease-luxury ${
        scrolled
          ? "border-b border-white/[0.06] bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="nav-inner mx-auto flex max-w-[1600px] items-center justify-between px-[clamp(1.25rem,4vw,4rem)] py-5 opacity-0"
        aria-label="Main navigation"
      >
        <Link
          href="#hero"
          className="group flex items-center gap-3 transition-opacity duration-[800ms] hover:opacity-70"
        >
          <Image
            src="/AR_logo_transparent_dark.png"
            alt=""
            width={28}
            height={28}
            className="opacity-90"
            priority
          />
          <span className="font-mono text-[11px] tracking-[0.32em] text-foreground">
            ARZWARE
          </span>
        </Link>

        <Link href="#cta" className="mb-nav-link group flex items-center gap-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/80 transition-colors duration-[600ms] group-hover:text-accent-light">
            Start Your Transformation
          </span>
          <span className="block h-px w-8 origin-left scale-x-100 bg-accent/60 transition-transform duration-[600ms] group-hover:scale-x-150" />
        </Link>
      </nav>
    </header>
  );
}
