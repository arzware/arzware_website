"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MB, mbSectionIntro } from "@/lib/motion/mercedes";
import { MaskLines } from "@/components/motion/MaskReveal";

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    id: "website",
    index: "01",
    title: "Website Modernization",
    narrative:
      "Outdated pages become conversion engines — fast, accessible, and architected for growth.",
    visual: "from-[#111] to-[#0B0B0B]",
    accent: "border-accent/30",
  },
  {
    id: "systems",
    index: "02",
    title: "Business Systems",
    narrative:
      "Dashboards, CRM-lite tools, and operational portals that replace spreadsheets and memory.",
    visual: "from-[#0B0B0B] to-[#111]",
    accent: "border-accent-light/20",
  },
  {
    id: "automation",
    index: "03",
    title: "Automation",
    narrative:
      "Follow-ups, reminders, data sync, and document workflows running without manual intervention.",
    visual: "from-[#111] to-[#050505]",
    accent: "border-accent/25",
  },
  {
    id: "ai",
    index: "04",
    title: "AI Workflows",
    narrative:
      "Intelligent assistance embedded into daily operations — research, summaries, and decision support.",
    visual: "from-[#0B0B0B] to-[#111]",
    accent: "border-accent-light/15",
  },
  {
    id: "custom",
    index: "05",
    title: "Custom Software",
    narrative:
      "Purpose-built platforms engineered for your exact business model — no template compromises.",
    visual: "from-[#111] to-[#0B0B0B]",
    accent: "border-accent/35",
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setServiceScene = useScrollStore((s) => s.setServiceScene);
  const setPhase = useScrollStore((s) => s.setPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        onEnter: () => setPhase("services"),
        onEnterBack: () => setPhase("services"),
      });

      mbSectionIntro(sectionRef.current!.querySelector(".services-intro")!, reducedMotion);

      const panels = gsap.utils.toArray<HTMLElement>(".service-scene");

      if (reducedMotion) {
        panels.forEach((p) => gsap.set(p, { opacity: 1 }));
        return;
      }

      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          onEnter: () => setServiceScene(i),
          onEnterBack: () => setServiceScene(i),
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "+=90%",
            scrub: MB.scrub,
            anticipatePin: 1,
          },
        })
          .fromTo(
            panel.querySelector(".scene-index"),
            { opacity: 0, x: -40, scale: 1.1 },
            { opacity: 1, x: 0, scale: 1, ease: MB.easeScroll }
          )
          .fromTo(
            panel.querySelector(".scene-title .mb-line-inner"),
            { yPercent: 110 },
            { yPercent: 0, stagger: 0.05, ease: MB.easeScroll },
            0.08
          )
          .fromTo(
            panel.querySelector(".scene-narrative"),
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: MB.easeScroll },
            0.2
          )
          .fromTo(
            panel.querySelector(".scene-visual"),
            { scale: 1.08, opacity: 0.2 },
            { scale: 1, opacity: 1, ease: MB.easeScroll },
            0
          );

        if (i < panels.length - 1) {
          gsap.to(panel, {
            opacity: 0,
            scale: 0.98,
            scrollTrigger: {
              trigger: panel,
              start: "bottom top",
              end: "+=15%",
              scrub: MB.scrubLight,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, setServiceScene, setPhase]);

  return (
    <section ref={sectionRef} id="services" aria-label="Services">
      <div className="section-pad pb-0">
        <div className="services-intro mx-auto mb-16 max-w-[1600px] px-[clamp(1.25rem,4vw,4rem)]">
          <div className="mb-line mb-6 overflow-hidden">
            <p className="mb-intro-label section-label">Capabilities</p>
          </div>
          <h2 className="headline-editorial max-w-[14ch] text-balance">
            <MaskLines text="Five scenes of transformation" />
          </h2>
        </div>
      </div>

      {SCENES.map((scene) => (
        <div
          key={scene.id}
          className="service-scene relative flex min-h-[100dvh] items-center section-pad"
        >
          <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <span className="scene-index font-mono text-[clamp(3rem,8vw,7rem)] font-light leading-none text-accent/20">
                {scene.index}
              </span>
              <h3 className="scene-title headline-editorial mt-4 text-balance">
                <span className="mb-line block overflow-hidden">
                  <span className="mb-line-inner block">{scene.title}</span>
                </span>
              </h3>
              <p className="scene-narrative body-large mt-8 max-w-[42ch]">
                {scene.narrative}
              </p>
            </div>

            <div
              className={`scene-visual relative aspect-[4/3] overflow-hidden rounded-sm border bg-gradient-to-br ${scene.visual} ${scene.accent}`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.06)_0%,transparent_50%)]" />
              <div className="absolute bottom-8 left-8 right-8 border-t border-white/5 pt-6">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-px flex-1 bg-accent/20"
                      style={{ opacity: 0.3 + i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
              {/* Scene-specific visual accent lines */}
              <svg
                className="absolute inset-0 h-full w-full opacity-30"
                viewBox="0 0 400 300"
                aria-hidden="true"
              >
                <path
                  d="M0,150 Q100,80 200,150 T400,150"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="0.5"
                />
                <path
                  d="M0,180 Q150,120 300,180"
                  fill="none"
                  stroke="#E5E5E5"
                  strokeWidth="0.3"
                  opacity="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
