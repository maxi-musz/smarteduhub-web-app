"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePublishAssessment, useUnpublishAssessment, useReleaseResults, type Assessment } from "@/hooks/use-teacher-assessments";
import { Send, X, CheckCircle, Edit } from "lucide-react";
import { useState } from "react";
import { EditAssessmentDialog } from "./EditAssessmentDialog";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

interface AssessmentDetailsProps {
  assessment: Assessment;
  questionsCount?: number;
}

export const AssessmentDetails = ({ assessment, questionsCount }: AssessmentDetailsProps) => {
  // Use questionsCount if provided, otherwise fall back to assessment._count?.questions
  const actualQuestionsCount = questionsCount ?? assessment._count?.questions ?? 0;
  const publishMutation = usePublishAssessment();
  const unpublishMutation = useUnpublishAssessment();
  const releaseMutation = useReleaseResults();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePublish = () => {
    publishMutation.mutate(assessment.id);
  };

  const handleUnpublish = () => {
    unpublishMutation.mutate(assessment.id);
  };

  const handleReleaseResults = () => {
    if (confirm("Are you sure you want to release results? This will close the assessment and students will see their scores and correct answers.")) {
      releaseMutation.mutate(assessment.id);
    }
  };

  const isPublishing = publishMutation.isPending;
  const isUnpublishing = unpublishMutation.isPending;
  const isLoading = isPublishing || isUnpublishing;
  const loadingMessage = isPublishing 
    ? "Publishing assessment..." 
    : isUnpublishing 
    ? "Unpublishing assessment..." 
    : undefined;

  return (
    <>
      <FullScreenLoader isLoading={isLoading} message={loadingMessage} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assessment Information</CardTitle>
                {assessment.status === "DRAFT" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{assessment.title}</h3>
                {assessment.description && (
                  <p className="text-gray-600 mb-4">{assessment.description}</p>
                )}
                {assessment.instructions && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-1">Instructions:</p>
                    <p className="text-sm text-blue-800">{assessment.instructions}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(assessment.status)}>
                  {assessment.status}
                </Badge>
                <Badge variant="outline">{assessment.assessment_type}</Badge>
                <Badge variant="outline">{assessment.grading_type}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">
                    {assessment.duration ? `${assessment.duration} min` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Points</p>
                  <p className="font-medium">{assessment.total_points}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passing Score</p>
                  <p className="font-medium">{assessment.passing_score}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Attempts</p>
                  <p className="font-medium">{assessment.max_attempts}</p>
                </div>
              </div>

              {assessment.subject && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-1">Subject</p>
                  <p className="font-medium">
                    {assessment.subject.name} {assessment.subject.code && `(${assessment.subject.code})`}
                  </p>
                </div>
              )}

              {assessment.topic && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Topic</p>
                  <p className="font-medium">{assessment.topic.title}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${assessment.shuffle_questions ? "text-green-600" : "text-gray-400"}`} />
                  <span>Shuffle Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${assessment.shuffle_options ? "text-green-600" : "text-gray-400"}`} />
                  <span>Shuffle Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${assessment.show_correct_answers ? "text-green-600" : "text-gray-400"}`} />
                  <span>Show Correct Answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${assessment.show_feedback ? "text-green-600" : "text-gray-400"}`} />
                  <span>Show Feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${assessment.allow_review ? "text-green-600" : "text-gray-400"}`} />
                  <span>Allow Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${assessment.auto_submit ? "text-green-600" : "text-gray-400"}`} />
                  <span>Auto Submit</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.status === "DRAFT" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={
                        publishMutation.isPending ||
                        actualQuestionsCount < 5
                      }
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish Assessment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Publish this assessment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Publishing will make this assessment visible and accessible to all eligible students. 
                        After publishing:
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
                      <li>Students will be able to see and attempt this assessment according to its schedule.</li>
                      <li>Any changes to questions after students start attempting may affect grading and reporting.</li>
                      <li>You can still unpublish later if you need to temporarily hide it from students.</li>
                    </ul>
                    <AlertDialogFooter className="mt-4">
                      <AlertDialogCancel disabled={publishMutation.isPending}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handlePublish}
                        disabled={publishMutation.isPending}
                      >
                        {publishMutation.isPending ? "Publishing..." : "Confirm & Publish"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {assessment.status === "PUBLISHED" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleUnpublish}
                  disabled={unpublishMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Unpublish
                </Button>
              )}

              {(assessment.status === "PUBLISHED" || assessment.status === "ACTIVE") && !assessment.is_result_released && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleReleaseResults}
                  disabled={releaseMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Release Results
                </Button>
              )}

              {assessment.is_result_released && (
                <div className="p-3 bg-green-50 rounded-md text-sm text-green-800">
                  Results have been released
                </div>
              )}

              {actualQuestionsCount < 5 &&
                assessment.status === "DRAFT" && (
                <p className="text-sm text-amber-600">
                  Add at least 5 questions before publishing
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-2xl font-bold">{actualQuestionsCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Attempts</p>
                <p className="text-2xl font-bold">{assessment._count?.attempts || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditAssessmentDialog
        assessment={assessment}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
};

