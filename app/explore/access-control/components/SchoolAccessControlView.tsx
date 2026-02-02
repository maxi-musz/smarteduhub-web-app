"use client";

import { useState, useCallback, useMemo } from "react";
import { useAvailableResources, useExcludeSubject, useIncludeSubject, useExcludedSubjects, useIncludeAllSubjects, type AvailableResource } from "@/hooks/access-control";
import { useExplore } from "@/hooks/explore/use-explore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, BookOpen, Search, RefreshCw, AlertCircle, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { SubjectTopicsExpandable } from "./SubjectTopicsExpandable";

export function SchoolAccessControlView() {
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

  const { data: excludedData, refetch: refetchExcluded } = useExcludedSubjects();
  const serverExcludedSubjectIds = useMemo(
    () => new Set(excludedData?.subjectIds ?? []),
    [excludedData?.subjectIds]
  );

  const excludeMutation = useExcludeSubject();
  const includeMutation = useIncludeSubject();
  const includeAllMutation = useIncludeAllSubjects();

  const isSubjectExcluded = useCallback(
    (resource: AvailableResource) => {
      const subjectId = resource.subject?.id;
      if (!subjectId) return false;
      return serverExcludedSubjectIds.has(subjectId);
    },
    [serverExcludedSubjectIds]
  );

  const handleSubjectToggle = useCallback(
    async (resource: AvailableResource) => {
      const subjectId = resource.subject?.id;
      if (!subjectId) return;
      const excluded = isSubjectExcluded(resource);

      if (excluded) {
        await includeMutation.mutateAsync({ subjectId });
      } else {
        await excludeMutation.mutateAsync({ subjectId });
      }
      refetchExcluded();
      refetch();
    },
    [isSubjectExcluded, excludeMutation, includeMutation, refetchExcluded, refetch]
  );

  const handleIncludeAll = useCallback(async () => {
    await includeAllMutation.mutateAsync();
    refetchExcluded();
    refetch();
  }, [includeAllMutation, refetchExcluded, refetch]);

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

  const { data: exploreData } = useExplore();
  const subjectIdToClass = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    exploreData?.subjects?.forEach((s) => {
      if (s.class && s.id) map.set(s.id, { id: s.class.id, name: s.class.name });
    });
    return map;
  }, [exploreData?.subjects]);

  const itemsByClass = useMemo(() => {
    const ungroupedKey = "__ungrouped__";
    const groups = new Map<string, { classInfo: { id: string; name: string } | null; items: AvailableResource[] }>();
    items.forEach((resource) => {
      const subjectId = resource.subject?.id;
      const fromApi = resource.subject?.class;
      const fromExplore = subjectId ? subjectIdToClass.get(subjectId) : undefined;
      const classInfo = fromApi ?? (fromExplore ? { id: fromExplore.id, name: fromExplore.name } : null);
      const key = classInfo?.id ?? ungroupedKey;
      if (!groups.has(key)) groups.set(key, { classInfo: classInfo ?? null, items: [] });
      groups.get(key)!.items.push(resource);
    });
    const entries = Array.from(groups.entries()).sort((a, b) => {
      if (a[0] === ungroupedKey) return 1;
      if (b[0] === ungroupedKey) return -1;
      return (a[1].classInfo?.name ?? "").localeCompare(b[1].classInfo?.name ?? "");
    });
    return entries;
  }, [items, subjectIdToClass]);

  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  return (
    <div className="px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-brand-primary" />
          Access Control
        </h1>
        <p className="text-sm text-brand-light-accent-1 mt-1">
          Turn subjects on or off for everyone in your school. When off, teachers and students will not see the subject in Explore.
        </p>
      </div>

      {/* Search & Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
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
        <div className="flex flex-wrap gap-2">
          {serverExcludedSubjectIds.size > 0 && (
            <Button
              variant="default"
              onClick={handleIncludeAll}
              disabled={includeAllMutation.isPending}
            >
              {includeAllMutation.isPending ? "Turning on…" : "Turn on all subjects"}
            </Button>
          )}
          <Button variant="outline" onClick={() => { refetchExcluded(); refetch(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
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
            <div className="space-y-8">
              {itemsByClass.map(([key, { classInfo, items: groupItems }]) => (
                <div key={key}>
                  <h3 className="text-base font-semibold text-brand-heading mb-3 flex items-center gap-2">
                    <span>{classInfo?.name ?? "Other"}</span>
                    <span className="text-sm font-normal text-brand-light-accent-1">
                      ({groupItems.length} subject{groupItems.length !== 1 ? "s" : ""})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupItems.map((resource) => {
                      const subjectId = resource.subject?.id;
                      const canToggle = resource.resourceType === "SUBJECT" && !!subjectId;
                      const excluded = isSubjectExcluded(resource);
                      const isPending = excludeMutation.isPending || includeMutation.isPending;
                      const isExpanded = expandedSubjectId === subjectId;

                      return (
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
                            {canToggle && (
                              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-brand-border bg-muted/30 px-3 py-2">
                                <span className="text-sm font-medium text-brand-heading">
                                  Visible to school
                                </span>
                                <Switch
                                  checked={!excluded}
                                  onCheckedChange={() => handleSubjectToggle(resource)}
                                  disabled={isPending}
                                />
                              </div>
                            )}
                            {subjectId && (
                              <Accordion
                                type="single"
                                collapsible
                                value={expandedSubjectId === subjectId ? subjectId : ""}
                                onValueChange={(v) => setExpandedSubjectId(v || null)}
                                className="mt-3"
                              >
                                <AccordionItem value={subjectId} className="border-none">
                                  <AccordionTrigger className="py-2 text-brand-light-accent-1 hover:text-brand-heading [&[data-state=open]>svg]:rotate-90">
                                    <span className="flex items-center gap-2 text-sm">
                                      <ChevronRight className="h-4 w-4 shrink-0" />
                                      View topics
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <SubjectTopicsExpandable subjectId={subjectId} isOpen={expandedSubjectId === subjectId} />
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
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
