"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Upload } from "lucide-react";
import { VideoCard } from "./VideoCard";
import { MaterialCard } from "./MaterialCard";
import { UploadVideoModal } from "./UploadVideoModal";
import { UploadMaterialModal } from "./UploadMaterialModal";
import { useTopicContent } from "@/hooks/subjects/use-topic-content";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

interface TopicContentProps {
  topicId: string | null;
  subjectId: string;
  canUpload?: boolean;
}

export const TopicContent = ({ topicId, subjectId, canUpload = true }: TopicContentProps) => {
  const { data: topicContent, isLoading, error } = useTopicContent(topicId);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [isUploadMaterialModalOpen, setIsUploadMaterialModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  if (!topicId) {
    return (
      <div className="lg:col-span-2">
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Select a topic to view its content</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 mx-auto text-brand-primary animate-spin mb-4" />
          <p className="text-gray-600">Loading topic content...</p>
        </div>
      </div>
    );
  }

  if (error || !topicContent) {
    let errorMessage = "Failed to load topic content";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 404) {
        errorMessage = "Topic content not found";
      } else {
        errorMessage = error.message;
      }
    }

    return (
      <div className="lg:col-span-2">
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">{errorMessage}</p>
          <p className="text-sm text-gray-500">Please try selecting the topic again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold capitalize mb-2">
            {topicContent.topicTitle}
          </h3>
          {topicContent.topicDescription && (
            <p className="text-sm text-gray-600 capitalize mb-4">
              {topicContent.topicDescription}
            </p>
          )}
        </div>

        <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="videos">
                Videos ({topicContent.contentSummary.totalVideos})
              </TabsTrigger>
              <TabsTrigger value="materials">
                Materials ({topicContent.contentSummary.totalMaterials})
              </TabsTrigger>
            </TabsList>
                   {canUpload && activeTab === "videos" && (
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => setIsUploadVideoModalOpen(true)}
                       className="ml-4"
                     >
                       <Upload className="h-4 w-4 mr-1" />
                       Upload Video
                     </Button>
                   )}
                   {canUpload && activeTab === "materials" && (
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => setIsUploadMaterialModalOpen(true)}
                       className="ml-4"
                     >
                       <Upload className="h-4 w-4 mr-1" />
                       Upload Material
                     </Button>
                   )}
          </div>

          <TabsContent value="videos" className="space-y-3 mt-4">
            {topicContent.videos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No videos available</p>
                {canUpload && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsUploadVideoModalOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Your First Video
                  </Button>
                )}
              </div>
            ) : (
              topicContent.videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={{
                    id: video.id,
                    title: video.title,
                    duration: video.duration || "00:00",
                    thumbnail: video.thumbnail?.secure_url || "",
                    url: video.url,
                    views: video.views,
                    size: video.size || "0 MB",
                  }}
                  topicId={topicId}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-3 mt-4">
            {topicContent.materials.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No materials available</p>
                {canUpload && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsUploadMaterialModalOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Your First Material
                  </Button>
                )}
              </div>
            ) : (
              topicContent.materials.map((material) => {
                // Extract file type from URL or use a default
                const fileType = material.url
                  ? material.url.split(".").pop()?.toLowerCase() || "pdf"
                  : "pdf";

                return (
                  <MaterialCard
                    key={material.id}
                    material={{
                      id: material.id,
                      title: material.title,
                      type: fileType,
                      size: material.size || "0 MB",
                      url: material.url,
                      downloads: material.downloads,
                    }}
                    subjectId={subjectId}
                    topicId={topicId}
                  />
                );
              })
            )}
          </TabsContent>
        </Tabs>

        {topicId && (
          <>
            <UploadVideoModal
              isOpen={isUploadVideoModalOpen}
              onClose={() => setIsUploadVideoModalOpen(false)}
              subjectId={subjectId}
              topicId={topicId}
            />
            <UploadMaterialModal
              isOpen={isUploadMaterialModalOpen}
              onClose={() => setIsUploadMaterialModalOpen(false)}
              subjectId={subjectId}
              topicId={topicId}
            />
          </>
        )}
      </div>
    </div>
  );
};

