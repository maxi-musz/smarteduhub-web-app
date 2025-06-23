"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconHeading } from "@/components/IconHeading";

const VerifyOtp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]); // Only 4 values now
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    // Auto-focus next input
    if (value && index < 3) {
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
    const pastedData = e.clipboardData.getData("text").slice(0, 4); // Only 4 digits
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const isOtpComplete = () => {
    return otp.every((digit) => digit !== "");
  };

  const handleVerify = () => {
    if (isOtpComplete()) {
      const otpCode = otp.join("");
      console.log("OTP verification code:", otpCode);
      // Here you would typically verify the OTP with your backend
      // For now, just navigate to dashboard or home
      router.push("/");
    }
  };

  const handleResendOtp = () => {
    console.log("Resending OTP...");
    setTimeLeft(60);
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <IconHeading />
          <h2 className="text-xl font-medium text-brand-heading mb-2">
            Verify your email
          </h2>
          <p className="text-brand-light-accent-1 text-sm">
            We&apos;ve sent a 4-digit verification code to your email address.
            Please enter it below to verify your account.
          </p>
        </div>

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
                inputMode="numeric"
                pattern="[0-9]"
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
          disabled={!isOtpComplete()}
          className={`w-full py-3 text-white font-medium rounded-lg transition-colors mb-6 ${
            isOtpComplete()
              ? "bg-brand-primary hover:bg-brand-primary-hover"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Verify & Continue
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
