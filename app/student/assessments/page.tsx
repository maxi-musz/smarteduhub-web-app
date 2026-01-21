"use client";

import { useState, useEffect, useMemo } from "react";
import { useSubjectsDashboard } from "@/hooks/teacher/use-teacher-data";
import { useAssessments } from "@/hooks/teacher/use-teacher-assessments";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  AssessmentHeader,
  SubjectSelector,
  AssessmentFilters,
  AssessmentList,
  AssessmentPagination,
  CreateAssessmentButton,
} from "./assessment-components";
import type { GetAssessmentsParams } from "@/hooks/teacher/use-teacher-assessments";

const StudentAssessmentsPage = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [topicFilter, setTopicFilter] = useState<string | undefined>(undefined);

  // Get subjects
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjectsDashboard({
    page: 1,
    limit: 100,
  });

  // Get assessments for selected subject
  const assessmentsParams: GetAssessmentsParams = {
    subject_id: selectedSubjectId || "",
    status: statusFilter as "DRAFT" | "PUBLISHED" | "ACTIVE" | "CLOSED" | "ARCHIVED" | undefined,
    assessment_type: typeFilter as "CBT" | "ASSIGNMENT" | "EXAM" | "QUIZ" | "TEST" | "FORMATIVE" | "SUMMATIVE" | "DIAGNOSTIC" | "BENCHMARK" | "PRACTICE" | "MOCK_EXAM" | "OTHER" | undefined,
    topic_id: topicFilter,
    page,
    limit,
  };

  const { data: assessmentsData, isLoading: isLoadingAssessments, error } = useAssessments(assessmentsParams);

  // Auto-select first subject if available
  useEffect(() => {
    if (
      !selectedSubjectId &&
      subjectsData?.subjects.data &&
      subjectsData.subjects.data.length > 0
    ) {
      setSelectedSubjectId(subjectsData.subjects.data[0].id);
    }
  }, [subjectsData, selectedSubjectId]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter, topicFilter, selectedSubjectId]);

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

  const subjects = subjectsData?.subjects.data || [];
  const assessments = Array.isArray(assessmentsData?.assessments)
    ? assessmentsData.assessments
    : [];
  const pagination = assessmentsData?.pagination;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <AssessmentHeader refreshParams={assessmentsParams} />

      {errorMessage && (
        <div className="text-center py-8 text-red-600">{errorMessage}</div>
      )}

      <SubjectSelector
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={setSelectedSubjectId}
        isLoading={isLoadingSubjects}
      />

      {selectedSubjectId && (
        <>
          <div className="flex items-center justify-between">
            <AssessmentFilters
              status={statusFilter}
              type={typeFilter}
              topicId={topicFilter}
              onStatusChange={setStatusFilter}
              onTypeChange={setTypeFilter}
              onTopicChange={setTopicFilter}
            />
            <CreateAssessmentButton subjectId={selectedSubjectId} />
          </div>

          <AssessmentList
            assessments={assessments}
            isLoading={isLoadingAssessments}
            selectedSubjectId={selectedSubjectId}
          />

          {pagination && (
            <AssessmentPagination
              pagination={pagination}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {!selectedSubjectId && !isLoadingSubjects && (
        <div className="text-center py-8 text-gray-500">
          Please select a subject to view assessments
        </div>
      )}
    </div>
  );
};

export default StudentAssessmentsPage;
