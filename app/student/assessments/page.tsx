"use client";

import { useState, useEffect, useMemo } from "react";
import { useStudentAssessments } from "@/hooks/student/use-student-assessments";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  AssessmentHeader,
  AssessmentFilters,
  AssessmentList,
  AssessmentPagination,
} from "./assessment-components";

const StudentAssessmentsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get assessments
  const { data: assessmentsData, isLoading: isLoadingAssessments, error } = useStudentAssessments({
    page,
    limit,
    status: statusFilter,
    assessmentType: typeFilter,
    subjectId: subjectFilter,
    search: searchQuery,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter, subjectFilter, searchQuery]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        return "You don&apos;t have permission to access this data.";
      } else {
        return error.message;
      }
    }

    return "An unexpected error occurred while loading assessments.";
  }, [error]);

  const assessments = assessmentsData?.data?.assessments || [];
  const pagination = assessmentsData?.data?.pagination;
  const currentSession = assessmentsData?.data?.general_info?.current_session;
  const subjects = assessmentsData?.data?.subjects || [];

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <AssessmentHeader 
        currentSession={currentSession}
        subjects={subjects}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {errorMessage && (
        <div className="text-center py-8 text-red-600">{errorMessage}</div>
      )}

      <AssessmentFilters
        status={statusFilter}
        type={typeFilter}
        subject={subjectFilter}
        subjects={subjects}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        onSubjectChange={setSubjectFilter}
      />

      <AssessmentList
        assessments={assessments}
        isLoading={isLoadingAssessments}
      />

      {pagination && (
        <AssessmentPagination
          pagination={pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default StudentAssessmentsPage;
