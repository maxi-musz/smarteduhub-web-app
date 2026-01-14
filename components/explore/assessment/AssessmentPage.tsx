"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAssessmentDetails, useAssessmentQuestions, useSubmitAssessment, QuestionResponse } from "@/hooks/explore/use-assessment";
import { useAntiMalpractice } from "@/hooks/explore/use-anti-malpractice";
import { AssessmentRulesModal } from "@/components/explore/assessment/AssessmentRulesModal";
import { ViolationWarningModal } from "@/components/explore/assessment/ViolationWarningModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2, Clock, CheckCircle2, XCircle, ArrowLeft, ArrowRight, FileQuestion, Shield } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AssessmentPageProps {
  assessmentId: string;
  basePath: string; // e.g., "/admin", "/teacher", "/student"
}

export function AssessmentPage({ assessmentId, basePath }: AssessmentPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showRulesModal, setShowRulesModal] = useState(true);
  const [hasAcceptedRules, setHasAcceptedRules] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [lastViolation, setLastViolation] = useState<any>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, Date>>({});
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const {
    data: assessmentData,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useAssessmentDetails(assessmentId);

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useAssessmentQuestions(assessmentId, hasStarted);

  const submitAssessmentMutation = useSubmitAssessment();

  const {
    violations,
    totalViolations,
    hasExceededMax,
    isFullscreen,
    requestFullscreen,
  } = useAntiMalpractice({
    onViolation: (violation) => {
      setLastViolation(violation);
      setShowViolationModal(true);
    },
    maxViolations: 3,
    enableFullscreen: true,
    enableTabDetection: true,
    enableCopyPaste: true,
    enableContextMenu: true,
    enablePrint: true,
    enableDevTools: true,
  });

  // Track question start times
  useEffect(() => {
    if (hasStarted && questionsData) {
      const currentQuestion = questionsData.questions[currentQuestionIndex];
      if (currentQuestion) {
        setQuestionStartTimes((prev) => ({
          ...prev,
          [currentQuestion.id]: prev[currentQuestion.id] || new Date(),
        }));
      }
    }
  }, [currentQuestionIndex, hasStarted, questionsData]);

  // Request fullscreen when assessment starts
  useEffect(() => {
    if (hasStarted && !isFullscreen) {
      requestFullscreen();
    }
  }, [hasStarted, isFullscreen, requestFullscreen]);

  // Timer setup
  useEffect(() => {
    if (!hasStarted || !assessmentData) {
      setTimeRemaining(null);
      return;
    }

    const timeLimit = assessmentData.assessment.timeLimit;
    if (timeLimit > 0) {
      setTimeRemaining(timeLimit);
      startTimeRef.current = new Date();

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // If no time limit, set to null but don't show timer
      setTimeRemaining(null);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [hasStarted, assessmentData]);

  // Auto-disqualify on max violations
  useEffect(() => {
    if (hasExceededMax && hasStarted) {
      handleDisqualification();
    }
  }, [hasExceededMax, hasStarted]);

  const handleTimeUp = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    // Auto-submit or show time up message
    alert("Time is up! Your assessment will be submitted automatically.");
  };

  const handleDisqualification = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    alert("You have been disqualified due to multiple violations. Your assessment has been terminated.");
    router.push(`${basePath}/explore`);
  };

  const handleAcceptRules = () => {
    setHasAcceptedRules(true);
    setShowRulesModal(false);
  };

  const handleStartAssessment = async () => {
    await requestFullscreen();
    // Initialize timer value immediately when starting (useEffect will start the interval)
    if (assessmentData && assessmentData.assessment.timeLimit > 0) {
      setTimeRemaining(assessmentData.assessment.timeLimit);
      startTimeRef.current = new Date();
    }
    setHasStarted(true);
  };

  const handleViolationContinue = () => {
    setShowViolationModal(false);
  };

  const handleViolationExit = () => {
    setShowExitConfirm(true);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Show loading state only when actually loading
  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-light-accent-1">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (detailsError) {
    let errorMessage = "An error occurred while loading the assessment.";
    if (detailsError instanceof AuthenticatedApiError) {
      // Prioritize the backend's specific error message
      if (detailsError.message && detailsError.message !== `Request failed with status ${detailsError.statusCode}`) {
        errorMessage = detailsError.message;
      } else if (detailsError.response?.message) {
        errorMessage = detailsError.response.message;
      } else if (detailsError.response?.error) {
        errorMessage = detailsError.response.error;
      } else {
        // Fallback to generic messages only if no specific message is available
      if (detailsError.statusCode === 401) {
        errorMessage = "Please login to take assessments.";
      } else if (detailsError.statusCode === 403) {
        errorMessage = "You don't have permission to take this assessment or no attempts remaining.";
      } else if (detailsError.statusCode === 404) {
        errorMessage = "Assessment not found or not available.";
      } else {
        errorMessage = detailsError.message || errorMessage;
        }
      }
    }

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-heading mb-2">
                Error Loading Assessment
              </h3>
              <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessmentData) return null;

  const assessment = assessmentData.assessment;
  const canTake = assessmentData.userProgress.canTakeAssessment;

  // Debug: Log timeLimit to console
  if (hasStarted) {
    console.log("Assessment timeLimit:", assessment.timeLimit, "timeRemaining:", timeRemaining);
  }

  if (!canTake) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-heading mb-2">
                No Attempts Remaining
              </h3>
              <p className="text-brand-light-accent-1 mb-4">
                You have used all {assessment.maxAttempts} attempt{assessment.maxAttempts > 1 ? "s" : ""} for this assessment.
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show rules modal
  if (showRulesModal && !hasAcceptedRules) {
    return (
      <AssessmentRulesModal
        isOpen={showRulesModal}
        assessment={assessment}
        onAccept={handleAcceptRules}
        onDecline={() => router.back()}
      />
    );
  }

  // Show start screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <FileQuestion className="h-10 w-10 text-brand-primary" />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-brand-heading mb-2">
                  {assessment.title}
                </h1>
                {assessment.description && (
                  <p className="text-brand-light-accent-1">{assessment.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-brand-light-accent-1">Questions</p>
                  <p className="text-2xl font-bold text-brand-heading">{assessment.questionsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-light-accent-1">Duration</p>
                  <p className="text-2xl font-bold text-brand-heading">{assessment.duration} min</p>
                </div>
                <div>
                  <p className="text-sm text-brand-light-accent-1">Points</p>
                  <p className="text-2xl font-bold text-brand-heading">{assessment.totalPoints}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-light-accent-1">Passing Score</p>
                  <p className="text-2xl font-bold text-brand-heading">{assessment.passingScore}%</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleStartAssessment}
                  size="lg"
                  className="w-full"
                >
                  Start Assessment
                </Button>
                <p className="text-xs text-brand-light-accent-1 mt-3">
                  You will enter fullscreen mode and the assessment will begin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading questions
  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-light-accent-1">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questionsError || !questionsData) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-heading mb-2">
                Error Loading Questions
              </h3>
              <p className="text-brand-light-accent-1 mb-4">
                Failed to load assessment questions. Please try again.
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show submission results
  if (submissionResult) {
    const { results, attempt, feedback } = submissionResult;
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  results.passed ? "bg-green-100" : "bg-red-100"
                }`}>
                  {results.passed ? (
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-brand-heading mb-2">
                  {assessmentData?.assessment.title}
                </h1>
                <p className={`text-2xl font-bold ${
                  results.passed ? "text-green-600" : "text-red-600"
                }`}>
                  {results.passed ? "Passed!" : "Not Passed"}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-brand-light-accent-1">Score</p>
                  <p className="text-2xl font-bold text-brand-heading">
                    {results.totalScore}/{results.maxScore}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-light-accent-1">Percentage</p>
                  <p className="text-2xl font-bold text-brand-heading">
                    {results.percentage}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-light-accent-1">Grade</p>
                  <p className="text-2xl font-bold text-brand-heading">
                    {results.grade}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-light-accent-1">Correct</p>
                  <p className="text-2xl font-bold text-brand-heading">
                    {results.correctAnswers}/{results.totalQuestions}
                  </p>
                </div>
              </div>

              {feedback && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-brand-heading font-medium">{feedback.message}</p>
                  {feedback.attemptsRemaining !== undefined && (
                    <p className="text-sm text-brand-light-accent-1 mt-1">
                      Attempts remaining: {feedback.attemptsRemaining}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => {
                    // Navigate back to subject page if we have subjectId
                    const subjectId = assessmentData?.assessment.subject.id;
                    if (subjectId) {
                      router.push(`${basePath}/explore/subjects/${subjectId}`);
                    } else {
                      router.push(`${basePath}/explore`);
                    }
                  }}
                  className="w-full"
                >
                  Back to Subject
                </Button>
                {feedback && feedback.attemptsRemaining > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmissionResult(null);
                      setHasStarted(false);
                      setHasAcceptedRules(false);
                      setShowRulesModal(true);
                      setAnswers({});
                      setCurrentQuestionIndex(0);
                      setQuestionStartTimes({});
                    }}
                    className="w-full"
                  >
                    Take Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = questionsData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!questionsData || !assessmentData) return;

    setIsSubmitting(true);
    
    try {
      // Calculate total time spent
      const totalTimeSpent = startTimeRef.current
        ? Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000)
        : 0;

      // Format responses based on question type
      const responses: QuestionResponse[] = questionsData.questions.map((question) => {
        const answer = answers[question.id];
        const startTime = questionStartTimes[question.id];
        const timeSpent = startTime
          ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
          : 0;

        const response: QuestionResponse = {
          questionId: question.id,
          timeSpent,
        };

        // Format answer based on question type
        switch (question.questionType) {
          case "MULTIPLE_CHOICE_SINGLE":
            if (answer) {
              response.selectedOptions = [answer];
            }
            break;
          case "MULTIPLE_CHOICE_MULTIPLE":
            if (Array.isArray(answer)) {
              response.selectedOptions = answer;
            }
            break;
          case "SHORT_ANSWER":
          case "LONG_ANSWER":
          case "FILL_IN_BLANK":
            if (answer) {
              response.textAnswer = String(answer);
            }
            break;
          case "NUMERIC":
            if (answer !== undefined && answer !== null && answer !== "") {
              response.numericAnswer = Number(answer);
            }
            break;
          case "TRUE_FALSE":
            if (answer !== undefined && answer !== null) {
              response.textAnswer = String(answer);
            }
            break;
          case "DATE":
            if (answer) {
              response.dateAnswer = answer;
            }
            break;
          case "FILE_UPLOAD":
            if (Array.isArray(answer)) {
              response.fileUrls = answer;
            }
            break;
        }

        return response;
      });

      // Submit assessment
      const result = await submitAssessmentMutation.mutateAsync({
        assessmentId,
        data: {
          responses,
          timeSpent: totalTimeSpent,
        },
      });

      setSubmissionResult(result);
      setIsSubmitting(false);

      // Stop timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      // Invalidate and refetch the topics query to update submissions
      // Get subjectId from assessment data
      const subjectId = assessmentData?.assessment.subject.id;
      if (subjectId) {
        // Invalidate the query cache for this subject's topics
        queryClient.invalidateQueries({
          queryKey: ["explore", "topics", subjectId],
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Failed to submit assessment:", error);
      alert(
        error instanceof AuthenticatedApiError
          ? error.message
          : "Failed to submit assessment. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header with Timer and Violation Count */}
      <div className="bg-white border-b-2 border-red-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-brand-heading">
                {assessment.title}
              </h1>
              {!isFullscreen && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Fullscreen Required
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-6">
              {/* Timer - Show in header bar on the right, before question count */}
              {assessment.timeLimit > 0 && (
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="font-mono text-lg font-bold text-orange-600">
                    {timeRemaining !== null && timeRemaining !== undefined 
                      ? formatTime(timeRemaining) 
                      : formatTime(assessment.timeLimit)}
                  </span>
                </div>
              )}
              {totalViolations > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Violations: {totalViolations}/3
                </Badge>
              )}
              <div className="text-sm text-brand-light-accent-1">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentQuestion && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
                    <Badge variant="outline">{currentQuestion.points} points</Badge>
                    {currentQuestion.isRequired && (
                      <Badge variant="destructive">Required</Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-brand-heading mb-4">
                    {currentQuestion.questionText}
                  </h2>
                </div>
              </div>

              {/* Question Image/Media */}
              {currentQuestion.imageUrl && (
                <div className="mb-4">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question"
                    className="max-w-full rounded-lg border"
                  />
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.questionType === "MULTIPLE_CHOICE_SINGLE" && (
                  currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.id}
                        checked={answers[currentQuestion.id] === option.id}
                        onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                        className="h-4 w-4 text-brand-primary"
                      />
                      <span className="flex-1">{option.optionText}</span>
                    </label>
                  ))
                )}

                {currentQuestion.questionType === "MULTIPLE_CHOICE_MULTIPLE" && (
                  currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(answers[currentQuestion.id] || []).includes(option.id)}
                        onChange={(e) => {
                          const currentAnswers = answers[currentQuestion.id] || [];
                          if (e.target.checked) {
                            handleAnswerChange(currentQuestion.id, [...currentAnswers, option.id]);
                          } else {
                            handleAnswerChange(
                              currentQuestion.id,
                              currentAnswers.filter((id: string) => id !== option.id)
                            );
                          }
                        }}
                        className="h-4 w-4 text-brand-primary rounded"
                      />
                      <span className="flex-1">{option.optionText}</span>
                    </label>
                  ))
                )}

                {currentQuestion.questionType === "SHORT_ANSWER" && (
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter your answer"
                  />
                )}

                {currentQuestion.questionType === "LONG_ANSWER" && (
                  <textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary min-h-[150px]"
                    placeholder="Enter your answer"
                  />
                )}

                {currentQuestion.questionType === "TRUE_FALSE" && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value="true"
                        checked={answers[currentQuestion.id] === "true"}
                        onChange={() => handleAnswerChange(currentQuestion.id, "true")}
                        className="h-4 w-4 text-brand-primary"
                      />
                      <span className="flex-1">True</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value="false"
                        checked={answers[currentQuestion.id] === "false"}
                        onChange={() => handleAnswerChange(currentQuestion.id, "false")}
                        className="h-4 w-4 text-brand-primary"
                      />
                      <span className="flex-1">False</span>
                    </label>
                  </div>
                )}

                {currentQuestion.questionType === "NUMERIC" && (
                  <input
                    type="number"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter a number"
                    min={currentQuestion.minValue || undefined}
                    max={currentQuestion.maxValue || undefined}
                  />
                )}
              </div>

              {/* Hint */}
              {currentQuestion.showHint && currentQuestion.hintText && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Hint:</strong> {currentQuestion.hintText}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-brand-primary text-white"
                    : answers[questions[index].id]
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit Assessment
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Violation Warning Modal */}
      <ViolationWarningModal
        isOpen={showViolationModal}
        violation={lastViolation}
        violationCount={totalViolations}
        maxViolations={3}
        onContinue={handleViolationContinue}
        onExit={handleViolationExit}
      />

      {/* Exit Confirmation */}
      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Exit Assessment?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-brand-light-accent-1 mb-4">
              Are you sure you want to exit? Your progress will be saved, but you may lose your current attempt.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => router.push(`${basePath}/explore`)}
                variant="destructive"
                className="flex-1"
              >
                Exit Assessment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

