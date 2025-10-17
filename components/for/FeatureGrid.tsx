import React from "react";
import { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
}

export default function FeatureGrid({
  features,
  title = "Powerful Features",
  subtitle = "Everything you need to succeed",
}: FeatureGridProps) {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-heading mb-4">
            {title}
          </h2>
          <p className="text-xl text-brand-secondary">{subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-md border-2 border-brand-border hover:shadow-lg transition-all duration-500 bg-white shadow-brand"
              >
                <div className="w-14 h-14 bg-[#E0E7FF] text-brand-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-[34px] h-[34px]" />
                </div>
                <h3 className="text-[18px] font-semibold text-brand-heading mb-2">
                  {feature.title}
                </h3>
                <p className="text-[16px] font-normal text-brand-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
