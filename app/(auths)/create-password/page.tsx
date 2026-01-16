"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { IconHeading } from "@/components/IconHeading";
import { AuthErrorModal } from "@/components/AuthErrorModal";
import { PasswordResetSuccessModal } from "@/components/PasswordResetSuccessModal";

const CreatePassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [shouldRestartReset, setShouldRestartReset] = useState(false);

  // Check if user came from OTP verification and we have the OTP stored
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("passwordResetEmail");
    const storedOtp = sessionStorage.getItem("passwordResetOtp");

    if (!storedEmail || !storedOtp) {
      // Redirect to forgot password if no verified session
      router.push("/forgot-password");
      return;
    }

    setEmail(storedEmail);
    setOtp(storedOtp);
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Password validation rules
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isFormValid = () => {
    return (
      isPasswordValid &&
      passwordsMatch &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL
        }/auth/verify-otp-and-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            new_password: formData.password,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setShowSuccessModal(true);
      } else {
        const backendMessage =
          data && typeof data.message === "string" ? data.message : "";

        // Normalize technical errors into a friendly message
        const lower = backendMessage.toLowerCase();
        const isInvalidOrExpiredOtp =
          lower.includes("invalid otp") ||
          lower.includes("expired otp") ||
          response.status === 400;

        if (isInvalidOrExpiredOtp) {
          setErrorMessage(
            "Invalid or expired code. Please restart the reset process."
          );
          setShouldRestartReset(true);
        } else if (
          lower.includes("cannot get") ||
          lower.includes("cannot post") ||
          lower.includes("internal server error") ||
          lower.includes("not found")
        ) {
          setErrorMessage(
            "Error resetting password. Please try again later."
          );
        } else {
          setErrorMessage(
            backendMessage ||
              "Error resetting password. Please try again later."
          );
        }

        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Create password error:", error);
      setErrorMessage(
        "Unable to connect to the server. Please check your internet and try again."
      );
      setShowErrorModal(true);
      setShouldRestartReset(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalContinue = () => {
    setShowSuccessModal(false);
    // Clear all session data
    sessionStorage.removeItem("passwordResetEmail");
    sessionStorage.removeItem("passwordResetOtp");
    router.push("/login");
  };

  const handleRestartResetFlow = async () => {
    if (!email) {
      router.push("/forgot-password");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL
        }/auth/request-password-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const backendMessage =
          data && typeof data.message === "string" ? data.message : "";
        setErrorMessage(
          backendMessage ||
            "Failed to request a new code. Please try again later."
        );
        setShowErrorModal(true);
        setShouldRestartReset(false);
        return;
      }

      // New OTP sent successfully: prepare verify-otp flow
      sessionStorage.setItem("passwordResetEmail", email);
      sessionStorage.removeItem("passwordResetOtp");
      router.push("/verify-otp");
    } catch (error) {
      console.error("Restart reset flow error:", error);
      setErrorMessage(
        "Failed to request a new code. Please check your internet and try again."
      );
      setShowErrorModal(true);
      setShouldRestartReset(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-sm p-8 mt-8 lg:mt-0">
        {/* Header */}
        <div className="text-center mb-8">
          <IconHeading />

          <h2 className="text-xl font-medium text-brand-heading mb-2">
            Create New Password
          </h2>
          <p className="text-brand-light-accent-1 text-sm">
            Create a strong and secure password for your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-brand-heading"
            >
              New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light-accent-1 hover:text-brand-border-secondary hover:cursor-pointer focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Password must contain:
              </p>
              <div className="space-y-1">
                {Object.entries({
                  "At least 8 characters": passwordValidation.minLength,
                  "One uppercase letter": passwordValidation.hasUppercase,
                  "One lowercase letter": passwordValidation.hasLowercase,
                  "One number": passwordValidation.hasNumber,
                  "One special character": passwordValidation.hasSpecialChar,
                }).map(([rule, isValid]) => (
                  <div key={rule} className="flex items-center space-x-2">
                    {isValid ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        isValid ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-brand-heading"
            >
              Confirm New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light-accent-1 hover:text-brand-border-secondary hover:cursor-pointer focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center space-x-2">
                {passwordsMatch ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">
                      Passwords match
                    </span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-500">
                      Passwords do not match
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
              isFormValid() && !isLoading
                ? "bg-brand-primary hover:bg-[#4338CA]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Creating Password..." : "Create New Password"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-brand-light-accent-1">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline"
              aria-label="Sign in"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Error Modal */}
      <AuthErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Password Creation Failed"
        message={errorMessage}
        onRetry={() => {
          setShowErrorModal(false);
          if (shouldRestartReset) {
            void handleRestartResetFlow();
          } else {
            handleSubmit({ preventDefault: () => {} } as React.FormEvent);
          }
        }}
      />

      {/* Success Modal */}
      <PasswordResetSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinue={handleSuccessModalContinue}
        title="Password Created Successfully!"
        message="Your new password has been created. You can now sign in with your new password."
        buttonText="Continue to Sign In"
      />
    </div>
  );
};

export default CreatePassword;
