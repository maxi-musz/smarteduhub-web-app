"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  useStudentAssessmentQuestions, 
  useSubmitStudentAssessment,
  QuestionAnswer,
} from "@/hooks/student/use-student-assessment-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Send,
} from "lucide-react";

interface TakeAssessmentPageProps {
  params: Promise<{ id: string }>;
}

export default function TakeAssessmentPage(props: TakeAssessmentPageProps) {
  const params = use(props.params);
  const router = useRouter();
  const assessmentId = params.id;

  const [showRulesModal, setShowRulesModal] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number | null>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, Date>>({});
  const [assessmentStartTime, setAssessmentStartTime] = useState<Date | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const handleAutoSubmitRef = useRef<(() => void) | null>(null);

  const { data: questionsData, isLoading, error } = useStudentAssessmentQuestions(
    assessmentId,
    hasStarted
  );

  const submitMutation = useSubmitStudentAssessment();

  // Track question start times
  useEffect(() => {
    if (hasStarted && questionsData) {
      const currentQuestion = questionsData.data.questions[currentQuestionIndex];
      if (currentQuestion) {
        setQuestionStartTimes((prev) => ({
          ...prev,
          [currentQuestion.id]: prev[currentQuestion.id] || new Date(),
        }));
      }
    }
  }, [currentQuestionIndex, hasStarted, questionsData]);

  // Timer setup - will be updated after handleAutoSubmit is defined
  useEffect(() => {
    if (!hasStarted || !questionsData) {
      setTimeRemaining(null);
      return;
    }

    const duration = questionsData.data.assessment.duration;
    if (duration && duration > 0) {
      setTimeRemaining(duration * 60); // Convert minutes to seconds
      
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            // Call handleAutoSubmit if it exists
            if (handleAutoSubmitRef.current) {
              handleAutoSubmitRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [hasStarted, questionsData]);

  const handleStartAssessment = () => {
    setShowRulesModal(false);
    setHasStarted(true);
    setAssessmentStartTime(new Date());
  };

  const handleAnswerChange = (questionId: string, answer: string | string[] | number | null) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (questionsData && currentQuestionIndex < questionsData.data.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateTimeSpent = useCallback((questionId: string): number => {
    const startTime = questionStartTimes[questionId];
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  }, [questionStartTimes]);

  const handleSubmit = useCallback(async () => {
    if (!questionsData || !assessmentStartTime) return;

    const submittedAt = new Date();
    const totalTimeSpent = Math.floor((submittedAt.getTime() - assessmentStartTime.getTime()) / 1000);

    const questionAnswers: QuestionAnswer[] = questionsData.data.questions.map((q) => ({
      question_id: q.id,
      answer: answers[q.id] || null,
      time_spent: calculateTimeSpent(q.id),
    }));

    try {
      const result = await submitMutation.mutateAsync({
        assessment_id: assessmentId,
        answers: questionAnswers,
        total_time_spent: totalTimeSpent,
        started_at: assessmentStartTime.toISOString(),
        submitted_at: submittedAt.toISOString(),
      });

      // Clear timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      // Show results and redirect
      router.push(`/student/assessments/${assessmentId}/result/${result.data.attempt_id}`);
    } catch {
      // Error handled by mutation
    }
  }, [questionsData, assessmentStartTime, answers, assessmentId, submitMutation, router, calculateTimeSpent]);

  const handleAutoSubmit = useCallback(() => {
    if (!questionsData) return;
    alert("Time is up! Your assessment will be submitted automatically.");
    handleSubmit();
  }, [questionsData, handleSubmit]);

  // Update ref when handleAutoSubmit changes
  useEffect(() => {
    handleAutoSubmitRef.current = handleAutoSubmit;
  }, [handleAutoSubmit]);

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    router.push("/student/assessments");
  };

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (!hasStarted || isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-red-600" />
              <h3 className="text-lg font-semibold">Error Loading Assessment</h3>
              <p className="text-sm text-gray-600">
                {error instanceof Error ? error.message : "Failed to load assessment questions"}
              </p>
              <Button onClick={() => router.push("/student/assessments")}>
                Back to Assessments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!questionsData) {
    return null;
  }

  const assessment = questionsData.data.assessment;
  const questions = questionsData.data.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Calculate answered questions
  const answeredCount = questions.filter((q) => {
    const answer = answers[q.id];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== undefined && answer !== null && answer !== "";
  }).length;

  // Rules Modal
  if (showRulesModal) {
    return (
      <Dialog open={showRulesModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment Instructions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{assessment.title}</h3>
              {assessment.description && (
                <p className="text-sm text-gray-600">{assessment.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="font-semibold">{totalQuestions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="font-semibold">{assessment.total_points}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold">
                  {assessment.duration > 0 ? `${assessment.duration} minutes` : "Unlimited"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passing Score</p>
                <p className="font-semibold">{assessment.passing_score}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Attempts Remaining</p>
                <p className="font-semibold">{assessment.remaining_attempts}</p>
              </div>
            </div>

            {assessment.instructions && (
              <div className="space-y-2">
                <h4 className="font-semibold">Instructions:</h4>
                <div className="text-sm text-gray-700 whitespace-pre-wrap bg-blue-50 p-4 rounded-lg">
                  {assessment.instructions}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold">General Rules:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Answer all questions to the best of your ability</li>
                <li>You can navigate between questions using the navigation buttons</li>
                <li>Your progress is automatically saved</li>
                {assessment.duration > 0 && (
                  <li>Make sure to submit before time runs out</li>
                )}
                <li>Once submitted, you cannot change your answers</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button variant="outline" onClick={confirmExit}>
                Cancel
              </Button>
              <Button onClick={handleStartAssessment}>
                Start Assessment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Assessment UI
  return (
    <div className="min-h-screen bg-brand-bg py-6">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header with timer */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{assessment.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {totalQuestions} • {answeredCount} answered
                </p>
              </div>
              {timeRemaining !== null && (
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${timeRemaining < 300 ? "text-red-600" : "text-gray-600"}`} />
                  <span className={`font-semibold ${timeRemaining < 300 ? "text-red-600" : ""}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    Question {currentQuestionIndex + 1}
                  </Badge>
                  <Badge variant="secondary">
                    {currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"}
                  </Badge>
                </div>
                <p className="text-lg">{currentQuestion.question_text}</p>
              </div>
            </div>

            {currentQuestion.question_image && (
              <div className="mt-4 relative w-full h-64">
                <Image
                  src={currentQuestion.question_image}
                  alt="Question image"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Multiple Choice Single */}
              {currentQuestion.question_type === "MULTIPLE_CHOICE" && (
                <RadioGroup
                  value={answers[currentQuestion.id] as string || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {/* True/False */}
              {currentQuestion.question_type === "TRUE_FALSE" && (
                <RadioGroup
                  value={answers[currentQuestion.id] as string || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {/* Fill in the Blank */}
              {currentQuestion.question_type === "FILL_IN_BLANK" && (
                <Input
                  value={answers[currentQuestion.id] as string || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full"
                />
              )}

              {/* Essay */}
              {currentQuestion.question_type === "ESSAY" && (
                <Textarea
                  value={answers[currentQuestion.id] as string || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[200px]"
                />
              )}

              {/* Numeric */}
              {currentQuestion.question_type === "NUMERIC" && (
                <Input
                  type="number"
                  value={answers[currentQuestion.id] as number || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, parseFloat(e.target.value))}
                  placeholder="Enter a number..."
                  className="w-full"
                />
              )}

              {/* Date */}
              {currentQuestion.question_type === "DATE" && (
                <Input
                  type="date"
                  value={answers[currentQuestion.id] as string || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="py-4">
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
                <Button variant="ghost" onClick={handleExit}>
                  Exit
                </Button>
                {currentQuestionIndex === totalQuestions - 1 ? (
                  <Button onClick={() => setShowSubmitConfirm(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Assessment
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, index) => {
                const isAnswered = (() => {
                  const answer = answers[q.id];
                  if (Array.isArray(answer)) return answer.length > 0;
                  return answer !== undefined && answer !== null && answer !== "";
                })();
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`
                      h-10 rounded-lg font-medium text-sm transition-colors
                      ${isCurrent 
                        ? "bg-brand-primary text-white" 
                        : isAnswered 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit? Your progress will not be saved and this will count as an attempt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Assessment</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-red-600 hover:bg-red-700">
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>You have answered {answeredCount} out of {totalQuestions} questions.</p>
                {answeredCount < totalQuestions && (
                  <p className="text-yellow-600 font-medium">
                    Warning: {totalQuestions - answeredCount} question(s) are unanswered and will be marked as incorrect.
                  </p>
                )}
                <p className="font-medium">Once submitted, you cannot change your answers.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Assessment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

