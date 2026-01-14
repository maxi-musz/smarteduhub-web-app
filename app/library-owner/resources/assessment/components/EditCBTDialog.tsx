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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCBT } from "@/hooks/assessment/use-cbt";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CBT, UpdateCBTRequest, GradingType } from "@/hooks/assessment/use-cbt-types";

interface EditCBTDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cbt: CBT;
  onSuccess: () => void;
}

export const EditCBTDialog = ({
  isOpen,
  onClose,
  cbt,
  onSuccess,
}: EditCBTDialogProps) => {
  const updateCBT = useUpdateCBT();

  // Form state
  const [formData, setFormData] = useState<UpdateCBTRequest>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when CBT changes
  useEffect(() => {
    if (cbt) {
      setFormData({
        title: cbt.title,
        description: cbt.description || "",
        instructions: cbt.instructions || "",
        duration: cbt.duration || undefined,
        timeLimit: cbt.timeLimit || undefined,
        maxAttempts: cbt.maxAttempts,
        passingScore: cbt.passingScore,
        totalPoints: cbt.totalPoints,
        shuffleQuestions: cbt.shuffleQuestions,
        shuffleOptions: cbt.shuffleOptions,
        showCorrectAnswers: cbt.showCorrectAnswers,
        showFeedback: cbt.showFeedback,
        studentCanViewGrading: cbt.studentCanViewGrading,
        allowReview: cbt.allowReview,
        gradingType: cbt.gradingType,
        autoSubmit: cbt.autoSubmit,
        tags: cbt.tags || [],
        order: cbt.order,
      });
      setStartDate(cbt.startDate ? new Date(cbt.startDate).toISOString().slice(0, 16) : "");
      setEndDate(cbt.endDate ? new Date(cbt.endDate).toISOString().slice(0, 16) : "");
      setTagInput("");
      setErrors({});
    }
  }, [cbt]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title !== undefined) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.length > 200) {
        newErrors.title = "Title must be 200 characters or less";
      }
    }

    if (formData.description !== undefined && formData.description.length > 2000) {
      newErrors.description = "Description must be 2000 characters or less";
    }

    if (formData.instructions !== undefined && formData.instructions.length > 2000) {
      newErrors.instructions = "Instructions must be 2000 characters or less";
    }

    if (formData.duration !== undefined) {
      if (formData.duration < 1 || formData.duration > 300) {
        newErrors.duration = "Duration must be between 1 and 300 minutes";
      }
    }

    if (formData.timeLimit !== undefined) {
      if (formData.timeLimit < 60 || formData.timeLimit > 18000) {
        newErrors.timeLimit = "Time limit must be between 60 and 18000 seconds";
      }
    }

    if (formData.maxAttempts !== undefined) {
      if (formData.maxAttempts < 1 || formData.maxAttempts > 10) {
        newErrors.maxAttempts = "Max attempts must be between 1 and 10";
      }
    }

    if (formData.passingScore !== undefined) {
      if (formData.passingScore < 0 || formData.passingScore > 100) {
        newErrors.passingScore = "Passing score must be between 0 and 100";
      }
    }

    if (formData.totalPoints !== undefined) {
      if (formData.totalPoints < 1) {
        newErrors.totalPoints = "Total points must be at least 1";
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const submitData: UpdateCBTRequest = {
        ...formData,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        tags: formData.tags || [],
      };

      await updateCBT.mutateAsync({ id: cbt.id, data: submitData });
      handleClose();
      onSuccess();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    setFormData({});
    setStartDate("");
    setEndDate("");
    setTagInput("");
    setErrors({});
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit CBT Assessment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Algebra Basics Quiz"
              maxLength={200}
              required
              disabled={updateCBT.isPending}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {(formData.title || "").length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the assessment..."
              rows={3}
              maxLength={2000}
              disabled={updateCBT.isPending}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {(formData.description || "").length}/2000 characters
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions || ""}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Instructions for students taking this assessment..."
              rows={3}
              maxLength={2000}
              disabled={updateCBT.isPending}
            />
            {errors.instructions && (
              <p className="text-xs text-red-500">{errors.instructions}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {(formData.instructions || "").length}/2000 characters
            </p>
          </div>

          {/* Duration and Time Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="300"
                value={formData.duration || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="30"
                disabled={updateCBT.isPending}
              />
              {errors.duration && (
                <p className="text-xs text-red-500">{errors.duration}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">
                1-300 minutes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="60"
                max="18000"
                value={formData.timeLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="1800 (30 min)"
                disabled={updateCBT.isPending}
              />
              {errors.timeLimit && (
                <p className="text-xs text-red-500">{errors.timeLimit}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">
                60-18000 seconds (optional)
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={updateCBT.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={updateCBT.isPending}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Attempts, Points, and Passing Score */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Max Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="1"
                max="10"
                value={formData.maxAttempts || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxAttempts: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="1"
                disabled={updateCBT.isPending}
              />
              {errors.maxAttempts && (
                <p className="text-xs text-red-500">{errors.maxAttempts}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">1-10</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPoints">Total Points</Label>
              <Input
                id="totalPoints"
                type="number"
                min="1"
                value={formData.totalPoints || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalPoints: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="100"
                disabled={updateCBT.isPending}
              />
              {errors.totalPoints && (
                <p className="text-xs text-red-500">{errors.totalPoints}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingScore: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="50"
                disabled={updateCBT.isPending}
              />
              {errors.passingScore && (
                <p className="text-xs text-red-500">{errors.passingScore}</p>
              )}
            </div>
          </div>

          {/* Grading Type */}
          <div className="space-y-2">
            <Label htmlFor="gradingType">Grading Type</Label>
            <Select
              value={formData.gradingType || "AUTOMATIC"}
              onValueChange={(value: GradingType) =>
                setFormData({ ...formData, gradingType: value })
              }
              disabled={updateCBT.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="MIXED">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Switches */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="shuffleQuestions" className="cursor-pointer">
                Shuffle Questions
              </Label>
              <Switch
                id="shuffleQuestions"
                checked={formData.shuffleQuestions || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, shuffleQuestions: checked })
                }
                disabled={updateCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="shuffleOptions" className="cursor-pointer">
                Shuffle Options
              </Label>
              <Switch
                id="shuffleOptions"
                checked={formData.shuffleOptions || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, shuffleOptions: checked })
                }
                disabled={updateCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showCorrectAnswers" className="cursor-pointer">
                Show Correct Answers
              </Label>
              <Switch
                id="showCorrectAnswers"
                checked={formData.showCorrectAnswers || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, showCorrectAnswers: checked })
                }
                disabled={updateCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showFeedback" className="cursor-pointer">
                Show Feedback
              </Label>
              <Switch
                id="showFeedback"
                checked={formData.showFeedback || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, showFeedback: checked })
                }
                disabled={updateCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="studentCanViewGrading" className="cursor-pointer">
                Students Can View Grading
              </Label>
              <Switch
                id="studentCanViewGrading"
                checked={formData.studentCanViewGrading || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, studentCanViewGrading: checked })
                }
                disabled={updateCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowReview" className="cursor-pointer">
                Allow Review After Submission
              </Label>
              <Switch
                id="allowReview"
                checked={formData.allowReview || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allowReview: checked })
                }
                disabled={updateCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoSubmit" className="cursor-pointer">
                Auto-Submit on Time Expiry
              </Label>
              <Switch
                id="autoSubmit"
                checked={formData.autoSubmit || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, autoSubmit: checked })
                }
                disabled={updateCBT.isPending}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                disabled={updateCBT.isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={updateCBT.isPending || !tagInput.trim()}
              >
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-2 py-1 rounded text-xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                      disabled={updateCBT.isPending}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateCBT.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateCBT.isPending}>
              {updateCBT.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update CBT"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

