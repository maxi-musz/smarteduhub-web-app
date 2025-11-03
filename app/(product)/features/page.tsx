"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Users,
  BarChart3,
  MessageSquare,
  FileText,
  Award,
  CreditCard,
  Shield,
  Zap,
  Globe,
  Smartphone,
  User,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: <BookOpen className="w-8 h-8 text-[#4F46E5]" />,
      title: "Digital Curriculum Management",
      description:
        "Create, organize, and deliver structured learning materials across all subjects and grade levels.",
      benefits: [
        "Easy content organization by subject and topic",
        "Upload and share learning materials instantly",
        "Align curriculum with educational standards",
        "Version control and content updates",
      ],
    },
    {
      icon: <Users className="w-8 h-8 text-[#4F46E5]" />,
      title: "Student & Staff Management",
      description:
        "Centralized database for managing all student and staff information with role-based access.",
      benefits: [
        "Comprehensive student profiles",
        "Staff directory and performance tracking",
        "Attendance monitoring and reporting",
        "Automated enrollment and registration",
      ],
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-[#4F46E5]" />,
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
      icon: <CreditCard className="w-8 h-8 text-[#4F46E5]" />,
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
      icon: <MessageSquare className="w-8 h-8 text-[#4F46E5]" />,
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
      icon: <Zap className="w-8 h-8 text-[#4F46E5]" />,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-800">
              SmartEdu Hub
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/features"
                className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/support"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Support
              </Link>
              <Button variant="outline" className="mr-2">
                Login
              </Button>
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA]">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Everything you need to manage education{" "}
            <span className="text-[#4F46E5]">effectively</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive suite of tools designed for teachers, students, and
            administrators to streamline operations and enhance learning
            outcomes.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-[#4F46E5] hover:bg-[#4338CA] px-8 py-3 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" className="px-8 py-3 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Core Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features by Role */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600">
              Tailored features for each role in your educational institution
            </p>
          </div>

          <Tabs defaultValue="admin" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
              >
                Administrators
              </TabsTrigger>
              <TabsTrigger
                value="teachers"
                className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
              >
                Teachers
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
              >
                Students
              </TabsTrigger>
              <TabsTrigger
                value="parents"
                className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
              >
                Parents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Centralized Management
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Multi-campus oversight and control
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Staff performance monitoring
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Resource allocation optimization
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Comprehensive reporting dashboards
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Financial Control
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Budget planning and tracking
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Automated fee collection
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Expense categorization and analysis
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Financial forecasting tools
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="teachers">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Teaching Tools
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Digital lesson plan builder
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Assignment creation and distribution
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Automated grading assistance
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Curriculum mapping tools
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Student Engagement
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Track individual student progress
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Personalized feedback tools
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Parent communication portal
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Performance analytics and insights
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Learning Resources
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Access digital curriculum materials
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        24/7 AI homework assistance
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Interactive learning modules
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Personalized learning paths
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Progress Tracking
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Real-time grade visibility
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Assignment submission tracking
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Performance analytics
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Goal setting and achievement tracking
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="parents">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Stay Informed
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Real-time grade and attendance access
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Instant notifications and alerts
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        School announcements and events
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Progress reports and analytics
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">
                      Easy Communication
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Direct messaging with teachers
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Schedule parent-teacher conferences
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Online fee payment
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3 mt-2"></span>
                        Submit permission forms digitally
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Additional Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((category, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mr-2 mt-2"></span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4F46E5]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your educational institution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 1,500+ schools already using SmartEdu Hub to streamline
            operations and enhance learning outcomes.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-[#4F46E5] hover:bg-gray-100 px-8 py-3 text-lg">
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-center">
              © 2024 SmartEdu Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
