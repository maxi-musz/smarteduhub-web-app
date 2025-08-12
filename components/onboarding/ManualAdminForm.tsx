"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type ManualAdminFormProps = {
  onAddAdmin: (admin: AdminFormData) => void;
  onError: (message: string) => void;
  existingAdmins: AdminFormData[];
};

// Normalize phone number by removing leading zeros and ensuring proper format
const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Handle different formats
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    // Convert 0803... to 803...
    return digitsOnly.substring(1);
  } else if (digitsOnly.length === 10) {
    // Already in correct format
    return digitsOnly;
  } else if (digitsOnly.length === 13 && digitsOnly.startsWith("234")) {
    // Convert 234803... to 803...
    return digitsOnly.substring(3);
  } else if (digitsOnly.length === 14 && digitsOnly.startsWith("2340")) {
    // Convert 2340803... to 803...
    return digitsOnly.substring(4);
  }

  // Return as is if format is unclear
  return digitsOnly;
};

const isValidNigerianPhone = (phone: string): boolean => {
  const normalized = normalizePhoneNumber(phone);
  return normalized.length === 10 && /^[789]\d{9}$/.test(normalized);
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ManualAdminForm: React.FC<ManualAdminFormProps> = ({
  onAddAdmin,
  onError,
  existingAdmins,
}) => {
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const handleInputChange = (field: keyof AdminFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = (): boolean => {
    const { firstName, lastName, email, phoneNumber } = formData;

    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      isValidEmail(email.trim()) &&
      phoneNumber.trim() !== "" &&
      isValidNigerianPhone(phoneNumber)
    );
  };

  const handleAddAdmin = () => {
    if (!isFormValid()) {
      onError("Please fill in all fields with valid information.");
      return;
    }

    const normalizedData = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: normalizePhoneNumber(formData.phoneNumber),
    };

    // Check for duplicate email
    const emailExists = existingAdmins.some(
      (admin) => admin.email === normalizedData.email
    );

    if (emailExists) {
      onError("An admin with this email already exists.");
      return;
    }

    onAddAdmin(normalizedData);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-brand-heading mb-4">
        Add Admin Manually
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
            placeholder="E.g. Michael"
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
            placeholder="E.g. Johnson"
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
            placeholder="E.g. michael.johnson@school.edu.ng"
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
            placeholder="A contact number is fine"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="mt-1"
          />
          {!isValidNigerianPhone(formData.phoneNumber) &&
            formData.phoneNumber && (
              <span className="text-xs text-red-500">
                Please enter a valid Nigerian phone number (11 digits).
              </span>
            )}
        </div>
      </div>

      <div className="mb-8">
        <Button
          onClick={handleAddAdmin}
          disabled={!isFormValid()}
          className={`px-6 ${
            isFormValid()
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Add Admin
        </Button>
      </div>
    </div>
  );
};

export default ManualAdminForm;
