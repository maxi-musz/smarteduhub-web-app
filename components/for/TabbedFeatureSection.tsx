"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { GsapMorphButton } from "@/components/ui/gsapmorph-button";
import { TabbedFeatureData } from "@/types/landingPages";
import { useScrollTabs } from "@/hooks/useScrollTabs";

interface TabbedFeatureSectionProps {
  data: TabbedFeatureData;
}

export default function TabbedFeatureSection({
  data,
}: TabbedFeatureSectionProps) {
  const { sectionTitle, sectionSubtitle, tabs } = data;

  // console.log("[TabbedFeatureSection] Render", {
  //   totalTabs: tabs.length,
  //   tabTitles: tabs.map((t) => t.title),
  // });

  const { currentTab, setCurrentTab, containerRef, contentRef } = useScrollTabs(
    {
      totalTabs: tabs.length,
      enabled: true,
    }
  );

  const activeContent = tabs[currentTab];
  const prevTabRef = useRef(currentTab);

  console.log("[Current State]", {
    currentTab,
    activeTabTitle: activeContent.title,
  });

  // Animate content changes with GSAP
  useEffect(() => {
    if (!contentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const direction = currentTab > prevTabRef.current ? 1 : -1;

    console.log("🎬 [Animation] Tab changed", {
      from: prevTabRef.current,
      to: currentTab,
      direction: direction > 0 ? "forward" : "backward",
    });

    prevTabRef.current = currentTab;

    const content = contentRef.current;

    // Animate out and in
    gsap.fromTo(
      content,
      {
        opacity: 0,
        y: direction * 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          console.log("✨ [Animation] Complete for tab", currentTab);
        },
      }
    );
  }, [currentTab, contentRef]);

  return (
    <section
      id="features"
      ref={containerRef}
      className="min-h-screen relative mb-20 lg:mb-28"
    >
      <div className="container mx-auto px-4 py-8 lg:py-12 flex flex-col">
        {/* Section Heading */}
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center overflow-x-auto scrollbar-hide gap-2 mb-[-1px] z-10">
          {tabs.map((tab, index) => {
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(index)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-t-xl rounded-tl-none cursor-pointer",
                  currentTab === index
                    ? "text-white bg-gradient-to-br from-brand-primary to-brand-primary-hover scale-105"
                    : "text-white/70 bg-brand-primary/60 hover:bg-brand-primary/80"
                )}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Container with brand primary color */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-3xl rounded-tl-none shadow-2xl">
          {/* Content */}
          <div
            ref={contentRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10 min-h-[500px] lg:min-h-[450px]"
          >
            {/* Left side - Contextual content */}
            <div className="flex flex-col justify-center space-y-4 lg:space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start">
                <span className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  {activeContent.badge}
                </span>
              </div>

              {/* Content Title */}
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
                {activeContent.contentTitle}
              </h2>

              {/* Description */}
              <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                {activeContent.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <GsapMorphButton
                  size="default"
                  className="bg-white text-brand-primary hover:bg-gray-100"
                >
                  Get Started
                </GsapMorphButton>
                <GsapMorphButton
                  size="default"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-brand-primary"
                >
                  Try a Guided Tour
                </GsapMorphButton>
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
