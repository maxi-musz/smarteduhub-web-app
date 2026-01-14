"use client";

import { useState, useCallback, useEffect } from "react";
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
import { useMaterialUpload } from "@/hooks/content/use-material-upload";
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle, formatDescription } from "@/lib/text-formatter";

interface MaterialUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  subjectId: string;
  topicTitle?: string;
}

export const MaterialUploadModal = ({
  isOpen,
  onClose,
  topicId,
  subjectId,
  topicTitle,
}: MaterialUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { startUpload, uploadState, reset } = useMaterialUpload();

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setMaterialFile(null);
      setIsDragOver(false);
      reset();
    }
  }, [isOpen, reset]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const validateMaterialFile = (file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      return "Only PDF, DOC, DOCX, PPT, and PPTX files are allowed";
    }

    const maxSize = 300 * 1024 * 1024; // 300MB
    if (file.size > maxSize) {
      return "Material file must be less than 300MB";
    }

    return null;
  };

  const handleMaterialSelect = useCallback((file: File) => {
    const error = validateMaterialFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setMaterialFile(file);
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  }, [title]);

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
      const material = files.find(
        (f) =>
          f.type.includes("pdf") ||
          f.type.includes("word") ||
          f.type.includes("presentation") ||
          f.name.endsWith(".pdf") ||
          f.name.endsWith(".doc") ||
          f.name.endsWith(".docx") ||
          f.name.endsWith(".ppt") ||
          f.name.endsWith(".pptx")
      );

      if (material) {
        handleMaterialSelect(material);
      }
    },
    [handleMaterialSelect]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Material title is required");
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

    if (!materialFile) {
      toast.error("Please select a material file");
      return;
    }

    try {
      await startUpload({
        topicId,
        subjectId,
        title: formatTopicTitle(title),
        description: description.trim() ? formatDescription(description) : undefined,
        material: materialFile,
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
          <DialogTitle>Upload Material</DialogTitle>
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
              Your material has been uploaded successfully.
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
                placeholder="e.g., Algebra Study Guide"
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
                placeholder="Brief description of the material..."
                rows={3}
                maxLength={2000}
                disabled={uploadState.isUploading}
              />
              <p className="text-xs text-brand-light-accent-1">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Material Upload */}
            <div className="space-y-2">
              <Label>
                Material File <span className="text-red-500">*</span>
              </Label>
              {!materialFile ? (
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
                  <FileText className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-4" />
                  <p className="text-sm font-medium text-brand-heading mb-1">
                    Drag and drop your material file here
                  </p>
                  <p className="text-xs text-brand-light-accent-1 mb-4">
                    or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMaterialSelect(file);
                    }}
                    className="hidden"
                    id="material-upload"
                    disabled={uploadState.isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("material-upload")?.click()}
                    disabled={uploadState.isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Material (PDF, DOC, DOCX, PPT, PPTX - max 300MB)
                  </Button>
                </div>
              ) : (
                <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-brand-primary" />
                      <div>
                        <p className="text-sm font-medium text-brand-heading">
                          {materialFile.name}
                        </p>
                        <p className="text-xs text-brand-light-accent-1">
                          {formatFileSize(materialFile.size)}
                        </p>
                      </div>
                    </div>
                    {!uploadState.isUploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setMaterialFile(null)}
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
                  !materialFile
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
                    Upload Material
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

