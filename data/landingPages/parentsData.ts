import { LandingPageData } from "@/types/landingPages";
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
  Smartphone,
  Zap,
} from "lucide-react";

export const parentsData: LandingPageData = {
  hero: {
    type: "laptop",
    title: "Stay Connected to Your Child's Learning Journey",
    subtitle:
      "Empower your involvement with real-time insights, seamless communication, and all the tools you need to support your child's success.",
    ctaPrimaryText: "Create Free Account",
    ctaSecondaryText: "See How It Works",
    imageSrc: "/svgs/parent-student-dashboard.svg",
    imageAlt: "Parent portal dashboard",
  },

  gettingStarted: {
    title: "Get Started in 3 Simple Steps",
    subtitle: "Your child's school provides access - start monitoring today",
    features: [
      {
        step: 1,
        icon: Eye,
        title: "Receive Access from School",
        description:
          "Your child's school will send you an email with login credentials and setup instructions. Check your inbox for the welcome message.",
      },
      {
        step: 2,
        icon: FileText,
        title: "Link Your Child's Account",
        description:
          "Log in with your credentials and link your child's profile to your parent account. You can add multiple children if needed.",
      },
      {
        step: 3,
        icon: TrendingUp,
        title: "Start Monitoring",
        description:
          "Access real-time updates on grades, attendance, assignments, and teacher communications. Stay informed and engaged in your child's education.",
      },
    ],
  },

  tabbedFeatures: {
    sectionTitle: "Everything You Need to Support Your Child",
    sectionSubtitle:
      "Stay informed, stay connected, and stay involved in your child's education",
    tabs: [
      {
        id: "child-overview",
        title: "Child Overview",
        badge: "Real-Time Monitoring",
        contentTitle: "Complete Visibility Into Your Child's Education",
        description:
          "Get a comprehensive view of your child's academic performance, attendance, and behavior in one centralized dashboard. Access grades, assignments, teacher feedback, and attendance records in real-time. Stay actively engaged in their learning journey with instant updates whenever new information becomes available.",
        mediaSrc: "/svgs/parent-student-dashboard.svg",
        mediaType: "image",
        mediaAlt: "Parent dashboard showing child's academic overview",
      },
      {
        id: "communication-hub",
        title: "Communication Hub",
        badge: "Stay Connected",
        contentTitle: "Seamless Communication with Educators",
        description:
          "Build strong partnerships with your child's teachers through easy, direct communication. Send messages, schedule parent-teacher conferences, and receive important updates without the hassle of phone calls or emails. Get notified instantly about your child's achievements, concerns, or upcoming events.",
        mediaSrc: "/svgs/parent-student-messages.svg",
        mediaType: "image",
        mediaAlt: "Parent-teacher communication interface",
      },
      {
        id: "performance-reports",
        title: "Performance Reports",
        badge: "Track Progress",
        contentTitle: "Detailed Analytics and Progress Tracking",
        description:
          "Understand your child's academic journey with comprehensive performance reports and analytics. View grade trends, attendance patterns, and behavioral notes. Identify strengths to celebrate and areas where your child may need additional support. Download report cards and transcripts anytime you need them.",
        mediaSrc: "/svgs/parent-student-performance.svg",
        mediaType: "image",
        mediaAlt: "Student performance reports and analytics",
      },
      {
        id: "calendar-events",
        title: "Calendar & Events",
        badge: "Stay Organized",
        contentTitle: "Never Miss Important Dates and Events",
        description:
          "Keep track of everything in one centralized calendar. View assignment deadlines, test dates, school events, parent-teacher conferences, and holidays. Set reminders for important dates, submit permission slips digitally, and stay on top of your child's educational schedule effortlessly.",
        mediaSrc: "/svgs/parent-student-events.svg",
        mediaType: "image",
        mediaAlt: "Parent calendar with school events and deadlines",
      },
    ],
  },

  highlights: {
    features: [
      {
        title: "Complete Visibility Into Your Child's Education",
        description:
          "Get a comprehensive view of your child's academic performance, attendance, and behavior. Access grades, assignments, and teacher feedback in real-time to stay actively engaged in their learning journey.",
        imageSrc: "/svgs/parent-student-dashboard.svg",
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
    ],
  },

  mobileApp: {
    title: "Monitor Your Child's Progress Anywhere",
    subtitle:
      "Stay connected to your child's education on the go. Receive instant notifications about grades, attendance, and important school updates.",
    features: [
      {
        icon: Bell,
        title: "Instant Alerts",
        description: "Get notified of grades and attendance updates",
      },
      {
        icon: Shield,
        title: "Secure Access",
        description: "Your family's data is protected",
      },
      {
        icon: MessageSquare,
        title: "Quick Messaging",
        description: "Communicate with teachers instantly",
      },
      {
        icon: Smartphone,
        title: "Multi-Child Support",
        description: "Manage multiple children from one app",
      },
    ],
    stats: [
      { value: "25K+", label: "Active Parents" },
      { value: "4.8★", label: "Parent Rating" },
      { value: "100%", label: "Satisfaction" },
    ],
    phoneImageSrc: "/imgs/store-download.png",
    phoneImageAlt: "SmartEduHub Parent Mobile App",
  },

  cta: {
    title: "Be the Supportive Parent Your Child Needs",
    subtitle:
      "Join thousands of parents using SmartEduHub to stay actively engaged in their children's education. Sign up free today.",
    primaryButtonText: "Get Started Now",
    secondaryButtonText: "Learn More",
  },
};
