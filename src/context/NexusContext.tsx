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
  fullImagePath?: string;
}

export interface ChatMessage {
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
}

type LeadStage = "name" | "intent" | "qualification" | "contact" | "consent" | "done";
type IntentArea =
  | "it_services"
  | "software_product"
  | "ai_automation"
  | "cloud_devops"
  | "data_analytics"
  | "qa_testing"
  | "staffing"
  | "managed_support"
  | "product_demo"
  | "career"
  | "general";

interface VisitorLead {
  intent?: IntentArea;
  interestArea?: string;
  projectSummary?: string;
  businessType?: string;
  projectStatus?: string;
  timeline?: string;
  budget?: string;
  location?: string;
  urgency?: string;
  productInterest?: string;
  demoPreference?: string;
  recommendedServiceOrProduct?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  consentToSave?: boolean;
  stage: LeadStage;
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
    colorHex: "#0757b8",
    imagePath: "/images/Axiorpulse-preview.jpg",
    fullImagePath: "/images/Axiorpulse.png",
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
    colorClass: "neon-gold",
    colorHex: "#ff8a00",
    imagePath: "/images/axioraprism-preview.jpg",
    fullImagePath: "/images/axioraprism.png",
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
    colorHex: "#ff8a00",
    imagePath: "/images/paywithease-preview.jpg",
    fullImagePath: "/images/paywithease.png",
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
    colorHex: "#83a7f3",
    imagePath: "/images/upaadi-preview.jpg",
    fullImagePath: "/images/upaadi.png",
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
    metric: "Rs 0",
    metricLabel: "Vendor Commissions Paid",
    colorClass: "neon-green",
    colorHex: "#43ad2f",
    imagePath: "/images/Udyoga-preview.jpg",
    fullImagePath: "/images/Udyoga.png",
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
    colorHex: "#003f8f",
    imagePath: "/images/AIInterviewer-preview.jpg",
    fullImagePath: "/images/AIInterviewer.png",
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
  const [visitorLead, setVisitorLead] = useState<VisitorLead>({ stage: "name" });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hi, I am Aira from Axiora Global Solutions. May I know your name?",
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

  const findProductFromText = (lower: string): ProductDetail | undefined => {
    if (lower.includes("pulse") || lower.includes("idea") || lower.includes("validation") || lower.includes("investor") || lower.includes("market")) {
      return PRODUCTS.find((product) => product.id === "pulse");
    }
    if (lower.includes("prism") || lower.includes("crm") || lower.includes("sales") || lower.includes("marketing") || lower.includes("employee")) {
      return PRODUCTS.find((product) => product.id === "prism");
    }
    if (lower.includes("pay") || lower.includes("payment") || lower.includes("finance") || lower.includes("invoice") || lower.includes("collection")) {
      return PRODUCTS.find((product) => product.id === "paywithease");
    }
    if (lower.includes("upaadi") || lower.includes("opportunity") || lower.includes("marketplace") || lower.includes("freelance") || lower.includes("incubation")) {
      return PRODUCTS.find((product) => product.id === "upaadi");
    }
    if (lower.includes("udyoga") || lower.includes("job") || lower.includes("candidate") || lower.includes("recruit") || lower.includes("workforce")) {
      return PRODUCTS.find((product) => product.id === "udyoga");
    }
    if (lower.includes("interview") || lower.includes("hiring") || lower.includes("screening") || lower.includes("assessment")) {
      return PRODUCTS.find((product) => product.id === "interview");
    }
    return undefined;
  };

  const includesAny = (lower: string, words: string[]) => words.some((word) => lower.includes(word));

