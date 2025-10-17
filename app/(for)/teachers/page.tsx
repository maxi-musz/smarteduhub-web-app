import React from "react";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HeroWithLaptop from "@/components/for/HeroWithLaptop";
import FeatureGrid, { Feature } from "@/components/for/FeatureGrid";
import FeatureHighlight, {
  HighlightFeature,
} from "@/components/for/FeatureHighlight";
import CTASection from "@/components/for/CTASection";
import {
  BookOpen,
  ClipboardCheck,
  Users,
  BarChart2,
  Calendar,
  MessageCircle,
  FileText,
  Clock,
  Award,
} from "lucide-react";

export default function TeachersHomepage() {
  const features: Feature[] = [
    {
      icon: BookOpen,
      title: "Subject Management",
      description:
        "Organize your curriculum, create lesson plans, and manage teaching materials all in one centralized location.",
    },
    {
      icon: ClipboardCheck,
      title: "Smart Grading",
      description:
        "Streamline your grading process with automated calculations, rubrics, and instant feedback for students.",
    },
    {
      icon: Users,
      title: "Student Tracking",
      description:
        "Monitor individual student progress, identify struggling learners, and provide personalized support.",
    },
    {
      icon: BarChart2,
      title: "Performance Analytics",
      description:
        "Gain insights into class performance with detailed analytics and visualizations to inform your teaching strategies.",
    },
    {
      icon: Calendar,
      title: "Schedule Management",
      description:
        "Manage your teaching schedule, plan lessons, set reminders, and never miss an important class or deadline.",
    },
    {
      icon: MessageCircle,
      title: "Parent Communication",
      description:
        "Keep parents informed with direct messaging, progress reports, and automated notifications about their child's performance.",
    },
    {
      icon: FileText,
      title: "Assignment Creation",
      description:
        "Create, distribute, and collect assignments digitally. Set deadlines, provide resources, and track submissions effortlessly.",
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      description:
        "Mark attendance quickly with intuitive tools. Generate reports and identify patterns with automatic alerts for absences.",
    },
    {
      icon: Award,
      title: "Student Recognition",
      description:
        "Celebrate achievements, track milestones, and motivate students with badges, certificates, and performance recognition.",
    },
  ];

  const highlightFeatures: HighlightFeature[] = [
    {
      title: "Efficient Grading & Assessment",
      description:
        "Save hours every week with intelligent grading tools. Create rubrics, grade assignments, and provide feedback all in one place. Automatic grade calculations and analytics help you focus on teaching, not paperwork.",
      imageSrc: "/imgs/placeholder-grading.jpg",
      imageAlt: "Teacher grading dashboard",
      benefits: [
        "Create custom rubrics and grading criteria",
        "Auto-calculate final grades with weighted categories",
        "Provide rich feedback with comments and annotations",
        "Track grade distribution and identify trends",
      ],
    },
    {
      title: "Comprehensive Student Insights",
      description:
        "Understand each student's journey with detailed performance tracking. Identify learning gaps early, monitor improvement over time, and tailor your teaching to individual needs.",
      imageSrc: "/imgs/placeholder-student-tracking.jpg",
      imageAlt: "Student performance tracking",
      benefits: [
        "Individual student performance dashboards",
        "Progress tracking across subjects and assessments",
        "Early warning system for at-risk students",
        "Personalized learning recommendations",
      ],
    },
    {
      title: "Streamlined Class Management",
      description:
        "Keep your classroom organized with powerful scheduling and planning tools. Manage multiple subjects, coordinate with colleagues, and ensure nothing falls through the cracks.",
      imageSrc: "/imgs/placeholder-schedule.jpg",
      imageAlt: "Teacher schedule management",
      benefits: [
        "Visual calendar for all your classes and events",
        "Lesson planning with curriculum mapping",
        "Resource library for teaching materials",
        "Collaboration tools for team teaching",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroWithLaptop
        title="Teaching Made Simple, Impact Amplified"
        subtitle="Spend less time on administrative tasks and more time inspiring students. Our platform handles the paperwork so you can focus on what matters most."
        ctaPrimaryText="Start Free Trial"
        ctaSecondaryText="Watch Demo"
        imageSrc="/imgs/placeholder-teacher-dashboard.jpg"
        imageAlt="Teacher dashboard preview"
      />

      <FeatureGrid
        features={features}
        title="Tools Designed for Educators"
        subtitle="Everything you need to manage your classroom efficiently and effectively"
      />

      <FeatureHighlight features={highlightFeatures} />

      <CTASection
        title="Join Thousands of Teachers Already Using SmartEduHub"
        subtitle="Start your free 30-day trial today. No credit card required. Experience the difference that smart tools can make in your teaching."
        primaryButtonText="Get Started Free"
        secondaryButtonText="Book a Walkthrough"
      />

      <Footer />
    </div>
  );
}
