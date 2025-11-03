"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Mail,
  Phone,
  BookOpen,
  Video,
  FileText,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const supportChannels = [
    {
      icon: <MessageSquare className="w-8 h-8 text-[#4F46E5]" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 9 AM - 6 PM EST",
      action: "Start Chat",
    },
    {
      icon: <Mail className="w-8 h-8 text-[#4F46E5]" />,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24 hours",
      action: "Send Email",
    },
    {
      icon: <Phone className="w-8 h-8 text-[#4F46E5]" />,
      title: "Phone Support",
      description: "Speak with a support specialist",
      availability: "Enterprise plans only",
      action: "Call Now",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-[#4F46E5]" />,
      title: "Knowledge Base",
      description: "Browse our comprehensive guides",
      availability: "Available 24/7",
      action: "Browse Articles",
    },
  ];

  const quickLinks = [
    {
      title: "Getting Started Guide",
      description: "Learn how to set up your SmartEdu Hub account",
      icon: <FileText className="w-6 h-6 text-[#4F46E5]" />,
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: <Video className="w-6 h-6 text-[#4F46E5]" />,
    },
    {
      title: "API Documentation",
      description: "Integrate SmartEdu Hub with your systems",
      icon: <BookOpen className="w-6 h-6 text-[#4F46E5]" />,
    },
    {
      title: "Community Forum",
      description: "Connect with other educators",
      icon: <MessageSquare className="w-6 h-6 text-[#4F46E5]" />,
    },
  ];

  const faqCategories = {
    general: [
      {
        question: "How do I get started with SmartEdu Hub?",
        answer:
          "Getting started is easy! Sign up for a free trial, complete the onboarding wizard, and our team will guide you through initial setup including importing student/staff data, configuring your curriculum, and training your team. Most schools are fully operational within 1-2 weeks.",
      },
      {
        question: "Can I import existing student and staff data?",
        answer:
          "Yes! We support bulk imports from Excel, CSV files, and most school management systems. Our migration team will help you map your existing data fields to SmartEdu Hub and ensure a smooth transition with zero data loss.",
      },
      {
        question: "Is training provided for staff and teachers?",
        answer:
          "Absolutely. We provide comprehensive training including live onboarding sessions, video tutorials, documentation, and ongoing support. Professional and Enterprise plans include personalized training sessions tailored to your institution's needs.",
      },
      {
        question: "How secure is my data?",
        answer:
          "We use bank-level encryption (256-bit SSL), perform daily automated backups, and store data in secure, SOC 2 certified data centers. We're fully compliant with GDPR, FERPA, and other educational data privacy regulations.",
      },
    ],
    technical: [
      {
        question: "What are the system requirements?",
        answer:
          "SmartEdu Hub is a cloud-based platform accessible through any modern web browser (Chrome, Firefox, Safari, Edge). We also offer native mobile apps for iOS and Android. You'll need a stable internet connection for optimal performance.",
      },
      {
        question: "Can I integrate SmartEdu Hub with other tools?",
        answer:
          "Yes! We offer API access on Professional and Enterprise plans, allowing integration with learning management systems, accounting software, and other educational tools. We also have pre-built integrations with popular platforms.",
      },
      {
        question: "What happens if there's downtime?",
        answer:
          "We maintain 99.9% uptime with redundant servers and automatic failover. In the rare event of downtime, you can access cached data offline, and all information syncs automatically when connection is restored. Enterprise plans include SLA guarantees.",
      },
      {
        question: "How do I backup my data?",
        answer:
          "All data is automatically backed up daily to multiple secure locations. You can also export your data anytime in various formats (CSV, Excel, PDF). Enterprise plans include on-demand backup and restore capabilities.",
      },
    ],
    billing: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, debit cards, bank transfers, and for enterprise clients, we can arrange invoicing. All payments are processed securely through our PCI-compliant payment gateway.",
      },
      {
        question: "Can I change my plan later?",
        answer:
          "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of your current billing cycle with credits applied to your account.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 14-day money-back guarantee for new customers. If you're not satisfied within the first 14 days, contact us for a full refund. After that period, we don't offer refunds but you can cancel anytime.",
      },
      {
        question: "Are there any setup fees?",
        answer:
          "No setup fees for Starter and Professional plans. Enterprise plans may include implementation fees depending on customization requirements, data migration complexity, and training needs. We'll provide a detailed quote upfront.",
      },
    ],
    features: [
      {
        question: "How does the AI Learning Assistant work?",
        answer:
          "Our AI assistant uses advanced natural language processing to help students with homework, explain concepts, and provide personalized learning recommendations. It's available 24/7 and adapts to each student's learning style and pace.",
      },
      {
        question: "Can parents access the system?",
        answer:
          "Yes! Parents get their own portal where they can view grades, attendance, upcoming assignments, communicate with teachers, pay fees, and receive notifications about their child's progress and school events.",
      },
      {
        question: "How does multi-campus management work?",
        answer:
          "Enterprise plans include centralized dashboard to manage multiple campuses from one account. You can track performance, allocate resources, generate consolidated reports, and maintain individual campus autonomy while ensuring district-wide standards.",
      },
      {
        question: "Can I customize reports?",
        answer:
          "Yes! Create custom reports with our drag-and-drop report builder. Filter by date range, student groups, subjects, or any data point. Schedule automated reports to be sent to stakeholders, and export in multiple formats (PDF, Excel, CSV).",
      },
    ],
  };

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
                className="text-gray-600 hover:text-blue-600 transition-colors"
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
                className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors"
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
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            How can we <span className="text-[#4F46E5]">help you</span>?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get the support you need to make the most of SmartEdu Hub
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-lg"
            />
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportChannels.map((channel, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    {channel.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{channel.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {channel.availability}
                  </p>
                  <Button className="w-full bg-[#4F46E5] hover:bg-[#4338CA]">
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Popular Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {quickLinks.map((link, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about SmartEdu Hub
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Technical
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Features
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Accordion type="single" collapsible className="w-full">
                  {faqCategories.general.map((faq, index) => (
                    <AccordionItem key={index} value={`general-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="technical">
                <Accordion type="single" collapsible className="w-full">
                  {faqCategories.technical.map((faq, index) => (
                    <AccordionItem key={index} value={`technical-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="billing">
                <Accordion type="single" collapsible className="w-full">
                  {faqCategories.billing.map((faq, index) => (
                    <AccordionItem key={index} value={`billing-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="features">
                <Accordion type="single" collapsible className="w-full">
                  {faqCategories.features.map((faq, index) => (
                    <AccordionItem key={index} value={`features-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Still need help?
              </h2>
              <p className="text-xl text-gray-600">
                Send us a message and we'll get back to you within 24 hours
              </p>
            </div>

            <Card className="p-8">
              <CardContent className="p-0">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                      placeholder="john.doe@school.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                      placeholder="Your School Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]">
                      <option>Select a topic</option>
                      <option>Technical Support</option>
                      <option>Billing Question</option>
                      <option>Feature Request</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                      placeholder="Please describe your issue or question in detail..."
                    ></textarea>
                  </div>

                  <Button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] py-3 text-lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4F46E5]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 1,500+ schools using SmartEdu Hub to streamline operations and
            enhance learning outcomes.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-[#4F46E5] hover:bg-gray-100 px-8 py-3 text-lg">
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              Schedule Demo
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
