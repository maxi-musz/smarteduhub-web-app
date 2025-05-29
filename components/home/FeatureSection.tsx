"use client";
import {
  BookOpen,
  BarChart3,
  Users,
  MessageSquare,
  Brain,
  Building2,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 w-full lg:w-3/5 mx-auto">
          <h2 className="text-4xl font-bold text-brand-heading mb-4">
            Everything you need to manage education effectively
          </h2>
          <p className="text-xl text-brand-secondary">
            A comprehensive suite of tools designed for teachers, students, and
            administrators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={BookOpen}
            title="Curriculum Manager"
            description="Create and organize subjects, topics, and learning materials in a structured digital format."
          />
          <FeatureCard
            icon={BarChart3}
            title="Performance Analytics"
            description="Track student progress, analyze results, and generate comprehensive reports."
          />
          <FeatureCard
            icon={Brain}
            title="AI Learning Assistant"
            description="Get instant help with homework and personalized learning recommendations."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Communication Hub"
            description="Enable seamless interaction between teachers, students, and administrators."
          />
          <FeatureCard
            icon={Users}
            title="Student Portal"
            description="Access learning materials, submit assignments, and track progress in one place."
          />
          <FeatureCard
            icon={Building2}
            title="Admin Dashboard"
            description="Manage users, monitor school performance, and handle administrative tasks efficiently."
          />
        </div>
      </div>
    </section>
  );
}

// FeatureCardProps
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// FeatureCard component
export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="border-2 border-brand-border rounded-md p-6 bg-white text-left shadow-brand hover:shadow-lg transition-shadow duration-500">
      <Icon className="w-[34px] h-[34px] text-brand-primary mb-4" />
      <h3 className="text-[18px] font-semibold text-brand-heading mb-2">
        {title}
      </h3>
      <p className="text-[16px] font-normal text-brand-secondary">
        {description}
      </p>
    </div>
  );
}
