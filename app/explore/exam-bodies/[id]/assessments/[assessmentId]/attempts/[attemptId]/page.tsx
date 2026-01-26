"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useAttemptResults } from "@/hooks/explore/use-explore-exam-bodies";
import { AttemptResultsViewer } from "./components/AttemptResultsViewer";

export default function AttemptResultsPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params.attemptId as string;

  const { data: resultsData, isLoading, error } = useAttemptResults(attemptId);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      }
      if (error.statusCode === 403) {
        return "You do not have permission to view this attempt.";
      }
      if (error.statusCode === 404) {
        return "Attempt not found.";
      }
      if (error.statusCode === 500) {
        return "Server error. Please try again later.";
      }
      // For other errors, use a generic message instead of raw error
      return "Unable to load attempt results. Please try again later.";
    }
    return "An unexpected error occurred while loading attempt results.";
  }, [error]);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !resultsData) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="py-10 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">
                {errorMessage || "Attempt results not found"}
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
          Back to Assessment
        </Button>
      </div>

      <AttemptResultsViewer results={resultsData} />
    </div>
  );
}
