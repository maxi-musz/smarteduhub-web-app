"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const router = useRouter();

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">Website</div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-gray-600 hover:text-brand-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-brand-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-brand-primary transition-colors"
            >
              About
            </Link>
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/create-account")}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
