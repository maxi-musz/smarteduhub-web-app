import React from "react";
import { LucideIcon } from "lucide-react";

interface DetachedCardProps {
  icon?: LucideIcon;
  step?: number;
  title: string;
  description: string;
  borderColor?: string;
  iconBgColor?: string;
}

export default function DetachedCard({
  icon: Icon,
  step,
  title,
  description,
  borderColor = "#0087DA",
  iconBgColor = "bg-gradient-to-br from-purple-500 to-purple-600",
}: DetachedCardProps) {
  return (
    <div className="relative w-full h-[200px] group">
      {/* Main Part - Rectangle with rectangular cutout in top-right */}
      <div className="relative h-full">
        {/* Top section - before cutout */}
        <div
          className="absolute top-0 left-0 right-20 h-2 bg-white"
          style={{
            borderTop: `2px solid ${borderColor}`,
            borderLeft: `2px solid ${borderColor}`,
          }}
        />

        {/* Left border - full height */}
        <div
          className="absolute top-0 left-0 w-2 h-full bg-white"
          style={{ borderLeft: `2px solid ${borderColor}` }}
        />

        {/* Bottom border - full width */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 bg-white"
          style={{ borderBottom: `2px solid ${borderColor}` }}
        />

        {/* Right border - below cutout */}
        <div
          className="absolute top-20 right-0 w-2 bottom-0 bg-white"
          style={{ borderRight: `2px solid ${borderColor}` }}
        />

        {/* Top-right corner section - forms the cutout sides */}
        <div
          className="absolute top-0 right-20 w-2 h-20 bg-white"
          style={{ borderRight: `2px solid ${borderColor}` }}
        />

        <div
          className="absolute top-20 right-0 left-[calc(100%-80px)] h-2 bg-white"
          style={{ borderTop: `2px solid ${borderColor}` }}
        />

        {/* Content area - white background */}
        <div className="absolute inset-2 bg-white p-6 pr-24 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Minor Part - Rectangle that fits in the cutout (detached with gap) */}
      <div
        className={`absolute top-2 right-2 w-16 h-16 ${iconBgColor} flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
      >
        {step ? (
          <span className="text-3xl font-bold">{step}</span>
        ) : Icon ? (
          <Icon className="w-8 h-8" strokeWidth={2.5} />
        ) : null}
      </div>
    </div>
  );
}
