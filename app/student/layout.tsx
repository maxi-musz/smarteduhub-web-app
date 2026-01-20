import StudentShell from "@/components/layout/StudentShell";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
