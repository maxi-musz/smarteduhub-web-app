"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus } from "lucide-react";
import { useLibrarySchoolAssessmentById, useLibrarySchoolAssessmentQuestions, useLibrarySchoolAssessmentAttempts } from "../../../hooks/use-library-school-assessments";
import { AssessmentDetails } from "../../../components/AssessmentDetails";
import { QuestionsView } from "../../../components/QuestionsView";
import { AttemptsView } from "../../../components/AttemptsView";
import { AddQuestionDialog } from "../../../components/AddQuestionDialog";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const subjectId = params.subjectId as string;
  const assessmentId = params.assessmentId as string;

  const { data: assessment, isLoading: loadingAssessment } = useLibrarySchoolAssessmentById(schoolId, assessmentId);
  const { data: questionsData, isLoading: loadingQuestions } = useLibrarySchoolAssessmentQuestions(schoolId, assessmentId);
  const { data: attemptsData, isLoading: loadingAttempts } = useLibrarySchoolAssessmentAttempts(schoolId, assessmentId);

  const questions = questionsData?.questions ?? [];
  const questionsCount = questionsData?.total_questions ?? assessment?._count?.questions ?? 0;
  const attemptsCount = attemptsData?.statistics?.attempted_count ?? 0;
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);

  if (loadingAssessment) {
    return (
      <div className="py-6 bg-brand-bg">
        <div className="text-center py-12 text-brand-light-accent-1">Loading assessment...</div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="py-6 bg-brand-bg">
        <div className="text-center py-12 text-red-600">Assessment not found</div>
        <div className="text-center">
          <Button variant="link" onClick={() => router.back()}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">{assessment.title}</h1>
            <p className="text-sm text-brand-light-accent-1">Manage details, questions, and attempts</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/library-owner/schools/subject/assessment/${schoolId}/${subjectId}`}>
            Back to list
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="questions">Questions ({questionsCount})</TabsTrigger>
          <TabsTrigger value="attempts">Attempts ({attemptsCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <AssessmentDetails schoolId={schoolId} assessment={assessment} questionsCount={questionsCount} />
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setAddQuestionOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add question
              </Button>
            </div>
            <QuestionsView questions={questions} isLoading={loadingQuestions} />
            <AddQuestionDialog
              schoolId={schoolId}
              assessmentId={assessmentId}
              open={addQuestionOpen}
              onOpenChange={setAddQuestionOpen}
              nextOrder={questions.length + 1}
            />
          </div>
        </TabsContent>

        <TabsContent value="attempts">
          <AttemptsView data={attemptsData} isLoading={loadingAttempts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
