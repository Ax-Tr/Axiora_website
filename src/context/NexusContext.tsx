"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type WorldType = "nexus" | "pulse" | "prism" | "paywithease" | "upaadi" | "udyoga" | "interview";

export interface ProductDetail {
  id: WorldType;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  metric: string;
  metricLabel: string;
  colorClass: string;
  colorHex: string;
  features: string[];
  specs: {
    latency: string;
    throughput: string;
    security: string;
  };
  imagePath: string;
}

export interface ChatMessage {
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
}

export const PRODUCTS: ProductDetail[] = [
  {
    id: "pulse",
    name: "Axiora Pulse",
    subtitle: "AI-Powered Idea Validation Platform",
    tagline: "1st You Know. Before You Build.",
    description: "India's first AI-powered idea validation and decision-making engine. Turns any business concept into validated, investor-ready proof of demand in under 10 minutes.",
    longDescription: "Designed to bridge the startup validation gap. Autogenerates structured surveys covering Problem Awareness, Solution Fit, and Willingness to Pay. Distributes via WhatsApp and calculates a Market Interest Score (0-100) with a professional PDF output for VCs and angels.",
    metric: "99.8%",
    metricLabel: "Decision Accuracy Index",
    colorClass: "neon-cyan",
    colorHex: "#00f3ff",
    imagePath: "/images/Axiorpulse.png",
    features: [
      "AI Context Survey Generator",
      "Market Interest Score (0-100)",
      "Investor-Ready PDF Reports",
      "Smart WhatsApp Reminders",
      "DIY Research School Mode",
      "Consumer Sentiment Analytics"
    ],
    specs: {
      latency: "< 10 min build",
      throughput: "110k+ startups TAM",
      security: "DPDP Act Compliant"
    }
  },
  {
    id: "prism",
    name: "Axiora Prism",
    subtitle: "CRM Galaxy & Sales Coach",
    tagline: "Think like a marketer, act like a manager.",
    description: "AI-Powered All-in-One Marketing, Sales & Employee Performance CRM. Automates lead generation, ad campaigns, call analysis, and employee accountability in one platform.",
    longDescription: "Replaces 5-10 disconnected tools. Automatically generates platform-optimized daily ads (IG Reels, LinkedIn B2B, FB Storytelling), records and transcribes telecalls, analyzes communication quality via AI call coaching, and displays an Effort & Conversion Score.",
    metric: "+45%",
    metricLabel: "Average Sales Velocity",
    colorClass: "neon-magenta",
    colorHex: "#ff007f",
    imagePath: "/images/axioraprism.png",
    features: [
      "Auto AI Ad Creator (IG, FB, LI)",
      "Auto Dialer & Voice Recorder",
      "AI Call Analysis & Coaching",
      "Dynamic Accountability Tracker",
      "One-Click Performance Board",
      "Multi-Channel WhatsApp/Email API"
    ],
    specs: {
      latency: "Real-time sync",
      throughput: "150M node entities",
      security: "Zero-Trust Protocol"
    }
  },
  {
    id: "paywithease",
    name: "Paywith Ease",
    subtitle: "Business Payment Operating System",
    tagline: "Beyond gateways. Full financial control.",
    description: "AI-enabled business payment system that combines collections, installment tracking, and profit margins. Eliminates notebooks and Excel sheets for SMEs and training organizations.",
    longDescription: "Tracks verbal installment commitments, automates WhatsApp follow-ups, and maps cost-vs-margin to display net profits. Features OCR bank detail extraction (photo to text) and voice-based financial input for busy business owners.",
    metric: "$12B+",
    metricLabel: "Annual Flow Managed",
    colorClass: "neon-gold",
    colorHex: "#ffbe0b",
    imagePath: "/images/paywithease.png",
    features: [
      "Commitment Tracking Engine",
      "Installment Balances Auto-Calc",
      "Voice Margin & Cost Declarations",
      "OCR Bank Detail Scanner",
      "Auto WhatsApp Reminder Nudges",
      "SME GST Invoice & Payroll"
    ],
    specs: {
      latency: "< 50ms Settlement",
      throughput: "45k transactions/sec",
      security: "PCI-DSS Level 1 + HSM"
    }
  },
  {
    id: "upaadi",
    name: "Upaadi",
    subtitle: "Opportunity City Marketplace",
    tagline: "Build and scale in the city of opportunities.",
    description: "A decentralized gig economy and startup incubation marketplace. Connects founders with venture funding and matches freelancers with milestone-based projects.",
    longDescription: "Acts as the technical bridge for startup ecosystems. Offers virtual co-working visualization, milestone escrow contracts, IP protection registry, and hosts state-of-the-art incubation tools including Imagine AI (thought-to-media) and Hologram AI telepresence kiosk integrations.",
    metric: "50k+",
    metricLabel: "Collaborative Projects",
    colorClass: "neon-purple",
    colorHex: "#9d00ff",
    imagePath: "/images/upaadi.png",
    features: [
      "Imagine AI Thought Storyboards",
      "Holographic Telepresence Rooms",
      "Venture Capital Match Beacons",
      "Milestone Escrow Ledger",
      "P2P Co-Founder Discovery",
      "IP Ledger Protection"
    ],
    specs: {
      latency: "< 1s Feed updates",
      throughput: "1.2M matches/day",
      security: "Federated Cryptography"
    }
  },
  {
    id: "udyoga",
    name: "Udyogaa AI",
    subtitle: "Voice Employment & Hiring Intelligence",
    tagline: "Zero Vendor Commission. Zero Fake Profiles.",
    description: "India's first AI-driven IT hiring platform. Eliminates traditional recruitment vendor margins and Naukri sourcing fees using automated voice screening and backout risk analysis.",
    longDescription: "Utilizes PAN/Aadhar face matches to stop proxy interviews. Features a Backout Risk Predictor that assesses patterns (salary demands, time delays, counter-offers) to code candidates Green/Yellow/Red, alongside an AI Career Coach to guide employees to higher salary packages.",
    metric: "₹0",
    metricLabel: "Vendor Commissions Paid",
    colorClass: "neon-green",
    colorHex: "#00ff88",
    imagePath: "/images/Products.png",
    features: [
      "AI BG Check & Face Match",
      "Backout Probability Predictor",
      "Technical Voice Screening",
      "P2P Delivery Value Matrix",
      "AI Career & Salary Coach",
      "Salary Range Negotiation Advisor"
    ],
    specs: {
      latency: "Continuous Sync",
      throughput: "800k active members",
      security: "ISO 27001 Certified"
    }
  },
  {
    id: "interview",
    name: "AI Interviewer",
    subtitle: "Autonomous Hiring Chamber",
    tagline: "Replacing the interview process, not just matching.",
    description: "Autonomous AI hiring platform that fully automates the candidate screening, vetting, and assessment cycle. Operates on voice-based skill validation and anti-cheating vectors.",
    longDescription: "Eliminates recruiter bottlenecks and interview scheduling delays. The autonomous engine understands hiring criteria, holds full voice dialogs, scores candidates on technical/communication depth, and delivers structured recommendation briefs.",
    metric: "94%",
    metricLabel: "Hiring Lifecycle Savings",
    colorClass: "neon-blue",
    colorHex: "#0066ff",
    imagePath: "/images/Products.png",
    features: [
      "Autonomous Voice-Vetting",
      "Speech Vector & NLP Evaluation",
      "Anti-Cheating & Proxy Vetting",
      "Requirement Inquiry Generator",
      "Autonomous Close Negotiation",
      "Unified Vetting Briefs"
    ],
    specs: {
      latency: "< 100ms Speech NLP",
      throughput: "10k parallel interviews",
      security: "SOC2 Type II + GDPR"
    }
  }
];

