import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";
import { ReactNode } from "react";

export default function LibraryOwnerGeneralMaterialsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
}


