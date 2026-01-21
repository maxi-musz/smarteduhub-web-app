"use client";

import { useParams, useRouter } from "next/navigation";
import { useStudentAssessmentResults } from "@/hooks/student/use-student-assessment-results";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  Trophy,
  XCircle,
  AlertCircle,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import type { 
  Submission, 
  QuestionWithAnswer,
  AssessmentWithAnswers 
} from "@/hooks/student/use-student-assessment-results";

export default function AssessmentResultsPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const {
    data: resultsData,
    isLoading,
    error,
  } = useStudentAssessmentResults(assessmentId, true);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Failed to load assessment results"}
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!resultsData?.data) {
    return null;
  }

  const { assessment, submissions, submission_summary } = resultsData.data;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/student/assessments")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              style={{
                backgroundColor: assessment.subject.color ? assessment.subject.color + "20" : undefined,
                borderColor: assessment.subject.color || undefined,
                color: assessment.subject.color || undefined,
              }}
            >
              {assessment.subject.name}
            </Badge>
            <Badge variant="secondary">{assessment.assessment_type}</Badge>
            <Badge
              variant={
                assessment.status === "ACTIVE"
                  ? "default"
                  : assessment.status === "CLOSED"
                    ? "secondary"
                    : "outline"
              }
            >
              {assessment.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{assessment.title}</h1>
          {assessment.description && (
            <p className="text-muted-foreground">{assessment.description}</p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submission_summary.best_percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {submission_summary.best_score} / {assessment.total_points} points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submission_summary.total_submissions}</div>
            <p className="text-xs text-muted-foreground">
              {assessment.max_attempts - assessment.total_attempts} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Attempts</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submission_summary.passed_attempts}</div>
            <p className="text-xs text-muted-foreground">
              {assessment.passing_score}% passing score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.length >= 2
                ? `${(submissions[0].percentage - submissions[submissions.length - 1].percentage).toFixed(1)}%`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {submissions.length >= 2 ? "From first attempt" : "Need 2+ attempts"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attempts Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Attempts</CardTitle>
          <CardDescription>
            Review your submissions and see correct answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={submissions[0]?.submission_id} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {submissions.map((submission) => (
                <TabsTrigger
                  key={submission.submission_id}
                  value={submission.submission_id}
                  className="flex items-center gap-2"
                >
                  <span>Attempt {submission.attempt_number}</span>
                  <Badge
                    variant={submission.passed ? "default" : "destructive"}
                    className="ml-1"
                  >
                    {submission.percentage}%
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {submissions.map((submission) => (
              <TabsContent
                key={submission.submission_id}
                value={submission.submission_id}
                className="space-y-6 mt-6"
              >
                <SubmissionDetails submission={submission} assessment={assessment} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Submission Details Component
function SubmissionDetails({
  submission,
  assessment,
}: {
  submission: Submission;
  assessment: AssessmentWithAnswers;
}) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Submission Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attempt {submission.attempt_number} Summary
            </span>
            {submission.grade_letter && (
              <Badge variant="outline" className="text-lg px-4 py-1">
                Grade: {submission.grade_letter}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4" />
                Score
              </div>
              <div className="text-2xl font-bold">
                {submission.total_score} / {assessment.total_points}
              </div>
              <div className="text-sm text-muted-foreground">
                {submission.percentage}% • {submission.passed ? "Passed" : "Failed"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Questions
              </div>
              <div className="text-2xl font-bold">
                {submission.questions_correct} / {submission.total_questions}
              </div>
              <div className="text-sm text-muted-foreground">
                {submission.questions_answered} answered
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Time Spent
              </div>
              <div className="text-2xl font-bold">{formatDuration(submission.time_spent)}</div>
              <div className="text-sm text-muted-foreground">
                of {assessment.duration} minutes
              </div>
            </div>
          </div>

          {submission.overall_feedback && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Teacher Feedback</h4>
              <p className="text-sm text-muted-foreground">{submission.overall_feedback}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Submitted: {submission.submitted_at && format(new Date(submission.submitted_at), "PPp")}
            </div>
            {submission.graded_at && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Graded: {format(new Date(submission.graded_at), "PPp")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Questions & Answers</h3>
        {submission.questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} questionNumber={index + 1} />
        ))}
      </div>
    </div>
  );
}

// Question Card Component
function QuestionCard({
  question,
  questionNumber,
}: {
  question: QuestionWithAnswer;
  questionNumber: number;
}) {
  const isCorrect = question.user_answer?.is_correct ?? false;

  return (
    <Card className={isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Question {questionNumber}</Badge>
              <Badge variant="secondary">{question.question_type.replace(/_/g, " ")}</Badge>
              <Badge variant="outline">{question.points} points</Badge>
            </div>
            <CardTitle className="text-lg">{question.question_text}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.question_image && (
          <div className="rounded-lg overflow-hidden border relative w-full h-64">
            <Image
              src={question.question_image}
              alt="Question illustration"
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Multiple Choice / Checkboxes */}
        {(question.question_type === "MULTIPLE_CHOICE" ||
          question.question_type === "CHECKBOXES") &&
          question.options.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Options:</h4>
              {question.options.map((option) => {
                const isSelected = option.is_selected;
                const isCorrectOption = option.is_correct;

                return (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border-2 ${
                      isCorrectOption
                        ? "border-green-500 bg-green-50"
                        : isSelected
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{option.text}</span>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Badge variant="secondary" className="text-xs">
                            Your Answer
                          </Badge>
                        )}
                        {isCorrectOption && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {/* Fill in the blank / Short Answer */}
        {(question.question_type === "FILL_IN_BLANK" ||
          question.question_type === "SHORT_ANSWER") &&
          question.user_answer && (
            <div className="space-y-2">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Your Answer:</h4>
                <div
                  className={`p-3 rounded-lg border ${
                    isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  {question.user_answer.text_answer || "No answer provided"}
                </div>
              </div>
            </div>
          )}

        {/* Numeric Answer */}
        {question.question_type === "NUMERIC" && question.user_answer && (
          <div className="space-y-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Your Answer:</h4>
              <div
                className={`p-3 rounded-lg border ${
                  isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                {question.user_answer.numeric_answer ?? "No answer provided"}
              </div>
            </div>
          </div>
        )}

        {/* Points Earned */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm">
            <span className="font-medium">Points Earned:</span>{" "}
            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
              {question.user_answer?.points_earned ?? 0} / {question.points}
            </span>
          </div>
          {question.user_answer?.answered_at && (
            <div className="text-xs text-muted-foreground">
              Answered at {format(new Date(question.user_answer.answered_at), "p")}
            </div>
          )}
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Explanation
            </h4>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

