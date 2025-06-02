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
import { User, Mail, Trash2, Eye, EyeOff } from "lucide-react";

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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
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
            <span className="text-sm text-gray-600">Step 3 of 5</span>
            <span className="text-sm text-brand-primary font-medium">
              60% Complete
            </span>
          </div>
          <Progress value={60} className="h-2" />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg border-2 border-blue-400 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Step 3 of 5: Add Students
            </h2>
            <p className="text-gray-600 text-sm">
              Set up students to track attendance, grades, and provide learning
              access.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <Label
                htmlFor="defaultClass"
                className="text-sm font-medium text-gray-700"
              >
                Select Default Class
              </Label>
              <Select
                value={formData.defaultClass}
                onValueChange={(value) =>
                  handleInputChange("defaultClass", value)
                }
              >
                <SelectTrigger className="mt-1">
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
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
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
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
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
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
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
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                No students added yet. Add your first student to get started.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Student Added
                </h3>
                <span className="text-sm text-gray-600">
                  {data.students.length} student
                  {data.students.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {data.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
};

export default OnboardStudents;
