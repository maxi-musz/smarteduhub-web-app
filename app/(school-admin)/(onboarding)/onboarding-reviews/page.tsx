"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ChevronDown } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-primary mb-8">
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
        <div className="bg-white rounded-lg border-2 border-blue-400 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Review & Complete Setup
            </h2>
            <p className="text-gray-600 text-sm">
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
              iconLabel="C"
              iconColor="bg-brand-primary"
              title={`Classes (${data?.classes?.length || 0})`}
              items={data?.classes || []}
              renderItem={(item) => item}
            />

            {/* Teachers */}
            <ReviewCard
              iconLabel="T"
              iconColor="bg-red-500"
              title={`Teachers (${data?.teachers?.length || 0})`}
              items={data?.teachers || []}
              renderItem={(teacher) =>
                `${teacher.firstName} ${teacher.lastName}`
              }
            />

            {/* Students */}
            <ReviewCard
              iconLabel="S"
              iconColor="bg-green-500"
              title={`Students (${data?.students?.length || 0})`}
              items={data?.students || []}
              renderItem={(student) =>
                `${student.firstName} ${student.lastName} (${student.defaultClass})`
              }
            />

            {/* Admins */}
            <ReviewCard
              iconLabel="A"
              iconColor="bg-orange-500"
              title={`Admins (${data?.admins?.length || 0})`}
              items={data?.admins || []}
              renderItem={(admin) => `${admin.firstName} ${admin.lastName}`}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button onClick={handleBack} variant="outline" className="px-8">
              Back
            </Button>
            <Button
              onClick={handleProceed}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8"
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
  iconLabel: string;
  iconColor: string;
  title: string;
  items: T[];
  renderItem: (item: T) => string;
};

function ReviewCard<T>({
  iconLabel,
  iconColor,
  title,
  items,
  renderItem,
}: ReviewCardProps<T>) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center`}
        >
          <span className="text-white text-sm font-medium">{iconLabel}</span>
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-1 text-sm text-gray-600 max-h-48 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx}>{renderItem(item)}</div>
        ))}
      </div>
    </div>
  );
}

export default OnboardReviews;
