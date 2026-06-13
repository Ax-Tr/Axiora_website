"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNexus, PRODUCTS, WorldType } from "@/context/NexusContext";

type PlanetStyle = "rocky" | "gas" | "ice" | "lava" | "ocean" | "crystal";

interface PlanetSurface {
  map: THREE.DataTexture;
  bumpMap: THREE.DataTexture;
  emissiveMap: THREE.DataTexture;
  cloudMap?: THREE.DataTexture;
  ringMap?: THREE.DataTexture;
  roughness: number;
  metalness: number;
  bumpScale: number;
  emissive: string;
  emissiveIntensity: number;
}

function seededNoise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, seed: number) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < 5; i++) {
    value += seededNoise(x * frequency, y * frequency, seed + i * 13) * amplitude;
    amplitude *= 0.5;
    frequency *= 2.15;
  }
  return value;
}

function lerpColor(a: THREE.Color, b: THREE.Color, t: number) {
  return a.clone().lerp(b, THREE.MathUtils.clamp(t, 0, 1));
}

function writeColor(data: Uint8Array, index: number, color: THREE.Color, alpha = 255) {
  data[index] = Math.round(THREE.MathUtils.clamp(color.r, 0, 1) * 255);
  data[index + 1] = Math.round(THREE.MathUtils.clamp(color.g, 0, 1) * 255);
  data[index + 2] = Math.round(THREE.MathUtils.clamp(color.b, 0, 1) * 255);
  data[index + 3] = alpha;
}

