"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GsapMorphButton } from "@/components/ui/gsapmorph-button";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated" && session?.user;

  // Get dashboard URL based on user type
  const getDashboardUrl = () => {
    if (!session?.user) return "/login";
    
    // Check if library owner
    if (session.user.userType === "libraryresourceowner") {
      return "/library-owner/dashboard";
    }
    
    // Check role for school users
    switch (session.user.role) {
      case "school_director":
        return "/admin/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "student":
        return "/student/home";
      default:
        return "/login";
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setUserMenuOpen(false);
    // Clear React Query cache
    queryClient.clear();
    // Clear any session storage
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }
    // Sign out without redirect, then manually redirect
    await signOut({ redirect: false });
    // Manually redirect to landing page on current port
    router.push("/");
    router.refresh(); // Refresh to clear any cached data
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const minorNavLinks = [
    { label: "Schools", href: "/" },
    { label: "Teachers", href: "/teachers" },
    { label: "Parents", href: "/parents" },
    { label: "Students", href: "/students" },
  ];

  const dropdownMenus = {
    legal: {
      label: "Legal",
      items: [
        { label: "Terms & Conditions", href: "/terms-conditions" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Cookies Policy", href: "/cookies-policy" },
      ],
    },
    resources: {
      label: "Resources",
      items: [
        { label: "FAQ", href: "/resources/faq" },
        { label: "Blogs", href: "/resources/blogs" },
        { label: "News", href: "/resources/news" },
      ],
    },
    product: {
      label: "Product",
      items: [
        { label: "About", href: "/about" },
        { label: "Events", href: "/events" },
        { label: "Careers", href: "/careers" },
      ],
    },
  };

  const handleDropdownEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

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
            <div className="hidden lg:flex items-center space-x-6">
              {/* Product Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => handleDropdownEnter("product")}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-1 text-gray-600 hover:text-brand-primary transition-colors py-2">
                  {dropdownMenus.product.label}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                {openDropdown === "product" && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {dropdownMenus.product.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-brand-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => handleDropdownEnter("resources")}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-1 text-gray-600 hover:text-brand-primary transition-colors py-2">
                  {dropdownMenus.resources.label}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                {openDropdown === "resources" && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {dropdownMenus.resources.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-brand-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Legal Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => handleDropdownEnter("legal")}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-1 text-gray-600 hover:text-brand-primary transition-colors py-2">
                  {dropdownMenus.legal.label}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                {openDropdown === "legal" && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {dropdownMenus.legal.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-brand-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/support"
                className="text-gray-600 hover:text-brand-primary transition-colors"
              >
                Support
              </Link>

              {/* Auth Section - Show user menu if logged in, otherwise show login/signup */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-medium">
                      {session.user.firstName?.[0] || session.user.name?.[0] || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.firstName || session.user.name || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.firstName} {session.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href={getDashboardUrl()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
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
                </>
              )}
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
            <div className="flex flex-col p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-88px)]">
              {/* Navigation Links */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  For
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
              </div>

              {/* Product Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Product
                </h3>
                {dropdownMenus.product.items.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      pathname === item.href
                        ? "bg-brand-primary text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Resources Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Resources
                </h3>
                {dropdownMenus.resources.items.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      pathname === item.href
                        ? "bg-brand-primary text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Legal Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Legal
                </h3>
                {dropdownMenus.legal.items.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      pathname === item.href
                        ? "bg-brand-primary text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Support */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Help
                </h3>
                <button
                  onClick={() => handleNavLinkClick("/support")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    pathname === "/support"
                      ? "bg-brand-primary text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Support
                </button>
              </div>

              {/* Auth Section - Mobile */}
              <div className="pt-6 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.firstName} {session.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.user.email}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push(getDashboardUrl());
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
