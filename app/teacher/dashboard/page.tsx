"use client";

import { useTeacherDashboard } from "@/hooks/teacher/use-teacher-data";
import {
  DashboardHeader,
  QuickActionButtons,
  QuickStatsCards,
  ClassSchedulesCarousel,
  AnnouncementsCard,
  ManagedClassCard,
} from "./dashboard-components";

const TeacherDashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useTeacherDashboard();

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <DashboardHeader />

      <ManagedClassCard dashboardData={dashboardData} isLoading={isLoading} />

      <QuickActionButtons />

      <QuickStatsCards dashboardData={dashboardData} isLoading={isLoading} />

      <ClassSchedulesCarousel
        dashboardData={dashboardData}
        isLoading={isLoading}
      />

      <AnnouncementsCard dashboardData={dashboardData} isLoading={isLoading} />

      {error && (
        <div className="text-center py-8 text-red-600">
          {error.message || "Failed to load dashboard data"}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboardPage;
