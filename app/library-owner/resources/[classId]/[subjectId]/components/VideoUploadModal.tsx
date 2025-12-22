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
  Play,
  Pause,
} from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(false);
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
      setIsPlaying(false);
    }
  }, [videoFile]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
      setIsDragOver(false);
      setVideoPreviewUrl(null);
      setIsPlaying(false);
      reset();
    }
  }, [isOpen, reset]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setIsPlaying(!videoRef.current.paused);
    }
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
    } catch (error) {
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

            {/* Video Upload */}
            <div className="space-y-2">
              <Label>
                Video File <span className="text-red-500">*</span>
              </Label>
              {!videoFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-brand-border hover:border-brand-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Video className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-4" />
                  <p className="text-sm font-medium text-brand-heading mb-1">
                    Drag and drop your video file here
                  </p>
                  <p className="text-xs text-brand-light-accent-1 mb-4">
                    or click to browse
                  </p>
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("video-upload")?.click()}
                    disabled={uploadState.isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Video (MP4, max 500MB)
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Video Preview */}
                  {videoPreviewUrl && (
                    <div className="relative bg-black rounded-lg overflow-hidden border-4 border-gray-800 shadow-2xl">
                      <div className="aspect-video relative bg-black">
                        <video
                          ref={videoRef}
                          src={videoPreviewUrl}
                          className="w-full h-full object-contain"
                          controls
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                          onTimeUpdate={handleVideoTimeUpdate}
                        />
                      </div>
                      {/* TV Frame Bottom */}
                      <div className="bg-gray-800 h-3"></div>
                    </div>
                  )}
                  
                  {/* File Info */}
                  <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-8 w-8 text-brand-primary" />
                        <div>
                          <p className="text-sm font-medium text-brand-heading">
                            {videoFile.name}
                          </p>
                          <p className="text-xs text-brand-light-accent-1">
                            {formatFileSize(videoFile.size)}
                          </p>
                        </div>
                      </div>
                      {!uploadState.isUploading && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setVideoFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>Thumbnail (Optional)</Label>
              {!thumbnailFile ? (
                <div className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center hover:border-brand-primary/50 transition-colors">
                  <ImageIcon className="h-8 w-8 text-brand-light-accent-1 mx-auto mb-2" />
                  <p className="text-xs text-brand-light-accent-1 mb-2">
                    Add a custom thumbnail
                  </p>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("thumbnail-upload")?.click()}
                    disabled={uploadState.isUploading}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              ) : (
                <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-8 w-8 text-brand-primary" />
                      <div>
                        <p className="text-sm font-medium text-brand-heading">
                          {thumbnailFile.name}
                        </p>
                        <p className="text-xs text-brand-light-accent-1">
                          {formatFileSize(thumbnailFile.size)}
                        </p>
                      </div>
                    </div>
                    {!uploadState.isUploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setThumbnailFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
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

