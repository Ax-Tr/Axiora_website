"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNexus } from "@/context/NexusContext";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Bot, X, Send } from "lucide-react";

export default function AIAssistant() {
  const {
    aiAssistantOpen,
    setAiAssistantOpen,
    chatMessages,
    sendChatMessage
  } = useNexus();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }, [chatMessages, aiAssistantOpen, prefersReducedMotion]);

  useEffect(() => {
    if (!aiAssistantOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAiAssistantOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aiAssistantOpen, setAiAssistantOpen]);

  const quickPrompts = [
    { text: "IT Services", cmd: "I am looking for IT services" },
    { text: "AI Solutions", cmd: "I need AI or automation support" },
    { text: "Build SaaS", cmd: "I want SaaS/product development" },
    { text: "Staffing", cmd: "I need staffing support" },
    { text: "Product Demo", cmd: "I want to book a product demo" }
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!aiAssistantOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setAiAssistantOpen(true)}
            aria-label="Open Aira assistant"
            className="fixed bottom-4 right-4 z-40 flex items-center justify-center rounded-full border border-white/55 bg-[linear-gradient(180deg,#88a8f4_0%,#c8d8fb_58%,#f4f7ff_100%)] p-3 shadow-[0_14px_30px_rgba(7,87,184,0.24)] transition-all duration-300 hover:scale-105 hover:shadow-[0_18px_40px_rgba(7,87,184,0.34)] cursor-pointer group sm:bottom-6 sm:right-6 sm:p-4"
          >
            <div className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-15" />
            <Bot className="w-6 h-6 text-brand-blue group-hover:rotate-12 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Console Overlay */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            role="dialog"
            aria-modal="true"
            aria-label="Aira assistant"
            className="brand-panel fixed bottom-20 right-3 z-[60] flex h-[min(340px,calc(100vh-6.5rem))] max-h-[340px] w-[min(19.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-lg border border-white/55 bg-[linear-gradient(180deg,#88a8f4_0%,#c8d8fb_58%,#f4f7ff_100%)] shadow-[0_18px_42px_rgba(7,87,184,0.22)] sm:bottom-24 sm:right-6 sm:h-[390px] sm:max-h-[390px] sm:w-[21rem]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-blue/15 bg-white/35 p-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border border-brand-blue/20 bg-white/60 shadow-[0_8px_18px_rgba(7,87,184,0.14)]">
                    <Image
                      src="/images/aira-avatar-small.png"
                      alt="Aira"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  {/* Waveform active simulation */}
                  <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-45"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-blue"></span>
                  </span>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-brand-ink sm:text-sm">
                    AIRA
                  </h3>
                  <div className="flex items-center gap-1">
                    {/* Animated speech wave lines */}
                    <div className="flex items-center gap-[2px] h-3">
                      <div className="w-[1.5px] h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-[1.5px] h-2.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-[1.5px] h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-[9px] text-brand-blue/70 font-mono">ONLINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAiAssistantOpen(false)}
                aria-label="Close AI helper"
                className="p-1 text-brand-ink/55 hover:text-brand-blue hover:bg-white/45 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-white/20 p-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[84%] rounded-xl p-2.5 font-mono text-[11px] leading-relaxed sm:text-xs ${
                      msg.sender === "user"
                        ? "bg-brand-blue/10 text-brand-ink border border-brand-blue/25 rounded-tr-none shadow-[0_8px_18px_rgba(7,87,184,0.08)]"
                        : "bg-white/48 text-brand-ink/80 border border-brand-blue/10 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Panel */}
            <div className="scrollbar-none flex gap-1.5 overflow-x-auto whitespace-nowrap border-t border-brand-blue/10 bg-white/30 px-3 py-2">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => sendChatMessage(qp.cmd)}
                  aria-label={qp.text}
                  className="rounded border border-brand-blue/10 bg-white/45 px-2 py-1 font-mono text-[10px] text-brand-ink/65 transition-all duration-300 hover:border-brand-blue/25 hover:bg-brand-blue/10 hover:text-brand-blue cursor-pointer"
                >
                  {qp.text}
                </button>
              ))}
            </div>

            {/* Footer Input */}
            <form
              onSubmit={handleSend}
              className="flex gap-2 border-t border-brand-blue/10 bg-white/45 p-2.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask or tell me why you came here..."
                aria-label="AI helper command"
                className="flex-1 px-3 py-2 bg-white/70 border border-brand-blue/15 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 rounded-lg text-xs font-mono text-brand-ink placeholder:text-brand-ink/45 outline-none transition"
              />
              <button
                type="submit"
                aria-label="Send AI helper command"
                className="p-2 rounded-lg bg-brand-blue text-white hover:bg-brand-blue-deep hover:shadow-[0_0_12px_rgba(7,87,184,0.28)] transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
