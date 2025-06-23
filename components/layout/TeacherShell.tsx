"use client";

import {
  Home,
  Users,
  Calendar,
  Book,
  FileText,
  User,
  Bell,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Link from "next/link";

const teacherTabs = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: Home },
  { href: "/teacher/students", label: "Students", icon: Users },
  { href: "/teacher/schedules", label: "Schedules", icon: Calendar },
  { href: "/teacher/subjects", label: "Subjects", icon: Book },
  { href: "/teacher/grading", label: "Grading", icon: FileText },
];

const bottomTabs = [
  { href: "/teacher/notifications", label: "Notifications", icon: Bell },
  { href: "/teacher/profile", label: "Profile", icon: User },
  { href: "/teacher/settings", label: "Settings", icon: Settings },
];

export default function TeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleTabClick = (href: string, label: string) => {
    if (pathname !== href) {
      router.push(href);
      toast({
        title: `Switched to ${label}`,
        description: `You are now viewing the ${label.toLowerCase()} section.`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-r-brand-border shadow-sm z-20">
        <div className="w-full flex flex-col h-full">
          <div className="p-4 border-b border-b-brand-border">
            <Link href="/">
              <h1 className="font-bold text-lg text-brand-primary hover:text-brand-primary/90">
                SmartEdu Hub
              </h1>
            </Link>
            <p className="text-sm text-gray-500">Teacher&apos;s Portal</p>
          </div>
          <nav className="p-4 flex flex-col gap-1 flex-grow">
            {teacherTabs.map(({ href, label, icon: Icon }) => (
              <button
                key={href}
                onClick={() => handleTabClick(href, label)}
                className={cn(
                  "flex items-center w-full p-2 rounded-md transition-colors duration-200 cursor-pointer",
                  pathname === href
                    ? "bg-brand-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          {/* Bottom Fixed Navigation */}
          <div className="p-4 border-t border-brand-border">
            <div className="flex flex-col gap-1">
              {bottomTabs.map(({ href, label, icon: Icon }) => (
                <button
                  key={href}
                  onClick={() => handleTabClick(href, label)}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md transition-colors duration-200 cursor-pointer text-left",
                    pathname === href
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-grow overflow-y-auto pb-16 sm:pb-0 sm:mb-0 sm:ml-64 pt-2 sm:pt-0">
        <div className="px-4 sm:px-6">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border sm:hidden z-10">
        <div className="grid grid-cols-5 h-16">
          {[
            ...teacherTabs.slice(0, 3), // Home, Students, Schedules
            ...bottomTabs, // Notifications, Profile, Settings
          ]
            .slice(0, 5)
            .map(({ href, label, icon: Icon }) => (
              <button
                key={href}
                onClick={() => handleTabClick(href, label)}
                className={cn(
                  "flex flex-col items-center justify-center text-xs w-full",
                  pathname === href
                    ? "text-brand-primary font-medium"
                    : "text-gray-500"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mb-1",
                    pathname === href ? "text-brand-primary" : "text-gray-500"
                  )}
                />
                <span>{label}</span>
              </button>
            ))}
        </div>
      </nav>
    </div>
  );
}
