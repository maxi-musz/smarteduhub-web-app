"use client";

import { useState, useMemo, useEffect } from "react";
import { useAttendanceSessionDetails, useAttendanceForDate } from "@/hooks/teacher/use-teacher-data";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { CheckCircle2 } from "lucide-react";
import {
  AttendanceHeader,
  ClassSelector,
  DateSelector,
  AttendanceStats,
  StudentAttendanceList,
} from "./attendance-components";

const AdminAttendancePage = () => {
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

  // Get attendance data for the selected date and class to show status banner
  const { data: attendanceData } = useAttendanceForDate(selectedClassId, selectedDate);

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

  // Adjust selected date only once when session data loads, defaulting to today
  useEffect(() => {
    if (sessionData?.academic_sessions && !isLoadingSession) {
      const currentSession = sessionData.academic_sessions.find((s) => s.is_current);
      if (currentSession) {
        const termStart = new Date(currentSession.term_start_date);
        const termEnd = new Date(currentSession.term_end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare dates only
        
        // Check if today is within term range
        const todayInTerm = today >= termStart && today <= termEnd;
        
        // Only adjust if the current selected date is outside term AND we haven't initialized yet
        // Default behavior: always try to use today if it's in term, otherwise use closest valid date
        const currentSelected = new Date(selectedDate);
        currentSelected.setHours(0, 0, 0, 0);
        
        // If today is in term, use today (this is the default we want)
        if (todayInTerm) {
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          const todayStr = `${year}-${month}-${day}`;
          
          // Only update if current date is not today
          if (selectedDate !== todayStr) {
            setSelectedDate(todayStr);
          }
        } else if (currentSelected < termStart || currentSelected > termEnd) {
          // If selected date is outside term range, adjust to closest valid date
          // Prefer term end if today is after term, term start if today is before term
          let newDate: Date;
          if (today > termEnd) {
            newDate = termEnd;
          } else {
            newDate = termStart;
          }

          const year = newDate.getFullYear();
          const month = String(newDate.getMonth() + 1).padStart(2, "0");
          const day = String(newDate.getDate()).padStart(2, "0");
          setSelectedDate(`${year}-${month}-${day}`);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData, isLoadingSession]); // Only run when session data loads, not on every date change

  // Format date for display
  const formattedDate = useMemo(() => {
    if (!selectedDate) return "";
    const dateObj = new Date(selectedDate);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dayName = days[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
            ? "rd"
            : "th";
    return `${dayName}, ${day}${suffix} ${month}`;
  }, [selectedDate]);

  const hasExistingAttendance = attendanceData?.is_marked || !!attendanceData?.session_id;
  const attendanceStatus = attendanceData?.attendance_status || attendanceData?.status;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <AttendanceHeader />

      {/* Attendance Status Banner at top of page */}
      {selectedClassId && hasExistingAttendance && attendanceStatus === "submitted" && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900">
                Attendance for {formattedDate} has been marked
              </p>
              {attendanceData?.submitted_at && (
                <p className="text-xs text-green-700 mt-0.5">
                  Submitted on{" "}
                  {new Date(attendanceData.submitted_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(attendanceData.submitted_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
            {attendanceData && (
              <div className="text-right">
                <div className="text-sm font-semibold text-green-900">
                  {attendanceData.present_count || 0} Present, {attendanceData.absent_count || 0} Absent
                </div>
                <div className="text-xs text-green-700">
                  {attendanceData.attendance_rate?.toFixed(1) || 0}% attendance rate
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

export default AdminAttendancePage;
