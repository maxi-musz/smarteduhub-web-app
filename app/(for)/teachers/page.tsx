import React from "react";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HeroWithLaptop from "@/components/for/HeroWithLaptop";
import FreeTrialSection from "@/components/for/FreeTrialSection";
import FeatureGrid from "@/components/for/FeatureGrid";
import TabbedFeatureSection from "@/components/for/TabbedFeatureSection";
import MobileAppSection from "@/components/for/MobileAppSection";
import FAQSection from "@/components/for/FAQSection";
import { teachersData } from "@/data/landingPages";
import { teachersFAQ } from "@/data/faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Teachers",
  description:
    "Simplify classroom management, create engaging lessons, track student progress, and collaborate effectively. SmartEdu Hub provides teachers with powerful tools to enhance teaching and learning.",
  keywords: [
    "classroom management",
    "lesson planning",
    "grading system",
    "teacher tools",
    "student assessment",
    "attendance tracking",
    "assignment management",
    "teaching platform",
    "educator resources",
    "digital classroom",
  ],
};

export default function TeachersHomepage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroWithLaptop {...teachersData.hero} />

      <FreeTrialSection />

      <FeatureGrid {...teachersData.gettingStarted} />

      {teachersData.tabbedFeatures && (
        <div className="hidden lg:block">
          <TabbedFeatureSection data={teachersData.tabbedFeatures} />
        </div>
      )}

      {/* {teachersData.highlights && (
        <FeatureHighlight features={teachersData.highlights.features} />
      )} */}

      <MobileAppSection data={teachersData.mobileApp} />

      <FAQSection categories={teachersFAQ} />

      {/* {teachersData.cta && <CTASection {...teachersData.cta} />} */}

      <Footer />
    </div>
  );
}
