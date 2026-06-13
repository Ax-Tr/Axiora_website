"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNexus, PRODUCTS, WorldType } from "@/context/NexusContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  PhoneCall,
  X
} from "lucide-react";

export default function OverlayUI() {
  const {
    activeWorld,
    hoveredWorld,
    transitioning,
    comparisonOpen,
    aiAssistantOpen,
    contactOpen,
    selectWorld,
    goHome,
    setHoveredWorld,
    setComparisonOpen,
    setContactOpen,
    setAiAssistantOpen
  } = useNexus();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const wheelDeltaRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const lastScrollAtRef = useRef(0);

  useEffect(() => {
    const sequence: WorldType[] = ["nexus", ...PRODUCTS.map((product) => product.id)];
    const scrollThreshold = 520;
    const touchThreshold = 90;
    const cooldownMs = 2400;

    const canNavigate = () => {
      if (transitioning || lightboxImage || comparisonOpen || aiAssistantOpen || contactOpen) return false;
      return Date.now() - lastScrollAtRef.current > cooldownMs;
    };

    const navigateByDirection = (direction: 1 | -1) => {
      if (!canNavigate()) return;

      const currentIndex = Math.max(0, sequence.indexOf(activeWorld));
      const nextIndex = (currentIndex + direction + sequence.length) % sequence.length;
      const nextWorld = sequence[nextIndex];
      if (!nextWorld || nextWorld === activeWorld) return;

      lastScrollAtRef.current = Date.now();
      wheelDeltaRef.current = 0;
      setHoveredWorld(null);

      if (nextWorld === "nexus") {
        goHome();
      } else {
        selectWorld(nextWorld);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!canNavigate()) return;
      event.preventDefault();

      const now = Date.now();
      if (now - lastWheelAtRef.current > 650) {
        wheelDeltaRef.current = 0;
      }
      lastWheelAtRef.current = now;
      wheelDeltaRef.current += event.deltaY;
      if (Math.abs(wheelDeltaRef.current) < scrollThreshold) return;

      navigateByDirection(wheelDeltaRef.current > 0 ? 1 : -1);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!canNavigate() || touchStartYRef.current === null) return;

      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - endY;
      touchStartYRef.current = null;
      if (Math.abs(delta) < touchThreshold) return;

      navigateByDirection(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    activeWorld,
    aiAssistantOpen,
    comparisonOpen,
    contactOpen,
    goHome,
    lightboxImage,
    selectWorld,
    setHoveredWorld,
    transitioning,
  ]);

  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  // Find hovered product detail or selected product detail if none is hovered
  const focusedWorldId = hoveredWorld || (activeWorld !== "nexus" ? activeWorld : null);
  const focusedProduct = PRODUCTS.find((p) => p.id === focusedWorldId);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none font-sans overflow-hidden">
      
      {/* Top Header Telemetry */}
      <header
        className="z-40 flex items-center justify-between gap-2 pointer-events-auto rounded-lg px-2 py-1.5 border border-white/55 bg-[linear-gradient(180deg,#88a8f4_0%,#c8d8fb_58%,#f4f7ff_100%)] shadow-[0_14px_30px_rgba(7,87,184,0.16)] sm:gap-3 sm:px-3"
        style={{
          position: "fixed",
          top: "0.5rem",
          left: "0.5rem",
          right: "0.5rem",
          maxWidth: "calc(100vw - 1rem)",
        }}
      >
        {/* Logo & System status */}
        <button
          type="button"
          onClick={goHome}
          disabled={transitioning}
          aria-label="Return to Axiora Core"
          className="quiet-button relative h-8 w-[118px] shrink-0 overflow-hidden rounded-md transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue disabled:cursor-wait sm:h-10 sm:w-[190px] md:h-11 md:w-[230px]"
        >
          <Image
            src="/images/Axiora_Logo_Transparent.png"
            alt="Axiora Global"
            fill
            priority
            sizes="(max-width: 640px) 118px, (max-width: 768px) 190px, 230px"
            className="object-contain object-left"
          />
        </button>

        {/* Quick Nav Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setComparisonOpen(true)}
            aria-label="Open product comparison"
            className="quiet-button hidden sm:flex items-center justify-center px-3 py-2 bg-white/65 hover:bg-brand-blue/10 border border-brand-blue/15 rounded text-xs font-mono text-brand-ink/75 hover:text-brand-blue transition cursor-pointer"
          >
            COMPARE
          </button>

          <button
            onClick={() => setContactOpen(true)}
            aria-label="Open Axiora integration hub"
            className="quiet-button ml-auto px-2.5 py-2 bg-gradient-to-r from-brand-blue to-brand-blue-deep hover:from-brand-blue-deep hover:to-brand-blue border border-brand-blue/30 rounded text-xs font-mono text-white flex items-center gap-1.5 transition cursor-pointer shadow-[0_10px_24px_rgba(7,87,184,0.22)] sm:px-3"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">INTEGRATION HUB</span>
          </button>
        </div>
      </header>

      {/* Main Core HUD Layout Grid */}
      <div className="relative flex-1 w-full py-3 md:py-6 overflow-hidden min-h-0">

        {/* Left Side: Product Detail Cards */}
        <section className="pointer-events-auto absolute bottom-0 left-0 w-[calc(100vw-1rem)] sm:w-[min(24rem,calc(100vw-1.5rem))] xl:w-[26rem]">
          <AnimatePresence mode="wait">
            {focusedProduct ? (
              <motion.div
                key={focusedProduct.id}
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="brand-panel w-full rounded-lg p-3 border flex flex-col gap-2.5 overflow-y-auto max-h-[min(20rem,calc(100vh-10rem))] scrollbar-thin bg-[linear-gradient(180deg,#88a8f4_0%,#c8d8fb_58%,#f4f7ff_100%)] shadow-[0_18px_42px_rgba(7,87,184,0.18)] sm:max-h-[min(28rem,calc(100vh-12rem))] sm:p-4 sm:gap-3.5"
                style={{
                  borderColor: `${focusedProduct.colorHex}25`,
                  boxShadow: `0 18px 42px rgba(7, 87, 184, 0.18), 0 0 15px ${focusedProduct.colorHex}12`
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
                    onClick={() => setLightboxImage(focusedProduct.fullImagePath || focusedProduct.imagePath)}
                    className="relative cursor-pointer overflow-hidden rounded border border-white/10 bg-black/40 aspect-[16/10] flex items-center justify-center group pointer-events-auto"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setLightboxImage(focusedProduct.fullImagePath || focusedProduct.imagePath);
                      }
                    }}
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
                      className="quiet-button flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded text-[11px] font-mono font-bold text-white tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
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
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                className="brand-panel w-full rounded-lg p-4 border border-white/45 flex flex-col gap-3 scanline bg-[linear-gradient(180deg,#88a8f4_0%,#c8d8fb_58%,#f4f7ff_100%)] shadow-[0_18px_42px_rgba(7,87,184,0.18)] sm:p-5 sm:gap-4"
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
                  className="w-full py-2.5 bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-bold rounded-lg text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 shadow-[0_10px_24px_rgba(7,87,184,0.22)] hover:shadow-[0_14px_32px_rgba(7,87,184,0.32)] transition cursor-pointer brand-primary-action"
                >
                  ACTIVATE AI COMPANION
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Center Canvas Space is open for 3D interactions */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none">
          {/* Centered prompt hints */}
          {activeWorld === "nexus" && !hoveredWorld && (
            <div className="text-center font-mono space-y-1 text-brand-ink/45 animate-pulse text-[10px] md:text-xs">
              <p>[ SCROLL TO CHANGE PRODUCT WORLD ]</p>
              <p>ONE DELIBERATE SCROLL MOVES ONE ORBIT</p>
            </div>
          )}
        </div>

        {/* Right side intentionally stays open for the AI helper panel. */}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Product interface preview"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 md:p-8 pointer-events-auto cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full max-h-[82vh] overflow-hidden rounded-lg border border-white/15 bg-black/90 shadow-[0_0_60px_rgba(7,87,184,0.18)] p-1 flex items-center justify-center"
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
                aria-label="Close preview"
                className="absolute top-4 right-4 bg-black/80 hover:bg-white/10 text-white rounded-full w-8 h-8 flex items-center justify-center border border-white/15 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
            <div className="mt-4 flex flex-col items-center gap-1 text-[11px] font-mono text-white/50">
              <span className="text-white font-semibold">
                {PRODUCTS.find(p => (p.fullImagePath || p.imagePath) === lightboxImage)?.name} - Holographic Interface Preview
              </span>
              <span>CLICK OUTSIDE OR PRESS ESC TO CLOSE VIEWPORT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info / Telemetry Feed */}
      <footer className="hidden w-full sm:flex items-center justify-between pointer-events-auto text-[9px] font-mono text-brand-ink/45 border-t border-brand-blue/10 pt-3 mt-auto">
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
