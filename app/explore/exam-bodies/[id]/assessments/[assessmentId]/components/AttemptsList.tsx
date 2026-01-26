"use client";

import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  useAssessmentAttempts,
} from "@/hooks/explore/use-explore-exam-bodies";

interface AttemptsListProps {
  examBodyId: string;
  assessmentId: string;
}

export const AttemptsList = ({ examBodyId, assessmentId }: AttemptsListProps) => {
  const router = useRouter();
  const { data: attempts, isLoading, error } = useAssessmentAttempts(assessmentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto mb-2" />
          <p className="text-sm text-brand-light-accent-1">Loading attempts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage = "Unable to load your attempts at this time.";
    
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        errorMessage = "You don't have permission to view attempts for this assessment.";
      } else if (error.statusCode === 404) {
        errorMessage = "Assessment not found or not available.";
      } else if (error.statusCode === 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        // For other errors, use a generic message instead of raw error
        errorMessage = "Unable to load your attempts. Please try again later.";
      }
    }
    
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-red-600 mb-1">Error Loading Attempts</p>
          <p className="text-xs text-brand-light-accent-1">{errorMessage}</p>
        </CardContent>
      </Card>
    );
  }

  if (!attempts || attempts.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
          No attempts yet. Take the exam to see your results here.
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      {attempts.map((attempt) => (
        <Card key={attempt.id} className="border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Attempt #{attempt.attemptNumber}
                  </Badge>
                  {attempt.passed ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Passed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 text-xs">
                      <XCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {attempt.percentage}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {attempt.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-light-accent-1 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(attempt.submittedAt)}
                  </span>
                  <span>
                    Score: {attempt.totalScore}/{attempt.maxScore}
                  </span>
                  <span>Time: {formatTime(attempt.timeSpent)}</span>
                </div>
                {attempt.assessment && (
                  <div className="text-xs text-brand-light-accent-1">
                    <span className="font-medium">{attempt.assessment.title}</span>
                    {attempt.assessment.subject && (
                      <span className="ml-2">
                        • {attempt.assessment.subject.name}
                        {attempt.assessment.year && ` • ${attempt.assessment.year.year}`}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={() =>
                  router.push(
                    `/explore/exam-bodies/${examBodyId}/assessments/${assessmentId}/attempts/${attempt.id}`
                  )
                }
                size="sm"
                disabled={attempt.status !== "GRADED" && attempt.status !== "SUBMITTED"}
              >
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
