"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { CreateAssessmentRequest, AssessmentType } from "@/hooks/teacher/use-teacher-assessments";
import type { SubjectDashboardItem } from "@/hooks/teacher/use-teacher-data";

interface CreateAssessmentFormProps {
  subjectId: string;
  subjects: SubjectDashboardItem[];
  onSubmit: (data: CreateAssessmentRequest) => void;
  isLoading: boolean;
}

export const CreateAssessmentForm = ({
  subjectId,
  subjects,
  onSubmit,
  isLoading,
}: CreateAssessmentFormProps) => {
  const [formData, setFormData] = useState<CreateAssessmentRequest>({
    title: "",
    description: "",
    instructions: "",
    subject_id: subjectId,
    duration: 30,
    max_attempts: 1,
    passing_score: 50,
    total_points: 100,
    shuffle_questions: false,
    shuffle_options: false,
    show_correct_answers: false,
    show_feedback: true,
    allow_review: true,
    grading_type: "AUTOMATIC",
    // Auto submit should always be enabled by default
    auto_submit: true,
    assessment_type: "CBT",
    tags: [],
  });

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof CreateAssessmentRequest>(
    field: K,
    value: CreateAssessmentRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
              placeholder="e.g., Mathematics Chapter 1 Quiz"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Brief description of the assessment"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => updateField("instructions", e.target.value)}
              placeholder="Instructions for students"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assessment_type">Assessment Type *</Label>
              <Select
                value={formData.assessment_type}
                onValueChange={(value) => updateField("assessment_type", value as AssessmentType)}
              >
                <SelectTrigger id="assessment_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CBT">CBT</SelectItem>
                  {/* <SelectItem value="QUIZ">Quiz</SelectItem> */}
                  <SelectItem value="EXAM">Exam</SelectItem>
                  {/* <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                  <SelectItem value="TEST">Test</SelectItem>
                  <SelectItem value="FORMATIVE">Formative</SelectItem>
                  <SelectItem value="SUMMATIVE">Summative</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grading_type">Grading Type</Label>
              <Select
                value={formData.grading_type}
                // Only automatic grading is supported for now
                disabled
              >
                <SelectTrigger id="grading_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                  {/* Manual and Mixed grading types are not available for teachers */}
                  {/* <SelectItem value="MANUAL" disabled>Manual</SelectItem>
                  <SelectItem value="MIXED" disabled>Mixed</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSubject && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Subject:</span> {selectedSubject.name}
                {selectedSubject.code && ` (${selectedSubject.code})`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="300"
                value={formData.duration || ""}
                onChange={(e) => updateField("duration", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_points">Total Points</Label>
              <Input
                id="total_points"
                type="number"
                min="1"
                value={formData.total_points || ""}
                onChange={(e) => updateField("total_points", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing Score (%)</Label>
              <Input
                id="passing_score"
                type="number"
                min="0"
                max="100"
                value={formData.passing_score || ""}
                onChange={(e) => updateField("passing_score", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_attempts">Max Attempts</Label>
              <Input
                id="max_attempts"
                type="number"
                min="1"
                max="10"
                value={formData.max_attempts || ""}
                onChange={(e) => updateField("max_attempts", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shuffle_questions"
                checked={formData.shuffle_questions}
                onCheckedChange={(checked) => updateField("shuffle_questions", checked === true)}
              />
              <Label htmlFor="shuffle_questions" className="cursor-pointer">
                Shuffle Questions
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="shuffle_options"
                checked={formData.shuffle_options}
                onCheckedChange={(checked) => updateField("shuffle_options", checked === true)}
              />
              <Label htmlFor="shuffle_options" className="cursor-pointer">
                Shuffle Options
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show_correct_answers"
                checked={formData.show_correct_answers}
                onCheckedChange={(checked) => updateField("show_correct_answers", checked === true)}
              />
              <Label htmlFor="show_correct_answers" className="cursor-pointer">
                Show Correct Answers
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show_feedback"
                checked={formData.show_feedback}
                onCheckedChange={(checked) => updateField("show_feedback", checked === true)}
              />
              <Label htmlFor="show_feedback" className="cursor-pointer">
                Show Feedback
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow_review"
                checked={formData.allow_review}
                onCheckedChange={(checked) => updateField("allow_review", checked === true)}
              />
              <Label htmlFor="allow_review" className="cursor-pointer">
                Allow Review
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto_submit"
                checked={formData.auto_submit}
                // Always auto-submit on time expiry; this is not configurable for teachers
                disabled
              />
              <Label htmlFor="auto_submit" className="cursor-pointer">
                Auto Submit on Time Expiry
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !formData.title}>
          {isLoading ? "Creating..." : "Create Assessment"}
        </Button>
      </div>
    </form>
  );
};


