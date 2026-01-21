"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  ClipboardList, 
  Eye, 
  FileQuestion, 
  Clock, 
  Calendar, 
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import type { StudentAssessment } from "@/hooks/student/use-student-assessments";
import { format } from "date-fns";

interface AssessmentListProps {
  assessments: StudentAssessment[];
  isLoading: boolean;
}

export const AssessmentList = ({
  assessments,
  isLoading,
}: AssessmentListProps) => {
  const safeAssessments = Array.isArray(assessments) ? assessments : [];
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CBT":
        return "bg-indigo-100 text-indigo-800";
      case "QUIZ":
        return "bg-pink-100 text-pink-800";
      case "EXAM":
        return "bg-red-100 text-red-800";
      case "ASSIGNMENT":
        return "bg-orange-100 text-orange-800";
      case "TEST":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceBadge = (percentage: number | null | undefined, passed: boolean | null | undefined) => {
    if (percentage === null || percentage === undefined) return null;
    
    if (passed) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Passed
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Not Passed
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (safeAssessments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-500 mb-4">
            No assessments are available at the moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {safeAssessments.map((assessment) => {
        const hasAttempted = assessment.student_attempts.total_attempts > 0;
        const canAttempt = !assessment.student_attempts.has_reached_max && 
                          (assessment.status === "ACTIVE" || assessment.status === "PUBLISHED");
        const latestAttempt = assessment.student_attempts.latest_attempt;
        const bestAttempt = assessment.performance_summary.best_attempt;

        return (
          <Card key={assessment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    {assessment.subject.color && (
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: assessment.subject.color }}
                      />
                    )}
                  </div>
                  
                  {assessment.description && (
                    <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status}
                    </Badge>
                    <Badge className={getTypeColor(assessment.assessment_type)}>
                      {assessment.assessment_type}
                    </Badge>
                    <Badge variant="outline">
                      {assessment.subject.name}
                    </Badge>
                    {assessment.teacher && (
                      <Badge variant="outline" className="text-xs">
                        {assessment.teacher.name}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" />
                      <span>{assessment._count.questions} questions</span>
                    </div>
                    {assessment.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{assessment.duration} min</span>
                      </div>
                    )}
                    {assessment.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {format(new Date(assessment.due_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>

                  {/* Attempt Information */}
                  {hasAttempted && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Your Performance</span>
                        {bestAttempt && getPerformanceBadge(bestAttempt.percentage, bestAttempt.passed)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Attempts:</span>
                          <span className="ml-2 font-medium">
                            {assessment.student_attempts.total_attempts} / {assessment.max_attempts}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Remaining:</span>
                          <span className="ml-2 font-medium">
                            {assessment.student_attempts.remaining_attempts}
                          </span>
                        </div>
                        {bestAttempt && (
                          <>
                            <div>
                              <span className="text-gray-500">Best Score:</span>
                              <span className="ml-2 font-medium text-green-600">
                                {bestAttempt.total_score} / {bestAttempt.max_score || assessment.total_points}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Percentage:</span>
                              <span className="ml-2 font-medium text-green-600">
                                {bestAttempt.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {latestAttempt && latestAttempt.status === "SUBMITTED" && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>
                              Latest: {latestAttempt.total_score} points ({latestAttempt.percentage.toFixed(1)}%) 
                              - {format(new Date(latestAttempt.submitted_at), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {canAttempt && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/student/assessments/${assessment.id}/take`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {hasAttempted ? "Retry" : "Start"}
                    </Button>
                  )}
                  {hasAttempted && assessment.student_can_view_grading && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/student/assessments/${assessment.id}/results`)}
                    >
                      <Award className="h-4 w-4 mr-1" />
                      View Results
                    </Button>
                  )}
                  {!canAttempt && !hasAttempted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/student/assessments/${assessment.id}/details`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Total Points:</span>
                  <span className="ml-2 font-medium">{assessment.total_points}</span>
                </div>
                <div>
                  <span className="text-gray-500">Passing Score:</span>
                  <span className="ml-2 font-medium">{assessment.passing_score}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Max Attempts:</span>
                  <span className="ml-2 font-medium">{assessment.max_attempts}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 font-medium ${
                    assessment.student_attempts.has_reached_max 
                      ? 'text-red-600' 
                      : canAttempt 
                      ? 'text-green-600' 
                      : 'text-gray-600'
                  }`}>
                    {assessment.student_attempts.has_reached_max 
                      ? 'Max attempts reached' 
                      : canAttempt 
                      ? 'Available' 
                      : 'Not Available'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

