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
import { useDeleteExamBodyQuestion } from "@/hooks/exam-body/use-exam-body-questions";
import type { ExamBodyQuestionListItem } from "@/hooks/exam-body/types";

interface QuestionDeleteDialogProps {
  open: boolean;
  examBodyId: string;
  assessmentId: string;
  question: ExamBodyQuestionListItem | null;
  onOpenChange: (open: boolean) => void;
}

export const QuestionDeleteDialog = ({
  open,
  examBodyId,
  assessmentId,
  question,
  onOpenChange,
}: QuestionDeleteDialogProps) => {
  const deleteMutation = useDeleteExamBodyQuestion(examBodyId, assessmentId);

  const handleConfirm = () => {
    if (!question) return;
    deleteMutation.mutate(question.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Question</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this question? This action cannot be
            undone.
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
