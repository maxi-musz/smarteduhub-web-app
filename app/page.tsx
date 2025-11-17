import React from "react";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HeroWithLaptop from "@/components/for/HeroWithLaptop";
import FreeTrialSection from "@/components/for/FreeTrialSection";
import FeatureGrid from "@/components/for/FeatureGrid";
import TabbedFeatureSection from "@/components/for/TabbedFeatureSection";
import MobileAppSection from "@/components/for/MobileAppSection";
import FAQSection from "@/components/for/FAQSection";
// import CTASection from "@/components/for/CTASection";
import { schoolsData } from "@/data/landingPages";
import { schoolsFAQ } from "@/data/faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartEdu Hub - Your School Management Solution",
  description:
    "Transform your educational institution with SmartEdu Hub's comprehensive school management platform. Streamline operations, enhance communication, and improve learning outcomes with our all-in-one solution for schools.",
  keywords: [
    "school management system",
    "education management software",
    "school administration",
    "student information system",
    "learning management system",
    "school operations",
    "educational technology",
    "school software",
    "academic management",
    "school platform",
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroWithLaptop {...schoolsData.hero} />

      <FreeTrialSection />

      <FeatureGrid {...schoolsData.gettingStarted} />

      {schoolsData.tabbedFeatures && (
        <div className="hidden lg:block">
          <TabbedFeatureSection data={schoolsData.tabbedFeatures} />
        </div>
      )}

      <MobileAppSection data={schoolsData.mobileApp} />

      <FAQSection categories={schoolsFAQ} />

      {/* {schoolsData.cta && <CTASection {...schoolsData.cta} />} */}

      <Footer />
    </div>
  );
}
