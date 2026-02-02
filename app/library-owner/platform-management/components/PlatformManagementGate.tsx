"use client";

import React, { ReactNode } from "react";
import { useLibraryOwnerProfile } from "@/hooks/library-owner/use-library-owner-profile";
import { PERMISSION_MANAGE_LIBRARY_USERS } from "../constants";
import { ManagementNoPermissionView } from "./ManagementNoPermissionView";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function hasManageLibraryUsersPermission(permissions: unknown[]): boolean {
  return Array.isArray(permissions) && (permissions as string[]).includes(PERMISSION_MANAGE_LIBRARY_USERS);
}

/** Skeleton shown while checking permission (profile loading). */
function GateLoadingSkeleton() {
  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
      <div className="px-4 sm:px-6">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-48 mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-72" />
      </div>
      <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="px-4 sm:px-6">
        <Card className="shadow-sm bg-white">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Gate for all routes under /library-owner/platform-management.
 * If the logged-in library user's permissions do not include manage_library_users,
 * shows a professional message and a skeletal view instead of real content.
 * Does not redirect; the user can leave via another tab.
 */
export function PlatformManagementGate({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useLibraryOwnerProfile();

  if (isLoading) {
    return <GateLoadingSkeleton />;
  }

  if (error || !data?.user) {
    return (
      <div className="py-4 sm:py-6 px-4 sm:px-6 bg-brand-bg">
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
          We couldn’t verify your access. Please try again or use the menu to go to another section.
        </div>
      </div>
    );
  }

  const hasPermission = hasManageLibraryUsersPermission(data.user.permissions ?? []);

  if (!hasPermission) {
    return <ManagementNoPermissionView />;
  }

  return <>{children}</>;
}
