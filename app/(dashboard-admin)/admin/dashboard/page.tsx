"use client";

import React, { useState } from "react";
import {
  Wallet,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const classFilters = [
  { label: "All", value: "all" },
  { label: "JSS1", value: "JSS1" },
  { label: "JSS2", value: "JSS2" },
  { label: "JSS3", value: "JSS3" },
  { label: "SS1", value: "SS1" },
  { label: "SS2", value: "SS2" },
  { label: "SS3", value: "SS3" },
];

const ongoingClassesDemo = [
  {
    class: "JSS1A",
    subject: "Mathematics",
    teacher: "Mr. Ade",
    from: "08:00",
    to: "09:00",
  },
  {
    class: "JSS1B",
    subject: "English",
    teacher: "Mrs. Bello",
    from: "08:00",
    to: "09:00",
  },
  {
    class: "JSS2A",
    subject: "Basic Science",
    teacher: "Mr. Chinedu",
    from: "09:00",
    to: "10:00",
  },
  {
    class: "JSS2B",
    subject: "Social Studies",
    teacher: "Ms. Grace",
    from: "09:00",
    to: "10:00",
  },
  {
    class: "SS1A",
    subject: "Biology",
    teacher: "Dr. Musa",
    from: "10:00",
    to: "11:00",
  },
  {
    class: "SS2C",
    subject: "Chemistry",
    teacher: "Mrs. Okafor",
    from: "11:00",
    to: "12:00",
  },
  {
    class: "SS3B",
    subject: "Physics",
    teacher: "Mr. Johnson",
    from: "12:00",
    to: "01:00",
  },
  {
    class: "JSS3A",
    subject: "Computer Science",
    teacher: "Mr. David",
    from: "13:00",
    to: "14:00",
  },
  {
    class: "SS1B",
    subject: "Economics",
    teacher: "Mrs. Sarah",
    from: "14:00",
    to: "15:00",
  },
];

const totalClasses = 16; // Total number of classes in the school

const AdminDashboard = () => {
  const router = useRouter();

  // Demo data
  const financialOverview = {
    totalRevenue: 9782000,
    revenueGrowth: 12,
    pendingFees: 3245000,
    expenses: 1325000,
    cashFlow: 1857000,
  };

  const teacherStats = {
    totalTeachers: 45,
    activeClasses: 32,
    subjectsOffered: 16,
    averageClassSize: 25,
  };

  const studentStats = {
    totalStudents: 1350,
    attendance: 92,
    performanceAvg: 76,
    activeClubs: 9,
  };

  const subjectDistribution = [
    { name: "Mathematics", value: 20 },
    { name: "Sciences", value: 25 },
    { name: "Languages", value: 20 },
    { name: "Humanities", value: 15 },
    { name: "Technical", value: 20 },
  ];

  const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"];

  const [classFilter, setClassFilter] = useState("all");
  const filteredOngoingClasses =
    classFilter === "all"
      ? ongoingClassesDemo
      : ongoingClassesDemo.filter((c) =>
          c.class.toUpperCase().startsWith(classFilter)
        );

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Dashboard Overview
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Overview Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Financial Overview</h3>
              <Wallet className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold">
                  ₦ {financialOverview.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Fees</span>
                <span className="font-semibold text-yellow-600">
                  ₦ {financialOverview.pendingFees.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cash Flow</span>
                <span className="font-semibold text-green-600">
                  ₦ {financialOverview.cashFlow.toLocaleString()}
                </span>
              </div>
            </div>
            <Button
              variant="link"
              className="mt-4 w-full justify-between"
              onClick={() => router.push("/admin/finance")}
            >
              View Details <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Teachers Overview Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Teachers Overview</h3>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Teachers</span>
                <span className="font-semibold">
                  {teacherStats.totalTeachers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Classes</span>
                <span className="font-semibold">
                  {teacherStats.activeClasses}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subjects Offered</span>
                <span className="font-semibold">
                  {teacherStats.subjectsOffered}
                </span>
              </div>
            </div>
            <Button
              variant="link"
              className="mt-4 w-full justify-between"
              onClick={() => router.push("/admin/teachers")}
            >
              View Details <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Students Overview Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Students Overview</h3>
              <GraduationCap className="h-5 w-5 text-purple-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold">
                  {studentStats.totalStudents}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Attendance Rate</span>
                <span className="font-semibold">
                  {studentStats.attendance}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Performance Avg</span>
                <span className="font-semibold">
                  {studentStats.performanceAvg}%
                </span>
              </div>
            </div>
            <Button
              variant="link"
              className="mt-4 w-full justify-between"
              onClick={() => router.push("/admin/students")}
            >
              View Details <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ongoing Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ongoing Classes List */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Ongoing Classes</h3>
                <span className="text-sm text-gray-500">
                  {filteredOngoingClasses.length}/{totalClasses} total classes
                </span>
              </div>
              <BookOpen className="h-5 w-5 text-indigo-500" />
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
              {classFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    classFilter === filter.value
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setClassFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div
              className="h-64 overflow-y-scroll pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D1D5DB #F3F4F6",
              }}
            >
              {filteredOngoingClasses.map((ongoing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-2"
                >
                  <div>
                    <div className="font-semibold text-brand-primary">
                      {ongoing.class}
                    </div>
                    <div className="text-sm text-gray-700">
                      {ongoing.subject}
                    </div>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="text-sm text-gray-500">
                      {ongoing.teacher}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {ongoing.from} - {ongoing.to}
                  </div>
                </div>
              ))}
              {filteredOngoingClasses.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-8">
                  No ongoing classes found for this filter.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <Calendar className="h-5 w-5 text-rose-500" />
            </div>
            <div
              className="h-64 overflow-y-scroll pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D1D5DB #F3F4F6",
              }}
            >
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">End of Term Exams</span>
                    <span className="text-sm text-gray-500">Dec 15</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Final examinations for all classes
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Parents Meeting</span>
                    <span className="text-sm text-gray-500">Dec 20</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Annual parents-teachers meeting
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Sports Day</span>
                    <span className="text-sm text-gray-500">Dec 22</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Annual sports competition
                  </p>
                </div>
                {/* Add more events as needed */}
              </div>
            </div>
            <Button
              variant="link"
              className="mt-4 w-full justify-between"
              onClick={() => router.push("/calendar")}
            >
              View Calendar <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
