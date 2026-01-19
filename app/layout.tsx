import "@/app/globals.css";
import { ReactNode } from "react";
import { Averia_Serif_Libre, Delius } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import VoiceflowAgent from "@/components/ai-agent/VoiceflowAgent";
import CookieConsent from "@/components/ui/CookieConsent";
import type { Metadata, Viewport } from "next";

const averia = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-heading",
  display: "swap",
});

const delius = Delius({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://smarteduhub.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SmartEdu Hub - Your School Management Solution",
    template: "SmartEdu Hub - %s",
  },
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
  creator: "Best Technologies Ltd.",
  publisher: "Best Technologies Ltd.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "SmartEdu Hub - Your School Management Solution",
    description:
      "Transform your school with SmartEdu Hub, the all-in-one platform for managing students, teachers, and administrative tasks. Streamline operations, enhance communication, and improve learning outcomes.",
    url: siteUrl,
    siteName: "SmartEdu Hub",
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
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
    creator: "@smarteduhub",
    images: [`${siteUrl}/opengraph-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "SmartEdu Hub",
    url: siteUrl,
    logo: `${siteUrl}/logos/main-logo.svg`,
    description:
      "Comprehensive school management platform for educational institutions. Streamline operations, enhance communication, and improve learning outcomes.",
    sameAs: [
      "https://twitter.com/smarteduhub",
      "https://facebook.com/smarteduhub",
      "https://linkedin.com/company/smarteduhub",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@smarteduhub.com",
      availableLanguage: ["English"],
    },
  };

  return (
    <html
      lang="en"
      className={`${averia.variable} ${delius.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <QueryProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
              <VoiceflowAgent /> {/* Add the assistant here */}
              <CookieConsent /> {/* Cookie consent banner */}
            </TooltipProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
