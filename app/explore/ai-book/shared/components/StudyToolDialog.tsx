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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface StudyToolDialogData {
  numberOfQuestions: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  questionType?: "short-answer" | "long-answer" | "mixed";
  additionalNotes?: string;
}

interface StudyToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolId: string;
  toolLabel: string;
  onSubmit: (data: StudyToolDialogData) => void;
}

export function StudyToolDialog({
  open,
  onOpenChange,
  toolId,
  toolLabel,
  onSubmit,
}: StudyToolDialogProps) {
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>("10");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [questionType, setQuestionType] = useState<"short-answer" | "long-answer" | "mixed">("mixed");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(true);
  const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNumberOfQuestions("10");
      setDifficulty("mixed");
      setQuestionType("mixed");
      setAdditionalNotes("");
      setIncludeAnswers(true);
      setIncludeExplanations(true);
    }
  }, [open]);

  const handleSubmit = () => {
    const numQuestions = parseInt(numberOfQuestions, 10);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 100) {
      return; // Validation will be handled by disabled state
    }

    const data: StudyToolDialogData = {
      numberOfQuestions: numQuestions,
      ...(toolId === "create-questions-answers" || toolId === "create-mcqs" ? {
        difficulty,
        additionalNotes: additionalNotes.trim() || undefined,
        includeAnswers,
        includeExplanations,
      } : {}),
      ...(toolId === "create-questions-answers" ? {
        questionType,
      } : {}),
    };

    onSubmit(data);
    onOpenChange(false);
  };

  const numQuestions = parseInt(numberOfQuestions, 10);
  const isValid = !isNaN(numQuestions) && numQuestions >= 1 && numQuestions <= 100;

  const isMCQTool = toolId === "create-mcqs";
  const isQATool = toolId === "create-questions-answers";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{toolLabel}</DialogTitle>
          <DialogDescription>
            Please provide the details for generating {isMCQTool ? "multiple choice questions" : "questions and answers"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">
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
            <p className="text-xs text-brand-light-accent-1">
              Enter a number between 1 and 100
            </p>
          </div>

          {/* Difficulty Level - Only for MCQ and Q&A tools */}
          {(isMCQTool || isQATool) && (
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
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

          {/* Question Type - Only for Q&A tool */}
          {isQATool && (
            <div className="space-y-2">
              <Label htmlFor="questionType">Question Type</Label>
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

          {/* Include Answers - Only for MCQ and Q&A tools */}
          {(isMCQTool || isQATool) && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAnswers"
                checked={includeAnswers}
                onCheckedChange={(checked) => setIncludeAnswers(!!checked)}
              />
              <Label
                htmlFor="includeAnswers"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Include Answers
              </Label>
            </div>
          )}

          {/* Include Explanations - Only for MCQ and Q&A tools */}
          {(isMCQTool || isQATool) && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeExplanations"
                checked={includeExplanations}
                onCheckedChange={(checked) => setIncludeExplanations(!!checked)}
              />
              <Label
                htmlFor="includeExplanations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Include Explanations
              </Label>
            </div>
          )}

          {/* Additional Notes - Only for MCQ and Q&A tools */}
          {(isMCQTool || isQATool) && (
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
              <Input
                id="additionalNotes"
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any specific requirements or focus areas..."
                className="w-full"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
