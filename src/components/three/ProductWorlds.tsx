"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProductTextureKind = "ice" | "solar" | "metal" | "city" | "network" | "robot" | "moon";

function productNoise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 149.3 + y * 271.9 + seed * 53.1) * 43758.5453123;
  return n - Math.floor(n);
}

function productFbm(x: number, y: number, seed: number) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < 5; i++) {
    value += productNoise(x * frequency, y * frequency, seed + i * 19) * amplitude;
    amplitude *= 0.5;
    frequency *= 2.1;
  }
  return value;
}

function productLerp(a: THREE.Color, b: THREE.Color, t: number) {
  return a.clone().lerp(b, THREE.MathUtils.clamp(t, 0, 1));
}

function productWrite(data: Uint8Array, index: number, color: THREE.Color, alpha = 255) {
  data[index] = Math.round(THREE.MathUtils.clamp(color.r, 0, 1) * 255);
  data[index + 1] = Math.round(THREE.MathUtils.clamp(color.g, 0, 1) * 255);
  data[index + 2] = Math.round(THREE.MathUtils.clamp(color.b, 0, 1) * 255);
  data[index + 3] = alpha;
}

function createTexture(data: Uint8Array, size: number, colorSpace: THREE.ColorSpace = THREE.NoColorSpace) {
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createProductSurface(kind: ProductTextureKind, seed = 1) {
  const size = 192;
  const color = new Uint8Array(size * size * 4);
  const bump = new Uint8Array(size * size * 4);
  const emissive = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    const v = y / (size - 1);
    for (let x = 0; x < size; x++) {
      const u = x / (size - 1);
      const i = (y * size + x) * 4;
      const n = productFbm(u * 8, v * 8, seed);
      const fine = productFbm(u * 28, v * 18, seed + 27);
      let base = new THREE.Color("#7b8794");
      let h = 0.5 + fine * 0.25;
      let glow = new THREE.Color("#000000");

      if (kind === "ice") {
        const crack = Math.abs(Math.sin((u * 12 + n * 3) * Math.PI) * Math.cos((v * 10 - fine) * Math.PI));
        base = productLerp(new THREE.Color("#123b74"), new THREE.Color("#d9f5ff"), n * 0.9);
        base.lerp(new THREE.Color("#ffffff"), crack > 0.88 ? 0.5 : 0);
        h = 0.45 + crack * 0.4;
        glow = new THREE.Color("#7cd2ff").multiplyScalar(crack > 0.93 ? 0.75 : 0);
      } else if (kind === "solar") {
        const filament = Math.abs(Math.sin((u * 18 + n * 4) * Math.PI) * Math.cos((v * 12 + fine * 3) * Math.PI));
        base = productLerp(new THREE.Color("#7d2b00"), new THREE.Color("#ffbe54"), n);
        base.lerp(new THREE.Color("#fff3ba"), filament > 0.78 ? 0.55 : 0);
        h = 0.55 + filament * 0.32;
        glow = base.clone().multiplyScalar(0.85 + filament * 0.5);
      } else if (kind === "metal") {
        const brushed = 0.5 + Math.sin((u * 90 + fine * 3) * Math.PI) * 0.5;
        base = productLerp(new THREE.Color("#342511"), new THREE.Color("#d6a54b"), brushed * 0.55 + n * 0.35);
        h = 0.42 + brushed * 0.25;
        glow = new THREE.Color("#ffb33d").multiplyScalar(fine > 0.84 ? 0.28 : 0);
      } else if (kind === "city") {
        const windowRow = Math.floor(v * 40);
        const windowCol = Math.floor(u * 22);
        const lit = productNoise(windowCol, windowRow, seed) > 0.52;
        base = productLerp(new THREE.Color("#2e3a55"), new THREE.Color("#8290aa"), n * 0.45);
        h = 0.5 + n * 0.18;
        glow = new THREE.Color(lit ? "#ffd47a" : "#000000").multiplyScalar(lit ? 0.7 : 0);
      } else if (kind === "network") {
        const vein = Math.abs(Math.sin((u * 16 + n * 4) * Math.PI) * Math.sin((v * 14 - fine * 2) * Math.PI));
        base = productLerp(new THREE.Color("#173527"), new THREE.Color("#69b56a"), n);
        h = 0.46 + vein * 0.28;
        glow = new THREE.Color("#8cff72").multiplyScalar(vein > 0.88 ? 0.55 : 0);
      } else if (kind === "robot") {
        const seam = Math.min(
          Math.abs((u * 10) % 1 - 0.5),
          Math.abs((v * 7) % 1 - 0.5)
        );
        base = productLerp(new THREE.Color("#23314b"), new THREE.Color("#a9b7d1"), n * 0.6);
        base.lerp(new THREE.Color("#050b17"), seam < 0.035 ? 0.5 : 0);
        h = 0.54 + n * 0.14 - (seam < 0.035 ? 0.15 : 0);
        glow = new THREE.Color("#70a7ff").multiplyScalar(seam < 0.025 ? 0.55 : 0);
      } else if (kind === "moon") {
        const crater = Math.abs(Math.sin(u * 55 + n * 3) * Math.sin(v * 41 - fine * 2));
        base = productLerp(new THREE.Color("#4a4f57"), new THREE.Color("#b3b6bb"), n);
        base.lerp(new THREE.Color("#20242b"), crater > 0.92 ? 0.45 : 0);
        h = 0.52 + n * 0.2 - (crater > 0.92 ? 0.22 : 0);
      }

      productWrite(color, i, base, 255);
      productWrite(bump, i, new THREE.Color(h, h, h), 255);
      productWrite(emissive, i, glow, 255);
    }
  }

  return {
    map: createTexture(color, size, THREE.SRGBColorSpace),
    bumpMap: createTexture(bump, size),
    emissiveMap: createTexture(emissive, size, THREE.SRGBColorSpace),
  };
}

