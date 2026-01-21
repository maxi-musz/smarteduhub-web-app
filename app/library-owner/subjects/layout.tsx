"use client";

import { ReactNode } from "react";
import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";

export default function LibraryOwnerSubjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LibraryOwnerShell>{children}</LibraryOwnerShell>;
}
