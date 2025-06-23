"use client";

import { useState } from "react";
import { Wallet, ChartNoAxesColumn, Brain, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingModal } from "@/components/home/OnboardingModal";

export default function HeroSection() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <>
      <section className="container mx-auto px-6 py-10 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-brand-heading leading-tight mb-6">
              Simplify how you manage students, teachers and paperwork with{" "}
              <span className="text-brand-primary">SmartEdu Hub</span>
            </h1>
            <p className="text-base md:text-lg 2xl:text-xl text-brand-secondary mb-8 leading-relaxed">
              SmartEdu Hub helps school owners and administrators manage
              finance, digitize operations, boost efficiency and focus on
              education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-brand-primary hover:bg-[#4338CA] px-8 py-3"
                onClick={() => setIsOnboardingOpen(true)}
              >
                Get Started
              </Button>
              <Button variant="outline" className="px-8 py-3">
                See How It Works
              </Button>
            </div>
          </div>
          <div className="w-full max-w-[540px] lg:max-w-[540px] mx-auto space-y-4 bg-[#F8FAFC] p-8 rounded-lg shadow-lg">
            {[
              {
                icon: <Wallet className="w-6 h-6 text-brand-primary" />,
                title: "Manage Finances",
                description:
                  "Track income, control expenses and simplify budgeting",
              },
              {
                icon: <ChartNoAxesColumn className="w-6 h-6 text-[#3B82F6]" />,
                title: "Analytics",
                description:
                  "Track performance, monitor teachers, students & expenses",
              },
              {
                icon: <BookOpen className="w-6 h-6 text-[#FB8C00]" />,
                title: "Digital Curriculum",
                description:
                  "Access & deliver structured, up-to-date learning materials",
              },
              {
                icon: <Brain className="w-6 h-6 text-[#22C55E]" />,
                title: "AI Assistant",
                description: "24/7 learning support",
              },
            ].map(({ icon, title, description }, i) => (
              <div
                key={i}
                className="w-full max-w-[480px] flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border border-brand-border hover:shadow-lg transition-shadow duration-300"
              >
                <div className="size-8 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-semibold text-brand-heading text-base">
                    {title}
                  </h3>
                  <p className="text-brand-secondary text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </>
  );
}
