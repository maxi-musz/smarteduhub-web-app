"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAvailableResources, type AvailableResource } from "@/hooks/access-control";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BookOpen, Search, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

function buildManageAccessUrl(resource: AvailableResource): string {
  const params = new URLSearchParams();
  if (resource.subject?.id) params.set("subjectId", resource.subject.id);
  if (resource.subject?.name) params.set("subjectName", resource.subject.name);
  if (resource.resourceType) params.set("resourceType", resource.resourceType);
  if (resource.platform?.name) params.set("platformName", resource.platform.name);
  const desc = resource.subject?.description;
  if (desc && desc.length < 200) params.set("description", desc);
  const qs = params.toString();
  return `/explore/access-control/resources/${resource.id}${qs ? `?${qs}` : ""}`;
}

export function SchoolAccessControlView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: resourcesData,
    isLoading,
    error,
    refetch,
  } = useAvailableResources({
    search: searchQuery || undefined,
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
    | { items: AvailableResource[]; meta?: { totalItems: number; totalPages: number } }
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
          Manage access to library resources for your school. Grant access to teachers, students, or entire classes.
        </p>
      </div>

      {/* Search & Refresh */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Available Resources */}
      <div>
        <h2 className="text-lg font-semibold text-brand-heading mb-4">
          Available Library Resources ({meta?.totalItems ?? 0})
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </CardHeader>
                <CardContent>
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
                No library resources have been granted to your school yet. Contact your library owner to request access.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-brand-heading">
                        {resource.subject?.name ?? resource.resourceType}
                      </h3>
                      <Badge variant="secondary">{resource.accessLevel}</Badge>
                    </div>
                    {resource.platform && (
                      <p className="text-sm text-brand-light-accent-1">
                        {resource.platform.name}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-brand-light-accent-1 line-clamp-2">
                      {resource.subject?.description ?? "Library resource"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => router.push(buildManageAccessUrl(resource))}
                    >
                      Manage Access
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
