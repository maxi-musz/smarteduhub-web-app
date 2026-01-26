"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useExploreExamBodyQuestions } from "@/hooks/explore/use-explore-exam-bodies";
import { AssessmentViewer } from "./components/AssessmentViewer";
import { AttemptsList } from "./components/AttemptsList";

export default function ExploreAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const examBodyId = params.id as string;
  const assessmentId = params.assessmentId as string;

  const { data: questionsData, isLoading, error } =
    useExploreExamBodyQuestions(examBodyId, assessmentId);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      }
      if (error.statusCode === 403) {
        return "You do not have permission to access this assessment.";
      }
      if (error.statusCode === 404) {
        return "Assessment not found or not published.";
      }
      return error.message;
    }
    const errorObj = error as unknown;
    if (errorObj && typeof errorObj === "object" && "message" in errorObj) {
      return String((errorObj as { message: unknown }).message);
    }
    return "An unexpected error occurred while loading the assessment.";
  }, [error]);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !questionsData) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="py-10 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">
                {errorMessage || "Assessment not found"}
              </p>
              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="px-6">
        <Button onClick={() => router.back()} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="px-6">
        <Tabs defaultValue="take" className="space-y-4">
          <TabsList>
            <TabsTrigger value="take">Take Exam</TabsTrigger>
            <TabsTrigger value="attempts">My Attempts</TabsTrigger>
          </TabsList>

          <TabsContent value="take">
            <AssessmentViewer
              assessment={questionsData.assessment}
              questions={questionsData.questions}
              examBodyId={examBodyId}
              assessmentId={assessmentId}
            />
          </TabsContent>

          <TabsContent value="attempts">
            <AttemptsList
              examBodyId={examBodyId}
              assessmentId={assessmentId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
