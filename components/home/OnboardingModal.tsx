"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    title: "Welcome to SmartEdu-Hub",
    description:
      "Our platform is designed to automate everything – from administrative operations and student management to teacher tasks and academic reporting. Whether you're a school owner, admin, teacher, or student, we've built tools to simplify your workflow, boost efficiency, and support better learning outcomes.",
    subtitle: "Let's get your school set up in just a few easy steps.",
    images: ["/imgs/modal-01.png", "/imgs/modal-02.png", "/imgs/modal-03.png"],
  },
  {
    title: "Streamline Your Operations",
    description:
      "Manage student records, track attendance, handle grades, and communicate with parents all in one place. Our comprehensive dashboard gives you complete visibility into your school's performance.",
    subtitle: "Everything you need to run your school efficiently.",
    images: ["/imgs/modal-01.png", "/imgs/modal-02.png", "/imgs/modal-03.png"],
  },
  {
    title: "Ready to Transform Your School?",
    description:
      "Join thousands of educators who have already transformed their institutions with SmartEdu Hub. Start your journey today and experience the difference modern school management can make.",
    subtitle: "Create your account and get started in minutes.",
    images: ["/imgs/modal-01.png", "/imgs/modal-02.png", "/imgs/modal-03.png"],
  },
];

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      router.push("/create-account");
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentStep(index);
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] sm:w-full h-[90vh] sm:h-[80vh] p-0 bg-white rounded-lg overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </VisuallyHidden>

        <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-y-hidden">
          {/* Left side - Content */}
          <div className="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-lg w-full">
              {/* Navigation dots */}
              <div className="flex space-x-2 mb-4 sm:mb-6 lg:mb-8">
                {onboardingSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`size-2.5 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "bg-brand-primary"
                        : "bg-brand-secondary-accent"
                    }`}
                  />
                ))}
              </div>

              {/* Title with animation */}
              <h1
                key={`title-${currentStep}`}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-heading mb-2 sm:mb-1.5 animate-fade-in"
              >
                Welcome to{" "}
                <span className="text-brand-primary">SmartEdu-Hub</span>
              </h1>

              {/* Description with animation */}
              <p
                key={`desc-${currentStep}`}
                className="text-sm sm:text-base text-brand-secondary mb-4 sm:mb-6 leading-relaxed animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                {currentStepData.description}
              </p>

              {/* Subtitle with animation */}
              <p
                key={`subtitle-${currentStep}`}
                className="text-brand-primary font-medium mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                {currentStepData.subtitle}
              </p>

              {/* Button */}
              <Button
                onClick={handleNext}
                className="bg-brand-primary-hover hover:bg-brand-primary-hover px-6 sm:px-8 py-2.5 sm:py-3 animate-fade-in w-full sm:w-auto sm:min-w-[200px]"
                style={{ animationDelay: "0.3s" }}
              >
                {currentStep === onboardingSteps.length - 1
                  ? "Create Account"
                  : "Next"}
              </Button>
            </div>
          </div>

          {/* Right side - Images */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 max-w-md w-full">
              {/* Large image */}
              <div
                key={`img-large-${currentStep}`}
                className="col-span-2 animate-scale-in"
              >
                <Image
                  src={currentStepData.images[0]}
                  width={500}
                  height={300}
                  alt="Main illustration"
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Two smaller images */}
              <div
                key={`img-small1-${currentStep}`}
                className="animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <Image
                  src={currentStepData.images[1]}
                  width={250}
                  height={150}
                  alt="Secondary illustration"
                  className="w-full h-24 sm:h-28 lg:h-32 object-cover rounded-lg shadow-lg"
                />
              </div>

              <div
                key={`img-small2-${currentStep}`}
                className="animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <Image
                  src={currentStepData.images[2]}
                  width={250}
                  height={150}
                  alt="Tertiary illustration"
                  className="w-full h-24 sm:h-28 lg:h-32 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
