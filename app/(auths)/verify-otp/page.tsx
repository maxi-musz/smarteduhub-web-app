"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconHeading } from "@/components/IconHeading";

const VerifyOtp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Changed to 6 values
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [flowType, setFlowType] = useState<
    "admin_login" | "password_reset" | null
  >(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email and determine flow type from session storage on mount
  useEffect(() => {
    const pendingAuthEmail = sessionStorage.getItem("pendingAuthEmail");
    const passwordResetEmail = sessionStorage.getItem("passwordResetEmail");

    if (passwordResetEmail) {
      setEmail(passwordResetEmail);
      setFlowType("password_reset");
    } else if (pendingAuthEmail) {
      setEmail(pendingAuthEmail);
      setFlowType("admin_login");
    } else {
      // Redirect to login if no pending auth or password reset
      router.push("/login");
    }
  }, [router]);

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6); // Changed to 6 digits
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const isOtpComplete = () => {
    return otp.every((digit) => digit !== "");
  };

  const handleVerify = async () => {
    if (!isOtpComplete() || !email || !flowType) return;

    setIsLoading(true);
    setError("");

    try {
      const otpCode = otp.join("");

      if (flowType === "admin_login") {
        // Handle admin login OTP verification (existing flow)
        const result = await signIn("credentials", {
          email,
          otp: otpCode,
          isOtpVerification: "true",
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (result?.ok) {
          // Clear pending auth and redirect to admin dashboard
          sessionStorage.removeItem("pendingAuthEmail");
          window.location.href = "/admin/dashboard"; // Force page reload to avoid cache issues
        }
      } else if (flowType === "password_reset") {
        // New flow: don't call a separate OTP verify endpoint.
        // Store email + OTP and move user to the create-password page,
        // which will call the combined verify+reset endpoint.
        sessionStorage.setItem("passwordResetEmail", email);
        sessionStorage.setItem("passwordResetOtp", otpCode);
        router.push("/create-password");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || !flowType) return;

    try {
      setError("");

      if (flowType === "admin_login") {
        // Resend admin login OTP (existing flow)
        await signIn("credentials", {
          email,
          password: "dummy", // Backend needs password for initial login call
          redirect: false,
        });
      } else if (flowType === "password_reset") {
        // Resend password reset OTP (new flow)
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL
          }/auth/request-password-reset-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || "Failed to resend OTP. Please try again.");
          return;
        }
      }

      // Reset timer and form on successful resend
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]); // Changed to 6 empty values
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <IconHeading />
          <h2 className="text-xl font-medium text-brand-heading mb-2">
            {flowType === "password_reset"
              ? "Verify Reset Code"
              : "Verify your email"}
          </h2>
          <p className="text-brand-light-accent-1 text-sm">
            {flowType === "password_reset"
              ? "We've sent a 6-character reset code to your email address. Please enter it below to continue with your password reset."
              : "We've sent a 6-character verification code to your email address. Please enter it below to verify your account."}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="size-8 md:size-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={!isOtpComplete() || isLoading}
          className={`w-full py-3 text-white font-medium rounded-lg transition-colors mb-6 ${
            isOtpComplete() && !isLoading
              ? "bg-brand-primary hover:bg-brand-primary-hover"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading
            ? "Verifying..."
            : flowType === "password_reset"
            ? "Verify & Reset Password"
            : "Verify & Continue"}
        </Button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-brand-light-accent-1">
            Didn&apos;t receive the code?{" "}
            {timeLeft > 0 ? (
              <span className="text-gray-400">Resend in {timeLeft}s</span>
            ) : (
              <Button
                variant={"link"}
                onClick={handleResendOtp}
                className="font-medium text-brand-primary hover:text-brand-primary-hover"
              >
                Resend OTP
              </Button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
