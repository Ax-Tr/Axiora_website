"use client";

import React from "react";
import { useNexus, PRODUCTS } from "@/context/NexusContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Activity, Cpu, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ProductComparison() {
  const { comparisonOpen, setComparisonOpen, selectWorld } = useNexus();

  return (
    <AnimatePresence>
      {comparisonOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-6xl h-[90vh] glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10 scanline"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40">
              <div>
                <h2 className="text-2xl font-bold tracking-wider text-neon-cyan flex items-center gap-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  AXIORA CORE COMPARISON MATRIX
                </h2>
                <p className="text-xs text-white/50 font-mono mt-1">
                  MODULE EVALUATION & SPECIFICATIONS
                </p>
              </div>
              <button
                onClick={() => setComparisonOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PRODUCTS.map((prod) => (
                  <motion.div
                    key={prod.id}
                    whileHover={{ y: -4, borderColor: prod.colorHex }}
                    className="p-5 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-between transition-all duration-300"
                    style={{
                      boxShadow: `0 4px 20px -5px ${prod.colorHex}20`
                    }}
                  >
                    <div>
                      {/* Name & Subtitle */}
                      <div className="flex items-start justify-between">
                        <div className="text-left">
                          <h3
                            className="text-xl font-bold tracking-wide"
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
                      className="mt-6 w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-mono text-white tracking-wider hover:border-white/30 transition-all duration-300 cursor-pointer"
                    >
                      ENTER WORLD
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/60 border-t border-white/10 flex justify-between items-center text-xs font-mono text-white/30">
              <span>AXIORA OS V3.0.0</span>
              <span>© {new Date().getFullYear()} AXIORA GLOBAL SOLUTIONS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
