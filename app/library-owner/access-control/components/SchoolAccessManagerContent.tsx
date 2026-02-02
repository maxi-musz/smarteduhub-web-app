"use client";

import { useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, BookOpen, FolderOpen, Video, FileText, GraduationCap } from "lucide-react";
import {
  useSchoolAccessDetails,
  useGrantSchoolAccess,
  useUpdateLibraryAccessById,
  // useExcludeResource,
  // useIncludeResource,
} from "@/hooks/access-control";
import type { ExcludeIncludeResourceType, ResourceExclusionRef, ExcludedResourceRecord } from "@/hooks/access-control";
import { useLibraryOwnerResources } from "@/hooks/library-owner/use-library-owner-resources";

type ResourceType = "SUBJECT" | "TOPIC" | "VIDEO" | "MATERIAL";

function getGrantForResource(
  grants: Array<{
    id: string;
    resourceType: string;
    subjectId: string | null;
    topicId: string | null;
    videoId: string | null;
    materialId: string | null;
    isActive: boolean;
  }>,
  resourceType: ResourceType,
  ids: { subjectId?: string; topicId?: string; videoId?: string; materialId?: string }
) {
  return grants.find((g) => {
    if (!g.isActive) return false;
    if (resourceType === "SUBJECT" && g.resourceType === "SUBJECT") return g.subjectId === ids.subjectId;
    if (resourceType === "TOPIC" && g.resourceType === "TOPIC") return g.topicId === ids.topicId;
    if (resourceType === "VIDEO" && g.resourceType === "VIDEO") return g.videoId === ids.videoId;
    if (resourceType === "MATERIAL" && g.resourceType === "MATERIAL") return g.materialId === ids.materialId;
    return false;
  });
}

/* Re-enable when topic/video/material switches are turned back on
function buildExcludedKeys(
  exclusions: (ResourceExclusionRef | ExcludedResourceRecord)[] | undefined
): Set<string> {
  const set = new Set<string>();
  if (!exclusions?.length) return set;
  for (const e of exclusions) {
    if (e.topicId) set.add(`TOPIC:${e.topicId}`);
    if (e.videoId) set.add(`VIDEO:${e.videoId}`);
    if (e.materialId) set.add(`MATERIAL:${e.materialId}`);
    if (e.assessmentId) set.add(`ASSESSMENT:${e.assessmentId}`);
  }
  return set;
}
function exclusionKey(type: ExcludeIncludeResourceType, id: string): string {
  return `${type}:${id}`;
}
*/

interface SchoolAccessManagerContentProps {
  schoolId: string;
}

