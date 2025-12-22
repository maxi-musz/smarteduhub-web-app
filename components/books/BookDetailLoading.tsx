"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function BookDetailLoading() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
        <p className="text-brand-light-accent-1">Loading book details...</p>
      </div>
    </div>
  );
}

