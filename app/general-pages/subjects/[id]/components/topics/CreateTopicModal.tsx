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
import { useCreateTeacherTopic } from "@/hooks/teacher/use-teacher-topics";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  academicSessionId?: string; // Optional - will use current active session if not provided
}

export const CreateTopicModal = ({
  isOpen,
  onClose,
  subjectId,
  academicSessionId,
}: CreateTopicModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    instructions?: string;
  }>({});

  // Check if form is valid for button enable/disable
  const isFormValid = title.trim().length >= 3 && title.trim().length <= 200;

  const createTopic = useCreateTeacherTopic();

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
      instructions?: string;
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

    // Validate instructions
    if (instructions && instructions.length > 2000) {
      newErrors.instructions = "Instructions must be 2000 characters or less";
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
        subject_id: subjectId,
        title: formatTopicTitle(title.trim()),
        description: description.trim() ? formatDescription(description.trim()) : undefined,
        instructions: instructions.trim() ? formatDescription(instructions.trim()) : undefined,
        is_active: isActive,
        academic_session_id: academicSessionId,
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
    setInstructions("");
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
              placeholder="e.g., Introduction to Algebra"
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

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                if (errors.instructions) {
                  setErrors((prev) => ({ ...prev, instructions: undefined }));
                }
              }}
              placeholder="Instructions for students (e.g., Watch the videos and complete the exercises)..."
              rows={3}
              maxLength={2000}
              className={errors.instructions ? "border-red-500" : ""}
            />
            {errors.instructions && (
              <p className="text-xs text-red-500">{errors.instructions}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {instructions.length}/2000 characters
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

