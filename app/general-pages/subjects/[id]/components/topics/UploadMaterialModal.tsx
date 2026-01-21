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
  useStartMaterialUpload,
  useMaterialUploadProgress,
  type UploadProgressData,
} from "@/hooks/teacher/use-teacher-topics";
import { Loader2, Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  topicId: string;
}

export const UploadMaterialModal = ({
  isOpen,
  onClose,
  subjectId,
  topicId,
}: UploadMaterialModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [materialPreview, setMaterialPreview] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    material?: string;
    description?: string;
  }>({});

  const materialInputRef = useRef<HTMLInputElement>(null);

  const startUpload = useStartMaterialUpload();
  const { data: progressData, error: progressError } = useMaterialUploadProgress(sessionId);
  
  // Type assertion to help TypeScript understand the type
  const typedProgressData = progressData as UploadProgressData | undefined;

  // Check if upload is in progress
  const isUploading = !!sessionId && typedProgressData?.stage !== "completed" && typedProgressData?.stage !== "error";

  // Check if form is valid for button enable/disable
  const isFormValid =
    title.trim().length >= 3 &&
    title.trim().length <= 200 &&
    materialFile !== null &&
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
      material?: string;
    } = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = "Material title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Material title must be at least 3 characters";
    } else if (title.length > 200) {
      newErrors.title = "Material title must be 200 characters or less";
    }

    // Validate material file
    if (!materialFile) {
      newErrors.material = "Material file is required";
    } else {
      // Check file type
      const validMaterialTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      const validExtensions = ["pdf", "doc", "docx", "ppt", "pptx"];
      const fileExtension = materialFile.name.split(".").pop()?.toLowerCase();
      
      if (
        !validMaterialTypes.includes(materialFile.type) &&
        !validExtensions.includes(fileExtension || "")
      ) {
        newErrors.material =
          "Invalid file format. Supported formats: PDF, DOC, DOCX, PPT, PPTX";
      }
      // Check file size (e.g., 50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (materialFile.size > maxSize) {
        newErrors.material = "File is too large. Maximum size is 50MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !materialFile || sessionId) {
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
        material: materialFile,
      });

      // Set session ID to start progress tracking
      setSessionId(result.sessionId);
      toast.success("Upload started. Tracking progress...");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start material upload. Please try again.";
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

    // Clean up preview URL
    if (materialPreview) {
      URL.revokeObjectURL(materialPreview);
    }

    setTitle("");
    setDescription("");
    setMaterialFile(null);
    setMaterialPreview(null);
    setSessionId(null);
    setErrors({});
    // Reset file input
    if (materialInputRef.current) {
      materialInputRef.current.value = "";
    }
    onClose();
  }, [sessionId, typedProgressData, materialPreview, onClose]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFileIcon = (_fileName: string) => {
    // File icon - can be extended later to show different icons based on file type
    return <FileText className="h-10 w-10 text-gray-400 mb-2" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Material</DialogTitle>
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
              placeholder="e.g., Grammar Worksheet"
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
              placeholder="Brief description of the material..."
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

          {/* Material Upload Box */}
          <div className="space-y-2">
            <Label htmlFor="material">
              Material File <span className="text-red-500">*</span>
            </Label>
            <div className="relative max-w-md mx-auto">
              <input
                id="material"
                ref={materialInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setMaterialFile(file);
                  if (errors.material) {
                    setErrors((prev) => ({ ...prev, material: undefined }));
                  }
                  
                  // Create preview URL for PDFs (to show first page)
                  if (file) {
                    if (file.type === "application/pdf") {
                      const url = URL.createObjectURL(file);
                      setMaterialPreview(url);
                    } else {
                      // For other file types, just show file icon
                      setMaterialPreview(null);
                    }
                  } else {
                    if (materialPreview) {
                      URL.revokeObjectURL(materialPreview);
                    }
                    setMaterialPreview(null);
                  }
                }}
                className="hidden"
                required
                disabled={isUploading}
              />
              <label
                htmlFor="material"
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors ${
                  isUploading
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                    : errors.material
                    ? "border-red-500 bg-red-50 cursor-pointer"
                    : materialPreview || materialFile
                    ? "border-gray-300 bg-gray-50 cursor-pointer"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"
                }`}
              >
                {materialFile ? (
                  <>
                    {materialPreview && materialFile.type === "application/pdf" ? (
                      <div className="absolute inset-0 w-full h-full">
                        <iframe
                          src={materialPreview}
                          className="w-full h-full rounded-lg"
                          title="PDF preview"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        {getFileIcon(materialFile.name)}
                        <p className="text-sm font-medium text-gray-700 mt-2">
                          {materialFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(materialFile.size)}
                        </p>
                      </div>
                    )}
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
                            setMaterialFile(null);
                            if (materialPreview) {
                              URL.revokeObjectURL(materialPreview);
                            }
                            setMaterialPreview(null);
                            if (materialInputRef.current) {
                              materialInputRef.current.value = "";
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1.5 rounded truncate">
                      {materialFile.name} ({formatFileSize(materialFile.size)})
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload material
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, PPT, PPTX
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Max: 50MB
                    </p>
                  </>
                )}
              </label>
            </div>
            {errors.material && (
              <p className="text-xs text-red-500">{errors.material}</p>
            )}
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
                  Uploading material file...
                </p>
              )}
              {typedProgressData.stage === "processing" && (
                <p className="text-xs text-gray-500">
                  Processing material...
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
                  Upload Material
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

