"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCBTQuestions, useDeleteQuestion } from "@/hooks/assessment/use-cbt-questions";
import { CBT, Question } from "@/hooks/assessment/use-cbt-types";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  FileQuestion,
  Loader2,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { QuestionFormDialog } from "./QuestionFormDialog";
import { InlineQuestionForm } from "./InlineQuestionForm";
import { DeleteQuestionDialog } from "./DeleteQuestionDialog";
import Image from "next/image";

interface ManageQuestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cbt: CBT;
}

export const ManageQuestionsDialog = ({
  isOpen,
  onClose,
  cbt,
}: ManageQuestionsDialogProps) => {
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [isDeleteQuestionOpen, setIsDeleteQuestionOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [editingInlineQuestion, setEditingInlineQuestion] = useState<Question | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useCBTQuestions(cbt.id);

  const deleteQuestion = useDeleteQuestion();

  // Refetch questions when dialog opens to ensure fresh data
  useEffect(() => {
    if (isOpen && cbt.id) {
      refetchQuestions();
    }
  }, [isOpen, cbt.id, refetchQuestions]);

  const handleCreateQuestion = () => {
    setSelectedQuestion(null);
    setIsEditing(false);
    setIsAddingInline(true);
    setEditingInlineQuestion(null);
  };

  const handleEditQuestion = (question: Question) => {
    // Use inline form for editing too
    setSelectedQuestion(question);
    setIsEditing(true);
    setIsAddingInline(true);
    setEditingInlineQuestion(question);
  };

  const handleDeleteQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteQuestionOpen(true);
  };

  const handleQuestionFormSuccess = () => {
    setIsQuestionFormOpen(false);
    setIsAddingInline(false);
    setSelectedQuestion(null);
    setIsEditing(false);
    setEditingInlineQuestion(null);
    // Force refetch with fresh data
    refetchQuestions();
  };


  const handleDeleteSuccess = () => {
    setIsDeleteQuestionOpen(false);
    setSelectedQuestion(null);
    // Force refetch with fresh data (bypass cache)
    refetchQuestions({ cancelRefetch: false });
  };

  const getQuestionTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      MULTIPLE_CHOICE_SINGLE: "Multiple Choice (Single)",
      MULTIPLE_CHOICE_MULTIPLE: "Multiple Choice (Multiple)",
      TRUE_FALSE: "True/False",
      FILL_IN_BLANK: "Fill in the Blank",
      MATCHING: "Matching",
      ORDERING: "Ordering",
      FILE_UPLOAD: "File Upload",
      NUMERIC: "Numeric",
      DATE: "Date",
      RATING_SCALE: "Rating Scale",
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      EASY: "bg-green-100 text-green-700 border-green-300",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
      HARD: "bg-orange-100 text-orange-700 border-orange-300",
      EXPERT: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const handleDialogCloseAttempt = (e?: Event) => {
    // If there are unsaved changes, trigger the form's cancel handler
    // The form will show confirmation dialog and handle cleanup
    if (hasUnsavedChanges && isAddingInline) {
      e?.preventDefault();
      e?.stopPropagation();
      const cancelHandler = (window as any).__inlineFormCancelHandler;
      if (cancelHandler) {
        cancelHandler();
      }
      // Don't close the dialog - let the form handle it
      return;
    }
    onClose();
  };

  // Handle when form confirms cancel - actually close the dialog
  const handleInlineFormCancel = async () => {
    setIsAddingInline(false);
    setEditingInlineQuestion(null);
    setSelectedQuestion(null);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    
    // If there was a pending close request, close the dialog now
    if (pendingClose) {
      setPendingClose(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            // If there are unsaved changes, prevent closing and show confirmation
            if (hasUnsavedChanges && isAddingInline) {
              // Trigger the form's cancel handler which will show confirmation
              const cancelHandler = (window as any).__inlineFormCancelHandler;
              if (cancelHandler) {
                cancelHandler();
              }
              // Prevent dialog from closing by not calling onClose
              // The dialog will stay open because isOpen is still true
              return;
            }
            onClose();
          }
        }}
      >
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          onEscapeKeyDown={(e) => {
            if (hasUnsavedChanges && isAddingInline) {
              e.preventDefault();
              const cancelHandler = (window as any).__inlineFormCancelHandler;
              if (cancelHandler) {
                cancelHandler();
              }
            }
          }}
          onPointerDownOutside={(e) => {
            if (hasUnsavedChanges && isAddingInline) {
              e.preventDefault();
              const cancelHandler = (window as any).__inlineFormCancelHandler;
              if (cancelHandler) {
                cancelHandler();
              }
            }
          }}
          onInteractOutside={(e) => {
            if (hasUnsavedChanges && isAddingInline) {
              e.preventDefault();
              const cancelHandler = (window as any).__inlineFormCancelHandler;
              if (cancelHandler) {
                cancelHandler();
              }
            }
          }}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Manage Questions - {cbt.title}</DialogTitle>
                <p className="text-sm text-brand-light-accent-1 mt-1">
                  {Array.isArray(questions) ? questions.length : 0} question(s) • {cbt.totalPoints} total points
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchQuestions()}
                  disabled={isQuestionsLoading || isAddingInline}
                  title="Refresh questions"
                >
                  <RefreshCw className={`h-4 w-4 ${isQuestionsLoading ? "animate-spin" : ""}`} />
                </Button>
                {!isAddingInline && (
                  <Button onClick={handleCreateQuestion} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4">
            {isQuestionsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-primary mb-2" />
                <p className="text-sm text-brand-light-accent-1">Loading questions...</p>
              </div>
            ) : questionsError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <p className="text-sm text-brand-light-accent-1 mb-4">
                  Failed to load questions
                </p>
                <Button onClick={() => refetchQuestions()} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Existing Questions */}
                {Array.isArray(questions) && questions.length > 0 && (
                  <>
                    {questions
                      .sort((a: Question, b: Question) => a.order - b.order)
                      .map((question: Question) => (
                    <div
                      key={question.id}
                      className="bg-white border border-brand-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1">
                          <GripVertical className="h-5 w-5 text-brand-light-accent-1" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  #{question.order}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getDifficultyColor(question.difficultyLevel)}`}
                                >
                                  {question.difficultyLevel}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {getQuestionTypeLabel(question.questionType)}
                                </Badge>
                                <span className="text-sm font-medium text-brand-heading">
                                  {question.points} {question.points === 1 ? "point" : "points"}
                                </span>
                              </div>

                              <p className="text-sm text-brand-heading font-medium mb-2">
                                {question.questionText}
                              </p>

                              {question.imageUrl && (
                                <div className="mb-2">
                                  <div className="relative w-32 h-32 border border-brand-border rounded overflow-hidden">
                                    <Image
                                      src={question.imageUrl}
                                      alt="Question image"
                                      fill
                                      className="object-cover"
                                      unoptimized={question.imageUrl.includes("s3.amazonaws.com")}
                                    />
                                  </div>
                                </div>
                              )}

                              {question.questionType === "MULTIPLE_CHOICE_SINGLE" ||
                              question.questionType === "MULTIPLE_CHOICE_MULTIPLE" ||
                              question.questionType === "TRUE_FALSE" ? (
                                <div className="space-y-1 mt-2">
                                  {question.options.map((option: any) => (
                                    <div
                                      key={option.id}
                                      className={`flex items-center gap-2 text-sm p-2 rounded ${
                                        option.isCorrect
                                          ? "bg-green-50 border border-green-200"
                                          : "bg-gray-50 border border-gray-200"
                                      }`}
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full ${
                                          option.isCorrect ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                      />
                                      <span className={option.isCorrect ? "font-medium" : ""}>
                                        {option.optionText}
                                      </span>
                                      {option.isCorrect && (
                                        <Badge variant="outline" className="text-xs ml-auto">
                                          Correct
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : question.questionType === "SHORT_ANSWER" ||
                                question.questionType === "LONG_ANSWER" ? (
                                <div className="mt-2 text-sm text-brand-light-accent-1">
                                  {question.correctAnswers && question.correctAnswers.length > 0 ? (
                                    <div>
                                      <span className="font-medium">Correct answers: </span>
                                      {question.correctAnswers
                                        .map((ans: any) => ans.answerText)
                                        .filter(Boolean)
                                        .join(", ")}
                                    </div>
                                  ) : (
                                    <span>No correct answers specified</span>
                                  )}
                                </div>
                              ) : null}

                              {question.explanation && (
                                <div className="mt-2 text-xs text-brand-light-accent-1 italic">
                                  Explanation: {question.explanation}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditQuestion(question)}
                                title="Edit question"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteQuestion(question)}
                                disabled={cbt._count.attempts > 0}
                                title={
                                  cbt._count.attempts > 0
                                    ? "Cannot delete questions when CBT has attempts"
                                    : "Delete question"
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      ))}
                  </>
                )}

                {/* Inline Question Form - Appears at the bottom after last question */}
                {isAddingInline && (
                  <InlineQuestionForm
                    cbt={cbt}
                    question={editingInlineQuestion}
                    isEditing={isEditing}
                    onSuccess={handleQuestionFormSuccess}
                    onCancel={handleInlineFormCancel}
                    questionNumber={
                      !isEditing && Array.isArray(questions) && questions.length > 0
                        ? Math.max(...questions.map((q) => q.order)) + 1
                        : Array.isArray(questions) && questions.length > 0
                        ? questions.length + 1
                        : 1
                    }
                    onUnsavedChangesChange={(hasChanges) => {
                      setHasUnsavedChanges(hasChanges);
                    }}
                    onRequestCleanup={async () => {
                      // This will be called by InlineQuestionForm to set up cleanup
                    }}
                  />
                )}

                {/* Empty State - Only show if not adding and no questions */}
                {!isAddingInline && (!Array.isArray(questions) || questions.length === 0) && (
                  <div className="text-center py-12">
                    <FileQuestion className="h-12 w-12 mx-auto text-brand-light-accent-1 mb-4 opacity-50" />
                    <p className="text-brand-heading font-medium mb-2">No Questions Yet</p>
                    <p className="text-sm text-brand-light-accent-1 mb-4">
                      Add your first question to get started
                    </p>
                    <Button onClick={handleCreateQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Form Dialog */}
      <QuestionFormDialog
        isOpen={isQuestionFormOpen}
        onClose={() => {
          setIsQuestionFormOpen(false);
          setSelectedQuestion(null);
          setIsEditing(false);
        }}
        cbt={cbt}
        question={selectedQuestion}
        isEditing={isEditing}
        onSuccess={handleQuestionFormSuccess}
      />

      {/* Delete Question Dialog */}
      {selectedQuestion && (
        <DeleteQuestionDialog
          isOpen={isDeleteQuestionOpen}
          onClose={() => {
            setIsDeleteQuestionOpen(false);
            setSelectedQuestion(null);
          }}
          cbt={cbt}
          question={selectedQuestion}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
};

