"use client";

import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  User,
  LogOut,
  School,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from "@/lib/logger";

const libraryOwnerTabs = [
  { href: "/library-owner/dashboard", label: "Dashboard", icon: Home },
  { href: "/library-owner/schools", label: "Schools", icon: School },
  { href: "/library-owner/resources", label: "Resources", icon: BookOpen },
  {
    href: "/library-owner/general-materials",
    label: "AI Books",
    icon: FileText,
  },
  { href: "/library-owner/analytics", label: "Analytics", icon: BarChart3 },
];

const bottomTabs = [
  { href: "/library-owner/profile", label: "Profile", icon: User },
  { href: "/library-owner/settings", label: "Settings", icon: Settings },
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

  const handleTabClick = (href: string, label: string) => {
    if (pathname !== href) {
      logger.info(`[Navigation] Switching to ${label} tab`, {
        from: pathname,
        to: href,
        timestamp: new Date().toISOString(),
      });
      router.push(href);
      toast({
        title: `Switched to ${label}`,
        description: `You are now viewing the ${label.toLowerCase()} section.`,
        duration: 2000,
      });
    }
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
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-brand-border shadow-sm z-50">
        <div className="flex flex-col h-full">
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
                tab.href === "/library-owner/resources"
                  ? pathname.startsWith("/library-owner/resources")
                  : tab.href === "/library-owner/general-materials"
                  ? pathname.startsWith("/library-owner/general-materials")
                  : pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(tab.href, tab.label);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(tab.href, tab.label);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
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

      {/* Main Content */}
      <main className="ml-64 flex-1 min-w-0 w-full">{children}</main>
    </div>
  );
}

