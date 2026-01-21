"use client";

import { useState, useMemo, useEffect } from "react";
import { useStudentAttendance } from "@/hooks/student/use-student-attendance";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  CalendarCheck,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentAttendancePage = () => {
  // Default to today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Extract year and month from selected date for API call
  const selectedYear = useMemo(() => {
    return new Date(selectedDate).getFullYear();
  }, [selectedDate]);

  const selectedMonth = useMemo(() => {
    return new Date(selectedDate).getMonth() + 1;
  }, [selectedDate]);

  const { data, isLoading, error } = useStudentAttendance({
    year: selectedYear,
    month: selectedMonth,
  });

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      }
      if (error.statusCode === 403) {
        return "You don&apos;t have permission to access this data.";
      }
      return error.message;
    }

    return "An unexpected error occurred while loading attendance.";
  }, [error]);

  // Get current session
  const currentSession = data?.academic_sessions?.find(
    (s) => s.is_current,
  );

  // Adjust selected date to be within current term if needed
  useEffect(() => {
    if (data?.academic_sessions && !isLoading) {
      const currentSession = data.academic_sessions.find((s) => s.is_current);
      if (currentSession) {
        const termStart = new Date(currentSession.start_date);
        const termEnd = new Date(currentSession.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentSelected = new Date(selectedDate);
        currentSelected.setHours(0, 0, 0, 0);

        // If today is in term, use today (default)
        const todayInTerm = today >= termStart && today <= termEnd;
        if (todayInTerm) {
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          const todayStr = `${year}-${month}-${day}`;

          if (selectedDate !== todayStr) {
            setSelectedDate(todayStr);
          }
        } else if (currentSelected < termStart || currentSelected > termEnd) {
          // If selected date is outside term range, adjust to closest valid date
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
  }, [data?.academic_sessions, isLoading]);

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

  // Check if attendance for selected date has been marked
  const selectedDateRecord = useMemo(() => {
    if (!data?.records) return null;
    return data.records.find((record) => record.date === selectedDate);
  }, [data?.records, selectedDate]);

  const hasAttendanceForDate = selectedDateRecord && 
    selectedDateRecord.status !== "WEEKEND" && 
    selectedDateRecord.status !== "HOLIDAY";

  // Format session text with proper capitalization
  const formatSessionText = (text: string): string => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get date restrictions from current session
  const getDateRestrictions = () => {
    if (currentSession) {
      // Extract date part (YYYY-MM-DD) from ISO string or use as-is if already in YYYY-MM-DD format
      const startDate = currentSession.start_date.includes("T")
        ? currentSession.start_date.split("T")[0]
        : currentSession.start_date;
      const endDate = currentSession.end_date.includes("T")
        ? currentSession.end_date.split("T")[0]
        : currentSession.end_date;
      return {
        min: startDate,
        max: endDate,
      };
    }
    // Default to current year if no session
    const currentYear = new Date().getFullYear();
    return {
      min: `${currentYear}-01-01`,
      max: `${currentYear}-12-31`,
    };
  };

  const { min, max } = getDateRestrictions();

  // Calculate attendance rate
  const monthlyAttendanceRate = useMemo(() => {
    if (!data?.summary) return 0;
    const { totalSchoolDaysThisMonth, totalPresentThisMonth } = data.summary;
    if (totalSchoolDaysThisMonth === 0) return 0;
    return Math.round((totalPresentThisMonth / totalSchoolDaysThisMonth) * 100);
  }, [data?.summary]);

  const termAttendanceRate = useMemo(() => {
    if (!data?.summary) return 0;
    const { totalSchoolDaysThisTerm, totalPresentThisTerm } = data.summary;
    if (totalSchoolDaysThisTerm === 0) return 0;
    return Math.round((totalPresentThisTerm / totalSchoolDaysThisTerm) * 100);
  }, [data?.summary]);

  // Get status badge variant and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PRESENT":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle2,
          label: "Present",
        };
      case "ABSENT":
        return {
          variant: "default" as const,
          className: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
          label: "Absent",
        };
      case "LATE":
        return {
          variant: "default" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
          label: "Late",
        };
      case "EXCUSED":
        return {
          variant: "default" as const,
          className: "bg-purple-100 text-purple-800 border-purple-200",
          icon: AlertCircle,
          label: "Excused",
        };
      case "PARTIAL":
        return {
          variant: "default" as const,
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Clock,
          label: "Partial",
        };
      case "WEEKEND":
        return {
          variant: "outline" as const,
          className: "bg-gray-50 text-gray-500 border-gray-200",
          icon: Calendar,
          label: "Weekend",
        };
      case "HOLIDAY":
        return {
          variant: "outline" as const,
          className: "bg-gray-50 text-gray-500 border-gray-200",
          icon: Calendar,
          label: "Holiday",
        };
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-50 text-gray-500 border-gray-200",
          icon: Calendar,
          label: status,
        };
    }
  };

  // Format date for display in table
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-gray-500">Loading attendance...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-red-600">{errorMessage}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-gray-500">No attendance data available</div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-heading">My Attendance</h1>
          <p className="text-brand-light-accent-1 text-sm">
            View your attendance records and statistics
          </p>
          {currentSession && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">
                  Academic Year:
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {currentSession.academic_year}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">
                  Term:
                </span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                  {formatSessionText(currentSession.term)}
                </Badge>
              </div>
            </div>
          )}
        </div>
        {/* Date Picker - Top Right */}
        <div className="flex items-center gap-2">
          <Label htmlFor="date-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Select Date:
          </Label>
          <Input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={min}
            max={max}
            className="cursor-pointer w-auto"
          />
        </div>
      </div>

      {/* Attendance Status Banner */}
      {hasAttendanceForDate && selectedDateRecord && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900">
                Attendance for {formattedDate} has been marked
              </p>
              {selectedDateRecord.markedAt && (
                <p className="text-xs text-green-700 mt-0.5">
                  Marked on{" "}
                  {new Date(selectedDateRecord.markedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(selectedDateRecord.markedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-green-900">
                Status: {selectedDateRecord.status}
              </div>
              {selectedDateRecord.isExcused && selectedDateRecord.status === "ABSENT" && (
                <div className="text-xs text-green-700">Excused</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalPresentThisMonth} / {data.summary.totalSchoolDaysThisMonth}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyAttendanceRate}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Term</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalPresentThisTerm} / {data.summary.totalSchoolDaysThisTerm}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {termAttendanceRate}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Absent</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.lastAbsentDate
                ? new Date(data.summary.lastAbsentDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.summary.lastAbsentDate ? "Most recent absence" : "No absences recorded"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">School Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalSchoolDaysThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">Days this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Attendance Records
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Showing records for {formattedDate} and surrounding dates
          </p>
        </CardHeader>
        <CardContent>
          {data.records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for this period
            </div>
          ) : (
            <div className="rounded-lg border border-brand-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-border">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.records.map((record) => {
                    const statusDisplay = getStatusDisplay(record.status);
                    const StatusIcon = statusDisplay.icon;

                    return (
                      <TableRow
                        key={record.date}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {formatDate(record.date)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusDisplay.variant}
                            className={`${statusDisplay.className} gap-1.5`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusDisplay.label}
                            {record.isExcused && record.status === "ABSENT" && (
                              <span className="ml-1">(Excused)</span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.reason && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Reason:</span> {record.reason}
                            </div>
                          )}
                          {record.markedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              Marked on{" "}
                              {new Date(record.markedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              at{" "}
                              {new Date(record.markedAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          )}
                          {!record.reason && !record.markedAt && (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendancePage;
