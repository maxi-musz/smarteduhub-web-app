"use client";

import { LibraryTopic } from "@/hooks/explore/use-explore";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Eye, Clock, Play } from "lucide-react";
import { formatDuration } from "@/lib/utils/explore";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TopicCardProps {
  topic: LibraryTopic;
  onClick?: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md card-hover"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Recent Videos Preview */}
          {topic.recentVideos && topic.recentVideos.length > 0 && (
            <div className="flex gap-1 flex-shrink-0">
              {topic.recentVideos.slice(0, 3).map((video, idx) => (
                <div
                  key={video.id}
                  className="relative w-16 h-12 rounded overflow-hidden bg-gray-200"
                >
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-heading mb-1">{topic.title}</h3>
            
            {topic.description && (
              <p className="text-sm text-brand-light-accent-1 mb-3 line-clamp-2">
                {topic.description}
              </p>
            )}

            {/* Analytics */}
            <div className="flex items-center gap-4 text-sm text-brand-light-accent-1">
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>{topic.analytics.videosCount} videos</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{topic.analytics.totalViews.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(topic.analytics.totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

