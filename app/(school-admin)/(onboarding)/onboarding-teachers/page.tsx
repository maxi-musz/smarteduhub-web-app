"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { User, Mail, Phone, Trash2 } from "lucide-react";

type TeacherFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export default function OnboardTeachers() {
  const router = useRouter();
  const { data, addTeacher, removeTeacher } = useOnboarding();

  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const handleInputChange = (field: keyof TeacherFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleAddTeacher = () => {
    if (isFormValid()) {
      addTeacher(formData);
      console.log("Teacher added:", formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
    }
  };

  const handleRemoveTeacher = (id: string) => {
    removeTeacher(id);
  };

  const handleNext = () => {
    console.log("Teachers data:", data.teachers);
    router.push("/onboarding-students");
  };

  const handleBack = () => {
    router.push("/onboarding-classes");
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
            <span className="text-sm text-gray-600">Step 2 of 5</span>
            <span className="text-sm text-brand-primary font-medium">
              45% Complete
            </span>
          </div>
          <Progress value={45} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-2 border-brand-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Step 2 of 5: Add Teachers
            </h2>
            <p className="text-gray-600 text-sm">
              Add teachers so they can manage their class schedules, attendance,
              etc.
            </p>
          </div>

          {/* Add Teacher Form */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                placeholder="+1234567890"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>

          <div className="mb-8">
            <Button
              onClick={handleAddTeacher}
              disabled={!isFormValid()}
              className={`px-6 ${
                isFormValid()
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add Teacher
            </Button>
          </div>

          {/* Added Teachers */}
          {data.teachers.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                No teachers added yet. Add your first teacher to get started
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Teachers Added
                </h3>
                <span className="text-sm text-gray-600">
                  {data.teachers.length} teacher
                  {data.teachers.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {data.teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {teacher.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {teacher.phoneNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveTeacher(teacher.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button onClick={handleBack} variant="outline" className="px-8">
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
