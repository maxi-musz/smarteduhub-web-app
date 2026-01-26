"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLibrarySubjectTopics } from "@/hooks/library-owner/use-library-topics";
import { useLibrarySubject } from "@/hooks/library-owner/use-library-subject";
import { Button } from "@/components/ui/button";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
// Import shared components from general-pages
import { SubjectHeader } from "@/app/general-pages/subjects/[id]/components/SubjectHeader";
import { SubjectDescription } from "@/app/general-pages/subjects/[id]/components/SubjectDescription";
import { SubjectStatsCards } from "@/app/general-pages/subjects/[id]/components/SubjectStatsCards";
import { LibraryTopicsContentSection } from "./components/LibraryTopicsContentSection";
import { LibraryCreateTopicModal } from "./components/LibraryCreateTopicModal";
import { SubjectDetailSkeleton } from "./components/SubjectDetailSkeleton";

const LibraryOwnerSubjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  const subjectId = params.subjectId as string;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);

  // Use the new hook that fetches topics with resource counts
  const { data: topicsData, isLoading: topicsLoading, error: topicsError } = useLibrarySubjectTopics(subjectId);
  // Still use the old hook for subject info and stats
  const { data: subjectData, isLoading: subjectLoading, error: subjectError } = useLibrarySubject(classId, subjectId);
  
  const isLoading = topicsLoading || subjectLoading;
  const error = topicsError || subjectError;

  // Show skeleton while loading OR if we don't have data yet and there's no error
  // This prevents showing "No data" message during page reload before queries complete
  if (isLoading || ((!topicsData && !topicsError) || (!subjectData && !subjectError))) {
    return <SubjectDetailSkeleton />;
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

  // Only show "No data" if we're not loading AND both queries completed but returned no data
  if (!subjectData || !topicsData) {
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

  const { subject, stats } = subjectData;
  // Transform topics from the new hook to match LibraryTopic interface
  // Use topicsData.count or topics.length to get accurate count
  const topics = topicsData.topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description || null,
    instructions: null,
    order: topic.order,
    status: topic.is_active ? "active" : "inactive",
    is_active: topic.is_active,
    resourceCounts: topic.resourceCounts,
  }));
  
  // Update stats with actual topics count from topicsData
  const updatedStats = {
    ...stats,
    totalTopics: topicsData.count || topics.length,
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <SubjectHeader
        name={subject.name}
        code={subject.code}
        status={subject.status}
        color={subject.color}
      />

      <SubjectDescription description={subject.description || ""} />

      <SubjectStatsCards
        totalTopics={updatedStats.totalTopics}
        totalVideos={stats.totalVideos}
        totalMaterials={stats.totalMaterials}
        totalStudents={stats.totalStudents}
        progress={0}
      />

      <LibraryTopicsContentSection
        topics={topics}
        selectedTopicId={selectedTopicId}
        onTopicSelect={setSelectedTopicId}
        onAddTopic={() => setIsCreateTopicModalOpen(true)}
        subjectId={subjectId}
        classId={classId}
      />

      <LibraryCreateTopicModal
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        subjectId={subjectId}
        classId={classId}
      />
    </div>
  );
};

export default LibraryOwnerSubjectDetailPage;
