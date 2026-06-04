"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { DeviceInit } from "@/components/layout/DeviceInit";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { Preloader } from "@/components/layout/Preloader";

const SceneLayer = dynamic(
  () =>
    import("@/components/three/SceneLayer").then((m) => ({
      default: m.SceneLayer,
    })),
  { ssr: false }
);

const TransformationEngineSection = dynamic(
  () =>
    import("@/components/sections/TransformationEngineSection").then((m) => ({
      default: m.TransformationEngineSection,
    }))
);

const ServicesSection = dynamic(
  () =>
    import("@/components/sections/ServicesSection").then((m) => ({
      default: m.ServicesSection,
    }))
);

const HowWeWorkSection = dynamic(
  () =>
    import("@/components/sections/HowWeWorkSection").then((m) => ({
      default: m.HowWeWorkSection,
    }))
);

const CaseStudiesSection = dynamic(
  () =>
    import("@/components/sections/CaseStudiesSection").then((m) => ({
      default: m.CaseStudiesSection,
    }))
);

const OperatingSystemSection = dynamic(
  () =>
    import("@/components/sections/OperatingSystemSection").then((m) => ({
      default: m.OperatingSystemSection,
    }))
);

const MetricsSection = dynamic(
  () =>
    import("@/components/sections/MetricsSection").then((m) => ({
      default: m.MetricsSection,
    }))
);

const FounderSection = dynamic(
  () =>
    import("@/components/sections/FounderSection").then((m) => ({
      default: m.FounderSection,
    }))
);

const FinalCTASection = dynamic(
  () =>
    import("@/components/sections/FinalCTASection").then((m) => ({
      default: m.FinalCTASection,
    }))
);

const Footer = dynamic(
  () =>
    import("@/components/sections/FinalCTASection").then((m) => ({
      default: m.Footer,
    }))
);

export function ExperiencePage() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setReady(true)} />

      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: ready ? "auto" : "none",
        }}
      >
        <SmoothScroll>
          <DeviceInit />
          <ScrollProgress />
          <SceneLayer />
          <Navigation />

          <main className="relative z-10">
            <HeroSection />
            <ProblemSection />
            <TransformationEngineSection />
            <ServicesSection />
            <HowWeWorkSection />
            <CaseStudiesSection />
            <OperatingSystemSection />
            <MetricsSection />
            <FounderSection />
            <FinalCTASection />
          </main>

          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}
