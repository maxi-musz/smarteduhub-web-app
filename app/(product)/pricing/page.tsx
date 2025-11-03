"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small schools and institutions",
      monthlyPrice: 148500,
      annualPrice: 1425000,
      students: "Up to 200 students",
      features: [
        "Student & Staff Management",
        "Attendance Tracking",
        "Basic Reporting",
        "Parent Portal Access",
        "Mobile App Access",
        "Email Support",
        "5GB Storage",
      ],
      notIncluded: [
        "Advanced Analytics",
        "AI Learning Assistant",
        "Multi-Campus Management",
        "Custom Integrations",
        "Dedicated Account Manager",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For growing schools with advanced needs",
      monthlyPrice: 373500,
      annualPrice: 3585000,
      students: "Up to 500 students",
      features: [
        "Everything in Starter",
        "Digital Curriculum Management",
        "Advanced Analytics & Reporting",
        "AI Learning Assistant",
        "Automated Grading Tools",
        "Financial Management",
        "Priority Support",
        "50GB Storage",
        "API Access",
      ],
      notIncluded: [
        "Multi-Campus Management",
        "Custom Integrations",
        "Dedicated Account Manager",
        "White-label Options",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For large institutions and districts",
      monthlyPrice: null,
      annualPrice: null,
      students: "Unlimited students",
      features: [
        "Everything in Professional",
        "Multi-Campus Management",
        "Custom Integrations",
        "White-label Options",
        "Dedicated Account Manager",
        "24/7 Phone Support",
        "Unlimited Storage",
        "Advanced Security Features",
        "Custom Training Sessions",
        "SLA Guarantee",
      ],
      notIncluded: [],
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Verve, Visa, MasterCard), bank transfers, and for enterprise clients, we can arrange invoicing. All payments are processed securely through our encrypted payment gateway.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference immediately. When downgrading, the change will take effect at the end of your current billing cycle, and you'll be credited for any unused portion.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 14-day free trial for all our plans with no credit card required. You'll have full access to all features during the trial period so you can explore everything SmartEdu Hub has to offer.",
    },
    {
      question: "What happens if I exceed my student limit?",
      answer:
        "If you're approaching your student limit, we'll notify you in advance. You can either upgrade to the next tier or contact us for custom pricing. We'll never interrupt your service or charge unexpected fees.",
    },
    {
      question: "Do you offer discounts for multiple campuses?",
      answer:
        "Yes! We offer volume discounts for institutions managing multiple campuses. Contact our sales team for a custom quote tailored to your specific needs and the number of campuses you manage.",
    },
    {
      question: "What kind of support is included?",
      answer:
        "All plans include email support with response times based on your plan tier. Professional plans get priority support, while Enterprise clients receive 24/7 phone support plus a dedicated account manager for personalized assistance.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time with no penalties. If you're on a monthly plan, you won't be charged for the next month. Annual plans will continue until the end of the billing period with no refund for unused time.",
    },
    {
      question: "Is my data secure and backed up?",
      answer:
        "Absolutely. We use bank-level encryption for all data, perform daily automated backups, and store data in secure, redundant data centers. All plans include data backup and recovery, with Enterprise plans getting additional security features and compliance certifications.",
    },
  ];

  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
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
                className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors"
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
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Simple, transparent <span className="text-[#4F46E5]">pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your institution. No hidden fees, no
            surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#4F46E5] text-white"
                  : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === "annual"
                  ? "bg-[#4F46E5] text-white"
                  : "text-gray-600"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlighted
                  ? "border-2 border-[#4F46E5] shadow-xl scale-105"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#4F46E5] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  {plan.monthlyPrice ? (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          ₦
                          {billingCycle === "monthly"
                            ? plan.monthlyPrice.toLocaleString()
                            : Math.round(
                                plan.annualPrice / 12
                              ).toLocaleString()}
                        </span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>
                      {billingCycle === "annual" && (
                        <p className="text-sm text-gray-500 mt-1">
                          Billed annually at ₦
                          {plan.annualPrice.toLocaleString()}
                        </p>
                      )}
                      {billingCycle === "annual" && plan.monthlyPrice && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          Save ₦
                          {calculateSavings(
                            plan.monthlyPrice,
                            plan.annualPrice
                          ).savings.toLocaleString()}{" "}
                          per year
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-gray-900">
                      Custom
                    </div>
                  )}
                </div>

                <p className="text-sm font-medium text-gray-700 mb-6">
                  {plan.students}
                </p>

                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? "bg-[#4F46E5] hover:bg-[#4338CA]"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  {plan.monthlyPrice ? "Start Free Trial" : "Contact Sales"}
                </Button>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    What's included:
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="text-sm font-semibold text-gray-900 mt-4 mb-3">
                        Not included:
                      </p>
                      {plan.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <X className="w-5 h-5 text-gray-300 mr-2 flex-shrink-0" />
                          <span className="text-gray-400 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Compare all features
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            See which plan is right for your institution
          </p>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">
                    Starter
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">
                    Professional
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-700">Student Limit</td>
                  <td className="py-4 px-6 text-center text-gray-600">200</td>
                  <td className="py-4 px-6 text-center text-gray-600">500</td>
                  <td className="py-4 px-6 text-center text-gray-600">
                    Unlimited
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Storage</td>
                  <td className="py-4 px-6 text-center text-gray-600">5GB</td>
                  <td className="py-4 px-6 text-center text-gray-600">50GB</td>
                  <td className="py-4 px-6 text-center text-gray-600">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">
                    AI Learning Assistant
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">
                    Multi-Campus Management
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Support</td>
                  <td className="py-4 px-6 text-center text-gray-600">Email</td>
                  <td className="py-4 px-6 text-center text-gray-600">
                    Priority
                  </td>
                  <td className="py-4 px-6 text-center text-gray-600">
                    24/7 + Dedicated Manager
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pricing FAQs
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4F46E5]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team is here to help you find the perfect plan for your
            institution.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-[#4F46E5] hover:bg-gray-100 px-8 py-3 text-lg">
              Contact Sales
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
