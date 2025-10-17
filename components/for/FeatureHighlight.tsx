import React from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export interface HighlightFeature {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  benefits: string[];
}

interface FeatureHighlightProps {
  features: HighlightFeature[];
}

export default function FeatureHighlight({ features }: FeatureHighlightProps) {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="space-y-24">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                {/* Image */}
                <div
                  className={`relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {/* Decorative Background */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#F0F3FF] rounded-3xl" />
                </div>

                {/* Content */}
                <div
                  className={`space-y-6 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-brand-heading">
                      {feature.title}
                    </h3>
                    <p className="text-base md:text-lg text-brand-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-4">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="text-[16px] text-brand-secondary">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