// ─── 1. Axiora Pulse: Executive Intelligence (Cyan) ───
export function PulseWorld({ position }: { position: [number, number, number] }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const barsRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const panelsRef = useRef<THREE.Group>(null);
  const surface = useMemo(() => createProductSurface("ice", 11), []);

  const barData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      arr.push({ x: Math.cos(angle) * 2.8, z: Math.sin(angle) * 2.8, h: 1 + Math.random() * 3, delay: Math.random() * Math.PI });
    }
    return arr;
  }, []);

  const panelData = useMemo(() => [
    { pos: [3.5, 1.5, 0] as [number,number,number], rot: [0, -0.4, 0] as [number,number,number], w: 1.8, h: 1.2 },
    { pos: [-3.5, 2, 0.5] as [number,number,number], rot: [0, 0.5, 0] as [number,number,number], w: 1.5, h: 1.0 },
    { pos: [0, 2.5, -3.5] as [number,number,number], rot: [0, 0, 0.1] as [number,number,number], w: 2, h: 0.8 },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) { globeRef.current.rotation.y = t * 0.15; }
    if (atmosphereRef.current) { atmosphereRef.current.rotation.y = -t * 0.08; }
    if (scanRef.current) {
      scanRef.current.rotation.z = -t * 0.4;
      scanRef.current.position.y = Math.sin(t * 1.2) * 0.3;
    }
    if (barsRef.current) {
      barsRef.current.children.forEach((c, i) => {
        const d = barData[i];
        if (d) { const s = 0.4 + Math.sin(t * 2 + d.delay) * 0.5; c.scale.set(1, s * d.h, 1); c.position.y = (s * d.h) / 2; }
      });
      barsRef.current.rotation.y = t * 0.08;
    }
    if (panelsRef.current) {
      panelsRef.current.children.forEach((c, i) => { c.position.y = panelData[i].pos[1] + Math.sin(t * 0.8 + i) * 0.2; });
    }
  });

  return (
    <group position={position}>
      {/* Holographic Globe */}
      <mesh ref={atmosphereRef} castShadow receiveShadow>
        <sphereGeometry args={[1.22, 72, 72]} />
        <meshStandardMaterial
          map={surface.map}
          bumpMap={surface.bumpMap}
          bumpScale={0.07}
          emissive="#78cfff"
          emissiveMap={surface.emissiveMap}
          emissiveIntensity={0.55}
          metalness={0.04}
          roughness={0.58}
        />
      </mesh>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.42, 48, 48]} />
        <meshPhysicalMaterial color="#9bd7ff" transparent opacity={0.16} side={THREE.BackSide} roughness={0.08} transmission={0.25} thickness={0.6} />
      </mesh>

      {/* Scanning Ring */}
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.03, 8, 32]} />
        <meshStandardMaterial color="#0757b8" emissive="#0757b8" emissiveIntensity={2.6} metalness={0.9} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* Revenue Tower Bars */}
      <group ref={barsRef} position={[0, -1.8, 0]}>
        {barData.map((d, i) => (
          <mesh key={i} position={[d.x, 0, d.z]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 1, 0.22]} />
            <meshStandardMaterial color="#496d8f" emissive="#83cfff" emissiveIntensity={0.45} metalness={0.35} roughness={0.38} />
          </mesh>
        ))}
      </group>

      {/* Holographic Data Panels */}
      <group ref={panelsRef}>
        {panelData.map((p, i) => (
          <mesh key={i} position={p.pos} rotation={p.rot}>
            <planeGeometry args={[p.w, p.h]} />
            <meshStandardMaterial color="#83a7f3" emissive="#0757b8" emissiveIntensity={0.9} transparent opacity={0.15} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Base Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#071523" emissive="#0e3550" emissiveIntensity={0.2} metalness={0.35} roughness={0.72} />
      </mesh>

      <pointLight color="#7ccfff" intensity={5} distance={15} decay={2} castShadow />
    </group>
  );
}

// ─── 2. Axiora Prism: CRM Galaxy (Magenta/Purple) ───
export function PrismWorld({ position }: { position: [number, number, number] }) {
  const galaxyRef = useRef<THREE.Points>(null);
  const nodesRef = useRef<THREE.Group>(null);
  const starSurface = useMemo(() => createProductSurface("solar", 23), []);
  const moonSurface = useMemo(() => createProductSurface("moon", 24), []);

  const particleCount = 800;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color("#ff8a00");
    const c2 = new THREE.Color("#0757b8");
    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 1.5) * 5;
      const branches = 3;
      const angle = ((i % branches) * (2 * Math.PI)) / branches + r * 1.5;
      pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.4;
      const mix = c1.clone().lerp(c2, Math.random());
      col[i * 3] = mix.r; col[i * 3 + 1] = mix.g; col[i * 3 + 2] = mix.b;
    }
    return [pos, col];
  }, []);

  const clientNodes = useMemo(() => [
    { pos: [2.5, 0.5, -2] as [number,number,number], size: 0.2, color: "#ff40a0" },
    { pos: [-3.2, -0.3, 1.5] as [number,number,number], size: 0.25, color: "#c040ff" },
    { pos: [1.5, 0.8, 3] as [number,number,number], size: 0.18, color: "#ff8a00" },
    { pos: [-1.8, -0.5, -2.8] as [number,number,number], size: 0.22, color: "#a050ff" },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (galaxyRef.current) galaxyRef.current.rotation.y = t * 0.08;
    if (nodesRef.current) {
      nodesRef.current.children.forEach((c, i) => {
        c.position.y = clientNodes[i].pos[1] + Math.sin(t * 0.5 + i * 2) * 0.15;
      });
    }
  });

  return (
    <group position={position}>
      {/* Central Star */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.72, 72, 72]} />
        <meshStandardMaterial
          map={starSurface.map}
          bumpMap={starSurface.bumpMap}
          bumpScale={0.035}
          emissive="#ff8a00"
          emissiveMap={starSurface.emissiveMap}
          emissiveIntensity={2.4}
          metalness={0.02}
          roughness={0.38}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#ffb15a" intensity={7} distance={14} decay={2} castShadow />

      {/* Galaxy Spiral */}
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>

      {/* Client Planet Nodes */}
      <group ref={nodesRef}>
        {clientNodes.map((n, i) => (
          <group key={i} position={n.pos}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[n.size, 32, 32]} />
              <meshStandardMaterial
                map={moonSurface.map}
                bumpMap={moonSurface.bumpMap}
                bumpScale={0.035}
                color={n.color}
                emissive={n.color}
                emissiveMap={moonSurface.emissiveMap}
                emissiveIntensity={0.35}
                metalness={0.05}
                roughness={0.72}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[n.size * 1.6, 12, 12]} />
              <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.5} transparent opacity={0.1} side={THREE.BackSide} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Orbital Rings */}
      {[2.5, 3.8].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.012, 6, 32]} />
          <meshStandardMaterial color="#ff8a00" emissive="#ff8a00" emissiveIntensity={1.3} transparent opacity={0.25} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 3. Paywith Ease: Financial Flow (Gold) ───
