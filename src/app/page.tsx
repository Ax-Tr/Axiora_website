"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { NexusProvider } from "@/context/NexusContext";
import OverlayUI from "@/components/hud/OverlayUI";
import AIAssistant from "@/components/hud/AIAssistant";
import ProductComparison from "@/components/hud/ProductComparison";
import ContactCenter from "@/components/hud/ContactCenter";
import { Cpu } from "lucide-react";

// Dynamically load the R3F Canvas to prevent SSR issues (since Canvas relies on window/document)
const NexusCanvas = dynamic(() => import("@/components/three/NexusCanvas"), {
  ssr: false,
  loading: () => <LoadingScreen />
});

// Boot screen to simulate system initialization
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-[#020108] flex flex-col items-center justify-center font-mono text-xs select-none">
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="relative flex flex-col items-center space-y-6 max-w-sm w-full px-8">
        {/* Pulsing Core Ring */}
        <div className="relative w-16 h-16 border border-neon-cyan/35 rounded-full flex items-center justify-center">
          <div className="w-10 h-10 border border-dashed border-neon-cyan/60 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          <Cpu className="w-5 h-5 text-neon-cyan animate-pulse absolute" />
          <div className="absolute inset-0 border border-neon-cyan rounded-full animate-ping opacity-20" />
        </div>
        
        {/* Telemetry boot details */}
        <div className="text-center space-y-2 w-full">
          <h2 className="text-sm font-bold tracking-[0.2em] text-white">
            AXIORA CORE BOOT
          </h2>
          <div className="flex justify-between items-center text-[10px] text-white/40">
            <span>MEM SCAN: OK</span>
            <span>SEC SHIELD: ENGAGED</span>
          </div>
          <div className="h-[2px] w-full bg-white/10 rounded overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-3/4 bg-neon-cyan rounded shadow-[0_0_8px_#00f3ff] animate-pulse" />
          </div>
          <p className="text-[9px] text-neon-cyan/60 animate-pulse tracking-widest mt-1">
            ESTABLISHING COGNITIVE INTERFACE...
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper component to handle client-side initialization delay
function AppContent() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Show boot loading screen for a brief period to feel immersive
    const timer = setTimeout(() => {
      setBooting(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (booting) {
    return <LoadingScreen />;
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#020108]">
      {/* Background static grid for depth */}
      <div className="absolute inset-0 tech-grid opacity-25 z-0 pointer-events-none" />

      {/* 3D WebGL Canvas Layer */}
      <NexusCanvas />

      {/* 2D HUD Layout overlay */}
      <OverlayUI />

      {/* Modals & Toggles */}
      <AIAssistant />
      <ProductComparison />
      <ContactCenter />
    </main>
  );
}

export default function Home() {
  return (
    <NexusProvider>
      <AppContent />
    </NexusProvider>
  );
}
