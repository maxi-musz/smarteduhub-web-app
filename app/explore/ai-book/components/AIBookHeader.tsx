"use client";

import { GraduationCap } from "lucide-react";
import type { AIPlatform } from "@/hooks/explore/use-ai-books-landing";

interface AIBookHeaderProps {
  platform?: AIPlatform | null;
}

export function AIBookHeader({ platform }: AIBookHeaderProps) {
  const name = platform?.name ?? "AI Books";
  const description = platform?.description ?? "AI-Powered Learning Platform";

  return (
    <div className="w-full bg-brand-primary text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex-shrink-0">
          <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
          <p className="text-sm sm:text-base text-white/80 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