  const detectIntent = (lower: string): IntentArea | undefined => {
    if (includesAny(lower, ["job", "career", "opening", "vacancy", "resume", "apply"])) return "career";
    if (includesAny(lower, ["demo", "product", "ai interviewer", "crm", "paywithease", "udyoga", "upaadi", "upadi", "imagine", "pulse", "prism"])) return "product_demo";
    if (includesAny(lower, ["staff", "developer", "dedicated team", "hiring team", "resource", "recruit"])) return "staffing";
    if (includesAny(lower, ["cloud", "devops", "aws", "azure", "google cloud", "gcp", "deployment", "migration", "infrastructure"])) return "cloud_devops";
    if (includesAny(lower, ["ai", "automation", "chatbot", "workflow", "machine learning", "analytics ai"])) return "ai_automation";
    if (includesAny(lower, ["saas", "mvp", "platform", "mobile app", "web app", "product development", "software product"])) return "software_product";
    if (includesAny(lower, ["data", "analytics", "dashboard", "reporting", "bi"])) return "data_analytics";
    if (includesAny(lower, ["qa", "testing", "test automation", "quality"])) return "qa_testing";
    if (includesAny(lower, ["managed it", "support", "maintenance", "monitoring"])) return "managed_support";
    if (includesAny(lower, ["it service", "it services", "software", "website", "app development", "enterprise"])) return "it_services";
    if (includesAny(lower, ["hello", "hi", "help", "enquiry", "inquiry"])) return "general";
    return undefined;
  };

  const intentLabel = (intent?: IntentArea) => {
    const labels: Record<IntentArea, string> = {
      it_services: "IT services",
      software_product: "SaaS/product development",
      ai_automation: "AI and automation",
      cloud_devops: "cloud/DevOps",
      data_analytics: "data and analytics",
      qa_testing: "QA/testing",
      staffing: "staffing or dedicated team",
      managed_support: "managed IT support",
      product_demo: "product demo",
      career: "career/job inquiry",
      general: "general enquiry",
    };
    return intent ? labels[intent] : "";
  };

