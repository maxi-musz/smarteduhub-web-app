// src/data/faqData.ts

export interface FAQQuestion {
  id: number;
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  slug: string;
  questions: FAQQuestion[];
}

export const faqData: FAQCategory[] = [
  {
    category: "Getting Started",
    slug: "getting-started",
    questions: [
      {
        id: 1,
        question: "How do I set up my school on SmartEduHub?",
        answer:
          "After signing up, you'll be guided through our onboarding process where you can upload staff and student data, configure your school's settings, and customize your learning modules. Our support team is available 24/7 to assist you.",
      },
      {
        id: 2,
        question: "What information do I need to get started?",
        answer:
          "You'll need your school registration details, staff roster, student enrollment data, and curriculum structure. You can upload this data via CSV files or enter it manually through our intuitive interface.",
      },
      {
        id: 3,
        question: "How long does initial setup take?",
        answer:
          "Most schools complete the initial setup within 2-3 business days. Our automated bulk upload tools and setup wizards streamline the process significantly.",
      },
    ],
  },
  {
    category: "Features & Tools",
    slug: "features-tools",
    questions: [
      {
        id: 4,
        question: "Can teachers create custom assignments and assessments?",
        answer:
          "Yes! Teachers have full control to create assignments, quizzes, and assessments with multiple question types, auto-grading, and customizable rubrics. They can also reuse and share content across classes.",
      },
      {
        id: 5,
        question: "Does the platform support virtual classrooms?",
        answer:
          "Absolutely. SmartEduHub includes integrated video conferencing, screen sharing, breakout rooms, and collaborative whiteboards for seamless virtual learning experiences.",
      },
      {
        id: 6,
        question: "How does the AI-powered personalization work?",
        answer:
          "Our AI analyzes student performance, learning patterns, and engagement to provide personalized learning paths, recommend resources, and identify students who may need additional support.",
      },
    ],
  },
  {
    category: "Data & Security",
    slug: "data-security",
    questions: [
      {
        id: 7,
        question: "How is student data protected?",
        answer:
          "We use bank-level encryption, comply with FERPA and GDPR standards, and implement role-based access controls. All data is stored in secure, geo-redundant data centers with regular security audits.",
      },
      {
        id: 8,
        question: "Can I export my data?",
        answer:
          "Yes, you have complete ownership of your data. You can export all student records, grades, attendance, and other data in multiple formats (CSV, PDF, Excel) at any time.",
      },
      {
        id: 9,
        question: "What happens if we cancel our subscription?",
        answer:
          "You'll have 90 days to export all your data. We provide full data export tools and assistance to ensure a smooth transition.",
      },
    ],
  },
  {
    category: "Billing & Plans",
    slug: "billing-plans",
    questions: [
      {
        id: 10,
        question: "What pricing plans do you offer?",
        answer:
          "We offer flexible plans based on school size: Starter (up to 100 students), Professional (100-500 students), and Enterprise (500+ students). All plans include core features with premium add-ons available.",
      },
      {
        id: 11,
        question: "Is there a free trial?",
        answer:
          "Yes! We offer a 30-day free trial with full access to all features. No credit card required. Our team will help you get set up and answer any questions.",
      },
      {
        id: 12,
        question: "Do you offer discounts for non-profit schools?",
        answer:
          "Yes, we provide special pricing for non-profit educational institutions, charter schools, and schools in underserved communities. Contact our sales team for details.",
      },
    ],
  },
  {
    category: "Support",
    slug: "support",
    questions: [
      {
        id: 13,
        question: "What kind of support do you provide?",
        answer:
          "We offer 24/7 email support, live chat during business hours, comprehensive documentation, video tutorials, and dedicated account managers for Enterprise plans. Training webinars are available weekly.",
      },
      {
        id: 14,
        question: "Do you provide training for teachers and staff?",
        answer:
          "Yes! We offer live onboarding sessions, on-demand video tutorials, teacher certification programs, and ongoing training webinars to ensure your team maximizes the platform's potential.",
      },
      {
        id: 15,
        question: "How quickly do you respond to support requests?",
        answer:
          "Critical issues are addressed within 2 hours. Standard support requests receive responses within 24 hours. Enterprise customers get priority support with dedicated response times.",
      },
    ],
  },
  {
    category: "Integration",
    slug: "integration",
    questions: [
      {
        id: 16,
        question: "Can SmartEduHub integrate with our existing systems?",
        answer:
          "Yes! We offer integrations with popular SIS systems, Google Workspace, Microsoft 365, learning tools (Canvas, Blackboard), payment processors, and more. Custom integrations are available for Enterprise plans.",
      },
      {
        id: 17,
        question: "Do you have a mobile app?",
        answer:
          "Yes, we have native iOS and Android apps for students, teachers, and administrators. All features are accessible on mobile with offline functionality for key features.",
      },
      {
        id: 18,
        question: "Can parents access the platform?",
        answer:
          "Absolutely! Parents get dedicated portals to track their child's progress, communicate with teachers, view assignments, and receive real-time notifications about grades and attendance.",
      },
    ],
  },
];
