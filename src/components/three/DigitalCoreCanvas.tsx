"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useScrollStore } from "@/lib/stores/scroll-store";
import { DigitalCore } from "./DigitalCore";

function ResponsiveCamera() {
  const groupRef = useRef<THREE.Group>(null);
  const coreEvolution = useScrollStore((s) => s.coreEvolution);
  const problemProgress = useScrollStore((s) => s.problemProgress);
  const engineProgress = useScrollStore((s) => s.engineProgress);
  const ctaProgress = useScrollStore((s) => s.ctaProgress);
  const phase = useScrollStore((s) => s.phase);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Subtle luxury camera drift — never dramatic
    const baseY = Math.sin(t * 0.15) * 0.08;
    const baseX = Math.cos(t * 0.12) * 0.06;

    // Phase-based camera choreography
    const problemShift = problemProgress * 0.4;
    const enginePull = engineProgress * 0.25;
    const ctaZoom = ctaProgress * 0.6;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      baseX - problemShift * 0.3 + enginePull * 0.2,
      delta * 0.8
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      baseY + problemShift * 0.15 - ctaZoom * 0.1,
      delta * 0.8
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      5.5 - coreEvolution * 0.4 - ctaZoom * 1.2,
      delta * 0.6
    );

    state.camera.lookAt(0, phase === "cta" ? 0 : 0.1, 0);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      coreEvolution * 0.35 + t * 0.02,
      delta * 0.5
    );
  });

  return (
    <group ref={groupRef}>
      <DigitalCore />
    </group>
  );
}

function SceneLighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const heroReveal = useScrollStore((s) => s.progress);

  useFrame((_, delta) => {
    if (!ambientRef.current) return;
    const target = 0.15 + Math.min(heroReveal * 0.1, 0.1);
    ambientRef.current.intensity = THREE.MathUtils.lerp(
      ambientRef.current.intensity,
      target,
      delta * 2
    );
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4, 14]} />
      <ambientLight ref={ambientRef} intensity={0} color="#E5E5E5" />
      <directionalLight position={[4, 6, 5]} intensity={0.35} color="#F5F5F5" />
      <directionalLight position={[-3, -2, 4]} intensity={0.12} color="#D4AF37" />
      <pointLight position={[0, 0, 2]} intensity={0.4} color="#D4AF37" distance={8} />
    </>
  );
}

export function DigitalCoreCanvas() {
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1.5;
    return Math.min(window.devicePixelRatio, 2);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneLighting />
      <ResponsiveCamera />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
