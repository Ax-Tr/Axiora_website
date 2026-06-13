"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Stars, Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useNexus, WorldType } from "@/context/NexusContext";
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
interface PerformanceProfile {
  reducedMotion: boolean;
  lowPower: boolean;
  mobile: boolean;
  slowNetwork: boolean;
}

function usePerformanceProfile(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>({
    reducedMotion: false,
    lowPower: false,
    mobile: false,
    slowNetwork: false,
  });

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const update = () => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      const connection = navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      };
      const limitedMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
      const limitedCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
      const mobile = mobileQuery.matches;
      const reducedMotion = reducedQuery.matches;
      const slowNetwork = Boolean(
        connection.connection?.saveData ||
        ["slow-2g", "2g", "3g"].includes(connection.connection?.effectiveType || "")
      );

      setProfile({
        reducedMotion,
        mobile,
        slowNetwork,
        lowPower: reducedMotion || mobile || limitedMemory || limitedCores || slowNetwork,
      });
    };

    update();
    reducedQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);

    return () => {
      reducedQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  return profile;
}

function NebulaDust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color("#0757b8"),
      new THREE.Color("#83a7f3"),
      new THREE.Color("#ff8a00"),
      new THREE.Color("#43ad2f"),
      new THREE.Color("#ffffff"),
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
  }, [count]);

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
        opacity={0.18}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Ambient Floating Energy Particles ─────────────────────── */
function AmbientEnergy({ count, disabled }: { count: number; disabled: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (disabled) return;
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
        color="#0757b8"
        size={0.08}
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Cinematic Camera Rig ──────────────────────────────────── */
function CameraRig({ profile }: { profile: PerformanceProfile }) {
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
    if (transitioning || profile.reducedMotion) return;
    const mouse = state.mouse;
    const drift = profile.lowPower ? 0.35 : 0.85;
    const targetX = proxy.current.x + mouse.x * drift;
    const targetY = proxy.current.y + mouse.y * drift * 0.55;
    camera.position.x += (targetX - camera.position.x) * 0.045;
    camera.position.y += (targetY - camera.position.y) * 0.045;
    camera.lookAt(proxy.current.tx, proxy.current.ty, proxy.current.tz);
  });

  return null;
}

function ProductWorldLayer() {
  const { activeWorld, transitioning } = useNexus();
  const visibleWorld = transitioning ? null : activeWorld;
  const worlds: Partial<Record<WorldType, React.ReactNode>> = {
    pulse: <PulseWorld position={[25, 0, -25]} />,
    prism: <PrismWorld position={[-25, 0, -25]} />,
    paywithease: <PaywithEaseWorld position={[25, 15, 25]} />,
    upaadi: <UpaadiWorld position={[-25, 15, 25]} />,
    udyoga: <UdyogaWorld position={[0, -25, -25]} />,
    interview: <InterviewerWorld position={[0, 25, -25]} />,
  };

  return <>{visibleWorld && worlds[visibleWorld]}</>;
}

/* ─── Main NexusCanvas ──────────────────────────────────────── */
export default function NexusCanvas() {
  const profile = usePerformanceProfile();
  const nebulaCount = profile.slowNetwork || profile.mobile ? 420 : profile.lowPower ? 700 : 1800;
  const energyCount = profile.slowNetwork || profile.mobile ? 70 : profile.lowPower ? 140 : 420;
  const starCount = profile.slowNetwork || profile.mobile ? 600 : profile.lowPower ? 900 : 2400;
  const dpr: [number, number] = profile.lowPower ? [0.65, 1] : [1, 1.35];

  return (
    <div className="w-full h-screen absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#263f72_0%,#101a2d_42%,#050711_100%)] z-10">
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 250, position: [0, 5, 22] }}
        gl={{
          antialias: !profile.lowPower,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        dpr={dpr}
        performance={{ min: 0.5 }}
        shadows={!profile.lowPower}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <color attach="background" args={["#060914"]} />
        <fogExp2 attach="fog" args={["#111a33", 0.006]} />

        {/* Cinematic Lighting Rig */}
        <ambientLight intensity={profile.lowPower ? 0.28 : 0.18} color="#92a8d8" />

        {/* Key light — warm stellar */}
        <directionalLight
          position={[15, 25, 10]}
          intensity={profile.lowPower ? 0.75 : 0.95}
          color="#ffffff"
          castShadow={!profile.lowPower}
          shadow-mapSize-width={profile.lowPower ? 512 : 1024}
          shadow-mapSize-height={profile.lowPower ? 512 : 1024}
          shadow-camera-near={1}
          shadow-camera-far={90}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
        />

        {/* Rim light — cyan from top-right */}
        <spotLight
          position={[20, 30, 15]}
          angle={0.5}
          penumbra={1}
          intensity={profile.lowPower ? 1.1 : 1.8}
          color="#0757b8"
          distance={80}
          castShadow={!profile.lowPower}
        />

        {/* Fill light — magenta from below-left */}
        <spotLight
          position={[-15, -20, -10]}
          angle={0.5}
          penumbra={1}
          intensity={profile.lowPower ? 0.75 : 1.25}
          color="#ff8a00"
          distance={60}
          castShadow={!profile.lowPower}
        />

        {/* Accent — deep purple */}
        <pointLight position={[0, -10, 20]} intensity={profile.lowPower ? 0.55 : 0.95} color="#0757b8" distance={50} />

        {/* Accent — warm gold */}
        <pointLight position={[-20, 10, -15]} intensity={profile.lowPower ? 0.45 : 0.8} color="#ff8a00" distance={40} />

        {/* Deep space star field */}
        <Stars
          radius={100}
          depth={60}
          count={starCount}
          factor={3.5}
          saturation={0.35}
          fade
          speed={profile.reducedMotion ? 0 : 0.45}
        />

        {/* Nebula dust cloud */}
        <NebulaDust count={nebulaCount} />

        {/* Floating energy motes */}
        <AmbientEnergy count={energyCount} disabled={profile.lowPower} />

        {/* Central Nexus Scene */}
        <CommandNexus />

        {/* Product Worlds */}
        <ProductWorldLayer />

        {/* Warp Tunnel */}
        <DataTunnel />

        <CameraRig profile={profile} />
        <Preload all />

      </Canvas>
    </div>
  );
}
