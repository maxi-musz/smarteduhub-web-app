"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import TeacherShell from "@/components/layout/TeacherShell";
import AdminShell from "@/components/layout/AdminShell";
import StudentShell from "@/components/layout/StudentShell";
import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";

export default function PlayVideoLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const userType = session?.user?.userType;

  // Check for library owner first (using userType)
  if (pathname.startsWith("/library-owner") || userType === "libraryresourceowner") {
    return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
  }

  // Check for library owner by role as fallback
  if (role === "library_owner") {
    return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
  }

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

