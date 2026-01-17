"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, BarChart2, BookOpen } from "lucide-react";
import type { TeacherDashboard } from "@/hooks/use-teacher-data";

interface QuickStatsCardsProps {
  dashboardData: TeacherDashboard | undefined;
  isLoading: boolean;
}

export const QuickStatsCards = ({
  dashboardData,
  isLoading,
}: QuickStatsCardsProps) => {
  const managedClass = dashboardData?.managed_class;
  const studentsTotal = managedClass?.students.total ?? 0;
  
  // For now, we'll use placeholder values for attendance and performance
  // These might come from other endpoints in the future
  const attendance = 0; // TODO: Get from API when available
  const performance = 0; // TODO: Get from API when available
  const pendingGrades = 0; // TODO: Get from API when available

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="stats-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-medium mb-4 text-brand-heading">
        Quick Stats
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <Users className="h-8 w-8 text-brand-primary mb-2" />
            <h3 className="text-2xl font-bold">{studentsTotal}</h3>
            <p className="text-sm text-gray-500">Students</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <Calendar className="h-8 w-8 text-sky-400 mb-2" />
            <h3 className="text-2xl font-bold">{attendance}%</h3>
            <p className="text-sm text-gray-500">Attendance</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <BarChart2 className="h-8 w-8 text-amber-400 mb-2" />
            <h3 className="text-2xl font-bold">{performance}%</h3>
            <p className="text-sm text-gray-500">Performance</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-4 flex flex-col items-center">
            <BookOpen className="h-8 w-8 text-green-400 mb-2" />
            <h3 className="text-2xl font-bold">{pendingGrades}</h3>
            <p className="text-sm text-gray-500">Pending Grades</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

