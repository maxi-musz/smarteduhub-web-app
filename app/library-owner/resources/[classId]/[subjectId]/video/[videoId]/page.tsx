"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useVideoPlay } from "@/hooks/content/use-video-play";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, Play, Clock, Eye, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [actualDuration, setActualDuration] = useState<number | null>(null);

  const {
    data: video,
    isLoading,
    error,
  } = useVideoPlay(videoId);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-light-accent-1">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage = "An error occurred while loading the video.";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        errorMessage = "You don't have permission to view this video.";
      } else if (error.statusCode === 404) {
        errorMessage = "Video not found.";
      } else {
        errorMessage = error.message || errorMessage;
      }
    }

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-heading mb-2">
                Error Loading Video
              </h3>
              <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  // Use actual duration from video element if backend duration is 0 or missing
  const displayDuration = actualDuration || (video.durationSeconds > 0 ? video.durationSeconds : null);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-white border-b border-brand-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="-ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={video.thumbnailUrl || undefined}
                  onLoadedMetadata={(e) => {
                    const videoElement = e.currentTarget;
                    if (videoElement.duration && videoElement.duration > 0) {
                      setActualDuration(Math.floor(videoElement.duration));
                    }
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </Card>

            {/* Video Info */}
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold text-brand-heading">
                  {video.title}
                </h1>
                {video.description && (
                  <p className="text-brand-light-accent-1 mt-2">
                    {video.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-brand-light-accent-1">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{video.views} views</span>
                  </div>
                  {displayDuration ? (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(displayDuration)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Loading duration...</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span>{formatFileSize(video.sizeBytes)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section - Placeholder for future implementation */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-brand-heading">
                  Comments
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-brand-light-accent-1 text-center py-8">
                  Comments feature coming soon
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Details */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-brand-heading">
                  Details
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-brand-light-accent-1 mb-1">Topic</p>
                  <p className="text-sm font-medium text-brand-heading">
                    {video.topic.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-light-accent-1 mb-1">Subject</p>
                  <p className="text-sm font-medium text-brand-heading">
                    {video.subject.name} ({video.subject.code})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-light-accent-1 mb-1">Uploaded By</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-heading">
                        {video.uploadedBy.first_name} {video.uploadedBy.last_name}
                      </p>
                      <p className="text-xs text-brand-light-accent-1">
                        {video.uploadedBy.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-light-accent-1 mb-1">Uploaded</p>
                  <p className="text-sm text-brand-heading">
                    {new Date(video.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

