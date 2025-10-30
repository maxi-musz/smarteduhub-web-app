"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Zap,
  BarChart3,
  Users,
  DollarSign,
  MessageSquare,
  Calendar,
  ArrowRight,
  Play,
} from "lucide-react";

interface TabContent {
  id: string;
  title: string;
  badge: string;
  contentTitle: string;
  description: string;
  mediaSrc: string;
  mediaType: "image" | "video";
  mediaAlt: string;
}

const tabs: TabContent[] = [
  {
    id: "ai-powered",
    title: "AI Powered",
    badge: "AI Powered",
    contentTitle: "Interactive AI empowering Education",
    description:
      "Intelligent AI systems that enhance learning experiences and administrative efficiency. From personalized learning paths to real-time feedback, our AI tools adapt to the needs of students and educators alike, fostering a more engaging and effective educational environment.",
    mediaSrc: "/imgs/admin-ai.png",
    mediaType: "image",
    mediaAlt: "AI powered education interface showing interactive tools",
  },
  {
    id: "performance-analytics",
    title: "Performance Analytics",
    badge: "Performance Analytics",
    contentTitle: "Data-Driven Insights for Better Decisions",
    description:
      "Transform raw data into actionable insights with our advanced analytics engine. Monitor student performance trends, track institutional KPIs, and identify areas for improvement with real-time dashboards. Our predictive analytics help you spot at-risk students early and measure the effectiveness of interventions, enabling proactive decision-making.",
    mediaSrc: "/svgs/admin-performance.svg",
    mediaType: "image",
    mediaAlt: "Performance analytics dashboard with charts and graphs",
  },
  {
    id: "staff-management",
    title: "Staff Management",
    badge: "Staff Management",
    contentTitle: "Empower Your Team with Modern Tools",
    description:
      "Manage your entire staff lifecycle from recruitment to retirement. Track certifications, schedule professional development, monitor performance, and manage workload distribution. Our integrated HR module includes leave management, payroll integration, and performance review workflows, ensuring your team operates at peak efficiency.",
    mediaSrc: "/svgs/admin-teachers.svg",
    mediaType: "image",
    mediaAlt: "Staff management interface showing employee profiles",
  },
  {
    id: "financial-tracking",
    title: "Financial Tracking",
    badge: "Financial Tracking",
    contentTitle: "Complete Financial Visibility and Control",
    description:
      "Gain complete control over your school's finances with our comprehensive financial management system. Track income and expenses, manage budgets, process payroll, and generate detailed financial reports. Automated fee collection, payment reminders, and multi-payment gateway support ensure smooth cash flow while maintaining full compliance with accounting standards.",
    mediaSrc: "/svgs/admin-finance.svg",
    mediaType: "image",
    mediaAlt: "Financial tracking dashboard showing revenue and expenses",
  },
  {
    id: "connect-communicate",
    title: "Connect & Communicate",
    badge: "Connect & Communicate",
    contentTitle: "Seamless Communication Across Your Community",
    description:
      "Keep everyone connected with our integrated communication platform. Send instant notifications, share announcements, schedule parent-teacher meetings, and enable real-time messaging between all stakeholders. Multi-channel communication via SMS, email, and in-app notifications ensures important messages reach the right people at the right time.",
    mediaSrc: "/svgs/admin-messages.svg",
    mediaType: "image",
    mediaAlt: "Communication hub showing messaging interface",
  },
  {
    id: "comprehensive-scheduler",
    title: "Comprehensive Scheduler",
    badge: "Comprehensive Scheduler",
    contentTitle: "Scheduler with Conflict Resolution",
    description:
      "Simplify the entire scheduling process from class timetabling to resource allocation. Support multiple scheduling formats, conflict resolution, and customizable views. Administrators can manage schedules efficiently, while automated notifications ensure everyone stays informed. Create or update schedules with just a few clicks.",
    mediaSrc: "/svgs/admin-scheduler.svg",
    mediaType: "image",
    mediaAlt:
      "Scheduler interface showing class timetables and resource allocation",
  },
];

const tabIcons: Record<string, React.ElementType> = {
  "ai-powered": Zap,
  "performance-analytics": BarChart3,
  "staff-management": Users,
  "financial-tracking": DollarSign,
  "connect-communicate": MessageSquare,
  "comprehensive-scheduler": Calendar,
};

export default function TabbedFeatureSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeContent = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const Icon = tabIcons[activeContent.id];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for School Management
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive suite of tools designed to streamline
            operations and enhance educational outcomes
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center overflow-x-auto scrollbar-hide gap-2 mb-[-1px]">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-t-xl rounded-tl-none cursor-pointer",
                  activeTab === tab.id
                    ? "text-white bg-gradient-to-br from-brand-primary to-brand-primary-hover"
                    : "text-white/70 bg-brand-primary/60 hover:bg-brand-primary/80"
                )}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Container with brand primary color */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-3xl rounded-tl-none shadow-2xl overflow-hidden">
          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 p-8 lg:p-12">
            {/* Left side - Contextual content */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start">
                <span className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  {Icon && <Icon className="w-4 h-4 inline mr-2" />}
                  {activeContent.badge}
                </span>
              </div>

              {/* Content Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                {activeContent.contentTitle}
              </h2>

              {/* Description */}
              <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                {activeContent.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-white text-brand-primary hover:bg-gray-100"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-brand-primary"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try a Guided Tour
                </Button>
              </div>
            </div>

            {/* Right side - Media */}
            <div className="flex items-center justify-center">
              {activeContent.mediaType === "image" ? (
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] rounded-lg rounded-tl-none overflow-hidden shadow-xl">
                  <Image
                    src={activeContent.mediaSrc}
                    alt={activeContent.mediaAlt}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] rounded-lg overflow-hidden shadow-xl">
                  <video
                    src={activeContent.mediaSrc}
                    controls
                    className="w-full h-full object-cover object-right-top"
                    autoPlay
                    loop
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
