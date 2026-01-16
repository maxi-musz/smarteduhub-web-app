"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";

interface TeacherStatsCardsProps {
  totalTeachers: number;
  activeTeachers: number;
  isLoading: boolean;
}

const SkeletonCard = () => (
  <Card className="bg-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

export const TeacherStatsCards = ({
  totalTeachers,
  activeTeachers,
  isLoading,
}: TeacherStatsCardsProps) => {
  if (isLoading) {
    return (
      <>
        <SkeletonCard />
        <SkeletonCard />
      </>
    );
  }

  return (
    <>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Teachers</p>
              <h3 className="text-2xl font-bold">{totalTeachers}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Teachers</p>
              <h3 className="text-2xl font-bold">{activeTeachers}</h3>
            </div>
            <BookOpen className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

