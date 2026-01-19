"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateQuestion, type CreateQuestionRequest, type QuestionType } from "@/hooks/use-teacher-assessments";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface CreateQuestionDialogProps {
  assessmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextOrder: number;
}

export const CreateQuestionDialog = ({
  assessmentId,
  open,
  onOpenChange,
  nextOrder,
}: CreateQuestionDialogProps) => {
  const createMutation = useCreateQuestion();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    question_text: "",
    question_type: "MULTIPLE_CHOICE_SINGLE",
    order: nextOrder,
    points: 1,
    is_required: true,
    options: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Create preview URL when image file is selected
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  // Validation logic
  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    // Question text is required
    if (!formData.question_text.trim()) {
      errors.push("Question text is required");
    }

    // For multiple choice and true/false questions, validate options
    if (
      formData.question_type === "MULTIPLE_CHOICE_SINGLE" ||
      formData.question_type === "MULTIPLE_CHOICE_MULTIPLE" ||
      formData.question_type === "TRUE_FALSE"
    ) {
      const options = formData.options || [];
      
      // Must have at least 2 options
      if (options.length < 2) {
        errors.push("Add at least 2 options");
      }

      // All options must have text
      const emptyOptions = options.filter((opt) => !opt.option_text.trim());
      if (emptyOptions.length > 0) {
        errors.push("All options must have text");
      }

      // At least one option must be marked as correct
      const hasCorrectAnswer = options.some((opt) => opt.is_correct);
      if (!hasCorrectAnswer) {
        errors.push("Select at least one correct answer");
      }
    }

    // Points must be greater than 0
    if (!formData.points || formData.points <= 0) {
      errors.push("Points must be greater than 0");
    }

    return errors;
  }, [formData]);

  const isFormValid = validationErrors.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove order from data since backend handles it automatically
    // Also remove image_url and image_s3_key - they're not needed when uploading file
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { order: _order, image_url: _image_url, image_s3_key: _image_s3_key, ...dataToSubmit } = formData;
    createMutation.mutate(
      { assessmentId, data: dataToSubmit, imageFile: imageFile || undefined },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({
            question_text: "",
            question_type: "MULTIPLE_CHOICE_SINGLE",
            order: nextOrder,
            points: 1,
            is_required: true,
            options: [],
          });
          setImageFile(null);
          setImagePreviewUrl(null);
          setShowImage(false);
          setShowExplanation(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      }
    );
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        {
          option_text: "",
          order: (prev.options?.length || 0) + 1,
          is_correct: false,
        },
      ],
    }));
  };

  const updateOption = (index: number, field: string, value: unknown) => {
    setFormData((prev) => {
      const options = [...(prev.options || [])];
      options[index] = { ...options[index], [field]: value };
      return { ...prev, options };
    });
  };

  const removeOption = (index: number) => {
    setFormData((prev) => {
      const options = [...(prev.options || [])];
      options.splice(index, 1);
      // Reorder remaining options
      options.forEach((opt, idx) => {
        opt.order = idx + 1;
      });
      return { ...prev, options };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Create a new question for this assessment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              required
              rows={3}
            />
            {!formData.question_text.trim() && (
              <p className="text-xs text-red-600">Question text is required</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question_type">Question Type *</Label>
              <Select
                value={formData.question_type}
                onValueChange={(value) => {
                  const newType = value as QuestionType;
                  if (newType === "TRUE_FALSE") {
                    // Auto-populate True/False options
                    setFormData({
                      ...formData,
                      question_type: newType,
                      options: [
                        { option_text: "True", order: 1, is_correct: false },
                        { option_text: "False", order: 2, is_correct: false },
                      ],
                    });
                  } else {
                    setFormData({ ...formData, question_type: newType, options: [] });
                  }
                }}
              >
                <SelectTrigger id="question_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MULTIPLE_CHOICE_SINGLE">Multiple Choice (Single)</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice (Multiple)</SelectItem>
                  <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
              />
              {(!formData.points || formData.points <= 0) && (
                <p className="text-xs text-red-600">Points must be greater than 0</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => setShowImage(!showImage)}
            >
              <Label className="font-normal cursor-pointer">Question Image (Optional)</Label>
              {showImage ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {showImage && (
              <>
                <input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);

                    if (file) {
                      const objectUrl = URL.createObjectURL(file);
                      setImagePreviewUrl((prev) => {
                        if (prev && prev.startsWith("blob:")) {
                          URL.revokeObjectURL(prev);
                        }
                        return objectUrl;
                      });
                    } else {
                      setImagePreviewUrl(null);
                    }
                  }}
                />
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-muted/40 hover:border-primary/70 hover:bg-muted aspect-square w-32 cursor-pointer overflow-hidden transition-colors"
                  >
                    {imagePreviewUrl ? (
                      // Preview uploaded image inside the square
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreviewUrl}
                        alt="Question"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4 py-4">
                        <svg
                          className="h-6 w-6 mb-2 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Click to upload
                        </span>
                        <span className="text-[10px] text-gray-500 text-center mt-1">
                          or drag &amp; drop
                        </span>
                      </div>
                    )}
                  </button>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-gray-600">
                      Supported formats: JPG, PNG, GIF, WEBP. Max size 5MB.
                    </p>
                    {imageFile && (
                      <p className="text-xs text-gray-700">
                        Selected: <span className="font-medium">{imageFile.name}</span>
                        <span className="text-gray-500 ml-2">(will be uploaded with question)</span>
                      </p>
                    )}
                  </div>
                </div>
                {imageFile && (
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Image
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {(formData.question_type === "MULTIPLE_CHOICE_SINGLE" ||
            formData.question_type === "MULTIPLE_CHOICE_MULTIPLE" ||
            formData.question_type === "TRUE_FALSE") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                {formData.question_type !== "TRUE_FALSE" && (
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    Add Option
                  </Button>
                )}
              </div>
              {formData.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.option_text}
                    onChange={(e) => updateOption(index, "option_text", e.target.value)}
                    placeholder="Option text"
                    className="flex-1"
                    disabled={formData.question_type === "TRUE_FALSE"}
                  />
                  <Button
                    type="button"
                    variant={option.is_correct ? "default" : "outline"}
                    onClick={() => updateOption(index, "is_correct", !option.is_correct)}
                  >
                    {option.is_correct ? "Correct" : "Mark Correct"}
                  </Button>
                  {formData.question_type !== "TRUE_FALSE" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.options && formData.options.length < 2 && (
                <p className="text-xs text-red-600">Add at least 2 options</p>
              )}
              {formData.options && formData.options.some((opt) => !opt.option_text.trim()) && (
                <p className="text-xs text-red-600">All options must have text</p>
              )}
              {formData.options && formData.options.length >= 2 && !formData.options.some((opt) => opt.is_correct) && (
                <p className="text-xs text-red-600">Select at least one correct answer</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <Label className="font-normal cursor-pointer">Explanation (Optional)</Label>
              {showExplanation ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {showExplanation && (
              <Textarea
                id="explanation"
                value={formData.explanation || ""}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={2}
                placeholder="Add an explanation for the correct answer..."
              />
            )}
          </div>

          {validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs font-medium text-red-800 mb-1">Please fix the following:</p>
              <ul className="text-xs text-red-700 list-disc list-inside space-y-0.5">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !isFormValid}>
              {createMutation.isPending ? "Creating..." : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


