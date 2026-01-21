"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLibrarySubjects } from "@/hooks/library-owner/use-library-subjects";
import { useLibraryOwnerResources } from "@/hooks/library-owner/use-library-owner-resources";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { AIAgentModal } from "@/components/AIAgentModal";
import { useRouter } from "next/navigation";
import {
  SubjectHeader,
  SubjectFilters,
  SubjectList,
  SubjectPagination,
} from "@/app/teacher/subjects/subject-components";
import { ResourcesStatistics } from "@/app/library-owner/resources/components/ResourcesStatistics";
import { ResourcesBreakdown } from "@/app/library-owner/resources/components/ResourcesBreakdown";
import { ResourcesSkeleton } from "@/app/library-owner/resources/components/ResourcesSkeleton";
import { LibraryClassCard } from "@/app/library-owner/resources/components/LibraryClassCard";

const LibraryOwnerSubjectsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<"name" | "code" | "createdAt" | "updatedAt">("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  const { data, isLoading, error } = useLibrarySubjects({
    page,
    limit,
    search: searchQuery || undefined,
    sortBy,
    sortOrder,
  });

  // Fetch resources dashboard data for statistics
  const {
    data: resourcesData,
    isLoading: isResourcesLoading,
  } = useLibraryOwnerResources();

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    // Type guard for AuthenticatedApiError
    if (error && typeof error === "object" && "statusCode" in error) {
      const apiError = error as AuthenticatedApiError;
      if (apiError.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (apiError.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return apiError.message || "An error occurred";
      }
    }

    // Type guard for Error
    if (error && typeof error === "object" && "message" in error) {
      return (error as Error).message;
    }

    return "An unexpected error occurred while loading subjects data.";
  }, [error]);

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/library-owner/subjects/${subjectId}`);
  };

  const subjects = useMemo(() => {
    if (!data?.data) return [];
    // Transform library subjects to match teacher subject structure
    return data.data.map((subject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code || null,
      color: subject.color,
      description: subject.description,
      thumbnail: subject.thumbnailUrl ? {
        secure_url: subject.thumbnailUrl,
        public_id: "",
      } : null,
      school: {
        id: "",
        school_name: "",
      },
      academicSession: {
        id: "",
        academic_year: "",
        term: "",
      },
      topics: subject.topics || [],
      createdAt: subject.createdAt || new Date().toISOString(),
      updatedAt: subject.updatedAt || new Date().toISOString(),
    }));
  }, [data?.data]);

  const meta = data?.meta;

  // Calculate stats from subjects
  const stats = useMemo(() => {
    const subjectsList = data?.data || [];
    if (!subjectsList.length) {
      return {
        totalSubjects: 0,
        totalVideos: 0,
        totalMaterials: 0,
        totalClasses: 0,
      };
    }

    const totalVideos = subjectsList.reduce((sum, s) => sum + (s.totalVideos || 0), 0);
    const totalMaterials = subjectsList.reduce((sum, s) => sum + (s.totalMaterials || 0), 0);
    const uniqueClasses = new Set(subjectsList.map((s) => s.classId)).size;

    return {
      totalSubjects: data?.meta?.total || subjectsList.length,
      totalVideos,
      totalMaterials,
      totalClasses: uniqueClasses,
    };
  }, [data]);

  // Show skeleton loader while resources are loading
  if (isResourcesLoading) {
    return <ResourcesSkeleton />;
  }

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        <SubjectHeader />

        {errorMessage && (
          <div className="text-center py-8 text-red-600">{errorMessage}</div>
        )}

        {/* Statistics Overview - Same as Resources tab */}
        {resourcesData?.statistics && (
          <>
            <ResourcesStatistics statistics={resourcesData.statistics} />
            <ResourcesBreakdown statistics={resourcesData.statistics} />
          </>
        )}

        {/* Library Classes - Horizontal Scrollable Row */}
        {resourcesData?.libraryClasses && resourcesData.libraryClasses.length > 0 && (
          <div className="pl-0 pr-6">
            <h2 className="text-lg sm:text-xl font-semibold text-brand-heading mb-4">
              Library Classes ({resourcesData.libraryClasses.length})
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {resourcesData.libraryClasses.map((classItem) => (
                <div key={classItem.id} className="flex-shrink-0 w-64">
                  <LibraryClassCard classItem={classItem} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* <SubjectStatsCards 
          stats={stats} 
          isLoading={isLoading} 
          academicSession={null}
        /> */}

        <SubjectFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
        />

        <SubjectList
          subjects={subjects}
          isLoading={isLoading}
          pagination={meta}
          totalSubjects={stats.totalSubjects}
          searchQuery={searchQuery}
          onAIClick={handleAIClick}
          onSubjectClick={handleSubjectClick}
          basePath="/library-owner"
          canManage={true}
        />

        <SubjectPagination
          pagination={meta}
          onPageChange={setPage}
        />
      </div>

      <AIAgentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        subject={selectedSubject}
      />
    </>
  );
};

export default LibraryOwnerSubjectsPage;
