"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconHeading } from "@/components/IconHeading";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const isFormValid = () => {
    return email.trim() !== "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      // Log the email input
      console.log("Forgot password email:", email);
      // You can add further logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-sm p-8 mt-8 lg:mt-0">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo and Title */}
          <IconHeading />

          <h2 className="text-xl font-medium text-brand-heading mb-2">
            Reset Your Account Password
          </h2>
          <p className="text-brand-light-accent-1 text-sm">
            Enter your email address and we will send you instructions to reset
            your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-brand-heading"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="E.g. smartschool@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
              isFormValid()
                ? "bg-brand-primary hover:bg-[#4338CA]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send Reset Instructions
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-brand-light-accent-1">
            Remember password?{" "}
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
    </div>
  );
};

export default ForgotPassword;
