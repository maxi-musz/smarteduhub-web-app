"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

/**
 * Shown when the user does not have permission to manage platform.
 * Displays a professional message and a skeletal view of the dashboard so they get a feel.
 */
export function ManagementNoPermissionView() {
  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
      {/* Permission message */}
      <div className="px-4 sm:px-6">
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50/80 text-amber-900">
          <ShieldX className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <p className="font-medium text-brand-heading">
              You do not have permission to manage platform
            </p>
            <p className="text-sm text-brand-light-accent-1 mt-1">
              You can use the menu to go to another section. This preview shows how the management area is structured.
            </p>
          </div>
        </div>
      </div>

      {/* Skeletal view of management dashboard (no real data) */}
      <div className="px-4 sm:px-6 space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-7 bg-gray-200 rounded animate-pulse w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-72" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content skeleton */}
        <Card className="shadow-sm bg-white">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg"
                >
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
