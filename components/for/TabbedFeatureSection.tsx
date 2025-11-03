"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { TabbedFeatureData } from "@/types/landingPages";
import { useScrollTabs } from "@/hooks/useScrollTabs";

interface TabbedFeatureSectionProps {
  data: TabbedFeatureData;
}

export default function TabbedFeatureSection({
  data,
}: TabbedFeatureSectionProps) {
  const { sectionTitle, sectionSubtitle, tabs } = data;

  const { currentTab, setCurrentTab, containerRef } = useScrollTabs({
    totalTabs: tabs.length,
    lockDuration: 600,
    scrollThreshold: 10, // Reasonable threshold with accumulator
    enabled: true,
  });

  const activeContent = tabs[currentTab];

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-20 lg:py-28 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center overflow-x-auto scrollbar-hide gap-2 mb-[-1px]">
          {tabs.map((tab, index) => {
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(index)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-t-xl rounded-tl-none cursor-pointer",
                  currentTab === index
                    ? "text-white bg-gradient-to-br from-brand-primary to-brand-primary-hover"
                    : "text-white/70 bg-brand-primary/60 hover:bg-brand-primary/80"
                )}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Container with brand primary color */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-3xl rounded-tl-none shadow-2xl overflow-hidden">
          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 p-8 lg:p-12">
            {/* Left side - Contextual content */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start">
                <span className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  {activeContent.badge}
                </span>
              </div>

              {/* Content Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                {activeContent.contentTitle}
              </h2>

              {/* Description */}
              <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                {activeContent.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-white text-brand-primary hover:bg-gray-100"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-brand-primary"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try a Guided Tour
                </Button>
              </div>
            </div>

            {/* Right side - Media */}
            <div className="flex items-center justify-center">
              {activeContent.mediaType === "image" ? (
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] rounded-lg rounded-tl-none overflow-hidden shadow-xl">
                  <Image
                    src={activeContent.mediaSrc}
                    alt={activeContent.mediaAlt}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] rounded-lg overflow-hidden shadow-xl">
                  <video
                    src={activeContent.mediaSrc}
                    controls
                    className="w-full h-full object-cover object-right-top"
                    autoPlay
                    loop
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
