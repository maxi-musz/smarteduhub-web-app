"use client";

import { useParams, useRouter } from "next/navigation";
import { useAttemptResults, AttemptQuestionResponse } from "@/hooks/explore/use-assessment";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

export default function AttemptResultsPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;

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

  const renderUserAnswer = (response: AttemptQuestionResponse) => {
    if (response.userAnswer.selectedOptions.length > 0) {
      const selectedOptions = response.options.filter((opt) =>
        response.userAnswer.selectedOptions.includes(opt.id)
      );
      return (
        <div className="space-y-1">
          {selectedOptions.map((opt) => (
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

  const renderCorrectAnswer = (response: AttemptQuestionResponse) => {
    if (!response.correctAnswer) return null;

    // Check for multiple choice answers
    if (response.correctAnswer.optionIds && response.correctAnswer.optionIds.length > 0) {
      const correctOptions = response.options.filter((opt) =>
        response.correctAnswer?.optionIds.includes(opt.id)
      );
      if (correctOptions.length > 0) {
        return (
          <div className="space-y-1">
            {correctOptions.map((opt) => (
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

  const hasCorrectAnswer = (response: AttemptQuestionResponse) => {
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
      <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="font-semibold text-red-600 mb-2">Error Loading Results</p>
            <p className="text-sm text-red-700 mb-4">
              {error instanceof AuthenticatedApiError
                ? error.message
                : "Failed to load attempt results. Please try again."}
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const { attempt, assessment, summary, responses } = results;

  return (
    <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-brand-heading">{assessment.title}</h1>
        </div>

        {/* Summary Card */}
        <Card className="border-2 border-brand-primary/20 mb-6">
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
                  {typeof attempt.percentage === 'number' ? attempt.percentage.toFixed(1) : attempt.percentage}%
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
                          <div className="relative mt-2 max-w-md h-48 rounded overflow-hidden">
                            <Image
                              src={response.imageUrl}
                              alt="Question"
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              className="object-contain"
                            />
                          </div>
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
      </div>
    </div>
  );
}
