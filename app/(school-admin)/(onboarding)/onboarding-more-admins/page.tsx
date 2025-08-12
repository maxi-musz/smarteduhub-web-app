"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import AdminUploadSection from "@/components/onboarding/AdminUploadSection";
import ManualAdminForm from "@/components/onboarding/ManualAdminForm";
import AdminList from "@/components/onboarding/AdminList";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";

type AdminFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type UploadedAdmin = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

export default function OnboardMoreAdmins() {
  const router = useRouter();
  const { data, addAdmin, removeAdmin } = useOnboarding();

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdminsUploaded = (admins: AdminFormData[]) => {
    admins.forEach((admin) => {
      addAdmin(admin);
    });
  };

  const handleManualAdminAdd = (admin: AdminFormData) => {
    addAdmin(admin);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleRemoveAdmin = (id: string) => {
    removeAdmin(id);
  };

  const handleNext = async () => {
    if (data.admins.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const adminsPayload: UploadedAdmin[] = data.admins.map((admin) => ({
        first_name: admin.firstName,
        last_name: admin.lastName,
        email: admin.email,
        phone_number: admin.phoneNumber,
      }));

      const response = await authenticatedApi.post("/auth/onboard-directors", {
        directors: adminsPayload,
      });

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        throw new AuthenticatedApiError(
          response.message || "Failed to onboard admins",
          response.statusCode || 400,
          response
        );
      }
    } catch (error: unknown) {
      if (error instanceof AuthenticatedApiError) {
        if (error.statusCode === 401) {
          setErrorMessage("Your session has expired. Please login again.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/onboarding-reviews");
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleBack = () => {
    router.push("/onboarding-students");
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
            <span className="text-sm text-brand-light-accent-2 font-medium">
              Step 4 of 5
            </span>
            <span className="text-sm text-brand-primary font-medium">
              80% Complete
            </span>
          </div>
          <Progress value={80} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="bg-brand-bg rounded-md border-2 border-brand-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-brand-heading mb-2">
              Step 4 of 5: Add More Admins
            </h2>
            <p className="text-brand-light-accent-2 text-sm">
              Assign people who will manage operations & handle day-to-day
              tasks.
            </p>
          </div>

          {/* File Upload Section */}
          <AdminUploadSection
            existingAdmins={data.admins}
            onAdminsUploaded={handleAdminsUploaded}
          />

          <div className="flex items-center mb-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-4 text-sm text-brand-light-accent-2">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Manual Add Admin Form */}
          <ManualAdminForm
            onAddAdmin={handleManualAdminAdd}
            onError={handleError}
            existingAdmins={data.admins}
          />

          {/* Added Admins List */}
          <AdminList admins={data.admins} onRemoveAdmin={handleRemoveAdmin} />

          {/* Navigation */}
          <div className="flex justify-between border-t border-gray-200 pt-4 mt-8">
            <Button onClick={handleBack} variant="outline" className="px-8">
              Back
            </Button>
            <Button
              onClick={handleNext}
              className={`px-8 ${
                data.admins.length > 0
                  ? "bg-brand-primary hover:bg-brand-primary/90 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={data.admins.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Admins Added Successfully
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">
                Your admins have been successfully onboarded. Let&apos;s review
                all your onboarding information before finalizing the setup.
              </p>
              <Button
                onClick={handleSuccessModalClose}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
              >
                Continue to Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Error
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <div className="flex gap-3">
                <Button
                  onClick={handleErrorModalClose}
                  variant="outline"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleErrorModalClose}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
