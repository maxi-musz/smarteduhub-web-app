"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ClipboardList, Eye, Edit, Trash2, Users, FileQuestion, Send, X } from "lucide-react";
import type { Assessment } from "@/hooks/teacher/use-teacher-assessments";
import { useDeleteAssessment, usePublishAssessment, useUnpublishAssessment } from "@/hooks/teacher/use-teacher-assessments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

interface AssessmentListProps {
  assessments: Assessment[];
  isLoading: boolean;
  selectedSubjectId: string;
}

export const AssessmentList = ({
  assessments,
  isLoading,
}: AssessmentListProps) => {
  // Ensure assessments is always an array
  const safeAssessments = Array.isArray(assessments) ? assessments : [];
  const router = useRouter();
  const deleteMutation = useDeleteAssessment();
  const publishMutation = usePublishAssessment();
  const unpublishMutation = useUnpublishAssessment();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [assessmentToPublish, setAssessmentToPublish] = useState<string | null>(null);
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
  const [assessmentToUnpublish, setAssessmentToUnpublish] = useState<string | null>(null);

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
      case "ARCHIVED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CBT":
        return "bg-indigo-100 text-indigo-800";
      case "QUIZ":
        return "bg-pink-100 text-pink-800";
      case "EXAM":
        return "bg-red-100 text-red-800";
      case "ASSIGNMENT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (id: string) => {
    setAssessmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (assessmentToDelete) {
      deleteMutation.mutate(assessmentToDelete);
      setDeleteDialogOpen(false);
      setAssessmentToDelete(null);
    }
  };

  const handlePublish = (id: string) => {
    setAssessmentToPublish(id);
    setPublishDialogOpen(true);
  };

  const confirmPublish = () => {
    if (assessmentToPublish) {
      publishMutation.mutate(assessmentToPublish);
      setPublishDialogOpen(false);
      setAssessmentToPublish(null);
    }
  };

  const handleUnpublish = (id: string) => {
    setAssessmentToUnpublish(id);
    setUnpublishDialogOpen(true);
  };

  const confirmUnpublish = () => {
    if (assessmentToUnpublish) {
      unpublishMutation.mutate(assessmentToUnpublish);
      setUnpublishDialogOpen(false);
      setAssessmentToUnpublish(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (safeAssessments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-500 mb-4">
            Create your first assessment to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPublishing = publishMutation.isPending;
  const isUnpublishing = unpublishMutation.isPending;
  const showLoader = isPublishing || isUnpublishing;
  const loadingMessage = isPublishing 
    ? "Publishing assessment..." 
    : isUnpublishing 
    ? "Unpublishing assessment..." 
    : undefined;

  return (
    <>
      <FullScreenLoader isLoading={showLoader} message={loadingMessage} />
      <div className="space-y-4">
        {safeAssessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{assessment.title}</CardTitle>
                  {assessment.description && (
                    <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status}
                    </Badge>
                    <Badge className={getTypeColor(assessment.assessment_type)}>
                      {assessment.assessment_type}
                    </Badge>
                    {assessment.topic && (
                      <Badge variant="outline">{assessment.topic.title}</Badge>
                    )}
                    {assessment._count && (
                      <>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FileQuestion className="h-4 w-4" />
                          <span>{assessment._count.questions} questions</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{assessment._count.attempts} attempts</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/student/assessments/${assessment.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {assessment.status === "DRAFT" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/student/assessments/${assessment.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {(assessment.status === "PUBLISHED" || assessment.status === "ACTIVE") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnpublish(assessment.id)}
                      disabled={unpublishMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Unpublish
                    </Button>
                  )}
                  {assessment.status === "DRAFT" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePublish(assessment.id)}
                      disabled={
                        publishMutation.isPending ||
                        (assessment._count?.questions || 0) < 5
                      }
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  {assessment.status === "DRAFT" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(assessment.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium">
                    {assessment.duration ? `${assessment.duration} min` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Points:</span>
                  <span className="ml-2 font-medium">{assessment.total_points}</span>
                </div>
                <div>
                  <span className="text-gray-500">Passing:</span>
                  <span className="ml-2 font-medium">{assessment.passing_score}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Max Attempts:</span>
                  <span className="ml-2 font-medium">{assessment.max_attempts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assessment? This action cannot be undone.
              If students have already attempted this assessment, it cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent className="max-w-lg w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Publish this assessment?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Once published, this assessment will be visible to all students and they will be able to attempt it.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-3">
                <li>Students will be able to see and access this assessment</li>
                <li>You can still make changes, but they will affect all students</li>
                <li>You can unpublish the assessment later if needed</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-row justify-end gap-2">
            <AlertDialogCancel disabled={publishMutation.isPending} className="mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPublish}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? "Publishing..." : "Confirm & Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={unpublishDialogOpen} onOpenChange={setUnpublishDialogOpen}>
        <AlertDialogContent className="max-w-lg w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish this assessment?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Unpublishing this assessment will hide it from students. They will no longer be able to access or attempt it.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-3">
                <li>Students will no longer see this assessment</li>
                <li>Existing attempts and results will be preserved</li>
                <li>You can publish it again later</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-row justify-end gap-2">
            <AlertDialogCancel disabled={unpublishMutation.isPending} className="mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnpublish}
              disabled={unpublishMutation.isPending}
            >
              {unpublishMutation.isPending ? "Unpublishing..." : "Confirm & Unpublish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

