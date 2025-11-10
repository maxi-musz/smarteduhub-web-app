import React from "react";
import { LucideIcon } from "lucide-react";
import DetachedCard from "@/components/ui/DetachedCard";

export interface Feature {
  icon?: LucideIcon;
  step?: number;
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
  // Array of unique gradient colors for each card's icon
  const iconColors = [
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-red-500 to-red-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
  ];

  // Border colors to match
  const borderColors = [
    "#8B5CF6", // purple
    "#3B82F6", // blue
    "#10B981", // green
    "#F97316", // orange
    "#EC4899", // pink
    "#14B8A6", // teal
    "#6366F1", // indigo
    "#EF4444", // red
    "#06B6D4", // cyan
  ];

  return (
    <section className="bg-white">
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
          {features.map((feature, index) => (
            <DetachedCard
              key={index}
              icon={feature.icon}
              step={feature.step}
              title={feature.title}
              description={feature.description}
              borderColor={borderColors[index % borderColors.length]}
              iconBgColor={iconColors[index % iconColors.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
