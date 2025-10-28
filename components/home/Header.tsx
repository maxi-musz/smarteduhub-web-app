"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const minorNavLinks = [
    { label: "Schools Hub", href: "/schools" },
    { label: "Teachers Hub", href: "/teachers" },
    { label: "Parents Hub", href: "/parents" },
    { label: "Students Hub", href: "/students" },
  ];

  // Find active link
  const activeLink = minorNavLinks.find((link) => pathname === link.href);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex">
          {/* Minor Navigation - Left Sidebar */}
          <div className="flex flex-col space-y-2 py-2 pr-8 border-r border-gray-100">
            {minorNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-brand-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Patch + Major Nav */}
          <div className="flex-1">
            {/* Patch Navigation - Shows active link with underline */}
            {activeLink && (
              <div className="py-2 px-6 border-b border-gray-100">
                <span className="text-sm text-brand-primary font-medium relative inline-block">
                  {activeLink.label}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-primary"></span>
                </span>
              </div>
            )}

            {/* Major Navigation - Logo + Main Links */}
            <div className="flex items-center justify-between py-4 px-6">
              <div className="text-xl font-bold text-gray-800">SmEH</div>
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
