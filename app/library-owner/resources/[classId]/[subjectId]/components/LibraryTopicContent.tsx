"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Upload, ExternalLink, Trash2, Pencil, FileText, PlayCircle } from "lucide-react";
import { useLibraryTopicMaterials } from "@/hooks/library-owner/use-library-topic-materials";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { VideoUploadModal } from "./VideoUploadModal";
import { MaterialUploadModal } from "./MaterialUploadModal";
import { LinkCreateModal } from "./LinkCreateModal";
import { EditVideoModal } from "./EditVideoModal";
import { DeleteVideoModal } from "./DeleteVideoModal";
import { DeleteMaterialModal } from "./DeleteMaterialModal";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { 
  LibraryTopicVideo, 
  LibraryTopicMaterial, 
  LibraryTopicLink 
} from "@/hooks/library-owner/use-library-topic-materials";

interface LibraryTopicContentProps {
  topicId: string | null;
  subjectId: string;
  canUpload?: boolean;
}

export const LibraryTopicContent = ({ topicId, subjectId, canUpload = true }: LibraryTopicContentProps) => {
  const router = useRouter();
  const { data: topicMaterials, isLoading, error } = useLibraryTopicMaterials(topicId);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [isUploadMaterialModalOpen, setIsUploadMaterialModalOpen] = useState(false);
  const [isLinkCreateModalOpen, setIsLinkCreateModalOpen] = useState(false);
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false);
  const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false);
  const [isDeleteMaterialModalOpen, setIsDeleteMaterialModalOpen] = useState(false);
  const [isDeleteLinkModalOpen, setIsDeleteLinkModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ video: LibraryTopicVideo; allVideos: LibraryTopicVideo[] } | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<LibraryTopicVideo | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<LibraryTopicMaterial | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<LibraryTopicLink | null>(null);
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

  if (error || !topicMaterials) {
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

  if (!("topic" in topicMaterials) || !("content" in topicMaterials) || !("statistics" in topicMaterials)) {
    return (
      <div className="lg:col-span-2">
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">Invalid topic materials data</p>
        </div>
      </div>
    );
  }

  const { topic, content, statistics } = topicMaterials;

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold capitalize mb-2">{topic.title}</h3>
          {topic.description && (
            <p className="text-sm text-gray-600 capitalize mb-4">{topic.description}</p>
          )}
        </div>

        <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="videos">
                Videos ({statistics.totalVideos})
              </TabsTrigger>
              <TabsTrigger value="materials">
                Materials ({statistics.totalMaterials})
              </TabsTrigger>
              <TabsTrigger value="links">
                Links ({statistics.totalLinks})
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
            {canUpload && activeTab === "links" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLinkCreateModalOpen(true)}
                className="ml-4"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Add Link
              </Button>
            )}
          </div>

          <TabsContent value="videos" className="space-y-3 mt-4">
            {content.videos.length === 0 ? (
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
              content.videos.map((video: LibraryTopicVideo) => (
                <Card 
                  key={video.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/general-pages/play-video/${video.id}?topicId=${topicId}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {video.thumbnailUrl ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 group">
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <PlayCircle className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-32 h-20 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 group">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <PlayCircle className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg mb-1 truncate">{video.title}</h4>
                        {video.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatDuration(video.durationSeconds)}</span>
                          <span>{formatFileSize(video.sizeBytes)}</span>
                          <span>{video.views} views</span>
                        </div>
                      </div>
                      {canUpload && (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedVideo({ video, allVideos: content.videos });
                              setIsEditVideoModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setVideoToDelete(video);
                              setIsDeleteVideoModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-3 mt-4">
            {content.materials.length === 0 ? (
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
              content.materials.map((material) => (
                <Card 
                  key={material.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/library-owner/subjects/${subjectId}/materials/${material.id}?topicId=${topicId}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1 truncate">{material.title}</h4>
                          {material.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <Badge variant="outline">{material.materialType}</Badge>
                            <span>{formatFileSize(material.sizeBytes)}</span>
                            {material.pageCount > 0 && <span>{material.pageCount} pages</span>}
                          </div>
                        </div>
                      </div>
                      {canUpload && (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setMaterialToDelete(material);
                              setIsDeleteMaterialModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-3 mt-4">
            {content.links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No links available</p>
                {canUpload && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsLinkCreateModalOpen(true)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Add Your First Link
                  </Button>
                )}
              </div>
            ) : (
              content.links.map((link: LibraryTopicLink) => (
                <Card key={link.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <ExternalLink className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1 truncate">{link.title}</h4>
                          {link.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{link.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate max-w-xs"
                            >
                              {link.domain}
                            </a>
                            {link.linkType && <Badge variant="outline">{link.linkType}</Badge>}
                          </div>
                        </div>
                      </div>
                      {canUpload && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setLinkToDelete(link);
                              setIsDeleteLinkModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {topicId && (
          <>
            <VideoUploadModal
              isOpen={isUploadVideoModalOpen}
              onClose={() => setIsUploadVideoModalOpen(false)}
              topicId={topicId}
              subjectId={subjectId}
              topicTitle={topic.title}
            />
            <MaterialUploadModal
              isOpen={isUploadMaterialModalOpen}
              onClose={() => setIsUploadMaterialModalOpen(false)}
              topicId={topicId}
              subjectId={subjectId}
              topicTitle={topic.title}
            />
            <LinkCreateModal
              isOpen={isLinkCreateModalOpen}
              onClose={() => setIsLinkCreateModalOpen(false)}
              topicId={topicId}
              subjectId={subjectId}
              topicTitle={topic.title}
            />
            {selectedVideo && (
              <EditVideoModal
                isOpen={isEditVideoModalOpen}
                onClose={() => {
                  setIsEditVideoModalOpen(false);
                  setSelectedVideo(null);
                }}
                video={selectedVideo.video as unknown as import("@/hooks/topics/use-topic-materials").TopicVideo}
                allVideos={selectedVideo.allVideos as unknown as import("@/hooks/topics/use-topic-materials").TopicVideo[]}
              />
            )}
            {videoToDelete && (
              <DeleteVideoModal
                isOpen={isDeleteVideoModalOpen}
                onClose={() => {
                  setIsDeleteVideoModalOpen(false);
                  setVideoToDelete(null);
                }}
                video={videoToDelete as unknown as import("@/hooks/topics/use-topic-materials").TopicVideo}
              />
            )}
            {materialToDelete && (
              <DeleteMaterialModal
                isOpen={isDeleteMaterialModalOpen}
                onClose={() => {
                  setIsDeleteMaterialModalOpen(false);
                  setMaterialToDelete(null);
                }}
                material={materialToDelete as unknown as import("@/hooks/topics/use-topic-materials").TopicMaterial}
              />
            )}
            {linkToDelete && (
              <DeleteLinkModal
                isOpen={isDeleteLinkModalOpen}
                onClose={() => {
                  setIsDeleteLinkModalOpen(false);
                  setLinkToDelete(null);
                }}
                link={linkToDelete as unknown as import("@/hooks/topics/use-topic-materials").TopicLink}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
