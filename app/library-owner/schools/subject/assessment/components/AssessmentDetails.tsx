"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, X } from "lucide-react";
import type { LibrarySchoolAssessment } from "../hooks/use-library-school-assessments";
import {
  usePublishLibrarySchoolAssessment,
  useUnpublishLibrarySchoolAssessment,
} from "../hooks/use-library-school-assessments";

interface AssessmentDetailsProps {
  schoolId: string;
  assessment: LibrarySchoolAssessment;
  questionsCount?: number;
}

export function AssessmentDetails({ schoolId, assessment, questionsCount }: AssessmentDetailsProps) {
  const publishMutation = usePublishLibrarySchoolAssessment(schoolId);
  const unpublishMutation = useUnpublishLibrarySchoolAssessment(schoolId);

  const count = questionsCount ?? assessment._count?.questions ?? 0;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "PUBLISHED": return "bg-blue-100 text-blue-800";
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "CLOSED": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{assessment.title}</CardTitle>
              {assessment.description && (
                <p className="text-sm text-brand-light-accent-1 mt-1">{assessment.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                <Badge variant="outline">{assessment.assessment_type}</Badge>
                <span className="text-sm text-brand-light-accent-1">{count} questions</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {assessment.status === "DRAFT" && (
                <Button size="sm" onClick={() => publishMutation.mutate(assessment.id)} disabled={publishMutation.isPending || count < 5}>
                  <Send className="h-4 w-4 mr-1" /> Publish
                </Button>
              )}
              {(assessment.status === "PUBLISHED" || assessment.status === "ACTIVE") && (
                <Button size="sm" variant="outline" onClick={() => unpublishMutation.mutate(assessment.id)} disabled={unpublishMutation.isPending}>
                  <X className="h-4 w-4 mr-1" /> Unpublish
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-brand-light-accent-1">Duration</span><br />{assessment.duration ? `${assessment.duration} min` : "N/A"}</div>
            <div><span className="text-brand-light-accent-1">Total points</span><br />{assessment.total_points}</div>
            <div><span className="text-brand-light-accent-1">Passing score</span><br />{assessment.passing_score}%</div>
            <div><span className="text-brand-light-accent-1">Max attempts</span><br />{assessment.max_attempts}</div>
          </div>
          {assessment.instructions && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-brand-light-accent-1 mb-1">Instructions</p>
              <p className="text-sm">{assessment.instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
