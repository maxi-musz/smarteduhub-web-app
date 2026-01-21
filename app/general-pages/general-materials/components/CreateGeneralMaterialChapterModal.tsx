"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateAiBookChapter } from "@/hooks/general-materials/use-general-material-mutations";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatChapterTitle, formatDescription } from "@/lib/text-formatter";

interface CreateGeneralMaterialChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId: string;
  onSuccess?: () => void;
}

export const CreateGeneralMaterialChapterModal = ({
  isOpen,
  onClose,
  materialId,
  onSuccess,
}: CreateGeneralMaterialChapterModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageStart, setPageStart] = useState<string>("");
  const [pageEnd, setPageEnd] = useState<string>("");

  const createChapter = useCreateAiBookChapter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    if (title.length > 200) {
      toast.error("Chapter title must be 200 characters or less");
      return;
    }

    if (description && description.length > 2000) {
      toast.error("Description must be 2000 characters or less");
      return;
    }

    // Validate page numbers if provided
    let parsedPageStart: number | undefined;
    let parsedPageEnd: number | undefined;

    if (pageStart.trim()) {
      parsedPageStart = parseInt(pageStart.trim(), 10);
      if (isNaN(parsedPageStart) || parsedPageStart < 1) {
        toast.error("Starting page must be a number greater than or equal to 1");
        return;
      }
    }

    if (pageEnd.trim()) {
      parsedPageEnd = parseInt(pageEnd.trim(), 10);
      if (isNaN(parsedPageEnd) || parsedPageEnd < 1) {
        toast.error("Ending page must be a number greater than or equal to 1");
        return;
      }
    }

    // Validate that pageStart <= pageEnd if both are provided
    if (parsedPageStart !== undefined && parsedPageEnd !== undefined) {
      if (parsedPageStart > parsedPageEnd) {
        toast.error("Starting page must be less than or equal to ending page");
        return;
      }
    }

    try {
      await createChapter.mutateAsync({
        materialId,
        title: formatChapterTitle(title),
        description: description.trim() ? formatDescription(description) : undefined,
        pageStart: parsedPageStart,
        pageEnd: parsedPageEnd,
      });

      toast.success("Chapter created successfully");
      handleClose();
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create chapter. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPageStart("");
    setPageEnd("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 1: Introduction to Algebra"
              maxLength={200}
              required
              disabled={createChapter.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {title.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this chapter covers..."
              rows={4}
              maxLength={2000}
              disabled={createChapter.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {description.length}/2000 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageStart">Starting Page (Optional)</Label>
              <Input
                id="pageStart"
                type="number"
                min="1"
                value={pageStart}
                onChange={(e) => setPageStart(e.target.value)}
                placeholder="e.g., 1"
                disabled={createChapter.isPending}
              />
              <p className="text-xs text-brand-light-accent-1">
                Page number where this chapter starts in the material
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageEnd">Ending Page (Optional)</Label>
              <Input
                id="pageEnd"
                type="number"
                min="1"
                value={pageEnd}
                onChange={(e) => setPageEnd(e.target.value)}
                placeholder="e.g., 20"
                disabled={createChapter.isPending}
              />
              <p className="text-xs text-brand-light-accent-1">
                Page number where this chapter ends in the material
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Page ranges are optional and help with AI chunking and context understanding. 
              If not specified, the chapter will still be created with automatic ordering.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createChapter.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createChapter.isPending}>
              {createChapter.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Chapter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

