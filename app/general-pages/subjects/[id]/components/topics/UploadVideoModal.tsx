"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
import {
  useStartVideoUpload,
  useVideoUploadProgress,
  type UploadProgressData,
} from "@/hooks/teacher/use-teacher-topics";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  topicId: string;
}

export const UploadVideoModal = ({
  isOpen,
  onClose,
  subjectId,
  topicId,
}: UploadVideoModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    video?: string;
    thumbnail?: string;
    description?: string;
  }>({});

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const startUpload = useStartVideoUpload();
  const { data: progressData, error: progressError } = useVideoUploadProgress(sessionId);
  
  // Type assertion to help TypeScript understand the type
  const typedProgressData = progressData as UploadProgressData | undefined;

  // Check if upload is in progress
  const isUploading = !!sessionId && typedProgressData?.stage !== "completed" && typedProgressData?.stage !== "error";

  // Check if form is valid for button enable/disable
  const isFormValid =
    title.trim().length >= 3 &&
    title.trim().length <= 200 &&
    videoFile !== null &&
    !isUploading; // Disable if upload in progress


  // Handle progress errors
  useEffect(() => {
    if (progressError) {
      toast.error(progressError.message || "Failed to track upload progress");
      setSessionId(null); // Reset to allow retry
    }
  }, [progressError]);

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      video?: string;
      thumbnail?: string;
    } = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = "Video title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Video title must be at least 3 characters";
    } else if (title.length > 200) {
      newErrors.title = "Video title must be 200 characters or less";
    }

    // Validate video file
    if (!videoFile) {
      newErrors.video = "Video file is required";
    } else {
      // Check file type
      const validVideoTypes = [
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
      ];
      if (!validVideoTypes.includes(videoFile.type)) {
        newErrors.video =
          "Invalid video format. Supported formats: MP4, MOV, AVI, WebM";
      }
      // Check file size (e.g., 500MB max)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (videoFile.size > maxSize) {
        newErrors.video = "Video file is too large. Maximum size is 500MB";
      }
    }

    // Validate thumbnail if provided
    if (thumbnailFile) {
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validImageTypes.includes(thumbnailFile.type)) {
        newErrors.thumbnail =
          "Invalid thumbnail format. Supported formats: JPG, PNG";
      }
      // Check thumbnail size (e.g., 5MB max)
      const maxThumbnailSize = 5 * 1024 * 1024; // 5MB
      if (thumbnailFile.size > maxThumbnailSize) {
        newErrors.thumbnail =
          "Thumbnail file is too large. Maximum size is 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !videoFile || sessionId) {
      return;
    }

    // Format text inputs before submission
    const formattedTitle = formatTopicTitle(title.trim());
    const formattedDescription = description.trim()
      ? formatDescription(description.trim())
      : undefined;

    // Update state with formatted values
    setTitle(formattedTitle);
    if (formattedDescription) {
      setDescription(formattedDescription);
    }

    try {
      const result = await startUpload.mutateAsync({
        title: formattedTitle,
        description: formattedDescription,
        subject_id: subjectId,
        topic_id: topicId,
        video: videoFile,
        thumbnail: thumbnailFile || undefined,
      });

      // Set session ID to start progress tracking
      setSessionId(result.sessionId);
      toast.success("Upload started. Tracking progress...");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start video upload. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = useCallback(() => {
    // Only allow closing if not uploading or if upload is completed/error
    if (sessionId && typedProgressData?.stage !== "completed" && typedProgressData?.stage !== "error") {
      // Show confirmation if upload is in progress
      if (confirm("Upload is in progress. Are you sure you want to close? The upload will continue in the background.")) {
        setSessionId(null);
      } else {
        return;
      }
    }

    // Clean up preview URLs
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    setSessionId(null);
    setErrors({});
    // Reset file inputs
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
    onClose();
  }, [sessionId, typedProgressData, videoPreview, thumbnailPreview, onClose]);

  // Handle upload completion
  useEffect(() => {
    if (typedProgressData?.stage === "completed") {
      logger.info("[UploadVideoModal] Upload completed", {
        progress: typedProgressData.progress,
        stage: typedProgressData.stage,
      });
      
      // Invalidate cache to refresh videos list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topic", topicId, "content"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher", "subject", subjectId, "comprehensive"],
      });
      
      toast.success("Video uploaded successfully");
      
      // Reset and close after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else if (typedProgressData?.stage === "error") {
      logger.error("[UploadVideoModal] Upload error", {
        error: typedProgressData.error,
        stage: typedProgressData.stage,
      });
      toast.error(typedProgressData.error || "Upload failed");
      setSessionId(null); // Reset to allow retry
    }
  }, [typedProgressData, topicId, subjectId, queryClient, handleClose]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video Lesson</DialogTitle>
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
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    const formatted = formatTopicTitle(e.target.value);
                    setTitle(formatted);
                  }
                }}
                placeholder="e.g., Introduction to Algebra Basics"
                maxLength={200}
                required
                disabled={isUploading}
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
                if (e.target.value.trim()) {
                  const formatted = formatDescription(e.target.value);
                  setDescription(formatted);
                }
              }}
              placeholder="Brief description of the video lesson..."
              rows={3}
              maxLength={2000}
              disabled={isUploading}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {description.length}/2000 characters
            </p>
          </div>

          {/* Video and Thumbnail Upload Boxes - Side by Side */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {/* Video Upload Box */}
            <div className="space-y-2">
              <Label htmlFor="video">
                Video File <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  id="video"
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setVideoFile(file);
                    if (errors.video) {
                      setErrors((prev) => ({ ...prev, video: undefined }));
                    }
                    
                    // Create preview URL
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setVideoPreview(url);
                    } else {
                      if (videoPreview) {
                        URL.revokeObjectURL(videoPreview);
                      }
                      setVideoPreview(null);
                    }
                  }}
                  className="hidden"
                  required
                  disabled={isUploading}
                />
                <label
                  htmlFor="video"
                  className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors ${
                    isUploading
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                      : errors.video
                      ? "border-red-500 bg-red-50 cursor-pointer"
                      : videoPreview
                      ? "border-gray-300 bg-gray-50 cursor-pointer"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"
                  }`}
                >
                  {videoPreview ? (
                    <>
                      <div className="absolute inset-0 w-full h-full">
                        <video
                          src={videoPreview}
                          className="w-full h-full object-contain rounded-lg"
                          controls
                          muted
                        />
                      </div>
                      {!isUploading && (
                        <div className="absolute top-2 right-2 z-10">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setVideoFile(null);
                              if (videoPreview) {
                                URL.revokeObjectURL(videoPreview);
                              }
                              setVideoPreview(null);
                              if (videoInputRef.current) {
                                videoInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1.5 rounded truncate">
                        {videoFile?.name} ({formatFileSize(videoFile?.size || 0)})
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload video
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        MP4, MOV, AVI, WebM
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max: 500MB
                      </p>
                    </>
                  )}
                </label>
              </div>
              {errors.video && (
                <p className="text-xs text-red-500">{errors.video}</p>
              )}
            </div>

            {/* Thumbnail Upload Box */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">
                Thumbnail Image <span className="text-gray-400">(Optional)</span>
              </Label>
              <div className="relative">
                <input
                  id="thumbnail"
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setThumbnailFile(file);
                    if (errors.thumbnail) {
                      setErrors((prev) => ({ ...prev, thumbnail: undefined }));
                    }
                    
                    // Create preview URL
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setThumbnailPreview(url);
                    } else {
                      if (thumbnailPreview) {
                        URL.revokeObjectURL(thumbnailPreview);
                      }
                      setThumbnailPreview(null);
                    }
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="thumbnail"
                  className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors ${
                    isUploading
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                      : errors.thumbnail
                      ? "border-red-500 bg-red-50 cursor-pointer"
                      : thumbnailPreview
                      ? "border-gray-300 bg-gray-50 cursor-pointer"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"
                  }`}
                >
                  {thumbnailPreview ? (
                    <>
                      <div className="absolute inset-0 w-full h-full">
                        <Image
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover rounded-lg"
                          unoptimized
                        />
                      </div>
                      {!isUploading && (
                        <div className="absolute top-2 right-2 z-10">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setThumbnailFile(null);
                              if (thumbnailPreview) {
                                URL.revokeObjectURL(thumbnailPreview);
                              }
                              setThumbnailPreview(null);
                              if (thumbnailInputRef.current) {
                                thumbnailInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1.5 rounded truncate">
                        {thumbnailFile?.name} ({formatFileSize(thumbnailFile?.size || 0)})
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max: 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
              {errors.thumbnail && (
                <p className="text-xs text-red-500">{errors.thumbnail}</p>
              )}
            </div>
          </div>

          {/* Progress Section */}
          {sessionId && typedProgressData && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {typedProgressData.stage === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : typedProgressData.stage === "error" ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Loader2 className="h-5 w-5 text-brand-primary animate-spin" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {typedProgressData.message}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {typedProgressData.progress}%
                </span>
              </div>
              <Progress value={typedProgressData.progress} className="h-2" />
              {typedProgressData.stage === "uploading" && (
                <p className="text-xs text-gray-500">
                  Uploading video file...
                </p>
              )}
              {typedProgressData.stage === "processing" && (
                <p className="text-xs text-gray-500">
                  Processing video...
                </p>
              )}
              {typedProgressData.stage === "completed" && (
                <p className="text-xs text-green-600">
                  Upload completed successfully!
                </p>
              )}
              {typedProgressData.stage === "error" && typedProgressData.error && (
                <p className="text-xs text-red-600">
                  {typedProgressData.error}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              {isUploading ? "Upload in progress..." : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={startUpload.isPending || !isFormValid || isUploading}
            >
              {startUpload.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : sessionId ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
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
      </DialogContent>
    </Dialog>
  );
};

