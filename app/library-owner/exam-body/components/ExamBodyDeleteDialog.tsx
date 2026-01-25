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
import { useDeleteExamBody } from "@/hooks/exam-body/use-exam-bodies";
import type { ExamBody } from "@/hooks/exam-body/types";

interface ExamBodyDeleteDialogProps {
  open: boolean;
  examBody: ExamBody | null;
  onOpenChange: (open: boolean) => void;
}

export const ExamBodyDeleteDialog = ({
  open,
  examBody,
  onOpenChange,
}: ExamBodyDeleteDialogProps) => {
  const deleteMutation = useDeleteExamBody();

  const handleConfirm = () => {
    if (!examBody) return;
    deleteMutation.mutate(examBody.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exam Body</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{examBody?.name}</span>? This action
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
