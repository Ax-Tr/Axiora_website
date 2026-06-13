import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased select-none bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
