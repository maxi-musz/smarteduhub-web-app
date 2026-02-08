"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Loader2 } from "lucide-react";
import type {
  LibrarySchoolAssessment,
  UpdateAssessmentPayload,
  AssessmentType,
  AssessmentStatus,
} from "../hooks/use-library-school-assessments";
import { useUpdateLibrarySchoolAssessment } from "../hooks/use-library-school-assessments";

interface EditAssessmentModalProps {
  schoolId: string;
  assessment: LibrarySchoolAssessment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAssessmentModal({
  schoolId,
  assessment,
  open,
  onOpenChange,
}: EditAssessmentModalProps) {
  const updateMutation = useUpdateLibrarySchoolAssessment(schoolId);
  const [formData, setFormData] = useState<UpdateAssessmentPayload>({});

  useEffect(() => {
    if (open && assessment) {
      setFormData({
        title: assessment.title,
        description: assessment.description ?? "",
        instructions: assessment.instructions ?? "",
        duration: assessment.duration ?? undefined,
        max_attempts: assessment.max_attempts,
        passing_score: assessment.passing_score,
        total_points: assessment.total_points,
        shuffle_questions: assessment.shuffle_questions,
        shuffle_options: assessment.shuffle_options,
        show_correct_answers: assessment.show_correct_answers,
        show_feedback: assessment.show_feedback,
        allow_review: assessment.allow_review,
        start_date: assessment.start_date ? assessment.start_date.slice(0, 16) : undefined,
        end_date: assessment.end_date ? assessment.end_date.slice(0, 16) : undefined,
        time_limit: assessment.time_limit ?? undefined,
        grading_type: assessment.grading_type,
        auto_submit: assessment.auto_submit,
        assessment_type: assessment.assessment_type,
      });
    }
  }, [open, assessment]);

  const update = <K extends keyof UpdateAssessmentPayload>(
    key: K,
    value: UpdateAssessmentPayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const original = {
    title: assessment.title,
    description: assessment.description ?? "",
    instructions: assessment.instructions ?? "",
    duration: assessment.duration ?? undefined,
    max_attempts: assessment.max_attempts,
    passing_score: assessment.passing_score,
    total_points: assessment.total_points,
    shuffle_questions: assessment.shuffle_questions,
    shuffle_options: assessment.shuffle_options,
    show_correct_answers: assessment.show_correct_answers,
    show_feedback: assessment.show_feedback,
    allow_review: assessment.allow_review,
    start_date: assessment.start_date ? assessment.start_date.slice(0, 16) : undefined,
    end_date: assessment.end_date ? assessment.end_date.slice(0, 16) : undefined,
    time_limit: assessment.time_limit ?? undefined,
    grading_type: assessment.grading_type,
    auto_submit: assessment.auto_submit,
    assessment_type: assessment.assessment_type,
  };

  const hasInitialized = formData.title !== undefined;
  const hasChanges =
    hasInitialized &&
    ((formData.title ?? "") !== original.title ||
    (formData.description ?? "") !== original.description ||
    (formData.instructions ?? "") !== original.instructions ||
    (formData.duration ?? undefined) !== original.duration ||
    (formData.max_attempts ?? 0) !== original.max_attempts ||
    (formData.passing_score ?? 0) !== original.passing_score ||
    (formData.total_points ?? 0) !== original.total_points ||
    (formData.shuffle_questions ?? false) !== original.shuffle_questions ||
    (formData.shuffle_options ?? false) !== original.shuffle_options ||
    (formData.show_correct_answers ?? false) !== original.show_correct_answers ||
    (formData.show_feedback ?? false) !== original.show_feedback ||
    (formData.allow_review ?? false) !== original.allow_review ||
    (formData.start_date ?? "") !== (original.start_date ?? "") ||
    (formData.end_date ?? "") !== (original.end_date ?? "") ||
    (formData.time_limit ?? undefined) !== original.time_limit ||
    (formData.grading_type ?? "") !== original.grading_type ||
    (formData.auto_submit ?? false) !== original.auto_submit ||
    (formData.assessment_type ?? "") !== original.assessment_type ||
    (formData.status ?? assessment.status) !== assessment.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateAssessmentPayload = {};
    if (formData.title !== undefined) payload.title = formData.title;
    if (formData.description !== undefined) payload.description = formData.description;
    if (formData.instructions !== undefined) payload.instructions = formData.instructions;
    if (formData.duration !== undefined) payload.duration = formData.duration;
    if (formData.max_attempts !== undefined) payload.max_attempts = formData.max_attempts;
    if (formData.passing_score !== undefined) payload.passing_score = formData.passing_score;
    if (formData.total_points !== undefined) payload.total_points = formData.total_points;
    if (formData.shuffle_questions !== undefined) payload.shuffle_questions = formData.shuffle_questions;
    if (formData.shuffle_options !== undefined) payload.shuffle_options = formData.shuffle_options;
    if (formData.show_correct_answers !== undefined) payload.show_correct_answers = formData.show_correct_answers;
    if (formData.show_feedback !== undefined) payload.show_feedback = formData.show_feedback;
    if (formData.allow_review !== undefined) payload.allow_review = formData.allow_review;
    if (formData.start_date !== undefined) payload.start_date = formData.start_date || undefined;
    if (formData.end_date !== undefined) payload.end_date = formData.end_date || undefined;
    if (formData.time_limit !== undefined) payload.time_limit = formData.time_limit;
    if (formData.grading_type !== undefined) payload.grading_type = formData.grading_type;
    if (formData.auto_submit !== undefined) payload.auto_submit = formData.auto_submit;
    if (formData.assessment_type !== undefined) payload.assessment_type = formData.assessment_type;
    if (formData.status !== undefined) payload.status = formData.status;

    await updateMutation.mutateAsync({ id: assessment.id, data: payload });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit assessment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title ?? ""}
                onChange={(e) => update("title", e.target.value)}
                required
                placeholder="e.g. Mathematics Chapter 1 Quiz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Brief description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instructions">Instructions</Label>
              <Textarea
                id="edit-instructions"
                value={formData.instructions ?? ""}
                onChange={(e) => update("instructions", e.target.value)}
                placeholder="Instructions for students"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assessment type</Label>
                <Select
                  value={formData.assessment_type}
                  onValueChange={(v) => update("assessment_type", v as AssessmentType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBT">CBT</SelectItem>
                    <SelectItem value="EXAM">Exam</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(assessment.status === "DRAFT" || assessment.status === "CLOSED") && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status ?? assessment.status}
                    onValueChange={(v) => update("status", v as AssessmentStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (min)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min={1}
                  max={300}
                  value={formData.duration ?? ""}
                  onChange={(e) =>
                    update("duration", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-total_points">Total points</Label>
                <Input
                  id="edit-total_points"
                  type="number"
                  min={1}
                  value={formData.total_points ?? ""}
                  onChange={(e) =>
                    update("total_points", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-passing_score">Passing score (%)</Label>
                <Input
                  id="edit-passing_score"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.passing_score ?? ""}
                  onChange={(e) =>
                    update("passing_score", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max_attempts">Max attempts</Label>
                <Input
                  id="edit-max_attempts"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.max_attempts ?? ""}
                  onChange={(e) =>
                    update("max_attempts", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start_date">Start date</Label>
                <Input
                  id="edit-start_date"
                  type="datetime-local"
                  value={formData.start_date ?? ""}
                  onChange={(e) => update("start_date", e.target.value || undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end_date">End date</Label>
                <Input
                  id="edit-end_date"
                  type="datetime-local"
                  value={formData.end_date ?? ""}
                  onChange={(e) => update("end_date", e.target.value || undefined)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.shuffle_questions ?? false}
                  onCheckedChange={(c) => update("shuffle_questions", c === true)}
                />
                <span className="text-sm">Shuffle questions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.shuffle_options ?? false}
                  onCheckedChange={(c) => update("shuffle_options", c === true)}
                />
                <span className="text-sm">Shuffle options</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.show_correct_answers ?? false}
                  onCheckedChange={(c) => update("show_correct_answers", c === true)}
                />
                <span className="text-sm">Show correct answers</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.show_feedback ?? false}
                  onCheckedChange={(c) => update("show_feedback", c === true)}
                />
                <span className="text-sm">Show feedback</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.allow_review ?? false}
                  onCheckedChange={(c) => update("allow_review", c === true)}
                />
                <span className="text-sm">Allow review</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.auto_submit ?? false}
                  onCheckedChange={(c) => update("auto_submit", c === true)}
                />
                <span className="text-sm">Auto submit on time expiry</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending || !hasChanges}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
