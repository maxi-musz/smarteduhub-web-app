"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useExplore, useExploreSubjects, LibrarySubject } from "@/hooks/explore/use-explore";
import { useRouter } from "next/navigation";
import {
  SubjectHeader,
  SubjectFilters,
  SubjectList,
  SubjectPagination,
} from "@/app/teacher/subjects/subject-components";
import { ExploreStatistics } from "./explore-components/ExploreStatistics";
import { ExploreClassCard } from "./explore-components/ExploreClassCard";
import { Loader2 } from "lucide-react";

const ExplorePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch initial explore data (classes, statistics)
  const { data: exploreData, isLoading: isExploreLoading } = useExplore();

  // Fetch paginated subjects
  const { data: subjectsData, isLoading: isSubjectsLoading } = useExploreSubjects({
    page,
    limit,
    search: searchQuery || undefined,
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const errorMessage = useMemo(() => {
    // Handle errors if needed
    return null;
  }, []);

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/explore/subjects/${subjectId}`);
  };

  const subjects = useMemo(() => {
    if (!subjectsData?.items) return [];
    // Transform explore subjects to match teacher subject structure
    return subjectsData.items.map((subject: LibrarySubject) => ({
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
      topics: [],
      createdAt: subject.createdAt || new Date().toISOString(),
      updatedAt: subject.createdAt || new Date().toISOString(),
    }));
  }, [subjectsData?.items]);

  // Transform meta to match PaginationMeta interface
  const meta = useMemo(() => {
    if (!subjectsData?.meta) return undefined;
    return {
      page: subjectsData.meta.currentPage,
      limit: subjectsData.meta.limit,
      total: subjectsData.meta.totalItems,
      totalPages: subjectsData.meta.totalPages,
      hasNext: subjectsData.meta.currentPage < subjectsData.meta.totalPages,
      hasPrev: subjectsData.meta.currentPage > 1,
    };
  }, [subjectsData?.meta]);

  // Calculate stats from subjects
  const stats = useMemo(() => {
    const subjectsList = subjectsData?.items || [];
    if (!subjectsList.length) {
      return {
        totalSubjects: 0,
        totalVideos: 0,
        totalMaterials: 0,
        totalClasses: 0,
      };
    }

    const totalVideos = subjectsList.reduce((sum: number, s: LibrarySubject) => sum + (s.videosCount || 0), 0);
    const totalMaterials = 0; // Not available in explore API
    const uniqueClasses = new Set(subjectsList.map((s: LibrarySubject) => s.class?.id).filter(Boolean)).size;

    return {
      totalSubjects: subjectsData?.meta?.totalItems || subjectsList.length,
      totalVideos,
      totalMaterials,
      totalClasses: uniqueClasses,
    };
  }, [subjectsData]);

  const isLoading = isExploreLoading || isSubjectsLoading;

  if (isLoading && !exploreData) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading explore data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        <SubjectHeader />

        {errorMessage && (
          <div className="text-center py-8 text-red-600">{errorMessage}</div>
        )}

        {/* Statistics Overview */}
        {exploreData?.statistics && (
          <ExploreStatistics statistics={exploreData.statistics} />
        )}

        {/* Library Classes - Horizontal Scrollable Row */}
        {exploreData?.classes && exploreData.classes.length > 0 && (
          <div className="pl-0 pr-6">
            <h2 className="text-lg sm:text-xl font-semibold text-brand-heading mb-4">
              Library Classes ({exploreData.classes.length})
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {exploreData.classes.map((classItem) => (
                <div key={classItem.id} className="flex-shrink-0 w-64">
                  <ExploreClassCard classItem={classItem} />
                </div>
              ))}
            </div>
          </div>
        )}

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
          onAIClick={() => {}} // No AI for explore
          onSubjectClick={handleSubjectClick}
          basePath="/explore"
          canManage={false}
        />

        <SubjectPagination
          pagination={meta}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default ExplorePage;
