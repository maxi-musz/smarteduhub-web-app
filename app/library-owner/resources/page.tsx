"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useLibraryOwnerResources,
  ResourcesDashboardResponse,
  Video,
  Material,
} from "@/hooks/use-library-owner-resources";
import { ResourcesSkeleton } from "./components/ResourcesSkeleton";
import { ResourcesStatistics } from "./components/ResourcesStatistics";
import { ResourcesBreakdown } from "./components/ResourcesBreakdown";
import { LibraryClassCard } from "./components/LibraryClassCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCw,
  Video as VideoIcon,
  FileText,
  Clock,
  Play,
  User,
  Calendar,
} from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

const LibraryOwnerResources = () => {
  const router = useRouter();

  // Fetch resources dashboard data
  const {
    data: resourcesData,
    isLoading: isResourcesLoading,
    error: resourcesError,
    refetch: refetchResources,
    dataUpdatedAt,
    isFetching,
  } = useLibraryOwnerResources();

  // Log when component mounts
  useEffect(() => {
    logger.info("[Resources Page] Component mounted/rendered", {
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Log query state changes
  useEffect(() => {
    logger.info("[Resources Page] Query state changed", {
      isLoading: isResourcesLoading,
      isFetching,
      hasData: !!resourcesData,
      dataUpdatedAt: dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null,
      timestamp: new Date().toISOString(),
    });
  }, [isResourcesLoading, isFetching, resourcesData, dataUpdatedAt]);

  // Show skeleton loader while loading
  if (isResourcesLoading) {
    return <ResourcesSkeleton />;
  }

  // Show error modal if there's an error
  if (resourcesError) {
    let errorMessage =
      "An unexpected error occurred while loading resources data.";

    if (resourcesError instanceof AuthenticatedApiError) {
      if (resourcesError.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (resourcesError.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (resourcesError.statusCode === 404) {
        errorMessage =
          "The requested resource was not found. Please check your connection.";
      } else {
        const rawMessage = resourcesError.message || "";
        if (
          rawMessage.includes("Cannot GET") ||
          rawMessage.includes("Cannot POST")
        ) {
          errorMessage =
            "Unable to connect to the server. Please check your connection and try again.";
        } else {
          errorMessage = rawMessage;
        }
      }
    }

    return (
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
        <div className="px-4 sm:px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading Resources
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      refetchResources();
                    }}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Show content if data is available
  if (!resourcesData) {
    return <ResourcesSkeleton />;
  }

  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds || seconds <= 0) return "0:00";
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderRecentVideoCard = (video: Video) => {
    const handleClick = () => {
      // Navigate to the same video player used in subject resources
      router.push(
        `/library-owner/resources/${video.subject.classId}/${video.subjectId}/video/${video.id}`
      );
    };

    return (
      <div
        key={video.id}
        className="flex-shrink-0 w-64 bg-white rounded-lg border border-brand-border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative aspect-video bg-black">
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
              <VideoIcon className="h-12 w-12 text-gray-400" />
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
        <div className="p-3 space-y-2">
          <h4 className="font-medium text-sm text-brand-heading line-clamp-2">
            {video.title}
          </h4>
          
          {/* Subject and Topic */}
          <p className="text-[11px] text-brand-light-accent-1 line-clamp-1">
            {video.subject.name} • {video.topic.title}
          </p>
          
          {/* Duration and File Size */}
          <div className="flex items-center gap-2 text-[11px] text-brand-light-accent-1">
            {video.durationSeconds > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(video.durationSeconds)}
              </span>
            )}
            <span>{formatFileSize(video.sizeBytes)}</span>
          </div>
          
          {/* Uploaded By */}
          {video.uploadedBy && (
            <div className="flex items-center gap-1.5 text-[10px] text-brand-light-accent-1">
              <User className="h-3 w-3" />
              <span className="line-clamp-1">
                {video.uploadedBy.first_name} {video.uploadedBy.last_name}
              </span>
            </div>
          )}
          
          {/* Creation Date */}
          {video.createdAt && (
            <div className="flex items-center gap-1.5 text-[10px] text-brand-light-accent-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(video.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRecentMaterialCard = (material: Material) => {
    const handleClick = () => {
      // Open material in a new tab
      if (material.url) {
        window.open(material.url, "_blank", "noopener,noreferrer");
      }
    };

    return (
      <div
        key={material.id}
        className="flex-shrink-0 w-32 bg-white rounded-lg border border-brand-border overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative"
        style={{ aspectRatio: "1 / 1.4" }}
        onClick={handleClick}
      >
        {/* Book Cover Style */}
        <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-blue-100/50">
          {/* Top Section - Book Spine Effect */}
          <div className="h-2 bg-blue-200/50"></div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            {/* Material Icon */}
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
              <FileText className="h-10 w-10 text-blue-600" />
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
                  {material.pageCount}{" "}
                  {material.pageCount === 1 ? "page" : "pages"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const data = resourcesData as unknown as ResourcesDashboardResponse;

  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">Resources</h1>
        <p className="text-sm sm:text-base text-brand-light-accent-1 mt-1">
          Manage and view all your library resources
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="px-4 sm:px-6">
        <ResourcesStatistics statistics={data.statistics} />
      </div>

      {/* Breakdown Statistics */}
      <div className="px-4 sm:px-6">
        <ResourcesBreakdown statistics={data.statistics} />
      </div>

      {/* Additional Content Sections */}
      <div className="px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Collapsible Sections */}
        <Accordion type="multiple" defaultValue={[]} className="space-y-4">
          {/* Library Classes Summary - Collapsed by default */}
          <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-blue-500 border border-brand-border overflow-hidden">
            <AccordionItem value="library-classes" className="border-0">
              <AccordionTrigger className="hover:no-underline px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl font-semibold text-brand-heading">
                  Library Classes ({data.libraryClasses.length})
                </h2>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {data.libraryClasses.map((classItem) => (
                    <LibraryClassCard key={classItem.id} classItem={classItem} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          {/* Recent Materials Summary - Collapsed by default */}
          <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-green-500 border border-brand-border overflow-hidden">
            <AccordionItem value="recent-materials" className="border-0">
              <AccordionTrigger className="hover:no-underline px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl font-semibold text-brand-heading">
                  Recent Materials ({data.resources.materials.length})
                </h2>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6">
                <div className="pb-4">
                  {data.resources.materials.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
                      {data.resources.materials
                        .slice(0, 12)
                        .map(renderRecentMaterialCard)}
                    </div>
                  ) : (
                    <p className="text-sm text-brand-light-accent-1 text-center py-4">
                      No materials found
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>

        {/* Recent Videos - Video-style cards with navigation */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-purple-500 border border-brand-border p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-heading mb-4">
            Recent Videos ({data.resources.videos.length})
          </h2>
          {data.resources.videos.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
              {data.resources.videos.slice(0, 12).map(renderRecentVideoCard)}
            </div>
          ) : (
            <p className="text-sm text-brand-light-accent-1 text-center py-4">
              No videos found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryOwnerResources;

