"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNexus, PRODUCTS, WorldType } from "@/context/NexusContext";

/* ─── Procedural Planet Surface Shader ───────────────────────── */
function createPlanetMaterial(baseColor: string, style: "rocky" | "gas" | "ice" | "lava" | "ocean" | "crystal") {
  const base = new THREE.Color(baseColor);
  const props: Record<string, unknown> = {
    metalness: 0.15,
    roughness: 0.65,
    toneMapped: false,
  };

  switch (style) {
    case "rocky":
      props.color = base.clone().offsetHSL(0, -0.1, -0.05);
      props.emissive = base.clone().offsetHSL(0, 0, -0.3);
      props.emissiveIntensity = 0.3;
      props.roughness = 0.75;
      props.metalness = 0.1;
      break;
    case "gas":
      props.color = base;
      props.emissive = base.clone().offsetHSL(0, 0, -0.2);
      props.emissiveIntensity = 0.5;
      props.roughness = 0.4;
      props.metalness = 0.05;
      break;
    case "ice":
      props.color = base.clone().offsetHSL(0.05, 0.2, 0.15);
      props.emissive = base;
      props.emissiveIntensity = 0.4;
      props.roughness = 0.2;
      props.metalness = 0.6;
      break;
    case "lava":
      props.color = base.clone().offsetHSL(0, -0.1, -0.15);
      props.emissive = base;
      props.emissiveIntensity = 1.2;
      props.roughness = 0.8;
      props.metalness = 0.2;
      break;
    case "ocean":
      props.color = base.clone().offsetHSL(0, 0, -0.1);
      props.emissive = base.clone().offsetHSL(0, 0.1, -0.15);
      props.emissiveIntensity = 0.6;
      props.roughness = 0.3;
      props.metalness = 0.4;
      break;
    case "crystal":
      props.color = base;
      props.emissive = base;
      props.emissiveIntensity = 0.8;
      props.roughness = 0.1;
      props.metalness = 0.8;
      break;
  }

  return props as {
    color: THREE.Color;
    emissive: THREE.Color;
    emissiveIntensity: number;
    roughness: number;
    metalness: number;
    toneMapped: boolean;
  };
}

