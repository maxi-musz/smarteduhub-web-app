"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Zap,
  BarChart3,
  Users,
  DollarSign,
  MessageSquare,
  Award,
  Shield,
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
    id: "smart-automation",
    title: "Smart Automation",
    badge: "Smart Automation",
    contentTitle: "Automate Routine Tasks, Focus on What Matters",
    description:
      "Our AI-powered automation handles repetitive administrative tasks so your staff can focus on education. From automated attendance tracking to intelligent scheduling, SmartEduHub streamlines operations and reduces manual workload by up to 70%. Set up automated workflows for admissions, fee reminders, report card generation, and more.",
    mediaSrc: "/imgs/automation-demo.jpg",
    mediaType: "image",
    mediaAlt: "Smart automation dashboard showing automated workflows",
  },
  {
    id: "performance-analytics",
    title: "Performance Analytics",
    badge: "Performance Analytics",
    contentTitle: "Data-Driven Insights for Better Decisions",
    description:
      "Transform raw data into actionable insights with our advanced analytics engine. Monitor student performance trends, track institutional KPIs, and identify areas for improvement with real-time dashboards. Our predictive analytics help you spot at-risk students early and measure the effectiveness of interventions, enabling proactive decision-making.",
    mediaSrc: "/imgs/analytics-demo.jpg",
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
    mediaSrc: "/imgs/staff-management-demo.jpg",
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
    mediaSrc: "/imgs/finance-demo.jpg",
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
    mediaSrc: "/imgs/communication-demo.jpg",
    mediaType: "image",
    mediaAlt: "Communication hub showing messaging interface",
  },
  {
    id: "results-grading",
    title: "Results & Grading",
    badge: "Results & Grading",
    contentTitle: "Streamlined Assessment and Reporting",
    description:
      "Simplify the entire grading process from assessment creation to report card generation. Support multiple grading systems, weighted scoring, and customizable report formats. Teachers can input grades efficiently, while automated calculations ensure accuracy. Generate comprehensive progress reports, transcripts, and certificates with just a few clicks.",
    mediaSrc: "/imgs/grading-demo.jpg",
    mediaType: "image",
    mediaAlt: "Results and grading interface showing student assessments",
  },
  {
    id: "data-security",
    title: "Data Security",
    badge: "Data Security",
    contentTitle: "Enterprise-Grade Security You Can Trust",
    description:
      "Protect sensitive student and institutional data with bank-level security measures. Our platform features end-to-end encryption, role-based access control, regular security audits, and compliance with international data protection standards including GDPR and FERPA. Automated backups and disaster recovery ensure your data is always safe and accessible.",
    mediaSrc: "/imgs/security-demo.jpg",
    mediaType: "image",
    mediaAlt: "Data security dashboard showing security metrics",
  },
];

const tabIcons: Record<string, React.ElementType> = {
  "smart-automation": Zap,
  "performance-analytics": BarChart3,
  "staff-management": Users,
  "financial-tracking": DollarSign,
  "connect-communicate": MessageSquare,
  "results-grading": Award,
  "data-security": Shield,
};

export default function TabbedFeatureSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeContent = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const Icon = tabIcons[activeContent.id];

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto" style={{ width: "80%" }}>
        {/* Container with brand primary color */}
        <div className="bg-[#10375C] rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-white/10">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const TabIcon = tabIcons[tab.id];
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2",
                      activeTab === tab.id
                        ? "text-white border-white bg-white/10"
                        : "text-white/70 border-transparent hover:text-white hover:bg-white/5"
                    )}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
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
            </div>

            {/* Right side - Media */}
            <div className="flex items-center justify-center">
              {activeContent.mediaType === "image" ? (
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={activeContent.mediaSrc}
                    alt={activeContent.mediaAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] rounded-lg overflow-hidden shadow-xl">
                  <video
                    src={activeContent.mediaSrc}
                    controls
                    className="w-full h-full object-cover"
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
