"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Topic } from "@/hooks/use-library-class-resources";
import { TopicVideo, TopicMaterial, TopicLink, TopicCBT } from "@/hooks/topics/use-topic-materials";
import { Video, FileText, Pencil, GripVertical, Link as LinkIcon, Plus, Play, ExternalLink, ChevronDown, ChevronRight, Clock, MoreVertical, Trash2, ClipboardList } from "lucide-react";
import { formatTopicTitle } from "@/lib/text-formatter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { useTopicMaterials } from "@/hooks/topics/use-topic-materials";

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

interface EnhancedTopicCardProps {
  topic: Topic;
  onEdit: () => void;
  onEditVideo?: (video: TopicVideo, allVideos: TopicVideo[]) => void;
  onDeleteVideo?: (video: TopicVideo) => void;
  onDeleteMaterial?: (material: TopicMaterial) => void;
  onDeleteLink?: (link: TopicLink) => void;
  onUploadVideo?: () => void;
  onUploadMaterial?: () => void;
  onCreateLink?: () => void;
}

export const EnhancedTopicCard = ({
  topic,
  onEdit,
  onEditVideo,
  onDeleteVideo,
  onDeleteMaterial,
  onDeleteLink,
  onUploadVideo,
  onUploadMaterial,
  onCreateLink,
}: EnhancedTopicCardProps) => {
  const params = useParams();
  const router = useRouter();
  const orderColors = getOrderBadgeColors(topic.order);
  const [activeTab, setActiveTab] = useState("videos");
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Fetch topic materials when expanded
  const {
    data: topicMaterials,
    isLoading: isLoadingMaterials,
  } = useTopicMaterials(isExpanded ? topic.id : null);
  
  // Use fetched materials if available, otherwise use passed data
  const videos = topicMaterials?.content?.videos || topic.videos || [];
  const materials = topicMaterials?.content?.materials || topic.materials || [];
  const links = topicMaterials?.content?.links || topic.links || [];
  const assessments = topicMaterials?.content?.cbts || [];
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const renderVideoItem = (video: TopicVideo) => {
    const handleVideoClick = () => {
      // Navigate to video player page
      router.push(`/library-owner/resources/${params?.classId}/${params?.subjectId}/video/${video.id}`);
    };
    
    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEditVideo) {
        onEditVideo(video, videos);
      }
    };
    
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteVideo) {
        onDeleteVideo(video);
      }
    };
    
    const videoOrderColors = getOrderBadgeColors(video.order);

    return (
      <div
        key={video.id}
        className="flex-shrink-0 w-64 bg-white rounded-lg border border-brand-border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer relative"
        onClick={handleVideoClick}
      >
        {/* Action Buttons */}
        {(onEditVideo || onDeleteVideo) && (
          <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEditVideo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="h-7 w-7 p-0 bg-black/50 hover:bg-black/70 text-white"
                title="Edit video"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDeleteVideo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                className="h-7 w-7 p-0 bg-red-500/80 hover:bg-red-600 text-white"
                title="Delete video"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
        
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
              unoptimized={video.thumbnailUrl.includes("s3.amazonaws.com") || video.thumbnailUrl.includes("amazonaws.com")}
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
            {video.durationSeconds > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(video.durationSeconds)}
              </span>
            )}
            <span>{formatFileSize(video.sizeBytes)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMaterialItem = (material: TopicMaterial) => {
    const getMaterialIcon = () => {
      const type = material.materialType?.toLowerCase() || "";
      if (type.includes("pdf")) return "📕";
      if (type.includes("doc") || type.includes("word")) return "📘";
      if (type.includes("ppt") || type.includes("powerpoint")) return "📗";
      return "📄";
    };
    
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteMaterial) {
        onDeleteMaterial(material);
      }
    };
    
    const materialOrderColors = getOrderBadgeColors(material.order);

    return (
      <div
        key={material.id}
        className="flex-shrink-0 w-32 bg-white rounded-lg border border-brand-border overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative"
        style={{ aspectRatio: "1 / 1.4" }} // Portrait orientation like a book
      >
        {/* Delete Button */}
        {onDeleteMaterial && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 z-20 h-6 w-6 p-0 bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete material"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
        
        {/* Order Badge */}
        <div className={`absolute top-2 left-2 z-10 flex items-center justify-center min-w-[20px] h-5 rounded-md border ${materialOrderColors.bg} ${materialOrderColors.text} ${materialOrderColors.border} font-semibold text-[10px] px-1`}>
          {material.order}
        </div>
        
        {/* Book Cover Style */}
        <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-blue-100/50">
          {/* Top Section - Book Spine Effect */}
          <div className="h-2 bg-blue-200/50"></div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            {/* Material Icon */}
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
              {getMaterialIcon()}
            </div>
            
            {/* Title */}
            <h6 className="font-semibold text-sm text-brand-heading line-clamp-3 mb-2 leading-tight">
              {material.title}
            </h6>
            
            {/* File Type Badge */}
            <div className="inline-flex items-center px-2 py-1 bg-white/80 rounded-md mb-2">
              <span className="text-[10px] font-medium text-blue-700 uppercase">
                {material.materialType || "File"}
              </span>
            </div>
          </div>
          
          {/* Bottom Section - Book Details */}
          <div className="bg-white/60 border-t border-blue-200/50 p-2.5">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-medium text-brand-heading">
                {formatFileSize(material.sizeBytes)}
              </p>
              {material.pageCount > 0 && (
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

  const renderAssessmentItem = (assessment: TopicCBT) => {
    const assessmentOrderColors = getOrderBadgeColors(assessment.order);
    const formatDuration = (minutes: number): string => {
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const getStatusBadge = () => {
      if (assessment.isPublished) {
        return (
          <Badge variant="default" className="text-[10px] h-4 px-1.5">
            Published
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
          Draft
        </Badge>
      );
    };

    return (
      <div
        key={assessment.id}
        className="flex-shrink-0 w-64 bg-white rounded-lg border border-brand-border p-4 hover:shadow-md transition-shadow relative group"
      >
        {/* Order Badge */}
        <div className={`absolute top-2 left-2 z-10 flex items-center justify-center min-w-[20px] h-5 rounded-md border ${assessmentOrderColors.bg} ${assessmentOrderColors.text} ${assessmentOrderColors.border} font-semibold text-[10px] px-1`}>
          {assessment.order}
        </div>

        <div className="flex flex-col gap-3 pt-1">
          {/* Header */}
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

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {assessment.isResultReleased && (
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-green-600 border-green-300">
                Results Released
              </Badge>
            )}
          </div>

          {/* Assessment Details */}
          <div className="space-y-1.5 text-xs text-brand-light-accent-1">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-3 w-3" />
              <span>{assessment._count?.questions || 0} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(assessment.duration)}</span>
              {assessment.timeLimit > 0 && (
                <span className="text-[10px]">({Math.floor(assessment.timeLimit / 60)} min limit)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-brand-heading">{assessment.totalPoints} points</span>
              {assessment.passingScore > 0 && (
                <span className="text-[10px]">(Pass: {assessment.passingScore}%)</span>
              )}
            </div>
            {assessment.maxAttempts > 0 && (
              <div className="flex items-center gap-2">
                <span>Max attempts: {assessment.maxAttempts}</span>
              </div>
            )}
            {assessment.startDate && assessment.endDate && (
              <div className="flex items-center gap-2 text-[10px] pt-1 border-t border-brand-border/30">
                <span>{formatDate(assessment.startDate)} - {formatDate(assessment.endDate)}</span>
              </div>
            )}
            {assessment._count?.attempts > 0 && (
              <div className="flex items-center gap-2 text-[10px]">
                <span>{assessment._count.attempts} attempts</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {assessment.tags && assessment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {assessment.tags.slice(0, 3).map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-[9px] h-4 px-1.5"
                >
                  {tag}
                </Badge>
              ))}
              {assessment.tags.length > 3 && (
                <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                  +{assessment.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLinkItem = (link: TopicLink) => {
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onDeleteLink) {
        onDeleteLink(link);
      }
    };
    
    const linkOrderColors = getOrderBadgeColors(link.order);
    
    return (
      <div
        key={link.id}
        className="flex-shrink-0 w-56 bg-white rounded-lg border border-brand-border p-4 hover:shadow-md transition-shadow relative group"
      >
        {/* Delete Button */}
        {onDeleteLink && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 z-20 h-6 w-6 p-0 bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete link"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
        
        {/* Order Badge */}
        <div className={`absolute top-2 left-2 z-10 flex items-center justify-center min-w-[20px] h-5 rounded-md border ${linkOrderColors.bg} ${linkOrderColors.text} ${linkOrderColors.border} font-semibold text-[10px] px-1`}>
          {link.order}
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <LinkIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h6 className="font-medium text-sm text-brand-heading line-clamp-2 mb-1">
              {link.title}
            </h6>
            <p className="text-xs text-brand-light-accent-1 line-clamp-1 mb-2">
              {link.domain}
            </p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-primary hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              Open <ExternalLink className="h-3 w-3" />
            </a>
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
                  {formatTopicTitle(topic.title)}
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
                <span>{topic.videosCount || 0} videos</span>
                <span>•</span>
                <span>{topic.materialsCount || 0} materials</span>
                <span>•</span>
                <span>{topic.linksCount || 0} links</span>
                {topicMaterials?.statistics?.totalCbts ? (
                  <>
                    <span>•</span>
                    <span>{topicMaterials.statistics.totalCbts} assessments</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {(onUploadVideo || onUploadMaterial || onCreateLink) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTab === "videos" && onUploadVideo) onUploadVideo();
                  else if (activeTab === "materials" && onUploadMaterial) onUploadMaterial();
                  else if (activeTab === "links" && onCreateLink) onCreateLink();
                }}
                className="h-6 w-6 p-0"
                title="Add content"
              >
                <Plus className="h-3 w-3 text-brand-light-accent-1" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-6 w-6 p-0 flex-shrink-0"
              title="Edit topic"
            >
              <Pencil className="h-3 w-3 text-brand-light-accent-1" />
            </Button>
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
            Videos ({isLoadingMaterials ? "..." : videos.length})
          </TabsTrigger>
          <TabsTrigger value="materials" className="text-xs px-3">
            <FileText className="h-3 w-3 mr-1.5" />
            Materials ({isLoadingMaterials ? "..." : materials.length})
          </TabsTrigger>
          <TabsTrigger value="links" className="text-xs px-3">
            <LinkIcon className="h-3 w-3 mr-1.5" />
            Links ({isLoadingMaterials ? "..." : links.length})
          </TabsTrigger>
          <TabsTrigger value="assessments" className="text-xs px-3">
            <ClipboardList className="h-3 w-3 mr-1.5" />
            Assessments ({isLoadingMaterials ? "..." : assessments.length})
          </TabsTrigger>
          <TabsTrigger value="other" className="text-xs px-3">
            Any Other (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-3">
          {isLoadingMaterials ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
              <p className="text-xs text-brand-light-accent-1 mt-2">Loading videos...</p>
            </div>
          ) : videos.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3" style={{ scrollbarWidth: 'thin' }}>
              {videos
                .sort((a, b) => a.order - b.order)
                .map((video) => renderVideoItem(video))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-brand-light-accent-1">
              <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No videos yet</p>
              {onUploadVideo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUploadVideo}
                  className="mt-3"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Video
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="mt-3">
          {isLoadingMaterials ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
              <p className="text-xs text-brand-light-accent-1 mt-2">Loading materials...</p>
            </div>
          ) : materials.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3" style={{ scrollbarWidth: 'thin' }}>
              {materials
                .sort((a, b) => a.order - b.order)
                .map(renderMaterialItem)}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-brand-light-accent-1">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No materials yet</p>
              {onUploadMaterial && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUploadMaterial}
                  className="mt-3"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Material
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="links" className="mt-3">
          {isLoadingMaterials ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
              <p className="text-xs text-brand-light-accent-1 mt-2">Loading links...</p>
            </div>
          ) : links.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3" style={{ scrollbarWidth: 'thin' }}>
              {links
                .sort((a, b) => a.order - b.order)
                .map(renderLinkItem)}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-brand-light-accent-1">
              <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No links yet</p>
              {onCreateLink && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCreateLink}
                  className="mt-3"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Link
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assessments" className="mt-3">
          {isLoadingMaterials ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
              <p className="text-xs text-brand-light-accent-1 mt-2">Loading assessments...</p>
            </div>
          ) : assessments.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3" style={{ scrollbarWidth: 'thin' }}>
              {assessments
                .sort((a, b) => a.order - b.order)
                .map(renderAssessmentItem)}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-brand-light-accent-1">
              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No assessments yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="other" className="mt-3">
          <div className="text-center py-6 text-sm text-brand-light-accent-1">
            <p>No other content available</p>
          </div>
        </TabsContent>
      </Tabs>
        </div>
      )}
    </div>
  );
};

