"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useTeacherAvailableResources,
  useTeacherExcludeResource,
  useTeacherIncludeResource,
  type TeacherAvailableResource,
  type ExcludeIncludeResourceType,
} from "@/hooks/access-control";
import { useExplore } from "@/hooks/explore/use-explore";
import { useExploreTopicsList } from "@/hooks/explore/use-explore";
import { useExploreTopicDetails } from "@/hooks/explore/use-explore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldCheck, BookOpen, RefreshCw, AlertCircle, FolderOpen, Video, FileText, GraduationCap, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

function exclusionKey(type: ExcludeIncludeResourceType, resourceId: string, classId: string): string {
  return `${type}:${resourceId}:${classId}`;
}

export function TeacherAccessControlView() {
  const [page, setPage] = useState(1);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [localExcludedKeys, setLocalExcludedKeys] = useState<Set<string>>(new Set());
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const {
    data: resourcesData,
    isLoading,
    error,
    refetch,
  } = useTeacherAvailableResources({ page, limit: 50 });

  const excludeMutation = useTeacherExcludeResource();
  const includeMutation = useTeacherIncludeResource();

  const isExcluded = useCallback(
    (type: ExcludeIncludeResourceType, resourceId: string) => {
      if (!selectedClassId) return false;
      return localExcludedKeys.has(exclusionKey(type, resourceId, selectedClassId));
    },
    [localExcludedKeys, selectedClassId]
  );

  const handleToggle = useCallback(
    async (
      subjectId: string,
      type: ExcludeIncludeResourceType,
      resourceId: string,
      ids: { topicId?: string; videoId?: string; materialId?: string; assessmentId?: string }
    ) => {
      if (!selectedClassId) return;
      const key = exclusionKey(type, resourceId, selectedClassId);
      const excluded = localExcludedKeys.has(key);

      if (excluded) {
        await includeMutation.mutateAsync({
          subjectId,
          resourceType: type,
          classId: selectedClassId,
          ...ids,
        });
        setLocalExcludedKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      } else {
        await excludeMutation.mutateAsync({
          subjectId,
          resourceType: type,
          classId: selectedClassId,
          ...ids,
        });
        setLocalExcludedKeys((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
      }
      refetch();
    },
    [selectedClassId, localExcludedKeys, excludeMutation, includeMutation, refetch]
  );

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

  const { data: exploreData } = useExplore();
  const exploreClasses = exploreData?.classes ?? [];
  const subjectIdToClassId = useMemo(() => {
    const map = new Map<string, string>();
    exploreData?.subjects?.forEach((s) => {
      if (s.class?.id && s.id) map.set(s.id, s.class.id);
    });
    return map;
  }, [exploreData?.subjects]);

  const data = resourcesData as
    | { items: TeacherAvailableResource[]; meta?: { totalItems: number; totalPages: number } }
    | undefined;
  const items = data?.items ?? [];
  const meta = data?.meta;
  const allSubjects = useMemo(() => {
    const bySubject = new Map<string, TeacherAvailableResource>();
    items.forEach((r) => {
      const subj = r.libraryResourceAccess?.subject;
      if (subj?.id && r.resourceType === "SUBJECT" && !bySubject.has(subj.id)) {
        bySubject.set(subj.id, r);
      }
    });
    return Array.from(bySubject.values());
  }, [items]);

  const subjects = useMemo(() => {
    if (!selectedClassId) return allSubjects;
    return allSubjects.filter((r) => {
      const subjectId = r.libraryResourceAccess?.subject?.id;
      if (!subjectId) return false;
      const classId = subjectIdToClassId.get(subjectId);
      return classId === selectedClassId;
    });
  }, [allSubjects, selectedClassId, subjectIdToClassId]);

  const isPending = excludeMutation.isPending || includeMutation.isPending;

  return (
    <div className="px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-brand-primary" />
          Access Control
        </h1>
        <p className="text-sm text-brand-light-accent-1 mt-1">
          Turn topics, videos, materials, or assessments on or off for a class. When off, students in that class will not see the resource in Explore.
        </p>
      </div>

      {/* Class selector & Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-heading whitespace-nowrap">
            Managing visibility for:
          </span>
          <Select
            value={selectedClassId ?? ""}
            onValueChange={(v) => setSelectedClassId(v || null)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {exploreClasses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Resources Management */}
      <div>
        <h2 className="text-lg font-semibold text-brand-heading mb-4">
          Resources Management ({subjects.length})
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
          </div>
        ) : allSubjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-brand-light-accent-1 mb-4" />
              <p className="text-brand-light-accent-1">
                No resources have been assigned to you for access management. Contact your school administrator to receive access.
              </p>
            </CardContent>
          </Card>
        ) : !selectedClassId ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-brand-light-accent-1">
                Select a class above to manage which topics, videos, and materials are visible to that class.
              </p>
            </CardContent>
          </Card>
        ) : subjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-brand-light-accent-1 mb-4" />
              <p className="text-brand-light-accent-1">
                No subjects for this class in your available resources. Subjects are grouped by class from Explore.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Accordion
              type="single"
              collapsible
              value={expandedSubjectId ?? ""}
              onValueChange={(v) => setExpandedSubjectId(v || null)}
              className="space-y-2"
            >
              {subjects.map((resource) => {
                const subject = resource.libraryResourceAccess?.subject;
                const subjectId = subject?.id;
                if (!subjectId) return null;

                return (
                  <AccordionItem
                    key={resource.id}
                    value={subjectId}
                    className="rounded-lg border border-brand-border bg-white overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3 text-left">
                        <GraduationCap className="h-5 w-5 text-brand-primary shrink-0" />
                        <span className="font-semibold text-brand-heading">{subject?.name ?? "Subject"}</span>
                        <Badge variant="secondary" className="ml-1">{resource.accessLevel}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <SubjectTopicsSection
                        subjectId={subjectId}
                        selectedClassId={selectedClassId}
                        isExcluded={isExcluded}
                        onToggle={handleToggle}
                        isPending={isPending}
                        expandedTopicId={expandedTopicId}
                        setExpandedTopicId={setExpandedTopicId}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

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
          </div>
        )}
      </div>
    </div>
  );
}

function SubjectTopicsSection({
  subjectId,
  selectedClassId,
  isExcluded,
  onToggle,
  isPending,
  expandedTopicId,
  setExpandedTopicId,
}: {
  subjectId: string;
  selectedClassId: string;
  isExcluded: (type: ExcludeIncludeResourceType, resourceId: string) => boolean;
  onToggle: (subjectId: string, type: ExcludeIncludeResourceType, resourceId: string, ids: Record<string, string>) => Promise<void>;
  isPending: boolean;
  expandedTopicId: string | null;
  setExpandedTopicId: (id: string | null) => void;
}) {
  const { data: topicsData, isLoading } = useExploreTopicsList(subjectId);
  const topics = topicsData?.topics ?? [];

  return (
    <div className="px-4 pb-4">
      {isLoading ? (
        <div className="flex items-center gap-2 py-3 text-sm text-brand-light-accent-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading topics…
        </div>
      ) : topics.length === 0 ? (
        <p className="text-sm text-brand-light-accent-1 py-2">No topics</p>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedTopicId ?? ""}
          onValueChange={(v) => setExpandedTopicId(v || null)}
          className="border-none"
        >
          {topics.map((topic) => (
            <AccordionItem key={topic.id} value={topic.id} className="border-none">
              <div className="flex items-center justify-between gap-2 py-2">
                <AccordionTrigger className="py-2 hover:no-underline [&[data-state=open]>svg]:rotate-180 flex-1">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium">{topic.title}</span>
                  </div>
                </AccordionTrigger>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-brand-light-accent-1">Visible to class</span>
                  <Switch
                    checked={!isExcluded("TOPIC", topic.id)}
                    onCheckedChange={() => onToggle(subjectId, "TOPIC", topic.id, { topicId: topic.id })}
                    disabled={isPending}
                  />
                </div>
              </div>
              <AccordionContent>
                <TopicResourcesSection
                  subjectId={subjectId}
                  topicId={topic.id}
                  selectedClassId={selectedClassId}
                  isExcluded={isExcluded}
                  onToggle={onToggle}
                  isPending={isPending}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

function TopicResourcesSection({
  subjectId,
  topicId,
  selectedClassId,
  isExcluded,
  onToggle,
  isPending,
}: {
  subjectId: string;
  topicId: string;
  selectedClassId: string;
  isExcluded: (type: ExcludeIncludeResourceType, resourceId: string) => boolean;
  onToggle: (subjectId: string, type: ExcludeIncludeResourceType, resourceId: string, ids: Record<string, string>) => Promise<void>;
  isPending: boolean;
}) {
  const { data: topicDetails, isLoading } = useExploreTopicDetails(topicId);
  const videos = topicDetails?.videos ?? [];
  const materials = topicDetails?.materials ?? [];
  const assessments = topicDetails?.assessments ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 pl-6 py-2 text-sm text-brand-light-accent-1">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="pl-6 space-y-2 py-2">
      {videos.map((v) => (
        <div key={v.id} className="flex items-center justify-between gap-2 py-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <Video className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{v.title}</span>
          </div>
          <Switch
            checked={!isExcluded("VIDEO", v.id)}
            onCheckedChange={() => onToggle(subjectId, "VIDEO", v.id, { videoId: v.id })}
            disabled={isPending}
          />
        </div>
      ))}
      {materials.map((m) => (
        <div key={m.id} className="flex items-center justify-between gap-2 py-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{m.title}</span>
          </div>
          <Switch
            checked={!isExcluded("MATERIAL", m.id)}
            onCheckedChange={() => onToggle(subjectId, "MATERIAL", m.id, { materialId: m.id })}
            disabled={isPending}
          />
        </div>
      ))}
      {assessments.map((a) => (
        <div key={a.id} className="flex items-center justify-between gap-2 py-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{a.title}</span>
          </div>
          <Switch
            checked={!isExcluded("ASSESSMENT", a.id)}
            onCheckedChange={() => onToggle(subjectId, "ASSESSMENT", a.id, { assessmentId: a.id })}
            disabled={isPending}
          />
        </div>
      ))}
      {videos.length === 0 && materials.length === 0 && assessments.length === 0 && (
        <p className="text-xs text-brand-light-accent-1">No videos, materials, or assessments</p>
      )}
    </div>
  );
}
