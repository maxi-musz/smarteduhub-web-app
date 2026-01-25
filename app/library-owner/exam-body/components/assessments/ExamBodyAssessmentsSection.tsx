"use client";

import { useMemo, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExamBodySubjects } from "@/hooks/exam-body/use-exam-body-subjects";
import { useExamBodyYears } from "@/hooks/exam-body/use-exam-body-years";
import {
  useExamBodyAssessments,
  usePublishExamBodyAssessment,
  useUnpublishExamBodyAssessment,
} from "@/hooks/exam-body/use-exam-body-assessments";
import type { ExamBodyAssessment } from "@/hooks/exam-body/types";
import { AssessmentFormDialog } from "./AssessmentFormDialog";
import { AssessmentDeleteDialog } from "./AssessmentDeleteDialog";

interface ExamBodyAssessmentsSectionProps {
  examBodyId: string;
}

const typeClass = (type: string) => {
  switch (type) {
    case "EXAM":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const ExamBodyAssessmentsSection = ({
  examBodyId,
}: ExamBodyAssessmentsSectionProps) => {
  const { toast } = useToast();
  const { data: subjectsData } = useExamBodySubjects(examBodyId);
  const { data: yearsData } = useExamBodyYears(examBodyId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);

  const { data, isLoading } = useExamBodyAssessments(examBodyId, {
    subjectId: selectedSubjectId || undefined,
    yearId: selectedYearId || undefined,
  });

  const publishMutation = usePublishExamBodyAssessment(examBodyId);
  const unpublishMutation = useUnpublishExamBodyAssessment(examBodyId);

  const assessments = useMemo(() => data || [], [data]);
  const subjects = subjectsData || [];
  const years = yearsData || [];

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] =
    useState<ExamBodyAssessment | null>(null);
  const [deletingAssessment, setDeletingAssessment] =
    useState<ExamBodyAssessment | null>(null);

  const handleCreateClick = () => {
    if (!selectedSubjectId || !selectedYearId) {
      toast({
        title: "Select subject and year",
        description: "Choose a subject and year before creating an assessment.",
        variant: "destructive",
      });
      return;
    }
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-heading">Assessments</h3>
          <p className="text-sm text-brand-light-accent-1">
            Build exam body assessments tied to subjects and years.
          </p>
        </div>
        <Button size="sm" onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Assessment
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="exam-body-assessment-filter-subject">Subject</Label>
          <Select
            value={selectedSubjectId || "all"}
            onValueChange={(value) =>
              setSelectedSubjectId(value === "all" ? null : value)
            }
          >
            <SelectTrigger id="exam-body-assessment-filter-subject">
              <SelectValue placeholder="Filter by subject" />
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
          <Label htmlFor="exam-body-assessment-filter-year">Year</Label>
          <Select
            value={selectedYearId || "all"}
            onValueChange={(value) =>
              setSelectedYearId(value === "all" ? null : value)
            }
          >
            <SelectTrigger id="exam-body-assessment-filter-year">
              <SelectValue placeholder="Filter by year" />
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

      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
            No assessments match the selected filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="border-brand-border">
              <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-brand-heading">
                      {assessment.title}
                    </p>
                    <Badge className={typeClass(assessment.assessmentType)}>
                      {assessment.assessmentType}
                    </Badge>
                    <Badge
                      className={
                        assessment.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {assessment.isPublished ? "Published" : "Draft"}
                    </Badge>
                    {assessment.subject && (
                      <Badge variant="outline">{assessment.subject.name}</Badge>
                    )}
                    {assessment.year && (
                      <Badge variant="outline">{assessment.year.year}</Badge>
                    )}
                  </div>
                  {assessment.description && (
                    <p className="text-sm text-brand-light-accent-1 mt-1">
                      {assessment.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-brand-light-accent-1 mt-2">
                    <span>Duration: {assessment.duration ?? "N/A"} mins</span>
                    <span>Points: {assessment.totalPoints}</span>
                    <span>Passing: {assessment.passingScore}%</span>
                    <span>Max Attempts: {assessment.maxAttempts}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`publish-${assessment.id}`}
                      checked={assessment.isPublished}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          publishMutation.mutate(assessment.id);
                        } else {
                          unpublishMutation.mutate(assessment.id);
                        }
                      }}
                      disabled={
                        publishMutation.isPending || unpublishMutation.isPending
                      }
                    />
                    <Label htmlFor={`publish-${assessment.id}`}>
                      {assessment.isPublished ? "Published" : "Draft"}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingAssessment(assessment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingAssessment(assessment)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AssessmentFormDialog
        open={isCreateOpen}
        mode="create"
        examBodyId={examBodyId}
        subjects={subjects}
        years={years}
        defaultSubjectId={selectedSubjectId}
        defaultYearId={selectedYearId}
        onOpenChange={setIsCreateOpen}
      />

      <AssessmentFormDialog
        open={!!editingAssessment}
        mode="edit"
        examBodyId={examBodyId}
        assessment={editingAssessment}
        subjects={subjects}
        years={years}
        onOpenChange={(open) => {
          if (!open) setEditingAssessment(null);
        }}
      />

      <AssessmentDeleteDialog
        open={!!deletingAssessment}
        examBodyId={examBodyId}
        assessment={deletingAssessment}
        onOpenChange={(open) => {
          if (!open) setDeletingAssessment(null);
        }}
      />
    </div>
  );
};
