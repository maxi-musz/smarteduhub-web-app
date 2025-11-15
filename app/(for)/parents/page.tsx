import React from "react";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HeroWithLaptop from "@/components/for/HeroWithLaptop";
import FreeTrialSection from "@/components/for/FreeTrialSection";
import FeatureGrid from "@/components/for/FeatureGrid";
import TabbedFeatureSection from "@/components/for/TabbedFeatureSection";
import MobileAppSection from "@/components/for/MobileAppSection";
import FAQSection from "@/components/for/FAQSection";
import { parentsData } from "@/data/landingPages";
import { parentsFAQ } from "@/data/faq";

export default function ParentsHomepage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroWithLaptop {...parentsData.hero} />

      <FreeTrialSection />

      <FeatureGrid {...parentsData.gettingStarted} />

      {parentsData.tabbedFeatures && (
        <div className="hidden lg:block">
          <TabbedFeatureSection data={parentsData.tabbedFeatures} />
        </div>
      )}

      {/* {parentsData.highlights && (
        <FeatureHighlight features={parentsData.highlights.features} />
      )} */}

      <MobileAppSection data={parentsData.mobileApp} />

      <FAQSection categories={parentsFAQ} />

      {/* {parentsData.cta && <CTASection {...parentsData.cta} />} */}

      <Footer />
    </div>
  );
}
