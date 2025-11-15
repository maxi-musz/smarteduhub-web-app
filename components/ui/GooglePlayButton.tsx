import React from "react";

interface GooglePlayButtonProps {
  href?: string;
  className?: string;
}

export default function GooglePlayButton({
  href = "#",
  className = "",
}: GooglePlayButtonProps) {
  return (
    <a
      href={href}
      className={`relative inline-flex items-center justify-center gap-3 bg-black text-white px-3 md:px-6 py-3.5 rounded-xl transition-all duration-200 overflow-hidden group w-full sm:w-auto max-w-40 md:max-w-50 ${className}`}
    >
      {/* Sweep flash effect */}
      <div className="absolute inset-0 -translate-x-full translate-y-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:translate-x-full group-hover:-translate-y-full transition-transform duration-700 ease-in-out" />

      <svg
        className="w-8 h-8 relative z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
      </svg>
      <div className="text-left relative z-10">
        <div className="text-xs opacity-80">GET IT ON</div>
        <div className="lg:text-lg font-semibold -mt-1">Google Play</div>
      </div>
    </a>
  );
}
