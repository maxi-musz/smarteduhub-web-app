"use client";

import { useState } from "react";
import { useTeacherAvailableResources } from "@/hooks/access-control";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BookOpen, RefreshCw, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

export function TeacherAccessControlView() {
  const [page, setPage] = useState(1);

  const {
    data: resourcesData,
    isLoading,
    error,
    refetch,
  } = useTeacherAvailableResources({
    page,
    limit: 20,
  });

  if (error) {
    const msg =
      error instanceof AuthenticatedApiError
        ? error.message
        : "Failed to load available resources";
    return (
      <div className="px-4 sm:px-6">
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Error
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-brand-light-accent-1 mb-4">{msg}</p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const data = resourcesData as
    | { items: Array<{ id: string; resourceType: string; accessLevel: string; libraryResourceAccess?: { subject?: { name: string; description?: string }; topic?: { title: string; description?: string } } }>; meta?: { totalItems: number; totalPages: number } }
    | undefined;
  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-brand-primary" />
          Access Control
        </h1>
        <p className="text-sm text-brand-light-accent-1 mt-1">
          Manage student access to library resources. Grant access to individual students or entire classes.
        </p>
      </div>

      {/* Refresh */}
      <div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Available Resources */}
      <div>
        <h2 className="text-lg font-semibold text-brand-heading mb-4">
          Resources You Can Manage ({meta?.totalItems ?? 0})
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="py-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-brand-light-accent-1 mb-4" />
              <p className="text-brand-light-accent-1">
                No resources have been assigned to you for access management. Contact your school administrator to receive access.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((resource) => {
                const subject = resource.libraryResourceAccess?.subject;
                const topic = resource.libraryResourceAccess?.topic;
                const displayName = subject?.name ?? topic?.title ?? resource.resourceType;

                return (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-brand-heading">
                          {displayName}
                        </h3>
                        <Badge variant="secondary">{resource.accessLevel}</Badge>
                      </div>
                      <p className="text-sm text-brand-light-accent-1 line-clamp-2 mb-4">
                        {subject?.description ?? topic?.description ?? "Library resource"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled
                      >
                        Manage Student Access (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-brand-light-accent-1">
                  Page {page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
