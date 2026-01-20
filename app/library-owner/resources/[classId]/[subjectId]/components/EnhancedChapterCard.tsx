"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chapter, Topic } from "@/hooks/library-owner/use-library-class-resources";
import {
  Layers,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  GripVertical,
} from "lucide-react";
import { useState } from "react";
import { EnhancedTopicCard } from "./EnhancedTopicCard";
import { formatChapterTitle } from "@/lib/text-formatter";
import { useChapterContents, type ChapterContentTopic } from "@/hooks/chapters/use-chapter-contents";
import { TopicVideo, TopicMaterial, TopicLink } from "@/hooks/topics/use-topic-materials";

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

interface EnhancedChapterCardProps {
  chapter: Chapter;
  subjectId: string;
  onEdit: (chapter: Chapter) => void;
  onCreateTopic: (chapterId: string) => void;
  onEditTopic: (topic: Topic) => void;
  onUploadVideo?: (topic: Topic) => void;
  onUploadMaterial?: (topic: Topic) => void;
  onCreateLink?: (topic: Topic) => void;
  onCreateAssessment?: (topic: Topic) => void;
  onEditVideo?: (video: TopicVideo, allVideos: TopicVideo[]) => void;
  onDeleteVideo?: (video: TopicVideo) => void;
  onDeleteMaterial?: (material: TopicMaterial) => void;
  onDeleteLink?: (link: TopicLink) => void;
}

export const EnhancedChapterCard = ({
  chapter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subjectId,
  onEdit,
  onCreateTopic,
  onEditTopic,
  onUploadVideo,
  onUploadMaterial,
  onCreateLink,
  onCreateAssessment,
  onEditVideo,
  onDeleteVideo,
  onDeleteMaterial,
  onDeleteLink,
}: EnhancedChapterCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const orderColors = getOrderBadgeColors(chapter.order);
  
  // Fetch chapter contents when expanded
  const {
    data: chapterContents,
    isLoading: isLoadingContents,
  } = useChapterContents(isExpanded ? chapter.id : null);
  
  // Use fetched topics if available, otherwise use passed topics
  const topicsToDisplay = chapterContents?.topics || chapter.topics || [];

  return (
    <Card className="shadow-md bg-white border-2 border-brand-primary/20 hover:border-brand-primary/40 transition-all">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-brand-primary/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
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
                  {formatChapterTitle(chapter.title)}
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
                  <span>{chapter.topicsCount} topics</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" />
                  <span>{chapter.totalVideos} videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{chapter.totalMaterials} materials</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(chapter)}
              className="h-8 w-8 p-0"
              title="Edit chapter"
            >
              <Pencil className="h-4 w-4 text-brand-light-accent-1" />
            </Button>
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
                Topics ({isLoadingContents ? "..." : topicsToDisplay.length})
                {chapterContents?.analysis && (
                  <span className="text-xs text-brand-light-accent-1 ml-2">
                    • {chapterContents.analysis.totalVideos} videos • {chapterContents.analysis.totalMaterials} materials
                  </span>
                )}
              </h5>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreateTopic(chapter.id)}
                className="flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Topic
              </Button>
            </div>
            {isLoadingContents ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                <p className="text-xs text-brand-light-accent-1 mt-2">Loading topics...</p>
              </div>
            ) : topicsToDisplay.length > 0 ? (
              <div className="space-y-3 pl-4 border-l-2 border-brand-primary/20">
                {topicsToDisplay
                  .sort((a, b) => a.order - b.order)
                  .map((topic) => {
                    // Convert ChapterContentTopic to Topic format for EnhancedTopicCard
                    const isChapterContentTopic = 'contentCounts' in topic;
                    const contentCounts = isChapterContentTopic 
                      ? (topic as ChapterContentTopic).contentCounts 
                      : { videos: 0, materials: 0, links: 0 };
                    
                    const topicForCard: Topic = {
                      id: topic.id,
                      title: topic.title,
                      description: topic.description,
                      order: topic.order,
                      is_active: topic.is_active,
                      createdAt: topic.createdAt,
                      updatedAt: topic.updatedAt,
                      videos: [],
                      materials: [],
                      links: [],
                      videosCount: contentCounts.videos,
                      materialsCount: contentCounts.materials,
                      linksCount: contentCounts.links,
                    };
                    return (
                      <EnhancedTopicCard
                        key={topic.id}
                        topic={topicForCard}
                        onEdit={() => onEditTopic(topicForCard)}
                        onEditVideo={onEditVideo ? (video, allVideos) => onEditVideo(video, allVideos) : undefined}
                        onDeleteVideo={onDeleteVideo ? (video) => onDeleteVideo(video) : undefined}
                        onDeleteMaterial={onDeleteMaterial ? (material) => onDeleteMaterial(material) : undefined}
                        onDeleteLink={onDeleteLink ? (link) => onDeleteLink(link) : undefined}
                        onUploadVideo={onUploadVideo ? () => onUploadVideo(topicForCard) : undefined}
                        onUploadMaterial={onUploadMaterial ? () => onUploadMaterial(topicForCard) : undefined}
                        onCreateLink={onCreateLink ? () => onCreateLink(topicForCard) : undefined}
                        onCreateAssessment={onCreateAssessment ? () => onCreateAssessment(topicForCard) : undefined}
                      />
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-brand-border">
                <Layers className="h-8 w-8 text-brand-light-accent-1 mx-auto mb-2" />
                <p className="text-sm text-brand-light-accent-1 mb-3">
                  No topics yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCreateTopic(chapter.id)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create First Topic
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

