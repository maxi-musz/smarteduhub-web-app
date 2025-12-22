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
import { useDeleteMaterial } from "@/hooks/content/use-delete-material";
import { TopicMaterial } from "@/hooks/topics/use-topic-materials";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: TopicMaterial | null;
}

export const DeleteMaterialModal = ({
  isOpen,
  onClose,
  material,
}: DeleteMaterialModalProps) => {
  const deleteMaterial = useDeleteMaterial();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const handleDelete = async () => {
    if (!material) return;

    try {
      await deleteMaterial.mutateAsync(material.id);
      toast.success("Material deleted successfully");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to delete material. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!deleteMaterial.isPending) {
      onClose();
    }
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Material</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-brand-heading mb-2">
            Are you sure you want to delete this material?
          </p>
          <div className="bg-gray-50 border border-brand-border rounded-lg p-3">
            <p className="font-medium text-sm text-brand-heading">
              {material.title}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-brand-light-accent-1">
              <span>{material.materialType || "File"}</span>
              <span>•</span>
              <span>{formatFileSize(material.sizeBytes)}</span>
              {material.pageCount > 0 && (
                <>
                  <span>•</span>
                  <span>{material.pageCount} {material.pageCount === 1 ? "page" : "pages"}</span>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-brand-light-accent-1 mt-3">
            <strong>Note:</strong> The file will be permanently deleted from storage, and remaining materials will be automatically reordered to maintain sequential order numbers.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteMaterial.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMaterial.isPending}
          >
            {deleteMaterial.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Material
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

