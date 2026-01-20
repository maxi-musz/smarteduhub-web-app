"use client";

import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Loader2,
} from "lucide-react";

// Components
import { ClassScheduleSummary } from "@/components/student/home/ClassScheduleSummary";
import { UpcomingAssignments } from "@/components/student/home/UpcomingAssignments";
import { WeeklyEvents } from "@/components/student/home/WeeklyEvents";
import StudentHeader from "@/components/ui/student-header";
import { useStudentDashboard, type StudentDashboardData } from "@/hooks/student/use-student-dashboard";

const StudentHomePage: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useStudentDashboard();

  // Log for debugging
  React.useEffect(() => {
    if (error) {
      console.error("[StudentHomePage] Error:", error);
    }
    if (dashboardData) {
      console.log("[StudentHomePage] Dashboard data:", dashboardData);
    }
  }, [error, dashboardData]);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load dashboard</p>
            {error && (
              <p className="text-sm text-gray-600 mb-4">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            )}
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const { general_info, stats, class_schedule, notifications } = dashboardData as StudentDashboardData;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <StudentHeader
        studentName={general_info.student.name}
        studentClass={general_info.student_class.name}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <BookOpen className="h-8 w-8 text-brand-primary mb-2" />
            <h3 className="text-2xl font-bold">{stats.total_subjects}</h3>
            <p className="text-sm text-brand-light-accent-1">Subjects</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <FileText className="h-8 w-8  text-green-400 mb-2" />
            <h3 className="text-2xl font-bold">{stats.pending_assessments}</h3>
            <p className="text-sm text-brand-light-accent-1">Pending Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Class Schedule Summary - 60% width on large screens */}
        <div className="lg:col-span-3">
          <ClassScheduleSummary schedule={class_schedule} />
        </div>

        {/* Upcoming Assignments - 40% width on large screens */}
        <div className="lg:col-span-2">
          <UpcomingAssignments pendingCount={stats.pending_assessments} />
        </div>
      </div>

      {/* Weekly Events */}
      <div className="grid grid-cols-1 gap-6">
        <WeeklyEvents notifications={notifications} />
      </div>
    </div>
  );
};

export default StudentHomePage;