export function PaywithEaseWorld({ position }: { position: [number, number, number] }) {
  const torusRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const packetsRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const metalSurface = useMemo(() => createProductSurface("metal", 31), []);

  const packets = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) arr.push({ offset: (i / 10) * Math.PI * 2, speed: 1.2 + Math.random() * 1.5, size: 0.07 + Math.random() * 0.06 });
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (torusRef.current) { torusRef.current.rotation.x = t * 0.15; torusRef.current.rotation.y = t * 0.1; }
    if (coreRef.current) { coreRef.current.rotation.y = t * 0.3; const s = 1 + Math.sin(t * 2) * 0.05; coreRef.current.scale.set(s, s, s); }
    if (packetsRef.current) {
      packetsRef.current.children.forEach((c, i) => {
        const m = packets[i]; if (m) { const th = t * m.speed + m.offset; c.position.set(Math.cos(th) * 2.8, Math.sin(th) * 0.6, Math.sin(th) * 2.8); }
      });
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((c, i) => {
        const s = 1 + Math.sin(t * 0.8 + i * 1.5) * 0.1;
        c.scale.set(s, s, s);
      });
    }
  });

  return (
    <group position={position}>
      {/* Golden Core */}
      <mesh ref={coreRef} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.85, 2]} />
        <meshStandardMaterial
          map={metalSurface.map}
          bumpMap={metalSurface.bumpMap}
          bumpScale={0.045}
          emissive="#ff9b1a"
          emissiveMap={metalSurface.emissiveMap}
          emissiveIntensity={0.55}
          metalness={0.82}
          roughness={0.24}
        />
      </mesh>
      <pointLight color="#ffb15a" intensity={6} distance={15} decay={2} castShadow />

      {/* Transaction Flow Torus */}
      <mesh ref={torusRef} castShadow receiveShadow>
        <torusGeometry args={[2.8, 0.12, 16, 96]} />
        <meshStandardMaterial
          map={metalSurface.map}
          bumpMap={metalSurface.bumpMap}
          bumpScale={0.025}
          color="#e2ad56"
          emissive="#ff8a00"
          emissiveIntensity={0.28}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Energy Packets */}
      <group ref={packetsRef}>
        {packets.map((m, i) => (
          <mesh key={i}>
            <sphereGeometry args={[m.size, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffe080" emissiveIntensity={4} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Concentric Rings */}
      <group ref={ringsRef}>
        {[1.5, 2.0, 3.5].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.015, 4, 32]} />
            <meshStandardMaterial color="#ff8a00" emissive="#ff8a00" emissiveIntensity={1.8} transparent opacity={0.3 - i * 0.06} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Base Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#1b160d" emissive="#302000" emissiveIntensity={0.18} metalness={0.45} roughness={0.62} />
      </mesh>
    </group>
  );
}

// ─── 4. Upaadi: Opportunity City (Purple) ───
export function UpaadiWorld({ position }: { position: [number, number, number] }) {
  const skylineRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef<THREE.Mesh>(null);
  const citySurface = useMemo(() => createProductSurface("city", 43), []);

  const buildings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const r = 0.8 + Math.random() * 2.5;
      const a = (i / 20) * Math.PI * 2;
      arr.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, w: 0.25 + Math.random() * 0.35, h: 1.2 + Math.random() * 3, speed: 0.8 + Math.random() * 1.5, emissive: Math.random() * 0.5 + 0.5 });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (skylineRef.current) {
      skylineRef.current.children.forEach((c, i) => {
        const m = buildings[i]; if (m) { c.scale.set(1, 1 + Math.sin(t * m.speed) * 0.06, 1); }
      });
    }
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2 + Math.sin(t * 3) * 1;
    }
    if (portalRef.current) { portalRef.current.rotation.z = t * 0.3; portalRef.current.rotation.y = t * 0.1; }
  });

  return (
    <group position={position}>
      {/* City Skyline */}
      <group ref={skylineRef} position={[0, -1.8, 0]}>
        {buildings.map((m, i) => (
          <mesh key={i} position={[m.x, m.h / 2, m.z]} castShadow receiveShadow>
            <boxGeometry args={[m.w, m.h, m.w]} />
            <meshStandardMaterial
              map={citySurface.map}
              bumpMap={citySurface.bumpMap}
              bumpScale={0.035}
              emissive="#ffd47a"
              emissiveMap={citySurface.emissiveMap}
              emissiveIntensity={0.7 * m.emissive}
              metalness={0.22}
              roughness={0.46}
            />
          </mesh>
        ))}
      </group>

      {/* Central Beacon Tower */}
      <mesh ref={beaconRef} position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 7, 8]} />
        <meshStandardMaterial color="#c9dfff" emissive="#0757b8" emissiveIntensity={2.1} metalness={0.4} roughness={0.28} toneMapped={false} />
      </mesh>
      <pointLight color="#75a9ff" intensity={5} distance={15} decay={2} position={[0, 4, 0]} castShadow />

      {/* Portal Ring */}
      <mesh ref={portalRef} position={[0, 3, 0]}>
        <torusGeometry args={[1.5, 0.04, 8, 32]} />
        <meshStandardMaterial color="#83a7f3" emissive="#0757b8" emissiveIntensity={2.4} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* Base Grid Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
        <circleGeometry args={[4.5, 32]} />
        <meshStandardMaterial color="#121724" emissive="#192747" emissiveIntensity={0.22} metalness={0.4} roughness={0.68} />
      </mesh>
    </group>
  );
}

