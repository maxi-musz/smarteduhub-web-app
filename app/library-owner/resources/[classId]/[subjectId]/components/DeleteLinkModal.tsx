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
import { useDeleteLink } from "@/hooks/content/use-delete-link";
import { TopicLink } from "@/hooks/topics/use-topic-materials";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: TopicLink | null;
}

export const DeleteLinkModal = ({
  isOpen,
  onClose,
  link,
}: DeleteLinkModalProps) => {
  const deleteLink = useDeleteLink();

  const handleDelete = async () => {
    if (!link) return;

    try {
      await deleteLink.mutateAsync(link.id);
      toast.success("Link deleted successfully");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to delete link. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!deleteLink.isPending) {
      onClose();
    }
  };

  if (!link) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Link</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-brand-heading mb-2">
            Are you sure you want to delete this link?
          </p>
          <div className="bg-gray-50 border border-brand-border rounded-lg p-3">
            <p className="font-medium text-sm text-brand-heading">
              {link.title}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-brand-light-accent-1">
              <span>{link.domain}</span>
              {link.linkType && (
                <>
                  <span>•</span>
                  <span>{link.linkType}</span>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-brand-light-accent-1 mt-3">
            <strong>Note:</strong> Remaining links will be automatically reordered to maintain sequential order numbers.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteLink.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteLink.isPending}
          >
            {deleteLink.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Link
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

