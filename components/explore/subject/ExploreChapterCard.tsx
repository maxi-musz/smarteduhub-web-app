"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LibraryChapter } from "@/hooks/explore/use-explore";
import {
  Layers,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { useState } from "react";
import { ExploreTopicCard } from "./ExploreTopicCard";

// Color palette for order badges - cycles through appealing colors
const getOrderBadgeColors = (order: number) => {
  const colors = [
    { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
    { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
    { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
    { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
    { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" },
    { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
    { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300" },
    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
    { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-300" },
    { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
    { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-300" },
    { bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-300" },
  ];
  return colors[(order - 1) % colors.length];
};

interface ExploreChapterCardProps {
  chapter: LibraryChapter;
  basePath: string;
  isExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
  expandedTopics?: Set<string>;
  onTopicToggle?: (topicId: string, expanded: boolean) => void;
}

export function ExploreChapterCard({ 
  chapter, 
  basePath,
  isExpanded: controlledExpanded,
  onToggleExpanded,
  expandedTopics,
  onTopicToggle,
}: ExploreChapterCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const orderColors = getOrderBadgeColors(chapter.order);
  const topicsToDisplay = chapter.topics || [];

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    if (onToggleExpanded) {
      onToggleExpanded(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  return (
    <Card className="shadow-md bg-white border-2 border-brand-primary/20 hover:border-brand-primary/40 transition-all">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-brand-primary/5 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1 text-brand-light-accent-1">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`flex items-center justify-center min-w-[28px] h-7 rounded-md border ${orderColors.bg} ${orderColors.text} ${orderColors.border} font-semibold text-sm`}>
                  {chapter.order}
                </div>
                <h4 className="font-semibold text-brand-heading text-base">
                  {chapter.title}
                </h4>
                <Badge
                  variant={chapter.is_active ? "default" : "outline"}
                  className="text-xs"
                >
                  {chapter.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {chapter.description && (
                <p className="text-sm text-brand-light-accent-1 mb-2 line-clamp-2">
                  {chapter.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-brand-light-accent-1">
                <div className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  <span>{chapter.topics.length} topics</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" />
                  <span>{chapter.statistics?.videosCount || 0} videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{chapter.statistics?.materialsCount || 0} materials</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="h-8 w-8 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-brand-light-accent-1" />
              ) : (
                <ChevronRight className="h-4 w-4 text-brand-light-accent-1" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 border-t border-brand-border">
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-semibold text-brand-heading">
                Topics ({topicsToDisplay.length})
                <span className="text-xs text-brand-light-accent-1 ml-2">
                  • {chapter.statistics.videosCount} videos • {chapter.statistics.materialsCount} materials
                </span>
              </h5>
            </div>
            {topicsToDisplay.length > 0 ? (
              <div className="space-y-3 pl-4 border-l-2 border-brand-primary/20">
                {topicsToDisplay
                  .sort((a, b) => a.order - b.order)
                  .map((topic) => (
                    <ExploreTopicCard
                      key={topic.id}
                      topic={topic}
                      basePath={basePath}
                      isExpanded={expandedTopics?.has(topic.id) || false}
                      onToggleExpanded={(expanded) => {
                        onTopicToggle?.(topic.id, expanded);
                      }}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-brand-border">
                <Layers className="h-8 w-8 text-brand-light-accent-1 mx-auto mb-2" />
                <p className="text-sm text-brand-light-accent-1">
                  No topics in this chapter
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

