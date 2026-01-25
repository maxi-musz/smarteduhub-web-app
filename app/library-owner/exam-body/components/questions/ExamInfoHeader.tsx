"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, BookOpen, Hash } from "lucide-react";
import type { ExamBody, ExamBodyAssessment } from "@/hooks/exam-body/types";

interface ExamInfoHeaderProps {
  examBody: ExamBody | null;
  assessment: ExamBodyAssessment | null;
  questionTotal: number;
}

export const ExamInfoHeader = ({
  examBody,
  assessment,
  questionTotal,
}: ExamInfoHeaderProps) => {
  if (!examBody || !assessment) {
    return null;
  }

  const subjectName = assessment.subject?.name || "N/A";
  const year = assessment.year?.year || "N/A";
  const duration = assessment.duration
    ? `${Math.floor(assessment.duration / 60)} minutes`
    : "Not specified";
  const totalPoints = assessment.totalPoints || 0;

  return (
    <Card className="border-brand-border bg-gradient-to-br from-gray-50 to-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-brand-heading">Exam Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-light-accent-1">
              <BookOpen className="h-3.5 w-3.5" />
              Exam Body
            </div>
            <p className="text-sm font-semibold text-brand-heading">{examBody.name}</p>
            <p className="text-xs text-brand-light-accent-1">{examBody.fullName}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-light-accent-1">
              <Calendar className="h-3.5 w-3.5" />
              Year
            </div>
            <p className="text-sm font-semibold text-brand-heading">{year}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-light-accent-1">
              <BookOpen className="h-3.5 w-3.5" />
              Subject
            </div>
            <p className="text-sm font-semibold text-brand-heading">{subjectName}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-light-accent-1">
              <Hash className="h-3.5 w-3.5" />
              Questions
            </div>
            <p className="text-sm font-semibold text-brand-heading">{questionTotal}</p>
            <p className="text-xs text-brand-light-accent-1">Total questions</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-light-accent-1">
              <FileText className="h-3.5 w-3.5" />
              Assessment
            </div>
            <p className="text-sm font-semibold text-brand-heading line-clamp-1">
              {assessment.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {totalPoints} pts
              </Badge>
              <span className="text-xs text-brand-light-accent-1">{duration}</span>
            </div>
          </div>
        </div>

        {assessment.description && (
          <div className="mt-4 pt-4 border-t border-brand-border">
            <p className="text-xs font-medium text-brand-light-accent-1 mb-1">
              Description
            </p>
            <p className="text-sm text-brand-heading">{assessment.description}</p>
          </div>
        )}

        {assessment.instructions && (
          <div className="mt-3">
            <p className="text-xs font-medium text-brand-light-accent-1 mb-1">
              Instructions
            </p>
            <p className="text-sm text-brand-heading whitespace-pre-wrap">
              {assessment.instructions}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
