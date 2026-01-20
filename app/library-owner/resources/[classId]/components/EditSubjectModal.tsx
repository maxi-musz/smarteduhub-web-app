"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSubject, useUpdateSubjectThumbnail } from "@/hooks/subjects/use-update-subject";
import { Subject } from "@/hooks/library-owner/use-library-class-resources";
import { Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface EditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
}

export const EditSubjectModal = ({
  isOpen,
  onClose,
  subject,
}: EditSubjectModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    color: "#3B82F6",
    description: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUpdatingThumbnail, setIsUpdatingThumbnail] = useState(false);

  const updateSubject = useUpdateSubject();
  const updateThumbnail = useUpdateSubjectThumbnail();

  // Initialize form data when subject changes
  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || "",
        code: subject.code || "",
        color: subject.color || "#3B82F6",
        description: subject.description || "",
      });
      setThumbnailPreview(subject.thumbnailUrl || null);
      setThumbnail(null);
      setIsUpdatingThumbnail(false);
    }
  }, [subject]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG, PNG, GIF, or WEBP image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Thumbnail must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setThumbnail(file);
    setIsUpdatingThumbnail(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailClick = () => {
    document.getElementById("edit-thumbnail")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject) return;

    try {
      // Update subject details if any field changed
      const hasChanges = 
        formData.name !== subject.name ||
        formData.code !== subject.code ||
        formData.color !== subject.color ||
        formData.description !== (subject.description || "");

      if (hasChanges) {
        await updateSubject.mutateAsync({
          subjectId: subject.id,
          name: formData.name.trim() !== subject.name ? formData.name.trim() : undefined,
          code: formData.code.trim() !== subject.code ? formData.code.trim() : undefined,
          color: formData.color !== subject.color ? formData.color : undefined,
          description: formData.description.trim() !== (subject.description || "") 
            ? formData.description.trim() 
            : undefined,
        });
      }

      // Update thumbnail if a new one was selected
      if (isUpdatingThumbnail && thumbnail) {
        await updateThumbnail.mutateAsync({
          subjectId: subject.id,
          thumbnail,
        });
      }

      toast({
        title: "Success",
        description: "Subject updated successfully",
      });

      onClose();
    } catch (error) {
      // Error is handled by the mutation
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update subject",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!updateSubject.isPending && !updateThumbnail.isPending) {
      if (subject) {
        setFormData({
          name: subject.name || "",
          code: subject.code || "",
          color: subject.color || "#3B82F6",
          description: subject.description || "",
        });
        setThumbnailPreview(subject.thumbnailUrl || null);
      }
      setThumbnail(null);
      setIsUpdatingThumbnail(false);
      onClose();
    }
  };

  if (!subject) return null;

  const isPending = updateSubject.isPending || updateThumbnail.isPending;

  // Check if any changes have been made
  const hasChanges = 
    formData.name !== subject.name ||
    formData.code !== subject.code ||
    formData.color !== subject.color ||
    formData.description !== (subject.description || "") ||
    (isUpdatingThumbnail && thumbnail !== null);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Edit Subject</DialogTitle>
          <p className="text-xs text-brand-light-accent-1 mt-0.5">
            Update subject details for {subject.name}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-sm">
              Subject Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Mathematics"
              maxLength={200}
              required
              disabled={isPending}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-code" className="text-sm">Subject Code</Label>
            <Input
              id="edit-code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              placeholder="e.g., MATH"
              maxLength={20}
              disabled={isPending}
              className="h-9 text-sm"
            />
            <p className="text-xs text-brand-light-accent-1">
              Must be unique within your platform
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-color" className="text-sm">Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-color"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-12 h-9 cursor-pointer"
                disabled={isPending}
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="#3B82F6"
                maxLength={7}
                disabled={isPending}
                className="flex-1 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-description" className="text-sm">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the subject..."
              maxLength={1000}
              rows={2}
              disabled={isPending}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-thumbnail" className="text-sm">Thumbnail</Label>
            <div className="relative group">
              <div 
                className="relative w-full aspect-[3/4] max-h-48 rounded-lg overflow-hidden border border-brand-border bg-gray-100 flex items-center justify-center cursor-pointer"
                onClick={handleThumbnailClick}
              >
                <Image
                  src={thumbnailPreview || ""}
                  alt="Thumbnail preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-2">
                    <Camera className="h-5 w-5 text-gray-800" />
                  </div>
                </div>
              </div>
              <input
                id="edit-thumbnail"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleThumbnailChange}
                className="hidden"
                disabled={isPending}
              />
            </div>
            {isUpdatingThumbnail && (
              <p className="text-xs text-brand-light-accent-1">
                New thumbnail selected. Click &quot;Update Subject&quot; to save changes.
              </p>
            )}
            {!isUpdatingThumbnail && (
              <p className="text-xs text-brand-light-accent-1">
                Click on the thumbnail to change it
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending || !hasChanges}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Subject"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

