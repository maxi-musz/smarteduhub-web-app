"use client";

import { useExploreTopicsList } from "@/hooks/explore/use-explore";
import { Loader2, FolderOpen } from "lucide-react";

interface SubjectTopicsExpandableProps {
  subjectId: string | null;
  isOpen: boolean;
}

export function SubjectTopicsExpandable({ subjectId, isOpen }: SubjectTopicsExpandableProps) {
  const { data, isLoading, error } = useExploreTopicsList(isOpen ? subjectId : null);

  if (!isOpen || !subjectId) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-brand-light-accent-1">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading topics…
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="py-2 text-sm text-brand-light-accent-1">
        Could not load topics.
      </p>
    );
  }

  const topics = data.topics ?? [];

  return (
    <div className="border-t border-brand-border pt-3 mt-3">
      <p className="text-xs font-medium text-brand-light-accent-1 mb-2">
        Topics in this subject ({topics.length})
      </p>
      <ul className="space-y-1.5">
        {topics.length === 0 ? (
          <li className="text-sm text-brand-light-accent-1">No topics</li>
        ) : (
          topics.map((topic) => (
            <li
              key={topic.id}
              className="flex items-center gap-2 text-sm text-brand-heading"
            >
              <FolderOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{topic.title}</span>
            </li>
          ))
        )}
      </ul>
      <p className="text-xs text-brand-light-accent-1 mt-2">
        Topic-level on/off is managed by your library owner or teachers.
      </p>
    </div>
  );
}
