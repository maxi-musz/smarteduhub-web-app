import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";
import { ReactNode } from "react";

export default function LibraryOwnerAccessControlLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
}
