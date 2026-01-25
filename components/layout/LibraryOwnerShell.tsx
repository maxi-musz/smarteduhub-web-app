"use client";

import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  User,
  LogOut,
  School,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from "@/lib/logger";

const libraryOwnerTabs = [
  { href: "/library-owner/dashboard", label: "Dashboard", icon: Home },
  { href: "/library-owner/schools", label: "Schools", icon: School },
  // { href: "/library-owner/resources", label: "Resources", icon: BookOpen },
  { href: "/library-owner/subjects", label: "Subjects", icon: BookOpen },
  {
    href: "/library-owner/general-materials",
    label: "AI Books",
    icon: FileText,
  },
  // { href: "/library-owner/analytics", label: "Analytics", icon: BarChart3 },
];

const bottomTabs = [
  { href: "/library-owner/profile", label: "Profile", icon: User },
  // { href: "/library-owner/settings", label: "Settings", icon: Settings },
];

export default function LibraryOwnerShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleNavClick = (href: string, label: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    logger.info(`[Navigation] Switching to ${label} tab`, {
      from: pathname,
      to: href,
      timestamp: new Date().toISOString(),
    });
    toast({
      title: `Switched to ${label}`,
      description: `You are now viewing the ${label.toLowerCase()} section.`,
      duration: 2000,
    });
  };

  const handleLogout = async () => {
    // Clear React Query cache
    queryClient.clear();
    // Clear any session storage
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }
    // Sign out without redirect, then manually redirect
    await signOut({ redirect: false });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      duration: 2000,
    });
    // Manually redirect to landing page on current port
    router.push("/");
    router.refresh(); // Refresh to clear any cached data
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Desktop Sidebar - Always visible on desktop */}
      <aside className="hidden sm:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-brand-border shadow-sm z-50">
        <div className="flex flex-col h-full w-full">
          {/* Logo */}
          <div className="p-6 border-b border-brand-border">
            <h1 className="text-xl font-bold text-brand-primary">
              Library Owner
            </h1>
            <p className="text-xs text-brand-light-accent-1 mt-1">
              Resource Management
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {libraryOwnerTabs.map((tab) => {
              const Icon = tab.icon;
              // Check if active - use startsWith for routes with sub-pages
              const isActive =
                tab.href === "/library-owner/subjects"
                  ? pathname.startsWith("/library-owner/subjects")
                  : tab.href === "/library-owner/general-materials"
                  ? pathname.startsWith("/library-owner/general-materials")
                  : pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={(e) => handleNavClick(tab.href, tab.label, e)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-brand-heading hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Tabs */}
          <div className="p-4 border-t border-brand-border space-y-2">
            {bottomTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={(e) => handleNavClick(tab.href, tab.label, e)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-brand-heading hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-grow overflow-y-auto pb-16 sm:pb-0 sm:mb-0 sm:ml-64 pt-2 sm:pt-0">
        <div className="px-4 sm:px-6">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border sm:hidden z-10">
        <div className="grid grid-cols-5 h-16">
          {libraryOwnerTabs.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/library-owner/subjects"
                ? pathname.startsWith("/library-owner/subjects")
                : href === "/library-owner/general-materials"
                ? pathname.startsWith("/library-owner/general-materials")
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleNavClick(href, label, e)}
                className={cn(
                  "flex flex-col items-center justify-center text-xs w-full",
                  isActive
                    ? "text-brand-primary font-medium"
                    : "text-gray-500"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mb-1",
                    isActive ? "text-brand-primary" : "text-gray-500"
                  )}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

