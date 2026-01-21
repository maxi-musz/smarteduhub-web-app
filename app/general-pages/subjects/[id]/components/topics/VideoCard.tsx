"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, PlayCircle, Clock, Eye } from "lucide-react";
import Image from "next/image";

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  views: number;
  size: string;
}

interface VideoCardProps {
  video: VideoItem;
  topicId?: string | null;
}

export const VideoCard = ({ video, topicId }: VideoCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine base path based on current route
  const getBasePath = () => {
    if (pathname.startsWith("/teacher")) return "/teacher";
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname.startsWith("/student")) return "/student";
    return "/general-pages";
  };

  const handleWatchClick = () => {
    const basePath = getBasePath();
    // Preserve topicId in the video player URL so we can navigate back
    const topicIdToPreserve = topicId || searchParams.get("topicId");
    const videoUrl = topicIdToPreserve
      ? `${basePath}/play-video/${video.id}?topicId=${topicIdToPreserve}`
      : `${basePath}/play-video/${video.id}`;
    router.push(videoUrl);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold capitalize mb-1">{video.title}</h4>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {video.views} views
              </span>
              <span>{video.size}</span>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={handleWatchClick}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Watch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

