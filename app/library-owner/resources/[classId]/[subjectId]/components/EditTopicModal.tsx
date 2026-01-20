"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useUpdateTopic } from "@/hooks/topics/use-topics";
import { Topic } from "@/hooks/library-owner/use-library-class-resources";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface EditTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic | null;
  allTopics?: Topic[];
}

export const EditTopicModal = ({
  isOpen,
  onClose,
  topic,
  allTopics = [],
}: EditTopicModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const updateTopic = useUpdateTopic();

  // Store original values for comparison
  const originalValues = useMemo(() => {
    if (!topic) return null;
    return {
      title: topic.title,
      description: topic.description || "",
      order: topic.order,
      is_active: topic.is_active,
    };
  }, [topic]);

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setDescription(topic.description || "");
      setOrder(topic.order);
      setIsActive(topic.is_active);
    }
  }, [topic]);

  // Check if anything has changed
  const hasChanges = useMemo(() => {
    if (!originalValues) return false;
    return (
      title.trim() !== originalValues.title ||
      (description || "") !== originalValues.description ||
      order !== originalValues.order ||
      isActive !== originalValues.is_active
    );
  }, [title, description, order, isActive, originalValues]);

  // Calculate max order (total topics count)
  const maxOrder = allTopics.length;

  // Find which topic will be affected by order change
  const affectedTopic = useMemo(() => {
    if (!topic || !hasChanges || order === originalValues?.order) return null;
    return allTopics.find((t) => t.id !== topic.id && t.order === order);
  }, [order, topic, allTopics, hasChanges, originalValues]);

  // Validate order range
  const orderError = useMemo(() => {
    if (!order || order < 1) {
      return "Order must be at least 1";
    }
    if (order > maxOrder) {
      return `Order cannot exceed ${maxOrder} (total topics)`;
    }
    return null;
  }, [order, maxOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic) return;

    if (title.trim() && title.length > 200) {
      toast.error("Topic title must be 200 characters or less");
      return;
    }

    if (description && description.length > 2000) {
      toast.error("Description must be 2000 characters or less");
      return;
    }

    if (orderError) {
      toast.error(orderError);
      return;
    }

    try {
      await updateTopic.mutateAsync({
        topicId: topic.id,
        data: {
          title: title.trim() ? formatTopicTitle(title) : undefined,
          description: description.trim() ? formatDescription(description) : undefined,
          order: order >= 1 ? order : undefined,
          is_active: isActive,
        },
      });

      toast.success("Topic updated successfully");
      handleClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to update topic. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (topic) {
      setTitle(topic.title);
      setDescription(topic.description || "");
      setOrder(topic.order);
      setIsActive(topic.is_active);
    }
    onClose();
  };

  if (!topic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Topic</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Variables"
              maxLength={200}
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
              placeholder="Brief description of what this topic covers..."
              rows={4}
              maxLength={2000}
            />
            <p className="text-xs text-brand-light-accent-1">
              {description.length}/2000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">
              Order <span className="text-xs text-brand-light-accent-1">(1 - {maxOrder})</span>
            </Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1) {
                  setOrder(Math.min(value, maxOrder));
                } else if (e.target.value === "") {
                  setOrder(1);
                }
              }}
              min={1}
              max={maxOrder}
              className={orderError ? "border-red-500" : ""}
            />
            {orderError && (
              <p className="text-xs text-red-600">{orderError}</p>
            )}
            {!orderError && maxOrder > 0 && (
              <p className="text-xs text-brand-light-accent-1">
                Valid range: 1 to {maxOrder} (total: {maxOrder} {maxOrder === 1 ? "topic" : "topics"})
              </p>
            )}
            {maxOrder === 0 && (
              <p className="text-xs text-brand-light-accent-1">
                No topics available
              </p>
            )}
            {affectedTopic && !orderError && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Order will be interchanged:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>
                        <span className="font-medium">&quot;{topic.title}&quot;</span> will move to order{" "}
                        <span className="font-medium">{order}</span>
                      </li>
                      <li>
                        <span className="font-medium">&quot;{affectedTopic.title}&quot;</span> will move to
                        order <span className="font-medium">{topic.order}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
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
              disabled={updateTopic.isPending || !hasChanges || !!orderError}
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
      </DialogContent>
    </Dialog>
  );
};

