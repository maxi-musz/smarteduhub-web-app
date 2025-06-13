"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  BarChart2,
  BookOpen,
  Bell,
  ClipboardCheck,
  FilePen,
  MessageSquare,
} from "lucide-react";

import { TeacherClassesCarousel } from "@/components/teacher/dashboard/TeacherClassesCarousel";

const TeacherDashboardPage: React.FC = () => {
  const router = useRouter();

  // Get today, tomorrow and day after tomorrow (Wednesday if today is Monday)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  // const dayNames = [
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  // ];
  // const todayName = dayNames[today.getDay()];
  // const tomorrowName = dayNames[tomorrow.getDay()];
  // const dayAfterName = dayNames[dayAfter.getDay()];

  // const todaysClasses = mockSchedule
  //   .filter((item) => ["Monday", "Today", todayName].includes(item.day))
  //   .slice(0, 3);

  // const tomorrowsClasses = mockSchedule
  //   .filter((item) => ["Tuesday", "Tomorrow", tomorrowName].includes(item.day))
  //   .slice(0, 3);

  // const dayAfterClasses = mockSchedule
  //   .filter((item) => [dayAfterName].includes(item.day))
  //   .slice(0, 3);

  //   const pendingGrades = mockGrades
  //     .filter((grade) => grade.status === "pending")
  //     .slice(0, 3);

  // Helper for navigation
  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-heading">
          Teacher Dashboard
        </h1>
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-brand-light-accent-1 mr-2" />
          <span className="text-sm text-brand-light-accent-1">
            Today, {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 text-brand-heading">
          Quick Action Buttons
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="py-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
            onClick={() => handleNavigate("/teacher/attendance")}
          >
            <ClipboardCheck className="h-8 w-8 text-brand-primary" />
            <span>Mark Attendance</span>
          </Button>

          <Button
            variant="outline"
            className="py-6 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
            onClick={() => handleNavigate("/teacher/assignment")}
          >
            <FilePen className="h-8 w-8 text-green-400" />
            <span>Create Assignment</span>
          </Button>

          <Button
            variant="outline"
            className="py-6 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-200"
            onClick={() => handleNavigate("/teacher/message")}
          >
            <MessageSquare className="h-8 w-8 text-amber-400" />
            <span>Message Class</span>
          </Button>

          <Button
            variant="outline"
            className="py-6 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
            onClick={() => handleNavigate("/teacher/grades")}
          >
            <BarChart2 className="h-8 w-8 text-purple-500" />
            <span>Enter Grades</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <h2 className="text-lg font-medium mb-4 text-brand-heading">
        Quick Stats
      </h2>
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
            <BookOpen className="h-8 w-8 text-green-400 mb-2" />
            <h3 className="text-2xl font-bold">
              {dashboardStats.pendingGrades}
            </h3>
            <p className="text-sm text-gray-500">Pending Grades</p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Classes Carousel */}
      <TeacherClassesCarousel />

      {/* Announcements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2 text-brand-primary" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="divide-y divide-brand-border">
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
            <ul className="divide-y divide-brand-border">
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