function makeTexture(data: Uint8Array, size: number, colorSpace: THREE.ColorSpace = THREE.NoColorSpace) {
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createPlanetSurface(id: WorldType): PlanetSurface {
  const size = 256;
  const pixels = size * size * 4;
  const color = new Uint8Array(pixels);
  const bump = new Uint8Array(pixels);
  const glow = new Uint8Array(pixels);
  const cloud = new Uint8Array(pixels);
  const ring = new Uint8Array(pixels);
  const seed = PRODUCTS.findIndex((product) => product.id === id) + 3;

  const ocean = new THREE.Color("#163b76");
  const reef = new THREE.Color("#287b86");
  const land = new THREE.Color("#3d8a48");
  const forest = new THREE.Color("#1f5a37");
  const ice = new THREE.Color("#d8efff");
  const stone = new THREE.Color("#6f777f");
  const darkStone = new THREE.Color("#242934");
  const gold = new THREE.Color("#d99122");
  const amber = new THREE.Color("#ffbd55");
  const lava = new THREE.Color("#ff5a1f");
  const magma = new THREE.Color("#ffd166");
  const blueIce = new THREE.Color("#93c9ff");
  const deepBlue = new THREE.Color("#0a2b66");
  const violet = new THREE.Color("#8d7cff");
  const crystal = new THREE.Color("#d7f3ff");

  for (let y = 0; y < size; y++) {
    const v = y / (size - 1);
    const latitude = Math.abs(v - 0.5) * 2;
    for (let x = 0; x < size; x++) {
      const u = x / (size - 1);
      const i = (y * size + x) * 4;
      const continental = fbm(u * 4.5, v * 2.4, seed);
      const fine = fbm(u * 16, v * 8, seed + 41);
      let surface = stone.clone();
      let height = 0.45 + fine * 0.3;
      let emissive = new THREE.Color("#000000");
      let cloudAlpha = 0;

      if (id === "pulse") {
        const fracture = Math.abs(Math.sin((u * 12 + fine * 4) * Math.PI) * Math.cos((v * 7 - continental) * Math.PI));
        const polar = THREE.MathUtils.smoothstep(latitude, 0.55, 1);
        surface = lerpColor(deepBlue, blueIce, continental * 0.8 + polar * 0.45);
        surface.lerp(new THREE.Color("#ffffff"), fracture > 0.88 ? 0.42 : 0);
        height = 0.48 + fracture * 0.38 + polar * 0.15;
        emissive = new THREE.Color("#74c7ff").multiplyScalar(fracture > 0.93 ? 1 : 0);
      } else if (id === "prism") {
        const cracks = 1 - Math.min(1, Math.abs(continental - 0.55) * 16);
        surface = lerpColor(darkStone, new THREE.Color("#6b3424"), fine * 0.45);
        surface.lerp(amber, cracks * 0.55);
        height = 0.55 + fine * 0.25 - cracks * 0.25;
        emissive = lerpColor(lava, magma, fine).multiplyScalar(cracks > 0.35 ? 1 : 0);
      } else if (id === "paywithease") {
        const bands = 0.5 + Math.sin(v * Math.PI * 24 + fine * 2.4) * 0.5;
        const storm = Math.exp(-((u - 0.68) ** 2 / 0.009 + (v - 0.46) ** 2 / 0.002));
        surface = lerpColor(new THREE.Color("#7a4a21"), gold, bands * 0.75 + continental * 0.2);
        surface.lerp(new THREE.Color("#f1d18a"), storm * 0.7);
        height = 0.45 + bands * 0.18 + storm * 0.18;
        emissive = new THREE.Color("#ffb33d").multiplyScalar(storm * 0.45);
      } else if (id === "upaadi") {
        const facet = Math.abs(Math.sin((u + v) * 34) * Math.cos((u - v) * 28));
        surface = lerpColor(violet, crystal, THREE.MathUtils.smoothstep(facet + fine * 0.35, 0.35, 1));
        surface.lerp(new THREE.Color("#ffffff"), facet > 0.93 ? 0.6 : 0);
        height = 0.44 + facet * 0.42;
        emissive = new THREE.Color("#9edcff").multiplyScalar(facet > 0.94 ? 0.45 : 0);
      } else if (id === "udyoga") {
        const landMask = THREE.MathUtils.smoothstep(continental + (0.5 - latitude) * 0.08, 0.48, 0.64);
        const snow = THREE.MathUtils.smoothstep(latitude, 0.78, 1);
        surface = lerpColor(ocean, reef, fine * 0.3);
        surface.lerp(lerpColor(forest, land, fine), landMask);
        surface.lerp(ice, snow);
        height = 0.38 + landMask * 0.34 + fine * 0.12;
        const city = landMask > 0.7 && seededNoise(Math.floor(u * 80), Math.floor(v * 80), seed) > 0.86 ? 1 : 0;
        emissive = new THREE.Color("#b9ff91").multiplyScalar(city * 0.55);
        cloudAlpha = Math.round(THREE.MathUtils.smoothstep(fbm(u * 5 + 8, v * 5, seed + 101), 0.52, 0.84) * 155);
      } else if (id === "interview") {
        const crater = Math.abs(Math.sin(u * 49 + fine * 2) * Math.sin(v * 39 - continental * 3));
        surface = lerpColor(new THREE.Color("#25324c"), stone, fine);
        surface.lerp(new THREE.Color("#0a1020"), crater > 0.93 ? 0.45 : 0);
        height = 0.52 + fine * 0.2 - (crater > 0.93 ? 0.22 : 0);
        emissive = new THREE.Color("#75a9ff").multiplyScalar(crater > 0.965 ? 0.32 : 0);
      }

      writeColor(color, i, surface, 255);
      writeColor(bump, i, new THREE.Color(height, height, height), 255);
      writeColor(glow, i, emissive, 255);
      writeColor(cloud, i, new THREE.Color("#ffffff"), cloudAlpha);

      const radial = Math.abs(v - 0.5) * 2;
      const gaps = seededNoise(Math.floor(u * 180), Math.floor(v * 90), seed + 82) > 0.88 ? 0.18 : 1;
      const ringBand = THREE.MathUtils.smoothstep(1 - radial, 0.02, 0.94) * gaps;
      writeColor(ring, i, lerpColor(new THREE.Color("#d8c091"), amber, fine * 0.3), Math.round(ringBand * 170));
    }
  }

  return {
    map: makeTexture(color, size, THREE.SRGBColorSpace),
    bumpMap: makeTexture(bump, size),
    emissiveMap: makeTexture(glow, size, THREE.SRGBColorSpace),
    cloudMap: id === "udyoga" ? makeTexture(cloud, size, THREE.SRGBColorSpace) : undefined,
    ringMap: makeTexture(ring, size, THREE.SRGBColorSpace),
    roughness: id === "paywithease" ? 0.52 : id === "upaadi" ? 0.24 : 0.68,
    metalness: id === "upaadi" ? 0.22 : 0.04,
    bumpScale: id === "paywithease" ? 0.04 : id === "prism" ? 0.12 : 0.08,
    emissive: id === "prism" ? "#ff5a1f" : id === "paywithease" ? "#ffb33d" : id === "udyoga" ? "#8cff72" : "#75a9ff",
    emissiveIntensity: id === "prism" ? 1.35 : id === "pulse" ? 0.42 : 0.55,
  };
}

function createStarSurface() {
  const size = 256;
  const pixels = size * size * 4;
  const color = new Uint8Array(pixels);
  const glow = new Uint8Array(pixels);
  const bump = new Uint8Array(pixels);

  for (let y = 0; y < size; y++) {
    const v = y / (size - 1);
    for (let x = 0; x < size; x++) {
      const u = x / (size - 1);
      const i = (y * size + x) * 4;
      const plasma = fbm(u * 10, v * 10, 91);
      const filament = Math.abs(Math.sin((u * 18 + plasma * 5) * Math.PI) * Math.cos((v * 12 - plasma * 3) * Math.PI));
      const base = lerpColor(new THREE.Color("#0757b8"), new THREE.Color("#83a7f3"), plasma);
      base.lerp(new THREE.Color("#ffffff"), THREE.MathUtils.smoothstep(filament, 0.72, 1) * 0.55);
      const heat = 0.55 + filament * 0.4;
      writeColor(color, i, base, 255);
      writeColor(glow, i, base.clone().multiplyScalar(heat), 255);
      writeColor(bump, i, new THREE.Color(heat, heat, heat), 255);
    }
  }

  return {
    map: makeTexture(color, size, THREE.SRGBColorSpace),
    emissiveMap: makeTexture(glow, size, THREE.SRGBColorSpace),
    bumpMap: makeTexture(bump, size),
  };
}

/* ─── Procedural Planet Surface Shader ───────────────────────── */
/* ─── Individual Planet Component ─────────────────────────────── */
function Planet({
  data,
  isHovered,
}: {
  data: {
    id: string;
    colorHex: string;
    style: PlanetStyle;
    size: number;
    hasRing: boolean;
    hasMoon: boolean;
    axisTilt: number;
    rotationSpeed: number;
    atmosphereColor: string;
  };
  isHovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const surface = useMemo(() => createPlanetSurface(data.id as WorldType), [data.id]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Self-rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += data.rotationSpeed;
    }
    // Moon orbit
    if (moonRef.current && data.hasMoon) {
      const moonAngle = t * 1.2;
      const moonDist = data.size * 2.2;
      moonRef.current.position.set(
        Math.cos(moonAngle) * moonDist,
        Math.sin(moonAngle * 0.3) * 0.2,
        Math.sin(moonAngle) * moonDist
      );
      moonRef.current.rotation.y += 0.02;
    }
  });

  const hoverScale = isHovered ? 1.15 : 1.0;

  return (
    <group
      ref={groupRef}
      rotation={[data.axisTilt, 0, 0]}
    >
      {/* Planet body */}
      <mesh
        ref={planetRef}
        scale={[data.size * hoverScale, data.size * hoverScale, data.size * hoverScale]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 72, 72]} />
        <meshStandardMaterial
          map={surface.map}
          bumpMap={surface.bumpMap}
          bumpScale={surface.bumpScale}
          emissive={surface.emissive}
          emissiveMap={surface.emissiveMap}
          emissiveIntensity={surface.emissiveIntensity}
          roughness={surface.roughness}
          metalness={surface.metalness}
        />
      </mesh>

      {surface.cloudMap && (
        <mesh
          scale={[data.size * hoverScale * 1.025, data.size * hoverScale * 1.025, data.size * hoverScale * 1.025]}
          castShadow
        >
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            map={surface.cloudMap}
            transparent
            opacity={0.45}
            depthWrite={false}
            roughness={0.85}
            metalness={0}
          />
        </mesh>
      )}

      {/* Atmosphere shell */}
      <mesh scale={[data.size * hoverScale * 1.08, data.size * hoverScale * 1.08, data.size * hoverScale * 1.08]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={data.atmosphereColor}
          emissive={data.atmosphereColor}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
          transparent
          opacity={isHovered ? 0.18 : 0.08}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Planetary Ring (Saturn-like) */}
      {data.hasRing && (
        <mesh
          rotation={[Math.PI / 2.3, 0, 0]}
          scale={[data.size * hoverScale, data.size * hoverScale, data.size * hoverScale]}
          castShadow
          receiveShadow
        >
          <ringGeometry args={[1.35, 2.3, 96]} />
          <meshStandardMaterial
            map={surface.ringMap}
            transparent
            opacity={0.78}
            side={THREE.DoubleSide}
            metalness={0.08}
            roughness={0.72}
            alphaTest={0.05}
          />
        </mesh>
      )}

      {/* Moon */}
      {data.hasMoon && (
        <mesh ref={moonRef} castShadow receiveShadow>
          <sphereGeometry args={[data.size * 0.2, 24, 24]} />
          <meshStandardMaterial
            color="#9fa4a9"
            bumpMap={surface.bumpMap}
            bumpScale={0.05}
            roughness={0.9}
            metalness={0.02}
          />
        </mesh>
      )}

      {/* Planet glow light */}
      <pointLight
        color={data.colorHex}
        intensity={isHovered ? 5 : 1.5}
        distance={isHovered ? 8 : 5}
        decay={2}
      />
    </group>
  );
}

