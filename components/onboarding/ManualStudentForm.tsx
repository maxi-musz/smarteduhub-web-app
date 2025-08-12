"use client";

import { useState } from "react";
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

type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentClass: string;
};

interface ManualStudentFormProps {
  availableClasses: string[];
  onAddStudent: (student: StudentFormData) => void;
  onError: (message: string) => void;
  existingStudents: StudentFormData[];
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 10 && cleanPhone.startsWith("8")) {
    return "0" + cleanPhone;
  } else if (cleanPhone.length === 10 && cleanPhone.startsWith("7")) {
    return "0" + cleanPhone;
  } else if (cleanPhone.length === 10 && cleanPhone.startsWith("9")) {
    return "0" + cleanPhone;
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith("234")) {
    return "0" + cleanPhone.substring(3);
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
    return cleanPhone;
  }

  return cleanPhone;
}

function isValidPhoneNumber(phone: string) {
  const normalizedPhone = normalizePhoneNumber(phone);
  return (
    normalizedPhone.length === 11 && /^0[789][01]\d{8}$/.test(normalizedPhone)
  );
}

export default function ManualStudentForm({
  availableClasses,
  onAddStudent,
  onError,
  existingStudents,
}: ManualStudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    studentClass: "",
  });

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    if (field === "phoneNumber") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every((value) => value.trim() !== "") &&
      isValidEmail(formData.email) &&
      isValidPhoneNumber(formData.phoneNumber) &&
      availableClasses.includes(formData.studentClass)
    );
  };

  const handleAddStudent = () => {
    if (isFormValid()) {
      const existingStudent = existingStudents.find(
        (s) => s.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (existingStudent) {
        onError("A student with this email already exists.");
        return;
      }

      onAddStudent({
        ...formData,
        phoneNumber: normalizePhoneNumber(formData.phoneNumber),
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        studentClass: "",
      });
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-brand-heading mb-4">
        Add Student Manually
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
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
            onChange={(e) => handleInputChange("firstName", e.target.value)}
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
            placeholder="E.g. Adamu"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="mt-1"
          />
        </div>
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
            placeholder="E.g. john@example.com"
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
            htmlFor="phoneNumber"
            className="text-sm font-medium text-brand-heading"
          >
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            placeholder="A parent number is fine"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="mt-1"
            maxLength={11}
            inputMode="numeric"
          />
          {!isValidPhoneNumber(formData.phoneNumber) &&
            formData.phoneNumber && (
              <span className="text-xs text-red-500">
                Phone number must be 11 digits.
              </span>
            )}
        </div>
        <div className="col-span-2">
          <Label
            htmlFor="studentClass"
            className="text-sm font-medium text-brand-heading"
          >
            Student Class
          </Label>
          <Select
            value={formData.studentClass}
            onValueChange={(value) => handleInputChange("studentClass", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {availableClasses.map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {availableClasses.length === 0 && (
            <span className="text-xs text-orange-500">
              Please add classes in Step 1 before adding students.
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <Button
          onClick={handleAddStudent}
          disabled={!isFormValid()}
          className={`px-6 ${
            isFormValid()
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Add Student
        </Button>
      </div>
    </div>
  );
}
