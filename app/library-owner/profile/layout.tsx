import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";
import { ReactNode } from "react";

export default function LibraryOwnerProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
}
