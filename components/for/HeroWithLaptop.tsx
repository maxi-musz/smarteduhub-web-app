import React from "react";
import { GsapMorphButton } from "@/components/ui/gsapmorph-button";
import Image from "next/image";
import ScrollLink from "@/components/ui/ScrollLink";

interface HeroWithLaptopProps {
  title: string;
  subtitle: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
  imageSrc: string;
  imageAlt: string;
}

export default function HeroWithLaptop({
  title,
  subtitle,
  ctaSecondaryText = "Explore Features",
  ctaSecondaryHref = "#features",
  imageSrc,
  imageAlt,
}: HeroWithLaptopProps) {
  return (
    <section className="relative overflow-visible bg-white pt-10 pb-32">
      <div className="container mx-auto">
        {/* Arch-shaped gradient background container */}
        <div className="relative">
          {/* SVG for arch shape */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ height: "calc(100% - 150px)" }}
            preserveAspectRatio="none"
            viewBox="0 0 1000 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="archGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.15)" />
                <stop offset="5%" stopColor="rgba(139, 92, 246, 0.15)" />
                <stop offset="5%" stopColor="rgba(59, 130, 246, 0.25)" />
                <stop offset="55%" stopColor="rgba(59, 130, 246, 0.25)" />
                <stop offset="55%" stopColor="rgba(139, 92, 246, 0.15)" />
                <stop offset="65%" stopColor="rgba(139, 92, 246, 0.15)" />
                <stop offset="65%" stopColor="rgba(168, 85, 247, 0.3)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
              </linearGradient>
            </defs>
            <path
              d="M 24 0 
                 L 976 0 
                 Q 1000 0 1000 24 
                 L 1000 400 
                 Q 1000 450 750 520 
                 Q 500 590 250 520 
                 Q 0 450 0 400 
                 L 0 24 
                 Q 0 0 24 0 Z"
              fill="url(#archGradient)"
            />
          </svg>

          <div className="relative px-6 py-12 md:px-12 md:py-16">
            <div className="text-center max-w-4xl mx-auto relative">
              {/* Wire-mesh SVG Background - lowest layer */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-y-180 w-full max-w-3xl h-[600px] z-0 opacity-80"
                style={{
                  backgroundImage: "url('/svgs/wire-mesh.svg')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />

              {/* Main Headline */}
              <div className="space-y-6 mb-12 relative z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  <span className="block">
                    {title.split(" ").slice(0, -2).join(" ")}
                  </span>
                  <span className="text-brand-primary">
                    {title.split(" ").slice(-2).join(" ")}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mx-auto">
                  {subtitle}
                </p>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 relative z-10">
                {ctaSecondaryText && ctaSecondaryHref && (
                  <ScrollLink href={ctaSecondaryHref}>
                    <GsapMorphButton size="lg" variant="outline">
                      {ctaSecondaryText}
                    </GsapMorphButton>
                  </ScrollLink>
                )}
              </div>

              {/* Product Mockup */}
              <div className="relative max-w-6xl mx-auto mt-8">
                {/* Top corner gradients extending into text area - behind content */}
                {/* Top-Left Corner - Extended upward and towards center */}
                <div
                  className="absolute left-0 -top-32 w-96 h-96 pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(50.05% 117.09% at 0% 0%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                    filter: "blur(150px)",
                  }}
                />
                {/* Top-Right Corner - Extended upward and towards center */}
                <div
                  className="absolute right-0 -top-32 w-96 h-96 pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(50.05% 117.09% at 100% 0%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                    filter: "blur(150px)",
                  }}
                />

                <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-4 lg:p-[17px] backdrop-blur-sm border border-gray-200 z-20">
                  {/* Remaining side gradients around mockup */}
                  {/* Left Side Gradients */}
                  {/* Top-Left Side */}
                  <div
                    className="absolute -left-8 top-1/4 w-64 h-64 pointer-events-none z-0"
                    style={{
                      background:
                        "radial-gradient(50.05% 117.09% at 0% 0%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                      filter: "blur(150px)",
                    }}
                  />
                  {/* Bottom-Left Side */}
                  <div
                    className="absolute -left-8 bottom-1/4 w-64 h-64 pointer-events-none z-0"
                    style={{
                      background:
                        "radial-gradient(48.89% 114.49% at 0% 100%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                      filter: "blur(150px)",
                    }}
                  />
                  {/* Bottom-Left Corner */}
                  <div
                    className="absolute -left-8 bottom-0 w-64 h-64 pointer-events-none z-0"
                    style={{
                      background:
                        "radial-gradient(48.89% 114.49% at 0% 100%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                      filter: "blur(150px)",
                    }}
                  />

                  {/* Right Side Gradients */}
                  {/* Top-Right Side */}
                  <div
                    className="absolute -right-8 top-1/4 w-64 h-64 pointer-events-none z-0"
                    style={{
                      background:
                        "radial-gradient(50.05% 117.09% at 100% 0%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                      filter: "blur(150px)",
                    }}
                  />
                  {/* Bottom-Right Side */}
                  <div
                    className="absolute -right-8 bottom-1/4 w-64 h-64 pointer-events-none z-0"
                    style={{
                      background:
                        "radial-gradient(48.89% 114.49% at 100% 100%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                      filter: "blur(150px)",
                    }}
                  />
                  {/* Bottom-Right Corner */}
                  <div
                    className="absolute -right-8 bottom-0 w-64 h-64 pointer-events-none z-0"
                    style={{
                      background:
                        "radial-gradient(48.89% 114.49% at 100% 100%, rgba(0, 135, 218, 0.8) 0%, rgba(0, 135, 218, 0) 100%)",
                      filter: "blur(150px)",
                    }}
                  />

                  <div className="relative w-full h-[400px] lg:h-[600px] rounded-2xl overflow-hidden bg-white border-2 border-brand-primary/40 shadow-2xl shadow-brand-primary/30 ring-1 ring-brand-primary/20">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Floating cards/elements around mockup */}
                  <div className="absolute -left-4 top-1/4 hidden lg:block">
                    <div className="bg-white rounded-xl p-4 shadow-xl max-w-64">
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900 text-sm">
                          Student Engagement
                        </div>
                        <div className="text-gray-600 text-xs">
                          Track student engagement across all subjects
                        </div>
                        {/* <div className="flex items-center gap-2 pt-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                      <div className="text-xs text-gray-500">
                        +25% improvement
                      </div>
                    </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-4 top-1/3 hidden lg:block">
                    <div className="bg-white rounded-xl p-4 shadow-xl max-w-64">
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900 text-sm">
                          Teacher Efficiency
                        </div>
                        <div className="text-gray-600 text-xs">
                          Streamline grading and lesson planning
                        </div>
                        {/* <div className="flex items-center gap-2 pt-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                      <div className="text-xs text-gray-500">
                        3hrs saved daily
                      </div>
                    </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-8 bottom-1/4 hidden xl:block">
                    <div className="bg-white rounded-xl p-4 shadow-xl max-w-48">
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900 text-sm">
                          Parent Portal
                        </div>
                        <div className="text-gray-600 text-xs">
                          Real-time updates and communication
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
