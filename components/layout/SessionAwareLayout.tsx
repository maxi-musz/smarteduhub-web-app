"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import TeacherShell from "@/components/layout/TeacherShell";
import AdminShell from "@/components/layout/AdminShell";
import StudentShell from "@/components/layout/StudentShell";
import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";

interface SessionAwareLayoutProps {
  children: ReactNode;
}

/**
 * Central layout component that handles session loading and routes to appropriate shell
 * This prevents the need to duplicate session loading logic in every layout
 */
export default function SessionAwareLayout({
  children,
}: SessionAwareLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const userType = session?.user?.userType;

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Check for library owner first (using userType or pathname)
  // Also check if pathname includes general-materials for library owners
  if (
    pathname.startsWith("/library-owner") ||
    userType === "libraryresourceowner" ||
    role === "library_owner" ||
    (pathname.includes("/general-materials") &&
      (userType === "libraryresourceowner" || role === "library_owner"))
  ) {
    return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
  }

  // Check other roles
  if (pathname.startsWith("/teacher") || role === "teacher") {
    return <TeacherShell>{children}</TeacherShell>;
  }

  if (pathname.startsWith("/admin") || role === "school_director") {
    return <AdminShell>{children}</AdminShell>;
  }

  if (pathname.startsWith("/student") || role === "student") {
    return <StudentShell>{children}</StudentShell>;
  }

  // Default fallback - try to determine from session
  if (userType === "libraryresourceowner" || role === "library_owner") {
    return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
  }

  if (role === "school_director") {
    return <AdminShell>{children}</AdminShell>;
  }

  if (role === "teacher") {
    return <TeacherShell>{children}</TeacherShell>;
  }

  if (role === "student") {
    return <StudentShell>{children}</StudentShell>;
  }

  // If no role detected, default to TeacherShell (most common case)
  return <TeacherShell>{children}</TeacherShell>;
}
