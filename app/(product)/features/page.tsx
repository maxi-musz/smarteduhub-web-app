"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetachedCard from "@/components/ui/DetachedCard";
import Navigation from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { OnboardingModal } from "@/components/home/OnboardingModal";
import {
  BookOpen,
  Users,
  BarChart3,
  MessageSquare,
  CreditCard,
  Zap,
} from "lucide-react";

export default function FeaturesPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const router = useRouter();

  const coreFeatures = [
    {
      icon: BookOpen,
      title: "Curriculum Management",
      description:
        "Create, organize, and deliver structured learning materials across all subjects and grade levels.",
      benefits: [
        "Organize content by subject and topic",
        "Upload and share learning materials",
        "Government standards alignment",
        "Version control and content updates",
      ],
    },
    {
      icon: Users,
      title: "Student & Staff Management",
      description:
        "Centralized database for managing all student and staff information.",
      benefits: [
        "Comprehensive student profiles",
        "Staff performance tracking",
        "Attendance monitoring and reporting",
        "Automated enrollment and registration",
      ],
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track progress, analyze performance, and generate comprehensive reports with data-driven insights.",
      benefits: [
        "Real-time performance dashboards",
        "Student progress tracking",
        "Custom report generation",
        "Predictive analytics for intervention",
      ],
    },
    {
      icon: CreditCard,
      title: "Financial Management",
      description:
        "Streamline fee collection, track expenses, and manage school finances efficiently.",
      benefits: [
        "Automated fee collection and reminders",
        "Expense tracking and budgeting",
        "Financial reports and insights",
        "Multiple payment method support",
      ],
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description:
        "Enable seamless interaction between teachers, students, parents, and administrators.",
      benefits: [
        "Secure messaging system",
        "Announcement broadcasting",
        "Parent-teacher conference scheduling",
        "Real-time notifications",
      ],
    },
    {
      icon: Zap,
      title: "AI Learning Assistant",
      description:
        "24/7 AI-powered homework help and personalized learning recommendations for students.",
      benefits: [
        "Instant homework assistance",
        "Personalized learning paths",
        "Adaptive question generation",
        "Smart content recommendations",
      ],
    },
  ];

  // Array of unique gradient colors for each card's icon
  const iconColors = [
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
  ];

  // Border colors to match
  const borderColors = [
    "#8B5CF6", // purple
    "#3B82F6", // blue
    "#10B981", // green
    "#F97316", // orange
    "#EC4899", // pink
    "#14B8A6", // teal
  ];

  const additionalFeatures = [
    {
      category: "Administrative Tools",
      features: [
        "Multi-campus management",
        "Resource allocation tracking",
        "Document management system",
        "Automated report generation",
        "Compliance and audit trails",
      ],
    },
    {
      category: "Teaching Tools",
      features: [
        "Lesson plan builder",
        "Assignment creation and grading",
        "Quiz and test generator",
        "Gradebook management",
        "Rubric-based assessment",
      ],
    },
    {
      category: "Parent Portal",
      features: [
        "Real-time grade access",
        "Attendance monitoring",
        "Fee payment tracking",
        "Direct teacher communication",
        "Event calendar and notifications",
      ],
    },
    {
      category: "Security & Compliance",
      features: [
        "Role-based access control",
        "Data encryption",
        "Regular backups",
        "GDPR compliance",
        "Audit logging",
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-10 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-brand-heading leading-tight mb-6">
              Everything you need to manage education{" "}
              <span className="text-brand-primary">effectively</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-brand-secondary mb-8">
              A comprehensive suite of tools designed for teachers, students,
              and administrators to streamline operations and enhance learning
              outcomes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-brand-primary hover:bg-brand-primary-hover px-8 py-3"
                onClick={() => setIsOnboardingOpen(true)}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3"
                onClick={() => router.push("/support")}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-heading mb-12 lg:mb-16">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {coreFeatures.map((feature, index) => (
                <DetachedCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  benefits={feature.benefits}
                  borderColor={borderColors[index % borderColors.length]}
                  iconBgColor={iconColors[index % iconColors.length]}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features by Role */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-heading mb-4">
                Built for Everyone
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-brand-secondary">
                Tailored features for each role in your educational institution
              </p>
            </div>

            <Tabs defaultValue="admin" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 lg:mb-12">
                <TabsTrigger
                  value="admin"
                  className="text-sm md:text-base data-[state=active]:bg-brand-primary data-[state=active]:text-white"
                >
                  Administrators
                </TabsTrigger>
                <TabsTrigger
                  value="teachers"
                  className="text-sm md:text-base data-[state=active]:bg-brand-primary data-[state=active]:text-white"
                >
                  Teachers
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="text-sm md:text-base data-[state=active]:bg-brand-primary data-[state=active]:text-white"
                >
                  Students
                </TabsTrigger>
                <TabsTrigger
                  value="parents"
                  className="text-sm md:text-base data-[state=active]:bg-brand-primary data-[state=active]:text-white"
                >
                  Parents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Centralized Management
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          School-wide oversight and control
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Staff performance monitoring
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Resource allocation optimization
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Comprehensive reporting dashboards
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Financial Control
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Budget planning and tracking
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Automated fee collection
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Expense categorization and analysis
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Financial forecasting tools
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="teachers">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Teaching Tools
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Digital lesson plan builder
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Assignment creation and distribution
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Automated grading assistance
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Interactive quiz and test tools
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Student Engagement
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Track individual student progress
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Personalized feedback tools
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Parent communication portal
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Performance analytics and insights
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="students">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Learning Resources
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Access digital curriculum materials
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          24/7 AI homework assistance
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Interactive learning modules
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Class activities and events calendar
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Progress Tracking
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Real-time grade visibility
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Assignment submission tracking
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Performance analytics
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Real-time feedback from teachers
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="parents">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Stay Informed
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Real-time grade and attendance access
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Instant notifications and alerts
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          School announcements and events
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Progress reports and analytics
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-brand-heading">
                        Easy Communication
                      </h3>
                      <ul className="space-y-3 text-sm md:text-base text-brand-secondary">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Direct messaging with administrators
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Parent-teacher conference notifications
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Online fee payment
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2"></span>
                          Receipt and transcript requests
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-brand-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Future-Proof Your School Today!
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join schools already using SmartEdu Hub to streamline operations
              and enhance learning outcomes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-white text-brand-primary hover:bg-gray-100 px-8 py-3"
                onClick={() => setIsOnboardingOpen(true)}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3"
                onClick={() => router.push("/support")}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </>
  );
}
