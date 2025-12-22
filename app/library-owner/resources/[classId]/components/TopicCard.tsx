"use client";

import { Badge } from "@/components/ui/badge";
import { Topic } from "@/hooks/use-library-class-resources";
import { Video, FileText, User } from "lucide-react";

interface TopicCardProps {
  topic: Topic;
}

export const TopicCard = ({ topic }: TopicCardProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-brand-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-brand-heading mb-1">{topic.title}</h4>
          {topic.description && (
            <p className="text-xs text-brand-light-accent-1 mb-2 line-clamp-2">
              {topic.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-brand-light-accent-1">
            <div className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              <span>{topic.videosCount} videos</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{topic.materialsCount} materials</span>
            </div>
            <Badge
              variant={topic.is_active ? "default" : "outline"}
              className="text-xs"
            >
              {topic.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Videos */}
      {topic.videos.length > 0 && (
        <div className="mb-3">
          <h5 className="text-xs font-semibold text-brand-heading mb-2 flex items-center gap-1">
            <Video className="h-3 w-3 text-green-600" />
            Videos ({topic.videos.length})
          </h5>
          <div className="space-y-2">
            {topic.videos.map((video) => (
              <div
                key={video.id}
                className="p-2 bg-white rounded border border-brand-border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-heading truncate">
                      {video.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-brand-light-accent-1">
                      <span>{formatDuration(video.durationSeconds)}</span>
                      <span>•</span>
                      <span>{formatFileSize(video.sizeBytes)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{video.uploadedBy.first_name} {video.uploadedBy.last_name}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      video.status === "published"
                        ? "bg-green-100 text-green-800"
                        : video.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {video.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      {topic.materials.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-brand-heading mb-2 flex items-center gap-1">
            <FileText className="h-3 w-3 text-orange-600" />
            Materials ({topic.materials.length})
          </h5>
          <div className="space-y-2">
            {topic.materials.map((material) => (
              <div
                key={material.id}
                className="p-2 bg-white rounded border border-brand-border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-heading truncate">
                      {material.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-brand-light-accent-1">
                      <Badge variant="outline" className="text-xs">
                        {material.materialType}
                      </Badge>
                      {material.pageCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{material.pageCount} pages</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatFileSize(material.sizeBytes)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{material.uploadedBy.first_name} {material.uploadedBy.last_name}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      material.status === "published"
                        ? "bg-green-100 text-green-800"
                        : material.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {material.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topic.videos.length === 0 && topic.materials.length === 0 && (
        <p className="text-xs text-brand-light-accent-1 text-center py-2">
          No resources in this topic
        </p>
      )}
    </div>
  );
};

