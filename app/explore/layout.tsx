"use client";

import { ReactNode } from "react";
import SessionAwareLayout from "@/components/layout/SessionAwareLayout";

export default function ExploreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionAwareLayout>{children}</SessionAwareLayout>;
}
