"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { LibraryTopic, LibraryVideo, LibraryMaterial, LibraryAssessment } from "@/hooks/explore/use-explore";
import { Video, FileText, ChevronDown, ChevronRight, Clock, ClipboardList, GripVertical, Play } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { formatDuration, formatFileSize } from "@/lib/utils/explore";

// Color palette for order badges - cycles through appealing colors
const getOrderBadgeColors = (order: number | null | undefined) => {
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
  const validOrder = typeof order === 'number' && !isNaN(order) && order > 0 ? order : 1;
  return colors[(validOrder - 1) % colors.length];
};

interface ExploreTopicCardProps {
  topic: LibraryTopic;
  basePath: string;
}

export function ExploreTopicCard({ topic, basePath }: ExploreTopicCardProps) {
  const router = useRouter();
  const orderColors = getOrderBadgeColors(topic.order);
  const [activeTab, setActiveTab] = useState("videos");
  const [isExpanded, setIsExpanded] = useState(false);

  const videos = topic.videos || [];
  const materials = topic.materials || [];
  const assessments = topic.assessments || [];

  const handleVideoClick = (videoId: string) => {
    router.push(`${basePath}/explore/videos/${videoId}`);
  };

  const handleMaterialDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const handleAssessmentClick = (assessmentId: string) => {
    router.push(`${basePath}/assessments/${assessmentId}`);
  };

  const renderVideoItem = (video: LibraryVideo) => {
    const videoOrderColors = getOrderBadgeColors(video.order);

    return (
      <div
        key={video.id}
        className="flex-shrink-0 w-64 bg-white rounded-lg border border-brand-border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer relative"
        onClick={() => handleVideoClick(video.id)}
      >
        <div className="relative aspect-video bg-black">
          {/* Order Badge */}
          <div className={`absolute top-2 left-2 z-10 flex items-center justify-center min-w-[24px] h-6 rounded-md border ${videoOrderColors.bg} ${videoOrderColors.text} ${videoOrderColors.border} font-semibold text-xs px-1.5`}>
            {video.order}
          </div>
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
              sizes="256px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="rounded-full bg-white/90 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="h-6 w-6 text-gray-900 ml-1" />
            </div>
          </div>
          {video.durationSeconds && video.durationSeconds > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.durationSeconds)}
            </div>
          )}
        </div>
        <div className="p-3">
          <h6 className="font-medium text-sm text-brand-heading line-clamp-2 mb-1">
            {video.title}
          </h6>
          <div className="flex items-center gap-2 text-xs text-brand-light-accent-1">
            {video.durationSeconds && video.durationSeconds > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(video.durationSeconds)}
              </span>
            )}
            {video.sizeBytes && <span>{formatFileSize(video.sizeBytes)}</span>}
          </div>
        </div>
      </div>
    );
  };

  const renderMaterialItem = (material: LibraryMaterial) => {
    const getMaterialIcon = () => {
      const type = material.materialType?.toLowerCase() || "";
      if (type.includes("pdf")) return "📕";
      if (type.includes("doc") || type.includes("word")) return "📘";
      if (type.includes("ppt") || type.includes("powerpoint")) return "📗";
      return "📄";
    };
    
    const materialOrderColors = getOrderBadgeColors(material.order);

    return (
      <div
        key={material.id}
        className="flex-shrink-0 w-32 bg-white rounded-lg border border-brand-border overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative"
        style={{ aspectRatio: "1 / 1.4" }}
        onClick={() => handleMaterialDownload(material.url)}
      >
        {/* Order Badge */}
        <div className={`absolute top-2 left-2 z-10 flex items-center justify-center min-w-[20px] h-5 rounded-md border ${materialOrderColors.bg} ${materialOrderColors.text} ${materialOrderColors.border} font-semibold text-[10px] px-1`}>
          {material.order}
        </div>
        
        {/* Book Cover Style */}
        <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-blue-100/50">
          <div className="h-2 bg-blue-200/50"></div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
              {getMaterialIcon()}
            </div>
            
            <h6 className="font-semibold text-sm text-brand-heading line-clamp-3 mb-2 leading-tight">
              {material.title}
            </h6>
            
            <div className="inline-flex items-center px-2 py-1 bg-white/80 rounded-md mb-2">
              <span className="text-[10px] font-medium text-blue-700 uppercase">
                {material.materialType || "File"}
              </span>
            </div>
          </div>
          
          <div className="bg-white/60 border-t border-blue-200/50 p-2.5">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-medium text-brand-heading">
                {material.sizeBytes ? formatFileSize(material.sizeBytes) : "N/A"}
              </p>
              {material.pageCount && material.pageCount > 0 && (
                <p className="text-[9px] text-brand-light-accent-1">
                  {material.pageCount} {material.pageCount === 1 ? "page" : "pages"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssessmentItem = (assessment: LibraryAssessment) => {
    const assessmentOrderColors = getOrderBadgeColors(null);
    const colors = assessmentOrderColors || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
    
    const formatDuration = (minutes: number): string => {
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
      <div
        key={assessment.id}
        className="flex-shrink-0 w-64 bg-white rounded-lg border border-brand-border p-4 hover:shadow-md transition-shadow relative group cursor-pointer"
        onClick={() => handleAssessmentClick(assessment.id)}
      >
        <div className={`absolute top-2 left-2 z-10 flex items-center justify-center min-w-[20px] h-5 rounded-md border ${colors.bg} ${colors.text} ${colors.border} font-semibold text-[10px] px-1`}>
          1
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 pr-6">
              <h6 className="font-medium text-sm text-brand-heading line-clamp-2 mb-1">
                {assessment.title}
              </h6>
              {assessment.description && (
                <p className="text-xs text-brand-light-accent-1 line-clamp-2 mb-2">
                  {assessment.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] h-4 px-1.5">
              Published
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs text-brand-light-accent-1">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-3 w-3" />
              <span>{assessment.questionsCount} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(assessment.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-brand-heading">Pass: {assessment.passingScore}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg border border-brand-border/60 hover:border-brand-border shadow-sm hover:shadow transition-all">
      <div 
        className="p-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-0.5 text-brand-light-accent-1">
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`flex items-center justify-center min-w-[20px] h-5 rounded border ${orderColors.bg} ${orderColors.text} ${orderColors.border} font-semibold text-[10px] flex-shrink-0`}>
                  {topic.order}
                </div>
                <h5 className="font-medium text-brand-heading text-sm truncate">
                  {topic.title}
                </h5>
                <Badge
                  variant={topic.is_active ? "default" : "outline"}
                  className="text-[10px] h-4 px-1.5 flex-shrink-0"
                >
                  {topic.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {topic.description && (
                <p className="text-xs text-brand-light-accent-1 mb-1 line-clamp-1">
                  {topic.description}
                </p>
              )}
              <div className="flex items-center gap-3 text-[10px] text-brand-light-accent-1">
                <span>{topic.statistics.videosCount} videos</span>
                <span>•</span>
                <span>{topic.statistics.materialsCount} materials</span>
                <span>•</span>
                <span>{topic.statistics.assessmentsCount} assessments</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-6 w-6 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-brand-light-accent-1" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-brand-light-accent-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Only show when expanded */}
      {isExpanded && (
        <div className="border-t border-brand-border/60 p-3 pt-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-8 w-full justify-start">
              <TabsTrigger value="videos" className="text-xs px-3">
                <Video className="h-3 w-3 mr-1.5" />
                Videos ({videos.length})
              </TabsTrigger>
              <TabsTrigger value="materials" className="text-xs px-3">
                <FileText className="h-3 w-3 mr-1.5" />
                Materials ({materials.length})
              </TabsTrigger>
              <TabsTrigger value="assessments" className="text-xs px-3">
                <ClipboardList className="h-3 w-3 mr-1.5" />
                Assessments ({assessments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-3">
              {videos.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3" style={{ scrollbarWidth: 'thin' }}>
                  {videos
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((video) => renderVideoItem(video))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-brand-light-accent-1">
                  <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No videos available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="materials" className="mt-3">
              {materials.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3" style={{ scrollbarWidth: 'thin' }}>
                  {materials
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map(renderMaterialItem)}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-brand-light-accent-1">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No materials available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="assessments" className="mt-3">
              {assessments.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3" style={{ scrollbarWidth: 'thin' }}>
                  {assessments.map(renderAssessmentItem)}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-brand-light-accent-1">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No assessments available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

