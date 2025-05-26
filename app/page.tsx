"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  BarChart3,
  BookOpen,
  Users,
  MessageSquare,
  User,
  FileText,
  ChevronDown,
  CreditCard,
  Smartphone,
  Globe,
  Zap,
  Shield,
  Star,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Principal, Westside High School",
      text: "EduManage has completely transformed how we run our school. We've reduced paperwork by over 90% and our staff can focus on what really matters - teaching our students.",
      avatar: "/lovable-uploads/placeholder-avatar-1.jpg",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Administrator, Lincoln Elementary",
      text: "The administrative time savings have been incredible. Tasks that used to take days now take minutes, and our parents love having digital access to their children's information.",
      avatar: "/lovable-uploads/placeholder-avatar-2.jpg",
      rating: 5,
    },
    {
      name: "Emma Parker",
      role: "5th Grade Teacher, Oakridge Academy",
      text: "As a teacher, I can easily track student progress, plan lessons, and communicate with parents all in one place. EduManage has made my job so much easier and more effective.",
      avatar: "/lovable-uploads/placeholder-avatar-3.jpg",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "IT Director, Metro Schools",
      text: "Implementation was seamless and the support team was exceptional. Our entire district is now more efficient and data-driven than ever before.",
      avatar: "/lovable-uploads/placeholder-avatar-4.jpg",
      rating: 5,
    },
  ];

  const partners = [
    { name: "Samsung Pay", icon: "💳" },
    { name: "Western Union", icon: "💰" },
    { name: "Payoneer", icon: "🏦" },
    { name: "American Express", icon: "💳" },
    { name: "Bitcoin", icon: "₿" },
    { name: "OpenSea", icon: "🌊" },
    { name: "Gumroad", icon: "🛍️" },
    { name: "Square", icon: "⬜" },
  ];

  // Infinite scroll effect for partners
  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.getElementById("partners-container");
      if (container) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-800">Website</div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <Button variant="outline" className="mr-2">
                Login
              </Button>
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA]">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Simplify how you manage students, teachers and paperwork with{" "}
              <span className="text-[#4F46E5]">SmartEdu Hub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              SmartEdu Hub helps school owners and administrators manage
              finance, digitize operations, boost efficiency and focus on
              education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA] px-8 py-3 text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="px-8 py-3 text-lg">
                See How It Works
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Finances</h3>
                <p className="text-gray-600">
                  Track income, control expenses and simplify budgeting
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">
                  Track performance, monitor teachers, students & expenses
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Digital Curriculum
                </h3>
                <p className="text-gray-600">
                  Access & deliver structured, up-to-date learning materials
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-gray-600">24/7 learning support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - Infinite Loop */}
      <section className="bg-white py-12 overflow-hidden">
        <div className="container mx-auto px-6">
          <p className="text-center text-[#4F46E5] font-medium mb-8">
            Join 1,500+ schools already registered
          </p>
          <div
            id="partners-container"
            className="flex items-center space-x-12 opacity-60 overflow-hidden"
            style={{
              animation: "scroll 20s linear infinite",
              whiteSpace: "nowrap",
            }}
          >
            {/* Double the partners for seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-gray-700 font-bold flex-shrink-0"
              >
                <span className="text-2xl">{partner.icon}</span>
                <span>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      {/* Features Section - Left Aligned */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage education effectively
            </h2>
            <p className="text-xl text-gray-600">
              A comprehensive suite of tools designed for teachers, students,
              and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Curriculum Manager
              </h3>
              <p className="text-gray-600">
                Create and organize subjects, topics, and learning materials in
                a structured digital format.
              </p>
            </div>

            <div className="text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Performance Analytics
              </h3>
              <p className="text-gray-600">
                Track student progress, analyze results, and generate
                comprehensive reports.
              </p>
            </div>

            <div className="text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Learning Assistant
              </h3>
              <p className="text-gray-600">
                Get instant help with homework and personalized learning
                recommendations.
              </p>
            </div>

            <div className="text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Communication Hub
              </h3>
              <p className="text-gray-600">
                Enable seamless interaction between teachers, students, and
                administrators.
              </p>
            </div>

            <div className="text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Student Portal
              </h3>
              <p className="text-gray-600">
                Access learning materials, submit assignments, and track
                progress in one place.
              </p>
            </div>

            <div className="text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Admin Dashboard
              </h3>
              <p className="text-gray-600">
                Manage users, monitor school performance, and handle
                administrative tasks efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Blue Icons and Dots */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Benefits for Everyone
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  For Teachers
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Create and manage digital curriculum
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Track student performance
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Automated grading assistance
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Easy communication tools
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Detailed analytics and reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  For Students
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Structured learning materials
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    24/7 AI homework assistance
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Progress tracking
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Interactive assignments
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Personalized feedback
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  For Administrators
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Centralized school management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Performance monitoring
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Resource allocation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Data-driven insights
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#4F46E5] rounded-full mr-3"></span>
                    Streamlined operations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Proper Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What school leaders are saying
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it. Here's what educators using
              SmartEdu Hub have to say.
            </p>
          </div>

          <Carousel className="max-w-6xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="p-6 h-full transition-all duration-300 hover:bg-[#4F46E5] hover:text-white group">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm opacity-70">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-current text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section - Working Accordion */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about using SmartEdu Hub to manage
              your institution.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="owners" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger
                  value="owners"
                  className="px-6 py-3 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  School Owners & Administrators
                </TabsTrigger>
                <TabsTrigger
                  value="teachers"
                  className="px-6 py-3 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Teachers & Educators
                </TabsTrigger>
                <TabsTrigger
                  value="parents"
                  className="px-6 py-3 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Parents & Students
                </TabsTrigger>
              </TabsList>

              <TabsContent value="owners">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="setup">
                    <AccordionTrigger className="text-left">
                      How long does it take to set up SmartEdu Hub for my
                      institution?
                    </AccordionTrigger>
                    <AccordionContent>
                      Setting up SmartEdu Hub typically takes 1-2 weeks
                      depending on your institution size. Our dedicated support
                      team will guide you through the entire process, including
                      data migration, staff training, and system customization.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="campuses">
                    <AccordionTrigger className="text-left">
                      Can SmartEdu Hub handle multiple campuses or branches?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes! SmartEdu Hub is designed to manage multiple campuses
                      from a single dashboard. You can track performance, manage
                      staff, and monitor operations across all your locations
                      with centralized reporting and analytics.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="reports">
                    <AccordionTrigger className="text-left">
                      What types of reports can I generate?
                    </AccordionTrigger>
                    <AccordionContent>
                      SmartEdu Hub offers comprehensive reporting including
                      student performance analytics, financial reports,
                      attendance tracking, staff productivity metrics, and
                      custom reports tailored to your specific needs.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="migration">
                    <AccordionTrigger className="text-left">
                      How do we handle student or staff data migration?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our technical team handles all data migration securely and
                      efficiently. We support imports from Excel, CSV files, and
                      most existing school management systems. All data is
                      encrypted and handled according to educational privacy
                      standards.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="limits">
                    <AccordionTrigger className="text-left">
                      Is there a limit to the number of students or staff we can
                      add?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our plans are designed to scale with your institution.
                      From small schools to large districts, we offer flexible
                      pricing tiers with no artificial limits on student or
                      staff numbers.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="teachers">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="curriculum">
                    <AccordionTrigger className="text-left">
                      How can I create and manage my digital curriculum?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our intuitive curriculum builder allows you to create
                      lessons, upload materials, set learning objectives, and
                      track student progress. You can organize content by
                      subject, grade level, and learning standards with
                      drag-and-drop simplicity.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="grading">
                    <AccordionTrigger className="text-left">
                      Does the platform help with grading and assessments?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes! SmartEdu Hub includes automated grading for multiple
                      choice and short answer questions, rubric-based grading
                      tools, and detailed analytics to help you understand
                      student performance patterns.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="parents">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="progress">
                    <AccordionTrigger className="text-left">
                      How can I track my child's progress?
                    </AccordionTrigger>
                    <AccordionContent>
                      Parents have access to a dedicated portal where you can
                      view real-time grades, attendance records, assignment
                      submissions, and teacher feedback. You'll also receive
                      notifications about important updates and upcoming events.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="communication">
                    <AccordionTrigger className="text-left">
                      How can I communicate with teachers and school staff?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our platform includes secure messaging, scheduled
                      parent-teacher conferences, and announcement systems. You
                      can easily reach out to teachers, view school
                      announcements, and stay connected with your child's
                      education.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Footer - Side by Side Layout */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Get the latest updates about SmartEdu Hub features and releases
              </h3>
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
              />
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA] px-6 py-3 h-auto">
                Subscribe
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Updates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Support
                    </a>
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
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Security
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
                  <li>
                    <a href="#" className="hover:text-white">
                      Case Studies
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      FAQs
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
                  <li>
                    <a href="#" className="hover:text-white">
                      Security
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Cookies
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
        </div>
      </footer>
    </div>
  );
};

export default Home;
