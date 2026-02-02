"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, BookOpen, Video, FileText, Building2 } from "lucide-react";
import type { DashboardSummary, DashboardContentStats } from "@/hooks/library-owner/use-library-users-types";

interface ManagementStatsCardsProps {
  summary: DashboardSummary | null;
  contentStats: DashboardContentStats | null;
  schoolsWithAccess: number;
  isLoading?: boolean;
}

export function ManagementStatsCards({
  summary,
  contentStats,
  schoolsWithAccess,
  isLoading,
}: ManagementStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalUsers = summary?.totalUsers ?? 0;
  const subjects = contentStats?.subjects ?? 0;
  const videos = contentStats?.videos ?? 0;
  const materials = contentStats?.materials ?? 0;

  const stats = [
    {
      label: "Library users",
      value: totalUsers,
      icon: Users,
      color: "text-brand-primary",
      bgColor: "bg-brand-primary/10",
    },
    {
      label: "Subjects",
      value: subjects,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Videos",
      value: videos,
      icon: Video,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Materials",
      value: materials,
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "Schools with access",
      value: schoolsWithAccess,
      icon: Building2,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-brand-light-accent-1">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-heading">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
