import React from "react";

interface Partner {
  name: string;
  icon: React.ReactNode;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
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
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-gray-700 font-bold flex-shrink-0"
              >
                <span className="text-2xl">{partner.icon}</span>
                <span>{partner.name}</span>
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
