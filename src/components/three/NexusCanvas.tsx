"use client";

import React, { useEffect, useRef, Suspense, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Stars, Preload, Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { useNexus } from "@/context/NexusContext";
import CommandNexus from "./CommandNexus";
import DataTunnel from "./DataTunnel";
import {
  PulseWorld,
  PrismWorld,
  PaywithEaseWorld,
  UpaadiWorld,
  UdyogaWorld,
  InterviewerWorld
} from "./ProductWorlds";

/* ─── Deep-Space Nebula Particle Cloud ──────────────────────── */
function NebulaDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color("#1a0a3e"),
      new THREE.Color("#0d1b4a"),
      new THREE.Color("#1b0030"),
      new THREE.Color("#001428"),
      new THREE.Color("#0a0025"),
    ];

    for (let i = 0; i < count; i++) {
      // Spread particles in a huge volume
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 160;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = 0.3 + Math.random() * 1.2;
    }
    return [pos, col, sz];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.6}
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Ambient Floating Energy Particles ─────────────────────── */
function AmbientEnergy() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(elapsed * 0.5 + i * 0.1) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00f3ff"
        size={0.08}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Cinematic Camera Rig ──────────────────────────────────── */
function CameraRig() {
  const { activeWorld, transitioning } = useNexus();
  const { camera } = useThree();

  const proxy = useRef({
    x: 0, y: 5, z: 22,
    tx: 0, ty: 0, tz: 0
  });

  useEffect(() => {
    let cx = 0, cy = 5, cz = 22;
    let tx = 0, ty = 0, tz = 0;

    switch (activeWorld) {
      case "pulse":
        cx = 25; cy = 3; cz = -18;
        tx = 25; ty = 0; tz = -25;
        break;
      case "prism":
        cx = -25; cy = 3; cz = -17;
        tx = -25; ty = 0; tz = -25;
        break;
      case "paywithease":
        cx = 25; cy = 18; cz = 32;
        tx = 25; ty = 15; tz = 25;
        break;
      case "upaadi":
        cx = -25; cy = 18; cz = 32;
        tx = -25; ty = 15; tz = 25;
        break;
      case "udyoga":
        cx = 0; cy = -23; cz = -18;
        tx = 0; ty = -25; tz = -25;
        break;
      case "interview":
        cx = 0; cy = 27; cz = -18;
        tx = 0; ty = 25; tz = -25;
        break;
      case "nexus":
      default:
        cx = 0; cy = 5; cz = 22;
        tx = 0; ty = 0; tz = 0;
        break;
    }

    gsap.killTweensOf(proxy.current);
    gsap.to(proxy.current, {
      x: cx, y: cy, z: cz,
      tx, ty, tz,
      duration: activeWorld === "nexus" ? 1.8 : 2.2,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.position.set(proxy.current.x, proxy.current.y, proxy.current.z);
        camera.lookAt(proxy.current.tx, proxy.current.ty, proxy.current.tz);
      }
    });
  }, [activeWorld, camera]);

  useFrame((state) => {
    if (transitioning) return;
    const mouse = state.mouse;
    const targetX = proxy.current.x + mouse.x * 1.0;
    const targetY = proxy.current.y + mouse.y * 0.6;
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.lookAt(proxy.current.tx, proxy.current.ty, proxy.current.tz);
  });

  return null;
}

/* ─── Post-Processing Stack ─────────────────────────────────── */
function PostEffects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        intensity={1.8}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.4}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        radialModulation={false}
        modulationOffset={0.0}
        offset={new THREE.Vector2(0.0006, 0.0006)}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

/* ─── Main NexusCanvas ──────────────────────────────────────── */
export default function NexusCanvas() {
  return (
    <div className="w-full h-screen absolute inset-0 bg-[#020108] z-10">
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 250, position: [0, 5, 22] }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        shadows
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <color attach="background" args={["#020108"]} />
        <fogExp2 attach="fog" args={["#030012", 0.012]} />

        {/* Cinematic Lighting Rig */}
        <ambientLight intensity={0.12} color="#1a1030" />

        {/* Key light — warm stellar */}
        <directionalLight
          position={[15, 25, 10]}
          intensity={0.8}
          color="#e8dff5"
        />

        {/* Rim light — cyan from top-right */}
        <spotLight
          position={[20, 30, 15]}
          angle={0.5}
          penumbra={1}
          intensity={3}
          color="#00f3ff"
          distance={80}
        />

        {/* Fill light — magenta from below-left */}
        <spotLight
          position={[-15, -20, -10]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          color="#ff007f"
          distance={60}
        />

        {/* Accent — deep purple */}
        <pointLight position={[0, -10, 20]} intensity={1.5} color="#6a00ff" distance={50} />

        {/* Accent — warm gold */}
        <pointLight position={[-20, 10, -15]} intensity={1} color="#ffbe0b" distance={40} />

        <Suspense fallback={null}>
          {/* Environment map for reflections */}
          <Environment preset="night" environmentIntensity={0.15} />

          {/* Deep space star field */}
          <Stars
            radius={100}
            depth={60}
            count={4000}
            factor={5}
            saturation={0.8}
            fade
            speed={0.6}
          />

          {/* Nebula dust cloud */}
          <NebulaDust />

          {/* Floating energy motes */}
          <AmbientEnergy />

          {/* Central Nexus Scene */}
          <CommandNexus />

          {/* Product Worlds */}
          <PulseWorld position={[25, 0, -25]} />
          <PrismWorld position={[-25, 0, -25]} />
          <PaywithEaseWorld position={[25, 15, 25]} />
          <UpaadiWorld position={[-25, 15, 25]} />
          <UdyogaWorld position={[0, -25, -25]} />
          <InterviewerWorld position={[0, 25, -25]} />

          {/* Warp Tunnel */}
          <DataTunnel />

          <CameraRig />
          <Preload all />
        </Suspense>

        {/* Post-processing */}
        <PostEffects />
      </Canvas>
    </div>
  );
}
