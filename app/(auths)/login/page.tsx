"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { IconHeading } from "@/components/IconHeading";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const isFormValid = () => {
    return formData.email.trim() !== "" && formData.password.trim() !== "";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Handle OTP required error
        if (result.error === "OTP_REQUIRED") {
          sessionStorage.setItem("pendingAuthEmail", formData.email);
          router.push("/verify-otp");
          return;
        }
        setError(result.error);
        return;
      }

      if (result?.ok) {
        // Get the session to determine redirect based on role
        const session = await getSession();

        if (session?.user?.role) {
          // Redirect based on user role
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
            default:
              // Unknown role - show error and stay on login page
              setError("Your account role is not recognized. Please contact support.");
              setIsLoading(false);
              return;
          }
        } else {
          // No role in session - show error and stay on login page
          setError("Unable to determine your account role. Please try again or contact support.");
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
            Welcome back!
          </h2>
          <p className="text-brand-light-accent-1 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1 w-full"
              required
            />
          </div>

          <div className="relative">
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
                placeholder="E.g. $cg527890"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pr-10"
                required
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

          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm mt-6 md:mt-0">
              <Link
                href="/forgot-password"
                aria-label="Forgot password"
                className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
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
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-brand-light-accent-1">
            Don&apos;t have an account?{" "}
            <Link
              href="/create-account"
              className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline"
              aria-label="Sign up"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
