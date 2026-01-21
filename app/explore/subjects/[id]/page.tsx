"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExploreTopics } from "@/hooks/explore/use-explore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PublicApiError } from "@/lib/api/public";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
// Import shared components from general-pages
import { SubjectHeader } from "@/app/general-pages/subjects/[id]/components/SubjectHeader";
import { SubjectDescription } from "@/app/general-pages/subjects/[id]/components/SubjectDescription";
import { SubjectStatsCards } from "@/app/general-pages/subjects/[id]/components/SubjectStatsCards";
import { ExploreTopicsContentSection } from "@/app/explore/explore-components/ExploreTopicsContentSection";

const ExploreSubjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const { data, isLoading, error } = useExploreTopics(subjectId);

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
    if (error instanceof PublicApiError || error instanceof AuthenticatedApiError) {
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

  const { subject, topics, statistics } = data;

  // Transform LibraryTopic to ExploreTopic format
  const flatTopics = (topics || []).map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    order: topic.order,
    is_active: topic.is_active,
    videos: topic.videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      durationSeconds: video.durationSeconds,
      sizeBytes: video.sizeBytes,
      views: video.views,
      order: video.order,
      status: video.status || "published",
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      uploadedBy: video.uploadedBy,
    })),
    materials: topic.materials,
    assessments: topic.assessments,
    submissions: topic.submissions,
    statistics: topic.statistics,
  }));

  // Calculate stats
  const stats = {
    totalTopics: statistics.topicsCount,
    totalVideos: statistics.videosCount,
    totalMaterials: statistics.materialsCount,
    totalStudents: 0, // Not available in explore
    progress: 0,
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <SubjectHeader
        name={subject.name}
        code={subject.code}
        status="active"
        color={subject.color}
      />

      <SubjectDescription description={subject.description || ""} />

      <SubjectStatsCards
        totalTopics={stats.totalTopics}
        totalVideos={stats.totalVideos}
        totalMaterials={stats.totalMaterials}
        totalStudents={stats.totalStudents}
        progress={stats.progress}
      />

      <ExploreTopicsContentSection
        topics={flatTopics}
        selectedTopicId={selectedTopicId}
        onTopicSelect={setSelectedTopicId}
        subjectId={subjectId}
      />
    </div>
  );
};

export default ExploreSubjectDetailPage;
