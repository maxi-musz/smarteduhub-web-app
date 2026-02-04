"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Clock, FileText, CheckCircle2, Play, XCircle, Send, AlertTriangle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useSubmitAssessment,
  type ExploreExamBodyQuestion,
  type ExploreExamBodyQuestionsResponse,
} from "@/hooks/explore/use-explore-exam-bodies";
import Image from "next/image";

interface AssessmentViewerProps {
  assessment: ExploreExamBodyQuestionsResponse["assessment"];
  questions: ExploreExamBodyQuestion[];
  examBodyId: string;
  assessmentId: string;
}

export const AssessmentViewer = ({
  assessment,
  questions,
  examBodyId,
  assessmentId,
}: AssessmentViewerProps) => {
  const router = useRouter();
  const [isExamMode, setIsExamMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<
    Record<string, string | string[] | null>
  >({});
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showExamSetupDialog, setShowExamSetupDialog] = useState(false);
  const [examMinutesInput, setExamMinutesInput] = useState<string>("");
  const [examDurationSeconds, setExamDurationSeconds] = useState<number | null>(
    null
  );
  const [showForceSubmitDialog, setShowForceSubmitDialog] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(10);
  const autoSubmitIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimeUpFiredRef = useRef(false);
  const [showCancelExamDialog, setShowCancelExamDialog] = useState(false);
  const hasAutoSubmitStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const submitMutation = useSubmitAssessment(examBodyId, assessmentId);

  const questionsPerPage = 10;
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const paginatedQuestions = questions.slice(startIndex, endIndex);

  const formatAnswersForSubmission = useCallback(() => {
    return questions.map((question) => {
      const answer = answers[question.id];
      const response: {
        questionId: string;
        selectedOptions?: string[];
        textAnswer?: string;
        numericAnswer?: number;
        dateAnswer?: string;
        timeSpent?: number;
      } = {
        questionId: question.id,
      };

      if (question.options && question.options.length > 0) {
        // Multiple choice
        if (Array.isArray(answer)) {
          response.selectedOptions = answer;
        } else if (answer) {
          response.selectedOptions = [answer as string];
        }
      } else {
        // Text/numeric/date answer
        if (typeof answer === "string") {
          // Check if it's a date string
          if (question.questionType === "DATE") {
            response.dateAnswer = answer;
          } else if (question.questionType === "NUMERIC") {
            const num = Number(answer);
            if (!Number.isNaN(num)) {
              response.numericAnswer = num;
            } else {
              response.textAnswer = answer;
            }
          } else {
            response.textAnswer = answer;
          }
        } else if (typeof answer === "number") {
          response.numericAnswer = answer;
        }
      }

      return response;
    });
  }, [questions, answers]);

  const timeRemaining = useMemo(() => {
    if (!examDurationSeconds || !isExamMode) return null;
    const remaining = examDurationSeconds - elapsedTime;
    if (remaining <= 0) return 0;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return { minutes, seconds, total: remaining };
  }, [examDurationSeconds, elapsedTime, isExamMode]);

  const handleSubmit = useCallback(async () => {
    if (!isExamMode) return;
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    const responses = formatAnswersForSubmission();
    const totalTimeSpent = elapsedTime;

    try {
      const result = await submitMutation.mutateAsync({
        responses,
        timeSpent: totalTimeSpent,
      });

      // Navigate to results page
      router.push(
        `/explore/exam-bodies/${examBodyId}/assessments/${assessmentId}/attempts/${result.attempt.id}`
      );
    } catch {
      // Error is handled by the mutation's onError
      // Reset the flag so user can retry on error
      hasSubmittedRef.current = false;
    }
  }, [
    isExamMode,
    formatAnswersForSubmission,
    elapsedTime,
    submitMutation,
    router,
    examBodyId,
    assessmentId,
  ]);

  // Timer logic
  useEffect(() => {
    if (isExamMode && examDurationSeconds && !startTime) {
      const now = Date.now();
      setStartTime(now);
      setElapsedTime(0);
    }

    if (isExamMode && examDurationSeconds && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(() => {
          const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
          const durationSeconds = examDurationSeconds!;

          if (totalSeconds >= durationSeconds) {
            if (!hasTimeUpFiredRef.current) {
              hasTimeUpFiredRef.current = true;
              setShowForceSubmitDialog(true);
              setAutoSubmitCountdown(10);
            }

            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            return durationSeconds;
          }

          return totalSeconds;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (!isExamMode) {
        setElapsedTime(0);
        setStartTime(null);
        hasTimeUpFiredRef.current = false;
      }
    }
  }, [isExamMode, examDurationSeconds, startTime]);

  // Auto-submit countdown when time is up
  useEffect(() => {
    if (showForceSubmitDialog && !hasAutoSubmitStartedRef.current) {
      hasAutoSubmitStartedRef.current = true;
      setAutoSubmitCountdown(10);

      if (autoSubmitIntervalRef.current) {
        clearInterval(autoSubmitIntervalRef.current);
      }

      autoSubmitIntervalRef.current = setInterval(() => {
        setAutoSubmitCountdown((prev) => {
          if (prev <= 1) {
            if (autoSubmitIntervalRef.current) {
              clearInterval(autoSubmitIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (!showForceSubmitDialog) {
      hasAutoSubmitStartedRef.current = false;
      if (autoSubmitIntervalRef.current) {
        clearInterval(autoSubmitIntervalRef.current);
      }
    }

    return () => {
      if (autoSubmitIntervalRef.current) {
        clearInterval(autoSubmitIntervalRef.current);
      }
    };
  }, [showForceSubmitDialog]);

  // Auto-submit when countdown reaches 0
  useEffect(() => {
    if (showForceSubmitDialog && autoSubmitCountdown === 0) {
      handleSubmit();
    }
  }, [showForceSubmitDialog, autoSubmitCountdown, handleSubmit]);

  const handleAnswerChange = (
    questionId: string,
    value: string | string[] | null
  ) => {
    if (!isExamMode) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const getAnswerForQuestion = (questionId: string) => {
    return answers[questionId] || null;
  };

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter(
      (key) => answers[key] !== null && answers[key] !== ""
    ).length;
  }, [answers]);

  const handleCancelExam = useCallback(() => {
    setShowCancelExamDialog(false);
    setIsExamMode(false);
    setAnswers({});
    setElapsedTime(0);
    setStartTime(null);
    setExamDurationSeconds(null);
    hasTimeUpFiredRef.current = false;
    hasAutoSubmitStartedRef.current = false;
    hasSubmittedRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (autoSubmitIntervalRef.current) {
      clearInterval(autoSubmitIntervalRef.current);
    }
  }, []);

  return (
    <div className="px-6 space-y-6">
      {/* Large Countdown Timer - Sticky at top during exam mode */}
      {isExamMode && timeRemaining && (
        <div className="sticky top-0 z-50 -mx-6 px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  timeRemaining.total < 60
                    ? "bg-red-500/20 animate-pulse"
                    : timeRemaining.total < 300
                    ? "bg-amber-500/20"
                    : "bg-emerald-500/20"
                }`}
              >
                <Clock
                  className={`h-8 w-8 ${
                    timeRemaining.total < 60
                      ? "text-red-400"
                      : timeRemaining.total < 300
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Time Remaining
                </p>
                <div
                  className={`text-5xl font-bold font-mono tracking-tight ${
                    timeRemaining.total < 60
                      ? "text-red-400"
                      : timeRemaining.total < 300
                      ? "text-amber-400"
                      : "text-white"
                  }`}
                >
                  {String(timeRemaining.minutes).padStart(2, "0")}
                  <span className="animate-pulse">:</span>
                  {String(timeRemaining.seconds).padStart(2, "0")}
                </div>
              </div>
            </div>
            <div className="hidden sm:block h-12 w-px bg-slate-700" />
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">
                {answeredCount}/{totalQuestions} answered
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Header */}
      <Card className="border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-lg font-bold text-brand-heading">
                  {assessment.title}
                </h1>
                <Badge variant="outline" className="text-xs">
                  {totalQuestions} Questions
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-brand-light-accent-1">
                {assessment.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.floor(assessment.duration / 60)} min
                  </span>
                )}
                {assessment.maxAttempts && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {assessment.maxAttempts} attempt
                    {assessment.maxAttempts !== 1 ? "s" : ""}
                  </span>
                )}
                {isExamMode && (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {answeredCount}/{totalQuestions} answered
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isExamMode && (
                <>
                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    size="sm"
                    disabled={submitMutation.isPending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                  <Button
                    onClick={() => setShowCancelExamDialog(true)}
                    variant="destructive"
                    size="sm"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Exam Attempt
                  </Button>
                </>
              )}
              {!isExamMode && (
                <Button
                  onClick={() => {
                    const suggestedMinutes =
                      examDurationSeconds && examDurationSeconds > 0
                        ? Math.ceil(examDurationSeconds / 60)
                        : assessment.duration
                        ? Math.max(1, Math.floor(assessment.duration / 60))
                        : 30;
                    setExamMinutesInput(String(suggestedMinutes));
                    setShowExamSetupDialog(true);
                  }}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Take Exam
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List - 10 per page */}
      <div className="space-y-2.5">
        {paginatedQuestions.map((question, index) => {
          const questionNumber = startIndex + index + 1;
          const currentAnswer = getAnswerForQuestion(question.id);
          const isAnswered = currentAnswer !== null && currentAnswer !== "";

          return (
            <Card key={question.id} className="border-brand-border">
              <CardContent className="p-3">
                <div className="space-y-2">
                  {/* Question Header - Compact */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="h-8 w-8 rounded bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-brand-primary">
                          {questionNumber}
                        </span>
                      </div>
                      <p className="font-medium text-brand-heading text-sm leading-snug flex-1 min-w-0">
                        {question.questionText}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                        {question.questionType.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-[10px] text-brand-light-accent-1 whitespace-nowrap">
                        {question.points}pt
                      </span>
                      {isExamMode && isAnswered && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-[10px] px-1.5 py-0.5">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Question Image - Compact */}
                  {question.imageUrl &&
                    !imageErrors.has(`question-${question.id}`) && (
                      <div className="rounded overflow-hidden border border-brand-border">
                        <Image
                          src={question.imageUrl}
                          alt="Question image"
                          width={600}
                          height={300}
                          className="w-full h-auto max-h-48 object-contain"
                          unoptimized={question.imageUrl.includes(
                            "s3.amazonaws.com"
                          )}
                          onError={() => {
                            setImageErrors((prev) =>
                              new Set(prev).add(`question-${question.id}`)
                            );
                          }}
                        />
                      </div>
                    )}

                  {/* Options - Compact */}
                  {question.options && question.options.length > 0 && (
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => {
                        const isMultiple =
                          question.questionType === "MULTIPLE_CHOICE_MULTIPLE";
                        const isSelected = isMultiple
                          ? Array.isArray(currentAnswer) &&
                            currentAnswer.includes(option.id)
                          : currentAnswer === option.id;

                        return (
                          <label
                            key={option.id}
                            className={`flex items-center gap-2 p-1.5 rounded border transition-colors ${
                              isExamMode
                                ? `cursor-pointer ${
                                    isSelected
                                      ? "border-brand-primary bg-brand-primary/5"
                                      : "border-brand-border hover:border-brand-primary/50"
                                  }`
                                : "border-brand-border bg-gray-50/50 cursor-default"
                            }`}
                          >
                            <input
                              type={isMultiple ? "checkbox" : "radio"}
                              name={`question-${question.id}`}
                              checked={isSelected}
                              onChange={() => {
                                if (isMultiple) {
                                  const current = Array.isArray(currentAnswer)
                                    ? currentAnswer
                                    : [];
                                  const newAnswer = isSelected
                                    ? current.filter((id) => id !== option.id)
                                    : [...current, option.id];
                                  handleAnswerChange(
                                    question.id,
                                    newAnswer.length > 0 ? newAnswer : null
                                  );
                                } else {
                                  handleAnswerChange(
                                    question.id,
                                    isSelected ? null : option.id
                                  );
                                }
                              }}
                              disabled={!isExamMode}
                              className={`h-3.5 w-3.5 flex-shrink-0 ${
                                isExamMode
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-50"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-brand-heading">
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>{" "}
                                {option.optionText}
                              </span>
                              {option.imageUrl &&
                                !imageErrors.has(`option-${option.id}`) && (
                                  <div className="mt-1 rounded overflow-hidden border border-brand-border">
                                    <Image
                                      src={option.imageUrl}
                                      alt="Option image"
                                      width={300}
                                      height={150}
                                      className="w-full h-auto max-h-24 object-contain"
                                      unoptimized={option.imageUrl.includes(
                                        "s3.amazonaws.com"
                                      )}
                                      onError={() => {
                                        setImageErrors((prev) =>
                                          new Set(prev).add(`option-${option.id}`)
                                        );
                                      }}
                                    />
                                  </div>
                                )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Text Input for Short Answer, Long Answer, etc. */}
                  {!question.options && (
                    <div>
                      <textarea
                        value={
                          (getAnswerForQuestion(question.id) as string) || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            question.id,
                            e.target.value || null
                          )
                        }
                        disabled={!isExamMode}
                        placeholder={
                          isExamMode
                            ? "Type your answer here..."
                            : "Click 'Take Exam' to answer"
                        }
                        className={`w-full min-h-[60px] p-2 text-sm border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                          !isExamMode
                            ? "bg-gray-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-brand-border">
          <div className="text-sm text-brand-light-accent-1">
            Showing {startIndex + 1} to {Math.min(endIndex, totalQuestions)} of{" "}
            {totalQuestions} questions
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

      {/* Exam Setup Dialog */}
      <Dialog open={showExamSetupDialog} onOpenChange={setShowExamSetupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Exam Time</DialogTitle>
            <DialogDescription>
              Choose how long you want to spend on this practice exam.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm font-medium text-brand-heading flex items-center justify-between">
              Duration (minutes)
              {assessment.duration && (
                <span className="text-xs text-brand-light-accent-1">
                  Recommended:{" "}
                  {Math.max(1, Math.floor(assessment.duration / 60))} min
                </span>
              )}
            </label>
            <Input
              type="number"
              min={1}
              max={60}
              value={examMinutesInput}
              onChange={(e) => {
                const value = e.target.value;
                // Allow clearing the field
                if (value === "") {
                  setExamMinutesInput(value);
                  return;
                }
                const num = Number(value);
                if (Number.isNaN(num)) return;
                if (num > 60) {
                  setExamMinutesInput("60");
                } else if (num < 1) {
                  setExamMinutesInput("1");
                } else {
                  setExamMinutesInput(value);
                }
              }}
              placeholder="Enter duration in minutes"
            />
            <p className="text-xs text-brand-light-accent-1">
              If left empty, defaults to 30 minutes. Maximum is 60 minutes.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExamSetupDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                let minutes = Number(examMinutesInput);
                if (!Number.isFinite(minutes) || minutes <= 0) {
                  minutes = 30;
                }
                if (minutes > 60) {
                  minutes = 60;
                }
                const durationSeconds = Math.round(minutes * 60);
                setExamDurationSeconds(durationSeconds);
                setShowExamSetupDialog(false);
                setIsExamMode(true);
              }}
            >
              Start Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Up Force Submit Dialog */}
      <Dialog open={showForceSubmitDialog} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time is up</DialogTitle>
            <DialogDescription>
              Your exam time has finished. You have answered {answeredCount} out
              of {totalQuestions} questions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-brand-heading">
            <p className="mb-2">
              Please submit your attempt now. If you do not submit, your answers
              will be submitted automatically in {autoSubmitCountdown} second
              {autoSubmitCountdown === 1 ? "" : "s"}.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowForceSubmitDialog(false);
                handleSubmit();
              }}
              disabled={submitMutation.isPending}
            >
              Submit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assessment</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your assessment? You have answered{" "}
              {answeredCount} out of {totalQuestions} questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
              disabled={submitMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Assessment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Exam Confirmation Dialog */}
      <Dialog open={showCancelExamDialog} onOpenChange={setShowCancelExamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Cancel Exam Attempt
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to cancel this exam attempt?
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 px-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800 font-medium mb-1">
              Warning: This action cannot be undone
            </p>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
              <li>Your answers will not be saved</li>
              <li>This attempt will not be graded</li>
              <li>You will need to start over if you want to take the exam again</li>
            </ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowCancelExamDialog(false)}
            >
              Continue Exam
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelExam}
            >
              Yes, Cancel Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
