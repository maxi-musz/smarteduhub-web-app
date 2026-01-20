"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLibraryClassResources } from "@/hooks/library-owner/use-library-class-resources";
import { Subject, Chapter, Topic } from "@/hooks/library-owner/use-library-class-resources";
import { TopicVideo, TopicMaterial, TopicLink } from "@/hooks/topics/use-topic-materials";
import { EnhancedChapterCard } from "./components/EnhancedChapterCard";
import { CreateChapterModal } from "./components/CreateChapterModal";
import { EditChapterModal } from "./components/EditChapterModal";
import { CreateTopicModal } from "./components/CreateTopicModal";
import { EditTopicModal } from "./components/EditTopicModal";
import { VideoUploadModal } from "./components/VideoUploadModal";
import { MaterialUploadModal } from "./components/MaterialUploadModal";
import { LinkCreateModal } from "./components/LinkCreateModal";
import { EditVideoModal } from "./components/EditVideoModal";
import { DeleteVideoModal } from "./components/DeleteVideoModal";
import { DeleteMaterialModal } from "./components/DeleteMaterialModal";
import { DeleteLinkModal } from "./components/DeleteLinkModal";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Layers,
  Video,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SubjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  const subjectId = params.subjectId as string;

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isCreateChapterModalOpen, setIsCreateChapterModalOpen] =
    useState(false);
  const [isEditChapterModalOpen, setIsEditChapterModalOpen] = useState(false);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [chapterForTopic, setChapterForTopic] = useState<string | null>(null);
  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] = useState(false);
  const [isMaterialUploadModalOpen, setIsMaterialUploadModalOpen] = useState(false);
  const [isLinkCreateModalOpen, setIsLinkCreateModalOpen] = useState(false);
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false);
  const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false);
  const [isDeleteMaterialModalOpen, setIsDeleteMaterialModalOpen] = useState(false);
  const [isDeleteLinkModalOpen, setIsDeleteLinkModalOpen] = useState(false);
  const [selectedTopicForContent, setSelectedTopicForContent] = useState<Topic | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ video: TopicVideo; allVideos: TopicVideo[] } | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<TopicVideo | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<TopicMaterial | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<TopicLink | null>(null);

  // Fetch class resources data
  const {
    data: classResourcesData,
    isLoading: isClassResourcesLoading,
    error: classResourcesError,
    refetch: refetchClassResources,
  } = useLibraryClassResources(classId);

  // Find the current subject
  const subject: Subject | undefined = classResourcesData?.subjects.find(
    (s) => s.id === subjectId
  );

  // Log when component mounts
  useEffect(() => {
    logger.info("[Subject Detail Page] Component mounted/rendered", {
      classId,
      subjectId,
      timestamp: new Date().toISOString(),
    });
  }, [classId, subjectId]);

  // Show skeleton loader while loading
  if (isClassResourcesLoading) {
    return (
      <div className="pt-4 pb-6 space-y-6 bg-brand-bg">
        <div className="pl-0 pr-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="pl-0 pr-6">
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Show error modal if there's an error
  if (classResourcesError) {
    let errorMessage =
      "An unexpected error occurred while loading subject details.";

    if (classResourcesError instanceof AuthenticatedApiError) {
      if (classResourcesError.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (classResourcesError.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (classResourcesError.statusCode === 404) {
        errorMessage =
          "The requested subject was not found. Please check your connection.";
      } else {
        const rawMessage = classResourcesError.message || "";
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
        <div className="pl-0 pr-6">
          <Dialog open={true}>
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
                      refetchClassResources();
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

  // Show not found if subject doesn't exist
  if (!subject) {
    return (
      <div className="pt-4 pb-6 space-y-6 bg-brand-bg">
        <div className="pl-0 pr-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="pl-0 pr-6 text-center py-12">
          <AlertCircle className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-4" />
          <p className="text-brand-light-accent-1">
            Subject not found
          </p>
        </div>
      </div>
    );
  }

  // Sort chapters by order
  const sortedChapters = [...(subject.chapters || [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="pt-4 pb-6 space-y-6 bg-brand-bg min-h-screen">
      {/* Back Button */}
      <div className="pl-0 pr-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Class Resources
        </Button>
      </div>

      {/* Subject Header */}
      <div className="pl-0 pr-6">
        <Card className="shadow-sm bg-white border border-brand-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {subject.thumbnailUrl ? (
                <div className="relative w-24 h-32 sm:w-32 sm:h-40 rounded-lg overflow-hidden border-2 border-brand-border flex-shrink-0 shadow-md bg-gray-100">
                  <Image
                    src={subject.thumbnailUrl}
                    alt={subject.name}
                    fill
                    className="object-contain"
                    unoptimized={subject.thumbnailUrl.includes("s3.amazonaws.com")}
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>
              ) : (
                <div
                  className="w-24 h-32 sm:w-32 sm:h-40 rounded-lg flex-shrink-0 flex flex-col items-center justify-center text-white font-semibold shadow-md border-2 border-brand-border"
                  style={{ backgroundColor: subject.color }}
                >
                  <span className="text-base sm:text-lg font-bold leading-tight text-center px-2">
                    {subject.code ||
                      subject.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-heading mb-2">
                  {subject.name}
                </h1>
                <p className="text-sm sm:text-base text-brand-light-accent-1 mb-4">
                  {subject.code} • {subject.description || "No description"}
                </p>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-brand-primary" />
                    <span className="text-brand-light-accent-1">
                      <span className="font-semibold text-brand-heading">
                        {subject.chaptersCount}
                      </span>{" "}
                      Chapters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand-primary" />
                    <span className="text-brand-light-accent-1">
                      <span className="font-semibold text-brand-heading">
                        {subject.topicsCount}
                      </span>{" "}
                      Topics
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-brand-primary" />
                    <span className="text-brand-light-accent-1">
                      <span className="font-semibold text-brand-heading">
                        {subject.totalVideos}
                      </span>{" "}
                      Videos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-primary" />
                    <span className="text-brand-light-accent-1">
                      <span className="font-semibold text-brand-heading">
                        {subject.totalMaterials}
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

      {/* Chapters Section */}
      <div className="pl-0 pr-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-brand-heading">
              Chapters
            </h2>
            <p className="text-sm text-brand-light-accent-1 mt-1">
              Manage chapters and their topics for this subject
            </p>
          </div>
          <Button
            onClick={() => setIsCreateChapterModalOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create Chapter
          </Button>
        </div>

        {sortedChapters.length > 0 ? (
          <div className="space-y-4">
            {sortedChapters.map((chapter) => (
              <EnhancedChapterCard
                key={chapter.id}
                chapter={chapter}
                subjectId={subjectId}
                onEdit={(chapter) => {
                  setSelectedChapter(chapter);
                  setIsEditChapterModalOpen(true);
                }}
                onCreateTopic={(chapterId) => {
                  setChapterForTopic(chapterId);
                  setIsCreateTopicModalOpen(true);
                }}
                onEditTopic={(topic) => {
                  setSelectedTopic(topic);
                  setIsEditTopicModalOpen(true);
                }}
                onEditVideo={(video, allVideos) => {
                  setSelectedVideo({ video, allVideos });
                  setIsEditVideoModalOpen(true);
                }}
                onDeleteVideo={(video) => {
                  setVideoToDelete(video);
                  setIsDeleteVideoModalOpen(true);
                }}
                onDeleteMaterial={(material) => {
                  setMaterialToDelete(material);
                  setIsDeleteMaterialModalOpen(true);
                }}
                onDeleteLink={(link) => {
                  setLinkToDelete(link);
                  setIsDeleteLinkModalOpen(true);
                }}
                onUploadVideo={(topic) => {
                  setSelectedTopicForContent(topic);
                  setIsVideoUploadModalOpen(true);
                }}
                onUploadMaterial={(topic) => {
                  setSelectedTopicForContent(topic);
                  setIsMaterialUploadModalOpen(true);
                }}
                onCreateLink={(topic) => {
                  setSelectedTopicForContent(topic);
                  setIsLinkCreateModalOpen(true);
                }}
                onCreateAssessment={(topic) => {
                  // Navigate to assessment page with subject and topic pre-selected
                  router.push(`/library-owner/resources/assessment?subjectId=${subjectId}&topicId=${topic.id}`);
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="shadow-sm bg-white border border-brand-border">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-4" />
              <p className="text-brand-light-accent-1 mb-4">
                No chapters yet. Create your first chapter to get started.
              </p>
              <Button
                onClick={() => setIsCreateChapterModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Chapter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <CreateChapterModal
        isOpen={isCreateChapterModalOpen}
        onClose={() => setIsCreateChapterModalOpen(false)}
        subjectId={subjectId}
      />

      <EditChapterModal
        isOpen={isEditChapterModalOpen}
        onClose={() => {
          setIsEditChapterModalOpen(false);
          setSelectedChapter(null);
        }}
        chapter={selectedChapter}
        allChapters={sortedChapters}
      />

      {chapterForTopic && (
        <CreateTopicModal
          isOpen={isCreateTopicModalOpen}
          onClose={() => {
            setIsCreateTopicModalOpen(false);
            setChapterForTopic(null);
          }}
          chapterId={chapterForTopic}
          subjectId={subjectId}
        />
      )}

      <EditTopicModal
        isOpen={isEditTopicModalOpen}
        onClose={() => {
          setIsEditTopicModalOpen(false);
          setSelectedTopic(null);
        }}
        topic={selectedTopic}
        allTopics={
          selectedTopic
            ? sortedChapters.find((c) =>
                c.topics.some((t) => t.id === selectedTopic.id)
              )?.topics || []
            : []
        }
      />

      {/* Content Upload Modals */}
      {selectedTopicForContent && (
        <>
          <VideoUploadModal
            isOpen={isVideoUploadModalOpen}
            onClose={() => {
              setIsVideoUploadModalOpen(false);
              setSelectedTopicForContent(null);
            }}
            topicId={selectedTopicForContent.id}
            subjectId={subjectId}
            topicTitle={selectedTopicForContent.title}
          />

          <MaterialUploadModal
            isOpen={isMaterialUploadModalOpen}
            onClose={() => {
              setIsMaterialUploadModalOpen(false);
              setSelectedTopicForContent(null);
            }}
            topicId={selectedTopicForContent.id}
            subjectId={subjectId}
            topicTitle={selectedTopicForContent.title}
          />

          <LinkCreateModal
            isOpen={isLinkCreateModalOpen}
            onClose={() => {
              setIsLinkCreateModalOpen(false);
              setSelectedTopicForContent(null);
            }}
            topicId={selectedTopicForContent.id}
            subjectId={subjectId}
            chapterId={
              sortedChapters.find((c) =>
                c.topics.some((t) => t.id === selectedTopicForContent.id)
              )?.id
            }
            topicTitle={selectedTopicForContent.title}
          />
        </>
      )}

      {/* Edit Video Modal */}
      {selectedVideo && (
        <EditVideoModal
          isOpen={isEditVideoModalOpen}
          onClose={() => {
            setIsEditVideoModalOpen(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo.video}
          allVideos={selectedVideo.allVideos}
        />
      )}

      {/* Delete Video Modal */}
      {videoToDelete && (
        <DeleteVideoModal
          isOpen={isDeleteVideoModalOpen}
          onClose={() => {
            setIsDeleteVideoModalOpen(false);
            setVideoToDelete(null);
          }}
          video={videoToDelete}
        />
      )}

      {/* Delete Material Modal */}
      {materialToDelete && (
        <DeleteMaterialModal
          isOpen={isDeleteMaterialModalOpen}
          onClose={() => {
            setIsDeleteMaterialModalOpen(false);
            setMaterialToDelete(null);
          }}
          material={materialToDelete}
        />
      )}

      {/* Delete Link Modal */}
      {linkToDelete && (
        <DeleteLinkModal
          isOpen={isDeleteLinkModalOpen}
          onClose={() => {
            setIsDeleteLinkModalOpen(false);
            setLinkToDelete(null);
          }}
          link={linkToDelete}
        />
      )}
    </div>
  );
};

export default SubjectDetailPage;

