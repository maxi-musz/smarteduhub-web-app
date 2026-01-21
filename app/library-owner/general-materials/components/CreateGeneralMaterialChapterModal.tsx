"use client";

import { useState } from "react";
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
import { useCreateChapterWithFile } from "@/hooks/general-materials/use-general-material-mutations";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatChapterTitle, formatDescription } from "@/lib/text-formatter";

interface CreateGeneralMaterialChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId: string;
  onSuccess?: () => void;
}

export const CreateGeneralMaterialChapterModal = ({
  isOpen,
  onClose,
  materialId,
  onSuccess,
}: CreateGeneralMaterialChapterModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageStart, setPageStart] = useState<string>("");
  const [pageEnd, setPageEnd] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const createChapter = useCreateChapterWithFile();

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
    const maxSize = 300 * 1024 * 1024; // 300MB

    if (!allowedExtensions.includes(ext)) {
      return "Only PDF, DOC, DOCX, PPT, and PPTX files are allowed";
    }
    if (uploadFile.size > maxSize) {
      return "File must be less than 300MB";
    }
    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    const error = validateFile(selectedFile);
    if (error) {
      toast.error(error);
      return;
    }
    setFile(selectedFile);
    if (!fileTitle) {
      // Auto-fill file title from filename (without extension)
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFileTitle(nameWithoutExt);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    if (title.length > 200) {
      toast.error("Chapter title must be 200 characters or less");
      return;
    }

    if (description && description.length > 2000) {
      toast.error("Description must be 2000 characters or less");
      return;
    }

    // Validate page numbers if provided
    let parsedPageStart: number | undefined;
    let parsedPageEnd: number | undefined;

    if (pageStart.trim()) {
      parsedPageStart = parseInt(pageStart.trim(), 10);
      if (isNaN(parsedPageStart) || parsedPageStart < 1) {
        toast.error("Starting page must be a number greater than or equal to 1");
        return;
      }
    }

    if (pageEnd.trim()) {
      parsedPageEnd = parseInt(pageEnd.trim(), 10);
      if (isNaN(parsedPageEnd) || parsedPageEnd < 1) {
        toast.error("Ending page must be a number greater than or equal to 1");
        return;
      }
    }

    // Validate that pageStart <= pageEnd if both are provided
    if (parsedPageStart !== undefined && parsedPageEnd !== undefined) {
      if (parsedPageStart > parsedPageEnd) {
        toast.error("Starting page must be less than or equal to ending page");
        return;
      }
    }

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (fileTitle && fileTitle.length > 200) {
      toast.error("File title must be 200 characters or less");
      return;
    }

    if (fileDescription && fileDescription.length > 2000) {
      toast.error("File description must be 2000 characters or less");
      return;
    }

    try {
      await createChapter.mutateAsync({
        materialId,
        file,
        title: formatChapterTitle(title),
        description: description.trim() ? formatDescription(description) : undefined,
        pageStart: parsedPageStart,
        pageEnd: parsedPageEnd,
        fileTitle: fileTitle.trim() || undefined,
        fileDescription: fileDescription.trim() || undefined,
        enableAiChat: true, // Default to true for AI processing
      });

      toast.success("Chapter with file created successfully");
      handleClose();
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create chapter. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPageStart("");
    setPageEnd("");
    setFile(null);
    setFileTitle("");
    setFileDescription("");
    setIsDragOver(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Chapter Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 1: Introduction to Algebra"
              maxLength={200}
              required
              disabled={createChapter.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {title.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">
              Chapter File <span className="text-red-500">*</span>
            </Label>
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-brand-border hover:border-brand-primary/50"
                }`}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-brand-light-accent-1" />
                <p className="text-sm text-brand-heading mb-2">
                  Drag and drop a file here, or click to browse
                </p>
                <p className="text-xs text-brand-light-accent-1 mb-4">
                  PDF, DOC, DOCX, PPT, PPTX (max 300MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("chapter-file-upload")?.click()}
                  disabled={createChapter.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
                <input
                  id="chapter-file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleFileSelect(selectedFile);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-brand-primary" />
                    <div>
                      <p className="text-sm font-medium text-brand-heading">
                        {file.name}
                      </p>
                      <p className="text-xs text-brand-light-accent-1">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  {!createChapter.isPending && (
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this chapter covers..."
              rows={4}
              maxLength={2000}
              disabled={createChapter.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {description.length}/2000 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageStart">Starting Page (Optional)</Label>
              <Input
                id="pageStart"
                type="number"
                min="1"
                value={pageStart}
                onChange={(e) => setPageStart(e.target.value)}
                placeholder="e.g., 1"
                disabled={createChapter.isPending}
              />
              <p className="text-xs text-brand-light-accent-1">
                Page number where this chapter starts in the material
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageEnd">Ending Page (Optional)</Label>
              <Input
                id="pageEnd"
                type="number"
                min="1"
                value={pageEnd}
                onChange={(e) => setPageEnd(e.target.value)}
                placeholder="e.g., 20"
                disabled={createChapter.isPending}
              />
              <p className="text-xs text-brand-light-accent-1">
                Page number where this chapter ends in the material
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileTitle">File Title (Optional)</Label>
            <Input
              id="fileTitle"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              placeholder="e.g., Chapter 1 - Introduction PDF"
              maxLength={200}
              disabled={createChapter.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {fileTitle.length}/200 characters (defaults to filename if not provided)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileDescription">File Description (Optional)</Label>
            <Textarea
              id="fileDescription"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Brief description of the file content..."
              rows={3}
              maxLength={2000}
              disabled={createChapter.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {fileDescription.length}/2000 characters
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Page ranges are optional and help with AI chunking and context understanding. 
              The file will be automatically processed for AI chat if the material has AI enabled.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createChapter.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!file || createChapter.isPending}>
              {createChapter.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Chapter with File
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

