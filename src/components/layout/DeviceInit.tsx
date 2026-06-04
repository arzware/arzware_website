"use client";

import { useEffect } from "react";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { useDeviceTier, useReducedMotion } from "@/hooks/useMediaQuery";

export function DeviceInit() {
  const { isMobile, isTablet } = useDeviceTier();
  const reducedMotion = useReducedMotion();
  const setDevice = useScrollStore((s) => s.setDevice);
  const setReducedMotion = useScrollStore((s) => s.setReducedMotion);

  useEffect(() => {
    setDevice(isMobile, isTablet);
  }, [isMobile, isTablet, setDevice]);

  useEffect(() => {
    setReducedMotion(reducedMotion);
  }, [reducedMotion, setReducedMotion]);

  return null;
}
