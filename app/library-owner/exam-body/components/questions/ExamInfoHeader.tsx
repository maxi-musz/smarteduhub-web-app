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
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-brand-primary" />
          <h3 className="text-sm font-semibold text-brand-heading">Exam Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
              <BookOpen className="h-3 w-3" />
              Exam Body
            </div>
            <p className="text-xs font-semibold text-brand-heading">{examBody.name}</p>
            <p className="text-[10px] text-brand-light-accent-1 line-clamp-1">{examBody.fullName}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
              <Calendar className="h-3 w-3" />
              Year
            </div>
            <p className="text-xs font-semibold text-brand-heading">{year}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
              <BookOpen className="h-3 w-3" />
              Subject
            </div>
            <p className="text-xs font-semibold text-brand-heading">{subjectName}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
              <Hash className="h-3 w-3" />
              Questions
            </div>
            <p className="text-xs font-semibold text-brand-heading">{questionTotal}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
              <FileText className="h-3 w-3" />
              Assessment
            </div>
            <p className="text-xs font-semibold text-brand-heading line-clamp-1">
              {assessment.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                {totalPoints} pts
              </Badge>
              <span className="text-[10px] text-brand-light-accent-1">{duration}</span>
            </div>
          </div>
        </div>

        {(assessment.description || assessment.instructions) && (
          <div className="mt-2 pt-2 border-t border-brand-border">
            {assessment.description && (
              <div className="mb-2">
                <p className="text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
                  Description
                </p>
                <p className="text-xs text-brand-heading line-clamp-2">{assessment.description}</p>
              </div>
            )}
            {assessment.instructions && (
              <div>
                <p className="text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
                  Instructions
                </p>
                <p className="text-xs text-brand-heading line-clamp-2 whitespace-pre-wrap">
                  {assessment.instructions}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
