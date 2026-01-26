"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  useExploreExamBody,
  useExploreExamBodyAssessments,
} from "@/hooks/explore/use-explore-exam-bodies";
import { ExamBodyAssessmentsList } from "./components/ExamBodyAssessmentsList";
import { SubjectCard } from "./components/SubjectCard";
import Image from "next/image";
import { GraduationCap } from "lucide-react";

export default function ExploreExamBodyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const examBodyId = params.id as string;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const { data: examBody, isLoading, error } = useExploreExamBody(examBodyId);

  const { data: assessments } = useExploreExamBodyAssessments(examBodyId, {
    subjectId: selectedSubjectId,
    yearId: selectedYearId,
  });

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
        return "Exam body not found.";
      }
      return error.message;
    }
    const errorObj = error as unknown;
    if (errorObj && typeof errorObj === "object" && "message" in errorObj) {
      return String((errorObj as { message: unknown }).message);
    }
    return "An unexpected error occurred while loading exam body.";
  }, [error]);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading exam body...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !examBody) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="py-10 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">
                {errorMessage || "Exam body not found"}
              </p>
              <Button onClick={() => router.push("/explore/exam-bodies")} variant="outline">
                Back to Exam Bodies
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
        <Button
          onClick={() => router.push("/explore/exam-bodies")}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exam Bodies
        </Button>

        <div className="flex items-start gap-6">
          {examBody.logoUrl && !logoError ? (
            <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border border-brand-border">
              <Image
                src={examBody.logoUrl}
                alt={examBody.name}
                fill
                className="object-contain"
                unoptimized={examBody.logoUrl.includes("s3.amazonaws.com")}
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-brand-primary" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-heading mb-2">
              {examBody.name}
            </h1>
            <p className="text-brand-light-accent-1 mb-4">
              {examBody.fullName}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-brand-light-accent-1">
                <BookOpen className="h-4 w-4" />
                <span>{examBody.subjects.length} Subjects</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-light-accent-1">
                <Calendar className="h-4 w-4" />
                <span>{examBody.years.length} Years</span>
              </div>
              {examBody.status === "active" && (
                <Badge variant="outline">Active</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs defaultValue="assessments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="years">Years</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments">
            <ExamBodyAssessmentsList
              examBodyId={examBodyId}
              assessments={assessments || []}
              subjects={examBody.subjects}
              years={examBody.years}
              selectedSubjectId={selectedSubjectId}
              selectedYearId={selectedYearId}
              onSubjectChange={setSelectedSubjectId}
              onYearChange={setSelectedYearId}
            />
          </TabsContent>

          <TabsContent value="subjects">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {examBody.subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="years">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {examBody.years.map((year) => (
                <Card key={year.id} className="border-brand-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-brand-primary" />
                      <div>
                        <h3 className="font-semibold text-brand-heading">
                          {year.year}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
