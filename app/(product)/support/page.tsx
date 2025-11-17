"use client";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

import { MessageSquare, Mail, BookOpen, Video, FileText } from "lucide-react";
import DetachedCard from "@/components/ui/DetachedCard";
import FAQItem from "@/components/for/FAQItem";
import CategoryTabs from "@/components/for/CategoryTabs";
import ContactForm from "@/components/ui/ContactForm";
import { useState, useMemo } from "react";

export default function SupportPage() {
  const [activeCategorySlug, setActiveCategorySlug] = useState("general");

  const supportChannels = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description:
        "Get instant help from our support team. Available 9AM - 5PM GMT + 1",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message. Response within 24 hours",
    },
    // {
    //   icon: Phone,
    //   title: "Phone Support",
    //   description: "Speak with a support specialist. Enterprise plans only",
    // },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Browse our comprehensive guides. Available 24/7",
    },
  ];

  const quickLinks = [
    {
      icon: FileText,
      title: "Getting Started Guide",
      description: "Learn how to set up your SmartEdu Hub account",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
    },
    // {
    //   icon: BookOpen,
    //   title: "API Documentation",
    //   description: "Integrate SmartEdu Hub with your systems",
    // },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with other educators on WhatsApp",
    },
  ];

  const faqCategories = useMemo(
    () => [
      {
        category: "General",
        slug: "general",
        questions: [
          {
            id: "general-1",
            question: "How do I get started with SmartEdu Hub?",
            answer:
              "Getting started is easy! Sign up for a free trial, complete the onboarding wizard, and our team will guide you through initial setup including importing student/staff data, configuring your curriculum, and training your team. Most schools are fully operational within 1-2 weeks.",
          },
          {
            id: "general-2",
            question: "Can I import existing student and staff data?",
            answer:
              "Yes! We support bulk imports from Excel, CSV files, and most school management systems. Our migration team will help you map your existing data fields to SmartEdu Hub and ensure a smooth transition with zero data loss.",
          },
          {
            id: "general-3",
            question: "Is training provided for staff and teachers?",
            answer:
              "Absolutely. We provide comprehensive training including live onboarding sessions, video tutorials, documentation, and ongoing support. Professional and Enterprise plans include personalized training sessions tailored to your institution's needs.",
          },
          {
            id: "general-4",
            question: "How secure is my data?",
            answer:
              "We use bank-level encryption (256-bit SSL), perform daily automated backups, and store data in secure, SOC 2 certified data centers. We're fully compliant with GDPR, FERPA, and other educational data privacy regulations.",
          },
        ],
      },
      {
        category: "Technical",
        slug: "technical",
        questions: [
          {
            id: "technical-1",
            question: "What are the system requirements?",
            answer:
              "SmartEdu Hub is a cloud-based platform accessible through any modern web browser (Chrome, Firefox, Safari, Edge). We also offer native mobile apps for iOS and Android. You'll need a stable internet connection for optimal performance.",
          },
          {
            id: "technical-2",
            question: "Can I integrate SmartEdu Hub with other tools?",
            answer:
              "Yes! We offer API access on Professional and Enterprise plans, allowing integration with learning management systems, accounting software, and other educational tools. We also have pre-built integrations with popular platforms.",
          },
          {
            id: "technical-3",
            question: "What happens if there's downtime?",
            answer:
              "We maintain 99.9% uptime with redundant servers and automatic failover. In the rare event of downtime, you can access cached data offline, and all information syncs automatically when connection is restored. Enterprise plans include SLA guarantees.",
          },
          {
            id: "technical-4",
            question: "How do I backup my data?",
            answer:
              "All data is automatically backed up daily to multiple secure locations. You can also export your data anytime in various formats (CSV, Excel, PDF). Enterprise plans include on-demand backup and restore capabilities.",
          },
        ],
      },
      {
        category: "Billing",
        slug: "billing",
        questions: [
          {
            id: "billing-1",
            question: "What payment methods do you accept?",
            answer:
              "We accept all major credit cards, debit cards, bank transfers, and for enterprise clients, we can arrange invoicing. All payments are processed securely through our PCI-compliant payment gateway.",
          },
          {
            id: "billing-2",
            question: "Can I change my plan later?",
            answer:
              "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of your current billing cycle with credits applied to your account.",
          },
          {
            id: "billing-3",
            question: "Do you offer refunds?",
            answer:
              "Sadly, no. We offer a 3-month free trial so you can test all features risk-free before committing. After the trial, we do not provide refunds but you can cancel anytime without penalties.",
          },
          {
            id: "billing-4",
            question: "Are there any setup fees?",
            answer:
              "No setup fees for Starter and Professional plans. Enterprise plans may include implementation fees depending on customization requirements, data migration complexity, and training needs. We'll provide a detailed quote upfront.",
          },
        ],
      },
      {
        category: "Features",
        slug: "features",
        questions: [
          {
            id: "features-1",
            question: "How does the AI Assistant work?",
            answer:
              "Our AI assistant uses advanced natural language processing to help everyone, from providing useful insights to admins, allow teachers to generate lesson plans, and assist students with personalized learning support. It's available 24/7 and adapts to each user's needs.",
          },
          {
            id: "features-2",
            question: "Can parents access the system?",
            answer:
              "Yes! Parents get their own portal where they can view grades, attendance, upcoming assignments, communicate with teachers, pay fees, and receive notifications about their child's progress and school events.",
          },
          // {
          //   id: "features-3",
          //   question: "How does multi-campus management work?",
          //   answer:
          //     "Enterprise plans include centralized dashboard to manage multiple campuses from one account. You can track performance, allocate resources, generate consolidated reports, and maintain individual campus autonomy while ensuring district-wide standards.",
          // },
          {
            id: "features-3",
            question: "Can I generate reports?",
            answer:
              "Yes! Generate reports for various metrics and data points to make informed decisions. And also, generate automated result transcripts for students to be sent to parents, and can also export in multiple formats (PDF, Excel, CSV).",
          },
        ],
      },
    ],
    []
  );

  // Filter Questions based on active category
  const filteredQuestions = useMemo(() => {
    const currentCategory = faqCategories.find(
      (c) => c.slug === activeCategorySlug
    );
    if (!currentCategory) return [];
    return currentCategory.questions;
  }, [activeCategorySlug, faqCategories]);

  // Extract category tabs
  const categoryTabs = faqCategories.map((c) => ({
    category: c.category,
    slug: c.slug,
  }));

  // Handle category click
  const handleCategoryChange = (slug: string) => {
    setActiveCategorySlug(slug);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 lg:mb-6">
            Our team is on standby to answer your{" "}
            <span className="bg-gradient-to-r from-brand-primary to-brand-primary-hover bg-clip-text text-transparent">
              questions
            </span>
            ?
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600">
            Get the support you need to make the most of SmartEdu Hub
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8 lg:mb-16 max-w-3xl mx-auto">
            <h2 className="text-lg md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600">
              Find answers to common questions about SmartEduHub. Can&apos;t
              find what you&apos;re looking for? Contact our support team.
            </p>
          </div>

          {/* FAQ Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Category Navigation */}
            <div className="px-6 pt-6">
              <CategoryTabs
                categories={categoryTabs}
                activeSlug={activeCategorySlug}
                onSelectCategory={handleCategoryChange}
              />
            </div>

            {/* FAQ List */}
            <div className="pb-6">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((item) => (
                  <FAQItem
                    key={item.id}
                    question={item.question}
                    answer={item.answer}
                  />
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">
                    No questions found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />

      {/* Support Channels */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-lg md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 lg:mb-16">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {supportChannels.map((channel, index) => {
              const iconColors = [
                "bg-gradient-to-br from-purple-500 to-purple-600",
                "bg-gradient-to-br from-blue-500 to-blue-600",
                "bg-gradient-to-br from-green-500 to-green-600",
                "bg-gradient-to-br from-orange-500 to-orange-600",
              ];
              const borderColors = ["#8B5CF6", "#3B82F6", "#10B981", "#F97316"];
              return (
                <DetachedCard
                  key={index}
                  icon={channel.icon}
                  title={channel.title}
                  description={channel.description}
                  borderColor={borderColors[index]}
                  iconBgColor={iconColors[index]}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-lg md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 lg:mb-16">
            Popular Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {quickLinks.map((link, index) => {
              const iconColors = [
                "bg-gradient-to-br from-pink-500 to-pink-600",
                "bg-gradient-to-br from-teal-500 to-teal-600",
                "bg-gradient-to-br from-indigo-500 to-indigo-600",
                "bg-gradient-to-br from-red-500 to-red-600",
              ];
              const borderColors = ["#EC4899", "#14B8A6", "#6366F1", "#EF4444"];
              return (
                <DetachedCard
                  key={index}
                  icon={link.icon}
                  title={link.title}
                  description={link.description}
                  borderColor={borderColors[index]}
                  iconBgColor={iconColors[index]}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Commented out for now */}
      {/* 
      <section className="py-12 lg:py-20 bg-gradient-to-br from-brand-primary to-brand-primary-hover">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Ready to get started?
          </h2>
          <p className="text-sm md:text-base lg:text-xl text-white/90 mb-6 lg:mb-8 max-w-2xl mx-auto">
            Join 1,500+ schools using SmartEdu Hub to streamline operations and
            enhance learning outcomes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button className="bg-white text-brand-primary hover:bg-gray-100 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base lg:text-lg">
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base lg:text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
      */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
