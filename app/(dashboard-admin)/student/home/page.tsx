"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  // ChartLegend,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  // AreaChart,
  // Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  CalendarDays,
  BookOpen,
  // Clock,
  // BarChart2,
  Award,
  FileText,
} from "lucide-react";

// Import the Tooltip component from recharts directly
import { Tooltip } from "recharts";

// Upcoming Events components
import { ClassScheduleSummary } from "@/components/student/home/ClassScheduleSummary";
import { UpcomingAssignments } from "@/components/student/home/UpcomingAssignments";
import { WeeklyEvents } from "@/components/student/home/WeeklyEvents";
import { AttendanceOverview } from "@/components/student/home/AttendanceOverview";
import StudentHeader from "@/components/ui/student-header";

const attendance = [
  { name: "Present", value: 85 },
  { name: "Absent", value: 5 },
  { name: "Late", value: 10 },
];

const gradeData = [
  { subject: "Math", score: 85, average: 72 },
  { subject: "Science", score: 92, average: 78 },
  { subject: "English", score: 78, average: 75 },
  { subject: "History", score: 88, average: 70 },
  { subject: "Art", score: 95, average: 80 },
];

// const upcomingAssignments = [
//   {
//     id: 1,
//     title: "Math Problem Set",
//     subject: "Mathematics",
//     dueDate: "2025-05-02",
//     status: "pending",
//   },
//   {
//     id: 2,
//     title: "Science Lab Report",
//     subject: "Biology",
//     dueDate: "2025-05-05",
//     status: "pending",
//   },
//   {
//     id: 3,
//     title: "Last days at Forcaddos High School",
//     subject: "English Literature",
//     dueDate: "2025-05-10",
//     status: "pending",
//   },
// ];

// const progressData = [
//   { month: "Jan", performance: 65 },
//   { month: "Feb", performance: 72 },
//   { month: "Mar", performance: 78 },
//   { month: "Apr", performance: 85 },
//   { month: "May", performance: 88 },
// ];

const COLORS = ["#1E88E5", "#E53935", "#FFA000"];

const StudentHomePage: React.FC = () => {
  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <StudentHeader
        studentName="Oluwajuwon Kayode"
        studentClass="SS3A"
        // avatarUrl="https://via.placeholder.com/150"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <BookOpen className="h-8 w-8 text-brand-primary mb-2" />
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-sm text-brand-light-accent-1">Subjects</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <CalendarDays className="h-8 w-8 text-sky-400 mb-2" />
            <h3 className="text-2xl font-bold">95%</h3>
            <p className="text-sm text-brand-light-accent-1">Attendance</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <Award className="h-8 w-8 text-amber-400 mb-2" />
            <h3 className="text-2xl font-bold">87%</h3>
            <p className="text-sm text-brand-light-accent-1">Average Grade</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <FileText className="h-8 w-8  text-green-400 mb-2" />
            <h3 className="text-2xl font-bold">3</h3>
            <p className="text-sm text-brand-light-accent-1">Pending Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Class Schedule Summary - 60% width on large screens */}
        <div className="lg:col-span-3">
          <ClassScheduleSummary />
        </div>

        {/* Upcoming Assignments - 40% width on large screens */}
        <div className="lg:col-span-2">
          <UpcomingAssignments />
        </div>
      </div>

      {/* Attendance and Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Attendance Overview - 40% width on large screens */}
        <div className="lg:col-span-2">
          <AttendanceOverview />
        </div>

        {/* Weekly Events - 60% width on large screens */}
        <div className="lg:col-span-3">
          <WeeklyEvents />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Subject Performance */}
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-brand-primary" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ChartContainer
                config={{
                  score: {
                    label: "Your Score",
                    color: "#1E88E5",
                  },
                  average: {
                    label: "Class Average",
                    color: "#E0E0E0",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={gradeData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.2}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="subject"
                      scale="point"
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis domain={[0, 100]} />
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
                            className="bg-brand-bg border-0"
                          />
                        );
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="average"
                      fill="#e2e8f0cc"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter className="">
            <Button
              onClick={() => {
                alert("View All Performance Clicked");
              }}
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
            >
              View All Performance
            </Button>
          </CardFooter>
        </Card>

        {/* Attendance Chart */}
        <Card className="md:col-span-1 bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-brand-primary" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-52 flex items-center justify-center">
              <PieChart width={180} height={180}>
                <Pie
                  data={attendance}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {attendance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </div>
            <div className="flex justify-center mt-2 gap-4">
              {attendance.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-1.5"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="mt-6">
            <Button
              onClick={() => {
                alert("View All Attendance Clicked");
              }}
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
            >
              View All Attendance
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Assignments */}
        {/* <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-400" />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y">
              {upcomingAssignments.map((assignment) => {
                const dueDate = new Date(assignment.dueDate);
                const today = new Date();
                const daysLeft = Math.ceil(
                  (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isPastDue = daysLeft < 0;

                return (
                  <div key={assignment.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-brand-light-accent-1">
                          {assignment.subject}
                        </p>
                      </div>
                      <Badge
                        className={
                          isPastDue
                            ? "bg-red-100 text-red-800"
                            : daysLeft <= 2
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-brand-heading"
                        }
                      >
                        {isPastDue
                          ? "Past Due"
                          : daysLeft === 0
                          ? "Today"
                          : `${daysLeft} days left`}
                      </Badge>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-brand-light-accent-1 mb-1">
                        <span>Progress</span>
                        <span>Not Started</span>
                      </div>
                      <Progress value={0} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-4 bg-brand-primary hover:bg-brand-primary/90">
              View All Assignments
            </Button>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"></div>
    </div>
  );
};

export default StudentHomePage;