// ─── 5. Udyoga: Workforce Ecosystem (Green) ───
export function UdyogaWorld({ position }: { position: [number, number, number] }) {
  const nodesGroupRef = useRef<THREE.Group>(null);
  const hubRef = useRef<THREE.Mesh>(null);
  const networkSurface = useMemo(() => createProductSurface("network", 53), []);

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      arr.push({
        pos: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5),
        speed: 0.4 + Math.random() * 0.8, phase: Math.random() * Math.PI, size: 0.12 + Math.random() * 0.15,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (nodesGroupRef.current) {
      nodesGroupRef.current.children.forEach((c, i) => {
        const m = nodes[i]; if (m) {
          c.position.y = m.pos.y + Math.sin(t * m.speed + m.phase) * 0.2;
          c.position.x = m.pos.x + Math.cos(t * m.speed * 0.5 + m.phase) * 0.12;
        }
      });
    }
    if (hubRef.current) {
      hubRef.current.rotation.y = t * 0.2;
      const s = 1 + Math.sin(t * 1.5) * 0.05;
      hubRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      {/* Central Hub Node */}
      <mesh ref={hubRef} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.62, 2]} />
        <meshStandardMaterial
          map={networkSurface.map}
          bumpMap={networkSurface.bumpMap}
          bumpScale={0.055}
          emissive="#43ad2f"
          emissiveMap={networkSurface.emissiveMap}
          emissiveIntensity={0.9}
          metalness={0.12}
          roughness={0.5}
        />
      </mesh>
      <pointLight color="#79ff72" intensity={5.5} distance={15} decay={2} castShadow />

      {/* Network Nodes */}
      <group ref={nodesGroupRef}>
        {nodes.map((m, i) => (
          <group key={i} position={m.pos.toArray()}>
            <mesh castShadow receiveShadow>
              <dodecahedronGeometry args={[m.size, 1]} />
              <meshStandardMaterial
                map={networkSurface.map}
                bumpMap={networkSurface.bumpMap}
                bumpScale={0.035}
                emissive="#43ad2f"
                emissiveMap={networkSurface.emissiveMap}
                emissiveIntensity={0.65}
                metalness={0.08}
                roughness={0.55}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[m.size * 2, 8, 8]} />
              <meshStandardMaterial color="#43ad2f" emissive="#43ad2f" emissiveIntensity={0.4} transparent opacity={0.06} side={THREE.BackSide} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Outer Boundary Mesh */}
      <mesh>
        <icosahedronGeometry args={[3.5, 1]} />
        <meshStandardMaterial color="#43ad2f" emissive="#43ad2f" emissiveIntensity={0.45} transparent opacity={0.06} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Connection Web Lines (approximated with thin torus segments) */}
      {[1.5, 2.5, 3.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / (2 + i), i * 0.5, 0]}>
          <torusGeometry args={[r, 0.006, 3, 24]} />
          <meshStandardMaterial color="#43ad2f" emissive="#43ad2f" emissiveIntensity={1.35} transparent opacity={0.15} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 6. AI Interviewer: Autonomous Hiring Chamber (Blue) ───
export function InterviewerWorld({ position }: { position: [number, number, number] }) {
  const orbRef = useRef<THREE.Mesh>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.Group>(null);
  const podsRef = useRef<THREE.Group>(null);
  const robotSurface = useMemo(() => createProductSurface("robot", 67), []);

  const waves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) arr.push({ x: (i - 7) * 0.3, freq: 1.5 + Math.random() * 2.5, phase: Math.random() * Math.PI });
    return arr;
  }, []);

  const pods = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 5; i++) arr.push({ angle: (i / 5) * Math.PI * 2, speed: 0.3 + i * 0.08 });
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef.current) { orbRef.current.rotation.y = t * 0.25; orbRef.current.rotation.x = t * 0.12; }
    if (scanRingRef.current) { scanRingRef.current.rotation.z = t * 0.5; }
    if (waveRef.current) {
      waveRef.current.children.forEach((c, i) => {
        const m = waves[i]; if (m) { const h = 0.15 + Math.sin(t * m.freq + m.phase) * 0.7; c.scale.set(1, Math.max(0.1, h * 3), 1); }
      });
    }
    if (podsRef.current) {
      podsRef.current.children.forEach((c, i) => {
        const m = pods[i]; if (m) { const a = m.angle + t * m.speed; c.position.set(Math.cos(a) * 3, Math.sin(a * 2) * 0.3, Math.sin(a) * 3); }
      });
    }
  });

  return (
    <group position={position}>
      {/* AI Avatar Orb */}
      <mesh ref={orbRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          map={robotSurface.map}
          bumpMap={robotSurface.bumpMap}
          bumpScale={0.045}
          emissive="#0757b8"
          emissiveMap={robotSurface.emissiveMap}
          emissiveIntensity={0.9}
          metalness={0.48}
          roughness={0.28}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshStandardMaterial color="#0757b8" emissive="#0757b8" emissiveIntensity={0.55} transparent opacity={0.1} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <pointLight color="#75a9ff" intensity={5.5} distance={15} decay={2} castShadow />

      {/* Scanning Ring */}
      <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[2, 0.03, 12, 80]} />
        <meshStandardMaterial
          map={robotSurface.map}
          bumpMap={robotSurface.bumpMap}
          bumpScale={0.02}
          color="#7ca8d9"
          emissive="#0757b8"
          emissiveIntensity={1.1}
          metalness={0.72}
          roughness={0.22}
          toneMapped={false}
        />
      </mesh>

      {/* Audio Wave Bars */}
      <group ref={waveRef} position={[0, -2.2, 0]}>
        {waves.map((m, i) => (
          <mesh key={i} position={[m.x, 0, 0]}>
            <boxGeometry args={[0.12, 0.5, 0.12]} />
            <meshStandardMaterial color="#0757b8" emissive="#0757b8" emissiveIntensity={1.8} metalness={0.7} roughness={0.2} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Assessment Pods */}
      <group ref={podsRef}>
        {pods.map((_, i) => (
          <mesh key={i}>
            <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
            <meshStandardMaterial color="#83a7f3" emissive="#0757b8" emissiveIntensity={2.1} metalness={0.8} roughness={0.15} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Base Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#08101b" emissive="#001040" emissiveIntensity={0.2} metalness={0.45} roughness={0.62} />
      </mesh>
    </group>
  );
}
