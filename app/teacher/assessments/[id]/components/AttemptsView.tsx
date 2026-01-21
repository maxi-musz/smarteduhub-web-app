"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudentSubmission, type AssessmentAttemptsResponse } from "@/hooks/teacher/use-teacher-assessments";
import { useState } from "react";
import { Users, Eye, CheckCircle, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentSubmissionModal } from "./StudentSubmissionModal";

interface AttemptsViewProps {
  assessmentId: string;
  attemptsData: AssessmentAttemptsResponse | undefined;
  isLoading: boolean;
}

export const AttemptsView = ({
  assessmentId,
  attemptsData,
  isLoading,
}: AttemptsViewProps) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { data: submissionData } = useStudentSubmission(assessmentId, selectedStudentId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-500">Loading attempts...</div>
        </CardContent>
      </Card>
    );
  }

  if (!attemptsData) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-500">No attempts data available</div>
        </CardContent>
      </Card>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { students = [], statistics, assessment: _assessment } = attemptsData;

  // Provide default values for statistics if undefined
  const safeStatistics = {
    total_students: statistics?.total_students ?? 0,
    attempted_count: statistics?.attempted_count ?? 0,
    not_attempted_count: statistics?.not_attempted_count ?? 0,
    passed_count: statistics?.passed_count ?? 0,
    failed_count: statistics?.failed_count ?? 0,
    average_score: statistics?.average_score ?? 0,
    highest_score: statistics?.highest_score ?? 0,
    lowest_score: statistics?.lowest_score ?? 0,
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{safeStatistics.total_students}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Attempted</p>
                <p className="text-2xl font-bold">{safeStatistics.attempted_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold">{safeStatistics.average_score.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Passed</p>
                <p className="text-2xl font-bold">{safeStatistics.passed_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No student attempts found
              </div>
            ) : (
              students.map((studentData) => {
              const { student, attempts, best_score, attempts_count, has_passed } = studentData;
              const studentName = `${student.user.first_name} ${student.user.last_name}`;

              return (
                <div
                  key={student.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={student.user.display_picture || undefined}
                          alt={studentName}
                        />
                        <AvatarFallback>
                          {student.user.first_name[0]}
                          {student.user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{studentName}</h4>
                        <p className="text-sm text-gray-500">{student.student_id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Attempts</p>
                        <p className="font-medium">{attempts_count}</p>
                      </div>
                      {best_score !== null && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Best Score</p>
                          <p className="font-medium">{best_score}%</p>
                        </div>
                      )}
                      <Badge
                        variant={has_passed ? "default" : "destructive"}
                        className={has_passed ? "bg-green-100 text-green-800" : ""}
                      >
                        {has_passed ? "Passed" : "Not Passed"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudentId(student.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>

                  {attempts.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Attempt History:</p>
                      <div className="space-y-2">
                        {attempts.map((attempt) => (
                          <div
                            key={attempt.id}
                            className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                          >
                            <span>Attempt {attempt.attempt_number}</span>
                            <div className="flex items-center gap-4">
                              <span>Score: {attempt.score}%</span>
                              <Badge
                                variant={attempt.is_passed ? "default" : "destructive"}
                                className={
                                  attempt.is_passed
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {attempt.is_passed ? "Passed" : "Failed"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
            )}
          </div>
        </CardContent>
      </Card>

      {selectedStudentId && submissionData && (
        <StudentSubmissionModal
          submission={submissionData}
          open={!!selectedStudentId}
          onOpenChange={(open) => !open && setSelectedStudentId(null)}
        />
      )}
    </>
  );
};


