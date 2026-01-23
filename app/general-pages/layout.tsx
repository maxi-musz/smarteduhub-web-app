"use client";

import { ReactNode } from "react";
import SessionAwareLayout from "@/components/layout/SessionAwareLayout";

export default function GeneralPagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionAwareLayout>{children}</SessionAwareLayout>;
}
