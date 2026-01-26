"use client";

import React, { useState, useEffect } from "react";
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
import { useUpdateLibraryTopic } from "@/hooks/library-owner/use-library-topics";
import { useLibraryTopicMaterials } from "@/hooks/library-owner/use-library-topic-materials";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface LibraryEditTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  subjectId: string;
  classId?: string;
  totalTopics: number;
  currentOrder: number;
}

export const LibraryEditTopicModal = ({
  isOpen,
  onClose,
  topicId,
  subjectId: _subjectId,
  classId,
  totalTopics,
  currentOrder,
}: LibraryEditTopicModalProps) => {
  // Suppress unused variable warning - subjectId kept for future use
  void _subjectId;
  const { data: topicMaterials, isLoading: isLoadingTopic } = useLibraryTopicMaterials(
    isOpen ? topicId : null
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(currentOrder);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    order?: string;
  }>({});

  // Store original values to detect changes
  const [originalValues, setOriginalValues] = useState<{
    title: string;
    description: string;
    order: number;
    isActive: boolean;
  } | null>(null);

  // Populate form when topic data is loaded
  useEffect(() => {
    if (isOpen && topicMaterials && "topic" in topicMaterials && topicMaterials.topic) {
      const topic = topicMaterials.topic;
      const formattedTitle = topic.title ? formatTopicTitle(topic.title) : "";
      const formattedDescription = topic.description ? formatDescription(topic.description) : "";
      const topicOrder = currentOrder;
      const topicIsActive = topic.is_active ?? true;

      setTitle(formattedTitle);
      setDescription(formattedDescription);
      setOrder(topicOrder);
      setIsActive(topicIsActive);

      // Store original values for change detection
      setOriginalValues({
        title: formattedTitle,
        description: formattedDescription,
        order: topicOrder,
        isActive: topicIsActive,
      });
    }
  }, [topicMaterials, isOpen, currentOrder]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setOrder(currentOrder);
      setIsActive(true);
      setErrors({});
      setOriginalValues(null);
    }
  }, [isOpen, currentOrder]);

  // Check if form is valid
  const isFormValid =
    title.trim().length >= 3 &&
    title.trim().length <= 200 &&
    order >= 1 &&
    order <= totalTopics;

  // Check if any values have changed
  const hasChanges = originalValues
    ? title.trim() !== originalValues.title.trim() ||
      description.trim() !== originalValues.description.trim() ||
      order !== originalValues.order ||
      isActive !== originalValues.isActive
    : false;

  const updateTopic = useUpdateLibraryTopic();

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
      order?: string;
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

    // Validate order
    if (order === undefined || order === null) {
      newErrors.order = "Order is required";
    } else if (isNaN(order) || order < 1) {
      newErrors.order = `Order must be at least 1`;
    } else if (order > totalTopics) {
      newErrors.order = `Order cannot be greater than ${totalTopics} (total number of topics)`;
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
      await updateTopic.mutateAsync({
        topicId,
        data: {
          title: formatTopicTitle(title.trim()),
          description: description.trim() ? formatDescription(description.trim()) : undefined,
          order: order !== currentOrder ? order : undefined,
          is_active: isActive,
        },
        classId, // Pass classId for proper query invalidation
        subjectId: _subjectId, // Pass subjectId for proper query invalidation
      });

      toast.success("Topic updated successfully");
      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update topic. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Topic</DialogTitle>
        </DialogHeader>

        {isLoadingTopic || !topicMaterials ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        ) : (
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
                onBlur={(e) => {
                  const formatted = formatTopicTitle(e.target.value);
                  if (formatted !== e.target.value) {
                    setTitle(formatted);
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
                onBlur={(e) => {
                  const formatted = formatDescription(e.target.value);
                  if (formatted !== e.target.value) {
                    setDescription(formatted);
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
              <Label htmlFor="order">
                Order <span className="text-red-500">*</span>
              </Label>
              <Input
                id="order"
                type="number"
                min="1"
                max={totalTopics}
                value={order}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value, 10) : currentOrder;
                  setOrder(isNaN(value) ? currentOrder : value);
                  if (errors.order) {
                    setErrors((prev) => ({ ...prev, order: undefined }));
                  }
                }}
                placeholder="Order number"
                className={errors.order ? "border-red-500" : ""}
                required
              />
              {errors.order && (
                <p className="text-xs text-red-500">{errors.order}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">
                Order must be between 1 and {totalTopics}
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
                disabled={updateTopic.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updateTopic.isPending ||
                  !isFormValid ||
                  !hasChanges
                }
              >
                {updateTopic.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Topic"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
