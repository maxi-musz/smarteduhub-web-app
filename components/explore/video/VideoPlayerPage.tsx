"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useExploreVideoPlay } from "@/hooks/explore/use-explore-video-play";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, Clock, Eye, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { formatDuration, formatFileSize } from "@/lib/utils/explore";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface VideoPlayerPageProps {
  videoId: string;
  basePath: string; // e.g., "/admin", "/teacher", "/student"
}

export function VideoPlayerPage({ videoId, basePath }: VideoPlayerPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [actualDuration, setActualDuration] = useState<number | null>(null);

  const {
    data: video,
    isLoading,
    error,
  } = useExploreVideoPlay(videoId);

  // Show toast if user has watched before
  useEffect(() => {
    if (video?.hasViewedBefore && video.viewedAt) {
      const viewedDate = new Date(video.viewedAt).toLocaleDateString();
      toast({
        title: "You've watched this before",
        description: `Last watched on ${viewedDate}`,
        duration: 5000,
      });
    } else if (video && !video.hasViewedBefore) {
      toast({
        title: "First time watching!",
        description: "Your view has been counted.",
        duration: 3000,
      });
    }
  }, [video, toast]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (error instanceof AuthenticatedApiError && error.statusCode === 401) {
      router.push("/login");
    }
  }, [error, router]);

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
        errorMessage = "Please login to watch videos.";
      } else if (error.statusCode === 404) {
        errorMessage = "Video not found or not available.";
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
              <div className="flex gap-2 justify-center">
                {error instanceof AuthenticatedApiError && error.statusCode === 401 ? (
                  <Button onClick={() => router.push("/login")}>Login</Button>
                ) : (
                  <Button onClick={() => router.back()}>Go Back</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  // Use actual duration from video element if backend duration is missing
  const displayDuration = actualDuration || (video.durationSeconds || null);

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
            <Card className="overflow-hidden border-2 border-brand-border">
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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-brand-heading mb-2">
                      {video.title}
                    </h1>
                    {video.description && (
                      <p className="text-brand-light-accent-1">
                        {video.description}
                      </p>
                    )}
                  </div>
                  {video.hasViewedBefore && (
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Watched</span>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-brand-light-accent-1">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                  {displayDuration && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(displayDuration)}</span>
                    </div>
                  )}
                  {video.sizeBytes && (
                    <div className="flex items-center gap-1.5">
                      <span>{formatFileSize(video.sizeBytes)}</span>
                    </div>
                  )}
                  {video.hasViewedBefore && video.viewedAt && (
                    <div className="text-xs">
                      Watched on {new Date(video.viewedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
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
                {video.topic && (
                  <div>
                    <p className="text-xs text-brand-light-accent-1 mb-1">Topic</p>
                    <p className="text-sm font-medium text-brand-heading">
                      {video.topic.title}
                    </p>
                    {video.topic.chapter && (
                      <p className="text-xs text-brand-light-accent-1 mt-1">
                        Chapter: {video.topic.chapter.title}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <p className="text-xs text-brand-light-accent-1 mb-1">Subject</p>
                  <div className="flex items-center gap-2">
                    {video.subject.thumbnailUrl && (
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={video.subject.thumbnailUrl}
                          alt={video.subject.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-heading">
                        {video.subject.name}
                      </p>
                      <p className="text-xs text-brand-light-accent-1">
                        {video.subject.code}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-light-accent-1 mb-1">Platform</p>
                  <p className="text-sm font-medium text-brand-heading">
                    {video.platform.name}
                  </p>
                  {video.platform.description && (
                    <p className="text-xs text-brand-light-accent-1 mt-1">
                      {video.platform.description}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-brand-light-accent-1 mb-1">Published</p>
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

            {/* Related Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-brand-heading">
                  Actions
                </h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {video.subject && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push(`${basePath}/explore/subjects/${video.subject.id}`)}
                  >
                    View Subject
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`${basePath}/explore`)}
                >
                  Back to Explore
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

