"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAttendanceStudents,
  useAttendanceForDate,
  useSubmitAttendance,
  useUpdateAttendance,
} from "@/hooks/teacher/use-teacher-data";
import { Users, Save, RefreshCw, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface StudentAttendanceListProps {
  classId: string;
  date: string;
}

type AttendanceStatus = "PRESENT" | "ABSENT" | null;

interface StudentAttendanceState {
  student_id: string;
  status: AttendanceStatus;
}

export const StudentAttendanceList = ({ classId, date }: StudentAttendanceListProps) => {
  const [attendanceState, setAttendanceState] = useState<Record<string, StudentAttendanceState>>(
    {}
  );
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  const { data: studentsData, isLoading: isLoadingStudents } = useAttendanceStudents(
    classId,
    1,
    100
  );
  const { data: attendanceData, isLoading: isLoadingAttendance } = useAttendanceForDate(
    classId,
    date
  );

  const submitMutation = useSubmitAttendance();
  const updateMutation = useUpdateAttendance();

  // Initialize attendance state from existing data or students
  useEffect(() => {
    // Wait for both data sources to be available
    if (isLoadingAttendance || isLoadingStudents) return;

    // Check if attendance has been marked (using actual backend response structure)
    const isMarked = attendanceData?.is_marked || attendanceData?.session_id;
    
    if (isMarked && attendanceData?.attendance_records && attendanceData.attendance_records.length > 0) {
      const state: Record<string, StudentAttendanceState> = {};
      
      // Map attendance records to students
      // Backend returns student_id as string ID (e.g., "STUD/26/001"), need to match with students
      attendanceData.attendance_records.forEach((record) => {
        // Find the student by matching student_id (string ID) or by UUID
        const student = studentsData?.students?.find(
          (s) => s.student_id === record.student_id || s.id === record.student_id
        );
        
        if (student) {
          // Convert is_present boolean to status
          const status: AttendanceStatus = record.is_present ? "PRESENT" : "ABSENT";
          state[student.id] = {
            student_id: student.id,
            status,
          };
        }
      });
      
      // Also initialize any students that don't have records yet
      studentsData?.students?.forEach((student) => {
        if (!state[student.id]) {
          state[student.id] = {
            student_id: student.id,
            status: null,
          };
        }
      });
      
      setAttendanceState(state);
      setNotes(attendanceData.notes || "");
    } else if (studentsData?.students && studentsData.students.length > 0) {
      // No attendance submitted yet - initialize with no status selected
      const state: Record<string, StudentAttendanceState> = {};
      studentsData.students.forEach((student) => {
        state[student.id] = {
          student_id: student.id,
          status: null,
        };
      });
      setAttendanceState(state);
    }
  }, [attendanceData, studentsData, isLoadingAttendance, isLoadingStudents]);

  const updateStudentStatus = (
    studentId: string,
    updates: Partial<StudentAttendanceState>
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        ...updates,
      },
    }));
  };

  const handleBulkAction = (status: AttendanceStatus) => {
    if (!studentsData?.students) return;

    const newState: Record<string, StudentAttendanceState> = { ...attendanceState };
    studentsData.students.forEach((student) => {
      newState[student.id] = {
        student_id: student.id,
        status,
      };
    });
    setAttendanceState(newState);
  };

  const handleSubmit = async () => {
    if (!studentsData?.students) return;

    const attendanceRecords = studentsData.students
      .map((student) => {
        const state = attendanceState[student.id];
        return {
          student_id: student.id,
          status: state?.status || null,
        };
      })
      .filter((record) => record.status !== null)
      .map((record) => ({
        student_id: record.student_id,
        status: record.status as string, // Filter ensures status is not null
      }));

    // Check if all students have a status
    if (attendanceRecords.length !== studentsData.students.length) {
      toast({
        title: "Incomplete Attendance",
        description: "Please mark attendance for all students before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (hasExistingAttendance) {
      // Update existing attendance
      updateMutation.mutate({
        class_id: classId,
        date,
        attendance_records: attendanceRecords,
        notes: notes || undefined,
      });
    } else {
      // Submit new attendance
      submitMutation.mutate({
        class_id: classId,
        date,
        session_type: "DAILY",
        attendance_records: attendanceRecords,
        notes: notes || undefined,
      });
    }
  };

  const isLoading = isLoadingStudents || isLoadingAttendance;
  const isSubmitting = submitMutation.isPending || updateMutation.isPending;
  const hasExistingAttendance = attendanceData?.is_marked || !!attendanceData?.session_id;
  const attendanceStatus = attendanceData?.attendance_status || attendanceData?.status;

  // Check if all students have been marked
  const allStudentsMarked = studentsData?.students
    ? studentsData.students.every(
        (student) =>
          attendanceState[student.id]?.status !== null &&
          attendanceState[student.id]?.status !== undefined
      )
    : false;

  // Check if there are any changes from existing attendance
  const hasChanges = hasExistingAttendance
    ? studentsData?.students?.some((student) => {
        const currentState = attendanceState[student.id];
        // Match by student_id (string ID) or UUID
        const existingRecord = attendanceData?.attendance_records?.find(
          (r) => r.student_id === student.student_id || r.student_id === student.id
        );
        if (!existingRecord) return currentState?.status !== null;
        // Convert is_present boolean or status string to PRESENT/ABSENT
        const existingStatus: AttendanceStatus =
          existingRecord.is_present === true
            ? "PRESENT"
            : existingRecord.is_present === false
              ? "ABSENT"
              : existingRecord.status === "PRESENT"
                ? "PRESENT"
                : existingRecord.status === "ABSENT"
                  ? "ABSENT"
                  : null;
        return currentState?.status !== existingStatus;
      })
    : false;

  const canSubmit = allStudentsMarked && (hasChanges || !hasExistingAttendance);

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    if (!studentsData?.students) {
      return { marked: 0, total: 0, present: 0, absent: 0, percentage: 0 };
    }
    const total = studentsData.students.length;
    let marked = 0;
    let present = 0;
    let absent = 0;

    studentsData.students.forEach((student) => {
      const status = attendanceState[student.id]?.status;
      if (status !== null && status !== undefined) {
        marked++;
        if (status === "PRESENT") present++;
        if (status === "ABSENT") absent++;
      }
    });

    return {
      marked,
      total,
      present,
      absent,
      percentage: total > 0 ? Math.round((marked / total) * 100) : 0,
    };
  }, [studentsData?.students, attendanceState]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading students...</div>
        </CardContent>
      </Card>
    );
  }

  if (!studentsData?.students || studentsData.students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">No students found in this class</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5" />
                Student Attendance
              </CardTitle>
              {hasExistingAttendance && attendanceStatus === "submitted" && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Submitted
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {studentsData.students.length} {studentsData.students.length === 1 ? "student" : "students"} in class
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("PRESENT")}
              disabled={isSubmitting}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("ABSENT")}
              disabled={isSubmitting}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Mark All Absent
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">
              Progress: {progressStats.marked} of {progressStats.total} marked
            </span>
            <span className="text-gray-500">{progressStats.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-brand-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressStats.percentage}%` }}
            />
          </div>
          {progressStats.marked > 0 && (
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                {progressStats.present} Present
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-600" />
                {progressStats.absent} Absent
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="font-semibold">Student</TableHead>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold text-center w-32">Present</TableHead>
                  <TableHead className="font-semibold text-center w-32">Absent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsData.students.map((student) => {
                  const state = attendanceState[student.id] || {
                    student_id: student.id,
                    status: null as AttendanceStatus,
                  };

                  // Build full name from first_name and last_name
                  const firstName = (student.first_name || "").trim();
                  const lastName = (student.last_name || "").trim();
                  const fullName = firstName && lastName
                    ? `${firstName} ${lastName}`
                    : firstName || lastName || student.student_id || "Unknown Student";
                  
                  // Get initials for avatar
                  const firstInitial = firstName?.[0]?.toUpperCase() || "";
                  const lastInitial = lastName?.[0]?.toUpperCase() || "";
                  const initials = firstInitial && lastInitial
                    ? `${firstInitial}${lastInitial}`
                    : firstInitial || lastInitial || student.student_id?.[0]?.toUpperCase() || "?";

                  const handleStatusChange = (newStatus: AttendanceStatus) => {
                    // If clicking the same status, uncheck it; otherwise set the new status
                    if (state.status === newStatus) {
                      updateStudentStatus(student.id, { status: null });
                    } else {
                      updateStudentStatus(student.id, { status: newStatus });
                    }
                  };

                  const isPresent = state.status === "PRESENT";
                  const isAbsent = state.status === "ABSENT";
                  const isMarked = isPresent || isAbsent;

                  return (
                    <TableRow
                      key={student.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isMarked ? "" : "bg-yellow-50/30"
                      }`}
                    >
                      <TableCell className="w-12">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage
                            src={student.display_picture || undefined}
                            alt={fullName}
                          />
                          <AvatarFallback className="bg-brand-primary text-white text-sm font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{fullName}</div>
                          {student.email && (
                            <div className="text-xs text-gray-500 mt-0.5">{student.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {student.student_id || student.admission_number || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox
                            id={`present-${student.id}`}
                            checked={isPresent}
                            onCheckedChange={() => handleStatusChange("PRESENT")}
                            disabled={isSubmitting}
                            className="h-5 w-5"
                          />
                          {isPresent && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox
                            id={`absent-${student.id}`}
                            checked={isAbsent}
                            onCheckedChange={() => handleStatusChange("ABSENT")}
                            disabled={isSubmitting}
                            className="h-5 w-5"
                          />
                          {isAbsent && (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Session Notes <span className="text-gray-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this attendance session..."
              disabled={isSubmitting}
              rows={3}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-600">
              {!canSubmit && progressStats.marked < progressStats.total && (
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Please mark all {progressStats.total} students
                </span>
              )}
              {canSubmit && (
                <span className="text-green-600 font-medium">
                  Ready to submit
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setAttendanceState({});
                  setNotes("");
                }}
                disabled={isSubmitting}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit}
                className="gap-2 min-w-[140px]"
              >
                <Save className="h-4 w-4" />
                {isSubmitting
                  ? "Saving..."
                  : hasExistingAttendance
                    ? "Update Attendance"
                    : "Submit Attendance"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
