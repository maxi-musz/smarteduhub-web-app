"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, mockSchedule } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  BarChart2,
  BookOpen,
  Clock,
  Bell,
  ClipboardCheck,
  FilePen,
  MessageSquare,
  LineChart,
} from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const performanceData = [
  { month: "Jan", attendance: 86, grades: 78 },
  { month: "Feb", attendance: 92, grades: 81 },
  { month: "Mar", attendance: 88, grades: 80 },
  { month: "Apr", attendance: 90, grades: 85 },
  { month: "May", attendance: 94, grades: 88 },
  { month: "Jun", attendance: 92, grades: 90 },
];

const TeacherDashboardPage: React.FC = () => {
  const router = useRouter();

  // Get today, tomorrow and day after tomorrow (Wednesday if today is Monday)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = dayNames[today.getDay()];
  const tomorrowName = dayNames[tomorrow.getDay()];
  const dayAfterName = dayNames[dayAfter.getDay()];

  const todaysClasses = mockSchedule
    .filter((item) => ["Monday", "Today", todayName].includes(item.day))
    .slice(0, 3);

  const tomorrowsClasses = mockSchedule
    .filter((item) => ["Tuesday", "Tomorrow", tomorrowName].includes(item.day))
    .slice(0, 3);

  const dayAfterClasses = mockSchedule
    .filter((item) => [dayAfterName].includes(item.day))
    .slice(0, 3);

  //   const pendingGrades = mockGrades
  //     .filter((grade) => grade.status === "pending")
  //     .slice(0, 3);

  // Helper for navigation
  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm text-gray-500">
            Today, {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
            onClick={() => handleNavigate("/teacher/attendance")}
          >
            <ClipboardCheck className="h-8 w-8 text-brand-primary mb-2" />
            <span>Mark Attendance</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
            onClick={() => handleNavigate("/teacher/assignment")}
          >
            <FilePen className="h-8 w-8 text-text-green-400 mb-2" />
            <span>Create Assignment</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-200"
            onClick={() => handleNavigate("/teacher/message")}
          >
            <MessageSquare className="h-8 w-8 text-amber-400 mb-2" />
            <span>Message Class</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
            onClick={() => handleNavigate("/teacher/grades")}
          >
            <BarChart2 className="h-8 w-8 text-purple-500 mb-2" />
            <span>Enter Grades</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <Users className="h-8 w-8 text-brand-primary mb-2" />
            <h3 className="text-2xl font-bold">
              {dashboardStats.studentCount}
            </h3>
            <p className="text-sm text-gray-500">Students</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <Calendar className="h-8 w-8 text-sky-400 mb-2" />
            <h3 className="text-2xl font-bold">
              {dashboardStats.averageAttendance}%
            </h3>
            <p className="text-sm text-gray-500">Attendance</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <BarChart2 className="h-8 w-8 text-amber-400 mb-2" />
            <h3 className="text-2xl font-bold">
              {dashboardStats.averagePerformance}%
            </h3>
            <p className="text-sm text-gray-500">Performance</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <BookOpen className="h-8 w-8 text-text-green-400 mb-2" />
            <h3 className="text-2xl font-bold">
              {dashboardStats.pendingGrades}
            </h3>
            <p className="text-sm text-gray-500">Pending Grades</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-brand-primary" />
            Class Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="h-80 relative">
            <ChartContainer
              config={{
                attendance: {
                  label: "Attendance",
                  color: "#1E88E5",
                },
                grades: {
                  label: "Grades",
                  color: "#FFA000",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) {
                        return null;
                      }
                      return (
                        <ChartTooltipContent
                          active={active}
                          payload={payload}
                          label={label}
                        />
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#1E88E5"
                    fill="#1E88E5"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="grades"
                    stroke="#FFA000"
                    fill="#FFA000"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Three-day schedule view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-brand-primary" />
              Today&apos;s Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {todaysClasses.length > 0 ? (
              <ul className="divide-y">
                {todaysClasses.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {item.subject}
                        <span className="ml-2 text-xs text-gray-500">
                          {item.subjectCode}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.startTime} - {item.endTime} • {item.room}
                      </p>
                    </div>
                    <div
                      className="w-3 h-12 rounded-md"
                      style={{ backgroundColor: item.color }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 py-4 text-center">
                No classes scheduled for today
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tomorrow's Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-sky-400" />
              Tomorrow&apos;s Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {tomorrowsClasses.length > 0 ? (
              <ul className="divide-y">
                {tomorrowsClasses.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {item.subject}
                        <span className="ml-2 text-xs text-gray-500">
                          {item.subjectCode}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.startTime} - {item.endTime} • {item.room}
                      </p>
                    </div>
                    <div
                      className="w-3 h-12 rounded-md"
                      style={{ backgroundColor: item.color }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 py-4 text-center">
                No classes scheduled for tomorrow
              </p>
            )}
          </CardContent>
        </Card>

        {/* Day After Tomorrow's Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-400" />
              {dayAfterName}&apos;s Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {dayAfterClasses.length > 0 ? (
              <ul className="divide-y">
                {dayAfterClasses.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {item.subject}
                        <span className="ml-2 text-xs text-gray-500">
                          {item.subjectCode}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.startTime} - {item.endTime} • {item.room}
                      </p>
                    </div>
                    <div
                      className="w-3 h-12 rounded-md"
                      style={{ backgroundColor: item.color }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 py-4 text-center">
                No classes scheduled for {dayAfterName}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2 text-brand-primary" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="divide-y">
            {dashboardStats.recentAnnouncements.map((announcement) => (
              <li key={announcement.id} className="py-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{announcement.title}</p>
                  <Badge variant="outline">{announcement.date}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recent Activity - Mobile Only */}
      <div className="mt-6 sm:hidden">
        <h2 className="section-title">Recent Activity</h2>
        <Card>
          <CardContent className="p-4">
            <ul className="divide-y">
              <li className="py-2">
                <p className="text-sm">
                  <span className="font-medium">Maria Garcia</span> submitted
                  assignment
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </li>
              <li className="py-2">
                <p className="text-sm">
                  <span className="font-medium">Science Quiz</span> grades
                  published
                </p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </li>
              <li className="py-2">
                <p className="text-sm">
                  <span className="font-medium">Class Schedule</span> updated
                </p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
