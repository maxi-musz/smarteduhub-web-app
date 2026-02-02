import LibraryOwnerShell from "@/components/layout/LibraryOwnerShell";
import { PlatformManagementGate } from "./components/PlatformManagementGate";
import { ReactNode } from "react";

/**
 * Layout for all routes under /library-owner/platform-management.
 * Every page under this path goes through PlatformManagementGate:
 * only users with manage_library_users permission see real content;
 * others see a professional message and a skeletal view (no redirect).
 */
export default function LibraryOwnerPlatformManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LibraryOwnerShell>
      <PlatformManagementGate>{children}</PlatformManagementGate>
    </LibraryOwnerShell>
  );
}
