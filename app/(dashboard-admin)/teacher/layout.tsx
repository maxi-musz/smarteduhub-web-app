import TeacherShell from "@/components/layout/TeacherShell";
import { ReactNode } from "react";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
