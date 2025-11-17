import React from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ResourcesContent from "@/components/product/ResourcesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Access educational guides, tutorials, documentation, and best practices for SmartEdu Hub. Everything you need to maximize your school management platform.",
  keywords: [
    "educational resources",
    "school management guides",
    "tutorials",
    "documentation",
    "best practices",
    "training materials",
    "user guides",
    "help resources",
  ],
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ResourcesContent />
      <Footer />
    </div>
  );
}