  const inferEmail = (text: string) => text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];

  const inferPhone = (text: string) => {
    const phone = text.match(/(?:\+?\d[\s-]?){8,15}/)?.[0]?.trim();
    return phone;
  };

  const inferName = (text: string) => {
    const explicit = text.match(/(?:my name is|i am|i'm|this is)\s+([a-z][a-z\s.'-]{1,40})/i)?.[1]?.trim();
    if (explicit) return explicit.replace(/[.,!?]+$/, "");
    const clean = text.trim().replace(/[.,!?]+$/, "");
    if (/^[a-z][a-z\s.'-]{1,40}$/i.test(clean) && clean.split(/\s+/).length <= 4) return clean;
    return undefined;
  };

  const inferNameFromGreeting = (text: string) => {
    const name = inferName(text);
    if (name) return name;
    const clean = text.trim().replace(/[.,!?]+$/, "");
    if (/^[a-z][a-z\s.'-]{1,40}$/i.test(clean) && clean.split(/\s+/).length <= 4) return clean;
    return undefined;
  };

  const inferCompany = (text: string) => {
    const explicit = text.match(/(?:company is|from|at|work at|we are)\s+([a-z0-9&.,\s'-]{2,60})/i)?.[1]?.trim();
    if (explicit) return explicit.replace(/[.,!?]+$/, "");
    const clean = text.trim().replace(/[.,!?]+$/, "");
    if (clean.length >= 2 && clean.length <= 70) return clean;
    return undefined;
  };

  const inferBudget = (text: string, lower: string) => {
    const explicit = text.match(/(?:budget|around|approx|approximately|rs|inr|usd|\$)\s*[:\-]?\s*([a-z0-9,.\s$₹-]{2,40})/i)?.[0]?.trim();
    if (explicit) return explicit;
    if (includesAny(lower, ["no budget", "not sure", "estimate", "help estimate"])) return "Needs Axiora team estimate";
    return undefined;
  };

  const inferTimeline = (text: string, lower: string) => {
    const explicit = text.match(/(?:timeline|deadline|within|in|by|start)\s+([a-z0-9,\s-]{2,40})/i)?.[0]?.trim();
    if (explicit) return explicit;
    if (includesAny(lower, ["urgent", "asap", "immediately"])) return "Urgent / ASAP";
    if (includesAny(lower, ["this month", "next month", "quarter", "year"])) return text.trim();
    return undefined;
  };

  const inferLocation = (text: string) => {
    const explicit = text.match(/(?:based in|location is|from|city is|country is)\s+([a-z\s,.'-]{2,50})/i)?.[1]?.trim();
    return explicit?.replace(/[.,!?]+$/, "");
  };

  const classifyLead = (lead: VisitorLead) => {
    if (lead.intent === "career") return { type: "Support/career/general", score: "N/A" };
    if (lead.name && (lead.email || lead.phone) && lead.projectSummary && lead.timeline) return { type: "Hot lead", score: "85" };
    if ((lead.email || lead.phone) && (lead.intent || lead.projectSummary)) return { type: "Warm lead", score: "60" };
    if (lead.intent === "general" || !lead.email && !lead.phone) return { type: "Cold lead", score: "30" };
    return { type: "Warm lead", score: "50" };
  };

  const recommendService = (lead: VisitorLead) => {
    if (lead.productInterest) return lead.productInterest;
    const recommendations: Partial<Record<IntentArea, string>> = {
      it_services: "custom IT consulting and software delivery",
      software_product: "SaaS/MVP product development",
      ai_automation: "AI automation consulting and custom AI development",
      cloud_devops: "cloud architecture and DevOps implementation",
      data_analytics: "data dashboards and analytics engineering",
      qa_testing: "QA automation and testing services",
      staffing: "dedicated staffing or delivery team",
      managed_support: "managed IT support",
      product_demo: "Axiora product demo",
      career: "career/contact team",
      general: "Axiora consultation",
    };
    return recommendations[lead.intent || "general"] || "Axiora consultation";
  };

  const buildInternalSummary = (lead: VisitorLead) => {
    const quality = classifyLead(lead);
    return {
      lead_type: quality.type,
      lead_score: quality.score,
      visitor_name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      location: lead.location || "",
      interest_area: lead.interestArea || intentLabel(lead.intent),
      project_summary: lead.projectSummary || "",
      timeline: lead.timeline || "",
      budget: lead.budget || "",
      recommended_service_or_product: lead.recommendedServiceOrProduct || recommendService(lead),
      next_action: lead.intent === "career" ? "Route to careers/contact team" : "Schedule consultation or demo follow-up",
      consent_to_save: lead.consentToSave === true,
      conversation_summary: `${lead.name || "Visitor"} asked about ${lead.interestArea || intentLabel(lead.intent) || "Axiora"}. ${lead.projectSummary || "Requirement details are still limited."}`,
    };
  };

  const askNextQuestion = (lead: VisitorLead) => {
    if (!lead.intent || lead.intent === "general") {
      return `${lead.name ? `${lead.name}, choose one:` : "Choose one:"} services, AI, SaaS, cloud, staffing, career, or demo.`;
    }

    if (lead.intent === "career") {
      if (!lead.projectSummary) return "Which role are you interested in, and how many years of experience do you have?";
      if (!lead.email && !lead.phone) return "Thanks. Please share your email or phone number so the Axiora team can guide you on career options.";
      return "May I collect your name and current city as well?";
    }

    if (lead.intent === "product_demo") {
      if (!lead.productInterest) return "Which Axiora product do you want to demo?";
      if (!lead.demoPreference) return "Would you like a demo, pricing discussion, or technical consultation?";
      return "May I collect your name, email or phone, and company name so the Axiora team can follow up?";
    }

    if (lead.intent === "ai_automation") {
      if (!lead.projectSummary) return "Which process do you want to automate: chatbot, workflow, AI analytics, hiring automation, or custom AI?";
      if (!lead.projectStatus) return "Do you already have data, tools, or systems that need integration?";
    } else if (lead.intent === "software_product") {
      if (!lead.projectSummary) return "Is this an MVP, existing product upgrade, or full-scale platform?";
      if (!lead.projectStatus) return "Do you need web, mobile, admin dashboard, APIs, or all of these?";
    } else if (lead.intent === "cloud_devops") {
      if (!lead.projectSummary) return "Are you planning cloud migration, deployment automation, infrastructure setup, or performance optimization?";
      if (!lead.projectStatus) return "Which cloud platform do you use or prefer: AWS, Azure, Google Cloud, or another?";
    } else if (lead.intent === "staffing") {
      if (!lead.projectSummary) return "Which roles are you looking for, and how many specialists do you need?";
      if (!lead.timeline) return "Is this short-term, long-term, or dedicated team hiring?";
    } else if (!lead.projectSummary) {
      return "What type of solution are you planning to build or improve?";
    }

    if (!lead.businessType && !["staffing", "cloud_devops"].includes(lead.intent)) return "Is this for a startup, small business, or enterprise?";
    if (!lead.timeline) return "What is your preferred timeline?";
    if (!lead.budget) return "Do you have a rough budget range, or should our team help estimate it?";
    if (!lead.location) return "Which country or city is your business based in?";
    return "Thanks, I have a good idea of your requirement. May I collect your name, email, phone number, and company name so the Axiora team can follow up?";
  };

  const updateLeadFromMessage = (text: string, lower: string, currentLead: VisitorLead) => {
    const nextLead: VisitorLead = { ...currentLead };
    const detectedIntent = detectIntent(lower);
    const matchedProduct = findProductFromText(lower);
    const email = inferEmail(text);
    const phone = inferPhone(text);
    const name = inferName(text);
    const company = inferCompany(text);
    const budget = inferBudget(text, lower);
    const timeline = inferTimeline(text, lower);
    const location = inferLocation(text);

    if (detectedIntent && detectedIntent !== "general") nextLead.intent = detectedIntent;
    if (!nextLead.intent && detectedIntent) nextLead.intent = detectedIntent;
    if (matchedProduct) {
      nextLead.intent = "product_demo";
      nextLead.productInterest = matchedProduct.name;
      nextLead.recommendedServiceOrProduct = matchedProduct.name;
    }
    if (!nextLead.interestArea && nextLead.intent) nextLead.interestArea = intentLabel(nextLead.intent);
    if (email) nextLead.email = email;
    if (phone) nextLead.phone = phone;
    if (!nextLead.name && name && !email && !phone) nextLead.name = name;
    if (!nextLead.company && company && ["contact", "consent"].includes(nextLead.stage)) nextLead.company = company;
    if (budget) nextLead.budget = budget;
    if (timeline) nextLead.timeline = timeline;
    if (location) nextLead.location = location;

    const intentOnlyAnswer = Boolean(detectedIntent && text.trim().length <= 35);
    if (!nextLead.projectSummary && !intentOnlyAnswer && text.trim().length > 8 && !email && !phone && !includesAny(lower, ["yes", "no", "ok", "thanks"])) {
      nextLead.projectSummary = text.trim();
    } else if (!nextLead.demoPreference && nextLead.intent === "product_demo" && includesAny(lower, ["demo", "pricing", "technical", "consultation"])) {
      nextLead.demoPreference = text.trim();
    } else if (!nextLead.projectStatus && nextLead.projectSummary && text.trim().length > 3 && !email && !phone) {
      nextLead.projectStatus = text.trim();
    }

    if (includesAny(lower, ["startup", "small business", "enterprise"])) nextLead.businessType = text.trim();
    if (includesAny(lower, ["urgent", "asap", "immediately"])) nextLead.urgency = "Urgent";
    nextLead.recommendedServiceOrProduct = recommendService(nextLead);
    return nextLead;
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = { sender: "user", text, timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiText = "";
      let targetWorld: WorldType | null = null;
      const matchedProduct = findProductFromText(lower);

      if (visitorLead.stage === "name" && !visitorLead.name) {
        const earlyIntent = detectIntent(lower);
        if (matchedProduct || (earlyIntent && earlyIntent !== "general")) {
          const seededLead: VisitorLead = {
            ...visitorLead,
            intent: matchedProduct ? "product_demo" : earlyIntent,
            interestArea: matchedProduct ? "product demo" : intentLabel(earlyIntent),
            productInterest: matchedProduct?.name || visitorLead.productInterest,
            recommendedServiceOrProduct: matchedProduct?.name || recommendService({ ...visitorLead, intent: earlyIntent }),
            stage: "name",
          };
          setVisitorLead(seededLead);
          setChatMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: `Sure, I can help with ${seededLead.productInterest || seededLead.interestArea}. May I know your name first?`,
              timestamp: new Date()
            }
          ]);
          return;
        }

        const visitorName = inferNameFromGreeting(text);
        if (!visitorName) {
          setChatMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: "Please share your name first, then I will help you.",
              timestamp: new Date()
            }
          ]);
          return;
        }

        const namedLead: VisitorLead = {
          ...visitorLead,
          name: visitorName,
          stage: visitorLead.intent ? "qualification" : "intent",
        };
        const nextQuestion = visitorLead.intent
          ? askNextQuestion(namedLead)
          : "What can I help with: services, AI, SaaS, cloud, staffing, career, or demo?";
        setVisitorLead(namedLead);
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `Nice to meet you, ${visitorName}. ${nextQuestion}`,
            timestamp: new Date()
          }
        ]);
        return;
      }

      const nextLead = updateLeadFromMessage(text, lower, visitorLead);

      if (includesAny(lower, ["password", "otp", "one time password", "bank details", "credit card", "debit card", "aadhaar", "aadhar", "pan number"])) {
        aiText = "Please do not share passwords, OTPs, bank details, government IDs, or confidential credentials here. I can still help with your Axiora enquiry.";
      } else if (lower.includes("home") || lower.includes("nexus") || lower.includes("back") || lower.includes("center")) {
        aiText = "Returning to Command Nexus. Calibrating core orbits...";
        targetWorld = "nexus";
      } else if (lower.includes("compare") || lower.includes("comparison") || lower.includes("matrix")) {
        aiText = "Opening Product Comparison. Short version: Pulse validates ideas, Prism manages marketing and sales, Paywith Ease handles financial operations, Upaadi connects opportunity ecosystems, Udyogaa improves hiring intelligence, and AI Interviewer automates interviews.";
        setComparisonOpen(true);
      } else if (lower.includes("contact") || lower.includes("sales") || lower.includes("talk") || lower.includes("meet") || lower.includes("demo")) {
        aiText = matchedProduct
          ? `${matchedProduct.name} is a good fit for ${matchedProduct.subtitle.toLowerCase()}. Would you like a demo, pricing discussion, or technical consultation?`
          : "Sure. Would you like to book a call, request a demo, or share your requirement first?";
        setContactOpen(true);
        if (matchedProduct) targetWorld = matchedProduct.id;
      } else if (lower.includes("who are you") || lower.includes("what is axiora") || lower.includes("about axiora")) {
        aiText = "Axiora Global Solutions is a technology consulting and digital solutions company established in 2021. We build AI platforms, SaaS systems, enterprise software, and cloud-native solutions. What are you looking to improve or build?";
      } else if (lower.includes("price") || lower.includes("pricing") || lower.includes("cost")) {
        aiText = "Pricing depends on scope, features, timeline, integrations, and team size. Share your requirement and timeline, and our team can estimate it.";
      } else if (lower.includes("service") || lower.includes("services")) {
        aiText = "Axiora helps with AI solutions, SaaS/product development, cloud/DevOps, data analytics, QA/testing, staffing, and managed IT support. Which area are you interested in?";
      } else if (nextLead.stage === "consent") {
        const agreed = includesAny(lower, ["yes", "agree", "ok", "okay", "sure", "consent"]);
        const declined = includesAny(lower, ["no", "do not", "dont", "don't", "not agree"]);
        if (agreed || declined) {
          nextLead.consentToSave = agreed;
          nextLead.stage = "done";
          if (agreed) void buildInternalSummary(nextLead);
          aiText = agreed
            ? "Thank you! I have saved your enquiry. The Axiora team will contact you soon."
            : "No problem. I will not save this chat. You can still ask me questions.";
        } else {
          aiText = "Please reply yes or no: do you agree that Axiora may save this chat and your contact details to respond to your enquiry?";
        }
      } else {
        const hasContact = Boolean(nextLead.name && (nextLead.email || nextLead.phone) && nextLead.company);
        if (hasContact && nextLead.stage !== "done") {
          nextLead.stage = "consent";
          aiText = "Thanks, I have your basic details. Do you agree that Axiora may save this chat and your contact details to respond to your enquiry?";
        } else {
          nextLead.stage = nextLead.intent ? (hasContact ? "consent" : "qualification") : "intent";
          aiText = askNextQuestion(nextLead);
          if (aiText.includes("May I collect your name") || aiText.includes("email, phone number, and company")) {
            nextLead.stage = "contact";
          }
        }
      }

      if (matchedProduct && !targetWorld) {
        targetWorld = matchedProduct.id;
      }

      setVisitorLead(nextLead);
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
