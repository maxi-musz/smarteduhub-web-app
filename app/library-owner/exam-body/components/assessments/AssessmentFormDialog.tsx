"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  useCreateExamBodyAssessment,
  useUpdateExamBodyAssessment,
} from "@/hooks/exam-body/use-exam-body-assessments";
import type {
  ExamBodyAssessment,
  ExamBodySubject,
  ExamBodyYear,
} from "@/hooks/exam-body/types";

type Mode = "create" | "edit";

interface AssessmentFormDialogProps {
  open: boolean;
  mode: Mode;
  examBodyId: string;
  assessment?: ExamBodyAssessment | null;
  subjects: ExamBodySubject[];
  years: ExamBodyYear[];
  defaultSubjectId?: string | null;
  defaultYearId?: string | null;
  onOpenChange: (open: boolean) => void;
}

export const AssessmentFormDialog = ({
  open,
  mode,
  examBodyId,
  assessment,
  subjects,
  years,
  defaultSubjectId,
  defaultYearId,
  onOpenChange,
}: AssessmentFormDialogProps) => {
  const createMutation = useCreateExamBodyAssessment(examBodyId);
  const updateMutation = useUpdateExamBodyAssessment(examBodyId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [duration, setDuration] = useState("");
  const [passingScore, setPassingScore] = useState("");
  const [maxAttempts, setMaxAttempts] = useState("");
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const [subjectId, setSubjectId] = useState<string | null>(defaultSubjectId || null);
  const [yearId, setYearId] = useState<string | null>(defaultYearId || null);
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (mode === "edit" && assessment) {
      setTitle(assessment.title);
      setDescription(assessment.description || "");
      setInstructions(assessment.instructions || "");
      setDuration(assessment.duration ? String(assessment.duration) : "");
      setPassingScore(String(assessment.passingScore));
      setMaxAttempts(String(assessment.maxAttempts));
      setShuffleQuestions(assessment.shuffleQuestions);
      setShuffleOptions(assessment.shuffleOptions);
      setShowCorrectAnswers(assessment.showCorrectAnswers);
      setShowFeedback(assessment.showFeedback);
      setShowExplanation(assessment.showExplanation);
      setSubjectId(assessment.subjectId);
      setYearId(assessment.yearId);
    }
  }, [mode, assessment]);

  useEffect(() => {
    if (mode === "create") {
      setSubjectId(defaultSubjectId || null);
      setYearId(defaultYearId || null);
    }
  }, [mode, defaultSubjectId, defaultYearId]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const isFormValid = useMemo(() => {
    if (!title.trim()) return false;
    if (mode === "create" && (!subjectId || !yearId)) return false;
    return true;
  }, [title, mode, subjectId, yearId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setInstructions("");
    setDuration("");
    setPassingScore("");
    setMaxAttempts("");
    setShuffleQuestions(true);
    setShuffleOptions(true);
    setShowCorrectAnswers(true);
    setShowFeedback(true);
    setShowExplanation(true);
    setSubjectId(defaultSubjectId || null);
    setYearId(defaultYearId || null);
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      resetForm();
    }
  };

  const validate = () => {
    const nextErrors: { title?: string } = {};
    if (!title.trim()) {
      nextErrors.title = "Title is required";
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
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      instructions: instructions.trim() || undefined,
      duration: parseNumber(duration),
      passingScore: parseNumber(passingScore),
      maxAttempts: parseNumber(maxAttempts),
      shuffleQuestions,
      shuffleOptions,
      showCorrectAnswers,
      showFeedback,
      showExplanation,
    };

    if (mode === "create") {
      if (!subjectId || !yearId) return;
      await createMutation.mutateAsync({
        subjectId,
        yearId,
        data: payload,
      });
      handleClose();
      return;
    }

    if (mode === "edit" && assessment) {
      await updateMutation.mutateAsync({
        id: assessment.id,
        data: payload,
      });
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Assessment" : "Edit Assessment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exam-body-assessment-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="exam-body-assessment-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              required
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {mode === "create" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exam-body-assessment-subject">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={subjectId || "none"}
                  onValueChange={(value) => setSubjectId(value === "none" ? null : value)}
                >
                  <SelectTrigger id="exam-body-assessment-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select subject</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-body-assessment-year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={yearId || "none"}
                  onValueChange={(value) => setYearId(value === "none" ? null : value)}
                >
                  <SelectTrigger id="exam-body-assessment-year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select year</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="exam-body-assessment-description">Description</Label>
            <Textarea
              id="exam-body-assessment-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-body-assessment-instructions">Instructions</Label>
            <Textarea
              id="exam-body-assessment-instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="exam-body-assessment-duration">Duration (minutes)</Label>
              <Input
                id="exam-body-assessment-duration"
                type="number"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-body-assessment-passing">Passing Score</Label>
              <Input
                id="exam-body-assessment-passing"
                type="number"
                value={passingScore}
                onChange={(event) => setPassingScore(event.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-body-assessment-attempts">Max Attempts</Label>
              <Input
                id="exam-body-assessment-attempts"
                type="number"
                value={maxAttempts}
                onChange={(event) => setMaxAttempts(event.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border border-brand-border p-3">
              <Label htmlFor="exam-body-assessment-shuffle-questions">
                Shuffle Questions
              </Label>
              <Switch
                id="exam-body-assessment-shuffle-questions"
                checked={shuffleQuestions}
                onCheckedChange={setShuffleQuestions}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-brand-border p-3">
              <Label htmlFor="exam-body-assessment-shuffle-options">
                Shuffle Options
              </Label>
              <Switch
                id="exam-body-assessment-shuffle-options"
                checked={shuffleOptions}
                onCheckedChange={setShuffleOptions}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-brand-border p-3">
              <Label htmlFor="exam-body-assessment-show-correct">
                Show Correct Answers
              </Label>
              <Switch
                id="exam-body-assessment-show-correct"
                checked={showCorrectAnswers}
                onCheckedChange={setShowCorrectAnswers}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-brand-border p-3">
              <Label htmlFor="exam-body-assessment-show-feedback">Show Feedback</Label>
              <Switch
                id="exam-body-assessment-show-feedback"
                checked={showFeedback}
                onCheckedChange={setShowFeedback}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-brand-border p-3">
              <Label htmlFor="exam-body-assessment-show-explanation">
                Show Explanation
              </Label>
              <Switch
                id="exam-body-assessment-show-explanation"
                checked={showExplanation}
                onCheckedChange={setShowExplanation}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Assessment"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
