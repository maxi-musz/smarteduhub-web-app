"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteQuestion } from "@/hooks/assessment/use-cbt-questions";
import { Loader2, AlertTriangle } from "lucide-react";
import { CBT, Question } from "@/hooks/assessment/use-cbt-types";

interface DeleteQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cbt: CBT;
  question: Question;
  onSuccess: () => void;
}

export const DeleteQuestionDialog = ({
  isOpen,
  onClose,
  cbt,
  question,
  onSuccess,
}: DeleteQuestionDialogProps) => {
  const deleteQuestion = useDeleteQuestion();

  const handleDelete = async () => {
    try {
      await deleteQuestion.mutateAsync({
        cbtId: cbt.id,
        questionId: question.id,
      });
      onClose();
      onSuccess();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Question
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-brand-light-accent-1 mb-4">
            Are you sure you want to delete this question? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-brand-heading mb-1">
              Question #{question.order}
            </p>
            <p className="text-xs text-brand-light-accent-1 line-clamp-2">
              {question.questionText}
            </p>
          </div>

          {cbt._count.attempts > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This CBT has {cbt._count.attempts} attempt(s). 
                Questions cannot be deleted when a CBT has attempts.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteQuestion.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteQuestion.isPending || cbt._count.attempts > 0}
          >
            {deleteQuestion.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Question"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

