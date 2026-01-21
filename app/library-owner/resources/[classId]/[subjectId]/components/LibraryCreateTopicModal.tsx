"use client";

import React, { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useCreateLibraryTopic } from "@/hooks/library-owner/use-library-topics";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface LibraryCreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
}

export const LibraryCreateTopicModal = ({
  isOpen,
  onClose,
  subjectId,
}: LibraryCreateTopicModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  // Check if form is valid for button enable/disable
  const isFormValid = title.trim().length >= 3 && title.trim().length <= 200;

  const createTopic = useCreateLibraryTopic();

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
    } = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = "Topic title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Topic title must be at least 3 characters";
    } else if (title.length > 200) {
      newErrors.title = "Topic title must be 200 characters or less";
    }

    // Validate description
    if (description && description.length > 2000) {
      newErrors.description = "Description must be 2000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createTopic.mutateAsync({
        subjectId,
        title: formatTopicTitle(title.trim()),
        description: description.trim() ? formatDescription(description.trim()) : undefined,
        is_active: isActive,
      });

      toast.success("Topic created successfully");
      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create topic. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setIsActive(true);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="e.g., Introduction to Variables"
              maxLength={200}
              required
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {title.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              placeholder="Brief description of what this topic covers..."
              rows={4}
              maxLength={2000}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {description.length}/2000 characters
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="cursor-pointer">
              Active Status
            </Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTopic.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTopic.isPending || !isFormValid}>
              {createTopic.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Topic"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
