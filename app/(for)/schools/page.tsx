import React from "react";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HeroWithLaptop from "@/components/for/HeroWithLaptop";
import FeatureGrid, { Feature } from "@/components/for/FeatureGrid";
import FeatureHighlight, {
  HighlightFeature,
} from "@/components/for/FeatureHighlight";
import CTASection from "@/components/for/CTASection";
import TabbedFeatureSection from "@/components/for/TabbedFeatureSection";
import {
  Users,
  GraduationCap,
  BarChart3,
  Calendar,
  MessageSquare,
  DollarSign,
  Settings,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function SchoolsHomepage() {
  const features: Feature[] = [
    {
      icon: Users,
      title: "Student Management",
      description:
        "Comprehensive student information system with enrollment, attendance tracking, and academic records all in one place.",
    },
    {
      icon: GraduationCap,
      title: "Teacher Oversight",
      description:
        "Monitor teacher performance, manage assignments, and facilitate professional development with powerful admin tools.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description:
        "Real-time dashboards and detailed reports to track institutional performance, student outcomes, and resource allocation.",
    },
    {
      icon: Calendar,
      title: "Schedule Management",
      description:
        "Create and manage class schedules, exams, and school events with an intuitive calendar system that syncs across all users.",
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description:
        "Centralized messaging system to connect administrators, teachers, students, and parents instantly.",
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description:
        "Track tuition, expenses, payroll, and generate financial reports with integrated accounting tools.",
    },
    {
      icon: Settings,
      title: "Administrative Tools",
      description:
        "Streamline operations with automated workflows, document management, and customizable system settings.",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Enterprise-grade security with role-based access control, data encryption, and compliance with education standards.",
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description:
        "Track institutional growth, student achievement trends, and identify areas for improvement with AI-powered analytics.",
    },
  ];

  const highlightFeatures: HighlightFeature[] = [
    {
      title: "Complete Student Information System",
      description:
        "Manage every aspect of student data from enrollment to graduation. Track attendance, academic performance, behavioral records, and health information in one secure platform.",
      imageSrc: "/imgs/placeholder-dashboard.jpg",
      imageAlt: "Student management dashboard",
      benefits: [
        "Automated enrollment and registration workflows",
        "Real-time attendance tracking with instant parent notifications",
        "Comprehensive academic records and transcript generation",
        "Student health and medical records management",
      ],
    },
    {
      title: "Powerful Analytics Dashboard",
      description:
        "Make data-driven decisions with comprehensive analytics. Monitor key performance indicators, track trends, and generate detailed reports for stakeholders.",
      imageSrc: "/imgs/placeholder-analytics.jpg",
      imageAlt: "Analytics and reporting dashboard",
      benefits: [
        "Real-time performance metrics and KPI tracking",
        "Customizable reports for board meetings and compliance",
        "Predictive analytics for student success and retention",
        "Export data in multiple formats for further analysis",
      ],
    },
    {
      title: "Integrated Financial Management",
      description:
        "Simplify your school's financial operations with built-in accounting, fee management, and payroll processing. Track expenses, manage budgets, and ensure financial transparency.",
      imageSrc: "/imgs/placeholder-finance.jpg",
      imageAlt: "Financial management dashboard",
      benefits: [
        "Automated fee collection and payment reminders",
        "Expense tracking and budget management",
        "Payroll processing with tax compliance",
        "Financial reports and audit trails",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroWithLaptop
        title="AI powered platform for Your School"
        subtitle="Transform your school with an all-in-one platform. Built-in AI personalizes learning, automates administrative workflows, and provides predictive insights to drive student success."
        ctaPrimaryText="Request a Demo"
        ctaSecondaryText="View Pricing"
        imageSrc="/svgs/schools-hero-dashboard.svg"
        imageAlt="Headmaster addressing pupils"
      />

      <FeatureGrid
        features={features}
        title="Everything Your School Needs"
        subtitle="Comprehensive tools to manage every aspect of your educational institution"
      />

      {/* <FeatureHighlight features={highlightFeatures} /> */}

      <TabbedFeatureSection />

      <CTASection
        title="Ready to Transform Your School?"
        subtitle="Join hundreds of institutions already using SmartEduHub to streamline operations and improve student outcomes."
        primaryButtonText="Schedule a Demo"
        secondaryButtonText="Talk to Sales"
      />

      <Footer />
    </div>
  );
}
