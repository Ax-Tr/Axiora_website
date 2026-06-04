"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNexus } from "@/context/NexusContext";
import { motion, AnimatePresence } from "framer-motion";
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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, aiAssistantOpen]);

  const quickPrompts = [
    { text: "Launch Axiora Pulse", cmd: "Take me to Axiora Pulse" },
    { text: "Open CRM Galaxy", cmd: "Open CRM Galaxy" },
    { text: "Compare All Modules", cmd: "Compare modules" },
    { text: "Request Integration", cmd: "Talk to sales" }
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
            className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-blue border border-neon-cyan/40 shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.7)] flex items-center justify-center cursor-pointer group hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-neon-cyan animate-ping opacity-25" />
            <Bot className="w-6 h-6 text-black group-hover:rotate-12 transition-transform duration-300" />
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
            className="fixed bottom-6 right-6 z-40 w-96 max-h-[500px] h-[80vh] glass-panel border border-neon-cyan/20 rounded-2xl flex flex-col overflow-hidden scanline shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/15 flex items-center justify-center border border-neon-cyan/30">
                    <Bot className="w-4 h-4 text-neon-cyan" />
                  </div>
                  {/* Waveform active simulation */}
                  <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider text-white flex items-center gap-1.5">
                    AXIORA AI HELPER
                  </h3>
                  <div className="flex items-center gap-1">
                    {/* Animated speech wave lines */}
                    <div className="flex items-center gap-[2px] h-3">
                      <div className="w-[1.5px] h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-[1.5px] h-2.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-[1.5px] h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-[9px] text-neon-cyan/60 font-mono">ONLINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed font-mono ${
                      msg.sender === "user"
                        ? "bg-neon-cyan/15 text-white border border-neon-cyan/30 rounded-tr-none shadow-[0_0_10px_rgba(0,243,255,0.05)]"
                        : "bg-white/5 text-white/80 border border-white/5 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Panel */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/50 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => sendChatMessage(qp.cmd)}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-neon-cyan/10 hover:text-neon-cyan border border-white/5 hover:border-neon-cyan/20 text-[10px] text-white/60 font-mono transition-all duration-300 cursor-pointer"
                >
                  {qp.text}
                </button>
              ))}
            </div>

            {/* Footer Input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-white/10 bg-black/80 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type command (e.g. 'Go to Pulse')..."
                className="flex-1 px-3 py-2 bg-black/60 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 rounded-lg text-xs font-mono text-white outline-none transition"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-neon-cyan text-black hover:shadow-[0_0_12px_rgba(0,243,255,0.5)] transition cursor-pointer"
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
