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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import {
  useCreateExamBodyQuestion,
  useDeleteExamBodyQuestionImage,
  useUpdateExamBodyQuestion,
} from "@/hooks/exam-body/use-exam-body-questions";
import type {
  ExamBodyQuestionListItem,
  ExamBodyQuestionType,
} from "@/hooks/exam-body/types";

type Mode = "create" | "edit";

interface OptionInput {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

interface QuestionFormDialogProps {
  open: boolean;
  mode: Mode;
  examBodyId: string;
  assessmentId: string;
  question?: ExamBodyQuestionListItem | null;
  onOpenChange: (open: boolean) => void;
}

const QUESTION_TYPES: { label: string; value: ExamBodyQuestionType }[] = [
  { label: "Multiple Choice (Single)", value: "MULTIPLE_CHOICE_SINGLE" },
  { label: "Multiple Choice (Multiple)", value: "MULTIPLE_CHOICE_MULTIPLE" },
  { label: "True / False", value: "TRUE_FALSE" },
  { label: "Short Answer", value: "SHORT_ANSWER" },
  { label: "Fill in the Blank", value: "FILL_IN_BLANK" },
  { label: "Long Answer", value: "LONG_ANSWER" },
  { label: "Numeric", value: "NUMERIC" },
  { label: "Date", value: "DATE" },
];

const TYPES_WITH_OPTIONS: ExamBodyQuestionType[] = [
  "MULTIPLE_CHOICE_SINGLE",
  "MULTIPLE_CHOICE_MULTIPLE",
  "TRUE_FALSE",
];

const createOption = (index: number): OptionInput => ({
  id: `option-${index}-${Date.now()}`,
  optionText: "",
  isCorrect: false,
});

export const QuestionFormDialog = ({
  open,
  mode,
  examBodyId,
  assessmentId,
  question,
  onOpenChange,
}: QuestionFormDialogProps) => {
  const createMutation = useCreateExamBodyQuestion(examBodyId, assessmentId);
  const updateMutation = useUpdateExamBodyQuestion(examBodyId, assessmentId);
  const deleteImageMutation = useDeleteExamBodyQuestionImage(
    examBodyId,
    assessmentId
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] =
    useState<ExamBodyQuestionType>("MULTIPLE_CHOICE_SINGLE");
  const [points, setPoints] = useState("1");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState<OptionInput[]>([
    createOption(1),
    createOption(2),
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    questionText?: string;
    options?: string;
  }>({});

  useEffect(() => {
    if (mode === "edit" && question) {
      setQuestionText(question.questionText);
      setQuestionType(question.questionType);
      setPoints(String(question.points ?? 1));
      setExplanation(question.explanation || "");
      setImagePreviewUrl(question.imageUrl || null);
      if (question.options && question.options.length > 0) {
        setOptions(
          question.options.map((option) => ({
            id: option.id ?? `option-${option.order}`,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          }))
        );
      }
    }
  }, [mode, question]);

  useEffect(() => {
    if (!TYPES_WITH_OPTIONS.includes(questionType)) {
      return;
    }

    if (questionType === "TRUE_FALSE") {
      setOptions((prev) => {
        const hasTrueFalse =
          prev.length === 2 &&
          prev[0]?.optionText.toLowerCase() === "true" &&
          prev[1]?.optionText.toLowerCase() === "false";
        if (hasTrueFalse) return prev;
        return [
          { id: `true-${Date.now()}`, optionText: "True", isCorrect: false },
          { id: `false-${Date.now()}`, optionText: "False", isCorrect: false },
        ];
      });
      return;
    }

    if (options.length < 2) {
      setOptions([createOption(1), createOption(2)]);
    }
  }, [questionType, options.length]);

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteImageMutation.isPending;

  const isFormValid = useMemo(() => {
    if (!questionText.trim()) return false;
    if (TYPES_WITH_OPTIONS.includes(questionType)) {
      if (options.length < 2) return false;
      const filledOptions = options.filter((option) => option.optionText.trim());
      if (filledOptions.length < 2) return false;
      if (!filledOptions.some((option) => option.isCorrect)) return false;
    }
    return true;
  }, [questionText, options, questionType]);

  const resetForm = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setQuestionText("");
    setQuestionType("MULTIPLE_CHOICE_SINGLE");
    setPoints("1");
    setExplanation("");
    setOptions([createOption(1), createOption(2)]);
    setImageFile(null);
    setImagePreviewUrl(null);
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      resetForm();
    }
  };

