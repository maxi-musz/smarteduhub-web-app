import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  accentColor?: "blue" | "purple" | "green" | "indigo";
}

export default function CTASection({
  title,
  subtitle,
  primaryButtonText = "Get Started Now",
  secondaryButtonText = "Contact Sales",
  accentColor = "blue",
}: CTASectionProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      gradient: "from-blue-600 to-blue-700",
    },
    purple: {
      bg: "bg-purple-600",
      hover: "hover:bg-purple-700",
      gradient: "from-purple-600 to-purple-700",
    },
    green: {
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      gradient: "from-green-600 to-green-700",
    },
    indigo: {
      bg: "bg-indigo-600",
      hover: "hover:bg-indigo-700",
      gradient: "from-indigo-600 to-indigo-700",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.gradient} p-12 lg:p-16 text-white`}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold">
                {title}
              </h2>
              <p className="text-base md:text-lg 2xl:text-xl text-white/90 max-w-3xl mx-auto">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg group"
              >
                {primaryButtonText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg"
              >
                {secondaryButtonText}
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Free 30-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
