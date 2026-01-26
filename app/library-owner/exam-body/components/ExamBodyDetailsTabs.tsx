"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ExamBody } from "@/hooks/exam-body/types";
import { ExamBodySubjectsSection } from "./subjects/ExamBodySubjectsSection";
import { ExamBodyYearsSection } from "./years/ExamBodyYearsSection";
import { ExamBodyAssessmentsSection } from "./assessments/ExamBodyAssessmentsSection";
import { ExamBodyQuestionsSection } from "./questions/ExamBodyQuestionsSection";

interface ExamBodyDetailsTabsProps {
  examBody: ExamBody;
}

export const ExamBodyDetailsTabs = ({ examBody }: ExamBodyDetailsTabsProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brand-border bg-white p-4">
        <h2 className="text-lg font-semibold text-brand-heading">
          {examBody.name}
        </h2>
        <p className="text-sm text-brand-light-accent-1">
          {examBody.fullName}
        </p>
        {examBody.description && (
          <p className="text-sm text-brand-light-accent-1 mt-2">
            {examBody.description}
          </p>
        )}
      </div>

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="years">Years</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects">
          <ExamBodySubjectsSection examBodyId={examBody.id} />
        </TabsContent>
        <TabsContent value="years">
          <ExamBodyYearsSection examBodyId={examBody.id} />
        </TabsContent>
        <TabsContent value="assessments">
          <ExamBodyAssessmentsSection examBodyId={examBody.id} />
        </TabsContent>
        <TabsContent value="questions">
          <ExamBodyQuestionsSection examBodyId={examBody.id} examBody={examBody} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
