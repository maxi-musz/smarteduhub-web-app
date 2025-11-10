"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GsapMorphButton } from "@/components/ui/gsapmorph-button";
import { useState, useEffect } from "react";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const minorNavLinks = [
    { label: "Schools", href: "/schools" },
    { label: "Teachers", href: "/teachers" },
    { label: "Parents", href: "/parents" },
    { label: "Students", href: "/students" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show nav at the top of the page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo + Minor Navigation Links */}
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold text-gray-800">SmEH</div>
            <div className="flex items-center space-x-2">
              {minorNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm px-3 py-1.5 rounded-full transition-all ${
                    pathname === link.href
                      ? "bg-brand-primary text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-brand-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Major Navigation - Main Links */}
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
            <GsapMorphButton
              variant="outline"
              className="mr-2"
              onClick={() => router.push("/login")}
            >
              Login
            </GsapMorphButton>
            <GsapMorphButton onClick={() => router.push("/create-account")}>
              Sign Up
            </GsapMorphButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
