"use client";

import React from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  FileText,
  ClipboardList,
  FileCheck,
  Calendar,
  Clock,
  Download,
  Eye,
  PlayCircle,
  Loader2,
  ArrowLeft,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { useTopicContent } from "@/hooks/subjects/use-topic-content";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import Image from "next/image";
import Link from "next/link";

const TopicContentPage = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const topicId = params.topicId as string;
  const subjectId = params.id as string;

  const { data: topicData, isLoading, error } = useTopicContent(topicId);

  // Determine base path for navigation
  const getBasePath = () => {
    if (pathname.startsWith("/teacher")) return "/teacher";
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname.startsWith("/student")) return "/student";
    return "/general-pages";
  };

  const basePath = getBasePath();

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading topic content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !topicData) {
    let errorMessage = "Failed to load topic content";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 404) {
        errorMessage = "Topic content not found";
      } else {
        errorMessage = error.message;
      }
    }

    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const { contentSummary } = topicData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (size: string | null) => {
    return size || "0 MB";
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`${basePath}/subjects/${subjectId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline">Topic {topicData.topicOrder}</Badge>
            <h1 className="text-2xl font-bold text-brand-heading capitalize">
              {topicData.topicTitle}
            </h1>
          </div>
          {topicData.topicDescription && (
            <p className="text-sm text-brand-light-accent-1 mt-1 capitalize">
              {topicData.topicDescription}
            </p>
          )}
        </div>
      </div>

      {/* Content Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-purple-100 rounded-lg inline-block mb-2">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">{contentSummary.totalVideos}</p>
              <p className="text-xs text-gray-600">Videos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-green-100 rounded-lg inline-block mb-2">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{contentSummary.totalMaterials}</p>
              <p className="text-xs text-gray-600">Materials</p>
            </div>
          </CardContent>
        </Card>

        {contentSummary.totalAssignments > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-orange-100 rounded-lg inline-block mb-2">
                  <ClipboardList className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold">{contentSummary.totalAssignments}</p>
                <p className="text-xs text-gray-600">Assignments</p>
              </div>
            </CardContent>
          </Card>
        )}

        {contentSummary.totalQuizzes > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-red-100 rounded-lg inline-block mb-2">
                  <FileCheck className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold">{contentSummary.totalQuizzes}</p>
                <p className="text-xs text-gray-600">Quizzes</p>
              </div>
            </CardContent>
          </Card>
        )}

        {contentSummary.totalLiveClasses > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-blue-100 rounded-lg inline-block mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{contentSummary.totalLiveClasses}</p>
                <p className="text-xs text-gray-600">Live Classes</p>
              </div>
            </CardContent>
          </Card>
        )}

        {contentSummary.totalLibraryResources > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-indigo-100 rounded-lg inline-block mb-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold">{contentSummary.totalLibraryResources}</p>
                <p className="text-xs text-gray-600">Resources</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-gray-100 rounded-lg inline-block mb-2">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold">{contentSummary.totalContent}</p>
              <p className="text-xs text-gray-600">Total Items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="videos">
                Videos ({topicData.videos.length})
              </TabsTrigger>
              <TabsTrigger value="materials">
                Materials ({topicData.materials.length})
              </TabsTrigger>
              {topicData.assignments && topicData.assignments.length > 0 && (
                <TabsTrigger value="assignments">
                  Assignments ({topicData.assignments.length})
                </TabsTrigger>
              )}
              {topicData.assessments && topicData.assessments.length > 0 && (
                <TabsTrigger value="quizzes">
                  Quizzes ({topicData.assessments.length})
                </TabsTrigger>
              )}
              {topicData.liveClasses && topicData.liveClasses.length > 0 && (
                <TabsTrigger value="live">
                  Live Classes ({topicData.liveClasses.length})
                </TabsTrigger>
              )}
              {topicData.libraryResources && topicData.libraryResources.length > 0 && (
                <TabsTrigger value="library">
                  Library ({topicData.libraryResources.length})
                </TabsTrigger>
              )}
            </TabsList>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-4 mt-6">
              {topicData.videos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No videos available</p>
                </div>
              ) : (
                topicData.videos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative w-40 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {video.thumbnail?.secure_url ? (
                            <Image
                              src={video.thumbnail.secure_url}
                              alt={video.title}
                              fill
                              sizes="160px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer">
                            <PlayCircle className="h-10 w-10 text-white" />
                          </div>
                          {video.duration && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg capitalize mb-1">
                                {video.title}
                              </h3>
                              {video.description && (
                                <p className="text-sm text-gray-600 mb-3 capitalize">
                                  {video.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {video.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {video.duration}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {video.views} views
                                </span>
                                <span>{formatFileSize(video.size)}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                const basePath = pathname.startsWith("/teacher")
                                  ? "/teacher"
                                  : pathname.startsWith("/admin")
                                  ? "/admin"
                                  : pathname.startsWith("/student")
                                  ? "/student"
                                  : "/general-pages";
                                router.push(`${basePath}/play-video/${video.id}`);
                              }}
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Watch
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-4 mt-6">
              {topicData.materials.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No materials available</p>
                </div>
              ) : (
                topicData.materials.map((material) => (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold capitalize">{material.title}</h3>
                            {material.description && (
                              <p className="text-sm text-gray-600 capitalize">
                                {material.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                              <span>Size: {formatFileSize(material.size)}</span>
                              <span>Downloads: {material.downloads}</span>
                              <span>Added {formatDate(material.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`${basePath}/subjects/${subjectId}/materials/${material.id}?topicId=${topicId}`}>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Assignments Tab */}
            {topicData.assignments && topicData.assignments.length > 0 && (
              <TabsContent value="assignments" className="space-y-4 mt-6">
                {topicData.assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No assignments available</p>
                  </div>
                ) : (
                  topicData.assignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                              <ClipboardList className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">{assignment.title}</h3>
                              {assignment.description && (
                                <p className="text-sm text-gray-600 capitalize">
                                  {assignment.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                {assignment.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Due: {formatDate(assignment.dueDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button size="sm">View Assignment</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            )}

            {/* Quizzes Tab */}
            {topicData.assessments && topicData.assessments.length > 0 && (
              <TabsContent value="quizzes" className="space-y-4 mt-6">
                {topicData.assessments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No quizzes available</p>
                  </div>
                ) : (
                  topicData.assessments.map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                              <FileCheck className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">{quiz.title}</h3>
                              {quiz.description && (
                                <p className="text-sm text-gray-600 capitalize">
                                  {quiz.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                {quiz.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {quiz.duration} minutes
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button size="sm">Start Quiz</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            )}

            {/* Live Classes Tab */}
            {topicData.liveClasses && topicData.liveClasses.length > 0 && (
              <TabsContent value="live" className="space-y-4 mt-6">
                {topicData.liveClasses.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No live classes scheduled</p>
                  </div>
                ) : (
                  topicData.liveClasses.map((liveClass) => (
                    <Card key={liveClass.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">{liveClass.title}</h3>
                              {liveClass.description && (
                                <p className="text-sm text-gray-600 capitalize">
                                  {liveClass.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(liveClass.startTime)} - {formatDate(liveClass.endTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <a href={liveClass.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Join
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            )}

            {/* Library Resources Tab */}
            {topicData.libraryResources && topicData.libraryResources.length > 0 && (
              <TabsContent value="library" className="space-y-4 mt-6">
                {topicData.libraryResources.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No library resources available</p>
                  </div>
                ) : (
                  topicData.libraryResources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                              <BookOpen className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">{resource.title}</h3>
                              {resource.description && (
                                <p className="text-sm text-gray-600 capitalize">
                                  {resource.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                <Badge variant="outline" className="capitalize">
                                  {resource.resourceType}
                                </Badge>
                                <span>Added {formatDate(resource.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          {resource.url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicContentPage;

