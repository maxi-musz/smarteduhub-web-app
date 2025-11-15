"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GsapMorphButton } from "@/components/ui/gsapmorph-button";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const minorNavLinks = [
    { label: "Schools", href: "/" },
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleNavLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <nav
        className={`bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo + Minor Navigation Links (Desktop) */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logos/smeh-logo.png"
                  alt="SmartEduHub Logo"
                  width={120}
                  height={40}
                  priority
                  className="h-12 w-auto"
                />
              </Link>
              <div className="hidden lg:flex items-center space-x-2">
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

            {/* Major Navigation - Main Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/support"
                className="text-gray-600 hover:text-brand-primary transition-colors"
              >
                Contact Support
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

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in Menu */}
          <div
            className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <Image
                src="/logos/smeh-logo.png"
                alt="SmartEduHub Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <button
                className="p-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col p-6 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                {minorNavLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavLinkClick(link.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      pathname === link.href
                        ? "bg-brand-primary text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => handleNavLinkClick("/support")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    pathname === "/support"
                      ? "bg-brand-primary text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Contact Support
                </button>
              </div>

              {/* Auth Buttons */}
              <div className="pt-6 border-t border-gray-200 flex space-x-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/create-account");
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
