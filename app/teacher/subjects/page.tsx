"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTeacherSubjects } from "@/hooks/teacher/use-teacher-subjects";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { AIAgentModal } from "@/components/AIAgentModal";
import { useRouter } from "next/navigation";
import {
  SubjectHeader,
  SubjectFilters,
  SubjectStatsCards,
  SubjectList,
  SubjectPagination,
} from "./subject-components";

const TeacherSubjectsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<"name" | "code" | "createdAt" | "updatedAt">("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  const { data, isLoading, error } = useTeacherSubjects({
    page,
    limit,
    search: searchQuery || undefined,
    sortBy,
    sortOrder,
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return error.message;
      }
    }

    return "An unexpected error occurred while loading subjects data.";
  }, [error]);

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/teacher/subjects/${subjectId}`);
  };

  const subjects = data?.data || [];
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

    // For now, we'll use basic counts since comprehensive data requires individual subject fetches
    // The comprehensive endpoint provides better stats, but we'll keep it simple for the list view
    return {
      totalSubjects: data?.meta?.total || subjectsList.length,
      totalVideos: 0, // Will be populated when viewing individual subjects
      totalMaterials: 0, // Will be populated when viewing individual subjects
      totalClasses: 0, // Will be populated when viewing individual subjects
    };
  }, [data]);

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        <SubjectHeader />

        {errorMessage && (
          <div className="text-center py-8 text-red-600">{errorMessage}</div>
        )}

        <SubjectStatsCards stats={stats} isLoading={isLoading} />

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

export default TeacherSubjectsPage;
