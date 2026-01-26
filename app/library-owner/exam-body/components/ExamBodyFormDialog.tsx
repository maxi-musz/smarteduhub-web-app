"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  useCreateExamBody,
  useUpdateExamBody,
} from "@/hooks/exam-body/use-exam-bodies";
import type { ExamBody, ExamBodyStatus } from "@/hooks/exam-body/types";

type Mode = "create" | "edit";

interface ExamBodyFormDialogProps {
  open: boolean;
  mode: Mode;
  examBody?: ExamBody | null;
  onOpenChange: (open: boolean) => void;
}

const STATUS_OPTIONS: ExamBodyStatus[] = ["active", "inactive", "archived"];

export const ExamBodyFormDialog = ({
  open,
  mode,
  examBody,
  onOpenChange,
}: ExamBodyFormDialogProps) => {
  const createMutation = useCreateExamBody();
  const updateMutation = useUpdateExamBody();

  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [status, setStatus] = useState<ExamBodyStatus>("active");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; fullName?: string }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mode === "edit" && examBody) {
      setName(examBody.name);
      setFullName(examBody.fullName);
      setDescription(examBody.description || "");
      setWebsiteUrl(examBody.websiteUrl || "");
      setStatus(examBody.status);
      setIconPreviewUrl(examBody.logoUrl || null);
    }
  }, [mode, examBody]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const isFormValid = useMemo(() => {
    if (!name.trim() || !fullName.trim()) return false;
    if (mode === "create" && !iconFile) return false;
    return true;
  }, [name, fullName, mode, iconFile]);

  const resetForm = () => {
    if (iconPreviewUrl && iconPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(iconPreviewUrl);
    }
    setName("");
    setFullName("");
    setDescription("");
    setWebsiteUrl("");
    setStatus("active");
    setIconFile(null);
    setIconPreviewUrl(null);
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      resetForm();
    }
  };

  const validate = () => {
    const nextErrors: { name?: string; fullName?: string } = {};
    if (!name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    if (mode === "create") {
      if (!iconFile) return;
      await createMutation.mutateAsync({
        name: name.trim(),
        fullName: fullName.trim(),
        icon: iconFile,
        description: description.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        status,
      });
      handleClose();
    } else if (examBody) {
      await updateMutation.mutateAsync({
        id: examBody.id,
        data: {
          name: name.trim(),
          fullName: fullName.trim(),
          icon: iconFile || undefined,
          description: description.trim() || undefined,
          websiteUrl: websiteUrl.trim() || undefined,
          status,
        },
      });
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Exam Body" : "Edit Exam Body"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam-body-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="exam-body-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="WAEC"
                required
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-body-full-name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="exam-body-full-name"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                placeholder="West African Examinations Council"
                required
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam-body-status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ExamBodyStatus)}>
                <SelectTrigger id="exam-body-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-body-website">Website</Label>
              <Input
                id="exam-body-website"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-body-description">Description</Label>
            <Textarea
              id="exam-body-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Brief description of the exam body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-body-icon">
              Icon {mode === "create" && <span className="text-red-500">*</span>}
            </Label>
            <input
              ref={fileInputRef}
              id="exam-body-icon"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setIconFile(file);
                if (file) {
                  const objectUrl = URL.createObjectURL(file);
                  setIconPreviewUrl((prev) => {
                    if (prev && prev.startsWith("blob:")) {
                      URL.revokeObjectURL(prev);
                    }
                    return objectUrl;
                  });
                } else {
                  setIconPreviewUrl(examBody?.logoUrl || null);
                }
              }}
            />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-muted/40 hover:border-primary/70 hover:bg-muted aspect-square w-28 cursor-pointer overflow-hidden transition-colors"
              >
                {iconPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={iconPreviewUrl}
                    alt="Exam body icon preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-4">
                    <span className="text-xs font-medium text-gray-700 text-center">
                      Click to upload
                    </span>
                    <span className="text-[10px] text-gray-500 text-center mt-1">
                      PNG, JPG, WEBP
                    </span>
                  </div>
                )}
              </button>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-gray-600">
                  Recommended square icons. Max size 5MB.
                </p>
                {iconFile && (
                  <p className="text-xs text-gray-700">
                    Selected: <span className="font-medium">{iconFile.name}</span>
                  </p>
                )}
                {mode === "edit" && !iconFile && examBody?.logoUrl && (
                  <p className="text-xs text-gray-600">
                    Current icon will remain unless you upload a new one.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Exam Body"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
