"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── 1. Axiora Pulse: Executive Intelligence (Cyan) ───
export function PulseWorld({ position }: { position: [number, number, number] }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const barsRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const panelsRef = useRef<THREE.Group>(null);

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
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00e8ff" emissiveIntensity={1.5} metalness={0.5} roughness={0.25} toneMapped={false} />
      </mesh>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.6} transparent opacity={0.08} side={THREE.BackSide} toneMapped={false} />
      </mesh>

      {/* Scanning Ring */}
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.03, 8, 32]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={3} metalness={0.9} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* Revenue Tower Bars */}
      <group ref={barsRef} position={[0, -1.8, 0]}>
        {barData.map((d, i) => (
          <mesh key={i} position={[d.x, 0, d.z]}>
            <boxGeometry args={[0.22, 1, 0.22]} />
            <meshStandardMaterial color="#00e0ff" emissive="#00f3ff" emissiveIntensity={1.5} metalness={0.8} roughness={0.15} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Holographic Data Panels */}
      <group ref={panelsRef}>
        {panelData.map((p, i) => (
          <mesh key={i} position={p.pos} rotation={p.rot}>
            <planeGeometry args={[p.w, p.h]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1} transparent opacity={0.15} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Base Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#001822" emissive="#003040" emissiveIntensity={0.5} metalness={0.9} roughness={0.3} />
      </mesh>

      <pointLight color="#00f3ff" intensity={6} distance={15} decay={2} />
    </group>
  );
}

// ─── 2. Axiora Prism: CRM Galaxy (Magenta/Purple) ───
export function PrismWorld({ position }: { position: [number, number, number] }) {
  const galaxyRef = useRef<THREE.Points>(null);
  const nodesRef = useRef<THREE.Group>(null);

  const particleCount = 800;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color("#ff007f");
    const c2 = new THREE.Color("#9d00ff");
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
    { pos: [1.5, 0.8, 3] as [number,number,number], size: 0.18, color: "#ff60b0" },
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
      <mesh>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="#ff3090" emissive="#ff007f" emissiveIntensity={3} metalness={0.4} roughness={0.2} toneMapped={false} />
      </mesh>
      <pointLight color="#ff007f" intensity={8} distance={12} decay={2} />

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
            <mesh>
              <sphereGeometry args={[n.size, 16, 16]} />
              <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={2} metalness={0.6} roughness={0.2} toneMapped={false} />
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
          <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={1.5} transparent opacity={0.25} toneMapped={false} />
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
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial color="#ffd040" emissive="#ffbe0b" emissiveIntensity={2.5} metalness={0.9} roughness={0.1} toneMapped={false} />
      </mesh>
      <pointLight color="#ffbe0b" intensity={8} distance={15} decay={2} />

      {/* Transaction Flow Torus */}
      <mesh ref={torusRef}>
        <torusGeometry args={[2.8, 0.12, 8, 32]} />
        <meshStandardMaterial color="#ffc830" emissive="#ffbe0b" emissiveIntensity={1.5} metalness={0.85} roughness={0.12} toneMapped={false} />
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
            <meshStandardMaterial color="#ffbe0b" emissive="#ffbe0b" emissiveIntensity={2} transparent opacity={0.3 - i * 0.06} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Base Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#1a1200" emissive="#302000" emissiveIntensity={0.4} metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── 4. Upaadi: Opportunity City (Purple) ───
export function UpaadiWorld({ position }: { position: [number, number, number] }) {
  const skylineRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef<THREE.Mesh>(null);

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
          <mesh key={i} position={[m.x, m.h / 2, m.z]}>
            <boxGeometry args={[m.w, m.h, m.w]} />
            <meshStandardMaterial color="#7030c0" emissive="#9d00ff" emissiveIntensity={m.emissive} metalness={0.7} roughness={0.25} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Central Beacon Tower */}
      <mesh ref={beaconRef} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 7, 8]} />
        <meshStandardMaterial color="#c060ff" emissive="#9d00ff" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <pointLight color="#9d00ff" intensity={8} distance={15} decay={2} position={[0, 4, 0]} />

      {/* Portal Ring */}
      <mesh ref={portalRef} position={[0, 3, 0]}>
        <torusGeometry args={[1.5, 0.04, 8, 32]} />
        <meshStandardMaterial color="#c060ff" emissive="#b050ff" emissiveIntensity={3} metalness={0.8} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* Base Grid Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <circleGeometry args={[4.5, 32]} />
        <meshStandardMaterial color="#0d0020" emissive="#200040" emissiveIntensity={0.4} metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── 5. Udyoga: Workforce Ecosystem (Green) ───
export function UdyogaWorld({ position }: { position: [number, number, number] }) {
  const nodesGroupRef = useRef<THREE.Group>(null);
  const hubRef = useRef<THREE.Mesh>(null);

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
      <mesh ref={hubRef}>
        <dodecahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2.5} metalness={0.6} roughness={0.2} toneMapped={false} />
      </mesh>
      <pointLight color="#00ff88" intensity={8} distance={15} decay={2} />

      {/* Network Nodes */}
      <group ref={nodesGroupRef}>
        {nodes.map((m, i) => (
          <group key={i} position={m.pos.toArray()}>
            <mesh>
              <dodecahedronGeometry args={[m.size]} />
              <meshStandardMaterial color="#20ff90" emissive="#00ff88" emissiveIntensity={1.8} metalness={0.5} roughness={0.25} toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[m.size * 2, 8, 8]} />
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.4} transparent opacity={0.06} side={THREE.BackSide} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Outer Boundary Mesh */}
      <mesh>
        <icosahedronGeometry args={[3.5, 1]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} transparent opacity={0.06} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Connection Web Lines (approximated with thin torus segments) */}
      {[1.5, 2.5, 3.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / (2 + i), i * 0.5, 0]}>
          <torusGeometry args={[r, 0.006, 3, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.5} transparent opacity={0.15} toneMapped={false} />
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
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#2060ff" emissive="#0066ff" emissiveIntensity={2} metalness={0.7} roughness={0.15} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={0.6} transparent opacity={0.1} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <pointLight color="#0066ff" intensity={8} distance={15} decay={2} />

      {/* Scanning Ring */}
      <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.03, 8, 32]} />
        <meshStandardMaterial color="#4080ff" emissive="#0066ff" emissiveIntensity={3} metalness={0.9} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* Audio Wave Bars */}
      <group ref={waveRef} position={[0, -2.2, 0]}>
        {waves.map((m, i) => (
          <mesh key={i} position={[m.x, 0, 0]}>
            <boxGeometry args={[0.12, 0.5, 0.12]} />
            <meshStandardMaterial color="#3070ff" emissive="#0066ff" emissiveIntensity={2} metalness={0.7} roughness={0.2} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Assessment Pods */}
      <group ref={podsRef}>
        {pods.map((_, i) => (
          <mesh key={i}>
            <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
            <meshStandardMaterial color="#60a0ff" emissive="#0066ff" emissiveIntensity={2.5} metalness={0.8} roughness={0.15} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Base Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#000a20" emissive="#001040" emissiveIntensity={0.4} metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}
