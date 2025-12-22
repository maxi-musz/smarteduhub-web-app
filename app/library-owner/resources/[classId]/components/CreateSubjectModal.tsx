"use client";

import { useState } from "react";
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
import { useCreateSubject } from "@/hooks/subjects/use-create-subject";
import { Loader2, X, Upload, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
}

export const CreateSubjectModal = ({
  isOpen,
  onClose,
  classId,
  className,
}: CreateSubjectModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    color: "#3B82F6",
    description: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const createSubject = useCreateSubject();

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

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailClick = () => {
    document.getElementById("thumbnail")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    if (!thumbnail) {
      toast({
        title: "Validation Error",
        description: "Thumbnail is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSubject.mutateAsync({
        classId,
        name: formData.name.trim(),
        code: formData.code.trim() || undefined,
        color: formData.color || "#3B82F6",
        description: formData.description.trim() || undefined,
        thumbnail,
      });

      toast({
        title: "Success",
        description: "Subject created successfully",
      });

      // Reset form and close modal
      setFormData({
        name: "",
        code: "",
        color: "#3B82F6",
        description: "",
      });
      setThumbnail(null);
      setThumbnailPreview(null);
      onClose();
    } catch (error) {
      // Error is handled by the mutation
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create subject",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!createSubject.isPending) {
      setFormData({
        name: "",
        code: "",
        color: "#3B82F6",
        description: "",
      });
      setThumbnail(null);
      setThumbnailPreview(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Create New Subject</DialogTitle>
          <p className="text-xs text-brand-light-accent-1 mt-0.5">
            Add a new subject to {className}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm">
              Subject Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Mathematics"
              maxLength={200}
              required
              disabled={createSubject.isPending}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-sm">Subject Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              placeholder="e.g., MATH"
              maxLength={20}
              disabled={createSubject.isPending}
              className="h-9 text-sm"
            />
            <p className="text-xs text-brand-light-accent-1">
              Must be unique within your platform
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="color" className="text-sm">Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-12 h-9 cursor-pointer"
                disabled={createSubject.isPending}
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="#3B82F6"
                maxLength={7}
                disabled={createSubject.isPending}
                className="flex-1 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the subject..."
              maxLength={1000}
              rows={2}
              disabled={createSubject.isPending}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thumbnail" className="text-sm">
              Thumbnail <span className="text-red-500">*</span>
            </Label>
            {thumbnailPreview ? (
              <div className="relative group">
                <div 
                  className="relative w-full aspect-[3/4] max-h-48 rounded-lg overflow-hidden border border-brand-border bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={handleThumbnailClick}
                >
                  <Image
                    src={thumbnailPreview}
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
                  id="thumbnail"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  disabled={createSubject.isPending}
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-brand-border rounded-lg p-4">
                <label
                  htmlFor="thumbnail"
                  className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors rounded-lg py-2"
                >
                  <Upload className="h-6 w-6 text-brand-light-accent-1 mb-1" />
                  <p className="text-xs font-medium text-brand-heading mb-0.5">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-brand-light-accent-1">
                    JPEG, PNG, GIF, WEBP (max 5MB)
                  </p>
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    disabled={createSubject.isPending}
                    required
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={createSubject.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createSubject.isPending}
            >
              {createSubject.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Subject"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

