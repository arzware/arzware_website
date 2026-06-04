"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/lib/stores/scroll-store";

const NODE_COUNT = 48;
const RING_COUNT = 3;

/**
 * THE DIGITAL CORE
 * Procedural network structure — software systems, data flows, automation.
 * Evolves from chaotic dispersion to ordered lattice as user scrolls.
 */
export function DigitalCore() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  const coreEvolution = useScrollStore((s) => s.coreEvolution);
  const engineProgress = useScrollStore((s) => s.engineProgress);
  const isTablet = useScrollStore((s) => s.isTablet);

  const nodeCount = isTablet ? 32 : NODE_COUNT;

  const { nodePositions, lineGeometry } = useMemo(() => {
    const positions: THREE.Vector3[] = [];

    for (let r = 0; r < RING_COUNT; r++) {
      const ringRadius = 0.8 + r * 0.55;
      const count = Math.floor(nodeCount / RING_COUNT);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + r * 0.4;
        const y = (r - 1) * 0.35 + Math.sin(angle * 2) * 0.1;
        positions.push(
          new THREE.Vector3(
            Math.cos(angle) * ringRadius,
            y,
            Math.sin(angle) * ringRadius * 0.6
          )
        );
      }
    }

    const linePositions: number[] = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < 1.1) {
          linePositions.push(
            positions[i].x,
            positions[i].y,
            positions[i].z,
            positions[j].x,
            positions[j].y,
            positions[j].z
          );
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    return { nodePositions: positions, lineGeometry: geo };
  }, [nodeCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const chaosPositions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.2 + Math.random() * 1.8;
      arr.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta) * 0.5,
          radius * Math.cos(phi) * 0.7
        )
      );
    }
    return arr;
  }, [nodeCount]);

  useFrame((state, delta) => {
    if (!groupRef.current || !nodesRef.current) return;
    const time = state.clock.elapsedTime;
    const evolution = THREE.MathUtils.clamp(coreEvolution, 0, 1);
    const engine = THREE.MathUtils.clamp(engineProgress, 0, 1);

    groupRef.current.rotation.x =
      Math.sin(time * 0.08) * 0.04 * (1 - evolution * 0.5);
    groupRef.current.rotation.z = Math.cos(time * 0.06) * 0.03;

    const pulse = 0.85 + Math.sin(time * 0.5) * 0.08 + engine * 0.15;

    for (let i = 0; i < nodeCount; i++) {
      const ordered =
        nodePositions[i % nodePositions.length] ?? new THREE.Vector3();
      const chaos = chaosPositions[i] ?? ordered;
      const pos = new THREE.Vector3().lerpVectors(chaos, ordered, evolution);

      pos.y += Math.sin(time * 0.4 + i * 0.3) * 0.03 * (1 - evolution * 0.6);

      dummy.position.copy(pos);
      const scale = pulse * (0.025 + (i % 3 === 0 ? 0.015 : 0));
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      nodesRef.current.setMatrixAt(i, dummy.matrix);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;

    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(0.08, 0.45, evolution + engine * 0.3);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#E5E5E5"
          emissive="#D4AF37"
          emissiveIntensity={0.35}
          roughness={0.4}
          metalness={0.8}
        />
      </instancedMesh>

      <mesh>
        <torusKnotGeometry args={[0.35, 0.06, 128, 16, 2, 3]} />
        <meshStandardMaterial
          color="#111111"
          emissive="#D4AF37"
          emissiveIntensity={0.2 + coreEvolution * 0.4}
          roughness={0.3}
          metalness={0.9}
          wireframe={coreEvolution < 0.5}
        />
      </mesh>
    </group>
  );
}
