"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { useVideoUpload } from "@/hooks/content/use-video-upload";
import {
  Upload,
  Video,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  subjectId: string;
  topicTitle?: string;
}

export const VideoUploadModal = ({
  isOpen,
  onClose,
  topicId,
  subjectId,
  topicTitle,
}: VideoUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { startUpload, uploadState, reset } = useVideoUpload();

  // Create preview URL when video file is selected
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoPreviewUrl(null);
    }
  }, [videoFile]);

  // Create preview URL when thumbnail file is selected
  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setThumbnailPreviewUrl(null);
    }
  }, [thumbnailFile]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
      setIsDragOver(false);
      setVideoPreviewUrl(null);
      reset();
    }
  }, [isOpen, reset]);

  const handleVideoTimeUpdate = () => {
    // Intentionally left blank - reserved for future playback UI logic
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const validateVideoFile = (file: File): string | null => {
    // Check file type - both MIME type and file extension
    const isMP4 = file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4");
    if (!isMP4) {
      return "Only MP4 video files are allowed";
    }

    // Check file size (500MB max)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return "Video file must be less than 500MB";
    }

    return null;
  };

  const validateThumbnailFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "Thumbnail must be JPEG, PNG, GIF, or WEBP";
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "Thumbnail must be less than 10MB";
    }

    return null;
  };

  const handleVideoSelect = useCallback((file: File) => {
    const error = validateVideoFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setVideoFile(file);
    if (!title) {
      // Auto-fill title from filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  }, [title]);

  const handleThumbnailSelect = useCallback((file: File) => {
    const error = validateThumbnailFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setThumbnailFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const video = files.find((f) => f.type === "video/mp4" || f.name.toLowerCase().endsWith(".mp4"));
      const image = files.find((f) => f.type.startsWith("image/"));

      if (video) {
        handleVideoSelect(video);
      } else if (files.some((f) => f.type.startsWith("video/"))) {
        // If there's a video file but it's not MP4
        toast.error("Only MP4 video files are allowed");
      }
      if (image) {
        handleThumbnailSelect(image);
      }
    },
    [handleVideoSelect, handleThumbnailSelect]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Video title is required");
      return;
    }

    if (title.length > 200) {
      toast.error("Title must be 200 characters or less");
      return;
    }

    if (description && description.length > 2000) {
      toast.error("Description must be 2000 characters or less");
      return;
    }

    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    try {
      await startUpload({
        topicId,
        subjectId,
        title: formatTopicTitle(title),
        description: description.trim() ? formatDescription(description) : undefined,
        video: videoFile,
        thumbnail: thumbnailFile || undefined,
      });
    } catch {
      // Error already handled in hook
    }
  };

  const handleClose = () => {
    if (!uploadState.isUploading) {
      onClose();
    }
  };

  const isCompleted = uploadState.progress?.stage === "completed";
  const hasError = uploadState.progress?.stage === "error" || uploadState.error;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          {topicTitle && (
            <p className="text-sm text-brand-light-accent-1 mt-1">
              Topic: {formatTopicTitle(topicTitle)}
            </p>
          )}
        </DialogHeader>

        {isCompleted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-heading mb-2">
              Upload Complete!
            </h3>
            <p className="text-brand-light-accent-1 mb-4">
              Your video has been uploaded successfully.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : hasError ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-heading mb-2">
              Upload Failed
            </h3>
            <p className="text-brand-light-accent-1 mb-4">
              {uploadState.progress?.error || uploadState.error || "An error occurred during upload"}
            </p>
            <Button onClick={reset}>Try Again</Button>
          </div>
        ) : (
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
                disabled={uploadState.isUploading}
              />
              <p className="text-xs text-brand-light-accent-1">
                {title.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the video content..."
                rows={3}
                maxLength={2000}
                disabled={uploadState.isUploading}
              />
              <p className="text-xs text-brand-light-accent-1">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Video and Thumbnail Upload - Side by Side */}
            <div className="space-y-2">
              <div className="flex items-start gap-4">
                {/* Video Upload */}
                <div className="space-y-2 flex-1 max-w-[200px]">
                  <Label className="text-xs">
                    Video File <span className="text-red-500">*</span>
                  </Label>
                  {!videoFile ? (
                    <div
                      className={`relative w-full aspect-square border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer ${
                        isDragOver
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-brand-border hover:border-brand-primary/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => !uploadState.isUploading && document.getElementById("video-upload")?.click()}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Video className="h-6 w-6 text-brand-light-accent-1 mb-1" />
                        <p className="text-[10px] font-medium text-brand-heading mb-0.5">
                          Drop video
                        </p>
                        <p className="text-[10px] text-brand-light-accent-1">
                          or click
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="video/mp4,.mp4"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoSelect(file);
                        }}
                        className="hidden"
                        id="video-upload"
                        disabled={uploadState.isUploading}
                      />
                    </div>
                  ) : (
                    <div className="relative group w-full aspect-square">
                      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-brand-border shadow-sm">
                        {videoPreviewUrl ? (
                          <video
                            ref={videoRef}
                            src={videoPreviewUrl}
                            className="w-full h-full object-cover"
                            controls
                            onTimeUpdate={handleVideoTimeUpdate}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {!uploadState.isUploading && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                          onClick={() => setVideoFile(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="mt-1.5 text-center">
                        <p className="text-[10px] font-medium text-brand-heading truncate">
                          {videoFile.name}
                        </p>
                        <p className="text-[10px] text-brand-light-accent-1">
                          {formatFileSize(videoFile.size)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-2 flex-1 max-w-[200px]">
                  <Label className="text-xs">Thumbnail (Optional)</Label>
                  {!thumbnailFile ? (
                    <div
                      className={`relative w-full aspect-square border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer ${
                        isDragOver
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-brand-border hover:border-brand-primary/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => !uploadState.isUploading && document.getElementById("thumbnail-upload")?.click()}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-brand-light-accent-1 mb-1" />
                        <p className="text-[10px] font-medium text-brand-heading mb-0.5">
                          Drop image
                        </p>
                        <p className="text-[10px] text-brand-light-accent-1">
                          or click
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleThumbnailSelect(file);
                        }}
                        className="hidden"
                        id="thumbnail-upload"
                        disabled={uploadState.isUploading}
                      />
                    </div>
                  ) : (
                    <div className="relative group w-full aspect-square">
                      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden border border-brand-border shadow-sm">
                        {thumbnailPreviewUrl ? (
                          <Image
                            src={thumbnailPreviewUrl}
                            alt="Thumbnail preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                            <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                            <p className="text-[10px] text-gray-500">No thumbnail</p>
                          </div>
                        )}
                      </div>
                      {!uploadState.isUploading && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                          onClick={() => setThumbnailFile(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="mt-1.5 text-center">
                        <p className="text-[10px] font-medium text-brand-heading truncate">
                          {thumbnailFile.name}
                        </p>
                        <p className="text-[10px] text-brand-light-accent-1">
                          {formatFileSize(thumbnailFile.size)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadState.isUploading && uploadState.progress && (
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-brand-heading">
                    {uploadState.progress.message || "Uploading..."}
                  </span>
                  <span className="text-sm text-brand-light-accent-1">
                    {uploadState.progress.progress}%
                  </span>
                </div>
                <Progress value={uploadState.progress.progress} />
                <div className="flex items-center justify-between text-xs text-brand-light-accent-1">
                  <span>
                    {formatFileSize(uploadState.progress.bytesUploaded)} /{" "}
                    {formatFileSize(uploadState.progress.totalBytes)}
                  </span>
                  {uploadState.progress.estimatedTimeRemaining && (
                    <span>
                      ~{uploadState.progress.estimatedTimeRemaining}s remaining
                    </span>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={uploadState.isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  uploadState.isUploading ||
                  !title.trim() ||
                  !videoFile
                }
              >
                {uploadState.isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

