"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Number with gradient effect */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-bold tracking-wider bg-gradient-to-br from-brand-primary to-brand-primary-hover bg-clip-text text-transparent">
            404
          </h1>
          {/* Decorative background circle */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-brand-primary opacity-10"></div>
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-brand-heading">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-brand-light-accent-1">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Link href="/">
            <Button
              size="lg"
              className="w-full sm:w-auto hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Go Back
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 pt-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"
              style={{
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
