"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface SubjectStatsCardsProps {
  totalSubjects: number;
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

export const SubjectStatsCards = ({
  totalSubjects,
  isLoading,
}: SubjectStatsCardsProps) => {
  if (isLoading) {
    return (
      <>
        <SkeletonCard />
      </>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Subjects</p>
            <h3 className="text-2xl font-bold">{totalSubjects}</h3>
          </div>
          <BookOpen className="h-8 w-8 text-blue-500" />
        </div>
      </CardContent>
    </Card>
  );
};

