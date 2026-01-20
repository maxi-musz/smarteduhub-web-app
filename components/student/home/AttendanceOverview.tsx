"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";

interface AttendanceStats {
  totalClasses: number;
  attended: number;
  absent: number;
  late: number;
  percentage: number;
}

interface RecentAttendance {
  id: string;
  subject: string;
  date: string;
  status: "present" | "absent" | "late";
}

const attendanceStats: AttendanceStats = {
  totalClasses: 45,
  attended: 42,
  absent: 2,
  late: 1,
  percentage: 93.3,
};

const recentAttendance: RecentAttendance[] = [
  {
    id: "1",
    subject: "Mathematics",
    date: "Jun 11",
    status: "present",
  },
  {
    id: "2",
    subject: "Computer Science",
    date: "Jun 11",
    status: "present",
  },
  {
    id: "3",
    subject: "English Literature",
    date: "Jun 10",
    status: "late",
  },
  {
    id: "4",
    subject: "Physics",
    date: "Jun 10",
    status: "present",
  },
];

const getStatusIcon = (status: RecentAttendance["status"]) => {
  switch (status) {
    case "present":
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case "absent":
      return <XCircle className="h-3 w-3 text-red-600" />;
    case "late":
      return <Clock className="h-3 w-3 text-orange-600" />;
  }
};

const getStatusBadge = (status: RecentAttendance["status"]) => {
  switch (status) {
    case "present":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
          Present
        </Badge>
      );
    case "absent":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 text-xs">
          Absent
        </Badge>
      );
    case "late":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
          Late
        </Badge>
      );
  }
};

// TODO: Backend Integration Required
// This component uses mock data because the /students/dashboard endpoint
// doesn't include attendance statistics. Need to either:
// 1. Add attendance data to the dashboard endpoint
// 2. Create a separate /students/attendance endpoint
// 3. Pass attendance data as props from parent component

export function AttendanceOverview() {
  return (
    <Card className="shadow-lg bg-white h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <User className="h-4 w-4 text-sky-400" />
          Class Attendance
          <Badge variant="outline" className="text-xs ml-auto">
            Mock Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Overall Stats */}
        <div className="p-3 rounded-lg bg-blue-50/50 border-0 border-l-4 border-l-brand-primary space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Attendance</span>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              {attendanceStats.percentage}%
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-green-600">
                {attendanceStats.attended}
              </div>
              <div className="text-brand-light-accent-1">Present</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-red-600">
                {attendanceStats.absent}
              </div>
              <div className="text-brand-light-accent-1">Absent</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-orange-600">
                {attendanceStats.late}
              </div>
              <div className="text-brand-light-accent-1">Late</div>
            </div>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="space-y-2 flex-1">
          <div className="text-sm font-medium text-brand-light-accent-1">
            Recent Classes
          </div>
          <div className="space-y-2">
            {recentAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-2 rounded border border-brand-border bg-background"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <div>
                    <div className="text-xs font-medium">{record.subject}</div>
                    <div className="text-xs text-brand-light-accent-1">
                      {record.date}
                    </div>
                  </div>
                </div>
                {getStatusBadge(record.status)}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            alert("View All Attendance Clicked");
          }}
          className="w-full"
        >
          View All Attendance
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
