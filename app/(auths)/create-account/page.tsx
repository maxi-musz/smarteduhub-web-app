"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateAccount = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolEmail: "",
    schoolPhone: "",
    schoolAddress: "",
    schoolType: "",
    schoolOwnership: "",
    academicYear: "",
    currentTerm: "",
    termStartDate: "",
  });

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if user is a library owner
      if (session.user.userType === "libraryresourceowner") {
        router.push("/library-owner/dashboard");
        return;
      }

      // Redirect based on user role
      if (session.user.role) {
        switch (session.user.role) {
          case "school_director":
            router.push("/admin/dashboard");
            break;
          case "teacher":
            router.push("/teacher/dashboard");
            break;
          case "student":
            router.push("/student/home");
            break;
        }
      }
    }
  }, [status, session, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-sm text-brand-light-accent-1">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if user is authenticated (will redirect)
  if (status === "authenticated") {
    return null;
  }

  // Generate academic year options dynamically
  const getAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const nextYear = currentYear + 1;

    return [`${previousYear}/${currentYear}`, `${currentYear}/${nextYear}`];
  };

  const academicYearOptions = getAcademicYearOptions();

  // Format date for HTML input (YYYY-MM-DD)
  const formatDateForInput = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get date restrictions (prev year, current year, next year)
  const getDateRestrictions = () => {
    const currentYear = new Date().getFullYear();
    const fromDate = new Date(currentYear - 1, 0, 1); // Jan 1 of prev year
    const toDate = new Date(currentYear + 1, 11, 31); // Dec 31 of next year
    return {
      min: formatDateForInput(fromDate.toISOString()),
      max: formatDateForInput(toDate.toISOString()),
    };
  };

  const { min, max } = getDateRestrictions();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleContinue = () => {
    if (isFormValid()) {
      // Store form data in localStorage for the next step
      localStorage.setItem("schoolFormData", JSON.stringify(formData));
      router.push("/confirm-create");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-primary mb-6">
            SmartEdu-Hub
          </h1>

          {/* Step indicators */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Tell us about your school
          </h2>
          <p className="text-gray-500 text-sm">
            We need a few basic details to identify and verify your school
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="schoolName"
              className="text-sm font-medium text-gray-700"
            >
              School Name
            </Label>
            <Input
              id="schoolName"
              type="text"
              placeholder="Full school name. No abbreviations"
              value={formData.schoolName}
              onChange={(e) => handleInputChange("schoolName", e.target.value)}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="schoolEmail"
              className="text-sm font-medium text-gray-700"
            >
              School Email
            </Label>
            <Input
              id="schoolEmail"
              type="email"
              placeholder="smartschool@gmail.com"
              value={formData.schoolEmail}
              onChange={(e) => handleInputChange("schoolEmail", e.target.value)}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="schoolPhone"
              className="text-sm font-medium text-gray-700"
            >
              School Phone Number
            </Label>
            <Input
              id="schoolPhone"
              type="tel"
              placeholder="08100000000"
              value={formData.schoolPhone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                if (value.length <= 11) {
                  // Max 11 digits
                  handleInputChange("schoolPhone", value);
                }
              }}
              maxLength={11}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="schoolAddress"
              className="text-sm font-medium text-gray-700"
            >
              School Address
            </Label>
            <Input
              id="schoolAddress"
              type="text"
              placeholder="15, Oke Ado, Ibadan, Oyo"
              value={formData.schoolAddress}
              onChange={(e) =>
                handleInputChange("schoolAddress", e.target.value)
              }
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="schoolType"
              className="text-sm font-medium text-gray-700"
            >
              School Type
            </Label>
            <Select
              onValueChange={(value) => handleInputChange("schoolType", value)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select school type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="primary_and_secondary">
                  Primary and Secondary
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="schoolOwnership"
              className="text-sm font-medium text-gray-700"
            >
              School Ownership
            </Label>
            <Select
              onValueChange={(value) =>
                handleInputChange("schoolOwnership", value)
              }
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select school ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="academicYear"
              className="text-sm font-medium text-gray-700"
            >
              Academic Year
            </Label>
            <Select
              onValueChange={(value) =>
                handleInputChange("academicYear", value)
              }
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="currentTerm"
              className="text-sm font-medium text-gray-700"
            >
              Current Term
            </Label>
            <Select
              onValueChange={(value) => handleInputChange("currentTerm", value)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select current term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First</SelectItem>
                <SelectItem value="second">Second</SelectItem>
                <SelectItem value="third">Third</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="termStartDate"
              className="text-sm font-medium text-gray-700"
            >
              Term Start Date
            </Label>
            <Input
              type="date"
              id="termStartDate"
              value={formatDateForInput(formData.termStartDate)}
              onChange={(e) => {
                const dateValue = e.target.value;
                // Convert to ISO string for storage
                if (dateValue) {
                  const isoDate = new Date(dateValue).toISOString();
                  handleInputChange("termStartDate", isoDate);
                } else {
                  handleInputChange("termStartDate", "");
                }
              }}
              onClick={(e) => {
                // Ensure the date picker opens on click
                e.currentTarget.showPicker?.();
              }}
              onKeyDown={(e) => {
                // Allow Tab, Escape, and Enter, but prevent typing dates
                if (!["Tab", "Escape", "Enter"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              min={min}
              max={max}
              className="mt-1 cursor-pointer"
              placeholder="Click to select date"
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
