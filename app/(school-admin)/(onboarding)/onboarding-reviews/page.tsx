"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { School, User, GraduationCap, ShieldUser } from "lucide-react";

// Custom ListDotIcon SVG component (replace with your Figma SVG)
const ListDotIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6" fill="#E2E8F0" />
    <circle cx="8" cy="8" r="3" fill="#E2E8F0" />
  </svg>
);

const OnboardReviews = () => {
  const router = useRouter();
  const { data } = useOnboarding();

  const handleProceed = () => {
    console.log("Final onboarding data:", data);
    alert("Proceeding to School Dashboard! (Implementation pending)");
    // You might redirect here in the future:
    // router.push("/dashboard");
  };

  const handleBack = () => {
    router.push("/onboarding-more-admins");
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-primary my-8">
            SmartEdu-Hub
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step 5 of 5</span>
            <span className="text-sm text-brand-primary font-medium">
              100% Complete
            </span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="bg-brand-bg rounded-md border-2 border-brand-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-brand-heading mb-2">
              Review & Complete Setup
            </h2>
            <p className="text-brand-light-accent-2 text-sm">
              All setup data has been configured & ready to go. You can now
              proceed to your admin
              <br />
              dashboard.
            </p>
          </div>

          {/* Review Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Classes */}
            <ReviewCard
              icon={<School className="w-5 h-5 text-white" />}
              iconColor="bg-brand-primary"
              title={`Classes (${data?.classes?.length || 0})`}
              items={data?.classes || []}
              renderItem={(item) => item}
              ListDotIcon={ListDotIcon}
            />

            {/* Teachers */}
            <ReviewCard
              icon={<User className="w-5 h-5 text-white" />}
              iconColor="bg-red-500"
              title={`Teachers (${data?.teachers?.length || 0})`}
              items={data?.teachers || []}
              renderItem={(teacher) =>
                `${teacher.firstName} ${teacher.lastName}`
              }
              ListDotIcon={ListDotIcon}
            />

            {/* Students */}
            <ReviewCard
              icon={<GraduationCap className="w-5 h-5 text-white" />}
              iconColor="bg-green-500"
              title={`Students (${data?.students?.length || 0})`}
              items={data?.students || []}
              renderItem={(student) =>
                `${student.firstName} ${student.lastName} (${student.studentClass})`
              }
              ListDotIcon={ListDotIcon}
            />

            {/* Admins */}
            <ReviewCard
              icon={<ShieldUser className="w-5 h-5 text-white" />}
              iconColor="bg-orange-500"
              title={`Admins (${data?.admins?.length || 0})`}
              items={data?.admins || []}
              renderItem={(admin) => `${admin.firstName} ${admin.lastName}`}
              ListDotIcon={ListDotIcon}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button onClick={handleBack} variant="outline" className="px-8">
              Back
            </Button>
            <Button
              onClick={handleProceed}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8"
            >
              Proceed to School Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

type ReviewCardProps<T> = {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  items: T[];
  renderItem: (item: T) => string;
  ListDotIcon: React.FC<{ className?: string }>;
};

function ReviewCard<T>({
  icon,
  iconColor,
  title,
  items,
  renderItem,
  ListDotIcon,
}: ReviewCardProps<T>) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-1 text-sm text-gray-600 max-h-48 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <ListDotIcon className="size-2.5" />
            <span>{renderItem(item)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OnboardReviews;
