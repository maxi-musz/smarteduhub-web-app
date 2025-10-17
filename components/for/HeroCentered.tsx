import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface HeroCenteredProps {
  title: string;
  subtitle: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  imageSrc: string;
  imageAlt: string;
  targetAudience: "parents" | "students";
}

export default function HeroCentered({
  title,
  subtitle,
  ctaPrimaryText = "Get Started",
  ctaSecondaryText = "Learn More",
  imageSrc,
  imageAlt,
  targetAudience,
}: HeroCenteredProps) {
  const accentColor = targetAudience === "parents" ? "green" : "indigo";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F3FF] via-white to-gray-50 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Centered Text Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-brand-heading leading-tight">
              {title}
            </h1>
            <p className="text-base md:text-lg 2xl:text-xl text-brand-secondary max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className={`${
                accentColor === "green"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white px-8 py-6 text-lg group`}
            >
              {ctaPrimaryText}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-2"
            >
              {ctaSecondaryText}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2">
              <svg
                className={`w-5 h-5 ${
                  accentColor === "green" ? "text-green-600" : "text-indigo-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-brand-secondary">Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className={`w-5 h-5 ${
                  accentColor === "green" ? "text-green-600" : "text-indigo-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-brand-secondary">Easy setup</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className={`w-5 h-5 ${
                  accentColor === "green" ? "text-green-600" : "text-indigo-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-brand-secondary">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Dashboard Screenshot */}
        <div className="max-w-6xl mx-auto relative">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-8 border-gray-200 bg-white">
            <div className="relative aspect-[16/9]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            className={`absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] ${
              accentColor === "green" ? "bg-green-100" : "bg-indigo-100"
            } rounded-full blur-3xl opacity-30`}
          />

          {/* Floating Cards */}
          <div className="hidden lg:block absolute -left-8 top-1/4 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 ${
                  accentColor === "green" ? "bg-green-100" : "bg-indigo-100"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  className={`w-6 h-6 ${
                    accentColor === "green"
                      ? "text-green-600"
                      : "text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Real-time Updates
                </p>
                <p className="text-xs text-gray-500">Stay informed always</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-8 bottom-1/4 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 ${
                  accentColor === "green" ? "bg-green-100" : "bg-indigo-100"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  className={`w-6 h-6 ${
                    accentColor === "green"
                      ? "text-green-600"
                      : "text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Lightning Fast
                </p>
                <p className="text-xs text-gray-500">Instant access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
