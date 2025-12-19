import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";
import { ReactNode } from "react";

export default function LibraryOwnerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
}

