"use client";

import React from "react";
import { SamsungPay } from "@/components/svgs";
import { WesternUnion } from "@/components/svgs";
import { Payoneer } from "@/components/svgs";
import { AmericanExpress } from "@/components/svgs";
import { Bitcoin } from "@/components/svgs";
import { OpenSea } from "@/components/svgs";
import { GumRoad } from "@/components/svgs";
import { Square } from "@/components/svgs";

const partners = [
  { name: "SamsungPay", Icon: SamsungPay },
  { name: "WesternUnion", Icon: WesternUnion },
  { name: "Payoneer", Icon: Payoneer },
  { name: "AmericanExpress", Icon: AmericanExpress },
  { name: "Bitcoin", Icon: Bitcoin },
  { name: "OpenSea", Icon: OpenSea },
  { name: "GumRoad", Icon: GumRoad },
  { name: "Square", Icon: Square },
];

export default function PartnersSection() {
  return (
    <section className="bg-transparent py-12 overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-center text-brand-primary font-medium mb-8">
          Join 1,500+ schools already registered
        </p>
        <div className="relative w-full overflow-hidden">
          <div
            className="flex items-center space-x-12 opacity-60 animate-partner-marquee"
            style={{
              width: "max-content",
            }}
          >
            {[...partners, ...partners].map(({ Icon, name }, index) => (
              <div
                key={index}
                className="flex items-center flex-shrink-0"
                aria-label={name}
              >
                <Icon className="w-12 h-12 text-blue-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes partner-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-partner-marquee {
          animation: partner-marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
