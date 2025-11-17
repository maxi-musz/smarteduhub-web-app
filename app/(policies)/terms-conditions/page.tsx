import React from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import TermsConditionsContent from "@/components/policies/TermsConditionsContent";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <TermsConditionsContent />
      <Footer />
    </div>
  );
}
