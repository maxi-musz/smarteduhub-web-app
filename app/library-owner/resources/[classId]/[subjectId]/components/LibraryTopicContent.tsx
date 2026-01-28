"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Upload, ExternalLink, Trash2, Pencil, FileText, PlayCircle, ClipboardList, Clock, Users, Plus } from "lucide-react";
import { useLibraryTopicMaterials } from "@/hooks/library-owner/use-library-topic-materials";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import { VideoUploadModal } from "./VideoUploadModal";
import { MaterialUploadModal } from "./MaterialUploadModal";
import { LinkCreateModal } from "./LinkCreateModal";
import { EditVideoModal } from "./EditVideoModal";
import { DeleteVideoModal } from "./DeleteVideoModal";
import { DeleteMaterialModal } from "./DeleteMaterialModal";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { CreateCBTDialog } from "@/app/library-owner/resources/assessment/components/CreateCBTDialog";
import { EditCBTDialog } from "@/app/library-owner/resources/assessment/components/EditCBTDialog";
import { DeleteCBTDialog } from "@/app/library-owner/resources/assessment/components/DeleteCBTDialog";
import { ManageQuestionsDialog } from "@/app/library-owner/resources/assessment/components/ManageQuestionsDialog";
import { usePublishCBT, useUnpublishCBT } from "@/hooks/assessment/use-cbt";
import { CBT } from "@/hooks/assessment/use-cbt-types";
import { 
  LibraryTopicVideo, 
  LibraryTopicMaterial, 
  LibraryTopicLink,
  LibraryTopicCbt,
} from "@/hooks/library-owner/use-library-topic-materials";

interface LibraryTopicContentProps {
  topicId: string | null;
  subjectId: string;
  canUpload?: boolean;
}

