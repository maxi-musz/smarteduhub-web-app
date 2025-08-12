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
import StudentUploadSection from "@/components/onboarding/StudentUploadSection";
import ManualStudentForm from "@/components/onboarding/ManualStudentForm";
import StudentList from "@/components/onboarding/StudentList";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";

type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentClass: string;
};

type UploadedStudent = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  default_class: string;
};

export default function OnboardStudents() {
  const router = useRouter();
  const { data, addStudent, removeStudent } = useOnboarding();

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStudentsUploaded = (students: StudentFormData[]) => {
    students.forEach((student) => {
      addStudent(student);
    });
  };

  const handleManualStudentAdd = (student: StudentFormData) => {
    addStudent(student);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleRemoveStudent = (id: string) => {
    removeStudent(id);
  };

  const handleNext = async () => {
    if (data.students.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const studentsPayload: UploadedStudent[] = data.students.map(
        (student) => ({
          first_name: student.firstName,
          last_name: student.lastName,
          email: student.email,
          phone_number: student.phoneNumber,
          default_class: student.studentClass,
        })
      );

      const response = await authenticatedApi.post("/auth/onboard-students", {
        students: studentsPayload,
      });

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        throw new AuthenticatedApiError(
          response.message || "Failed to onboard students",
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
    router.push("/onboarding-more-admins");
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleBack = () => {
    router.push("/onboarding-teachers");
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
              Step 3 of 5
            </span>
            <span className="text-sm text-brand-primary font-medium">
              60% Complete
            </span>
          </div>
          <Progress value={60} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="bg-brand-bg rounded-md border-2 border-brand-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-brand-heading mb-2">
              Step 3 of 5: Add Students
            </h2>
            <p className="text-brand-light-accent-2 text-sm">
              Set up students to track attendance, grades, and provide learning
              access.
            </p>
            <p className="text-brand-light-accent-2 text-sm">
              (You can always add more students later after this setup)
            </p>
          </div>

          {/* File Upload Section */}
          <StudentUploadSection
            availableClasses={data.classes}
            existingStudents={data.students}
            onStudentsUploaded={handleStudentsUploaded}
          />

          <div className="flex items-center mb-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-4 text-sm text-brand-light-accent-2">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Manual Add Student Form */}
          <ManualStudentForm
            availableClasses={data.classes}
            onAddStudent={handleManualStudentAdd}
            onError={handleError}
            existingStudents={data.students}
          />

          {/* Added Students List */}
          <StudentList
            students={data.students}
            onRemoveStudent={handleRemoveStudent}
          />

          {/* Navigation */}
          <div className="flex justify-between border-t border-gray-200 pt-4 mt-8">
            <Button onClick={handleBack} variant="outline" className="px-8">
              Back
            </Button>
            <Button
              onClick={handleNext}
              className={`px-8 ${
                data.students.length > 0
                  ? "bg-brand-primary hover:bg-brand-primary/90 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={data.students.length === 0 || isLoading}
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
                Students Added Successfully
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">
                Your students have been successfully onboarded. Let&apos;s move
                to the next step and add more administrators.
              </p>
              <Button
                onClick={handleSuccessModalClose}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
              >
                Continue to More Admins
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
