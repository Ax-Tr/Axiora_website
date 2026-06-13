"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useNexus, PRODUCTS } from "@/context/NexusContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, ChevronRight, Terminal } from "lucide-react";

export default function ContactCenter() {
  const { contactOpen, setContactOpen } = useNexus();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    interest: "pulse",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = useCallback(() => {
    setContactOpen(false);
    // Reset form after exit animation completes
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        org: "",
        interest: "pulse",
        message: ""
      });
    }, 300);
  }, [setContactOpen]);

  useEffect(() => {
    if (!contactOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contactOpen, handleClose]);

  return (
    <AnimatePresence>
      {contactOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Axiora integration hub"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/85 backdrop-blur-md sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            className="w-full max-w-lg max-h-[94vh] glass-panel border border-neon-cyan/20 rounded-lg overflow-y-auto scanline relative"
            style={{
              boxShadow: "0 0 30px rgba(0, 243, 255, 0.15)"
            }}
          >
            {/* Top scanning line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between gap-3 p-4 border-b border-white/10 bg-black/50 sm:p-5">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-neon-cyan animate-pulse" />
                <div>
                  <h2 className="text-sm font-bold tracking-wider text-white sm:text-lg">
                    AXIORA INTEGRATION HUB
                  </h2>
                  <p className="text-[10px] text-white/40 font-mono">
                    SECURE INTAKE TRANSMISSION
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close integration hub"
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Success States */}
            <div className="p-4 sm:p-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Step indicators */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div
                      className={`h-1 w-12 rounded transition ${
                        step >= 1 ? "bg-neon-cyan shadow-[0_0_8px_rgba(7,87,184,0.45)]" : "bg-white/20"
                      }`}
                    />
                    <div
                      className={`h-1 w-12 rounded transition ${
                        step >= 2 ? "bg-neon-cyan shadow-[0_0_8px_rgba(7,87,184,0.45)]" : "bg-white/20"
                      }`}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <div>
                          <label htmlFor="contact-name" className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">
                            COMMANDER NAME
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/60 border border-white/15 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 rounded-lg text-sm text-white font-mono outline-none transition"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="contact-email" className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">
                            DIGITAL EMAIL
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            placeholder="Enter business email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/60 border border-white/15 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 rounded-lg text-sm text-white font-mono outline-none transition"
                          />
                        </div>

                        {/* Org */}
                        <div>
                          <label htmlFor="contact-org" className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">
                            ORGANIZATION / ENTERPRISE
                          </label>
                          <input
                            id="contact-org"
                            type="text"
                            required
                            placeholder="Enter company name"
                            value={formData.org}
                            onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/60 border border-white/15 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 rounded-lg text-sm text-white font-mono outline-none transition"
                          />
                        </div>

                        <button
                          type="button"
                          disabled={!formData.name || !formData.email || !formData.org}
                          onClick={() => setStep(2)}
                          className="w-full mt-2 py-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan rounded-lg text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                          PROCEED TO SPECS <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        {/* Selected Product */}
                        <div>
                          <label htmlFor="contact-interest" className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">
                            TARGET MODULE INTEREST
                          </label>
                          <select
                            id="contact-interest"
                            value={formData.interest}
                            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/60 border border-white/15 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 rounded-lg text-sm text-white font-mono outline-none transition"
                          >
                            {PRODUCTS.map((prod) => (
                              <option key={prod.id} value={prod.id} className="bg-[#0b0b14] text-white">
                                {prod.name} ({prod.subtitle})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Message */}
                        <div>
                          <label htmlFor="contact-message" className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">
                            INTEGRATION REQUIREMENTS
                          </label>
                          <textarea
                            id="contact-message"
                            rows={3}
                            required
                            placeholder="Describe your scaling or integration needs..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/60 border border-white/15 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 rounded-lg text-sm text-white font-mono outline-none transition resize-none"
                          />
                        </div>

                        <div className="flex gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-1/3 py-3 bg-white/5 border border-white/10 text-white/70 hover:text-white rounded-lg text-xs font-mono tracking-wider transition cursor-pointer"
                          >
                            BACK
                          </button>
                          <button
                            type="submit"
                            disabled={!formData.message}
                            className="flex-1 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-bold rounded-lg text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 shadow-[0_12px_28px_rgba(7,87,184,0.28)] hover:shadow-[0_16px_36px_rgba(7,87,184,0.38)] cursor-pointer"
                          >
                            TRANSMIT PACKET <Send className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-neon-green" />
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-wider text-neon-green uppercase font-mono">
                      TRANSMISSION SUCCESSFUL
                    </h3>
                    <p className="text-xs text-white/60 max-w-xs font-mono">
                      Data packet dispatched to Axiora Integration Team. Calibrating connection parameters.
                    </p>
                  </div>
                  <div className="p-3 bg-black/60 rounded border border-white/5 text-[10px] font-mono text-white/40 text-left w-full mt-4">
                    <p>HASH: 0x9AF8823B...</p>
                    <p>TARGET: {formData.interest.toUpperCase()}_WORLD</p>
                    <p>SENDER: {formData.name}</p>
                    <p>STATUS: COMMITTED_PENDING_REVIEW</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-white cursor-pointer"
                  >
                    DISMISS CONSOLE
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
