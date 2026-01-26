"use client";

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
import { useDeleteExamBodyAssessment } from "@/hooks/exam-body/use-exam-body-assessments";
import type { ExamBodyAssessment } from "@/hooks/exam-body/types";

interface AssessmentDeleteDialogProps {
  open: boolean;
  examBodyId: string;
  assessment: ExamBodyAssessment | null;
  onOpenChange: (open: boolean) => void;
}

export const AssessmentDeleteDialog = ({
  open,
  examBodyId,
  assessment,
  onOpenChange,
}: AssessmentDeleteDialogProps) => {
  const deleteMutation = useDeleteExamBodyAssessment(examBodyId);

  const handleConfirm = () => {
    if (!assessment) return;
    deleteMutation.mutate(assessment.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{assessment?.title}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
