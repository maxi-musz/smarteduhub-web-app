"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { AttemptResultsResponse } from "@/hooks/explore/use-explore-exam-bodies";
import Image from "next/image";

interface AttemptResultsViewerProps {
  results: AttemptResultsResponse;
}

export const AttemptResultsViewer = ({ results }: AttemptResultsViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const questionsPerPage = 10;
  const totalQuestions = results.questions?.length || 0;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const paginatedQuestions = (results.questions || []).slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="px-6 space-y-6">
      {/* Results Summary Header */}
      <Card className="border-brand-border bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-brand-heading mb-1">
                {results.assessment.title}
              </h1>
              <Badge variant="outline" className="text-xs">
                Attempt #{results.attempt.attemptNumber}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-heading">
                {results.results.percentage}%
              </div>
              <Badge
                variant="outline"
                className={
                  results.attempt.passed
                    ? "bg-green-50 text-green-700 border-green-300 text-xs mt-1"
                    : "bg-red-50 text-red-700 border-red-300 text-xs mt-1"
                }
              >
                {results.attempt.passed ? "Passed" : "Failed"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
            <div>
              <p className="text-brand-light-accent-1 mb-0.5">Score</p>
              <p className="font-semibold text-brand-heading">
                {results.results.totalScore}/{results.results.maxScore}
              </p>
            </div>
            <div>
              <p className="text-brand-light-accent-1 mb-0.5">Correct</p>
              <p className="font-semibold text-green-600">
                {results.results.correctAnswers}
              </p>
            </div>
            <div>
              <p className="text-brand-light-accent-1 mb-0.5">Incorrect</p>
              <p className="font-semibold text-red-600">
                {results.results.incorrectAnswers}
              </p>
            </div>
            <div>
              <p className="text-brand-light-accent-1 mb-0.5">Time Spent</p>
              <p className="font-semibold text-brand-heading">
                {formatTime(results.attempt.timeSpent)}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-brand-border">
            <div className="flex items-center gap-2 text-xs text-brand-light-accent-1">
              <Calendar className="h-3 w-3" />
              <span>Submitted: {formatDate(results.attempt.submittedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions with Answers */}
      <div className="space-y-2.5">
        {paginatedQuestions.map((question, index) => {
          const questionNumber = startIndex + index + 1;
          
          // Get user's selected answer text
          const getUserAnswerText = () => {
            if (question.userAnswer.selectedOptions && question.userAnswer.selectedOptions.length > 0) {
              const selectedOptionIds = question.userAnswer.selectedOptions;
              const selectedOptions = question.options
                .filter(opt => selectedOptionIds.includes(opt.id))
                .map(opt => opt.optionText);
              return selectedOptions.join(", ");
            }
            if (question.userAnswer.textAnswer) {
              return question.userAnswer.textAnswer;
            }
            if (question.userAnswer.numericAnswer !== null && question.userAnswer.numericAnswer !== undefined) {
              return String(question.userAnswer.numericAnswer);
            }
            if (question.userAnswer.dateAnswer) {
              return new Date(question.userAnswer.dateAnswer).toLocaleDateString();
            }
            return null;
          };

          // Get correct answer text
          const getCorrectAnswerText = () => {
            if (question.correctAnswer.optionIds && question.correctAnswer.optionIds.length > 0) {
              const correctOptions = question.options
                .filter(opt => question.correctAnswer.optionIds.includes(opt.id))
                .map(opt => opt.optionText);
              return correctOptions.join(", ");
            }
            if (question.correctAnswer.answerText) {
              return question.correctAnswer.answerText;
            }
            if (question.correctAnswer.answerNumber !== null && question.correctAnswer.answerNumber !== undefined) {
              return String(question.correctAnswer.answerNumber);
            }
            if (question.correctAnswer.answerDate) {
              return new Date(question.correctAnswer.answerDate).toLocaleDateString();
            }
            return null;
          };

          const userAnswerText = getUserAnswerText();
          const correctAnswerText = getCorrectAnswerText();

          return (
            <Card key={question.questionId} className="border-brand-border">
              <CardContent className="p-3">
                <div className="space-y-2">
                  {/* Question Header */}
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
                      {question.isCorrect ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-300 text-[10px] px-1.5 py-0"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-300 text-[10px] px-1.5 py-0"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                      <span className="text-[10px] text-brand-light-accent-1">
                        {question.pointsEarned}/{question.maxPoints} pts
                      </span>
                    </div>
                  </div>

                  {/* Question Image */}
                  {question.imageUrl && (
                    <div className="rounded overflow-hidden border border-brand-border relative w-full h-40">
                      <Image
                        src={question.imageUrl}
                        alt="Question"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Your Answer */}
                  <div
                    className={`p-2 rounded border ${
                      question.isCorrect
                        ? "border-green-500 bg-green-50/50"
                        : "border-red-500 bg-red-50/50"
                    }`}
                  >
                    <p className="text-[10px] font-medium text-brand-light-accent-1 mb-1">
                      Your Answer:
                    </p>
                    <div
                      className={`text-xs font-medium ${
                        question.isCorrect ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {userAnswerText || <span className="text-red-600">No answer provided</span>}
                    </div>
                  </div>

                  {/* Correct Answer - Only show if incorrect */}
                  {!question.isCorrect && correctAnswerText && (
                    <div className="p-2 rounded border border-green-500 bg-green-50/50">
                      <p className="text-[10px] font-medium text-green-700 mb-1">
                        Correct Answer:
                      </p>
                      <div className="text-xs font-semibold text-green-800">
                        {correctAnswerText}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="p-2 rounded border border-brand-border bg-blue-50/30">
                      <p className="text-[10px] font-medium text-brand-light-accent-1 mb-0.5">
                        Explanation:
                      </p>
                      <p className="text-xs text-brand-heading">{question.explanation}</p>
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
    </div>
  );
};
