/** Motion system constants — luxury pacing, no bounce/elastic */
export const EASING = {
  out: "power3.out",
  outStrong: "power4.out",
  expo: "expo.out",
} as const;

export const DURATION = {
  fast: 0.8,
  medium: 1.2,
  slow: 1.8,
  cinematic: 2.4,
} as const;

export const STAGGER = {
  tight: 0.08,
  normal: 0.12,
  relaxed: 0.18,
} as const;

/** Hero entrance timeline (seconds) */
export const HERO_SEQUENCE = {
  blackScreen: 0,
  ambientLight: 0.4,
  digitalCore: 1.0,
  headline: 1.8,
  subheadline: 2.3,
  cta: 2.8,
} as const;

export const COLORS = {
  bg: "#050505",
  surface: "#0B0B0B",
  surfaceSecondary: "#111111",
  text: "#F5F5F5",
  muted: "#A1A1A1",
  accent: "#D4AF37",
  accentLight: "#E5E5E5",
} as const;
