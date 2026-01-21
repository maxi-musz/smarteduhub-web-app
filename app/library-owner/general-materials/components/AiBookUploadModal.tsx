"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  BookOpen,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAiBookUpload } from "@/hooks/general-materials/use-general-material-upload";
import { useLibraryClasses } from "@/hooks/general-materials/use-library-classes";
import { Checkbox } from "@/components/ui/checkbox";

interface AiBookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiBookUploadModal = ({ isOpen, onClose }: AiBookUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  const { startUpload, uploadState, reset } = useAiBookUpload();
  const { data: classes, isLoading: isLoadingClasses } = useLibraryClasses();

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setFile(null);
      setThumbnail(null);
      setThumbnailPreview(null);
      setIsDragOver(false);
      setSelectedClassIds([]);
      reset();
    }
  }, [isOpen, reset]);

  // Create preview URL when thumbnail is selected
  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setThumbnailPreview(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setThumbnailPreview(null);
    }
  }, [thumbnail]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const validateFile = (uploadFile: File): string | null => {
    const allowedExtensions = [".pdf"];
    const ext = "." + (uploadFile.name.split(".").pop() || "").toLowerCase();
    const maxSize = 300 * 1024 * 1024;

    if (!allowedExtensions.includes(ext)) {
      return "Only PDF files are allowed";
    }
    if (uploadFile.size > maxSize) {
      return "File must be less than 300MB";
    }
    return null;
  };

  const validateThumbnail = (thumbFile: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = "." + (thumbFile.name.split(".").pop() || "").toLowerCase();
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(thumbFile.type) && !allowedExtensions.includes(ext)) {
      return "Thumbnail must be JPEG, PNG, GIF, or WEBP";
    }
    if (thumbFile.size > maxSize) {
      return "Thumbnail must be less than 5MB";
    }
    return null;
  };

  const handleFileSelect = useCallback(
    (uploadFile: File) => {
      const error = validateFile(uploadFile);
      if (error) {
        toast.error(error);
        return;
      }
      setFile(uploadFile);
      if (!title) {
        const nameWithoutExt = uploadFile.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    },
    [title]
  );

  const handleThumbnailSelect = useCallback((thumbFile: File) => {
    const error = validateThumbnail(thumbFile);
    if (error) {
      toast.error(error);
      return;
    }
    setThumbnail(thumbFile);
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
      const material = files[0];
      if (material) {
        handleFileSelect(material);
      }
    },
    [handleFileSelect]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!thumbnail) {
      toast.error("Please select a thumbnail image");
      return;
    }
    if (selectedClassIds.length === 0) {
      toast.error("Please select at least one class");
      return;
    }

    try {
      await startUpload({
        file,
        thumbnail,
        title: title.trim(),
        classIds: selectedClassIds,
        isAiEnabled: true,
      });
    } catch {
      // handled in hook
    }
  };

  const toggleClass = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
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
          <DialogTitle>Upload AI Book</DialogTitle>
        </DialogHeader>

        {isCompleted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-heading mb-2">
              Upload Complete!
            </h3>
            <p className="text-brand-light-accent-1 mb-4">
              Your AI Book has been uploaded successfully.
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
              {uploadState.progress?.error ||
                uploadState.error ||
                "An error occurred during upload"}
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
                placeholder="e.g., Algebra Study Guide"
                maxLength={200}
                required
                disabled={uploadState.isUploading}
              />
              <p className="text-xs text-brand-light-accent-1">
                {title.length}/200 characters
              </p>
            </div>

            {/* Classes Selection */}
            <div className="space-y-2">
              <Label>
                Classes <span className="text-red-500">*</span>
              </Label>
              {isLoadingClasses ? (
                <div className="flex items-center gap-2 text-sm text-brand-light-accent-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading classes...
                </div>
              ) : classes && classes.length > 0 ? (
                <div className="border border-brand-border rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                  <div className="space-y-2">
                    {classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`class-${classItem.id}`}
                          checked={selectedClassIds.includes(classItem.id)}
                          onCheckedChange={() => toggleClass(classItem.id)}
                          disabled={uploadState.isUploading}
                        />
                        <Label
                          htmlFor={`class-${classItem.id}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {classItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-brand-light-accent-1">
                  No classes available
                </p>
              )}
              {selectedClassIds.length > 0 && (
                <p className="text-xs text-brand-light-accent-1">
                  {selectedClassIds.length} class
                  {selectedClassIds.length !== 1 ? "es" : ""} selected
                </p>
              )}
            </div>

            {/* Thumbnail and File Upload - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label>
                  Thumbnail <span className="text-red-500">*</span>
                </Label>
                {!thumbnail ? (
                  <div className="border-2 border-dashed border-brand-border rounded-lg p-4 text-center hover:border-brand-primary/50 transition-colors">
                    <ImageIcon className="h-6 w-6 text-brand-light-accent-1 mx-auto mb-2" />
                    <p className="text-xs text-brand-light-accent-1 mb-2">
                      Add a thumbnail image
                    </p>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];
                        if (selected) handleThumbnailSelect(selected);
                      }}
                      className="hidden"
                      id="thumbnail-upload"
                      disabled={uploadState.isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("thumbnail-upload")?.click()
                      }
                      disabled={uploadState.isUploading}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Select Thumbnail
                    </Button>
                    <p className="text-xs text-brand-light-accent-1 mt-1">
                      JPEG, PNG, GIF, WEBP - max 5MB
                    </p>
                  </div>
                ) : (
                  <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-col items-center gap-3">
                      {thumbnailPreview && (
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden border-2 border-brand-border">
                          <Image
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="w-full text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <ImageIcon className="h-5 w-5 text-brand-primary" />
                          <p className="text-sm font-medium text-brand-heading truncate">
                            {thumbnail.name}
                          </p>
                        </div>
                        <p className="text-xs text-brand-light-accent-1 mb-2">
                          {formatFileSize(thumbnail.size)}
                        </p>
                        {!uploadState.isUploading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setThumbnail(null);
                              setThumbnailPreview(null);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>
                  File <span className="text-red-500">*</span>
                </Label>
                {!file ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors h-full flex flex-col justify-center ${
                      isDragOver
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-brand-border hover:border-brand-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <BookOpen className="h-6 w-6 text-brand-light-accent-1 mx-auto mb-2" />
                    <p className="text-sm font-medium text-brand-heading mb-1">
                      Drag and drop your file
                    </p>
                    <p className="text-xs text-brand-light-accent-1 mb-3">
                      or click to browse
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];
                        if (selected) handleFileSelect(selected);
                      }}
                      className="hidden"
                      id="ai-book-upload"
                      disabled={uploadState.isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("ai-book-upload")?.click()
                      }
                      disabled={uploadState.isUploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                    <p className="text-xs text-brand-light-accent-1 mt-1">
                      PDF only - max 300MB
                    </p>
                  </div>
                ) : (
                  <div className="border border-brand-border rounded-lg p-4 bg-gray-50 h-full flex flex-col justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <BookOpen className="h-8 w-8 text-brand-primary" />
                      <div className="w-full text-center">
                        <p className="text-sm font-medium text-brand-heading mb-1 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-brand-light-accent-1 mb-2">
                          {formatFileSize(file.size)}
                        </p>
                        {!uploadState.isUploading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFile(null)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {uploadState.isUploading && (
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                {uploadState.progress ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {uploadState.progress.stage === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : uploadState.progress.stage === "error" ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Loader2 className="h-4 w-4 text-brand-primary animate-spin" />
                        )}
                        <span className="text-sm font-medium text-brand-heading">
                          {uploadState.progress.message || "Uploading..."}
                        </span>
                      </div>
                      <span className="text-sm text-brand-light-accent-1">
                        {uploadState.progress.progress}%
                      </span>
                    </div>
                    <Progress value={uploadState.progress.progress} />
                    {uploadState.progress.totalBytes > 0 && (
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
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-brand-primary animate-spin" />
                    <span className="text-sm font-medium text-brand-heading">
                      Starting upload...
                    </span>
                  </div>
                )}
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
                  !file ||
                  !thumbnail ||
                  selectedClassIds.length === 0
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
                    Upload AI Book
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


