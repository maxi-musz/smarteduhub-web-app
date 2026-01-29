"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, PlayCircle, FileCheck, History, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
// import { useExploreTopicDetails } from "@/hooks/explore/use-explore"; // Ready for when backend supports it

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
      submissionsCount: number;
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

  // Track active tab - moved to top level to comply with Rules of Hooks
  const [activeTab, setActiveTab] = useState("videos");

  // Find selected topic
  const selectedTopic = topicId ? topics.find((t) => t.id === topicId) : null;

  // Map submissions to assessments for display - moved to top level to comply with Rules of Hooks
  const topicSubmissions = useMemo(() => {
    if (!selectedTopic?.submissions || !Array.isArray(selectedTopic.submissions)) return [];
    if (!selectedTopic?.assessments) return [];
    return selectedTopic.submissions.map((submission) => {
      // Debug: Log submission to check if id exists
      if (process.env.NODE_ENV === 'development') {
        console.log('Submission object:', submission);
      }
      const assessment = selectedTopic.assessments.find((a) => a.id === submission.assessmentId);
      return {
        ...submission,
        assessment,
      };
    }).filter((sub) => sub.assessment); // Only include submissions with matching assessments
  }, [selectedTopic?.submissions, selectedTopic?.assessments]);

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

        <Tabs defaultValue="videos" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl mb-4">
            <TabsTrigger value="videos">
              Videos ({statistics.videosCount})
            </TabsTrigger>
            <TabsTrigger value="materials">
              Materials ({statistics.materialsCount})
            </TabsTrigger>
            <TabsTrigger value="assessments">
              Assessments ({statistics.assessmentsCount})
            </TabsTrigger>
            <TabsTrigger value="attempts">
              Submissions ({statistics.submissionsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-3 mt-4">
            {videos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No videos available</p>
              </div>
            ) : (
              videos.map((video: typeof videos[0]) => (
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
              materials.map((material: typeof materials[0]) => (
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
              assessments.map((assessment: typeof assessments[0]) => {
                const submission = selectedTopic.submissions.find(
                  (s: typeof selectedTopic.submissions[0]) => s.assessmentId === assessment.id
                );
                return (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                            <FileCheck className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg mb-1 truncate">{assessment.title}</h4>
                            {assessment.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{assessment.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <span>{assessment.duration} min</span>
                              <span>{assessment.questionsCount} questions</span>
                              <span>Pass: {assessment.passingScore}%</span>
                              {submission && (
                                <Badge variant={submission.passed ? "default" : "destructive"}>
                                  {typeof submission.percentage === 'number' ? submission.percentage.toFixed(1) : submission.percentage}% - {submission.passed ? "Passed" : "Failed"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => router.push(`/explore/assessments/${assessment.id}`)}
                          className="flex-shrink-0"
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          {submission ? "Retry" : "Take assessment"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="attempts" className="space-y-3 mt-4">
            {topicSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No submissions found for assessments in this topic</p>
                <p className="text-sm text-gray-400">Complete an assessment to see your submissions here</p>
              </div>
            ) : (
              topicSubmissions.map((submission) => {
                const assessment = submission.assessment;
                if (!assessment) return null;

                // Ensure we have a valid submission ID
                if (!submission.id) {
                  console.error("Submission missing ID:", submission);
                  return null;
                }

                return (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`p-3 rounded-lg flex-shrink-0 ${
                            submission.passed ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {submission.passed ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-lg truncate">{assessment.title}</h4>
                            </div>
                            {assessment.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{assessment.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Percentage:</span>
                                <span className={`font-semibold ${
                                  submission.passed ? "text-green-600" : "text-red-600"
                                }`}>
                                  {typeof submission.percentage === 'number' ? submission.percentage.toFixed(1) : submission.percentage}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Passing Score:</span>
                                <span className="font-semibold text-brand-heading">
                                  {assessment.passingScore}%
                                </span>
                              </div>
                              <Badge variant={submission.passed ? "default" : "destructive"} className="text-xs">
                                {submission.passed ? "Passed" : "Failed"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const attemptId = submission.id;
                            if (!attemptId) {
                              console.error("Submission ID is missing:", submission);
                              alert("Unable to view details: Submission ID is missing");
                              return;
                            }
                            router.push(`/explore/assessments/attempts/${attemptId}`);
                          }}
                          className="flex-shrink-0"
                        >
                          <FileCheck className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
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
