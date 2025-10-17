import React from "react";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HeroCentered from "@/components/for/HeroCentered";
import FeatureGrid, { Feature } from "@/components/for/FeatureGrid";
import FeatureHighlight, {
  HighlightFeature,
} from "@/components/for/FeatureHighlight";
import CTASection from "@/components/for/CTASection";
import {
  Eye,
  MessageSquare,
  BarChart3,
  Bell,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function ParentsHomepage() {
  const features: Feature[] = [
    {
      icon: Eye,
      title: "Real-Time Progress Monitoring",
      description:
        "Stay informed about your child's academic journey with live updates on grades, assignments, and classroom activities.",
    },
    {
      icon: MessageSquare,
      title: "Direct Teacher Communication",
      description:
        "Connect instantly with teachers through secure messaging. Schedule meetings, ask questions, and stay involved in your child's education.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Understand your child's strengths and areas for improvement with detailed performance reports and visual analytics.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Receive instant alerts about assignments, grades, attendance, and school events. Never miss an important update again.",
    },
    {
      icon: Calendar,
      title: "Schedule Overview",
      description:
        "View your child's class schedule, upcoming tests, assignment deadlines, and school events all in one place.",
    },
    {
      icon: FileText,
      title: "Assignment Tracking",
      description:
        "See all upcoming and past assignments, submission status, and grades. Help your child stay organized and on track.",
    },
    {
      icon: Award,
      title: "Achievement Recognition",
      description:
        "Celebrate your child's successes with badges, certificates, and milestones. Track progress toward academic goals.",
    },
    {
      icon: TrendingUp,
      title: "Progress Reports",
      description:
        "Access comprehensive progress reports, report cards, and academic transcripts anytime, anywhere.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your family's data is protected with enterprise-grade security. Control who sees what with granular privacy settings.",
    },
  ];

  const highlightFeatures: HighlightFeature[] = [
    {
      title: "Complete Visibility Into Your Child's Education",
      description:
        "Get a comprehensive view of your child's academic performance, attendance, and behavior. Access grades, assignments, and teacher feedback in real-time to stay actively engaged in their learning journey.",
      imageSrc: "/imgs/placeholder-parent-dashboard.jpg",
      imageAlt: "Parent dashboard overview",
      benefits: [
        "Live grade updates and assignment tracking",
        "Attendance records with absence notifications",
        "Teacher comments and behavioral notes",
        "Academic performance trends and analytics",
      ],
    },
    {
      title: "Seamless Communication with Educators",
      description:
        "Build a strong partnership with your child's teachers through easy, direct communication. Schedule parent-teacher conferences, ask questions, and receive important updates without the hassle of phone calls or emails.",
      imageSrc: "/imgs/placeholder-parent-messages.jpg",
      imageAlt: "Parent teacher communication",
      benefits: [
        "Instant messaging with teachers and administrators",
        "Easy scheduling for parent-teacher meetings",
        "Group announcements and school-wide updates",
        "Translation support for multilingual families",
      ],
    },
    {
      title: "Stay Organized and Never Miss a Beat",
      description:
        "Keep track of everything in one centralized hub. From homework assignments to school events, permission slips to fee payments - manage it all efficiently and stay on top of your child's educational needs.",
      imageSrc: "/imgs/placeholder-parent-calendar.jpg",
      imageAlt: "Parent calendar and schedule",
      benefits: [
        "Unified calendar with all important dates",
        "Automated reminders for assignments and events",
        "Digital permission slips and form submissions",
        "Fee payment tracking and online payments",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroCentered
        title="Stay Connected to Your Child's Learning Journey"
        subtitle="Empower your involvement with real-time insights, seamless communication, and all the tools you need to support your child's success."
        ctaPrimaryText="Create Free Account"
        ctaSecondaryText="See How It Works"
        imageSrc="/imgs/placeholder-parent-hero.jpg"
        imageAlt="Parent portal dashboard"
      />

      <FeatureGrid
        features={features}
        title="Everything You Need to Support Your Child"
        subtitle="Stay informed, stay connected, and stay involved in your child's education"
      />

      <FeatureHighlight features={highlightFeatures} />

      <CTASection
        title="Be the Supportive Parent Your Child Needs"
        subtitle="Join thousands of parents using SmartEduHub to stay actively engaged in their children's education. Sign up free today."
        primaryButtonText="Get Started Now"
        secondaryButtonText="Learn More"
      />

      <Footer />
    </div>
  );
}
