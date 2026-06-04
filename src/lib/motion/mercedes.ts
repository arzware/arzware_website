import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Mercedes-Benz C-Class digital experience motion language.
 * Scroll-scrubbed, pinned sequences, mask reveals, parallax — no snap/bounce.
 * Reference: Antoni / Adi Constantin interactive scrollytelling (C-Class launch).
 */
export const MB = {
  /** Primary scrub lag — luxury scroll coupling */
  scrub: 1.5,
  /** Lighter scrub for typography / parallax */
  scrubLight: 0.8,
  /** Pin sequence length helpers */
  pinShort: "+=100%",
  pinMedium: "+=140%",
  pinLong: "+=180%",
  /** Easing — soft automotive feel */
  ease: "power2.out",
  easeStrong: "power3.out",
  easeScroll: "none",
  /** Lenis-style momentum */
  scrollDuration: 1.5,
} as const;

export type MBTimelineVars = ScrollTrigger.Vars & {
  pin?: boolean;
  end?: string | number | (() => string | number);
};

/** Pinned scrub timeline — Mercedes chapter pattern */
export function mbPinnedTimeline(
  trigger: Element | string,
  end: string = MB.pinMedium,
  onUpdate?: (progress: number) => void
) {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end,
      pin: true,
      scrub: MB.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: onUpdate
        ? (self) => onUpdate(self.progress)
        : undefined,
    },
  });
}

/** Section intro reveal — label + headline lines scrubbed on approach */
export function mbSectionIntro(scope: Element, reducedMotion: boolean) {
  if (reducedMotion) {
    gsap.set(scope.querySelectorAll(".mb-line-inner, .mb-intro-label, .mb-intro-body"), {
      yPercent: 0,
      opacity: 1,
    });
    return;
  }

  gsap
    .timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top 85%",
        end: "top 35%",
        scrub: MB.scrubLight,
      },
    })
    .fromTo(
      scope.querySelectorAll(".mb-intro-label"),
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: MB.easeScroll, duration: 0.4 }
    )
    .fromTo(
      scope.querySelectorAll(".mb-line-inner"),
      { yPercent: 115 },
      { yPercent: 0, stagger: 0.06, ease: MB.easeScroll, duration: 0.6 },
      0.08
    )
    .fromTo(
      scope.querySelectorAll(".mb-intro-body"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: MB.easeScroll, duration: 0.5 },
      0.2
    );
}

/** Parallax drift — background moves slower than foreground */
export function mbParallax(
  trigger: Element,
  target: Element | string,
  yPercent: number,
  reducedMotion: boolean
) {
  if (reducedMotion) return;

  gsap.to(target, {
    yPercent,
    ease: MB.easeScroll,
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: MB.scrub,
    },
  });
}

/** Hero scroll-out — content lifts and fades as user leaves */
export function mbHeroScrollOut(scope: Element, reducedMotion: boolean) {
  if (reducedMotion) return;

  gsap
    .timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top top",
        end: "bottom top",
        scrub: MB.scrub,
      },
    })
    .to(
      scope.querySelector(".hero-inner"),
      { y: -100, opacity: 0, scale: 0.94, ease: MB.easeScroll },
      0
    )
    .to(
      scope.querySelector(".hero-ambient"),
      { opacity: 0, scale: 1.08, ease: MB.easeScroll },
      0
    )
    .to(
      scope.querySelector(".hero-scroll-hint"),
      { opacity: 0, y: 20, ease: MB.easeScroll },
      0
    );
}

/** Scale reveal on load — Mercedes zoom-settle */
export function mbLoadReveal(
  scope: Element,
  targets: string,
  delay = 0
) {
  gsap.fromTo(
    targets,
    { scale: 1.06, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 2.4,
      delay,
      ease: MB.easeStrong,
    }
  );
}

/** Horizontal scrub chapter — vertical scroll drives horizontal motion */
export function mbHorizontalChapter(
  trigger: Element,
  track: Element,
  reducedMotion: boolean
) {
  if (reducedMotion) return;

  const getScroll = () => track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: () => -getScroll(),
    ease: MB.easeScroll,
    scrollTrigger: {
      trigger,
      start: "top top",
      end: () => `+=${getScroll()}`,
      pin: true,
      scrub: MB.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

/** Refresh ScrollTrigger after fonts/images load */
export function refreshMercedesScroll() {
  ScrollTrigger.refresh();
}
