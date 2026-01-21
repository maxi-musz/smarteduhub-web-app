"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ExploreTopicContentProps {
  topicId: string | null;
  subjectId: string;
  topics: Array<{
    id: string;
    title: string;
    description: string | null;
    order: number;
    is_active: boolean;
    videos: Array<{
      id: string;
      title: string;
      description: string | null;
      videoUrl: string;
      thumbnailUrl: string | null;
      durationSeconds: number | null;
      sizeBytes: number | null;
      views: number;
      order: number;
      status: string;
      createdAt: string;
      updatedAt: string;
      uploadedBy?: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
      };
    }>;
    materials: Array<{
      id: string;
      title: string;
      description: string | null;
      url: string;
      s3Key: string | null;
      materialType: string;
      sizeBytes: number | null;
      pageCount: number | null;
      status: string;
      order: number;
      createdAt: string;
      updatedAt: string;
      uploadedBy: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
      };
    }>;
    assessments: Array<{
      id: string;
      title: string;
      description: string | null;
      duration: number;
      passingScore: number;
      status: string;
      questionsCount: number;
      createdAt: string;
      updatedAt: string;
    }>;
    submissions: Array<{
      id: string;
      assessmentId: string;
      assessmentTitle: string;
      attemptNumber: number;
      status: string;
      dateTaken: string;
      totalQuestions: number;
      maxScore: number;
      userScore: number;
      percentage: number;
      passed: boolean;
      timeSpent: number;
      passingScore: number;
    }>;
    statistics: {
      videosCount: number;
      materialsCount: number;
      assessmentsCount: number;
      totalViews: number;
      totalDuration: number;
      totalVideoSize: number;
      totalMaterialSize: number;
      totalSize: number;
      totalQuestions: number;
    };
  }>;
}

export const ExploreTopicContent = ({ topicId, subjectId, topics }: ExploreTopicContentProps) => {
  const router = useRouter();

  const handleMaterialClick = (materialId: string) => {
    router.push(`/explore/subjects/${subjectId}/materials/${materialId}?topicId=${topicId}`);
  };

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

  const selectedTopic = topics.find((t) => t.id === topicId);

  if (!selectedTopic) {
    return (
      <div className="lg:col-span-2">
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">Topic not found</p>
          <p className="text-sm text-gray-500">Please try selecting the topic again</p>
        </div>
      </div>
    );
  }

  const { title, description, videos, materials, assessments, statistics } = selectedTopic;

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold capitalize mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 capitalize mb-4">{description}</p>
          )}
        </div>

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-4">
            <TabsTrigger value="videos">
              Videos ({statistics.videosCount})
            </TabsTrigger>
            <TabsTrigger value="materials">
              Materials ({statistics.materialsCount})
            </TabsTrigger>
            <TabsTrigger value="assessments">
              Assessments ({statistics.assessmentsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-3 mt-4">
            {videos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No videos available</p>
              </div>
            ) : (
              videos.map((video) => (
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
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-3 mt-4">
            {materials.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No materials available</p>
              </div>
            ) : (
              materials.map((material) => (
                <Card 
                  key={material.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMaterialClick(material.id)}
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
                            {material.pageCount && material.pageCount > 0 && (
                              <span>{material.pageCount} pages</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="assessments" className="space-y-3 mt-4">
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No assessments available</p>
              </div>
            ) : (
              assessments.map((assessment) => {
                const submission = selectedTopic.submissions.find(
                  (s) => s.assessmentId === assessment.id
                );
                return (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <FileText className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg mb-1 truncate">{assessment.title}</h4>
                            {assessment.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{assessment.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{assessment.duration} min</span>
                              <span>{assessment.questionsCount} questions</span>
                              <span>Pass: {assessment.passingScore}%</span>
                              {submission && (
                                <Badge variant={submission.passed ? "default" : "destructive"}>
                                  {submission.percentage}% - {submission.passed ? "Passed" : "Failed"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
