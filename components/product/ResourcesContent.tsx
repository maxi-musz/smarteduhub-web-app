import React from "react";
import Link from "next/link";
import DetachedCard from "@/components/ui/DetachedCard";
import {
  FileText,
  Video,
  TrendingUp,
  HelpCircle,
  Users,
  Calendar,
} from "lucide-react";

export default function ResourcesContent() {
  const resources = [
    {
      icon: FileText,
      title: "Documentation",
      description:
        "Comprehensive guides and API documentation for developers and administrators.",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description:
        "Step-by-step video guides to help you navigate and use all features effectively.",
    },
    {
      icon: TrendingUp,
      title: "Case Studies",
      description:
        "Real-world examples of schools and institutions succeeding with SmartEdu Hub.",
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description:
        "Find answers to frequently asked questions and get support.",
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other educators and share best practices.",
    },
    {
      icon: Calendar,
      title: "Webinars",
      description: "Join live sessions and workshops with education experts.",
    },
  ];

  const iconColors = [
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
  ];

  const borderColors = [
    "#8B5CF6", // purple
    "#3B82F6", // blue
    "#10B981", // green
    "#F97316", // orange
    "#EC4899", // pink
    "#14B8A6", // teal
  ];

  return (
    <main className="container mx-auto px-4 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-heading mb-4">
            Resources
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600">
            Everything you need to get the most out of SmartEdu Hub
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {resources.map((resource, index) => (
            <DetachedCard
              key={index}
              icon={resource.icon}
              title={resource.title}
              description={resource.description}
              borderColor={borderColors[index]}
              iconBgColor={iconColors[index]}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-brand-primary/5 to-brand-primary-hover/5 rounded-2xl p-6 md:p-8 lg:p-10 text-center border-2 border-brand-primary/20">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-brand-heading mb-3 lg:mb-4">
            Need More Help?
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">
            Our support team is here to assist you with any questions.
          </p>
          <Link
            href="/support"
            className="inline-block bg-gradient-to-br from-brand-primary to-brand-primary-hover text-white px-5 md:px-6 lg:px-8 py-2.5 md:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base lg:text-lg font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
