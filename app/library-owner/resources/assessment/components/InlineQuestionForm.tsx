"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestionImage,
} from "@/hooks/assessment/use-cbt-questions";
import { Loader2, X, Check, Plus as PlusIcon, Image as ImageIcon, Upload, Trash2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  CBT,
  Question,
  QuestionType,
  DifficultyLevel,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionOption,
} from "@/hooks/assessment/use-cbt-types";

interface InlineQuestionFormProps {
  cbt: CBT;
  question?: Question | null;
  isEditing?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  questionNumber?: number;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  onRequestCleanup?: () => Promise<void>;
}

export const InlineQuestionForm = ({
  cbt,
  question,
  isEditing = false,
  onSuccess,
  onCancel,
  questionNumber,
  onUnsavedChangesChange,
  onRequestCleanup,
}: InlineQuestionFormProps) => {
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteImage = useDeleteQuestionImage();

  // Form state
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    questionText: "",
    questionType: "MULTIPLE_CHOICE_SINGLE",
    points: 1,
    isRequired: true,
    difficultyLevel: "EASY",
    showHint: false,
    allowMultipleAttempts: false,
    options: [],
    correctAnswers: [],
  });

  // Clamp points to 1-10 range
  const clampPoints = (value: number): number => {
    return Math.max(1, Math.min(10, Math.round(value)));
  };

  const [hintText, setHintText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null); // For editing existing questions
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const questionTextRef = useRef<HTMLTextAreaElement>(null);

  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (isEditing) return false; // Don't warn when editing existing questions
    return !!(
      imageFile ||
      formData.questionText.trim() ||
      (formData.options && formData.options.some(opt => opt.optionText.trim())) ||
      (formData.correctAnswers && formData.correctAnswers.some(ans => ans.answerText?.trim())) ||
      explanation.trim() ||
      hintText.trim()
    );
  }, [imageFile, formData, explanation, hintText, isEditing]);

  // Notify parent about unsaved changes
  useEffect(() => {
    if (onUnsavedChangesChange) {
      onUnsavedChangesChange(hasUnsavedChanges());
    }
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  // Handle page unload - warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Cleanup function to handle cancel
  const handleCancelWithCleanup = async () => {
    if (!hasUnsavedChanges()) {
      onCancel();
      return;
    }

    // Show confirmation dialog
    setShowCancelConfirm(true);
  };

  // Expose cancel handler to parent for dialog close interception
  useEffect(() => {
    if (onRequestCleanup) {
      // Store the cancel handler so parent can call it
      (window as any).__inlineFormCancelHandler = handleCancelWithCleanup;
    }
    return () => {
      delete (window as any).__inlineFormCancelHandler;
    };
  }, [onRequestCleanup, hasUnsavedChanges]);

  const confirmCancel = async () => {
    // Reset form state
    setFormData({
      questionText: "",
      questionType: "MULTIPLE_CHOICE_SINGLE",
      points: 1,
      isRequired: true,
      difficultyLevel: "EASY",
      showHint: false,
      allowMultipleAttempts: false,
      options: [],
      correctAnswers: [],
    });
    setHintText("");
    setExplanation("");
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setShowExplanation(false);
    setErrors({});
    setShowCancelConfirm(false);
    
    // Notify parent that cleanup is complete
    if (onUnsavedChangesChange) {
      onUnsavedChangesChange(false);
    }
    
    onCancel();
  };


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
      setExistingImageUrl(question.imageUrl || null);
      setShowExplanation(!!question.explanation);
    } else {
      // Reset form for new question
      setFormData({
        questionText: "",
        questionType: "MULTIPLE_CHOICE_SINGLE",
        points: 1,
        isRequired: true,
        difficultyLevel: "EASY",
        showHint: false,
        allowMultipleAttempts: false,
        options: [],
        correctAnswers: [],
      });
      setHintText("");
      setExplanation("");
      setImageFile(null);
      setImagePreview(null);
      setExistingImageUrl(null);
      setShowExplanation(false);
    }
    setErrors({});
    
    // Auto-focus question text input after a short delay
    setTimeout(() => {
      questionTextRef.current?.focus();
    }, 100);
  }, [isEditing, question]);

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
      } catch (error) {
        // Error handled by hook
      }
    }
    // Clear local image state
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  // Auto-add default options for multiple choice
  useEffect(() => {
    if (formData.questionType === "MULTIPLE_CHOICE_SINGLE" && formData.options?.length === 0) {
      setFormData({
        ...formData,
        options: [
          { optionText: "", order: 1, isCorrect: false },
          { optionText: "", order: 2, isCorrect: false },
        ],
      });
    } else if (formData.questionType === "TRUE_FALSE" && formData.options?.length === 0) {
      setFormData({
        ...formData,
        options: [
          { optionText: "True", order: 1, isCorrect: false },
          { optionText: "False", order: 2, isCorrect: true },
        ],
      });
    }
  }, [formData.questionType]);

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
    if (errors.options) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.options;
        return newErrors;
      });
    }
  };

  const handleUpdateOption = (index: number, field: keyof QuestionOption, value: any) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = formData.options?.filter((_, i) => i !== index) || [];
    newOptions.forEach((opt, i) => {
      opt.order = i + 1;
    });
    setFormData({ ...formData, options: newOptions });
  };

  // Handle correct answers for text-based questions
  const handleAddCorrectAnswer = () => {
    const newAnswer: any = {};
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
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.questionText.trim()) {
      newErrors.questionText = "Question text is required";
    }

    if (!formData.points || formData.points < 1 || formData.points > 10) {
      newErrors.points = "Points must be between 1 and 10";
    }

    if (formData.showHint && !hintText.trim()) {
      newErrors.hintText = "Hint text is required";
    }

    const requiresOptions =
      formData.questionType === "MULTIPLE_CHOICE_SINGLE" ||
      formData.questionType === "MULTIPLE_CHOICE_MULTIPLE" ||
      formData.questionType === "TRUE_FALSE";

    if (requiresOptions) {
      if (!formData.options || formData.options.length < 2) {
        newErrors.options = "At least 2 options are required";
      } else {
        const emptyOptions = formData.options.some((opt) => !opt.optionText.trim());
        if (emptyOptions) {
          newErrors.options = "All options must have text";
        } else {
          const correctOptions = formData.options.filter((opt) => opt.isCorrect);
          if (correctOptions.length === 0) {
            newErrors.options = "At least one option must be correct";
          } else if (formData.questionType === "MULTIPLE_CHOICE_SINGLE" && correctOptions.length > 1) {
            newErrors.options = "Only one option can be correct";
          }
        }
      }
    }

    const requiresTextAnswers =
      formData.questionType === "FILL_IN_BLANK";

    if (requiresTextAnswers) {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
        newErrors.correctAnswers = "At least one correct answer is required";
      } else {
        const emptyAnswers = formData.correctAnswers.some(
          (ans) => !ans.answerText?.trim()
        );
        if (emptyAnswers) {
          newErrors.correctAnswers = "All answers must have text";
        }
      }
    }

    const requiresNumericAnswers =
      formData.questionType === "NUMERIC";

    if (requiresNumericAnswers) {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
        newErrors.correctAnswers = "At least one correct numeric answer is required";
      } else {
        const invalidAnswers = formData.correctAnswers.some(
          (ans) => ans.answerNumber === undefined || ans.answerNumber === null
        );
        if (invalidAnswers) {
          newErrors.correctAnswers = "All numeric answers must have a valid number";
        }
      }
    }

    const requiresDateAnswers =
      formData.questionType === "DATE";

    if (requiresDateAnswers) {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
        newErrors.correctAnswers = "At least one correct date answer is required";
      } else {
        const invalidAnswers = formData.correctAnswers.some(
          (ans) => !ans.answerDate || ans.answerDate.trim() === ""
        );
        if (invalidAnswers) {
          newErrors.correctAnswers = "All date answers must have a valid date";
        }
      }
    }

    const requiresRatingScaleAnswers =
      formData.questionType === "RATING_SCALE";

    if (requiresRatingScaleAnswers) {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
        newErrors.correctAnswers = "At least one correct rating answer is required";
      } else {
        const invalidAnswers = formData.correctAnswers.some(
          (ans) => ans.answerNumber === undefined || ans.answerNumber === null
        );
        if (invalidAnswers) {
          newErrors.correctAnswers = "All rating answers must have a valid number";
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

      onSuccess();
    } catch (error: any) {
      // Error handled by hook
    }
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
    <div className="bg-white border border-brand-border rounded-lg p-3 shadow-sm">
      {/* New Question Label */}
      {!isEditing && questionNumber && (
        <div className="text-base font-bold text-brand-primary mb-3 pb-2 border-b border-brand-primary">
          New Question ({questionNumber})
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Single Horizontal Row: Question Type, Points, Difficulty, Explanation, More Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Question Type */}
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
              setErrors({});
            }}
            disabled={isSubmitting || isEditing}
          >
            <SelectTrigger className="h-8 text-xs w-auto min-w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MULTIPLE_CHOICE_SINGLE">Multiple Choice</SelectItem>
              <SelectItem value="MULTIPLE_CHOICE_MULTIPLE">Multiple Select</SelectItem>
              <SelectItem value="TRUE_FALSE">True/False</SelectItem>
              {/* Temporarily disabled question types */}
              {/* <SelectItem value="FILL_IN_BLANK">Fill in the Blank</SelectItem> */}
              {/* <SelectItem value="NUMERIC">Numeric</SelectItem> */}
              {/* <SelectItem value="DATE">Date</SelectItem> */}
              {/* <SelectItem value="RATING_SCALE">Rating Scale</SelectItem> */}
            </SelectContent>
          </Select>
          
          {/* Compact Points Input with +/- buttons */}
          <div className="flex items-center gap-1 border border-brand-border rounded h-8 px-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const newPoints = clampPoints((formData.points || 1) - 1);
                setFormData({ ...formData, points: newPoints });
                if (errors.points) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.points;
                    return newErrors;
                  });
                }
              }}
              disabled={isSubmitting || (formData.points || 1) <= 1}
              className="h-6 w-6 p-0 text-xs"
            >
              −
            </Button>
            <input
              type="number"
              min="1"
              max="10"
              step="1"
              value={formData.points || ""}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                if (value !== undefined) {
                  const clampedValue = clampPoints(value);
                  setFormData({ ...formData, points: clampedValue });
                } else {
                  setFormData({ ...formData, points: undefined });
                }
                if (errors.points) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.points;
                    return newErrors;
                  });
                }
              }}
              onBlur={() => {
                const currentPoints = formData.points || 1;
                const clampedPoints = clampPoints(currentPoints);
                setFormData({ ...formData, points: clampedPoints });
                validateForm();
              }}
              disabled={isSubmitting}
              className="w-12 h-6 text-center text-xs border-0 focus:outline-none focus:ring-0 p-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const newPoints = clampPoints((formData.points || 1) + 1);
                setFormData({ ...formData, points: newPoints });
                if (errors.points) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.points;
                    return newErrors;
                  });
                }
              }}
              disabled={isSubmitting || (formData.points || 1) >= 10}
              className="h-6 w-6 p-0 text-xs"
            >
              +
            </Button>
          </div>
          {errors.points && (
            <p className="text-[10px] text-red-500 w-full">{errors.points}</p>
          )}

          {/* Difficulty Dropdown - Inline like question type */}
          <Select
            value={formData.difficultyLevel}
            onValueChange={(value: DifficultyLevel) =>
              setFormData({ ...formData, difficultyLevel: value })
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="h-8 text-xs w-auto min-w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
            </SelectContent>
          </Select>

          {/* Explanation - Switch that shows input when on */}
          <div className="flex items-center gap-1 h-8">
            <Switch
              id="showExplanation"
              checked={showExplanation}
              onCheckedChange={(checked) => {
                setShowExplanation(checked);
                if (!checked) {
                  setExplanation("");
                }
              }}
              disabled={isSubmitting}
              className="scale-75"
            />
            <Label htmlFor="showExplanation" className="text-xs cursor-pointer whitespace-nowrap">
              Explanation
            </Label>
          </div>

          {/* More Options - Button styled like dropdown */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 text-xs w-auto min-w-fit"
          >
            More options
            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Expanded Content - Only for More Options and Explanation textarea */}
        {(showExplanation || isExpanded) && (
          <div className="space-y-2 pt-2 border-t">
            {/* Explanation Textarea - Full width when switch is on */}
            {showExplanation && (
              <div>
                <Textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explanation (optional)..."
                  rows={2}
                  disabled={isSubmitting}
                  className="text-xs"
                />
              </div>
            )}

            {/* More Options Content */}
            {isExpanded && (
              <div className="space-y-2 pt-2 border-t">
                <div className="space-y-1.5">
                  {formData.showHint && (
                    <Textarea
                      value={hintText}
                      onChange={(e) => {
                        setHintText(e.target.value);
                        if (errors.hintText) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.hintText;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={() => validateForm()}
                      placeholder="Hint text..."
                      rows={1}
                      disabled={isSubmitting}
                      className="text-xs"
                    />
                  )}
                  {errors.hintText && (
                    <p className="text-xs text-red-500">{errors.hintText}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="showHint"
                      checked={formData.showHint}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, showHint: checked })
                      }
                      disabled={isSubmitting}
                      className="scale-75"
                    />
                    <Label htmlFor="showHint" className="text-xs cursor-pointer">
                      Show hint
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isRequired"
                      checked={formData.isRequired}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isRequired: checked })
                      }
                      disabled={isSubmitting}
                      className="scale-75"
                    />
                    <Label htmlFor="isRequired" className="text-xs cursor-pointer">
                      Required
                    </Label>
                  </div>
                </div>

                {/* Min/Max Value for NUMERIC questions */}
                {formData.questionType === "NUMERIC" && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs font-medium">Numeric Constraints</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="minValue" className="text-xs">Min Value</Label>
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
                          className="text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="maxValue" className="text-xs">Max Value</Label>
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
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Min/Max Length for FILL_IN_BLANK questions */}
                {formData.questionType === "FILL_IN_BLANK" && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs font-medium">Text Length Constraints</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="minLength" className="text-xs">Min Length</Label>
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
                          className="text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="maxLength" className="text-xs">Max Length</Label>
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
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Question Text - Compact */}
        <div className="relative">
          <Textarea
            ref={questionTextRef}
            value={formData.questionText}
            onChange={(e) => {
              setFormData({ ...formData, questionText: e.target.value });
              if (errors.questionText) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.questionText;
                  return newErrors;
                });
              }
            }}
            onBlur={() => validateForm()}
            placeholder="Question"
            rows={2}
            className="text-sm pr-10"
            disabled={isSubmitting}
          />
          {/* Image Upload Button */}
          <label className="absolute top-2 right-2 cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <ImageIcon className="h-4 w-4 text-brand-light-accent-1 hover:text-brand-primary transition-colors" />
          </label>
        </div>
        {errors.questionText && (
          <p className="text-xs text-red-500">{errors.questionText}</p>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative">
            <div className="relative w-24 h-24 border border-brand-border rounded overflow-hidden">
              <Image
                src={imagePreview}
                alt="Question preview"
                fill
                className="object-cover"
                unoptimized={imagePreview.includes("s3.amazonaws.com")}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isSubmitting}
              className="absolute -top-2 -right-2 h-5 w-5 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Compact Options - Always visible for multiple choice */}
        {requiresOptions && (
          <div className="space-y-1.5">
            {formData.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    const newValue = !option.isCorrect;
                    // For single choice and true/false, only one option can be correct
                    if ((formData.questionType === "MULTIPLE_CHOICE_SINGLE" || formData.questionType === "TRUE_FALSE") && newValue) {
                      const newOptions = formData.options!.map((opt, i) => ({
                        ...opt,
                        isCorrect: i === index,
                      }));
                      setFormData({ ...formData, options: newOptions });
                    } else {
                      handleUpdateOption(index, "isCorrect", newValue);
                    }
                    if (errors.options) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.options;
                        return newErrors;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                  className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    option.isCorrect
                      ? "bg-brand-primary border-brand-primary"
                      : "border-gray-300 hover:border-brand-primary"
                  }`}
                >
                  {option.isCorrect && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <Input
                  value={option.optionText}
                  onChange={(e) => {
                    handleUpdateOption(index, "optionText", e.target.value);
                    if (errors.options) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.options;
                        return newErrors;
                      });
                    }
                  }}
                  onBlur={() => validateForm()}
                  placeholder={`Option ${index + 1}`}
                  disabled={isSubmitting}
                  className="flex-1 text-sm h-8"
                />
                {formData.options!.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    disabled={isSubmitting}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {errors.options && (
              <p className="text-xs text-red-500">{errors.options}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              disabled={isSubmitting}
              className="h-7 text-xs w-full"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add option
            </Button>
          </div>
        )}

        {/* Correct Answers for Text Questions */}
        {requiresTextAnswers && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Correct Answers</Label>
            {formData.correctAnswers?.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={answer.answerText || ""}
                  onChange={(e) => handleUpdateCorrectAnswer(index, e.target.value)}
                  placeholder="Correct answer"
                  disabled={isSubmitting}
                  className="flex-1 text-sm h-8"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCorrectAnswer(index)}
                  disabled={isSubmitting}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {errors.correctAnswers && (
              <p className="text-xs text-red-500">{errors.correctAnswers}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCorrectAnswer}
              disabled={isSubmitting}
              className="h-7 text-xs w-full"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add answer
            </Button>
          </div>
        )}

        {requiresNumericAnswers && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Correct Numeric Answers</Label>
            {formData.correctAnswers?.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="number"
                  step="any"
                  value={answer.answerNumber ?? ""}
                  onChange={(e) => handleUpdateCorrectAnswer(index, parseFloat(e.target.value) || 0)}
                  placeholder="Enter number"
                  disabled={isSubmitting}
                  className="flex-1 text-sm h-8"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCorrectAnswer(index)}
                  disabled={isSubmitting}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {errors.correctAnswers && (
              <p className="text-xs text-red-500">{errors.correctAnswers}</p>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCorrectAnswer}
                disabled={isSubmitting}
                className="h-7 text-xs flex-1"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add answer
              </Button>
            </div>
            {(formData.minValue !== undefined || formData.maxValue !== undefined) && (
              <div className="text-xs text-brand-light-accent-1 pt-1">
                Range: {formData.minValue !== undefined ? formData.minValue : "No min"} - {formData.maxValue !== undefined ? formData.maxValue : "No max"}
              </div>
            )}
          </div>
        )}

        {requiresDateAnswers && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Correct Date Answers</Label>
            {formData.correctAnswers?.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="date"
                  value={answer.answerDate ? answer.answerDate.split('T')[0] : ""}
                  onChange={(e) => {
                    const dateValue = e.target.value ? `${e.target.value}T00:00:00Z` : "";
                    handleUpdateCorrectAnswer(index, dateValue);
                  }}
                  placeholder="Select date"
                  disabled={isSubmitting}
                  className="flex-1 text-sm h-8"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCorrectAnswer(index)}
                  disabled={isSubmitting}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {errors.correctAnswers && (
              <p className="text-xs text-red-500">{errors.correctAnswers}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCorrectAnswer}
              disabled={isSubmitting}
              className="h-7 text-xs w-full"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add answer
            </Button>
          </div>
        )}

        {requiresRatingScaleAnswers && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Correct Rating Answers</Label>
            {formData.correctAnswers?.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={answer.answerNumber ?? ""}
                  onChange={(e) => handleUpdateCorrectAnswer(index, parseInt(e.target.value) || 0)}
                  placeholder="Rating value"
                  disabled={isSubmitting}
                  className="flex-1 text-sm h-8"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCorrectAnswer(index)}
                  disabled={isSubmitting}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {errors.correctAnswers && (
              <p className="text-xs text-red-500">{errors.correctAnswers}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCorrectAnswer}
              disabled={isSubmitting}
              className="h-7 text-xs w-full"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add answer
            </Button>
          </div>
        )}


        {/* Action Buttons - Bottom */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancelWithCleanup}
            disabled={isSubmitting}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !formData.questionText.trim()}
            className="h-8 text-xs px-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-3 w-3 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Question?</AlertDialogTitle>
            <AlertDialogDescription>
              {imageFile ? (
                <>
                  You have unsaved changes including a selected image. If you cancel now:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All your progress for this question will be lost</li>
                    <li>The selected image will be discarded (images are only uploaded when you save the question)</li>
                  </ul>
                  Are you sure you want to discard this question?
                </>
              ) : (
                <>
                  You have unsaved changes. All your progress for this question will be lost.
                  Are you sure you want to discard this question?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelConfirm(false)}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Discard Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

