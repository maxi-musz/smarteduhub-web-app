import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Video,
} from "lucide-react";

interface ExploreStatisticsProps {
  statistics: {
    totalClasses: number;
    totalSubjects: number;
    totalVideos: number;
  };
}

export const ExploreStatistics = ({ statistics }: ExploreStatisticsProps) => {
  const overviewStats = [
    {
      label: "Total Classes",
      value: statistics.totalClasses,
      icon: GraduationCap,
      color: "text-purple-600",
    },
    {
      label: "Total Subjects",
      value: statistics.totalSubjects,
      icon: BookOpen,
      color: "text-orange-600",
    },
    {
      label: "Total Videos",
      value: statistics.totalVideos,
      icon: Video,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="pl-0 pr-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {overviewStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-brand-light-accent-1">
                {stat.label}
              </CardTitle>
              <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-brand-heading">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
