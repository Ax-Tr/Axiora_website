"use client";

import React, { useEffect } from "react";
import { useNexus, PRODUCTS } from "@/context/NexusContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Activity, Cpu, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ProductComparison() {
  const { comparisonOpen, setComparisonOpen, selectWorld } = useNexus();

  useEffect(() => {
    if (!comparisonOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setComparisonOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [comparisonOpen, setComparisonOpen]);

  return (
    <AnimatePresence>
      {comparisonOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Axiora product comparison matrix"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-brand-blue/20 backdrop-blur-md sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="brand-panel w-full max-w-6xl h-[94vh] premium-surface rounded-lg flex flex-col overflow-hidden border border-brand-blue/15 scanline sm:h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 p-3 border-b border-brand-blue/10 bg-white/55 sm:p-6">
              <div>
                <h2 className="text-sm font-bold tracking-wider text-neon-cyan flex items-center gap-2 sm:text-2xl">
                  <Sparkles className="w-4 h-4 animate-pulse sm:w-6 sm:h-6" />
                  PRODUCT COMPARISON
                </h2>
                <p className="hidden text-xs text-white/50 font-mono mt-1 sm:block">
                  MODULE EVALUATION & SPECIFICATIONS
                </p>
              </div>
              <button
                onClick={() => setComparisonOpen(false)}
                aria-label="Close comparison matrix"
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 sm:p-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {PRODUCTS.map((prod) => (
                  <motion.div
                    key={prod.id}
                    whileHover={{ y: -4, borderColor: prod.colorHex }}
                    className="p-3 rounded-lg border border-brand-blue/10 bg-white/55 flex flex-col justify-between transition-all duration-300 sm:p-5"
                    style={{
                      boxShadow: `0 4px 20px -5px ${prod.colorHex}20`
                    }}
                  >
                    <div>
                      {/* Name & Subtitle */}
                      <div className="flex items-start justify-between">
                        <div className="text-left">
                          <h3
                            className="text-base font-bold tracking-wide sm:text-xl"
                            style={{ color: prod.colorHex }}
                          >
                            {prod.name}
                          </h3>
                          <p className="text-xs text-white/60 font-mono mt-0.5">
                            {prod.subtitle}
                          </p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono border h-fit"
                          style={{
                            borderColor: `${prod.colorHex}40`,
                            color: prod.colorHex,
                            backgroundColor: `${prod.colorHex}10`
                          }}
                        >
                          ACTIVE
                        </span>
                      </div>

                      {/* Product Interface Thumbnail */}
                      {prod.imagePath && (
                        <div className="relative mt-3 rounded overflow-hidden border border-white/10 bg-black/40 aspect-[16/9] flex items-center justify-center">
                          <Image
                            src={prod.imagePath}
                            alt={`${prod.name} Preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover opacity-50"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white/40">
                            MODEL PREVIEW
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-white/70 mt-3 leading-relaxed text-left">
                        {prod.description}
                      </p>

                      {/* Highlight Metric */}
                      <div className="my-4 p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-white/40 font-mono">
                          {prod.metricLabel}
                        </span>
                        <span
                          className="text-lg font-bold font-mono"
                          style={{ color: prod.colorHex }}
                        >
                          {prod.metric}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="space-y-1.5 border-t border-white/5 pt-3 text-left">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-white/40 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-white/30" />
                            LATENCY
                          </span>
                          <span className="text-white/80">{prod.specs.latency}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-white/40 flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-white/30" />
                            THROUGHPUT
                          </span>
                          <span className="text-white/80">{prod.specs.throughput}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-white/40 flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-white/30" />
                            SECURITY
                          </span>
                          <span className="text-white/80">{prod.specs.security}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mt-4 pt-3 border-t border-white/5 text-left">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block mb-1.5">
                          Capabilities
                        </span>
                        <ul className="space-y-1">
                          {prod.features.map((f, i) => (
                            <li key={i} className="text-xs text-white/60 flex items-center gap-1.5">
                              <span
                                className="w-1 h-1 rounded-full shrink-0"
                                style={{ backgroundColor: prod.colorHex }}
                              />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setComparisonOpen(false);
                        selectWorld(prod.id);
                      }}
                      aria-label={`Enter ${prod.name}`}
                    className="brand-primary-action mt-6 w-full py-2 bg-brand-blue hover:bg-brand-blue-deep border border-brand-blue/20 rounded-lg text-xs font-mono text-white tracking-wider transition-all duration-300 cursor-pointer shadow-[0_10px_22px_rgba(7,87,184,0.18)]"
                    >
                      ENTER WORLD
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-white/55 border-t border-brand-blue/10 flex justify-between items-center text-[10px] font-mono text-brand-ink/45 sm:p-4 sm:text-xs">
              <span>AXIORA OS V3.0.0</span>
              <span>{new Date().getFullYear()} AXIORA GLOBAL SOLUTIONS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
