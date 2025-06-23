"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ShieldUser, Mail, Trash2, Eye, EyeOff } from "lucide-react";

const OnboardMoreAdmins = () => {
  const router = useRouter();
  const { data, addAdmin, removeAdmin } = useOnboarding();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () =>
    Object.values(formData).every((value) => value.trim() !== "");

  const handleAddAdmin = () => {
    if (isFormValid()) {
      addAdmin(formData);
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
    }
  };

  const handleRemoveAdmin = (id: string) => {
    removeAdmin(id);
  };

  const handleNext = () => {
    router.push("/onboarding-reviews");
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

        {/* Progress */}
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

        {/* Card */}
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

          {/* Form */}
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
                placeholder="John"
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
                placeholder="Doe"
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
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1"
              />
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
                  placeholder="Password"
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

          <div className="mb-8">
            <Button
              onClick={handleAddAdmin}
              disabled={!isFormValid()}
              className={`px-6 ${
                isFormValid()
                  ? "bg-brand-primary hover:bg-brand-primary/90 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add Admin
            </Button>
          </div>

          {/* Admins List */}
          {data.admins.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <ShieldUser className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-brand-light-accent-2 text-sm">
                No admins added yet. You can add more admins to help manage the
                school.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-brand-heading">
                  Admins Added
                </h3>
                <span className="text-sm text-brand-light-accent-2">
                  {data.admins.length} admin
                  {data.admins.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {data.admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-brand-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <ShieldUser className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-heading">
                          {admin.firstName} {admin.lastName}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-brand-light-accent-2">
                          <Mail className="w-3 h-3" />
                          {admin.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
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
          <div className="flex justify-between border-t border-gray-200 pt-4 mt-8">
            <Button onClick={handleBack} variant="outline" className="px-8">
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8"
              disabled={data.admins.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardMoreAdmins;
