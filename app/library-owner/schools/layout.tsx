import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";
import { ReactNode } from "react";

export default function LibraryOwnerSchoolsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
}

