import { create } from "zustand";

export type ExperiencePhase =
  | "hero"
  | "problem"
  | "engine"
  | "services"
  | "process"
  | "cases"
  | "os"
  | "metrics"
  | "founder"
  | "cta";

interface ScrollState {
  /** Global scroll progress 0–1 */
  progress: number;
  /** Hero-to-problem transition 0–1 */
  problemProgress: number;
  /** Digital Core evolution 0–1 (chaos → systems) */
  coreEvolution: number;
  /** Transformation engine activation 0–1 */
  engineProgress: number;
  /** Services scene index 0–4 */
  serviceScene: number;
  /** Final CTA inward camera 0–1 */
  ctaProgress: number;
  phase: ExperiencePhase;
  isMobile: boolean;
  isTablet: boolean;
  reducedMotion: boolean;
  setProgress: (progress: number) => void;
  setProblemProgress: (v: number) => void;
  setCoreEvolution: (v: number) => void;
  setEngineProgress: (v: number) => void;
  setServiceScene: (v: number) => void;
  setCtaProgress: (v: number) => void;
  setPhase: (phase: ExperiencePhase) => void;
  setDevice: (mobile: boolean, tablet: boolean) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  problemProgress: 0,
  coreEvolution: 0,
  engineProgress: 0,
  serviceScene: 0,
  ctaProgress: 0,
  phase: "hero",
  isMobile: false,
  isTablet: false,
  reducedMotion: false,
  setProgress: (progress) => set({ progress }),
  setProblemProgress: (problemProgress) => set({ problemProgress }),
  setCoreEvolution: (coreEvolution) => set({ coreEvolution }),
  setEngineProgress: (engineProgress) => set({ engineProgress }),
  setServiceScene: (serviceScene) => set({ serviceScene }),
  setCtaProgress: (ctaProgress) => set({ ctaProgress }),
  setPhase: (phase) => set({ phase }),
  setDevice: (isMobile, isTablet) => set({ isMobile, isTablet }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
