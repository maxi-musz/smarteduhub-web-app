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
import { useDeleteExamBodyYear } from "@/hooks/exam-body/use-exam-body-years";
import type { ExamBodyYear } from "@/hooks/exam-body/types";

interface YearDeleteDialogProps {
  open: boolean;
  examBodyId: string;
  year: ExamBodyYear | null;
  onOpenChange: (open: boolean) => void;
}

export const YearDeleteDialog = ({
  open,
  examBodyId,
  year,
  onOpenChange,
}: YearDeleteDialogProps) => {
  const deleteMutation = useDeleteExamBodyYear(examBodyId);

  const handleConfirm = () => {
    if (!year) return;
    deleteMutation.mutate(year.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Year</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{year?.year}</span>? This action cannot
            be undone.
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
