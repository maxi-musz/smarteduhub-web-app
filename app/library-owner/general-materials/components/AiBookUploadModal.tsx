"use client";

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
import { Textarea } from "@/components/ui/textarea";
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

interface AiBookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiBookUploadModal = ({ isOpen, onClose }: AiBookUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { startUpload, uploadState, reset } = useAiBookUpload();

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setAuthor("");
      setFile(null);
      setThumbnail(null);
      setThumbnailPreview(null);
      setIsDragOver(false);
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
    const allowedExtensions = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
    const ext = "." + (uploadFile.name.split(".").pop() || "").toLowerCase();
    const maxSize = 300 * 1024 * 1024;

    if (!allowedExtensions.includes(ext)) {
      return "Only PDF, DOC, DOCX, PPT, and PPTX files are allowed";
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

    try {
      await startUpload({
        file,
        thumbnail,
        title: title.trim(),
        description: description.trim() || undefined,
        author: author.trim() || undefined,
        isAiEnabled: true,
      });
    } catch {
      // handled in hook
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

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., John Doe"
                maxLength={150}
                disabled={uploadState.isUploading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the book..."
                rows={3}
                maxLength={2000}
                disabled={uploadState.isUploading}
              />
              <p className="text-xs text-brand-light-accent-1">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>
                Thumbnail <span className="text-red-500">*</span>
              </Label>
              {!thumbnail ? (
                <div className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center hover:border-brand-primary/50 transition-colors">
                  <ImageIcon className="h-8 w-8 text-brand-light-accent-1 mx-auto mb-2" />
                  <p className="text-xs text-brand-light-accent-1 mb-2">
                    Add a thumbnail image for the book cover
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
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Select Thumbnail (JPEG, PNG, GIF, WEBP - max 5MB)
                  </Button>
                </div>
              ) : (
                <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <div className="relative w-24 h-32 rounded-lg overflow-hidden border-2 border-brand-border flex-shrink-0">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-8 w-8 text-brand-primary" />
                          <div>
                            <p className="text-sm font-medium text-brand-heading">
                              {thumbnail.name}
                            </p>
                            <p className="text-xs text-brand-light-accent-1">
                              {formatFileSize(thumbnail.size)}
                            </p>
                          </div>
                        </div>
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
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-brand-border hover:border-brand-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <BookOpen className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-4" />
                  <p className="text-sm font-medium text-brand-heading mb-1">
                    Drag and drop your AI Book file here
                  </p>
                  <p className="text-xs text-brand-light-accent-1 mb-4">
                    or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
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
                    onClick={() =>
                      document.getElementById("ai-book-upload")?.click()
                    }
                    disabled={uploadState.isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File (PDF, DOC, PPT - max 300MB)
                  </Button>
                </div>
              ) : (
                <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-brand-primary" />
                      <div>
                        <p className="text-sm font-medium text-brand-heading">
                          {file.name}
                        </p>
                        <p className="text-xs text-brand-light-accent-1">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    {!uploadState.isUploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
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
                  uploadState.isUploading || !title.trim() || !file || !thumbnail
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


