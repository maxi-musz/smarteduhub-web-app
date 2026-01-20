"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import type { StudentTabResponse } from "@/hooks/teacher/use-teacher-data";

interface StudentStatsCardsProps {
  data: StudentTabResponse | undefined;
  isLoading: boolean;
}

export const StudentStatsCards = ({
  data,
  isLoading,
}: StudentStatsCardsProps) => {
  const summary = data?.summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold">{summary?.total_students || 0}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Classes</p>
            <p className="text-2xl font-bold">{summary?.total_classes || 0}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Subjects</p>
            <p className="text-2xl font-bold">{summary?.total_subjects || 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

