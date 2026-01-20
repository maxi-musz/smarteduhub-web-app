"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  FileText,
  Video,
  ClipboardList,
  Download,
  Eye,
  Clock,
  Calendar,
  Loader2,
  ArrowLeft,
  PlayCircle,
  FileCheck,
} from "lucide-react";
import { useStudentSubjectDetail, type StudentSubjectDetailData, type Topic, type Video as VideoType, type Material, type Assignment, type Assessment } from "@/hooks/student/use-student-subject-detail";
import Link from "next/link";
import Image from "next/image";

const StudentSubjectDetailPage = () => {
  const params = useParams();
  const subjectId = params.id as string;
  const page = 1;
  const limit = 20;

  const { data: subjectData, isLoading, error } = useStudentSubjectDetail({
    subjectId,
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading subject details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subjectData) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load subject details</p>
            {error && (
              <p className="text-sm text-gray-600 mb-4">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            )}
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const { subject, topics, stats } = subjectData as StudentSubjectDetailData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/student/subjects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-12 rounded"
              style={{ backgroundColor: subject.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-brand-heading capitalize">
                {subject.name}
              </h1>
              <p className="text-sm text-brand-light-accent-1">
                {subject.code} • {subject.academicSession.academic_year} •{" "}
                {subject.academicSession.term} Term
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {subject.description && (
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-700 capitalize">{subject.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Book className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Topics</p>
                <p className="text-xl font-bold">{stats.totalTopics}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Videos</p>
                <p className="text-xl font-bold">{stats.totalVideos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Materials</p>
                <p className="text-xl font-bold">{stats.totalMaterials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-xl font-bold">{stats.totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileCheck className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes</p>
                <p className="text-xl font-bold">{stats.totalQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics */}
      {topics.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No topics available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {topics.map((topic: Topic, index: number) => (
            <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="h-1"
                style={{ backgroundColor: subject.color }}
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm">
                      Topic {index + 1}
                    </Badge>
                    <span className="capitalize">{topic.title}</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => window.location.href = `/student/subjects/${subjectId}/topics/${topic.id}`}
                  >
                    View Content
                  </Button>
                </div>
                {topic.description && (
                  <p className="text-sm text-gray-600 mt-2 capitalize">
                    {topic.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="videos" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="videos">
                      Videos ({topic.videos.length})
                    </TabsTrigger>
                    <TabsTrigger value="materials">
                      Materials ({topic.materials.length})
                    </TabsTrigger>
                    <TabsTrigger value="assignments">
                      Assignments ({topic.assignments.length})
                    </TabsTrigger>
                    <TabsTrigger value="assessments">
                      Assessments ({topic.assessments.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Videos Tab */}
                  <TabsContent value="videos" className="space-y-3 mt-4">
                    {topic.videos.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No videos available
                      </p>
                    ) : (
                      topic.videos.map((video: VideoType) => (
                        <Card key={video.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="relative w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                {video.thumbnail ? (
                                  <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    sizes="128px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Video className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <PlayCircle className="h-8 w-8 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold capitalize mb-1">
                                  {video.title}
                                </h4>
                                {video.description && (
                                  <p className="text-sm text-gray-600 mb-2 capitalize">
                                    {video.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {video.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {video.views} views
                                  </span>
                                  <span>{formatFileSize(video.size)}</span>
                                </div>
                              </div>
                              <Button size="sm">
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Watch
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  {/* Materials Tab */}
                  <TabsContent value="materials" className="space-y-3 mt-4">
                    {topic.materials.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No materials available
                      </p>
                    ) : (
                      topic.materials.map((material: Material) => (
                        <Card key={material.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded">
                                  <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold capitalize">
                                    {material.title}
                                  </h4>
                                  {material.description && (
                                    <p className="text-sm text-gray-600 capitalize">
                                      {material.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {material.type.toUpperCase()}
                                    </Badge>
                                    <span>{formatFileSize(material.size)}</span>
                                    <span className="flex items-center gap-1">
                                      <Download className="h-3 w-3" />
                                      {material.downloads} downloads
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  {/* Assignments Tab */}
                  <TabsContent value="assignments" className="space-y-3 mt-4">
                    {topic.assignments.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No assignments available
                      </p>
                    ) : (
                      topic.assignments.map((assignment: Assignment) => (
                        <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded">
                                  <ClipboardList className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold capitalize">
                                    {assignment.title}
                                  </h4>
                                  {assignment.description && (
                                    <p className="text-sm text-gray-600 capitalize">
                                      {assignment.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Due: {formatDate(assignment.dueDate)}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      Max Score: {assignment.maxScore}
                                    </Badge>
                                    <Badge
                                      className={
                                        assignment.status === "active"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-700"
                                      }
                                    >
                                      {assignment.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button size="sm">
                                View Assignment
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  {/* Assessments Tab */}
                  <TabsContent value="assessments" className="space-y-3 mt-4">
                    {topic.assessments.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No assessments available
                      </p>
                    ) : (
                      topic.assessments.map((assessment: Assessment) => (
                        <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded">
                                  <FileCheck className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold capitalize">
                                    {assessment.title}
                                  </h4>
                                  {assessment.description && (
                                    <p className="text-sm text-gray-600 capitalize">
                                      {assessment.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {assessment.duration} mins
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {assessment.maxAttempts} attempts
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Pass: {assessment.passingScore}%
                                    </Badge>
                                    <Badge
                                      className={
                                        assessment.status === "PUBLISHED"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-700"
                                      }
                                    >
                                      {assessment.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button size="sm">
                                Start Assessment
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubjectDetailPage;

