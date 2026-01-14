"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLink } from "@/hooks/content/use-create-link";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { formatTopicTitle } from "@/lib/text-formatter";

interface LinkCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  subjectId: string;
  chapterId?: string;
  topicTitle?: string;
}

const LINK_TYPES = [
  { value: "tutorial", label: "Tutorial" },
  { value: "article", label: "Article" },
  { value: "video", label: "Video" },
  { value: "reference", label: "Reference" },
  { value: "documentation", label: "Documentation" },
];

export const LinkCreateModal = ({
  isOpen,
  onClose,
  topicId,
  subjectId,
  chapterId,
  topicTitle,
}: LinkCreateModalProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [linkType, setLinkType] = useState<string>("");

  const createLink = useCreateLink();

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setUrl("");
      setDescription("");
      setLinkType("");
    }
  }, [isOpen]);

  const validateUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Link title is required");
      return;
    }

    if (title.length > 200) {
      toast.error("Title must be 200 characters or less");
      return;
    }

    if (!url.trim()) {
      toast.error("URL is required");
      return;
    }

    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL (must start with http:// or https://)");
      return;
    }

    if (description && description.length > 2000) {
      toast.error("Description must be 2000 characters or less");
      return;
    }

    if (linkType && linkType.length > 50) {
      toast.error("Link type must be 50 characters or less");
      return;
    }

    try {
      await createLink.mutateAsync({
        topicId,
        subjectId,
        chapterId: chapterId || undefined,
        title: formatTopicTitle(title),
        url: url.trim(),
        description: description.trim() || undefined,
        linkType: linkType || undefined,
      });

      toast.success("Link created successfully");
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err.message || "Failed to create link. Please try again."
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add External Link</DialogTitle>
          {topicTitle && (
            <p className="text-sm text-brand-light-accent-1 mt-1">
              Topic: {formatTopicTitle(topicTitle)}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Khan Academy - Algebra Basics"
              maxLength={200}
              required
              disabled={createLink.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">
              URL <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-brand-light-accent-1" />
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.example.com/resource"
                required
                disabled={createLink.isPending}
              />
            </div>
            <p className="text-xs text-brand-light-accent-1">
              Must be a valid URL starting with http:// or https://
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the external resource..."
              rows={3}
              maxLength={2000}
              disabled={createLink.isPending}
            />
            <p className="text-xs text-brand-light-accent-1">
              {description.length}/2000 characters
            </p>
          </div>

          {/* Link Type */}
          <div className="space-y-2">
            <Label htmlFor="linkType">Link Type (Optional)</Label>
            <Select
              value={linkType}
              onValueChange={setLinkType}
              disabled={createLink.isPending}
            >
              <SelectTrigger id="linkType">
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {LINK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-brand-light-accent-1">
              Categorize the type of external resource
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createLink.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLink.isPending}>
              {createLink.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Create Link
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

