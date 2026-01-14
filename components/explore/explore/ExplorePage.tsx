"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useExplore, useExploreSubjects, useExploreVideos } from "@/hooks/explore/use-explore";
import { ClassCard } from "@/components/explore/explore/ClassCard";
import { SubjectCard } from "@/components/explore/explore/SubjectCard";
import { VideoCard } from "@/components/explore/explore/VideoCard";
import { SearchBar } from "@/components/explore/explore/SearchBar";
import { Pagination } from "@/components/explore/explore/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PublicApiError } from "@/lib/api/public";

interface ExplorePageProps {
  basePath: string; // e.g., "/admin", "/teacher", "/student"
}

export function ExplorePage({ basePath }: ExplorePageProps) {
  const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectPage, setSubjectPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch main explore data
  const {
    data: exploreData,
    isLoading: isLoadingMain,
    error: mainError,
    refetch: refetchMain,
  } = useExplore();

  // Fetch filtered subjects
  const {
    data: subjectsData,
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useExploreSubjects({
    classId: selectedClassId,
    search: searchTerm || undefined,
    page: subjectPage,
    limit: 20,
  });

  // Fetch filtered videos
  const {
    data: videosData,
    isLoading: isLoadingVideos,
    error: videosError,
  } = useExploreVideos({
    classId: selectedClassId,
    search: searchTerm || undefined,
    page: videoPage,
    limit: 20,
  });

  // Handle errors
  const error = mainError || subjectsError || videosError;
  if (error && !showErrorModal) {
    let message = "An unexpected error occurred.";
    if (error instanceof PublicApiError) {
      if (error.statusCode === 404) {
        message = "Resource not found.";
      } else if (error.statusCode === 400) {
        message = error.message || "Invalid request parameters.";
      } else {
        message = error.message || "Failed to load explore data.";
      }
    }
    setErrorMessage(message);
    setShowErrorModal(true);
  }

  const handleClassClick = (classId: string) => {
    setSelectedClassId(classId === selectedClassId ? undefined : classId);
    setSubjectPage(1);
    setVideoPage(1);
  };

  const handleSubjectClick = (subjectId: string) => {
    router.push(`${basePath}/explore/subjects/${subjectId}`);
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`${basePath}/explore/videos/${videoId}`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSubjectPage(1);
    setVideoPage(1);
  };

  const isLoading = isLoadingMain || isLoadingSubjects || isLoadingVideos;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="px-6">
        <div className="flex items-center gap-3 mb-4">
          <Compass className="h-8 w-8 text-brand-primary" />
          <h1 className="text-2xl font-bold text-brand-heading">Explore</h1>
        </div>
        <p className="text-brand-light-accent-1">
          Browse library content, subjects, and videos
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-6">
        <SearchBar
          placeholder="Search subjects or videos..."
          onSearch={handleSearch}
          className="max-w-2xl"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="px-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">Error Loading Content</p>
                  <p className="text-sm text-red-700">
                    {errorMessage || "Failed to load explore data. Please try again."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchMain();
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

      {/* Main Content */}
      {!isLoading && !error && exploreData && (
        <>
          {/* Classes Section */}
          {!searchTerm && (
            <div className="px-6">
              <h2 className="text-xl font-semibold text-brand-heading mb-4">
                Classes ({exploreData.statistics.totalClasses})
              </h2>
              <div className="overflow-x-auto scrollbar-hide pb-2">
                <div className="flex gap-3 min-w-max">
                  {exploreData.classes.map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      class={classItem}
                      isActive={selectedClassId === classItem.id}
                      onClick={() => handleClassClick(classItem.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subjects Section */}
          <div className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-brand-heading">
                {searchTerm 
                  ? `Search Results${subjectsData ? ` (${subjectsData.meta.totalItems})` : ""}`
                  : selectedClassId 
                  ? `Subjects${subjectsData ? ` (${subjectsData.meta.totalItems})` : ""}`
                  : `All Subjects${subjectsData ? ` (${subjectsData.meta.totalItems})` : exploreData ? ` (${exploreData.statistics.totalSubjects})` : ""}`}
              </h2>
            </div>

            {isLoadingSubjects ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <Card key={i} className="animate-pulse max-w-[140px] mx-auto">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] bg-gray-200" />
                      <div className="p-2 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-2 bg-gray-200 rounded w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : subjectsData && subjectsData.items.length > 0 ? (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {subjectsData.items.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onClick={() => handleSubjectClick(subject.id)}
                    />
                  ))}
                </div>
                {subjectsData.meta.totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={subjectsData.meta.currentPage}
                      totalPages={subjectsData.meta.totalPages}
                      onPageChange={setSubjectPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-brand-light-accent-1">
                    {searchTerm
                      ? "No subjects found matching your search."
                      : "No subjects available."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Videos Section */}
          {!searchTerm && (
            <div className="px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-brand-heading">
                  Recent Videos{videosData ? ` (${videosData.meta.totalItems})` : exploreData ? ` (${exploreData.statistics.totalVideos})` : ""}
                </h2>
                {videosData && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedClassId(undefined);
                      setVideoPage(1);
                    }}
                  >
                    View All
                  </Button>
                )}
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
              ) : videosData && videosData.items.length > 0 ? (
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
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-brand-light-accent-1">No videos available.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Video Search Results */}
          {searchTerm && videosData && videosData.items.length > 0 && (
            <div className="px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-brand-heading">
                  Video Results ({videosData.meta.totalItems})
                </h2>
              </div>
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
            </div>
          )}
        </>
      )}

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Explore
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  refetchMain();
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

