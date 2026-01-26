"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  useExploreExamBodies,
} from "@/hooks/explore/use-explore-exam-bodies";
import { ExamBodyCard } from "./components/ExamBodyCard";

export default function ExploreExamBodiesPage() {
  const router = useRouter();
  const { data: examBodies, isLoading, error } = useExploreExamBodies();

  const errorMessage = useMemo(() => {
    if (!error) return null;
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
      return error.message;
    }
    const errorObj = error as unknown;
    if (errorObj && typeof errorObj === "object" && "message" in errorObj) {
      return String((errorObj as { message: unknown }).message);
    }
    return "An unexpected error occurred while loading exam bodies.";
  }, [error]);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading exam bodies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="py-10 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{errorMessage}</p>
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
      {/* Header */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">
              Explore Exam Bodies
            </h1>
            <p className="text-brand-light-accent-1 mt-1">
              Browse and practice with exam questions from various examination
              bodies
            </p>
          </div>
          <Button onClick={() => router.push("/explore")} variant="outline">
            Back to Explore
          </Button>
        </div>
      </div>

      {/* Exam Bodies Grid */}
      {!examBodies || examBodies.length === 0 ? (
        <Card className="mx-6">
          <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
            No exam bodies available at the moment.
          </CardContent>
        </Card>
      ) : (
        <div className="px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examBodies.map((examBody) => (
            <ExamBodyCard
              key={examBody.id}
              examBody={examBody}
              onClick={() => router.push(`/explore/exam-bodies/${examBody.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
