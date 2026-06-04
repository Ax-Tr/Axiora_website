"use client";

import React, { useState } from "react";
import { useNexus, PRODUCTS } from "@/context/NexusContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Layers,
  ArrowLeft,
  Activity,
  Terminal,
  ChevronRight,
  Sparkles,
  PhoneCall
} from "lucide-react";

export default function OverlayUI() {
  const {
    activeWorld,
    hoveredWorld,
    transitioning,
    selectWorld,
    goHome,
    setHoveredWorld,
    setComparisonOpen,
    setContactOpen,
    setAiAssistantOpen
  } = useNexus();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Find hovered product detail or selected product detail if none is hovered
  const focusedWorldId = hoveredWorld || (activeWorld !== "nexus" ? activeWorld : null);
  const focusedProduct = PRODUCTS.find((p) => p.id === focusedWorldId);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none font-sans overflow-hidden">
      
      {/* Top Header Telemetry */}
      <header className="w-full flex items-center justify-between pointer-events-auto bg-black/35 backdrop-blur-sm border border-white/5 rounded-xl p-3 md:px-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {/* Logo & System status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
            <Layers className="w-4 h-4 animate-pulse" />
            <div className="absolute inset-0 border border-neon-cyan/20 rounded animate-ping opacity-25" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.25em] text-white">
              AXIORA<span className="text-neon-cyan font-light">GLOBAL</span>
            </h1>
            <p className="text-[9px] font-mono text-white/40 tracking-wider">
              BUSINESS OPERATING SYSTEM v3.0
            </p>
          </div>
        </div>

        {/* Realtime telemetries (Desktop only) */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono text-white/50">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span>NEXUS: CONNECTED</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-6">
            <Activity className="w-3.5 h-3.5 text-neon-cyan" />
            <span>SYS LATENCY: 2.14ms</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-6">
            <Terminal className="w-3.5 h-3.5 text-neon-magenta" />
            <span>AI ENGINE: CALIBRATED</span>
          </div>
        </div>

        {/* Quick Nav Tools */}
        <div className="flex items-center gap-3">
          {activeWorld !== "nexus" && (
            <button
              onClick={goHome}
              disabled={transitioning}
              className="px-3 py-1.5 bg-white/5 hover:bg-neon-cyan/15 border border-white/10 hover:border-neon-cyan/30 rounded text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO CORE</span>
            </button>
          )}
          
          <button
            onClick={() => setComparisonOpen(true)}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white/80 hover:text-white transition cursor-pointer"
          >
            COMPARE
          </button>

          <button
            onClick={() => setContactOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 hover:from-neon-cyan/40 hover:to-neon-blue/40 border border-neon-cyan/30 hover:border-neon-cyan/60 rounded text-xs font-mono text-neon-cyan flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.1)] hover:shadow-[0_0_16px_rgba(0,243,255,0.3)]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">INTEGRATION HUB</span>
          </button>
        </div>
      </header>

      {/* Main Core HUD Layout Grid */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-6 py-6 items-end overflow-hidden">
        
        {/* Left Side: Product Dock / Orbit Navigator */}
        <nav className="pointer-events-auto col-span-1 flex flex-col justify-center h-full max-h-[400px] my-auto gap-2 text-left bg-black/20 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-3 md:p-0 rounded-xl border border-white/5 md:border-none">
          <span className="text-[10px] font-mono text-white/40 tracking-[0.2em] mb-2 uppercase block">
            Orbiting Modules
          </span>
          <div className="space-y-1.5 md:space-y-2">
            {PRODUCTS.map((prod, idx) => {
              const isActive = activeWorld === prod.id;
              const isHovered = hoveredWorld === prod.id;
              return (
                <button
                  key={prod.id}
                  disabled={transitioning}
                  onMouseEnter={() => setHoveredWorld(prod.id)}
                  onMouseLeave={() => setHoveredWorld(null)}
                  onClick={() => selectWorld(prod.id)}
                  className={`w-full text-left py-2 px-3 rounded-lg border font-mono text-xs flex items-center justify-between transition-all duration-300 disabled:opacity-50 cursor-pointer ${
                    isActive
                      ? "bg-white/10 border-white/20 text-white"
                      : isHovered
                      ? "bg-white/5 border-white/10 text-white"
                      : "bg-transparent border-transparent text-white/45 hover:text-white/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isActive || isHovered ? prod.colorHex : "rgba(255,255,255,0.2)",
                        boxShadow: isActive || isHovered ? `0 0 8px ${prod.colorHex}` : "none"
                      }}
                    />
                    <span>0{idx + 1}</span>
                    <span className="tracking-wider">{prod.name}</span>
                  </div>
                  {(isActive || isHovered) && (
                    <ChevronRight className="w-3.5 h-3.5 animate-pulse" style={{ color: prod.colorHex }} />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Center Canvas Space is open for 3D interactions */}
        <div className="col-span-1 md:col-span-2 h-full flex items-center justify-center">
          {/* Centered prompt hints */}
          {activeWorld === "nexus" && !hoveredWorld && (
            <div className="text-center font-mono space-y-1 text-white/30 animate-pulse text-[10px] md:text-xs">
              <p>[ CLICK PLANETS OR USE NAVIGATOR ]</p>
              <p>HOLD & DRAG TO ROTATE NEXUS</p>
            </div>
          )}
        </div>

        {/* Right Side: Holographic Feature Detail Cards */}
        {/* Right Side: Holographic Feature Detail Cards */}
        <section className="pointer-events-auto col-span-1 md:col-span-1 flex flex-col justify-end h-full">
          <AnimatePresence mode="wait">
            {focusedProduct ? (
              <motion.div
                key={focusedProduct.id}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full glass-panel rounded-xl p-4 border flex flex-col gap-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[75vh] scrollbar-thin"
                style={{
                  borderColor: `${focusedProduct.colorHex}25`,
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 15px ${focusedProduct.colorHex}10`
                }}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border"
                      style={{
                        color: focusedProduct.colorHex,
                        borderColor: `${focusedProduct.colorHex}30`,
                        backgroundColor: `${focusedProduct.colorHex}10`
                      }}
                    >
                      {focusedProduct.subtitle.split(" ")[0]} MODULE
                    </span>
                    {activeWorld === focusedProduct.id && (
                      <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" title="System Active" />
                    )}
                  </div>
                  <h3
                    className="text-lg font-bold tracking-wide transition-colors duration-300"
                    style={{ color: focusedProduct.colorHex }}
                  >
                    {focusedProduct.name}
                  </h3>
                  <p className="text-[10px] text-white/50 font-mono mt-0.5">
                    {focusedProduct.subtitle}
                  </p>
                </div>

                {/* Tagline & Short Description */}
                <div className="border-l-2 pl-2 text-left" style={{ borderColor: focusedProduct.colorHex }}>
                  <p className="text-[11px] text-white font-medium italic mb-1">
                    &ldquo;{focusedProduct.tagline}&rdquo;
                  </p>
                  <p className="text-[10.5px] text-white/70 leading-relaxed font-light">
                    {focusedProduct.description}
                  </p>
                </div>

                {/* Mockup Hologram Interface Preview */}
                {focusedProduct.imagePath && (
                  <div
                    onClick={() => setLightboxImage(focusedProduct.imagePath)}
                    className="relative cursor-pointer overflow-hidden rounded border border-white/10 bg-black/40 aspect-[16/10] flex items-center justify-center group pointer-events-auto"
                    title="Click to view full interface mockup"
                  >
                    <Image
                      src={focusedProduct.imagePath}
                      alt={`${focusedProduct.name} UI Preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-white/50 tracking-wider bg-black/75 px-1.5 py-0.5 rounded border border-white/10 uppercase flex items-center gap-1 group-hover:text-white transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                      VIEW INTERFACE MODEL
                    </span>
                  </div>
                )}

                {/* Long Description (Deep-dive details) */}
                <p className="text-[10px] text-white/50 leading-relaxed font-mono font-light bg-white/[0.02] p-2 rounded border border-white/5">
                  {focusedProduct.longDescription}
                </p>

                {/* Performance stats */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-black/45 border border-white/5 font-mono">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[8px] text-white/40 block uppercase">METRIC INDEX</span>
                    <span className="text-xs font-bold text-white tracking-tight">{focusedProduct.metric}</span>
                    <span className="text-[7px] text-white/30 block tracking-tight leading-none">{focusedProduct.metricLabel}</span>
                  </div>
                  <div className="space-y-0.5 border-l border-white/5 pl-2.5 text-left">
                    <span className="text-[8px] text-white/40 block uppercase">SYSTEM PERFORMANCE</span>
                    <span className="text-xs font-bold text-white/80">{focusedProduct.specs.latency}</span>
                    <span className="text-[7px] text-white/30 block tracking-tight leading-none">Latency / Overhead</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-1 text-left">
                  <span className="text-[8px] font-mono text-white/45 tracking-widest uppercase">
                    CAPABILITY MATRIX
                  </span>
                  <ul className="grid grid-cols-1 gap-1 text-[10.5px]">
                    {focusedProduct.features.map((feat, i) => (
                      <li key={i} className="text-white/80 flex items-center gap-1.5">
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: focusedProduct.colorHex }}
                        />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1 mt-auto">
                  {activeWorld !== focusedProduct.id ? (
                    <button
                      onClick={() => selectWorld(focusedProduct.id)}
                      disabled={transitioning}
                      className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded text-[11px] font-mono font-bold text-white tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      ENTER MODULE WORLD
                    </button>
                  ) : (
                    <button
                      onClick={() => setContactOpen(true)}
                      className="flex-1 py-2 bg-gradient-to-r text-black font-bold rounded text-[11px] font-mono tracking-wider flex items-center justify-center gap-1.5 transition shadow-[0_0_15px_rgba(0,0,0,0.3)] cursor-pointer"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${focusedProduct.colorHex}, #ffffff)`
                      }}
                    >
                      REQUEST INTEGRATION
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              // Default Welcome Card (Command Nexus Home)
              <motion.div
                key="welcome-card"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                className="w-full glass-panel rounded-xl p-5 border border-white/15 flex flex-col gap-4 scanline shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-neon-cyan tracking-widest uppercase">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    SYSTEM TERMINAL ACTIVE
                  </div>
                  <h3 className="text-xl font-bold tracking-wide text-white mt-1">
                    AXIORA CORE
                  </h3>
                  <p className="text-[11px] text-white/50 font-mono mt-0.5">
                    Central Business Orchestrator
                  </p>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Welcome to the Command Nexus. Axiora orchestrates complex enterprise functions under a single, unified cognitive operating system. Select an orbiting product world to deploy integration modules.
                </p>

                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span>ACTIVE ORBITS</span>
                    <span className="text-white">6 SYSTEMS</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span>TELEMETRY FEED</span>
                    <span className="text-neon-cyan">RECEIVING...</span>
                  </div>
                </div>

                <button
                  onClick={() => setAiAssistantOpen(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold rounded-lg text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,243,255,0.25)] hover:shadow-[0_0_18px_rgba(0,243,255,0.4)] transition cursor-pointer"
                >
                  ACTIVATE AI COMPANION
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 md:p-8 pointer-events-auto cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full max-h-[82vh] overflow-hidden rounded-xl border border-white/15 bg-black/90 shadow-[0_0_60px_rgba(0,243,255,0.15)] p-1 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking modal contents
            >
              {lightboxImage && (
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={lightboxImage}
                    alt="Product Interface Preview"
                    fill
                    sizes="100vw"
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-white/10 text-white rounded-full w-8 h-8 flex items-center justify-center border border-white/15 transition cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
            <div className="mt-4 flex flex-col items-center gap-1 text-[11px] font-mono text-white/50">
              <span className="text-white font-semibold">
                {PRODUCTS.find(p => p.imagePath === lightboxImage)?.name} - Holographic Interface Preview
              </span>
              <span>CLICK OUTSIDE OR PRESS (✕) TO CLOSE VIEWPORT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info / Telemetry Feed */}
      <footer className="w-full flex items-center justify-between pointer-events-auto text-[9px] font-mono text-white/40 border-t border-white/5 pt-3 mt-auto">
        <div className="flex items-center gap-4">
          <span>COORDS: X_24.19 / Y_82.04 / Z_09.77</span>
          <span className="hidden sm:inline">FEEDRATE: 412 MB/S</span>
        </div>
        <div>
          <span>SECURITY SEC-GRID: ENABLED</span>
        </div>
      </footer>
    </div>
  );
}
