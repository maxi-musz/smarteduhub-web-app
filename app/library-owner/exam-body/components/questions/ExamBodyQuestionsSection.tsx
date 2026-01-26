"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Edit, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useExamBodyAssessments } from "@/hooks/exam-body/use-exam-body-assessments";
import { useExamBodyQuestions } from "@/hooks/exam-body/use-exam-body-questions";
import type { ExamBody, ExamBodyQuestionListItem } from "@/hooks/exam-body/types";
import { QuestionFormDialog } from "./QuestionFormDialog";
import { QuestionDeleteDialog } from "./QuestionDeleteDialog";
import { ExamInfoHeader } from "./ExamInfoHeader";

interface ExamBodyQuestionsSectionProps {
  examBodyId: string;
  examBody: ExamBody | null;
}

export const ExamBodyQuestionsSection = ({
  examBodyId,
  examBody,
}: ExamBodyQuestionsSectionProps) => {
  const { data: assessmentsData } = useExamBodyAssessments(examBodyId);
  const assessments = useMemo(() => assessmentsData || [], [assessmentsData]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (assessments.length === 0) {
      setSelectedAssessmentId(null);
      return;
    }
    if (!selectedAssessmentId) {
      setSelectedAssessmentId(assessments[0].id);
      return;
    }
    if (!assessments.some((assessment) => assessment.id === selectedAssessmentId)) {
      setSelectedAssessmentId(assessments[0].id);
    }
  }, [selectedAssessmentId, assessments]);

  const selectedAssessment = useMemo(
    () => assessments.find((a) => a.id === selectedAssessmentId) || null,
    [assessments, selectedAssessmentId]
  );

  const { data: questionsData, isLoading } = useExamBodyQuestions(
    examBodyId,
    selectedAssessmentId
  );
  const allQuestions = useMemo(() => questionsData?.questions || [], [questionsData]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when assessment changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAssessmentId]);

  // Calculate pagination
  const totalPages = Math.ceil(allQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = allQuestions.slice(startIndex, endIndex);

  // Helper function to get correct answers for a question
  const getCorrectAnswers = (question: ExamBodyQuestionListItem): string[] => {
    if (!question.correctAnswers || question.correctAnswers.length === 0) {
      return [];
    }

    const correctAnswer = question.correctAnswers[0];
    
    // For questions with options (multiple choice, true/false)
    if (correctAnswer.optionIds && correctAnswer.optionIds.length > 0) {
      const correctOptions = (question.options || []).filter((option) =>
        correctAnswer.optionIds.includes(option.id)
      );
      return correctOptions.map((opt) => opt.optionText);
    }

    // For text-based answers
    if (correctAnswer.answerText) {
      return [correctAnswer.answerText];
    }

    // For numeric answers
    if (correctAnswer.answerNumber !== null && correctAnswer.answerNumber !== undefined) {
      return [String(correctAnswer.answerNumber)];
    }

    // For date answers
    if (correctAnswer.answerDate) {
      return [new Date(correctAnswer.answerDate).toLocaleDateString()];
    }

    return [];
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState<ExamBodyQuestionListItem | null>(
    null
  );
  const [editingQuestion, setEditingQuestion] = useState<ExamBodyQuestionListItem | null>(
    null
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-heading">Questions</h3>
          <p className="text-sm text-brand-light-accent-1">
            Add and manage assessment questions for the selected assessment.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          disabled={!selectedAssessmentId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exam-body-question-assessment">Assessment</Label>
        <Select
          value={selectedAssessmentId || "none"}
          onValueChange={(value) =>
            setSelectedAssessmentId(value === "none" ? null : value)
          }
        >
          <SelectTrigger id="exam-body-question-assessment">
            <SelectValue placeholder="Select assessment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select assessment</SelectItem>
            {assessments.map((assessment) => (
              <SelectItem key={assessment.id} value={assessment.id}>
                {assessment.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exam Information Header */}
      {selectedAssessmentId && selectedAssessment && (
        <ExamInfoHeader
          examBody={examBody}
          assessment={selectedAssessment}
          questionTotal={allQuestions.length}
        />
      )}

      {!selectedAssessmentId ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
            Select an assessment to manage questions.
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : allQuestions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
            No questions have been added to this assessment yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-2.5">
            {paginatedQuestions.map((question, index) => {
              // Calculate the actual question number (accounting for pagination)
              const questionNumber = startIndex + index + 1;
            const correctAnswers = getCorrectAnswers(question);
            const hasOptions = question.options && question.options.length > 0;

            return (
              <Card key={question.id} className="border-brand-border">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center">
                          <span className="text-xs font-semibold text-brand-primary">
                            {questionNumber}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div>
                          <p className="font-medium text-brand-heading text-sm leading-snug">
                            {question.questionText}
                          </p>
                          {question.imageUrl && (
                            <div className="mt-1.5 rounded overflow-hidden border border-brand-border">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={question.imageUrl}
                                alt="Question image"
                                className="w-full h-auto max-h-40 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        {/* Options Display - Compact */}
                        {hasOptions && (
                          <div className="space-y-1 mt-2">
                            {question.options!.map((option, optIndex) => {
                              const isCorrect = correctAnswers.includes(option.optionText);
                              return (
                                <div
                                  key={option.id}
                                  className={`flex items-center gap-2 p-1.5 rounded border ${
                                    isCorrect
                                      ? "border-green-500 bg-green-50/50"
                                      : "border-brand-border bg-gray-50/50"
                                  }`}
                                >
                                  <div className="flex-shrink-0">
                                    {isCorrect ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                    ) : (
                                      <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-xs ${
                                        isCorrect
                                          ? "font-semibold text-green-700"
                                          : "text-brand-heading"
                                      }`}
                                    >
                                      <span className="font-medium">
                                        {String.fromCharCode(65 + optIndex)}.
                                      </span>{" "}
                                      {option.optionText}
                                    </p>
                                  </div>
                                  {isCorrect && (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-100 text-green-700 border-green-300 text-[10px] px-1 py-0 flex-shrink-0"
                                    >
                                      ✓
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Correct Answer Display for non-option questions */}
                        {!hasOptions && correctAnswers.length > 0 && (
                          <div className="mt-2 p-2 rounded border border-green-500 bg-green-50/50">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                              <div>
                                <p className="text-[10px] font-medium text-green-700 mb-0.5">
                                  Correct Answer:
                                </p>
                                <p className="text-xs font-semibold text-green-800">
                                  {correctAnswers.join(", ")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Question Metadata - Compact */}
                        <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-brand-border">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {question.questionType.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-[10px] text-brand-light-accent-1">
                            {question.points}pt
                          </span>
                          {hasOptions && (
                            <span className="text-[10px] text-brand-light-accent-1">
                              {question.options!.length} opts
                            </span>
                          )}
                          {question.explanation && (
                            <div className="w-full mt-1.5 pt-1.5 border-t border-brand-border">
                              <p className="text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
                                Explanation:
                              </p>
                              <p className="text-xs text-brand-heading line-clamp-2">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingQuestion(question)}
                        className="h-7 w-7"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingQuestion(question)}
                        className="h-7 w-7"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-brand-border">
              <div className="text-sm text-brand-light-accent-1">
                Showing {startIndex + 1} to {Math.min(endIndex, allQuestions.length)} of{" "}
                {allQuestions.length} questions
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      href="#"
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;

                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                          href="#"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      href="#"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {selectedAssessmentId && (
        <QuestionFormDialog
          open={isCreateOpen}
          mode="create"
          examBodyId={examBodyId}
          assessmentId={selectedAssessmentId}
          onOpenChange={setIsCreateOpen}
        />
      )}

      {selectedAssessmentId && (
        <QuestionFormDialog
          open={!!editingQuestion}
          mode="edit"
          examBodyId={examBodyId}
          assessmentId={selectedAssessmentId}
          question={editingQuestion}
          onOpenChange={(open) => {
            if (!open) setEditingQuestion(null);
          }}
        />
      )}

      {selectedAssessmentId && (
        <QuestionDeleteDialog
          open={!!deletingQuestion}
          examBodyId={examBodyId}
          assessmentId={selectedAssessmentId}
          question={deletingQuestion}
          onOpenChange={(open) => {
            if (!open) setDeletingQuestion(null);
          }}
        />
      )}
    </div>
  );
};
