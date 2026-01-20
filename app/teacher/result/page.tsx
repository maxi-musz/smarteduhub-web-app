"use client";

import { useMemo } from "react";
import { useResultsMainPage } from "@/hooks/teacher/use-teacher-results";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TeacherResultsPage = () => {
  // Always fetch current session results (no filters - security requirement)
  const { data, isLoading, error, refetch, isFetching } = useResultsMainPage();

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

  const classes = data?.classes ?? [];
  const currentSession = data?.current_session;

  // Format term for display (capitalize first letter)
  const formatTerm = (term: string | undefined): string => {
    if (!term) return "—";
    return term.charAt(0).toUpperCase() + term.slice(1);
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-heading">Results</h1>
          <p className="text-brand-light-accent-1 text-sm">
            View released results for your classes
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Card className="w-full md:w-auto">
          <CardContent className="pt-4 flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Session</span>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 min-w-[224px]">
                {currentSession
                  ? `${currentSession.academic_year} - ${formatTerm(currentSession.term)}`
                  : "Loading..."}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Term</span>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 min-w-[160px]">
                {currentSession ? formatTerm(currentSession.term) : "Loading..."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {errorMessage && (
        <div className="text-center py-8 text-red-600">{errorMessage}</div>
      )}

      {isLoading && !data && (
        <div className="text-center py-8 text-gray-500">Loading results...</div>
      )}

      {!isLoading && classes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No released results found for the selected session and term.
        </div>
      )}

      <div className="space-y-6">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{cls.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {cls.total_students} students \u2022 {cls.subjects.length} subjects
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {cls.students.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No released results yet for this class.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Student</th>
                        <th className="py-2 pr-4">Overall %</th>
                        <th className="py-2 pr-4">Grade</th>
                        <th className="py-2 pr-4">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cls.students.map((student) => (
                        <tr key={student.student_id} className="border-b last:border-0">
                          <td className="py-2 pr-4">
                            <div className="flex flex-col">
                              <span className="font-medium">{student.student_name}</span>
                              <span className="text-xs text-gray-500">
                                {student.roll_number}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 pr-4">
                            {student.overall_percentage !== null
                              ? `${student.overall_percentage.toFixed(2)}%`
                              : "Not released"}
                          </td>
                          <td className="py-2 pr-4">
                            {student.overall_grade ?? "—"}
                          </td>
                          <td className="py-2 pr-4">
                            {student.class_position !== null
                              ? `${student.class_position}/${student.total_students}`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherResultsPage;