  const validate = () => {
    const nextErrors: { questionText?: string; options?: string } = {};
    if (!questionText.trim()) {
      nextErrors.questionText = "Question text is required";
    }
    if (TYPES_WITH_OPTIONS.includes(questionType)) {
      const filledOptions = options.filter((option) => option.optionText.trim());
      if (filledOptions.length < 2) {
        nextErrors.options = "Add at least two options with text";
      } else if (!filledOptions.some((option) => option.isCorrect)) {
        nextErrors.options = "Mark at least one correct option";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const parseNumber = (value: string) => {
    if (!value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
   const formattedOptions = TYPES_WITH_OPTIONS.includes(questionType)
      ? options
          .filter((option) => option.optionText.trim())
          .map((option, index) => ({
            optionText: option.optionText.trim(),
            isCorrect: option.isCorrect,
            order: index + 1,
          }))
      : []; if (!validate()) return;

    

    if (mode === "create") {
      await createMutation.mutateAsync({
        data: {
          questionText: questionText.trim(),
          questionType,
          points: parseNumber(points) || 1,
          explanation: explanation.trim() || undefined,
          options: formattedOptions,
        },
        imageFile,
      });
    } else if (question) {
      await updateMutation.mutateAsync({
        questionId: question.id,
        data: {
          questionText: questionText.trim(),
          questionType,
          points: parseNumber(points) || 1,
          explanation: explanation.trim() || undefined,
          options: formattedOptions.length > 0 ? formattedOptions : undefined,
        },
        imageFile,
      });
    }

    handleClose();
  };

  const updateOption = (id: string, updates: Partial<OptionInput>) => {
    setOptions((prev) =>
      prev.map((option) => {
        if (option.id !== id) {
          if (
            updates.isCorrect &&
            questionType !== "MULTIPLE_CHOICE_MULTIPLE"
          ) {
            return { ...option, isCorrect: false };
          }
          return option;
        }
        return { ...option, ...updates };
      })
    );
  };

  const addOption = () => {
    setOptions((prev) => [...prev, createOption(prev.length + 1)]);
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const handleImageChange = (file: File | null) => {
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
      setImagePreviewUrl(question?.imageUrl || null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Question" : "Edit Question"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Essential Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exam-body-question-text">
                Question Text <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="exam-body-question-text"
                value={questionText}
                onChange={(event) => {
                  setQuestionText(event.target.value);
                  if (errors.questionText) {
                    setErrors((prev) => ({ ...prev, questionText: undefined }));
                  }
                }}
                rows={3}
                required
                className={errors.questionText ? "border-red-500" : ""}
                placeholder="Enter your question here..."
              />
              {errors.questionText && (
                <p className="text-xs text-red-500">{errors.questionText}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exam-body-question-type">Question Type</Label>
                <Select
                  value={questionType}
                  onValueChange={(value) =>
                    setQuestionType(value as ExamBodyQuestionType)
                  }
                >
                  <SelectTrigger id="exam-body-question-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-body-question-points">Points</Label>
                <Input
                  id="exam-body-question-points"
                  type="number"
                  min="1"
                  value={points}
                  onChange={(event) => setPoints(event.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Options Section - Only show for types that need it */}
          {TYPES_WITH_OPTIONS.includes(questionType) && (
            <div className="space-y-3 rounded-lg border border-brand-border bg-gray-50/50 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Answer Options</Label>
                <Button type="button" size="sm" variant="outline" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-3 rounded-md border border-brand-border bg-white p-3"
                  >
                    <div className="flex-1">
                      <Input
                        value={option.optionText}
                        onChange={(event) =>
                          updateOption(option.id, { optionText: event.target.value })
                        }
                        placeholder={`Option ${index + 1}`}
                        className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type={questionType === "MULTIPLE_CHOICE_MULTIPLE" ? "checkbox" : "radio"}
                        checked={option.isCorrect}
                        onChange={(event) =>
                          updateOption(option.id, { isCorrect: event.target.checked })
                        }
                        className="h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs text-gray-600">Correct</span>
                    </div>
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.options && (
                <p className="text-xs text-red-500">{errors.options}</p>
              )}
            </div>
          )}

          {/* Optional Fields - Collapsible */}
          <Accordion type="multiple" className="w-full">
            {/* Question Image - Always available as collapsible */}
            <AccordionItem value="image" className="border-brand-border">
              <AccordionTrigger className="text-sm font-medium py-3">
                Question Image
                {(imagePreviewUrl || imageFile) && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Added
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      handleImageChange(file);
                    }}
                  />
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-muted/40 hover:border-primary/70 hover:bg-muted aspect-square w-24 cursor-pointer overflow-hidden transition-colors"
                    >
                      {imagePreviewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreviewUrl}
                          alt="Question image preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center px-3 py-3">
                          <ImageIcon className="h-4 w-4 text-gray-500 mb-1" />
                          <span className="text-[10px] font-medium text-gray-700 text-center">
                            Upload
                          </span>
                        </div>
                      )}
                    </button>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-gray-600">
                        PNG, JPG, GIF, WEBP. Max 5MB.
                      </p>
                      {imageFile && (
                        <p className="text-xs text-gray-700">
                          Selected: <span className="font-medium">{imageFile.name}</span>
                        </p>
                      )}
                      {mode === "edit" && question?.imageUrl && !imageFile && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteImageMutation.mutate(question.id, {
                              onSuccess: () => {
                                setImageFile(null);
                                setImagePreviewUrl(null);
                              },
                            })
                          }
                          className="text-xs text-red-600 hover:underline"
                          disabled={deleteImageMutation.isPending}
                        >
                          {deleteImageMutation.isPending ? "Removing..." : "Remove image"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Explanation - Collapsible */}
            <AccordionItem value="explanation" className="border-brand-border">
              <AccordionTrigger className="text-sm font-medium py-3">
                Explanation
                {explanation && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Added
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <Textarea
                    id="exam-body-question-explanation"
                    value={explanation}
                    onChange={(event) => setExplanation(event.target.value)}
                    rows={3}
                    placeholder="Optional explanation for the answer..."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                mode === "create" ? "Create Question" : "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