interface NexusContextType {
  activeWorld: WorldType;
  hoveredWorld: WorldType | null;
  transitioning: boolean;
  comparisonOpen: boolean;
  aiAssistantOpen: boolean;
  contactOpen: boolean;
  chatMessages: ChatMessage[];
  selectWorld: (world: WorldType) => void;
  goHome: () => void;
  setHoveredWorld: (world: WorldType | null) => void;
  setComparisonOpen: (open: boolean) => void;
  setAiAssistantOpen: (open: boolean) => void;
  setContactOpen: (open: boolean) => void;
  sendChatMessage: (text: string) => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export function NexusProvider({ children }: { children: ReactNode }) {
  const [activeWorld, setActiveWorldState] = useState<WorldType>("nexus");
  const [hoveredWorld, setHoveredWorld] = useState<WorldType | null>(null);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [comparisonOpen, setComparisonOpen] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [contactOpen, setContactOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "System Initialized. Welcome to Axiora Core. How may I guide your navigation today? Click on any orbiting world or tell me where you'd like to go.",
      timestamp: new Date()
    }
  ]);

  const selectWorld = (world: WorldType) => {
    if (world === activeWorld || transitioning) return;
    setTransitioning(true);
    // Visual data-stream tunnel triggers, camera animate, then swap world
    setTimeout(() => {
      setActiveWorldState(world);
      // Wait for tunnel transition animation duration
      setTimeout(() => {
        setTransitioning(false);
      }, 1500);
    }, 800); // Time to slide in the tunnel
  };

  const goHome = () => {
    if (activeWorld === "nexus" || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveWorldState("nexus");
      setTimeout(() => {
        setTransitioning(false);
      }, 1500);
    }, 800);
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = { sender: "user", text, timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiText = "Searching command systems...";
      let targetWorld: WorldType | null = null;

      if (lower.includes("pulse") || lower.includes("decision") || lower.includes("intelligence")) {
        aiText = "Initializing transition to Axiora Pulse: Executive Decision Intelligence Center. Initiating warp sequence...";
        targetWorld = "pulse";
      } else if (lower.includes("prism") || lower.includes("crm") || lower.includes("galaxy")) {
        aiText = "Connecting to CRM Galaxy. Generating client constellation paths...";
        targetWorld = "prism";
      } else if (lower.includes("paywith") || lower.includes("ease") || lower.includes("finance") || lower.includes("financial")) {
        aiText = "Opening Paywith Ease flow dashboard. Loading real-time monetary streams...";
        targetWorld = "paywithease";
      } else if (lower.includes("upaadi") || lower.includes("opportunity") || lower.includes("city")) {
        aiText = "Routing navigation to Opportunity City. Aligning skyline coordinates...";
        targetWorld = "upaadi";
      } else if (lower.includes("udyoga") || lower.includes("workforce") || lower.includes("ecosystem") || lower.includes("network")) {
        aiText = "Mapping Workforce Ecosystem. Connecting to the global peer talent grid...";
        targetWorld = "udyoga";
      } else if (lower.includes("interview") || lower.includes("chamber") || lower.includes("hiring")) {
        aiText = "Entering AI Interviewer Autonomous Hiring Chamber. Energizing candidate scan matrices...";
        targetWorld = "interview";
      } else if (lower.includes("home") || lower.includes("nexus") || lower.includes("back") || lower.includes("center")) {
        aiText = "Returning to Command Nexus. Calibrating core orbits...";
        targetWorld = "nexus";
      } else if (lower.includes("compare") || lower.includes("comparison") || lower.includes("matrix")) {
        aiText = "Opening Product Comparison console. Analyzing modules side-by-side...";
        setComparisonOpen(true);
      } else if (lower.includes("contact") || lower.includes("sales") || lower.includes("talk") || lower.includes("meet")) {
        aiText = "Connecting you to the Axiora Integration Center. Please input your details.";
        setContactOpen(true);
      } else if (lower.includes("help") || lower.includes("what") || lower.includes("option")) {
        aiText = "I can guide you to any of our 6 modules (Pulse, Prism, Paywith Ease, Upaadi, Udyoga, AI Interviewer), compare them, or open the contact center. Where should we navigate?";
      } else {
        aiText = "Request received. Analyzing Axiora directory. Type 'Pulse', 'Prism', 'Paywith Ease', 'Upaadi', 'Udyoga', or 'Interviewer' to travel to those worlds directly.";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiText, timestamp: new Date() }
      ]);

      if (targetWorld) {
        selectWorld(targetWorld);
      }
    }, 1000);
  };

  return (
    <NexusContext.Provider
      value={{
        activeWorld,
        hoveredWorld,
        transitioning,
        comparisonOpen,
        aiAssistantOpen,
        contactOpen,
        chatMessages,
        selectWorld,
        goHome,
        setHoveredWorld,
        setComparisonOpen,
        setAiAssistantOpen,
        setContactOpen,
        sendChatMessage,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
}

export function useNexus() {
  const context = useContext(NexusContext);
  if (!context) throw new Error("useNexus must be used within a NexusProvider");
  return context;
}
