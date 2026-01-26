"use client";

import React from "react";
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
import { useDeleteLibraryTopic } from "@/hooks/library-owner/use-library-topics";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LibraryDeleteTopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  topicTitle: string;
  subjectId?: string;
  classId?: string;
}

export const LibraryDeleteTopicDialog = ({
  isOpen,
  onClose,
  topicId,
  topicTitle,
  subjectId,
  classId,
}: LibraryDeleteTopicDialogProps) => {
  const deleteTopic = useDeleteLibraryTopic();

  const handleDelete = async () => {
    try {
      await deleteTopic.mutateAsync({ topicId, subjectId, classId });
      toast.success("Topic deleted successfully");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete topic. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Topic</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{topicTitle}&quot;? This action
            cannot be undone. The topic must not have any associated content
            (videos, materials, links, etc.) to be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTopic.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTopic.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteTopic.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
