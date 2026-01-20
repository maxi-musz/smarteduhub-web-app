"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Chapter } from "@/hooks/library-owner/use-library-class-resources";
import { Layers, Video, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TopicCard } from "./TopicCard";

interface ChapterCardProps {
  chapter: Chapter;
}

export const ChapterCard = ({ chapter }: ChapterCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="shadow-sm bg-white border border-brand-border">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-light-accent-1" />
              <div>
                <h4 className="font-medium text-brand-heading">
                  {chapter.title}
                </h4>
                <p className="text-xs text-brand-light-accent-1">
                  {chapter.description || "No description"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4 text-brand-light-accent-1" />
                <span className="text-brand-light-accent-1">{chapter.topicsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4 text-brand-light-accent-1" />
                <span className="text-brand-light-accent-1">{chapter.totalVideos}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-brand-light-accent-1" />
                <span className="text-brand-light-accent-1">{chapter.totalMaterials}</span>
              </div>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-brand-light-accent-1" />
            ) : (
              <ChevronRight className="h-5 w-5 text-brand-light-accent-1" />
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 border-t border-brand-border pt-4">
            {chapter.topics.length > 0 ? (
              chapter.topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))
            ) : (
              <p className="text-sm text-brand-light-accent-1 text-center py-4">
                No topics found
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};






