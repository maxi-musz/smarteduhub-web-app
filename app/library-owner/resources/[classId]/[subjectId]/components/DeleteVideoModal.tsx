"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteVideo } from "@/hooks/content/use-delete-video";
import { TopicVideo } from "@/hooks/topics/use-topic-materials";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: TopicVideo | null;
}

export const DeleteVideoModal = ({
  isOpen,
  onClose,
  video,
}: DeleteVideoModalProps) => {
  const deleteVideo = useDeleteVideo();

  const handleDelete = async () => {
    if (!video) return;

    try {
      await deleteVideo.mutateAsync(video.id);
      toast.success("Video deleted successfully");
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete video. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!deleteVideo.isPending) {
      onClose();
    }
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Video</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-brand-heading mb-2">
            Are you sure you want to delete this video?
          </p>
          <div className="bg-gray-50 border border-brand-border rounded-lg p-3">
            <p className="font-medium text-sm text-brand-heading">
              {video.title}
            </p>
            {video.durationSeconds > 0 && (
              <p className="text-xs text-brand-light-accent-1 mt-1">
                Duration: {Math.floor(video.durationSeconds / 60)}:
                {(video.durationSeconds % 60).toString().padStart(2, "0")}
              </p>
            )}
          </div>
          <p className="text-xs text-brand-light-accent-1 mt-3">
            <strong>Note:</strong> Remaining videos will be automatically
            reordered to maintain sequential order numbers.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteVideo.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteVideo.isPending}
          >
            {deleteVideo.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Video
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

