"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
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
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { GraduationCap, Mail, Trash2, Eye, EyeOff } from "lucide-react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const OnboardStudents = () => {
  const router = useRouter();
  const { data, addStudent, removeStudent } = useOnboarding();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    defaultClass: "",
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === "password") {
      // Optionally limit password length if needed
      value = value.slice(0, 32);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every((value) => value.trim() !== "") &&
      isValidEmail(formData.email)
    );
  };

  const handleAddStudent = () => {
    if (isFormValid()) {
      const newStudent = {
        id: uuidv4(),
        ...formData,
      };
      addStudent(newStudent);
      console.log("Student added:", newStudent);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        defaultClass: "",
      });
    }
  };

  const handleRemoveStudent = (id: string) => {
    removeStudent(id);
  };

  const handleNext = () => {
    console.log("Students data:", data.students);
    router.push("/onboarding-more-admins");
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

        {/* Form Container */}
        <div className="bg-brand-bg rounded-md border-2 border-brand-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-brand-heading mb-2">
              Step 3 of 5: Add Students
            </h2>
            <p className="text-brand-light-accent-2 text-sm">
              Set up students to track attendance, grades, and provide learning
              access.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <Label
                htmlFor="defaultClass"
                className="text-sm font-medium text-brand-heading"
              >
                Select Default Class
              </Label>
              <Select
                value={formData.defaultClass}
                onValueChange={(value) =>
                  handleInputChange("defaultClass", value)
                }
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Choose the student's class" />
                </SelectTrigger>
                <SelectContent>
                  {data.classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-brand-heading"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="E.g. John"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-brand-heading"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="E.g. Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-brand-heading"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E.g. johndoe@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
                {!isValidEmail(formData.email) && formData.email && (
                  <span className="text-xs text-red-500">
                    Please enter a valid email address.
                  </span>
                )}
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-brand-heading"
                >
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="mb-8">
            <Button
              onClick={handleAddStudent}
              disabled={!isFormValid()}
              className={`px-6 ${
                isFormValid()
                  ? "bg-brand-primary hover:bg-brand-primary/90 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add Student
            </Button>
          </div>

          {/* Display Added Students */}
          {data.students.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <GraduationCap className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-brand-light-accent-2 text-sm">
                No students added yet. Add your first student to get started.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-brand-heading">
                  Student Added
                </h3>
                <span className="text-sm text-brand-light-accent-2">
                  {data.students.length} student
                  {data.students.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {data.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-brand-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-heading">
                          {student.firstName} {student.lastName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-brand-light-accent-2">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {student.email}
                          </span>
                          <span>{student.defaultClass}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between border-t border-gray-200 pt-4 mt-8">
            <Button onClick={handleBack} variant="outline" className="px-8">
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8"
              disabled={data.students.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardStudents;
