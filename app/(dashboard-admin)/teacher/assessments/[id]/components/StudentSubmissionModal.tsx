"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type StudentSubmissionResponse } from "@/hooks/use-teacher-assessments";
import { CheckCircle, XCircle } from "lucide-react";

interface StudentSubmissionModalProps {
  submission: StudentSubmissionResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StudentSubmissionModal = ({
  submission,
  open,
  onOpenChange,
}: StudentSubmissionModalProps) => {
  const { student, attempts, best_attempt } = submission;
  const studentName = `${student.user.first_name} ${student.user.last_name}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Submission: {studentName} ({student.student_id})
          </DialogTitle>
          <DialogDescription>
            View detailed submission and responses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {best_attempt && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Best Attempt</p>
              <p className="text-lg font-bold text-blue-800">
                Attempt {best_attempt.attempt_number}: {best_attempt.score}% ({best_attempt.percentage}%)
              </p>
            </div>
          )}

          {attempts.map((attempt) => (
            <div key={attempt.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Attempt {attempt.attempt_number}</h4>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(attempt.submitted_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="text-xl font-bold">{attempt.score}%</p>
                  </div>
                  <Badge
                    variant={attempt.is_passed ? "default" : "destructive"}
                    className={
                      attempt.is_passed ? "bg-green-100 text-green-800" : ""
                    }
                  >
                    {attempt.is_passed ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {attempt.is_passed ? "Passed" : "Failed"}
                  </Badge>
                </div>
              </div>

              {attempt.responses && attempt.responses.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <p className="font-medium">Responses:</p>
                  {attempt.responses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-3 rounded-lg border ${
                        response.is_correct
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{response.question_text}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {response.points_awarded}/{response.question_points} pts
                          </span>
                          {response.is_correct ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Answer:</span>{" "}
                          {response.answer_text || "N/A"}
                        </p>
                        {response.feedback && (
                          <p className="mt-1 text-gray-700">
                            <span className="font-medium">Feedback:</span> {response.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};