/* ─── Individual Planet Component ─────────────────────────────── */
function Planet({
  data,
  isHovered,
  onSelect,
  onHover,
  onUnhover,
}: {
  data: {
    id: string;
    colorHex: string;
    style: "rocky" | "gas" | "ice" | "lava" | "ocean" | "crystal";
    size: number;
    hasRing: boolean;
    hasMoon: boolean;
    axisTilt: number;
    rotationSpeed: number;
    atmosphereColor: string;
  };
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const matProps = useMemo(() => createPlanetMaterial(data.colorHex, data.style), [data.colorHex, data.style]);

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
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; onHover(); }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = "default"; onUnhover(); }}
    >
      {/* Planet body */}
      <mesh ref={planetRef} scale={[data.size * hoverScale, data.size * hoverScale, data.size * hoverScale]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

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
        <mesh rotation={[Math.PI / 2.3, 0, 0]} scale={[data.size * hoverScale, data.size * hoverScale, data.size * hoverScale]}>
          <ringGeometry args={[1.4, 2.1, 32]} />
          <meshStandardMaterial
            color={data.colorHex}
            emissive={data.colorHex}
            emissiveIntensity={0.6}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            metalness={0.5}
            roughness={0.4}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Moon */}
      {data.hasMoon && (
        <mesh ref={moonRef}>
          <sphereGeometry args={[data.size * 0.2, 12, 12]} />
          <meshStandardMaterial
            color="#c0c0c0"
            emissive={data.colorHex}
            emissiveIntensity={0.2}
            roughness={0.8}
            metalness={0.1}
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
        color="#00f3ff"
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
  const { activeWorld, selectWorld, hoveredWorld, setHoveredWorld, transitioning } = useNexus();

  const coreRef = useRef<THREE.Mesh>(null);
  const shell1Ref = useRef<THREE.Mesh>(null);
  const shell2Ref = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const planetsRef = useRef<THREE.Group>(null);

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
      style: "rocky" | "gas" | "ice" | "lava" | "ocean" | "crystal";
      size: number;
      hasRing: boolean;
      hasMoon: boolean;
      axisTilt: number;
      rotationSpeed: number;
      atmosphereColor: string;
    }> = [
      // Pulse — inner rocky world, fast orbit
      { orbitRadius: 4.5, orbitInclination: 0.05, orbitSpeed: 0.18, startAngle: 0,
        style: "ice", size: 0.45, hasRing: false, hasMoon: false, axisTilt: 0.1,
        rotationSpeed: 0.008, atmosphereColor: "#40e0ff" },
      // Prism — hot lava world, second orbit
      { orbitRadius: 6.0, orbitInclination: -0.08, orbitSpeed: 0.14, startAngle: Math.PI * 0.33,
        style: "lava", size: 0.55, hasRing: false, hasMoon: true, axisTilt: 0.2,
        rotationSpeed: 0.006, atmosphereColor: "#ff60a0" },
      // PaywithEase — ringed gas giant, third orbit
      { orbitRadius: 7.8, orbitInclination: 0.03, orbitSpeed: 0.10, startAngle: Math.PI * 0.67,
        style: "gas", size: 0.7, hasRing: true, hasMoon: true, axisTilt: 0.25,
        rotationSpeed: 0.01, atmosphereColor: "#ffe060" },
      // Upaadi — crystal world, fourth orbit
      { orbitRadius: 9.5, orbitInclination: -0.06, orbitSpeed: 0.08, startAngle: Math.PI,
        style: "crystal", size: 0.5, hasRing: false, hasMoon: false, axisTilt: 0.15,
        rotationSpeed: 0.007, atmosphereColor: "#c080ff" },
      // Udyoga — ocean world, fifth orbit
      { orbitRadius: 11.2, orbitInclination: 0.04, orbitSpeed: 0.06, startAngle: Math.PI * 1.33,
        style: "ocean", size: 0.6, hasRing: false, hasMoon: true, axisTilt: 0.3,
        rotationSpeed: 0.005, atmosphereColor: "#60ffa0" },
      // AI Interviewer — rocky outer world with ring, sixth orbit
      { orbitRadius: 13.0, orbitInclination: -0.03, orbitSpeed: 0.045, startAngle: Math.PI * 1.67,
        style: "rocky", size: 0.5, hasRing: true, hasMoon: false, axisTilt: 0.12,
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
          <icosahedronGeometry args={[1.0, 3]} />
          <meshStandardMaterial
            color="#40e0ff"
            emissive="#00d4ff"
            emissiveIntensity={2}
            metalness={0.3}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>

        <pointLight color="#00f3ff" intensity={8} distance={30} decay={2} />

        {/* Crystal Shells */}
        <mesh ref={shell1Ref}>
          <icosahedronGeometry args={[1.6, 2]} />
          <meshPhysicalMaterial
            color="#60c0ff"
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
            color="#b060ff"
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
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2.5} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[3.2, 0.02, 8, 48]} />
        <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={2} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[3.6, 0.015, 8, 48]} />
        <meshStandardMaterial color="#ffbe0b" emissive="#ffbe0b" emissiveIntensity={1.5} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* ═══ 3. CORE PARTICLES ═══ */}
      <CoreParticles />

      {/* ═══ 4. ORBIT PATH RINGS — faint guides ═══ */}
      <group>
        {planetsData.map((data, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + data.orbitInclination, 0, 0]}>
            <torusGeometry args={[data.orbitRadius, 0.005, 4, 64]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#4060a0"
              emissiveIntensity={0.3}
              transparent
              opacity={0.06}
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
            onSelect={() => selectWorld(prod.id as WorldType)}
            onHover={() => setHoveredWorld(prod.id as WorldType)}
            onUnhover={() => setHoveredWorld(null)}
          />
        ))}
      </group>
    </group>
  );
}
