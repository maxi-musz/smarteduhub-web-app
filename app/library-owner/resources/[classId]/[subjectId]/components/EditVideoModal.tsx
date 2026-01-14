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
import { Label } from "@/components/ui/label";
import { useUpdateVideo } from "@/hooks/content/use-update-video";
import { TopicVideo } from "@/hooks/topics/use-topic-materials";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle } from "@/lib/text-formatter";

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: TopicVideo | null;
  allVideos?: TopicVideo[];
}

export const EditVideoModal = ({
  isOpen,
  onClose,
  video,
  allVideos = [],
}: EditVideoModalProps) => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);

  const updateVideo = useUpdateVideo();

  // Store original values for comparison
  const originalValues = useMemo(() => {
    if (!video) return null;
    return {
      title: video.title,
      order: video.order,
    };
  }, [video]);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setOrder(video.order);
    }
  }, [video]);

  // Check if anything has changed
  const hasChanges = useMemo(() => {
    if (!originalValues) return false;
    return (
      title.trim() !== originalValues.title ||
      order !== originalValues.order
    );
  }, [title, order, originalValues]);

  // Calculate max order (total videos count)
  const maxOrder = allVideos.length;

  // Find which video will be affected by order change
  const affectedVideo = useMemo(() => {
    if (!video || !hasChanges || order === originalValues?.order) return null;
    return allVideos.find((v) => v.id !== video.id && v.order === order);
  }, [order, video, allVideos, hasChanges, originalValues]);

  // Validate order range
  const orderError = useMemo(() => {
    if (!order || order < 1) {
      return "Order must be at least 1";
    }
    if (order > maxOrder) {
      return `Order cannot exceed ${maxOrder} (total videos)`;
    }
    return null;
  }, [order, maxOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!video) return;

    if (title.trim() && title.length > 200) {
      toast.error("Video title must be 200 characters or less");
      return;
    }

    if (orderError) {
      toast.error(orderError);
      return;
    }

    try {
      const updateData: { title?: string; swapOrderWith?: string } = {};

      // Only include title if it changed
      if (title.trim() !== originalValues?.title) {
        updateData.title = formatTopicTitle(title.trim());
      }

      // Only include swapOrderWith if order changed and there's a video to swap with
      if (order !== originalValues?.order && affectedVideo) {
        updateData.swapOrderWith = affectedVideo.id;
      }

      // Only submit if there are actual changes
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await updateVideo.mutateAsync({
        videoId: video.id,
        data: updateData,
      });

      toast.success("Video updated successfully");
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to update video. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!updateVideo.isPending) {
      onClose();
    }
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Variables"
              maxLength={200}
              required
              disabled={updateVideo.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min={1}
              max={maxOrder}
              value={order}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  setOrder(value);
                } else if (e.target.value === "") {
                  setOrder(1);
                }
              }}
              disabled={updateVideo.isPending}
              className={orderError ? "border-red-500" : ""}
            />
            {orderError && (
              <p className="text-xs text-red-500">{orderError}</p>
            )}
            {!orderError && (
              <p className="text-xs text-brand-light-accent-1">
                Order must be between 1 and {maxOrder}
              </p>
            )}
          </div>

          {/* Order Interchange Warning */}
          {affectedVideo && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Order will be interchanged:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    <li>
                      <span className="font-medium">&quot;{video.title}&quot;</span> will move to order{" "}
                      <span className="font-medium">{order}</span>
                    </li>
                    <li>
                      <span className="font-medium">&quot;{affectedVideo.title}&quot;</span> will move to
                      order <span className="font-medium">{video.order}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateVideo.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateVideo.isPending || !hasChanges || !!orderError}
            >
              {updateVideo.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Video"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

