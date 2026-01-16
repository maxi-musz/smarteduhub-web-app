"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, BookMarked, Grid2X2Check } from "lucide-react";

interface StudentStatsCardsProps {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
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

export const StudentStatsCards = ({
  totalStudents,
  activeStudents,
  totalClasses,
  isLoading,
}: StudentStatsCardsProps) => {
  if (isLoading) {
    return (
      <>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <div></div>
      </>
    );
  }

  return (
    <>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold">{totalStudents}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Students</p>
              <h3 className="text-2xl font-bold">{activeStudents}</h3>
            </div>
            <BookMarked className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Classes</p>
              <h3 className="text-2xl font-bold">{totalClasses}</h3>
            </div>
            <Grid2X2Check className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      <div></div>
    </>
  );
};

