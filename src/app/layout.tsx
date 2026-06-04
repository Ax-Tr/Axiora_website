import type { Metadata } from "next";
import { Space_Grotesk, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-tech-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Axiora Global Solutions | Axiora Business Operating System",
  description: "Experience the Axiora Business Operating System, a central AI Command Nexus managing six advanced enterprise platforms: Pulse, Prism, Paywith Ease, Upaadi, Udyoga, and AI Interviewer.",
  keywords: [
    "Axiora",
    "Business Operating System",
    "Enterprise AI",
    "Axiora Pulse",
    "Axiora Prism",
    "Paywith Ease",
    "Upaadi",
    "Udyoga",
    "AI Interviewer",
    "3D Business Dashboard"
  ],
  authors: [{ name: "Axiora Global Solutions" }],
  openGraph: {
    title: "Axiora Global Solutions | Axiora Business Operating System",
    description: "Futuristic enterprise operating system powered by AI. Seamlessly transition between Pulse, Prism, Paywith Ease, Upaadi, Udyoga, and AI Interviewer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${shareTechMono.variable}`}>
      <body className="antialiased select-none bg-[#04040d] text-[#f1f1f7]">
        {children}
      </body>
    </html>
  );
}
