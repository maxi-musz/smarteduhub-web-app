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
import type { CreateAssessmentPayload, AssessmentType } from "../hooks/use-library-school-assessments";

interface CreateAssessmentFormProps {
  subjectId: string;
  subjectName: string;
  onSubmit: (data: CreateAssessmentPayload) => void;
  isLoading: boolean;
}

export function CreateAssessmentForm({
  subjectId,
  subjectName,
  onSubmit,
  isLoading,
}: CreateAssessmentFormProps) {
  const [formData, setFormData] = useState<CreateAssessmentPayload>({
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
    auto_submit: true,
    assessment_type: "CBT",
    tags: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const update = <K extends keyof CreateAssessmentPayload>(key: K, value: CreateAssessmentPayload[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-brand-light-accent-1"><span className="font-medium text-brand-heading">Subject:</span> {subjectName}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => update("title", e.target.value)}
              required
              placeholder="e.g. Mathematics Chapter 1 Quiz"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions ?? ""}
              onChange={(e) => update("instructions", e.target.value)}
              placeholder="Instructions for students"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assessment type *</Label>
              <Select
                value={formData.assessment_type}
                onValueChange={(v) => update("assessment_type", v as AssessmentType)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CBT">CBT</SelectItem>
                  <SelectItem value="EXAM">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={300}
                value={formData.duration ?? ""}
                onChange={(e) => update("duration", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_points">Total points</Label>
              <Input
                id="total_points"
                type="number"
                min={1}
                value={formData.total_points ?? ""}
                onChange={(e) => update("total_points", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing score (%)</Label>
              <Input
                id="passing_score"
                type="number"
                min={0}
                max={100}
                value={formData.passing_score ?? ""}
                onChange={(e) => update("passing_score", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_attempts">Max attempts</Label>
              <Input
                id="max_attempts"
                type="number"
                min={1}
                max={10}
                value={formData.max_attempts ?? ""}
                onChange={(e) => update("max_attempts", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={formData.shuffle_questions} onCheckedChange={(c) => update("shuffle_questions", c === true)} />
              <span className="text-sm">Shuffle questions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={formData.shuffle_options} onCheckedChange={(c) => update("shuffle_options", c === true)} />
              <span className="text-sm">Shuffle options</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={formData.show_correct_answers} onCheckedChange={(c) => update("show_correct_answers", c === true)} />
              <span className="text-sm">Show correct answers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={formData.show_feedback} onCheckedChange={(c) => update("show_feedback", c === true)} />
              <span className="text-sm">Show feedback</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={formData.allow_review} onCheckedChange={(c) => update("allow_review", c === true)} />
              <span className="text-sm">Allow review</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={formData.auto_submit} onCheckedChange={(c) => update("auto_submit", c === true)} />
              <span className="text-sm">Auto submit on time expiry</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !formData.title.trim()}>
          {isLoading ? "Creating..." : "Create assessment"}
        </Button>
      </div>
    </form>
  );
}
