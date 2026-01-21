"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import TeacherShell from "@/components/layout/TeacherShell";
import AdminShell from "@/components/layout/AdminShell";
import StudentShell from "@/components/layout/StudentShell";

export default function PlayVideoLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  // Determine which shell to use based on role or pathname
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

