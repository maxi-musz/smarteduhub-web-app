"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendanceForDate } from "@/hooks/teacher/use-teacher-data";
import { BarChart3, Users, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface AttendanceStatsProps {
  classId: string;
  date: string;
}

export const AttendanceStats = ({ classId, date }: AttendanceStatsProps) => {
  const { data, isLoading, error } = useAttendanceForDate(classId, date);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Attendance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">Loading statistics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Attendance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">
            {error?.message || "Failed to load statistics"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { statistics, status } = data;

  // Handle case where statistics might not be available yet
  if (!statistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Attendance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            No attendance data available. Mark attendance to see statistics.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Attendance Statistics
          {status && (
            <span className="ml-auto text-sm font-normal text-gray-500">
              Status: <span className="font-semibold">{status}</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {statistics.total_students ?? 0}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>

          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {statistics.present_count ?? 0}
            </div>
            <div className="text-sm text-gray-600">Present</div>
          </div>

          <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
            <XCircle className="h-6 w-6 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {statistics.absent_count ?? 0}
            </div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>

          <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.late_count ?? 0}
            </div>
            <div className="text-sm text-gray-600">Late</div>
          </div>

          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
            <AlertCircle className="h-6 w-6 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {statistics.excused_count ?? 0}
            </div>
            <div className="text-sm text-gray-600">Excused</div>
          </div>

          <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-indigo-600 mb-2" />
            <div className="text-2xl font-bold text-indigo-600">
              {statistics.attendance_rate != null
                ? `${statistics.attendance_rate.toFixed(1)}%`
                : "0%"}
            </div>
            <div className="text-sm text-gray-600">Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

