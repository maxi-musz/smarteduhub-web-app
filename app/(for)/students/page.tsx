import React from "react";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HeroWithLaptop from "@/components/for/HeroWithLaptop";
import FreeTrialSection from "@/components/for/FreeTrialSection";
import FeatureGrid from "@/components/for/FeatureGrid";
// import FeatureHighlight from "@/components/for/FeatureHighlight";
// import CTASection from "@/components/for/CTASection";
import TabbedFeatureSection from "@/components/for/TabbedFeatureSection";
import MobileAppSection from "@/components/for/MobileAppSection";
import FAQSection from "@/components/for/FAQSection";
import { studentsData } from "@/data/landingPages";
import { studentsFAQ } from "@/data/faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Students",
  description:
    "Access your courses, submit assignments, track grades, and engage with interactive learning tools. SmartEdu Hub empowers students to take control of their education journey.",
  keywords: [
    "online learning",
    "student portal",
    "homework management",
    "assignment submission",
    "grade tracking",
    "course access",
    "digital learning",
    "study tools",
    "student dashboard",
    "educational platform",
  ],
};

export default function StudentsHomepage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroWithLaptop {...studentsData.hero} />

      <FreeTrialSection />

      <FeatureGrid {...studentsData.gettingStarted} />

      {studentsData.tabbedFeatures && (
        <div className="hidden lg:block">
          <TabbedFeatureSection data={studentsData.tabbedFeatures} />
        </div>
      )}

      {/* {studentsData.highlights && (
        <FeatureHighlight features={studentsData.highlights.features} />
      )} */}

      <MobileAppSection data={studentsData.mobileApp} />

      <FAQSection categories={studentsFAQ} />

      {/* {studentsData.cta && <CTASection {...studentsData.cta} />} */}

      <Footer />
    </div>
  );
}
