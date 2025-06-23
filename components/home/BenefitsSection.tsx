import { BookOpen, Users, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefitsData = [
  {
    title: "For Teachers",
    icon: <BookOpen className="w-[34px] h-[34px] text-brand-primary" />,
    items: [
      "Create and manage digital curriculum",
      "Track student performance",
      "Automated grading assistance",
      "Easy communication tools",
      "Detailed analytics and reports",
    ],
  },
  {
    title: "For Students",
    icon: <Users className="w-[34px] h-[34px] text-brand-primary" />,
    items: [
      "Structured learning materials",
      "24/7 AI homework assistance",
      "Progress tracking",
      "Interactive assignments",
      "Personalized feedback",
    ],
  },
  {
    title: "For Administrators",
    icon: <Building2 className="w-[34px] h-[34px] text-brand-primary" />,
    items: [
      "Centralized school management",
      "Performance monitoring",
      "Resource allocation",
      "Data-driven insights",
      "Streamlined operations",
    ],
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-38 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-brand-heading mb-18">
          Benefits for Everyone
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {benefitsData.map((benefit, index) => (
            <Card
              key={index}
              className="bg-[#faf6fe] border-2 border-brand-border rounded-xl shadow-brand hover:shadow-lg transition-shadow duration-500 p-6"
            >
              <CardContent className="p-0">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-[18px] font-semibold text-brand-heading mb-4">
                  {benefit.title}
                </h3>
                <ul className="space-y-2 text-[16px] font-normal text-brand-secondary">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-2 h-2 mt-2 bg-brand-primary rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
