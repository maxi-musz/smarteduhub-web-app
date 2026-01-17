"use client";

import { useState, useEffect, useMemo } from "react";
import { useSubjectsDashboard } from "@/hooks/use-teacher-data";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { AIAgentModal } from "@/components/AIAgentModal";
import {
  SubjectHeader,
  SubjectFilters,
  SubjectStatsCards,
  SubjectList,
  SubjectPagination,
} from "./subject-components";

const TeacherSubjectsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<"name" | "createdAt">("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  const { data, isLoading, error } = useSubjectsDashboard({
    page,
    limit,
    search: searchQuery || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
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

  const subjects = data?.subjects.data || [];

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        <SubjectHeader />

        {errorMessage && (
          <div className="text-center py-8 text-red-600">{errorMessage}</div>
        )}

        <SubjectStatsCards data={data} isLoading={isLoading} />

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
          pagination={data?.subjects.pagination}
          totalSubjects={data?.stats.totalSubjects}
          searchQuery={searchQuery}
          onAIClick={handleAIClick}
        />

        <SubjectPagination
          pagination={data?.subjects.pagination}
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
