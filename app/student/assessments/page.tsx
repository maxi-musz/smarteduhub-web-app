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
import type { StatusCounts } from "./assessment-components/AssessmentFilters";

const StudentAssessmentsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Accumulated status counts: merge in counts as we get responses so tabs keep their numbers
  const [accumulatedCounts, setAccumulatedCounts] = useState<StatusCounts>({});

  // Main list: current filter
  const { data: assessmentsData, isLoading: isLoadingAssessments, error } = useStudentAssessments({
    page,
    limit,
    status: statusFilter,
    assessmentType: typeFilter,
    subjectId: subjectFilter,
    search: searchQuery,
  });

  const countQueryParams = {
    page: 1,
    limit: 1,
    assessmentType: typeFilter,
    subjectId: subjectFilter,
    search: searchQuery,
  };

  // Lightweight count queries so all status tabs show counts without clicking
  const { data: allCountData } = useStudentAssessments({
    ...countQueryParams,
    status: "all",
  });
  const { data: activeCountData } = useStudentAssessments({
    ...countQueryParams,
    status: "ACTIVE",
  });
  const { data: publishedCountData } = useStudentAssessments({
    ...countQueryParams,
    status: "PUBLISHED",
  });
  const { data: closedCountData } = useStudentAssessments({
    ...countQueryParams,
    status: "CLOSED",
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter, subjectFilter, searchQuery]);

  // Merge current response into accumulated counts so we never lose a tab's count
  useEffect(() => {
    const d = assessmentsData?.data;
    const pagTotal = d?.pagination?.total;
    if (d && pagTotal !== undefined) {
      const key = statusFilter === "all" ? "all" : statusFilter;
      setAccumulatedCounts((prev) => ({ ...prev, [key]: pagTotal }));
    }
  }, [assessmentsData, statusFilter]);

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

  const statusCounts: StatusCounts = useMemo(
    () => ({
      all: allCountData?.data?.pagination?.total ?? accumulatedCounts.all,
      ACTIVE: activeCountData?.data?.pagination?.total ?? accumulatedCounts.ACTIVE,
      PUBLISHED: publishedCountData?.data?.pagination?.total ?? accumulatedCounts.PUBLISHED,
      CLOSED: closedCountData?.data?.pagination?.total ?? accumulatedCounts.CLOSED,
    }),
    [
      allCountData?.data?.pagination?.total,
      activeCountData?.data?.pagination?.total,
      publishedCountData?.data?.pagination?.total,
      closedCountData?.data?.pagination?.total,
      accumulatedCounts,
    ]
  );

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
        statusCounts={statusCounts}
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
