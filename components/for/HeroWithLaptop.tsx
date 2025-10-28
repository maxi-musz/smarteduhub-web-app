import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface HeroWithLaptopProps {
  title: string;
  subtitle: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  imageSrc: string;
  imageAlt: string;
}

export default function HeroWithLaptop({
  title,
  subtitle,
  ctaPrimaryText = "Get Started",
  ctaSecondaryText = "Request Demo",
  imageSrc,
  imageAlt,
}: HeroWithLaptopProps) {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto relative">
          {/* Wire-mesh SVG Background - lowest layer */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] z-0 opacity-30"
            style={{
              backgroundImage: "url('/svgs/wire-mesh.svg')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />

          {/* Blue glow gradient - heart-shaped radial gradients */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1000px] z-[1] pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 500px 350px at 30% 50%, rgba(0, 135, 218, 0.4) 0%, transparent 60%),
                radial-gradient(ellipse 500px 350px at 70% 50%, rgba(0, 135, 218, 0.4) 0%, transparent 60%),
                radial-gradient(ellipse 450px 400px at 50% 20%, rgba(0, 135, 218, 0.35) 0%, transparent 60%),
                radial-gradient(ellipse 600px 400px at 50% 80%, rgba(0, 135, 218, 0.3) 0%, transparent 60%)
              `,
              filter: "blur(60px)",
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
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 relative z-10">
            <Button size="lg">{ctaPrimaryText}</Button>

            {/* Social Proof */}
            {/* <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-300 font-medium">
                Trusted by 100+ schools
              </span>
            </div> */}
          </div>

          {/* Cancel Anytime */}
          {/* <p className="text-gray-400 text-sm mb-16">Cancel Anytime</p> */}

          {/* Product Mockup */}
          <div className="relative max-w-6xl mx-auto z-10">
            <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-4 lg:p-[17px] backdrop-blur-sm border border-gray-200">
              <div className="relative w-full h-[400px] lg:h-[600px] rounded-2xl overflow-hidden bg-white">
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
    </section>
  );
}
