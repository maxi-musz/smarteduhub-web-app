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
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestionImage,
} from "@/hooks/assessment/use-cbt-questions";
import { Loader2, X, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  CBT,
  Question,
  QuestionType,
  DifficultyLevel,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionOption,
  CorrectAnswer,
} from "@/hooks/assessment/use-cbt-types";
import Image from "next/image";

interface QuestionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cbt: CBT;
  question?: Question | null;
  isEditing?: boolean;
  onSuccess: () => void;
}

export const QuestionFormDialog = ({
  isOpen,
  onClose,
  cbt,
  question,
  isEditing = false,
  onSuccess,
}: QuestionFormDialogProps) => {
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteImage = useDeleteQuestionImage();

  // Form state
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    questionText: "",
    questionType: "MULTIPLE_CHOICE_SINGLE",
    points: 1,
    isRequired: true,
    difficultyLevel: "MEDIUM",
    showHint: false,
    allowMultipleAttempts: false,
    options: [],
    correctAnswers: [],
  });

  const [hintText, setHintText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when editing
  useEffect(() => {
    if (isEditing && question) {
      setFormData({
        questionText: question.questionText,
        questionType: question.questionType,
        points: question.points,
        isRequired: question.isRequired,
        timeLimit: question.timeLimit || undefined,
        difficultyLevel: question.difficultyLevel,
        showHint: question.showHint,
        hintText: question.hintText || undefined,
        explanation: question.explanation || undefined,
        allowMultipleAttempts: question.allowMultipleAttempts,
        minLength: question.minLength || undefined,
        maxLength: question.maxLength || undefined,
        minValue: question.minValue || undefined,
        maxValue: question.maxValue || undefined,
        imageUrl: question.imageUrl || undefined,
        imageS3Key: question.imageS3Key || undefined,
        options: question.options.map((opt) => ({
          id: opt.id,
          optionText: opt.optionText,
          order: opt.order,
          isCorrect: opt.isCorrect,
          imageUrl: opt.imageUrl || undefined,
          audioUrl: opt.audioUrl || undefined,
        })),
        correctAnswers: question.correctAnswers.map((ans) => ({
          id: ans.id,
          answerText: ans.answerText || undefined,
          answerNumber: ans.answerNumber || undefined,
          answerDate: ans.answerDate || undefined,
          optionIds: ans.optionIds || [],
          answerJson: ans.answerJson || undefined,
        })),
      });
      setHintText(question.hintText || "");
      setExplanation(question.explanation || "");
      setImagePreview(question.imageUrl || null);
    } else {
      // Reset form for new question
      setFormData({
        questionText: "",
        questionType: "MULTIPLE_CHOICE_SINGLE",
        points: 1,
        isRequired: true,
        difficultyLevel: "MEDIUM",
        showHint: false,
        allowMultipleAttempts: false,
        options: [],
        correctAnswers: [],
      });
      setHintText("");
      setExplanation("");
      setImageFile(null);
      setImagePreview(null);
    }
    setErrors({});
  }, [isEditing, question, isOpen]);

  // Handle image file selection (no upload - image will be sent with question creation)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid image type. Please use JPEG, PNG, GIF, or WEBP");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    // If editing and question has an existing image, delete it from server
    if (isEditing && question && question.imageS3Key) {
      try {
        await deleteImage.mutateAsync({
          cbtId: cbt.id,
          questionId: question.id,
        });
      } catch {
        // Error handled by hook
      }
    }
    // Clear local image state
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle options for multiple choice questions
  const handleAddOption = () => {
    const newOrder = formData.options?.length ? formData.options.length + 1 : 1;
    setFormData({
      ...formData,
      options: [
        ...(formData.options || []),
        {
          optionText: "",
          order: newOrder,
          isCorrect: false,
        },
      ],
    });
    // Clear options error when adding new option
    if (errors.options) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.options;
        return newErrors;
      });
    }
  };

  const handleUpdateOption = (index: number, field: keyof QuestionOption, value: string | number | boolean) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = formData.options?.filter((_, i) => i !== index) || [];
    // Reorder options
    newOptions.forEach((opt, i) => {
      opt.order = i + 1;
    });
    setFormData({ ...formData, options: newOptions });
    // Validate after removal
    setTimeout(() => validateForm(), 0);
  };

  // Handle correct answers for text-based questions
  const handleAddCorrectAnswer = () => {
    const newAnswer: Partial<CorrectAnswer> = {};
    if (formData.questionType === "NUMERIC" || formData.questionType === "RATING_SCALE") {
      newAnswer.answerNumber = 0;
    } else if (formData.questionType === "DATE") {
      newAnswer.answerDate = "";
    } else {
      newAnswer.answerText = "";
    }
    
    setFormData({
      ...formData,
      correctAnswers: [
        ...(formData.correctAnswers || []),
        newAnswer,
      ],
    });
    // Clear correctAnswers error when adding new answer
    if (errors.correctAnswers) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.correctAnswers;
        return newErrors;
      });
    }
  };

  const handleUpdateCorrectAnswer = (index: number, value: string | number) => {
    const newAnswers = [...(formData.correctAnswers || [])];
    if (formData.questionType === "NUMERIC" || formData.questionType === "RATING_SCALE") {
      newAnswers[index] = { ...newAnswers[index], answerNumber: typeof value === "number" ? value : parseFloat(value as string) || 0 };
    } else if (formData.questionType === "DATE") {
      newAnswers[index] = { ...newAnswers[index], answerDate: value as string };
    } else {
      newAnswers[index] = { ...newAnswers[index], answerText: value as string };
    }
    setFormData({ ...formData, correctAnswers: newAnswers });
  };

  const handleRemoveCorrectAnswer = (index: number) => {
    setFormData({
      ...formData,
      correctAnswers: formData.correctAnswers?.filter((_, i) => i !== index) || [],
    });
    // Validate after removal
    setTimeout(() => validateForm(), 0);
  };

  // Validate form without updating state (for button disabled check)
  const isFormValid = (): boolean => {
    // Required fields
    if (!formData.questionText.trim()) return false;
    
    if (!formData.points || formData.points < 0.1) return false;

    // Validate hint text if showHint is enabled
    if (formData.showHint && !hintText.trim()) return false;

    // Validate options for multiple choice questions
    if (
      formData.questionType === "MULTIPLE_CHOICE_SINGLE" ||
      formData.questionType === "MULTIPLE_CHOICE_MULTIPLE" ||
      formData.questionType === "TRUE_FALSE"
    ) {
      if (!formData.options || formData.options.length < 2) return false;
      
      // Check all options have text
      const hasEmptyOptions = formData.options.some((opt) => !opt.optionText.trim());
      if (hasEmptyOptions) return false;
      
      // Check at least one option is correct
      const hasCorrect = formData.options.some((opt) => opt.isCorrect);
      if (!hasCorrect) return false;
      
      // For single choice, ensure only one is correct
      if (formData.questionType === "MULTIPLE_CHOICE_SINGLE") {
        const correctCount = formData.options.filter((opt) => opt.isCorrect).length;
        if (correctCount !== 1) return false;
      }
    }

    // Validate correct answers for text-based questions
    if (formData.questionType === "FILL_IN_BLANK") {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) return false;
      const hasEmptyAnswers = formData.correctAnswers.some(
        (ans) => !ans.answerText?.trim()
      );
      if (hasEmptyAnswers) return false;
    }

    // Validate correct answers for numeric questions
    if (formData.questionType === "NUMERIC") {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) return false;
      const hasInvalidAnswers = formData.correctAnswers.some(
        (ans) => ans.answerNumber === undefined || ans.answerNumber === null
      );
      if (hasInvalidAnswers) return false;
    }

    // Validate correct answers for date questions
    if (formData.questionType === "DATE") {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) return false;
      const hasInvalidAnswers = formData.correctAnswers.some(
        (ans) => !ans.answerDate || ans.answerDate.trim() === ""
      );
      if (hasInvalidAnswers) return false;
    }

    // Validate correct answers for rating scale questions
    if (formData.questionType === "RATING_SCALE") {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) return false;
      const hasInvalidAnswers = formData.correctAnswers.some(
        (ans) => ans.answerNumber === undefined || ans.answerNumber === null
      );
      if (hasInvalidAnswers) return false;
    }

    return true;
  };

  // Validate form and update errors state (for displaying errors)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Question text validation
    if (!formData.questionText.trim()) {
      newErrors.questionText = "Question text is required";
    }

    // Points validation
    if (!formData.points || formData.points < 0.1) {
      newErrors.points = "Points must be at least 0.1";
    }

    // Hint text validation
    if (formData.showHint && !hintText.trim()) {
      newErrors.hintText = "Hint text is required when 'Show Hint' is enabled";
    }

    // Validate options for multiple choice questions
    if (
      formData.questionType === "MULTIPLE_CHOICE_SINGLE" ||
      formData.questionType === "MULTIPLE_CHOICE_MULTIPLE" ||
      formData.questionType === "TRUE_FALSE"
    ) {
      if (!formData.options || formData.options.length < 2) {
        newErrors.options = "At least 2 options are required";
      } else {
        // Check all options have text
        const emptyOptions = formData.options.some((opt) => !opt.optionText.trim());
        if (emptyOptions) {
          newErrors.options = "All options must have text";
        } else {
          // Check at least one option is correct
          const correctOptions = formData.options.filter((opt) => opt.isCorrect);
          if (correctOptions.length === 0) {
            newErrors.options = "At least one option must be marked as correct";
          } else if (formData.questionType === "MULTIPLE_CHOICE_SINGLE" && correctOptions.length > 1) {
            newErrors.options = "Only one option can be marked as correct for single choice questions";
          }
        }
      }
    }

    // Validate correct answers for text-based questions
    if (
      formData.questionType === "FILL_IN_BLANK"
    ) {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
        newErrors.correctAnswers = "At least one correct answer is required";
      } else {
        const emptyAnswers = formData.correctAnswers.some(
          (ans) => !ans.answerText?.trim()
        );
        if (emptyAnswers) {
          newErrors.correctAnswers = "All correct answers must have text";
        }
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
      const submitData: CreateQuestionRequest | UpdateQuestionRequest = {
        ...formData,
        hintText: formData.showHint ? hintText : undefined,
        explanation: explanation || undefined,
        // Don't include imageUrl/imageS3Key - image is sent as file if imageFile exists
      };

      if (isEditing && question) {
        await updateQuestion.mutateAsync({
          cbtId: cbt.id,
          questionId: question.id,
          data: submitData as UpdateQuestionRequest,
          imageFile: imageFile || undefined, // Pass image file if selected
        });
      } else {
        await createQuestion.mutateAsync({
          cbtId: cbt.id,
          data: submitData as CreateQuestionRequest,
          imageFile: imageFile || undefined, // Pass image file if selected
        });
      }

      handleClose();
      onSuccess();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    setFormData({
      questionText: "",
      questionType: "MULTIPLE_CHOICE_SINGLE",
      points: 1,
      isRequired: true,
      difficultyLevel: "MEDIUM",
      showHint: false,
      allowMultipleAttempts: false,
      options: [],
      correctAnswers: [],
    });
    setHintText("");
    setExplanation("");
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  const requiresOptions =
    formData.questionType === "MULTIPLE_CHOICE_SINGLE" ||
    formData.questionType === "MULTIPLE_CHOICE_MULTIPLE" ||
    formData.questionType === "TRUE_FALSE";

  const requiresTextAnswers =
    formData.questionType === "FILL_IN_BLANK";

  const requiresNumericAnswers =
    formData.questionType === "NUMERIC";

  const requiresDateAnswers =
    formData.questionType === "DATE";

  const requiresRatingScaleAnswers =
    formData.questionType === "RATING_SCALE";

  const isSubmitting = createQuestion.isPending || updateQuestion.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Question" : "Create New Question"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Type */}
          <div className="space-y-2">
            <Label htmlFor="questionType">
              Question Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.questionType}
              onValueChange={(value: QuestionType) => {
                setFormData({
                  ...formData,
                  questionType: value,
                  options: value === "TRUE_FALSE" 
                    ? [
                        { optionText: "True", order: 1, isCorrect: false },
                        { optionText: "False", order: 2, isCorrect: true },
                      ]
                    : [],
                  correctAnswers: [],
                });
                // Clear errors when question type changes
                setErrors({});
              }}
              disabled={isSubmitting || isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MULTIPLE_CHOICE_SINGLE">
                  Multiple Choice (Single)
                </SelectItem>
                <SelectItem value="MULTIPLE_CHOICE_MULTIPLE">
                  Multiple Choice (Multiple)
                </SelectItem>
                <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                {/* Temporarily disabled question types */}
                {/* <SelectItem value="FILL_IN_BLANK">Fill in the Blank</SelectItem> */}
                {/* <SelectItem value="NUMERIC">Numeric</SelectItem> */}
                {/* <SelectItem value="DATE">Date</SelectItem> */}
                {/* <SelectItem value="RATING_SCALE">Rating Scale</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">
              Question Text <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="questionText"
              value={formData.questionText}
              onChange={(e) => {
                setFormData({ ...formData, questionText: e.target.value });
                // Clear error when user starts typing
                if (errors.questionText) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.questionText;
                    return newErrors;
                  });
                }
              }}
              onBlur={() => validateForm()}
              placeholder="Enter your question here..."
              rows={3}
              required
              disabled={isSubmitting}
            />
            {errors.questionText && (
              <p className="text-xs text-red-500">{errors.questionText}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Question Image (Optional)</Label>
            {imagePreview ? (
              <div className="relative">
                <div className="relative w-full h-48 border border-brand-border rounded overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Question preview"
                    fill
                    className="object-contain"
                    unoptimized={imagePreview.includes("s3.amazonaws.com")}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className="absolute top-2 right-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-brand-border rounded-lg p-6">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-brand-light-accent-1 mb-2" />
                  <span className="text-sm text-brand-light-accent-1 mb-2">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-brand-light-accent-1">
                    PNG, JPG, GIF, WEBP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            )}
            {false && (
              <div className="flex items-center gap-2 text-sm text-brand-light-accent-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading image...
              </div>
            )}
          </div>

          {/* Options for Multiple Choice */}
          {requiresOptions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Options <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  disabled={isSubmitting}
                >
                  Add Option
                </Button>
              </div>
              {errors.options && (
                <p className="text-xs text-red-500">{errors.options}</p>
              )}
              <div className="space-y-2">
                {formData.options?.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 border border-brand-border rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        // For single choice, uncheck other options if this one is checked
                        if (formData.questionType === "MULTIPLE_CHOICE_SINGLE" && newValue) {
                          const newOptions = formData.options!.map((opt, i) => ({
                            ...opt,
                            isCorrect: i === index,
                          }));
                          setFormData({ ...formData, options: newOptions });
                        } else {
                          handleUpdateOption(index, "isCorrect", newValue);
                        }
                        // Clear error when user makes changes
                        if (errors.options) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.options;
                            return newErrors;
                          });
                        }
                      }}
                      disabled={isSubmitting}
                      className="w-4 h-4"
                    />
                    <Input
                      value={option.optionText}
                      onChange={(e) => {
                        handleUpdateOption(index, "optionText", e.target.value);
                        // Clear error when user starts typing
                        if (errors.options) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.options;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={() => validateForm()}
                      placeholder={`Option ${option.order}`}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      disabled={isSubmitting || formData.options!.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct Answers for Text Questions */}
          {requiresTextAnswers && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Correct Answers <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCorrectAnswer}
                  disabled={isSubmitting}
                >
                  Add Answer
                </Button>
              </div>
              {errors.correctAnswers && (
                <p className="text-xs text-red-500">{errors.correctAnswers}</p>
              )}
              <div className="space-y-2">
                {formData.correctAnswers?.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={answer.answerText || ""}
                      onChange={(e) => {
                        handleUpdateCorrectAnswer(index, e.target.value);
                        // Clear error when user starts typing
                        if (errors.correctAnswers) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.correctAnswers;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={() => validateForm()}
                      placeholder="Enter correct answer"
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCorrectAnswer(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct Answers for Numeric Questions */}
          {requiresNumericAnswers && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Correct Numeric Answers <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCorrectAnswer}
                  disabled={isSubmitting}
                >
                  Add Answer
                </Button>
              </div>
              {errors.correctAnswers && (
                <p className="text-xs text-red-500">{errors.correctAnswers}</p>
              )}
              <div className="space-y-2">
                {formData.correctAnswers?.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="number"
                      step="any"
                      value={answer.answerNumber ?? ""}
                      onChange={(e) => {
                        handleUpdateCorrectAnswer(index, parseFloat(e.target.value) || 0);
                        if (errors.correctAnswers) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.correctAnswers;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={() => validateForm()}
                      placeholder="Enter number"
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCorrectAnswer(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {(formData.minValue !== undefined || formData.maxValue !== undefined) && (
                <p className="text-xs text-brand-light-accent-1">
                  Range: {formData.minValue !== undefined ? formData.minValue : "No min"} - {formData.maxValue !== undefined ? formData.maxValue : "No max"}
                </p>
              )}
            </div>
          )}

          {/* Correct Answers for Date Questions */}
          {requiresDateAnswers && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Correct Date Answers <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCorrectAnswer}
                  disabled={isSubmitting}
                >
                  Add Answer
                </Button>
              </div>
              {errors.correctAnswers && (
                <p className="text-xs text-red-500">{errors.correctAnswers}</p>
              )}
              <div className="space-y-2">
                {formData.correctAnswers?.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="date"
                      value={answer.answerDate ? answer.answerDate.split('T')[0] : ""}
                      onChange={(e) => {
                        const dateValue = e.target.value ? `${e.target.value}T00:00:00Z` : "";
                        handleUpdateCorrectAnswer(index, dateValue);
                        if (errors.correctAnswers) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.correctAnswers;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={() => validateForm()}
                      placeholder="Select date"
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCorrectAnswer(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct Answers for Rating Scale Questions */}
          {requiresRatingScaleAnswers && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Correct Rating Answers <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCorrectAnswer}
                  disabled={isSubmitting}
                >
                  Add Answer
                </Button>
              </div>
              {errors.correctAnswers && (
                <p className="text-xs text-red-500">{errors.correctAnswers}</p>
              )}
              <div className="space-y-2">
                {formData.correctAnswers?.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={answer.answerNumber ?? ""}
                      onChange={(e) => {
                        handleUpdateCorrectAnswer(index, parseInt(e.target.value) || 0);
                        if (errors.correctAnswers) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.correctAnswers;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={() => validateForm()}
                      placeholder="Rating value"
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCorrectAnswer(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">
                Points <span className="text-red-500">*</span>
              </Label>
              <Input
                id="points"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.points || ""}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  setFormData({
                    ...formData,
                    points: value,
                  });
                  // Clear error when user starts typing
                  if (errors.points) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.points;
                      return newErrors;
                    });
                  }
                }}
                onBlur={() => validateForm()}
                required
                disabled={isSubmitting}
              />
              {errors.points && (
                <p className="text-xs text-red-500">{errors.points}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">Difficulty Level</Label>
              <Select
                value={formData.difficultyLevel}
                onValueChange={(value: DifficultyLevel) =>
                  setFormData({ ...formData, difficultyLevel: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="showHint">Show Hint</Label>
              <Switch
                id="showHint"
                checked={formData.showHint}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, showHint: checked })
                }
                disabled={isSubmitting}
              />
            </div>
            {formData.showHint && (
              <>
                <Textarea
                  value={hintText}
                  onChange={(e) => {
                    setHintText(e.target.value);
                    // Clear error when user starts typing
                    if (errors.hintText) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.hintText;
                        return newErrors;
                      });
                    }
                  }}
                  onBlur={() => validateForm()}
                  placeholder="Enter hint text..."
                  rows={2}
                  disabled={isSubmitting}
                />
                {errors.hintText && (
                  <p className="text-xs text-red-500">{errors.hintText}</p>
                )}
              </>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explanation for the correct answer..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Switches */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isRequired" className="cursor-pointer">
                Required
              </Label>
              <Switch
                id="isRequired"
                checked={formData.isRequired}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isRequired: checked })
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowMultipleAttempts" className="cursor-pointer">
                Allow Multiple Attempts
              </Label>
              <Switch
                id="allowMultipleAttempts"
                checked={formData.allowMultipleAttempts}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allowMultipleAttempts: checked })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Min/Max Value for NUMERIC questions */}
          {formData.questionType === "NUMERIC" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Numeric Constraints</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minValue" className="text-sm">Min Value</Label>
                  <Input
                    id="minValue"
                    type="number"
                    step="any"
                    value={formData.minValue ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
                      setFormData({ ...formData, minValue: value });
                    }}
                    placeholder="No minimum"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxValue" className="text-sm">Max Value</Label>
                  <Input
                    id="maxValue"
                    type="number"
                    step="any"
                    value={formData.maxValue ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
                      setFormData({ ...formData, maxValue: value });
                    }}
                    placeholder="No maximum"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Min/Max Length for FILL_IN_BLANK questions */}
          {formData.questionType === "FILL_IN_BLANK" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text Length Constraints</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minLength" className="text-sm">Min Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    min="0"
                    value={formData.minLength ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                      setFormData({ ...formData, minLength: value });
                    }}
                    placeholder="No minimum"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLength" className="text-sm">Max Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    min="1"
                    value={formData.maxLength ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                      setFormData({ ...formData, maxLength: value });
                    }}
                    placeholder="No maximum"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isFormValid()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Question"
              ) : (
                "Create Question"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

