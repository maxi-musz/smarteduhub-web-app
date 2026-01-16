"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useDeleteTeacher } from "@/hooks/use-teachers-data";

interface DeleteTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string | null;
}

export const DeleteTeacherModal = ({
  open,
  onOpenChange,
  teacherId,
}: DeleteTeacherModalProps) => {
  const deleteTeacherMutation = useDeleteTeacher();

  const handleDeleteTeacher = async () => {
    if (!teacherId) return;
    try {
      await deleteTeacherMutation.mutateAsync(teacherId);
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  if (!teacherId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Delete Teacher
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this teacher? This action cannot be undone.
            The teacher will be marked as inactive.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteTeacherMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteTeacher}
            disabled={deleteTeacherMutation.isPending}
          >
            {deleteTeacherMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

