"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { faqData } from "@/data/faqData";
import FAQItem from "./FAQItem";
import CategoryTabs from "./CategoryTabs";

const FAQSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategorySlug, setActiveCategorySlug] = useState(faqData[0].slug);

  // Filter Questions based on Search Term
  const filteredQuestions = useMemo(() => {
    const currentCategory = faqData.find((c) => c.slug === activeCategorySlug);
    if (!currentCategory) return [];

    if (!searchTerm) {
      return currentCategory.questions;
    }

    return currentCategory.questions.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCategorySlug]);

  // Extract unique category slugs for the tabs
  const categories = faqData.map((c) => ({
    category: c.category,
    slug: c.slug,
  }));

  // Handle category click
  const handleCategoryChange = (slug: string) => {
    setActiveCategorySlug(slug);
    setSearchTerm("");
  };

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about SmartEduHub. Can't find what
            you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Navigation */}
          <div className="px-6 pt-6">
            <CategoryTabs
              categories={categories}
              activeSlug={activeCategorySlug}
              onSelectCategory={handleCategoryChange}
            />
          </div>

          {/* FAQ List */}
          <div className="pb-6">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((item) => (
                <FAQItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                />
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">
                  No results found for "{searchTerm}" in the{" "}
                  {
                    categories.find((c) => c.slug === activeCategorySlug)
                      ?.category
                  }{" "}
                  category.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary-hover transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