export const LibraryTopicContent = ({ topicId, subjectId, canUpload = true }: LibraryTopicContentProps) => {
  const router = useRouter();
  const { data: topicMaterials, isLoading, error, refetch: refetchTopicMaterials } = useLibraryTopicMaterials(topicId);
  const publishCBT = usePublishCBT();
  const unpublishCBT = useUnpublishCBT();
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [isUploadMaterialModalOpen, setIsUploadMaterialModalOpen] = useState(false);
  const [isLinkCreateModalOpen, setIsLinkCreateModalOpen] = useState(false);
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false);
  const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false);
  const [isDeleteMaterialModalOpen, setIsDeleteMaterialModalOpen] = useState(false);
  const [isDeleteLinkModalOpen, setIsDeleteLinkModalOpen] = useState(false);
  const [isCreateCBTOpen, setIsCreateCBTOpen] = useState(false);
  const [isEditCBTOpen, setIsEditCBTOpen] = useState(false);
  const [isDeleteCBTOpen, setIsDeleteCBTOpen] = useState(false);
  const [isManageQuestionsOpen, setIsManageQuestionsOpen] = useState(false);
  const [selectedCBT, setSelectedCBT] = useState<LibraryTopicCbt | null>(null);
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
          <p className="text-gray-600">[Library 2] - Select a topic to view its content</p>
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

  const formatDurationMinutes = (minutes: number | null | undefined): string => {
    if (minutes == null || minutes < 0) return "—";
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    return `${mins}m`;
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const cbts = content.cbts ?? [];
  const totalCbts = statistics.totalCbts ?? cbts.length;

  const toCbtForDialog = (c: LibraryTopicCbt): CBT =>
    ({ ...c, _count: c._count ?? { questions: 0, attempts: 0 } }) as CBT;

  const handlePublishCBT = async (cbt: LibraryTopicCbt) => {
    try {
      await publishCBT.mutateAsync(cbt.id);
      refetchTopicMaterials();
    } catch {
      // Error handled by hook (toast)
    }
  };

  const handleUnpublishCBT = async (cbt: LibraryTopicCbt) => {
    try {
      await unpublishCBT.mutateAsync(cbt.id);
      refetchTopicMaterials();
    } catch {
      // Error handled by hook (toast)
    }
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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <TabsList className="grid w-full min-w-0 grid-cols-2 sm:grid-cols-4 flex-1 gap-px">
              <TabsTrigger value="videos">
                Videos ({statistics.totalVideos})
              </TabsTrigger>
              <TabsTrigger value="materials">
                Materials ({statistics.totalMaterials})
              </TabsTrigger>
              <TabsTrigger value="cbts" data-tab="cbts">
                CBTs ({totalCbts})
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
                className="shrink-0"
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
                className="shrink-0"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload Material
              </Button>
            )}
            {canUpload && activeTab === "cbts" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCreateCBTOpen(true)}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add assessment
              </Button>
            )}
            {/* Link attachment feature coming soon - button removed */}
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

          <TabsContent value="cbts" className="space-y-3 mt-4">
            {cbts.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No assessments yet for this topic</p>
                {canUpload && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCreateCBTOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add assessment
                  </Button>
                )}
              </div>
            ) : (
              cbts.map((cbt) => (
                <Card
                  key={cbt.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-amber-100 rounded-lg flex-shrink-0">
                          <ClipboardList className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1 truncate">{cbt.title}</h4>
                          {cbt.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{cbt.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <Badge variant={cbt.isPublished ? "default" : "outline"} className="text-xs">
                              {cbt.isPublished ? "Published" : "Draft"}
                            </Badge>
                            {cbt.isResultReleased && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                Results released
                              </Badge>
                            )}
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {(cbt._count?.questions ?? 0)} questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDurationMinutes(cbt.duration ?? cbt.timeLimit)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {(cbt._count?.attempts ?? 0)} attempts
                            </span>
                            {typeof cbt.totalPoints === "number" && (
                              <span>{cbt.totalPoints} pts</span>
                            )}
                          </div>
                          {cbt.startDate && cbt.endDate && (
                            <p className="text-xs text-gray-500 mt-2">
                              Available: {formatDate(cbt.startDate)} – {formatDate(cbt.endDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      {canUpload && (
                        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCBT(cbt);
                              setIsManageQuestionsOpen(true);
                            }}
                            title="Manage questions"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`publish-cbt-${cbt.id}`}
                              checked={!!cbt.isPublished}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const qCount = cbt._count?.questions ?? 0;
                                  if (qCount < 2) {
                                    toast.error("Assessment must have at least 2 questions before publishing");
                                    return;
                                  }
                                  handlePublishCBT(cbt);
                                } else {
                                  handleUnpublishCBT(cbt);
                                }
                              }}
                              disabled={
                                publishCBT.isPending ||
                                unpublishCBT.isPending ||
                                ((cbt._count?.questions ?? 0) < 2 && !cbt.isPublished)
                              }
                            />
                            <Label
                              htmlFor={`publish-cbt-${cbt.id}`}
                              className="text-xs cursor-pointer whitespace-nowrap"
                              title={
                                (cbt._count?.questions ?? 0) < 2 && !cbt.isPublished
                                  ? "Add at least 2 questions to publish"
                                  : cbt.isPublished
                                    ? "Click to unpublish"
                                    : "Click to publish"
                              }
                            >
                              {cbt.isPublished ? "Published" : "Draft"}
                            </Label>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCBT(cbt);
                              setIsEditCBTOpen(true);
                            }}
                            title="Edit assessment"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCBT(cbt);
                              setIsDeleteCBTOpen(true);
                            }}
                            disabled={(cbt._count?.attempts ?? 0) > 0}
                            title={(cbt._count?.attempts ?? 0) > 0 ? "Cannot delete with attempts" : "Delete assessment"}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
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
            <div className="text-center py-12">
              <ExternalLink className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">Link Attachment Coming Soon</p>
              <p className="text-sm text-gray-500">This feature is currently under development</p>
            </div>
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

            <CreateCBTDialog
              isOpen={isCreateCBTOpen}
              onClose={() => setIsCreateCBTOpen(false)}
              subjectId={subjectId}
              topicId={topicId ?? undefined}
              onSuccess={() => {
                setIsCreateCBTOpen(false);
                refetchTopicMaterials();
              }}
            />

            {selectedCBT && (
              <>
                <EditCBTDialog
                  isOpen={isEditCBTOpen}
                  onClose={() => {
                    setIsEditCBTOpen(false);
                    setSelectedCBT(null);
                  }}
                  cbt={toCbtForDialog(selectedCBT)}
                  onSuccess={() => {
                    setIsEditCBTOpen(false);
                    setSelectedCBT(null);
                    refetchTopicMaterials();
                  }}
                />
                <DeleteCBTDialog
                  isOpen={isDeleteCBTOpen}
                  onClose={() => {
                    setIsDeleteCBTOpen(false);
                    setSelectedCBT(null);
                  }}
                  cbt={toCbtForDialog(selectedCBT)}
                  onSuccess={() => {
                    setIsDeleteCBTOpen(false);
                    setSelectedCBT(null);
                    refetchTopicMaterials();
                  }}
                />
                <ManageQuestionsDialog
                  isOpen={isManageQuestionsOpen}
                  onClose={() => {
                    setIsManageQuestionsOpen(false);
                    setSelectedCBT(null);
                    refetchTopicMaterials();
                  }}
                  cbt={toCbtForDialog(selectedCBT)}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
