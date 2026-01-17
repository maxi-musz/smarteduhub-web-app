"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useAttendanceStudents,
  useAttendanceForDate,
  useSubmitAttendance,
  useUpdateAttendance,
} from "@/hooks/use-teacher-data";
import { Users, Save, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentAttendanceListProps {
  classId: string;
  date: string;
}

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "PARTIAL" | null;

interface StudentAttendanceState {
  student_id: string;
  status: AttendanceStatus;
  reason: string;
  is_excused: boolean;
  excuse_note: string;
}

export const StudentAttendanceList = ({ classId, date }: StudentAttendanceListProps) => {
  const [attendanceState, setAttendanceState] = useState<Record<string, StudentAttendanceState>>(
    {}
  );
  const [notes, setNotes] = useState<string>("");

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
    if (attendanceData?.attendance_records && attendanceData.attendance_records.length > 0) {
      // Use existing attendance records
      const state: Record<string, StudentAttendanceState> = {};
      attendanceData.attendance_records.forEach((record) => {
        state[record.student_id] = {
          student_id: record.student_id,
          status: (record.status as AttendanceStatus) || null,
          reason: record.reason || "",
          is_excused: record.is_excused,
          excuse_note: record.excuse_note || "",
        };
      });
      setAttendanceState(state);
      setNotes(attendanceData.notes || "");
    } else if (studentsData?.students && studentsData.students.length > 0) {
      // Initialize with all students as PRESENT by default
      const state: Record<string, StudentAttendanceState> = {};
      studentsData.students.forEach((student) => {
        state[student.id] = {
          student_id: student.id,
          status: "PRESENT",
          reason: "",
          is_excused: false,
          excuse_note: "",
        };
      });
      setAttendanceState(state);
    }
  }, [attendanceData, studentsData]);

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
        ...newState[student.id],
        student_id: student.id,
        status,
        reason: status === "PRESENT" ? "" : newState[student.id]?.reason || "",
        is_excused: status === "EXCUSED" ? true : newState[student.id]?.is_excused || false,
        excuse_note:
          status === "EXCUSED" ? newState[student.id]?.excuse_note || "" : "",
      };
    });
    setAttendanceState(newState);
  };

  const handleSubmit = async () => {
    if (!studentsData?.students) return;

    const attendanceRecords = studentsData.students.map((student) => {
      const state = attendanceState[student.id];
      return {
        student_id: student.id,
        status: state?.status || "PRESENT",
        reason: state?.reason || undefined,
        is_excused: state?.is_excused || false,
        excuse_note: state?.excuse_note || undefined,
      };
    });

    // Check if all students have a status
    const allMarked = attendanceRecords.every((record) => record.status);
    if (!allMarked) {
      alert("Please mark attendance for all students");
      return;
    }

    if (attendanceData?.session_id) {
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
  const hasExistingAttendance = !!attendanceData?.session_id;

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Attendance ({studentsData.students.length} students)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("PRESENT")}
              disabled={isSubmitting}
            >
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("ABSENT")}
              disabled={isSubmitting}
            >
              Mark All Absent
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {studentsData.students.map((student) => {
            const state = attendanceState[student.id] || {
              student_id: student.id,
              status: null as AttendanceStatus,
              reason: "",
              is_excused: false,
              excuse_note: "",
            };

            return (
              <div
                key={student.id}
                className="border rounded-lg p-4 space-y-3 bg-white"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={student.display_picture || undefined}
                      alt={`${student.first_name || ""} ${student.last_name || ""}`}
                    />
                    <AvatarFallback>
                      {student.first_name?.[0] || "?"}
                      {student.last_name?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {student.first_name || ""} {student.last_name || ""}
                    </h4>
                    <p className="text-sm text-gray-500">{student.student_id || "N/A"}</p>
                  </div>
                  <div className="w-48">
                    <Select
                      value={state.status || ""}
                      onValueChange={(value) =>
                        updateStudentStatus(student.id, {
                          status: value as AttendanceStatus,
                        })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRESENT">Present</SelectItem>
                        <SelectItem value="ABSENT">Absent</SelectItem>
                        <SelectItem value="LATE">Late</SelectItem>
                        <SelectItem value="EXCUSED">Excused</SelectItem>
                        <SelectItem value="PARTIAL">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(state.status === "ABSENT" ||
                  state.status === "LATE" ||
                  state.status === "EXCUSED") && (
                  <div className="space-y-2 pl-16">
                    <div>
                      <Label htmlFor={`reason-${student.id}`} className="text-sm">
                        Reason
                      </Label>
                      <Input
                        id={`reason-${student.id}`}
                        value={state.reason}
                        onChange={(e) =>
                          updateStudentStatus(student.id, { reason: e.target.value })
                        }
                        placeholder="Enter reason"
                        disabled={isSubmitting}
                      />
                    </div>
                    {state.status === "ABSENT" && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`excused-${student.id}`}
                          checked={state.is_excused}
                          onCheckedChange={(checked) =>
                            updateStudentStatus(student.id, {
                              is_excused: checked === true,
                            })
                          }
                          disabled={isSubmitting}
                        />
                        <Label
                          htmlFor={`excused-${student.id}`}
                          className="text-sm cursor-pointer"
                        >
                          Excused absence
                        </Label>
                      </div>
                    )}
                    {state.is_excused && (
                      <div>
                        <Label htmlFor={`excuse-note-${student.id}`} className="text-sm">
                          Excuse Note
                        </Label>
                        <Textarea
                          id={`excuse-note-${student.id}`}
                          value={state.excuse_note}
                          onChange={(e) =>
                            updateStudentStatus(student.id, { excuse_note: e.target.value })
                          }
                          placeholder="Enter excuse note"
                          disabled={isSubmitting}
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4 space-y-4">
          <div>
            <Label htmlFor="notes" className="text-sm">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this attendance session"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={isSubmitting}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting
                ? "Saving..."
                : hasExistingAttendance
                  ? "Update Attendance"
                  : "Submit Attendance"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

