"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Clock, BookOpen, Calendar } from "lucide-react";
import type {
  ExploreExamBodyAssessment,
  ExploreExamBodySubject,
  ExploreExamBodyYear,
} from "@/hooks/explore/use-explore-exam-bodies";

interface ExamBodyAssessmentsListProps {
  examBodyId: string;
  assessments: ExploreExamBodyAssessment[];
  subjects: ExploreExamBodySubject[];
  years: ExploreExamBodyYear[];
  selectedSubjectId: string | null;
  selectedYearId: string | null;
  onSubjectChange: (subjectId: string | null) => void;
  onYearChange: (yearId: string | null) => void;
}

export const ExamBodyAssessmentsList = ({
  examBodyId,
  assessments,
  subjects,
  years,
  selectedSubjectId,
  selectedYearId,
  onSubjectChange,
  onYearChange,
}: ExamBodyAssessmentsListProps) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject-filter">Filter by Subject</Label>
          <Select
            value={selectedSubjectId || "all"}
            onValueChange={(value) =>
              onSubjectChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger id="subject-filter">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year-filter">Filter by Year</Label>
          <Select
            value={selectedYearId || "all"}
            onValueChange={(value) =>
              onYearChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger id="year-filter">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assessments List */}
      {assessments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
            No assessments available for the selected filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="border-brand-border hover:border-brand-primary/50 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-brand-heading text-lg">
                        {assessment.title}
                      </h3>
                      <Badge variant="outline">{assessment.assessmentType}</Badge>
                    </div>

                    {assessment.description && (
                      <p className="text-sm text-brand-light-accent-1 mb-4">
                        {assessment.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-brand-light-accent-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{assessment.subject.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{assessment.year.year}</span>
                      </div>
                      {assessment.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{Math.floor(assessment.duration / 60)} minutes</span>
                        </div>
                      )}
                      {assessment.maxAttempts && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>
                            {assessment.maxAttempts}{" "}
                            {assessment.maxAttempts === 1
                              ? "attempt"
                              : "attempts"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      router.push(
                        `/explore/exam-bodies/${examBodyId}/assessments/${assessment.id}`
                      )
                    }
                  >
                    View Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
