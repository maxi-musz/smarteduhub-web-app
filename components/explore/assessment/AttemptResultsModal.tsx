"use client";

import { useAttemptResults } from "@/hooks/explore/use-assessment";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

interface AttemptResultsModalProps {
  attemptId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AttemptResultsModal({ attemptId, isOpen, onClose }: AttemptResultsModalProps) {
  const {
    data: results,
    isLoading,
    error,
  } = useAttemptResults(attemptId);

  const formatTimeSpent = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderUserAnswer = (response: any) => {
    if (response.userAnswer.selectedOptions.length > 0) {
      const selectedOptions = response.options.filter((opt: any) =>
        response.userAnswer.selectedOptions.includes(opt.id)
      );
      return (
        <div className="space-y-1">
          {selectedOptions.map((opt: any) => (
            <Badge key={opt.id} variant="outline" className="mr-1">
              {opt.optionText}
            </Badge>
          ))}
        </div>
      );
    }
    if (response.userAnswer.textAnswer) {
      return <p className="text-sm text-brand-heading">{response.userAnswer.textAnswer}</p>;
    }
    if (response.userAnswer.numericAnswer !== null) {
      return <p className="text-sm text-brand-heading">{response.userAnswer.numericAnswer}</p>;
    }
    if (response.userAnswer.dateAnswer) {
      return <p className="text-sm text-brand-heading">{new Date(response.userAnswer.dateAnswer).toLocaleDateString()}</p>;
    }
    if (response.userAnswer.fileUrls.length > 0) {
      return (
        <div className="space-y-1">
          {response.userAnswer.fileUrls.map((url: string, idx: number) => (
            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline">
              File {idx + 1}
            </a>
          ))}
        </div>
      );
    }
    return <p className="text-sm text-brand-light-accent-1 italic">No answer provided</p>;
  };

  const renderCorrectAnswer = (response: any) => {
    if (!response.correctAnswer) return null;

    // Check for multiple choice answers
    if (response.correctAnswer.optionIds && response.correctAnswer.optionIds.length > 0) {
      const correctOptions = response.options.filter((opt: any) =>
        response.correctAnswer.optionIds.includes(opt.id)
      );
      if (correctOptions.length > 0) {
        return (
          <div className="space-y-1">
            {correctOptions.map((opt: any) => (
              <Badge key={opt.id} variant="default" className="mr-1 bg-green-600">
                {opt.optionText}
              </Badge>
            ))}
          </div>
        );
      }
    }
    
    // Check for text answer
    if (response.correctAnswer.text !== null && response.correctAnswer.text !== undefined && response.correctAnswer.text !== "") {
      return <p className="text-sm text-green-700 font-medium">{response.correctAnswer.text}</p>;
    }
    
    // Check for numeric answer
    if (response.correctAnswer.number !== null && response.correctAnswer.number !== undefined) {
      return <p className="text-sm text-green-700 font-medium">{response.correctAnswer.number}</p>;
    }
    
    // Check for date answer
    if (response.correctAnswer.date !== null && response.correctAnswer.date !== undefined) {
      return <p className="text-sm text-green-700 font-medium">{new Date(response.correctAnswer.date).toLocaleDateString()}</p>;
    }
    
    return null;
  };

  const hasCorrectAnswer = (response: any) => {
    if (!response.correctAnswer) {
      return false;
    }
    
    // Check if any field has a value
    if (response.correctAnswer.optionIds && Array.isArray(response.correctAnswer.optionIds) && response.correctAnswer.optionIds.length > 0) {
      return true;
    }
    if (response.correctAnswer.text !== null && response.correctAnswer.text !== undefined && response.correctAnswer.text !== "") {
      return true;
    }
    if (response.correctAnswer.number !== null && response.correctAnswer.number !== undefined) {
      return true;
    }
    if (response.correctAnswer.date !== null && response.correctAnswer.date !== undefined && response.correctAnswer.date !== "") {
      return true;
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <span className="ml-3 text-brand-heading">Loading results...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Error Loading Results</p>
              <p className="text-sm text-red-700">
                {error instanceof AuthenticatedApiError
                  ? error.message
                  : "Failed to load attempt results. Please try again."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!results) {
    return null;
  }

  const { attempt, assessment, summary, responses } = results;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{assessment.title}</DialogTitle>
        </DialogHeader>

        {/* Summary Card */}
        <Card className="border-2 border-brand-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  attempt.passed ? "bg-green-100" : "bg-red-100"
                }`}>
                  {attempt.passed ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <p className="text-xs text-brand-light-accent-1">Status</p>
                <p className="font-semibold text-brand-heading">
                  {attempt.passed ? "Passed" : "Failed"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-heading mb-1">
                  {attempt.totalScore}/{attempt.maxScore}
                </p>
                <p className="text-xs text-brand-light-accent-1">Score</p>
                <p className="text-sm font-medium text-brand-heading">
                  {attempt.percentage}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-heading mb-1">
                  {summary.correctAnswers}/{summary.totalQuestions}
                </p>
                <p className="text-xs text-brand-light-accent-1">Correct</p>
                <p className="text-sm font-medium text-brand-heading">
                  {summary.incorrectAnswers} incorrect
                </p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-brand-primary" />
                <p className="text-xs text-brand-light-accent-1">Time Spent</p>
                <p className="text-sm font-medium text-brand-heading">
                  {formatTimeSpent(attempt.timeSpent)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border">
              <div>
                <p className="text-xs text-brand-light-accent-1">Attempt #{attempt.attemptNumber}</p>
                <p className="text-xs text-brand-light-accent-1">
                  Submitted: {formatDate(attempt.submittedAt)}
                </p>
              </div>
              {attempt.grade && (
                <Badge variant="default" className="text-lg px-4 py-1">
                  Grade: {attempt.grade}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-brand-heading">Question Review</h3>
          {responses.map((response, index) => {
            // Debug: Log correctAnswer to console
            if (process.env.NODE_ENV === 'development') {
              console.log(`Question ${index + 1} correctAnswer:`, response.correctAnswer);
              console.log(`Question ${index + 1} hasCorrectAnswer:`, hasCorrectAnswer(response));
            }
            
            return (
              <Card
                key={response.questionId}
                className={`border-2 ${
                  response.isCorrect
                    ? "border-green-200 bg-green-50/30"
                    : "border-red-200 bg-red-50/30"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        response.isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-brand-heading">{response.questionText}</p>
                        {response.imageUrl && (
                          <img src={response.imageUrl} alt="Question" className="mt-2 max-w-md rounded" />
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-brand-heading">
                        {response.pointsEarned}/{response.maxPoints} pts
                      </p>
                      <p className="text-xs text-brand-light-accent-1">
                        {formatTimeSpent(response.timeSpent)}
                      </p>
                    </div>
                  </div>

                  {/* User Answer */}
                  <div className="mb-3 p-3 bg-white rounded border border-brand-border">
                    <p className="text-xs font-semibold text-brand-light-accent-1 mb-2">Your Answer:</p>
                    {renderUserAnswer(response)}
                  </div>

                  {/* Correct Answer (if shown) */}
                  {hasCorrectAnswer(response) && (
                    <div className="mb-3 p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-xs font-semibold text-green-700 mb-2">Correct Answer:</p>
                      {renderCorrectAnswer(response)}
                    </div>
                  )}

                  {/* Feedback */}
                  {response.feedback && (
                    <div className={`p-2 rounded text-sm ${
                      response.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {response.feedback}
                    </div>
                  )}

                  {/* Explanation */}
                  {response.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-900">{response.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

