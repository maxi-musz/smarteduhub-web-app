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
import { useCreateCBT } from "@/hooks/assessment/use-cbt";
import { Loader2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { CreateCBTRequest, GradingType } from "@/hooks/assessment/use-cbt-types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreateCBTDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  topicId?: string;
  onSuccess: () => void;
}

export const CreateCBTDialog = ({
  isOpen,
  onClose,
  subjectId,
  topicId,
  onSuccess,
}: CreateCBTDialogProps) => {
  const createCBT = useCreateCBT();

  // Form state
  const [formData, setFormData] = useState<CreateCBTRequest>({
    title: "",
    subjectId: subjectId,
    topicId: topicId,
    description: "",
    instructions: "",
    duration: 30,
    timeLimit: undefined,
    maxAttempts: undefined, // Default to undefined (unlimited attempts)
    passingScore: 50,
    totalPoints: 100,
    shuffleQuestions: false,
    shuffleOptions: false,
    showCorrectAnswers: false,
    showFeedback: true,
    studentCanViewGrading: true,
    allowReview: true,
    gradingType: "AUTOMATIC",
    autoSubmit: false,
    tags: [],
    order: 0,
  });

  // Initialize startDate with current date/time when dialog opens
  const getCurrentDateTime = () => {
    const now = new Date();
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    return now.toISOString().slice(0, 16);
  };

  const [startDate, setStartDate] = useState(getCurrentDateTime());
  const [endDate, setEndDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset startDate to current date/time when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStartDate(getCurrentDateTime());
    }
  }, [isOpen]);

  // Validate form without updating state (for button disabled check)
  const checkFormValid = (): boolean => {
    // Required fields
    if (!formData.title.trim()) return false;
    if (formData.title.length > 200) return false;
    
    if (formData.description && formData.description.length > 2000) return false;
    if (formData.instructions && formData.instructions.length > 2000) return false;
    if (formData.duration === undefined || formData.duration < 1 || formData.duration > 300) return false;
    
    if (formData.timeLimit !== undefined) {
      if (formData.timeLimit < 60 || formData.timeLimit > 18000) return false;
    }
    
    // maxAttempts is optional - if set, must be between 1 and 10, or can be undefined/null for unlimited
    if (formData.maxAttempts !== undefined && formData.maxAttempts !== null) {
      if (formData.maxAttempts < 1 || formData.maxAttempts > 10) return false;
    }
    
    if (formData.passingScore !== undefined) {
      if (formData.passingScore < 0 || formData.passingScore > 100) return false;
    }
    
    if (formData.totalPoints !== undefined) {
      if (formData.totalPoints < 1) return false;
    }
    
    // Date validation - endDate is optional, but if set, must be after startDate
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) return false;
    }
    
    return true;
  };

  // Validate form and update errors state (for displaying errors)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = "Description must be 2000 characters or less";
    }

    if (formData.instructions && formData.instructions.length > 2000) {
      newErrors.instructions = "Instructions must be 2000 characters or less";
    }

    if (formData.duration === undefined || formData.duration < 1 || formData.duration > 300) {
      newErrors.duration = "Duration must be between 1 and 300 minutes";
    }

    if (formData.timeLimit !== undefined) {
      if (formData.timeLimit < 60 || formData.timeLimit > 18000) {
        newErrors.timeLimit = "Time limit must be between 60 and 18000 seconds";
      }
    }

    // maxAttempts is optional - if set, must be between 1 and 10, or can be undefined/null for unlimited
    if (formData.maxAttempts !== undefined && formData.maxAttempts !== null) {
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

    // Date validation - endDate is optional, but if set, must be after startDate
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        newErrors.endDate = "End date and time must be after start date and time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Update subjectId and topicId when props change
  useEffect(() => {
    setFormData((prev) => ({ ...prev, subjectId, topicId }));
  }, [subjectId, topicId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      // Convert datetime-local format to ISO format for backend
      const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return "";
        // datetime-local format is "YYYY-MM-DDTHH:mm", convert to ISO "YYYY-MM-DDTHH:mm:ssZ"
        const date = new Date(dateString);
        return date.toISOString();
      };

      const submitData: CreateCBTRequest = {
        ...formData,
        startDate: startDate ? formatDateForBackend(startDate) : undefined,
        endDate: endDate ? formatDateForBackend(endDate) : undefined,
        maxAttempts: formData.maxAttempts ?? undefined, // Ensure null becomes undefined
        tags: formData.tags || [],
      };

      await createCBT.mutateAsync(submitData);
      handleClose();
      onSuccess();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      subjectId: subjectId,
      description: "",
      instructions: "",
      duration: 30,
      timeLimit: undefined,
      maxAttempts: undefined, // Reset to undefined (unlimited attempts)
      passingScore: 50,
      totalPoints: 100,
      shuffleQuestions: false,
      shuffleOptions: false,
      showCorrectAnswers: false,
      showFeedback: true,
      studentCanViewGrading: true,
      allowReview: true,
      gradingType: "AUTOMATIC",
      autoSubmit: false,
      tags: [],
      order: 0,
    });
    setStartDate(getCurrentDateTime()); // Reset to current date/time
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-visible">
        <DialogHeader>
          <DialogTitle>Create New CBT Assessment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 hover:text-brand-primary transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start"
                  className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs"
                  sideOffset={5}
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <p>
                    Enter a clear, descriptive title for this assessment. This will be visible to students.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
              onBlur={() => validateForm()}
              placeholder="e.g., Algebra Basics Quiz"
              maxLength={200}
              required
              disabled={createCBT.isPending}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center focus:outline-none"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 hover:text-brand-primary transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start"
                  className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs"
                  sideOffset={5}
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <p>
                    Provide a brief overview of what this assessment covers. This helps students understand what to expect.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
              onBlur={() => validateForm()}
              placeholder="Brief description of the assessment..."
              rows={3}
              maxLength={2000}
              disabled={createCBT.isPending}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {formData.description?.length || 0}/2000 characters
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center focus:outline-none"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 hover:text-brand-primary transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start"
                  className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs"
                  sideOffset={5}
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <p>
                    Provide detailed instructions for students on how to complete this assessment. This will be shown before they begin.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => {
                setFormData({ ...formData, instructions: e.target.value });
              }}
              onBlur={() => validateForm()}
              placeholder="Instructions for students taking this assessment..."
              rows={3}
              maxLength={2000}
              disabled={createCBT.isPending}
            />
            {errors.instructions && (
              <p className="text-xs text-red-500">{errors.instructions}</p>
            )}
            <p className="text-xs text-brand-light-accent-1">
              {formData.instructions?.length || 0}/2000 characters
            </p>
          </div>

          {/* Note: Chapter and Topic selection can be added later when we have access to chapter/topic data */}

          {/* Duration and Time Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="duration">
                  Duration (minutes) <span className="text-red-500">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The expected time it takes to complete this assessment. This is informational and helps students plan their time.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="duration"
                type="number"
                min="1"
                max="300"
                value={formData.duration || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  duration: e.target.value ? parseInt(e.target.value) : undefined,
                });
              }}
              onBlur={() => validateForm()}
                placeholder="30"
                required
                disabled={createCBT.isPending}
              />
              {errors.duration && (
                <p className="text-xs text-red-500">{errors.duration}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">
                1-300 minutes
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Maximum time allowed to complete the assessment. If auto-submit is enabled, the assessment will automatically submit when time expires.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="timeLimit"
                type="number"
                min="60"
                max="18000"
                value={formData.timeLimit || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                });
              }}
              onBlur={() => validateForm()}
                placeholder="1800 (30 min)"
                disabled={createCBT.isPending}
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
              <div className="flex items-center gap-2">
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      When the assessment becomes available to students. Leave empty if it should be available immediately.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  
                  // If end date exists and is now invalid, clear it or update it
                  if (endDate && newStartDate) {
                    const start = new Date(newStartDate);
                    const end = new Date(endDate);
                    if (end <= start) {
                      // Clear end date if it's now invalid
                      setEndDate("");
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.endDate;
                        return newErrors;
                      });
                    } else {
                      // Clear any errors if valid
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.endDate;
                        return newErrors;
                      });
                    }
                  }
                }}
                onBlur={() => validateForm()}
                min={new Date().toISOString().slice(0, 16)}
                disabled={createCBT.isPending}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">
                Defaults to current date and time. If set, assessment will only be available after this date.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="endDate">End Date & Time</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      When the assessment will no longer be available. Must be after the start date. Leave empty for no end date (assessment available forever).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  
                  // Allow setting end date (it's optional)
                  setEndDate(newEndDate);
                  
                  // Validate that end date is after start date (if both are set)
                  if (newEndDate && startDate) {
                    const start = new Date(startDate);
                    const end = new Date(newEndDate);
                    
                    // If end is before or equal to start, show error
                    if (end <= start) {
                      setErrors((prev) => ({ 
                        ...prev, 
                        endDate: "End date and time must be after start date and time" 
                      }));
                    } else {
                      // Valid end date - clear any errors
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.endDate;
                        return newErrors;
                      });
                    }
                  } else {
                    // Empty end date or no start date - clear errors (end date is optional)
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.endDate;
                      return newErrors;
                    });
                  }
                }}
                onBlur={() => {
                  // On blur, if invalid, reset to minimum valid value or clear
                  if (endDate && startDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    if (end <= start) {
                      // Reset to 1 minute after start date
                      const minEndDate = new Date(start.getTime() + 60000).toISOString().slice(0, 16);
                      setEndDate(minEndDate);
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.endDate;
                        return newErrors;
                      });
                    }
                  }
                  validateForm();
                }}
                min={
                  startDate
                    ? new Date(new Date(startDate).getTime() + 60000).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16)
                }
                disabled={createCBT.isPending}
                placeholder="Leave empty for no end date"
              />
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">
                Optional - leave empty for no end date (assessment available forever)
              </p>
            </div>
          </div>

          {/* Attempts, Points, and Passing Score */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Maximum number of times a student can attempt this assessment. Leave empty for unlimited attempts.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="maxAttempts"
                type="number"
                min="1"
                max="10"
                value={formData.maxAttempts ?? ""}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setFormData({
                    ...formData,
                    maxAttempts: value ? parseInt(value) : undefined,
                  });
                  // Clear error when user types
                  if (errors.maxAttempts) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.maxAttempts;
                      return newErrors;
                    });
                  }
                }}
                onBlur={() => validateForm()}
                placeholder="Leave empty for unlimited"
                disabled={createCBT.isPending}
              />
              {errors.maxAttempts && (
                <p className="text-xs text-red-500">{errors.maxAttempts}</p>
              )}
              <p className="text-xs text-brand-light-accent-1">1-10, or leave empty for unlimited attempts</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="totalPoints">Total Points</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The total points possible for this assessment. This is the sum of all question points.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="totalPoints"
                type="number"
                min="1"
                value={formData.totalPoints || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    totalPoints: e.target.value ? parseInt(e.target.value) : undefined,
                  });
                }}
                onBlur={() => validateForm()}
                placeholder="100"
                disabled={createCBT.isPending}
              />
              {errors.totalPoints && (
                <p className="text-xs text-red-500">{errors.totalPoints}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The minimum percentage score required to pass this assessment. Students scoring below this will be marked as failed.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    passingScore: e.target.value ? parseInt(e.target.value) : undefined,
                  });
                }}
                onBlur={() => validateForm()}
                placeholder="50"
                disabled={createCBT.isPending}
              />
              {errors.passingScore && (
                <p className="text-xs text-red-500">{errors.passingScore}</p>
              )}
            </div>
          </div>

          {/* Grading Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="gradingType">Grading Type</Label>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center focus:outline-none"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 hover:text-brand-primary transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start"
                  className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs"
                  sideOffset={5}
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <p>
                    <strong>Automatic:</strong> System grades all questions automatically.<br/>
                    <strong>Manual:</strong> All questions require manual grading.<br/>
                    <strong>Mixed:</strong> Some questions are auto-graded, others require manual review.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={formData.gradingType}
              onValueChange={(value: GradingType) =>
                setFormData({ ...formData, gradingType: value })
              }
              disabled={createCBT.isPending}
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
              <div className="flex items-center gap-2">
                <Label htmlFor="shuffleQuestions" className="cursor-pointer">
                  Shuffle Questions
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Randomize the order of questions for each student. This helps prevent cheating and ensures each student sees questions in a different order.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="shuffleQuestions"
                checked={formData.shuffleQuestions}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, shuffleQuestions: checked })
                }
                disabled={createCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="shuffleOptions" className="cursor-pointer">
                  Shuffle Options
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Randomize the order of answer options (A, B, C, D) for multiple choice questions. This further prevents cheating.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="shuffleOptions"
                checked={formData.shuffleOptions}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, shuffleOptions: checked })
                }
                disabled={createCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="showCorrectAnswers" className="cursor-pointer">
                  Show Correct Answers
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Display the correct answers to students after they submit the assessment. Useful for learning purposes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="showCorrectAnswers"
                checked={formData.showCorrectAnswers}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, showCorrectAnswers: checked })
                }
                disabled={createCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="showFeedback" className="cursor-pointer">
                  Show Feedback
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Display explanations and feedback for each question after submission. This helps students learn from their mistakes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="showFeedback"
                checked={formData.showFeedback}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, showFeedback: checked })
                }
                disabled={createCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="studentCanViewGrading" className="cursor-pointer">
                  Students Can View Grading
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Allow students to see their grade, score breakdown, and assessment results after completion.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="studentCanViewGrading"
                checked={formData.studentCanViewGrading}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, studentCanViewGrading: checked })
                }
                disabled={createCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="allowReview" className="cursor-pointer">
                  Allow Review After Submission
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Let students review their submitted answers, see which questions they got right or wrong, and view feedback.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="allowReview"
                checked={formData.allowReview}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allowReview: checked })
                }
                disabled={createCBT.isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="autoSubmit" className="cursor-pointer">
                  Auto-Submit on Time Expiry
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 cursor-pointer hover:text-brand-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Automatically submit the assessment when the time limit expires, even if the student hasn&apos;t finished. Requires a time limit to be set.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="autoSubmit"
                checked={formData.autoSubmit}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, autoSubmit: checked })
                }
                disabled={createCBT.isPending}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center focus:outline-none"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-4 w-4 text-brand-light-accent-1 hover:text-brand-primary transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start"
                  className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs"
                  sideOffset={5}
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <p>
                    Add tags to categorize and organize your assessments. Useful for filtering and searching assessments later.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
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
                disabled={createCBT.isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={createCBT.isPending || !tagInput.trim()}
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
                      disabled={createCBT.isPending}
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
              disabled={createCBT.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createCBT.isPending || !checkFormValid()}
            >
              {createCBT.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create CBT"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

