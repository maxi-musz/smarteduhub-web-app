"use client";

import Testimonials from "@/components/home/Testimonials";

import Navigation from "@/components/home/Header";
import HeroSection from "@/components/home/Hero";
import PartnersSection from "@/components/home/Partners";
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeatureSection";
import FAQs from "@/components/home/FAQs";
import Footer from "@/components/home/Footer";

const Home = () => {
  return (
    <>
      {/* Navigation */}
      <Navigation />

      <div
        style={{
          background:
            "linear-gradient(to bottom, #F0F3FF 0%, #F0F3FF66 85%, #fff 100%)",
        }}
      >
        {/* Hero Section */}
        <HeroSection />

        {/* Partners Section - Infinite Loop */}
        <PartnersSection />
      </div>

      <main className="bg-white">
        {/* Features Section - Left Aligned */}
        <FeaturesSection />

        {/* Benefits Section - Blue Icons and Dots */}
        <BenefitsSection />

        {/* Testimonials Section - Proper Carousel */}
        <Testimonials />

        {/* FAQ Section - Working Accordion */}
        <FAQs />
      </main>

      {/* Footer - Side by Side Layout */}
      <Footer />
    </>
  );
};

export default Home;