/* ─── Core Energy Particles ──────────────────────────────────── */
function CoreParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 500;

  const [positions, basePositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z;
    }
    return [pos, base];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const wave = Math.sin(t * 1.5 + i * 0.3) * 0.12;
      arr[i * 3] = basePositions[i * 3] * (1 + wave);
      arr[i * 3 + 1] = basePositions[i * 3 + 1] * (1 + wave);
      arr[i * 3 + 2] = basePositions[i * 3 + 2] * (1 + wave);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#0757b8"
        size={0.04}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* ─── Main Command Nexus Component ───────────────────────────── */
export default function CommandNexus() {
  const { activeWorld, hoveredWorld, transitioning } = useNexus();

  const coreRef = useRef<THREE.Mesh>(null);
  const shell1Ref = useRef<THREE.Mesh>(null);
  const shell2Ref = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const planetsRef = useRef<THREE.Group>(null);
  const starSurface = useMemo(() => createStarSurface(), []);

  /*
   * Orbital mechanics: Each planet has its own orbit radius, inclination,
   * and speed — carefully spaced so no two orbits intersect.
   * Like a real solar system: inner planets move faster, outer slower.
   */
  const planetsData = useMemo(() => {
    const configs: Array<{
      orbitRadius: number;
      orbitInclination: number;
      orbitSpeed: number;
      startAngle: number;
      style: PlanetStyle;
      size: number;
      hasRing: boolean;
      hasMoon: boolean;
      axisTilt: number;
      rotationSpeed: number;
      atmosphereColor: string;
    }> = [
      // Pulse — inner rocky world, fast orbit
      { orbitRadius: 4.5, orbitInclination: 0.05, orbitSpeed: 0.18, startAngle: 0,
        style: "ice", size: 0.72, hasRing: false, hasMoon: false, axisTilt: 0.1,
        rotationSpeed: 0.008, atmosphereColor: "#83a7f3" },
      // Prism — hot lava world, second orbit
      { orbitRadius: 6.0, orbitInclination: -0.08, orbitSpeed: 0.14, startAngle: Math.PI * 0.33,
        style: "lava", size: 0.86, hasRing: false, hasMoon: true, axisTilt: 0.2,
        rotationSpeed: 0.006, atmosphereColor: "#ff8a00" },
      // PaywithEase — ringed gas giant, third orbit
      { orbitRadius: 7.8, orbitInclination: 0.03, orbitSpeed: 0.10, startAngle: Math.PI * 0.67,
        style: "gas", size: 1.05, hasRing: true, hasMoon: true, axisTilt: 0.25,
        rotationSpeed: 0.01, atmosphereColor: "#ffe060" },
      // Upaadi — crystal world, fourth orbit
      { orbitRadius: 9.5, orbitInclination: -0.06, orbitSpeed: 0.08, startAngle: Math.PI,
        style: "crystal", size: 0.78, hasRing: false, hasMoon: false, axisTilt: 0.15,
        rotationSpeed: 0.007, atmosphereColor: "#c080ff" },
      // Udyoga — ocean world, fifth orbit
      { orbitRadius: 11.2, orbitInclination: 0.04, orbitSpeed: 0.06, startAngle: Math.PI * 1.33,
        style: "ocean", size: 0.92, hasRing: false, hasMoon: true, axisTilt: 0.3,
        rotationSpeed: 0.005, atmosphereColor: "#60ffa0" },
      // AI Interviewer — rocky outer world with ring, sixth orbit
      { orbitRadius: 13.0, orbitInclination: -0.03, orbitSpeed: 0.045, startAngle: Math.PI * 1.67,
        style: "rocky", size: 0.8, hasRing: true, hasMoon: false, axisTilt: 0.12,
        rotationSpeed: 0.009, atmosphereColor: "#6090ff" },
    ];

    return PRODUCTS.map((prod, idx) => ({
      id: prod.id,
      name: prod.name,
      colorHex: prod.colorHex,
      ...configs[idx],
    }));
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // ─── Core Sphere ───
    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.25;
      coreRef.current.rotation.x = elapsed * 0.1;
      const pulse = 1 + Math.sin(elapsed * 2) * 0.04;
      coreRef.current.scale.set(pulse, pulse, pulse);
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(elapsed * 2.5) * 0.4;
    }

    // ─── Crystal Shells ───
    if (shell1Ref.current) {
      shell1Ref.current.rotation.y = -elapsed * 0.1;
      shell1Ref.current.rotation.z = elapsed * 0.06;
    }
    if (shell2Ref.current) {
      shell2Ref.current.rotation.y = elapsed * 0.07;
      shell2Ref.current.rotation.x = -elapsed * 0.05;
    }

    // ─── Data Rings ───
    if (ring1Ref.current) { ring1Ref.current.rotation.x = elapsed * 0.2; ring1Ref.current.rotation.y = elapsed * 0.08; }
    if (ring2Ref.current) { ring2Ref.current.rotation.y = -elapsed * 0.15; ring2Ref.current.rotation.z = elapsed * 0.12; }
    if (ring3Ref.current) { ring3Ref.current.rotation.z = elapsed * 0.14; ring3Ref.current.rotation.x = -elapsed * 0.1; }

    // ─── Keplerian Orbit Motion ───
    if (planetsRef.current && activeWorld === "nexus" && !transitioning) {
      planetsRef.current.children.forEach((child, idx) => {
        const data = planetsData[idx];
        if (data) {
          const angle = data.startAngle + elapsed * data.orbitSpeed;
          const x = Math.cos(angle) * data.orbitRadius;
          const z = Math.sin(angle) * data.orbitRadius;
          // Inclination gives slight Y displacement based on orbital position
          const y = Math.sin(angle) * data.orbitInclination * data.orbitRadius;
          child.position.set(x, y, z);
        }
      });
    }
  });

  if (activeWorld !== "nexus" && !transitioning) return null;

  return (
    <group>
      {/* ═══ 1. AXIORA CORE — Central Star ═══ */}
      <group position={[0, 0, 0]}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[1.35, 72, 72]} />
          <meshStandardMaterial
            map={starSurface.map}
            bumpMap={starSurface.bumpMap}
            bumpScale={0.025}
            emissive="#83a7f3"
            emissiveMap={starSurface.emissiveMap}
            emissiveIntensity={1.9}
            metalness={0.02}
            roughness={0.38}
            toneMapped={false}
          />
        </mesh>

        <pointLight color="#8bb8ff" intensity={9} distance={35} decay={2} castShadow />

        <mesh scale={[1.82, 1.82, 1.82]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshBasicMaterial
            color="#83a7f3"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Crystal Shells */}
        <mesh ref={shell1Ref}>
          <icosahedronGeometry args={[1.6, 2]} />
          <meshPhysicalMaterial
            color="#83a7f3"
            metalness={0.2}
            roughness={0}
            transparent
            opacity={0.1}
            transmission={0.6}
            thickness={0.3}
            ior={1.8}
            envMapIntensity={2}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={shell2Ref}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0}
            transparent
            opacity={0.05}
            transmission={0.8}
            thickness={0.2}
            ior={1.5}
            envMapIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ═══ 2. HOLOGRAPHIC DATA RINGS ═══ */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.8, 0.03, 8, 48]} />
        <meshStandardMaterial color="#0757b8" emissive="#0757b8" emissiveIntensity={2.2} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[3.2, 0.02, 8, 48]} />
        <meshStandardMaterial color="#ff8a00" emissive="#ff8a00" emissiveIntensity={1.9} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[3.6, 0.015, 8, 48]} />
        <meshStandardMaterial color="#43ad2f" emissive="#43ad2f" emissiveIntensity={1.45} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* ═══ 3. CORE PARTICLES ═══ */}
      <CoreParticles />

      {/* ═══ 4. ORBIT PATH RINGS — faint guides ═══ */}
      <group>
        {planetsData.map((data, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + data.orbitInclination, 0, 0]}>
            <torusGeometry args={[data.orbitRadius, 0.005, 4, 64]} />
            <meshStandardMaterial
              color="#9fb8ff"
              emissive="#4060a0"
              emissiveIntensity={0.55}
              transparent
              opacity={0.18}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* ═══ 5. ORBITING PLANETS — Real planetary appearances ═══ */}
      <group ref={planetsRef}>
        {planetsData.map((prod) => (
          <Planet
            key={prod.id}
            data={prod}
            isHovered={hoveredWorld === prod.id}
          />
        ))}
      </group>
    </group>
  );
}
