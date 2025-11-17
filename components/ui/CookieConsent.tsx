"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    // Here you can initialize analytics or other tracking services
    console.log("Cookies accepted");
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
    // Here you can disable analytics or other tracking services
    console.log("Cookies rejected");
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <Cookie className="inline-block w-6 h-6" /> Cookie Consent
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            We use cookies to enhance your browsing experience and analyze our
            traffic. By clicking "Accept", you consent to our use of cookies.{" "}
            <Link
              href="/cookies-policy"
              className="text-brand-primary hover:text-brand-primary-hover underline"
            >
              Learn more
            </Link>
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-br from-brand-primary to-brand-primary-hover hover:opacity-90"
            >
              Accept
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
