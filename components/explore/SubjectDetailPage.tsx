"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, BookOpen, Layers, Video, FileText } from "lucide-react";
import { useExploreTopics, useExploreVideos } from "@/hooks/explore/use-explore";
import { ExploreChapterCard } from "@/components/explore/ExploreChapterCard";
import { VideoCard } from "@/components/explore/VideoCard";
import { Pagination } from "@/components/explore/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PublicApiError } from "@/lib/api/public";
import Image from "next/image";

interface SubjectDetailPageProps {
  subjectId: string;
  basePath: string; // e.g., "/admin", "/teacher", "/student"
}

export function SubjectDetailPage({ subjectId, basePath }: SubjectDetailPageProps) {
  const router = useRouter();
  const [videoPage, setVideoPage] = useState(1);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch complete subject resources (chapters, topics, videos, materials, assessments)
  const {
    data: resourcesData,
    isLoading: isLoadingResources,
    error: resourcesError,
    refetch: refetchResources,
  } = useExploreTopics(subjectId);

  // Fetch all videos for "All Videos" section
  const {
    data: videosData,
    isLoading: isLoadingVideos,
    error: videosError,
  } = useExploreVideos({
    subjectId: subjectId,
    page: videoPage,
    limit: 20,
  });

  // Handle errors
  const error = resourcesError || videosError;
  if (error && !showErrorModal) {
    let message = "An unexpected error occurred.";
    if (error instanceof PublicApiError) {
      if (error.statusCode === 404) {
        message = "Subject not found.";
      } else if (error.statusCode === 400) {
        message = error.message || "Invalid request parameters.";
      } else {
        message = error.message || "Failed to load subject data.";
      }
    }
    setErrorMessage(message);
    setShowErrorModal(true);
  }

  const handleVideoClick = (videoId: string) => {
    router.push(`${basePath}/explore/videos/${videoId}`);
  };

  const isLoading = isLoadingResources || isLoadingVideos;

  if (!resourcesData && !isLoading && !error) {
    return null;
  }

  // Sort chapters by order
  const sortedChapters = resourcesData?.chapters
    ? [...resourcesData.chapters].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="pt-4 pb-6 space-y-6 bg-brand-bg min-h-screen">
      {/* Back Button */}
      <div className="pl-0 pr-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`${basePath}/explore`)}
          className="-ml-2 -mt-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>
      </div>

      {/* Subject Header */}
      {resourcesData && (
        <div className="pl-0 pr-6">
          <Card className="shadow-sm bg-white border border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {resourcesData.subject.thumbnailUrl ? (
                  <div className="relative w-32 h-40 rounded-lg overflow-hidden border-2 border-brand-border flex-shrink-0 shadow-md bg-gray-100">
                    <Image
                      src={resourcesData.subject.thumbnailUrl}
                      alt={resourcesData.subject.name}
                      fill
                      className="object-contain"
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <div
                    className="w-32 h-40 rounded-lg flex-shrink-0 flex flex-col items-center justify-center text-white font-semibold shadow-md border-2 border-brand-border"
                    style={{ backgroundColor: resourcesData.subject.color || "#4f46e5" }}
                  >
                    <span className="text-lg font-bold leading-tight text-center px-2">
                      {resourcesData.subject.code ||
                        resourcesData.subject.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-brand-heading mb-2">
                    {resourcesData.subject.name}
                  </h1>
                  <p className="text-brand-light-accent-1 mb-4">
                    {resourcesData.subject.code} • {resourcesData.subject.description || "No description"}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-brand-primary" />
                      <span className="text-brand-light-accent-1">
                        <span className="font-semibold text-brand-heading">
                          {resourcesData.statistics.chaptersCount}
                        </span>{" "}
                        Chapters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-brand-primary" />
                      <span className="text-brand-light-accent-1">
                        <span className="font-semibold text-brand-heading">
                          {resourcesData.statistics.topicsCount}
                        </span>{" "}
                        Topics
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-brand-primary" />
                      <span className="text-brand-light-accent-1">
                        <span className="font-semibold text-brand-heading">
                          {resourcesData.statistics.videosCount}
                        </span>{" "}
                        Videos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-primary" />
                      <span className="text-brand-light-accent-1">
                        <span className="font-semibold text-brand-heading">
                          {resourcesData.statistics.materialsCount}
                        </span>{" "}
                        Materials
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="pl-0 pr-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">Error Loading Subject</p>
                  <p className="text-sm text-red-700">
                    {errorMessage || "Failed to load subject data. Please try again."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchResources();
                    setShowErrorModal(false);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Videos Section */}
      {!isLoading && !error && videosData && videosData.items.length > 0 && (
        <div className="pl-0 pr-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-brand-heading">
                All Videos
              </h2>
              <p className="text-sm text-brand-light-accent-1 mt-1">
                Browse all videos for this subject
              </p>
            </div>
            <span className="text-sm text-brand-light-accent-1">
              {videosData.meta.totalItems} {videosData.meta.totalItems === 1 ? "video" : "videos"}
            </span>
          </div>

          {isLoadingVideos ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="animate-pulse max-w-[260px] mx-auto">
                  <CardContent className="p-0">
                    <div className="aspect-[16/11] bg-gray-200" />
                    <div className="p-2.5 space-y-1.5">
                      <div className="h-3.5 bg-gray-200 rounded w-full" />
                      <div className="h-2.5 bg-gray-200 rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {videosData.items.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => handleVideoClick(video.id)}
                  />
                ))}
              </div>
              {videosData.meta.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={videosData.meta.currentPage}
                    totalPages={videosData.meta.totalPages}
                    onPageChange={setVideoPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Chapters Section */}
      {!isLoading && !error && resourcesData && (
        <div className="pl-0 pr-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-brand-heading">
                Chapters
              </h2>
              <p className="text-sm text-brand-light-accent-1 mt-1">
                Browse chapters and their topics for this subject
              </p>
            </div>
          </div>

          {sortedChapters.length > 0 ? (
            <div className="space-y-4">
              {sortedChapters.map((chapter) => (
                <ExploreChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  basePath={basePath}
                />
              ))}
            </div>
          ) : (
            <Card className="shadow-sm bg-white border border-brand-border">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-4" />
                <p className="text-brand-light-accent-1 mb-4">
                  No chapters available for this subject.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Subject
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  refetchResources();
                  setShowErrorModal(false);
                }}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button
                onClick={() => setShowErrorModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