export function SchoolAccessManagerContent({ schoolId }: SchoolAccessManagerContentProps) {
  const { data: accessData, isLoading: isAccessLoading, refetch: refetchAccess } = useSchoolAccessDetails(schoolId, { includeExpired: true });
  const { data: resourcesData, isLoading: isResourcesLoading } = useLibraryOwnerResources();
  const grantMutation = useGrantSchoolAccess();
  const updateMutation = useUpdateLibraryAccessById();
  /* Topic/video/material switches disabled – library owner can view but not toggle (re-enable with hooks + handler below)
  const excludeMutation = useExcludeResource();
  const includeMutation = useIncludeResource();
  const [localExcludedKeys, setLocalExcludedKeys] = useState<Set<string>>(new Set());
  */
  const schoolAccessData = accessData as
    | { accessGrants: Array<{ id: string; resourceType: string; subjectId: string | null; topicId: string | null; videoId: string | null; materialId: string | null; isActive: boolean }>; exclusions?: (ResourceExclusionRef | ExcludedResourceRecord)[] }
    | undefined;
  const grants = schoolAccessData?.accessGrants ?? [];
  /* Re-enable when topic/video/material switches are turned back on
  const serverExcludedKeys = useMemo(
    () => buildExcludedKeys(schoolAccessData?.exclusions),
    [schoolAccessData?.exclusions]
  );
  const excludedKeys = useMemo(() => {
    const merged = new Set(serverExcludedKeys);
    localExcludedKeys.forEach((k) => merged.add(k));
    return merged;
  }, [serverExcludedKeys, localExcludedKeys]);
  const isExcluded = useCallback(
    (type: ExcludeIncludeResourceType, id: string) => excludedKeys.has(exclusionKey(type, id)),
    [excludedKeys]
  );
  const setExcluded = useCallback((type: ExcludeIncludeResourceType, id: string, excluded: boolean) => {
    const key = exclusionKey(type, id);
    setLocalExcludedKeys((prev) => {
      const next = new Set(prev);
      if (excluded) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);
  */

  const resourceTreeByClass = useMemo(() => {
    if (!resourcesData) return [];
    const { libraryClasses, topics, resources } = resourcesData;
    const tree: Array<{
      class: { id: string; name: string };
      subjects: Array<{
        subject: { id: string; name: string; code: string; classId: string };
        topics: Array<{
          topic: { id: string; title: string; subjectId: string };
          videos: Array<{ id: string; title: string }>;
          materials: Array<{ id: string; title: string }>;
        }>;
      }>;
    }> = [];

    libraryClasses?.forEach((lc) => {
      const subjectsList: typeof tree[0]["subjects"] = [];
      lc.subjects?.forEach((subj) => {
        const subjectTopics = topics?.filter((t) => t.subjectId === subj.id) ?? [];
        const topicList = subjectTopics.map((topic) => ({
          topic: { id: topic.id, title: topic.title ?? "Untitled", subjectId: topic.subjectId },
          videos: (resources?.videos?.filter((v) => v.topicId === topic.id) ?? []).map((v) => ({ id: v.id, title: v.title })),
          materials: (resources?.materials?.filter((m) => m.topicId === topic.id) ?? []).map((m) => ({ id: m.id, title: m.title })),
        }));
        subjectsList.push({
          subject: { id: subj.id, name: subj.name, code: subj.code, classId: lc.id },
          topics: topicList,
        });
      });
      tree.push({ class: { id: lc.id, name: lc.name }, subjects: subjectsList });
    });
    return tree;
  }, [resourcesData]);

  /** Subject-level: grant or revoke access (unchanged) */
  const handleSubjectToggle = async (
    subjectId: string,
    subjectGrant: { id: string } | undefined
  ) => {
    const isOn = !!subjectGrant;
    if (isOn && subjectGrant) {
      await updateMutation.mutateAsync({ grantId: subjectGrant.id, isActive: false });
    } else {
      await grantMutation.mutateAsync({
        schoolId,
        resourceType: "SUBJECT",
        subjectId,
        accessLevel: "FULL",
      });
    }
    refetchAccess();
  };

  /* Topic/video/material toggle handler – re-enable when switches are turned back on (uncomment hooks/state above too)
  const handleExcludeIncludeToggle = async (
    resourceType: ExcludeIncludeResourceType,
    ids: { topicId?: string; videoId?: string; materialId?: string; assessmentId?: string }
  ) => {
    const id =
      resourceType === "TOPIC" ? ids.topicId
      : resourceType === "VIDEO" ? ids.videoId
      : resourceType === "MATERIAL" ? ids.materialId
      : ids.assessmentId;
    if (!id) return;
    const currentlyExcluded = isExcluded(resourceType, id);
    if (currentlyExcluded) {
      await includeMutation.mutateAsync({ schoolId, resourceType, ...ids });
      setExcluded(resourceType, id, false);
    } else {
      await excludeMutation.mutateAsync({ schoolId, resourceType, ...ids });
      setExcluded(resourceType, id, true);
    }
    refetchAccess();
  };
  */

  const isLoading = isAccessLoading || isResourcesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (resourceTreeByClass.length === 0) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-16 text-center">
        <p className="text-muted-foreground">No library content available to manage.</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={[]} className="space-y-3">
      {resourceTreeByClass.map(({ class: classItem, subjects }) => {
        const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
        return (
          <AccordionItem
            key={classItem.id}
            value={classItem.id}
            className="rounded-lg border border-brand-border bg-white overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-5 py-4 bg-brand-primary/10 hover:no-underline hover:bg-brand-primary/15 [&[data-state=open]]:rounded-none">
              <div className="flex items-center gap-3 text-left">
                <GraduationCap className="h-5 w-5 text-brand-primary shrink-0" />
                <span className="font-semibold text-brand-heading">{classItem.name}</span>
                <span className="text-sm text-muted-foreground font-normal">
                  ({subjects.length} subject{subjects.length !== 1 ? "s" : ""}, {totalTopics} topic{totalTopics !== 1 ? "s" : ""})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y divide-brand-border border-t border-brand-border">
            {subjects.map(({ subject, topics }) => {
              const subjectGrant = getGrantForResource(grants, "SUBJECT", { subjectId: subject.id });
              return (
                <div key={subject.id}>
                  <div className="flex items-center justify-between px-5 py-4 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-brand-primary" />
                      <div>
                        <p className="font-medium text-brand-heading">{subject.name}</p>
                        <p className="text-xs text-muted-foreground">{subject.code}</p>
                      </div>
                    </div>
                    <Switch
                      checked={!!subjectGrant}
                      onCheckedChange={() => handleSubjectToggle(subject.id, subjectGrant)}
                      disabled={grantMutation.isPending}
                    />
                  </div>
                  {topics.length > 0 && (
                    <Accordion type="multiple" defaultValue={[]} className="px-5 pb-4">
                      {topics.map(({ topic, videos, materials }) => {
                        const itemCount = videos.length + materials.length;
                        return (
                          <AccordionItem key={topic.id} value={topic.id} className="border-none">
                            <div className="flex items-center justify-between py-3">
                              <AccordionTrigger className="py-0 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                <div className="flex items-center gap-3">
                                  <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0 transition-transform" />
                                  <span className="text-sm font-medium">{topic.title}</span>
                                  {itemCount > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      ({itemCount} item{itemCount !== 1 ? "s" : ""})
                                    </span>
                                  )}
                                </div>
                              </AccordionTrigger>
                              {/* Topic switch disabled – library owner can view only (re-enable with handleExcludeIncludeToggle) */}
                            </div>
                            <AccordionContent>
                              <div className="pl-8 space-y-2 pt-2 pb-2">
                                {videos.map((v) => (
                                  <div key={v.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                      <Video className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span className="text-sm">{v.title}</span>
                                    </div>
                                    {/* Video switch disabled – view only */}
                                  </div>
                                ))}
                                {materials.map((m) => (
                                  <div key={m.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span className="text-sm">{m.title}</span>
                                    </div>
                                    {/* Material switch disabled – view only */}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}
                </div>
              );
            })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
