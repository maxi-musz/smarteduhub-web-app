"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAssessments } from "@/hooks/use-teacher-assessments";
import type { GetAssessmentsParams } from "@/hooks/use-teacher-assessments";

interface AssessmentHeaderProps {
  refreshParams?: GetAssessmentsParams;
}

export const AssessmentHeader = ({ refreshParams }: AssessmentHeaderProps) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refreshParams) {
        // Refetch the specific query
        await queryClient.refetchQueries({
          queryKey: ["teacher", "assessments", refreshParams],
        });
      } else {
        // Refetch all assessment queries
        await queryClient.refetchQueries({
          queryKey: ["teacher", "assessments"],
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-heading">Assessments</h1>
        <p className="text-brand-light-accent-1 text-sm">
          Create and manage assessments, quizzes, and exams
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
};


