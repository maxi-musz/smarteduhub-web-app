import React from "react";

interface AppStoreButtonProps {
  href?: string;
  className?: string;
}

export default function AppStoreButton({
  href = "#",
  className = "",
}: AppStoreButtonProps) {
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
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
      </svg>
      <div className="text-left relative z-10">
        <div className="text-xs opacity-80">Download on the</div>
        <div className="text-lg font-semibold -mt-1">App Store</div>
      </div>
    </a>
  );
}
