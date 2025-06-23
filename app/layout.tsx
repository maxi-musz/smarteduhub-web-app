import "@/app/globals.css";
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import VoiceflowAgent from "@/components/ai-agent/VoiceflowAgent";

export const metadata = {
  title: "SmartEdu Hub - Your School Management Solution",
  description:
    "SmartEdu Hub is your comprehensive solution for managing educational institutions. From student records to teacher tools, streamline your school's operations and enhance learning outcomes with our all-in-one platform.",
  keywords: [
    "school management",
    "education software",
    "student management",
    "teacher tools",
    "administrative operations",
    "academic reporting",
    "attendance tracking",
    "grades management",
    "parent communication",
    "school dashboard",
    "AI learning assistant",
    "curriculum management",
    "performance analytics",
    "education technology",
    "smart education",
  ],
  authors: [
    {
      name: "Best Technologies Ltd.",
      url: "https://besttechnologiesltd.com",
    },
  ],
  openGraph: {
    title: "SmartEdu Hub - Your School Management Solution",
    description:
      "Transform your school with SmartEdu Hub, the all-in-one platform for managing students, teachers, and administrative tasks. Streamline operations, enhance communication, and improve learning outcomes.",
    url: "https://smarteduhub.com",
    siteName: "SmartEdu Hub",
    images: [
      {
        url: "https://smarteduhub.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartEdu Hub - Your School Management Solution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartEdu Hub - Your School Management Solution",
    description:
      "Transform your school with SmartEdu Hub, the all-in-one platform for managing students, teachers, and administrative tasks. Streamline operations, enhance communication, and improve learning outcomes.",
    creator: "@Best Technologies Ltd.",
    images: ["https://besttechnologiesltd.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
            <VoiceflowAgent /> {/* Add the assistant here */}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
