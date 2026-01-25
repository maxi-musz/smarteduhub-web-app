import { ReactNode } from "react";
import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";

export default function ExamBodyLayout({ children }: { children: ReactNode }) {
  return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
}
