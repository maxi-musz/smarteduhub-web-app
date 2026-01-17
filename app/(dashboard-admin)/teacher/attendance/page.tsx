"use client";

import { useState, useMemo, useEffect } from "react";
import { useAttendanceSessionDetails } from "@/hooks/use-teacher-data";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  AttendanceHeader,
  ClassSelector,
  DateSelector,
  AttendanceStats,
  StudentAttendanceList,
} from "./attendance-components";

const TeacherAttendancePage = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const { data: sessionData, isLoading: isLoadingSession, error: sessionError } =
    useAttendanceSessionDetails();

  const errorMessage = useMemo(() => {
    if (!sessionError) return null;

    if (sessionError instanceof AuthenticatedApiError) {
      if (sessionError.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (sessionError.statusCode === 403) {
        return "You don&apos;t have permission to access this data.";
      } else {
        return sessionError.message;
      }
    }

    return "An unexpected error occurred while loading attendance data.";
  }, [sessionError]);

  // Auto-select first class if available and none selected
  useEffect(() => {
    if (
      !selectedClassId &&
      sessionData?.classes_managing &&
      sessionData.classes_managing.length > 0
    ) {
      setSelectedClassId(sessionData.classes_managing[0].id);
    }
  }, [sessionData, selectedClassId]);

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <AttendanceHeader />

      {errorMessage && (
        <div className="text-center py-8 text-red-600">{errorMessage}</div>
      )}

      {isLoadingSession ? (
        <div className="text-center py-8 text-gray-500">Loading attendance data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ClassSelector
              classes={sessionData?.classes_managing || []}
              selectedClassId={selectedClassId}
              onClassChange={setSelectedClassId}
              isLoading={isLoadingSession}
            />

            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              academicSessions={sessionData?.academic_sessions || []}
            />
          </div>

          {selectedClassId && (
            <>
              <AttendanceStats
                classId={selectedClassId}
                date={selectedDate}
              />

              <StudentAttendanceList
                classId={selectedClassId}
                date={selectedDate}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherAttendancePage;

