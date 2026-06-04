"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNexus } from "@/context/NexusContext";

/*
 * Star Wars Hyperspace Jump Effect
 *
 * Phase 1: Stars stretch into streaks (0-0.4s)
 * Phase 2: Full lightspeed tunnel — elongated star lines fly past (0.4s-1.5s)
 * Phase 3: Deceleration — streaks shorten back to dots (1.5s-2.0s)
 */
export default function DataTunnel() {
  const { transitioning } = useNexus();
  const streaksRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const ambientRef = useRef<THREE.PointLight>(null);
  const progressRef = useRef(0);

  // Hyperspace star streaks — positioned in a forward-facing cylinder
  const streakCount = 400;
  const streakData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < streakCount; i++) {
      const radius = 0.5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 60;
      arr.push({
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius,
        z,
        baseLength: 0.01,
        speed: 0.8 + Math.random() * 1.5,
        brightness: 0.4 + Math.random() * 0.6,
        // Slight color variation: white to blue
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.3 + Math.random() * 0.4, 0.7 + Math.random() * 0.3),
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!transitioning) {
      progressRef.current = 0;
      return;
    }

    progressRef.current += delta;
    const t = progressRef.current;
    const totalDuration = 2.3; // Total transition time in seconds

    // Compute stretch factor — ramps up then down (Star Wars style)
    let stretchFactor: number;
    if (t < 0.3) {
      // Phase 1: Accelerating — stars begin to stretch
      stretchFactor = THREE.MathUtils.lerp(0.01, 0.5, t / 0.3);
    } else if (t < totalDuration - 0.5) {
      // Phase 2: Full lightspeed — maximum stretch
      stretchFactor = THREE.MathUtils.lerp(0.5, 3.0, Math.min(1, (t - 0.3) / 0.5));
    } else {
      // Phase 3: Decelerating — coming out of lightspeed
      const decelT = (t - (totalDuration - 0.5)) / 0.5;
      stretchFactor = THREE.MathUtils.lerp(3.0, 0.01, Math.min(1, decelT));
    }

    // Move and stretch each star streak
    if (streaksRef.current) {
      const camera = state.camera;
      streaksRef.current.position.copy(camera.position);
      streaksRef.current.quaternion.copy(camera.quaternion);

      streaksRef.current.children.forEach((child, i) => {
        const data = streakData[i];
        if (!data) return;

        // Move toward camera (positive Z)
        const mesh = child as THREE.Mesh;
        mesh.position.z += data.speed * 1.5;

        // Reset if past camera
        if (mesh.position.z > 30) mesh.position.z = -30;

        // Stretch the streak along Z axis — this creates the hyperspace effect
        mesh.scale.set(1, 1, stretchFactor * 80);

        // Brightness increases during full lightspeed
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const brightness = t > 0.3 && t < totalDuration - 0.5 ? data.brightness * 1.5 : data.brightness * 0.6;
        mat.opacity = brightness;
      });
    }

    // Central flash at jump moment
    if (flashRef.current) {
      let flashOpacity = 0;
      if (t > 0.2 && t < 0.6) {
        flashOpacity = Math.sin(((t - 0.2) / 0.4) * Math.PI) * 0.4;
      }
      (flashRef.current.material as THREE.MeshBasicMaterial).opacity = flashOpacity;
      flashRef.current.position.copy(state.camera.position);
      flashRef.current.quaternion.copy(state.camera.quaternion);
    }

    // Ambient light pulse
    if (ambientRef.current) {
      ambientRef.current.position.copy(state.camera.position);
      const intensity = t > 0.3 && t < totalDuration - 0.5 ? 6 + Math.sin(t * 12) * 2 : 1;
      ambientRef.current.intensity = intensity;
    }
  });

  if (!transitioning) return null;

  return (
    <group>
      {/* Hyperspace Star Streaks */}
      <group ref={streaksRef}>
        {streakData.map((data, i) => (
          <mesh key={i} position={[data.x, data.y, data.z]}>
            <boxGeometry args={[0.015, 0.015, data.baseLength]} />
            <meshBasicMaterial
              color={data.color}
              transparent
              opacity={data.brightness}
              toneMapped={false}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Jump Flash — white flash at the moment of jump */}
      <mesh ref={flashRef}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Warp ambient lighting */}
      <pointLight ref={ambientRef} color="#80c0ff" intensity={3} distance={30} decay={2} />
      <pointLight color="#4060ff" intensity={2} distance={20} decay={2} />
    </group>
  );
}
