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
  BookOpen,
  CheckSquare,
  BarChart3,
  Brain,
  Target,
  MessageCircle,
  Trophy,
  Calendar,
  Zap,
} from "lucide-react";

export default function StudentsHomepage() {
  const features: Feature[] = [
    {
      icon: CheckSquare,
      title: "Assignment Hub",
      description:
        "View all your assignments in one place. Track deadlines, submit work digitally, and receive instant feedback from teachers.",
    },
    {
      icon: BookOpen,
      title: "Learning Resources",
      description:
        "Access course materials, video lessons, study guides, and practice tests anytime, anywhere. Learning at your own pace.",
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      description:
        "Visualize your academic progress with intuitive charts and graphs. See your strengths and identify areas to improve.",
    },
    {
      icon: Brain,
      title: "AI Learning Assistant",
      description:
        "Get personalized help with homework, exam prep, and difficult concepts. Your 24/7 study companion powered by AI.",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description:
        "Set academic goals, track your progress, and celebrate achievements. Stay motivated on your journey to success.",
    },
    {
      icon: MessageCircle,
      title: "Teacher Connect",
      description:
        "Ask questions, request help, and communicate with teachers directly. Get the support you need when you need it.",
    },
    {
      icon: Trophy,
      title: "Achievements & Badges",
      description:
        "Earn badges and certificates for your accomplishments. Showcase your achievements and build your academic portfolio.",
    },
    {
      icon: Calendar,
      title: "Smart Schedule",
      description:
        "Stay organized with your class schedule, exam dates, and assignment deadlines all synced in one calendar.",
    },
    {
      icon: Zap,
      title: "Quick Results",
      description:
        "Get instant access to your test scores, grades, and feedback. Know where you stand and take action quickly.",
    },
  ];

  const highlightFeatures: HighlightFeature[] = [
    {
      title: "Your Personal Learning Hub",
      description:
        "Access all your subjects, assignments, and resources in one organized space. Stay on top of your coursework with a dashboard designed specifically for student success.",
      imageSrc: "/imgs/placeholder-student-dashboard.jpg",
      imageAlt: "Student dashboard overview",
      benefits: [
        "One-click access to all your subjects and materials",
        "Visual progress tracking across all courses",
        "Upcoming assignments and deadlines at a glance",
        "Quick links to frequently used resources",
      ],
    },
    {
      title: "AI-Powered Study Assistant",
      description:
        "Get personalized help whenever you're stuck. Our AI assistant understands your learning style, helps explain complex topics, and provides practice questions to reinforce your understanding.",
      imageSrc: "/imgs/placeholder-ai-assistant.jpg",
      imageAlt: "AI learning assistant interface",
      benefits: [
        "24/7 homework help and concept explanations",
        "Personalized study recommendations based on performance",
        "Practice questions tailored to your learning needs",
        "Exam preparation with smart study plans",
      ],
    },
    {
      title: "Track Your Success Journey",
      description:
        "Understand your academic performance with detailed analytics and insights. See your growth over time, identify patterns, and make informed decisions about your studies.",
      imageSrc: "/imgs/placeholder-student-analytics.jpg",
      imageAlt: "Student performance analytics",
      benefits: [
        "Grade trends and performance visualizations",
        "Subject-wise strength and weakness analysis",
        "Comparison with class averages (anonymous)",
        "Achievement timeline and milestone tracking",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <HeroCentered
        title="Learn Smarter, Not Harder"
        subtitle="Your all-in-one platform for assignments, grades, resources, and personalized learning support. Take control of your academic journey."
        ctaPrimaryText="Start Learning Free"
        ctaSecondaryText="Explore Features"
        imageSrc="/imgs/placeholder-student-hero.jpg"
        imageAlt="Student learning platform"
      />

      <FeatureGrid
        features={features}
        title="Built for Modern Students"
        subtitle="Everything you need to excel in your studies, all in one place"
      />

      <FeatureHighlight features={highlightFeatures} />

      <CTASection
        title="Ready to Level Up Your Learning?"
        subtitle="Join millions of students already achieving more with SmartEduHub. Start your journey to academic excellence today - it's completely free!"
        primaryButtonText="Sign Up Free"
        secondaryButtonText="Watch Tutorial"
      />

      <Footer />
    </div>
  );
}
