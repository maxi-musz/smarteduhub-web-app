"use client";

import {
  Home,
  Users,
  Calendar,
  Book,
  HandCoins,
  Settings,
  MessageCircle,
  UserCog,
  FileText,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

const adminTabs = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/teachers", label: "Teachers", icon: UserCog },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/finance", label: "Finance", icon: HandCoins },
  { href: "/admin/subjects", label: "Subjects", icon: Book },
  { href: "/admin/schedules", label: "Schedules", icon: Calendar },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: FileText },
];

export default function AdminShell({ children }: { children: ReactNode }) {
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
      <div className="hidden sm:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-brand-border shadow-sm z-20">
        <div className="w-full">
          <div className="p-4 border-b border-brand-border">
            <Link href="/">
              <h1 className="font-bold text-lg text-brand-primary hover:text-brand-primary/90">
                SmartEdu Hub
              </h1>
            </Link>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
          <nav className="p-4 flex flex-col gap-1">
            {adminTabs.map(({ href, label, icon: Icon }) => (
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
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-grow overflow-y-auto pb-16 sm:pb-0 sm:mb-0 sm:ml-64 pt-2 sm:pt-0">
        <div className="content-area px-4 sm:px-6">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-10">
        <div className="grid grid-cols-5 h-16">
          {adminTabs.slice(0, 5).map(({ href, label, icon: Icon }) => (
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
