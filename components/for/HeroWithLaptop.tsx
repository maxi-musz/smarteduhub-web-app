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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F3FF] to-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-brand-heading leading-tight">
                {title}
              </h1>
              <p className="text-base md:text-lg 2xl:text-xl text-brand-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-6 text-lg group"
              >
                {ctaPrimaryText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2"
              >
                {ctaSecondaryText}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-brand-secondary ml-2">
                  Trusted by 500+ institutions
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Laptop Mockup */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              {/* Laptop Frame */}
              <div className="bg-gray-900 rounded-t-lg p-2">
                <div className="bg-gray-800 rounded-t-lg p-1">
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-t-lg">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  {/* Screen Content */}
                  <div className="bg-white relative aspect-[16/10]">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                </div>
              </div>
              {/* Laptop Base */}
              <div className="bg-gray-800 h-4 rounded-b-lg shadow-lg" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E0E7FF] rounded-full blur-3xl opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}
