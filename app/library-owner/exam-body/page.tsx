"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { ExamBodyHeader } from "./components/ExamBodyHeader";
import { ExamBodyList } from "./components/ExamBodyList";
import { ExamBodyDetailsTabs } from "./components/ExamBodyDetailsTabs";
import { useExamBodies } from "@/hooks/exam-body/use-exam-bodies";

const ExamBodyPage = () => {
  const { data, isLoading, error } = useExamBodies();
  const examBodies = useMemo(() => data || [], [data]);

  const [selectedExamBodyId, setSelectedExamBodyId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedExamBodyId && examBodies.length > 0) {
      setSelectedExamBodyId(examBodies[0].id);
    }
  }, [selectedExamBodyId, examBodies]);

  const selectedExamBody = useMemo(
    () => examBodies.find((item) => item.id === selectedExamBodyId) || null,
    [examBodies, selectedExamBodyId]
  );

  const errorMessage = useMemo(() => {
    if (!error) return null;
    
    // Type guard for AuthenticatedApiError
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      }
      if (error.statusCode === 403) {
        return "You do not have permission to access this data.";
      }
      if (error.statusCode === 404) {
        return "Exam bodies are not available right now. Please check again later.";
      }
      if (error.message.toLowerCase().includes("cannot get")) {
        return "Exam bodies are not available right now. Please check again later.";
      }
      return error.message;
    }
    
    // Handle other error types (defensive check)
    const errorObj = error as unknown;
    if (errorObj && typeof errorObj === "object" && "message" in errorObj) {
      return String((errorObj as { message: unknown }).message);
    }
    
    return "An unexpected error occurred while loading exam bodies.";
  }, [error]);

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <ExamBodyHeader />

      {errorMessage && (
        <div className="text-center py-6 text-red-600">{errorMessage}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <ExamBodyList
          examBodies={examBodies}
          isLoading={isLoading}
          selectedId={selectedExamBodyId}
          onSelect={setSelectedExamBodyId}
        />

        <div>
          {selectedExamBody ? (
            <ExamBodyDetailsTabs examBody={selectedExamBody} />
          ) : (
            <div className="rounded-lg border border-brand-border bg-white p-6 text-center text-sm text-brand-light-accent-1">
              Select an exam body to manage its subjects, years, assessments, and
              questions.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ExamBodyPage;
