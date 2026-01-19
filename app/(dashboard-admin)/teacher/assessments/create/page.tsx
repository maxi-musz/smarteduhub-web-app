"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateAssessment } from "@/hooks/use-teacher-assessments";
import { useSubjectsDashboard } from "@/hooks/use-teacher-data";
import { CreateAssessmentForm } from "./CreateAssessmentForm";

const CreateAssessmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectIdParam = searchParams.get("subject_id");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(subjectIdParam);

  const { data: subjectsData } = useSubjectsDashboard({
    page: 1,
    limit: 100,
  });

  useEffect(() => {
    if (subjectIdParam) {
      setSelectedSubjectId(subjectIdParam);
    } else if (subjectsData?.subjects.data && subjectsData.subjects.data.length > 0) {
      setSelectedSubjectId(subjectsData.subjects.data[0].id);
    }
  }, [subjectIdParam, subjectsData]);

  const createMutation = useCreateAssessment();

  const handleSubmit = async (data: unknown) => {
    if (!selectedSubjectId) {
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        ...(data as Record<string, unknown>),
        subject_id: selectedSubjectId,
      } as never);
      
      if (result) {
        router.push(`/teacher/assessments/${result.id}`);
      }
    } catch (error) {
      // Error handled by mutation
      console.error("Failed to create assessment:", error);
    }
  };

  if (!selectedSubjectId) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-gray-500">
          Loading subjects...
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-heading">Create Assessment</h1>
          <p className="text-brand-light-accent-1 text-sm">
            Create a new assessment, quiz, or exam
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <CreateAssessmentForm
        subjectId={selectedSubjectId}
        subjects={subjectsData?.subjects.data || []}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default CreateAssessmentPage;


