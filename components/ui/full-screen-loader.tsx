"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
}

export function FullScreenLoader({ isLoading, message }: FullScreenLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        {message && (
          <p className="text-sm font-medium text-gray-700 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}

