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
import { useDeleteExamBodySubject } from "@/hooks/exam-body/use-exam-body-subjects";
import type { ExamBodySubject } from "@/hooks/exam-body/types";

interface SubjectDeleteDialogProps {
  open: boolean;
  examBodyId: string;
  subject: ExamBodySubject | null;
  onOpenChange: (open: boolean) => void;
}

export const SubjectDeleteDialog = ({
  open,
  examBodyId,
  subject,
  onOpenChange,
}: SubjectDeleteDialogProps) => {
  const deleteMutation = useDeleteExamBodySubject(examBodyId);

  const handleConfirm = () => {
    if (!subject) return;
    deleteMutation.mutate(subject.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{subject?.name}</span>? This action
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
