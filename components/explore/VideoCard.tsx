"use client";

import { LibraryVideo } from "@/hooks/explore/use-explore";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";
import Image from "next/image";
import { formatDuration, isLightColor } from "@/lib/utils/explore";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: LibraryVideo;
  onClick?: () => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  const subjectColor = video.subject?.color || "#4f46e5";
  const useLightText = isLightColor(subjectColor);

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] group w-full max-w-[260px] mx-auto border border-brand-border overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Thumbnail with Play Overlay - Landscape with more height */}
        <div className="relative w-full aspect-[16/11] overflow-hidden bg-gray-200">
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Play className="h-10 w-10 text-gray-400" />
            </div>
          )}
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Play className="h-6 w-6 text-brand-primary fill-brand-primary" />
              </div>
            </div>
          </div>

          {/* Duration Badge */}
          {video.durationSeconds && (
            <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1.5 font-medium shadow-lg">
              <Clock className="h-3 w-3" />
              {formatDuration(video.durationSeconds)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 bg-white">
          <h3 className="font-semibold text-brand-heading text-sm mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
            {video.title}
          </h3>
          {video.subject && (
            <div
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium inline-block",
                useLightText ? "text-gray-900" : "text-white"
              )}
              style={{ backgroundColor: subjectColor }}
            >
              {video.subject.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

