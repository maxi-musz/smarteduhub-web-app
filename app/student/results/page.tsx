"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, GraduationCap } from "lucide-react";
import StudentHeader from "@/components/ui/student-header";
import { AcademicResultsTable } from "@/components/student/results/AcademicResultsTable";
import {
  StudentResultsData,
  useStudentResults,
} from "@/hooks/student/use-student-results";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

// const results = [
//   {
//     id: 1,
//     subject: "Mathematics",
//     type: "Exam",
//     score: 92,
//     grade: "A",
//     date: "2024-04-15",
//     feedback: "Excellent understanding of calculus concepts.",
//   },
//   {
//     id: 2,
//     subject: "Physics",
//     type: "Test",
//     score: 85,
//     grade: "B+",
//     date: "2024-03-20",
//     feedback: "Good grasp of mechanics, needs improvement in thermodynamics.",
//   },
//   {
//     id: 3,
//     subject: "Chemistry",
//     type: "Quiz",
//     score: 95,
//     grade: "A+",
//     date: "2024-04-01",
//     feedback: "Outstanding performance in organic chemistry.",
//   },
//   {
//     id: 4,
//     subject: "Biology",
//     type: "Exam",
//     score: 88,
//     grade: "A",
//     date: "2024-04-10",
//     feedback: "Strong understanding of genetics and evolution.",
//   },
//   {
//     id: 5,
//     subject: "English",
//     type: "Test",
//     score: 78,
//     grade: "B",
//     date: "2024-03-25",
//     feedback: "Good analysis of literary texts, needs improvement in grammar.",
//   },
//   {
//     id: 6,
//     subject: "History",
//     type: "Quiz",
//     score: 82,
//     grade: "B-",
//     date: "2024-04-05",
//     feedback:
//       "Good recall of historical events, needs better critical analysis.",
//   },
//   {
//     id: 7,
//     subject: "Geography",
//     type: "Exam",
//     score: 90,
//     grade: "A-",
//     date: "2024-04-12",
//     feedback: "Excellent understanding of physical geography.",
//   },
//   {
//     id: 8,
//     subject: "Art",
//     type: "Test",
//     score: 87,
//     grade: "B+",
//     date: "2024-03-30",
//     feedback: "Creative and innovative artwork.",
//   },
//   {
//     id: 9,
//     subject: "Music",
//     type: "Quiz",
//     score: 92,
//     grade: "A",
//     date: "2024-04-08",
//     feedback: "Outstanding performance in music theory.",
//   },
//   {
//     id: 10,
//     subject: "Physical Education",
//     type: "Exam",
//     score: 85,
//     grade: "B+",
//     date: "2024-04-18",
//     feedback: "Good physical fitness and sportsmanship.",
//   },
//   {
//     id: 11,
//     subject: "Computer Science",
//     type: "Test",
//     score: 94,
//     grade: "A",
//     date: "2024-03-28",
//     feedback: "Excellent programming skills and problem-solving.",
//   },
//   {
//     id: 12,
//     subject: "Economics",
//     type: "Quiz",
//     score: 89,
//     grade: "A-",
//     date: "2024-04-03",
//     feedback: "Strong understanding of economic principles.",
//   },
// ];

// const getGradeColor = (grade: string) => {
//   if (grade.startsWith("A")) return "bg-green-100 text-green-800";
//   if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
//   if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
//   return "bg-red-100 text-red-800";
// };

const StudentResultsPage = () => {
  const queryResult = useStudentResults();
  const { data, isLoading, error } = queryResult;

  const effectiveData: StudentResultsData | undefined = useMemo(() => {
    // Type guard to ensure data is StudentResultsData
    if (
      data &&
      typeof data === "object" &&
      "current_session" in data &&
      "subjects" in data
    ) {
      return data as StudentResultsData;
    }

    if (error instanceof AuthenticatedApiError && error.response?.data) {
      const errorData = error.response.data;
      // Check if error data has the structure we expect
      if (
        errorData &&
        typeof errorData === "object" &&
        "current_session" in errorData &&
        "subjects" in errorData
      ) {
        return errorData as unknown as StudentResultsData;
      }
    }

    return undefined;
  }, [data, error]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      }
      if (error.statusCode === 403) {
        return "You don\u2019t have permission to access this data.";
      }
      return error.message;
    }

    return "An unexpected error occurred while loading results.";
  }, [error]);

  const currentSession = effectiveData?.current_session;

  const formatTerm = (term: string | undefined): string => {
    if (!term) return "—";
    return term.charAt(0).toUpperCase() + term.slice(1);
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <StudentHeader studentName="Student" studentClass="—" />

      {/* Current Session & Term badges */}
      {currentSession && (
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">
              Academic Year:
            </span>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 hover:bg-blue-100"
            >
              {currentSession.academic_year}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-900">Term:</span>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 hover:bg-purple-100"
            >
              {formatTerm(currentSession.term)}
            </Badge>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {effectiveData && effectiveData.subjects.length > 0
                ? `${Math.round(
                    effectiveData.subjects.reduce(
                      (sum, s) => sum + (s.percentage || 0),
                      0,
                    ) / effectiveData.subjects.length,
                  )}%`
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentSession
                ? `${currentSession.academic_year} - ${formatTerm(
                    currentSession.term,
                  )}`
                : "Current Session"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Academic Results Tables */}
      <AcademicResultsTable
        data={effectiveData}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default StudentResultsPage;
