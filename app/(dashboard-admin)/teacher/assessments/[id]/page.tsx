"use client";

import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAssessmentById, useAssessmentQuestions, useAssessmentAttempts } from "@/hooks/use-teacher-assessments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AssessmentDetails } from "./components/AssessmentDetails";
import { QuestionsManagement } from "./components/QuestionsManagement";
import { AttemptsView } from "./components/AttemptsView";

const AssessmentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const assessmentId = params.id as string;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: assessment, isLoading: isLoadingAssessment } = useAssessmentById(assessmentId);
  const { data: questionsData, isLoading: isLoadingQuestions } = useAssessmentQuestions(assessmentId);
  const { data: attemptsData, isLoading: isLoadingAttempts } = useAssessmentAttempts(assessmentId);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch all related queries for this assessment
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["teacher", "assessments", assessmentId],
        }),
        queryClient.refetchQueries({
          queryKey: ["teacher", "assessments", assessmentId, "questions"],
        }),
        queryClient.refetchQueries({
          queryKey: ["teacher", "assessments", assessmentId, "attempts"],
        }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoadingAssessment) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-gray-500">Loading assessment...</div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-red-600">Assessment not found</div>
        <div className="text-center">
          <button
            onClick={() => router.push("/teacher/assessments")}
            className="text-brand-primary hover:underline"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-heading">{assessment.title}</h1>
          <p className="text-brand-light-accent-1 text-sm">
            Manage assessment details, questions, and view student attempts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : ""}
          </Button>
          <button
            onClick={() => router.push("/teacher/assessments")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Assessments
          </button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({questionsData?.total_questions || 0})
          </TabsTrigger>
          <TabsTrigger value="attempts">
            Attempts ({attemptsData?.statistics?.attempted_count || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <AssessmentDetails 
            assessment={assessment} 
            questionsCount={questionsData?.total_questions}
          />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionsManagement
            assessmentId={assessmentId}
            assessment={assessment}
            questionsData={questionsData}
            isLoading={isLoadingQuestions}
          />
        </TabsContent>

        <TabsContent value="attempts">
          <AttemptsView
            assessmentId={assessmentId}
            attemptsData={attemptsData}
            isLoading={isLoadingAttempts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentDetailPage;


