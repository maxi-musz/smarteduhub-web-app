"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLibrarySubjectDetail } from "@/hooks/library-owner/use-library-subject-detail";
import { Button } from "@/components/ui/button";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
// Import shared components from general-pages
import { SubjectHeader } from "@/app/general-pages/subjects/[id]/components/SubjectHeader";
import { SubjectDescription } from "@/app/general-pages/subjects/[id]/components/SubjectDescription";
import { SubjectStatsCards } from "@/app/general-pages/subjects/[id]/components/SubjectStatsCards";
import { LibraryTopicsContentSection } from "@/app/library-owner/resources/[classId]/[subjectId]/components/LibraryTopicsContentSection";
import { LibraryCreateTopicModal } from "@/app/library-owner/resources/[classId]/[subjectId]/components/LibraryCreateTopicModal";
import { SubjectDetailSkeleton } from "@/app/library-owner/resources/[classId]/[subjectId]/components/SubjectDetailSkeleton";

const LibraryOwnerSubjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);

  const { data, isLoading, error } = useLibrarySubjectDetail(subjectId);

  // Show skeleton while loading OR if we don't have data yet and there's no error
  // This prevents showing "No data" message during page reload before query completes
  if (isLoading || (!data && !error)) {
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

  // Only show "No data" if we're not loading AND query completed but returned no data
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

  const { subject, topics, stats } = data;

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
        totalTopics={stats.totalTopics}
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
      />

      <LibraryCreateTopicModal
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        subjectId={subjectId}
      />
    </div>
  );
};

export default LibraryOwnerSubjectDetailPage;
