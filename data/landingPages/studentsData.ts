import { LandingPageData } from "@/types/landingPages";
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
  Smartphone,
  Shield,
  Bell,
} from "lucide-react";

export const studentsData: LandingPageData = {
  hero: {
    type: "laptop",
    title: "Learn Smarter, Not Harder",
    subtitle:
      "Your all-in-one platform for assignments, grades, resources, and personalized learning support. Take control of your academic journey.",
    ctaPrimaryText: "Start Learning Free",
    ctaSecondaryText: "Explore Features",
    imageSrc: "/svgs/parent-student-dashboard.svg",
    imageAlt: "Student learning platform",
  },

  gettingStarted: {
    title: "Get Started in 3 Simple Steps",
    subtitle: "Your school provides access - just log in and start learning",
    features: [
      {
        step: 1,
        icon: CheckSquare,
        title: "Receive Your Credentials",
        description:
          "Your school will provide you with a username and password via email or through your teacher. Keep these credentials safe and secure.",
      },
      {
        step: 2,
        icon: BookOpen,
        title: "Set Up Your Profile",
        description:
          "Log in and complete your profile by adding a photo and updating your information. Explore your dashboard to see your classes and upcoming assignments.",
      },
      {
        step: 3,
        icon: Trophy,
        title: "Start Learning",
        description:
          "Access your courses, submit assignments, track your progress, and get help from your AI learning assistant whenever you need it.",
      },
    ],
  },

  tabbedFeatures: {
    sectionTitle: "Built for Modern Students",
    sectionSubtitle:
      "Everything you need to excel in your studies, all in one place",
    tabs: [
      {
        id: "learning-hub",
        title: "Learning Hub",
        badge: "All Your Courses",
        contentTitle: "Your Personal Learning Dashboard",
        description:
          "Access all your subjects, assignments, and resources in one organized space. Stay on top of your coursework with a dashboard designed specifically for student success. See upcoming deadlines, track your progress across all courses, and quickly access the materials you need to succeed.",
        mediaSrc: "/svgs/parent-student-dashboard.svg",
        mediaType: "image",
        mediaAlt: "Student dashboard with courses and assignments",
      },
      {
        id: "ai-tutor",
        title: "AI Tutor",
        badge: "24/7 Learning Assistant",
        contentTitle: "Get Help Anytime, Anywhere",
        description:
          "Your personal AI tutor understands your learning style and helps you master difficult concepts. Get homework help, exam preparation support, and personalized study recommendations based on your performance. It's like having a tutor available 24/7 who knows exactly what you need to succeed.",
        mediaSrc: "/imgs/admin-ai.png",
        mediaType: "image",
        mediaAlt: "AI learning assistant helping with homework",
      },
      {
        id: "progress-tracking",
        title: "Progress Tracking",
        badge: "Track Your Success",
        contentTitle: "Visualize Your Academic Journey",
        description:
          "Understand your performance with detailed analytics and insights. See your grades, track improvement over time, identify your strengths and areas for growth. Set academic goals, monitor your progress, and celebrate your achievements as you work toward success.",
        mediaSrc: "/svgs/parent-student-performance.svg",
        mediaType: "image",
        mediaAlt: "Student performance analytics and grade tracking",
      },
      {
        id: "resources-library",
        title: "Resources Library",
        badge: "Learning Materials",
        contentTitle: "Everything You Need to Learn",
        description:
          "Access a comprehensive library of learning resources including video lessons, study guides, practice tests, and course materials. Download content for offline study, bookmark important resources, and learn at your own pace with materials tailored to your curriculum.",
        mediaSrc: "/svgs/parent-student-subjects.svg",
        mediaType: "image",
        mediaAlt: "Student resources library with learning materials",
      },
    ],
  },

  highlights: {
    features: [
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
    ],
  },

  mobileApp: {
    title: "Learn on the Go",
    subtitle:
      "Access your courses, submit assignments, and study from anywhere. Your entire learning experience fits in your pocket.",
    features: [
      {
        icon: BookOpen,
        title: "Offline Access",
        description: "Download materials and study without internet",
      },
      {
        icon: Shield,
        title: "Safe & Secure",
        description: "Your academic data is protected",
      },
      {
        icon: Bell,
        title: "Assignment Alerts",
        description: "Never miss a deadline with notifications",
      },
      {
        icon: Smartphone,
        title: "Mobile Friendly",
        description: "Optimized interface for phones and tablets",
      },
    ],
    stats: [
      { value: "50K+", label: "Student Users" },
      { value: "4.7★", label: "Student Rating" },
      { value: "95%", label: "Success Rate" },
    ],
    phoneImageSrc: "/imgs/store-download.png",
    phoneImageAlt: "SmartEduHub Student Mobile App",
  },

  cta: {
    title: "Ready to Level Up Your Learning?",
    subtitle:
      "Join millions of students already achieving more with SmartEduHub. Start your journey to academic excellence today - it's completely free!",
    primaryButtonText: "Sign Up Free",
    secondaryButtonText: "Watch Tutorial",
  },
};
