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
import { Loader2 } from "lucide-react";
import {
  useCreateExamBodySubject,
  useUpdateExamBodySubject,
} from "@/hooks/exam-body/use-exam-body-subjects";
import type { ExamBodySubject } from "@/hooks/exam-body/types";

type Mode = "create" | "edit";

interface SubjectFormDialogProps {
  open: boolean;
  mode: Mode;
  examBodyId: string;
  subject?: ExamBodySubject | null;
  onOpenChange: (open: boolean) => void;
}

export const SubjectFormDialog = ({
  open,
  mode,
  examBodyId,
  subject,
  onOpenChange,
}: SubjectFormDialogProps) => {
  const createMutation = useCreateExamBodySubject(examBodyId);
  const updateMutation = useUpdateExamBodySubject(examBodyId);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; code?: string }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mode === "edit" && subject) {
      setName(subject.name);
      setCode(subject.code);
      setDescription(subject.description || "");
      setIconPreviewUrl(subject.iconUrl || null);
    }
  }, [mode, subject]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const isFormValid = useMemo(() => {
    if (!name.trim() || !code.trim()) return false;
    return true;
  }, [name, code]);

  const resetForm = () => {
    if (iconPreviewUrl && iconPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(iconPreviewUrl);
    }
    setName("");
    setCode("");
    setDescription("");
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
    const nextErrors: { name?: string; code?: string } = {};
    if (!name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (!code.trim()) {
      nextErrors.code = "Code is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    if (mode === "create") {
      await createMutation.mutateAsync({
        name: name.trim(),
        code: code.trim(),
        description: description.trim() || undefined,
        icon: iconFile || undefined,
      });
      handleClose();
      return;
    }

    if (mode === "edit" && subject) {
      await updateMutation.mutateAsync({
        id: subject.id,
        data: {
          name: name.trim(),
          code: code.trim(),
          description: description.trim() || undefined,
          icon: iconFile || undefined,
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
            {mode === "create" ? "Create Subject" : "Edit Subject"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam-body-subject-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="exam-body-subject-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="Mathematics"
                required
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-body-subject-code">
                Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="exam-body-subject-code"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  if (errors.code) {
                    setErrors((prev) => ({ ...prev, code: undefined }));
                  }
                }}
                placeholder="MATH"
                required
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-body-subject-description">Description</Label>
            <Textarea
              id="exam-body-subject-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-body-subject-icon">Icon</Label>
            <input
              ref={fileInputRef}
              id="exam-body-subject-icon"
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
                  setIconPreviewUrl(subject?.iconUrl || null);
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
                    alt="Subject icon preview"
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
                {mode === "edit" && !iconFile && subject?.iconUrl && (
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
                "Create Subject"
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
