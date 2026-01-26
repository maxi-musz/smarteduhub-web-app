"use client";

import React, { useState, useEffect } from "react";
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
import { GraduationCap, Clock, Target, FileText } from "lucide-react";
import type { TeacherToolDialogData } from "./teacherToolMessages";

interface TeacherToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolId: string;
  toolLabel: string;
  onSubmit: (data: TeacherToolDialogData) => void;
}

export function TeacherToolDialog({
  open,
  onOpenChange,
  toolId,
  toolLabel,
  onSubmit,
}: TeacherToolDialogProps) {
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>("20");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [questionType, setQuestionType] = useState<"short-answer" | "long-answer" | "mixed">("mixed");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<string>("");
  const [timeAllocation, setTimeAllocation] = useState<string>("");
  const [learningObjectives, setLearningObjectives] = useState<string>("");
  const [assessmentType, setAssessmentType] = useState<string>("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNumberOfQuestions("20");
      setDifficulty("mixed");
      setQuestionType("mixed");
      setAdditionalNotes("");
      setGradeLevel("");
      setTimeAllocation("");
      setLearningObjectives("");
      setAssessmentType("");
    }
  }, [open]);

  const handleSubmit = () => {
    const data: TeacherToolDialogData = {};

    // Common fields for question paper
    if (toolId === "create-question-paper") {
      const numQuestions = parseInt(numberOfQuestions, 10);
      if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 100) {
        return;
      }
      data.numberOfQuestions = numQuestions;
      data.difficulty = difficulty;
      data.additionalNotes = additionalNotes.trim() || undefined;
      if (assessmentType) data.assessmentType = assessmentType;
      if (timeAllocation) data.timeAllocation = timeAllocation;
    }

    // Common fields for lesson plans
    if (toolId === "lesson-plan" || toolId === "lesson-plan-advanced") {
      if (gradeLevel) data.gradeLevel = gradeLevel;
      if (timeAllocation) data.timeAllocation = timeAllocation;
      if (learningObjectives) data.learningObjectives = learningObjectives;
      if (additionalNotes) data.additionalNotes = additionalNotes.trim();
    }

    onSubmit(data);
    onOpenChange(false);
  };

  const isQuestionPaper = toolId === "create-question-paper";
  const isLessonPlan = toolId === "lesson-plan" || toolId === "lesson-plan-advanced";

  const numQuestions = parseInt(numberOfQuestions, 10);
  const isValid = isQuestionPaper 
    ? !isNaN(numQuestions) && numQuestions >= 1 && numQuestions <= 100
    : true; // Lesson plans don't require number validation

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-5 w-5 text-brand-primary" />
            {toolLabel}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {isQuestionPaper 
              ? "Configure your question paper with professional specifications"
              : "Provide details to generate a comprehensive lesson plan tailored to your needs"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Grade Level - For lesson plans */}
          {isLessonPlan && (
            <div className="space-y-2">
              <Label htmlFor="gradeLevel" className="flex items-center gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4 text-brand-primary" />
                Grade Level / Class
              </Label>
              <Input
                id="gradeLevel"
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                placeholder="e.g., Grade 10, Class 5, Year 12"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Specify the target grade or class level for this lesson
              </p>
            </div>
          )}

          {/* Time Allocation */}
          {(isLessonPlan || isQuestionPaper) && (
            <div className="space-y-2">
              <Label htmlFor="timeAllocation" className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-brand-primary" />
                Time Allocation
              </Label>
              <Input
                id="timeAllocation"
                type="text"
                value={timeAllocation}
                onChange={(e) => setTimeAllocation(e.target.value)}
                placeholder={isQuestionPaper ? "e.g., 90 minutes, 2 hours" : "e.g., 45 minutes, 1 hour"}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                {isQuestionPaper 
                  ? "Allocated time for completing the assessment"
                  : "Duration of the lesson"}
              </p>
            </div>
          )}

          {/* Learning Objectives - For lesson plans */}
          {isLessonPlan && (
            <div className="space-y-2">
              <Label htmlFor="learningObjectives" className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-brand-primary" />
                Learning Objectives
              </Label>
              <Textarea
                id="learningObjectives"
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                placeholder="Specify the key learning objectives for this lesson (optional)"
                className="w-full min-h-[80px] resize-none"
              />
              <p className="text-xs text-gray-500">
                Describe what students should be able to do after this lesson
              </p>
            </div>
          )}

          {/* Number of Questions - For question paper */}
          {isQuestionPaper && (
            <div className="space-y-2">
              <Label htmlFor="numberOfQuestions" className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-brand-primary" />
                Number of Questions <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numberOfQuestions"
                type="number"
                min="1"
                max="100"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                placeholder="Enter number of questions (1-100)"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Enter a number between 1 and 100
              </p>
            </div>
          )}

          {/* Assessment Type - For question paper */}
          {isQuestionPaper && (
            <div className="space-y-2">
              <Label htmlFor="assessmentType" className="text-sm font-semibold">
                Assessment Type
              </Label>
              <Select value={assessmentType} onValueChange={setAssessmentType}>
                <SelectTrigger id="assessmentType" className="w-full">
                  <SelectValue placeholder="Select assessment type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="midterm">Midterm</SelectItem>
                  <SelectItem value="final">Final Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Difficulty Level - For question paper */}
          {isQuestionPaper && (
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-sm font-semibold">
                Difficulty Level
              </Label>
              <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard" | "mixed") => setDifficulty(value)}>
                <SelectTrigger id="difficulty" className="w-full">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="mixed">Mixed (Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Question Type - For question paper */}
          {isQuestionPaper && (
            <div className="space-y-2">
              <Label htmlFor="questionType" className="text-sm font-semibold">
                Question Type
              </Label>
              <Select value={questionType} onValueChange={(value: "short-answer" | "long-answer" | "mixed") => setQuestionType(value)}>
                <SelectTrigger id="questionType" className="w-full">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="long-answer">Long Answer</SelectItem>
                  <SelectItem value="mixed">Mixed (Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes" className="text-sm font-semibold">
              Additional Notes / Requirements
            </Label>
            <Textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any specific requirements, focus areas, or special instructions..."
              className="w-full min-h-[80px] resize-none"
            />
            <p className="text-xs text-gray-500">
              Optional: Provide any additional context or specific requirements
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid}
            className="bg-brand-primary hover:bg-brand-primary-hover"
          >
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
