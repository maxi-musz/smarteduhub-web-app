"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { IconHeading } from "@/components/IconHeading";

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLibraryOwner, setIsLibraryOwner] = useState(false);

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
        isLibraryOwner: isLibraryOwner ? "true" : "false",
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
        console.log("[Login] Sign in successful, waiting for session...");
        
        // Wait a bit for session to be established, then get the session
        // Use a small delay to ensure session cookie is set
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Try to get session with retries
        let session = await getSession();
        let retries = 0;
        const maxRetries = 10;
        
        while (!session?.user && retries < maxRetries) {
          console.log(`[Login] Session not ready, retry ${retries + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, 300));
          session = await getSession();
          retries++;
        }

        console.log("[Login] Session after login:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          role: session?.user?.role,
          userType: session?.user?.userType,
          retries,
        });

        // Determine redirect URL
        let redirectUrl = "/login";
        
        // Check if user is a library owner
        if (session?.user?.userType === "libraryresourceowner") {
          redirectUrl = "/library-owner/dashboard";
          console.log("[Login] Redirecting library owner to:", redirectUrl);
        } else if (session?.user?.role) {
          // Redirect based on user role
          switch (session.user.role) {
            case "school_director":
              redirectUrl = "/admin/dashboard";
              break;
            case "teacher":
              redirectUrl = "/teacher/dashboard";
              break;
            case "student":
              redirectUrl = "/student/home";
              break;
            default:
              console.error("[Login] Unknown role:", session.user.role);
              setError("Your account role is not recognized. Please contact support.");
              setIsLoading(false);
              return;
          }
          console.log("[Login] Redirecting based on role:", session.user.role, "to:", redirectUrl);
        } else {
          // Session not available after retries - this might be a cookie issue
          // Still try to redirect - the middleware will handle it, or cookies might be set by the time the page loads
          console.warn("[Login] Session not fully available after retries, but signIn was successful. Attempting redirect anyway.");
          console.warn("[Login] This might indicate a cookie configuration issue. Check NEXTAUTH_URL and cookie settings.");
          
          // Try to determine redirect from the signIn result or use a default
          // Since signIn was successful, we can try redirecting to admin dashboard as fallback
          // The middleware will redirect back to login if session isn't available, but at least we tried
          redirectUrl = "/admin/dashboard"; // Default fallback
          
          // Show a message but still attempt redirect
          console.log("[Login] Attempting redirect despite session delay:", redirectUrl);
        }

        // Use window.location.href for full page reload to ensure cookies are set
        // This is important for production/staging where cookies might not be immediately available
        if (redirectUrl !== "/login") {
          console.log("[Login] Performing full page redirect to:", redirectUrl);
          // Add a small delay to ensure any pending cookie writes complete
          await new Promise(resolve => setTimeout(resolve, 100));
          window.location.href = redirectUrl;
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

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-sm p-8 mt-8 lg:mt-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-sm text-brand-light-accent-1">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render login form if user is authenticated (will redirect)
  if (status === "authenticated") {
    return null;
  }

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
                id="library-owner"
                name="library-owner"
                type="checkbox"
                checked={isLibraryOwner}
                onChange={(e) => setIsLibraryOwner(e.target.checked)}
                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
              />
              <label
                htmlFor="library-owner"
                className="ml-2 block text-sm text-gray-900"
              >
                I&apos;m a library Owner
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
