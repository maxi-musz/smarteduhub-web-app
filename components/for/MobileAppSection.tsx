import React from "react";
import Image from "next/image";
import { MobileAppData } from "@/types/landingPages";
import AppStoreButton from "@/components/ui/AppStoreButton";
import GooglePlayButton from "@/components/ui/GooglePlayButton";

interface MobileAppSectionProps {
  data: MobileAppData;
}

export default function MobileAppSection({ data }: MobileAppSectionProps) {
  const { title, subtitle, features, stats, phoneImageSrc, phoneImageAlt } =
    data;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-brand-primary to-brand-primary-hover relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 text-white">
            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-4xl lg:text-5xl font-bold leading-tight">
                {title}
              </h2>
              <p className="text-sm md:text-lg lg:text-xl text-white/90 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs md:text-sm text-white/80">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-row gap-2 md:gap-4  pt-4">
              <AppStoreButton />
              <GooglePlayButton />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4 border-t border-white/20">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Phone Mockup */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75" />

              {/* Phone mockup with actual screenshot */}
              <div className="relative max-w-[650px] mx-auto">
                <Image
                  src={phoneImageSrc}
                  alt={phoneImageAlt}
                  width={450}
                  height={700}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
