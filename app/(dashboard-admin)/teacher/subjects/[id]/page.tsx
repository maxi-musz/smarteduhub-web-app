"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTeacherComprehensiveSubject } from "@/hooks/teacher/use-teacher-subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Loader2,
  PlayCircle,
  Download,
  Clock,
  Eye,
  Users,
  TrendingUp,
} from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import Image from "next/image";

const TeacherSubjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useTeacherComprehensiveSubject({
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

  if (error) {
    let errorMessage = "Failed to load subject details";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.statusCode === 404) {
        errorMessage = "Subject not found";
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

  if (!data) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No subject data available</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const { subject, topics, stats, pagination } = data;
  const selectedTopic = selectedTopicId
    ? topics.find((t) => t.id === selectedTopicId)
    : null;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
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
                {subject.code} • {subject.status}
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
                <BookOpen className="h-5 w-5 text-blue-600" />
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
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-xl font-bold">{subject.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics and Content */}
      <Card>
        <CardHeader>
          <CardTitle>Topics & Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topics List */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold mb-4">Topics ({topics.length})</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {topics.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No topics available
                  </p>
                ) : (
                  topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedTopicId === topic.id
                          ? "bg-brand-primary text-white border-brand-primary"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`font-medium capitalize ${
                              selectedTopicId === topic.id ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {topic.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              selectedTopicId === topic.id
                                ? "text-white/80"
                                : "text-gray-500"
                            }`}
                          >
                            Order: {topic.order}
                          </p>
                        </div>
                        <Badge
                          variant={topic.status === "active" ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {topic.status}
                        </Badge>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Topic Content */}
            <div className="lg:col-span-2">
              {selectedTopic ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold capitalize mb-2">
                      {selectedTopic.title}
                    </h3>
                    {selectedTopic.description && (
                      <p className="text-sm text-gray-600 capitalize mb-4">
                        {selectedTopic.description}
                      </p>
                    )}
                    {selectedTopic.instructions && (
                      <div className="p-3 bg-blue-50 rounded-lg mb-4">
                        <p className="text-sm text-blue-900">
                          <strong>Instructions:</strong> {selectedTopic.instructions}
                        </p>
                      </div>
                    )}
                  </div>

                  <Tabs defaultValue="videos" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="videos">
                        Videos ({selectedTopic.videos.length})
                      </TabsTrigger>
                      <TabsTrigger value="materials">
                        Materials ({selectedTopic.materials.length})
                      </TabsTrigger>
                    </TabsList>

                    {/* Videos Tab */}
                    <TabsContent value="videos" className="space-y-3 mt-4">
                      {selectedTopic.videos.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No videos available
                        </p>
                      ) : (
                        selectedTopic.videos.map((video) => (
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
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {video.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" />
                                      {video.views} views
                                    </span>
                                    <span>{video.size}</span>
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
                      {selectedTopic.materials.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No materials available
                        </p>
                      ) : (
                        selectedTopic.materials.map((material) => (
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
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {material.type.toUpperCase()}
                                      </Badge>
                                      <span>{material.size}</span>
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
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Select a topic to view its content</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSubjectDetailPage;

