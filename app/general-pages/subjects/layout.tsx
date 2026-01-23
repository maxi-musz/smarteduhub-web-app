"use client";

import { ReactNode } from "react";
import SessionAwareLayout from "@/components/layout/SessionAwareLayout";

export default function SubjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionAwareLayout>{children}</SessionAwareLayout>;
}

