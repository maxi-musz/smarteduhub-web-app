"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCBT } from "@/hooks/assessment/use-cbt";
import { Loader2, AlertTriangle } from "lucide-react";
import { CBT } from "@/hooks/assessment/use-cbt-types";

interface DeleteCBTDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cbt: CBT;
  onSuccess: () => void;
}

export const DeleteCBTDialog = ({
  isOpen,
  onClose,
  cbt,
  onSuccess,
}: DeleteCBTDialogProps) => {
  const deleteCBT = useDeleteCBT();

  const handleDelete = async () => {
    try {
      await deleteCBT.mutateAsync(cbt.id);
      onClose();
      onSuccess();
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete CBT Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-brand-light-accent-1 mb-4">
            Are you sure you want to delete <strong>{cbt.title}</strong>? This action cannot be undone.
          </p>
          
          {cbt._count.attempts > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This CBT has {cbt._count.attempts} attempt(s). 
                CBTs with attempts cannot be deleted. Consider archiving instead.
              </p>
            </div>
          )}

          {cbt._count.questions > 0 && (
            <p className="text-xs text-brand-light-accent-1">
              This CBT contains {cbt._count.questions} question(s) that will also be deleted.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteCBT.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCBT.isPending || cbt._count.attempts > 0}
          >
            {deleteCBT.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete CBT"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

