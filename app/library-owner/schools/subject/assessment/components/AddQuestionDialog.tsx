"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import {
  useCreateLibrarySchoolQuestion,
  type CreateQuestionPayload,
  type CreateQuestionOption,
  type LibrarySchoolQuestionType,
} from "../hooks/use-library-school-assessments";

interface AddQuestionDialogProps {
  schoolId: string;
  assessmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  nextOrder: number;
}

export function AddQuestionDialog({
  schoolId,
  assessmentId,
  open,
  onOpenChange,
  onSuccess,
  nextOrder,
}: AddQuestionDialogProps) {
  const createQuestion = useCreateLibrarySchoolQuestion(schoolId);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<LibrarySchoolQuestionType>("MULTIPLE_CHOICE_SINGLE");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState<CreateQuestionOption[]>([
    { option_text: "", order: 1, is_correct: false },
    { option_text: "", order: 2, is_correct: false },
  ]);

  const resetForm = () => {
    setQuestionText("");
    setQuestionType("MULTIPLE_CHOICE_SINGLE");
    setPoints(1);
    setOptions([
      { option_text: "", order: 1, is_correct: false },
      { option_text: "", order: 2, is_correct: false },
    ]);
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { option_text: "", order: prev.length + 1, is_correct: false },
    ]);
  };

  const updateOption = (index: number, field: keyof CreateQuestionOption, value: string | number | boolean) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeOption = (index: number) => {
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      next.forEach((opt, i) => {
        opt.order = i + 1;
      });
      return next;
    });
  };

  const needsOptions = questionType === "MULTIPLE_CHOICE_SINGLE" || questionType === "MULTIPLE_CHOICE_MULTIPLE" || questionType === "TRUE_FALSE";
  const validOptions = needsOptions
    ? options.length >= 2 &&
      options.every((o) => o.option_text.trim()) &&
      options.some((o) => o.is_correct)
    : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    if (!validOptions) return;

    const payload: CreateQuestionPayload = {
      question_text: questionText.trim(),
      question_type: questionType,
      order: nextOrder,
      points,
      is_required: true,
    };
    if (needsOptions) payload.options = options;

    createQuestion.mutate(
      { assessmentId, data: payload },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const handleTypeChange = (value: LibrarySchoolQuestionType) => {
    setQuestionType(value);
    if (value === "TRUE_FALSE") {
      setOptions([
        { option_text: "True", order: 1, is_correct: false },
        { option_text: "False", order: 2, is_correct: false },
      ]);
    } else if (value === "MULTIPLE_CHOICE_SINGLE" || value === "MULTIPLE_CHOICE_MULTIPLE") {
      setOptions([
        { option_text: "", order: 1, is_correct: false },
        { option_text: "", order: 2, is_correct: false },
      ]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add question</DialogTitle>
          <DialogDescription>Create a new question for this assessment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question_text">Question text *</Label>
            <Textarea
              id="question_text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the question"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Question type</Label>
              <Select value={questionType} onValueChange={(v) => handleTypeChange(v as LibrarySchoolQuestionType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MULTIPLE_CHOICE_SINGLE">Multiple choice (single)</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE_MULTIPLE">Multiple choice (multiple)</SelectItem>
                  <SelectItem value="TRUE_FALSE">True / False</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min={0.5}
                step={0.5}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          {needsOptions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  Add option
                </Button>
              </div>
              <p className="text-xs text-brand-light-accent-1">Mark the correct answer(s).</p>
              <div className="space-y-2">
                {options.map((opt, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={opt.is_correct}
                      onCheckedChange={(c) => updateOption(index, "is_correct", c === true)}
                    />
                    <Input
                      value={opt.option_text}
                      onChange={(e) => updateOption(index, "option_text", e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeOption(index)}
                        aria-label="Remove option"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {!validOptions && options.length >= 2 && (
                <p className="text-xs text-red-600">Add at least 2 options with text and mark one as correct.</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createQuestion.isPending || !questionText.trim() || !validOptions}
            >
              {createQuestion.isPending ? "Adding..." : "Add question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
