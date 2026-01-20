import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  Users,
  Layers,
} from "lucide-react";
import { ResourcesStatistics as ResourcesStatisticsType } from "@/hooks/use-library-owner-resources";

interface ResourcesStatisticsProps {
  statistics: ResourcesStatisticsType;
}

export const ResourcesStatistics = ({ statistics }: ResourcesStatisticsProps) => {
  const overviewStats = [
    {
      label: "Total Videos",
      value: statistics.overview.totalVideos,
      icon: Video,
      color: "text-blue-600",
    },
    {
      label: "Total Materials",
      value: statistics.overview.totalMaterials,
      icon: FileText,
      color: "text-green-600",
    },
    {
      label: "Total Classes",
      value: statistics.overview.totalClasses,
      icon: GraduationCap,
      color: "text-purple-600",
    },
    {
      label: "Total Subjects",
      value: statistics.overview.totalSubjects,
      icon: BookOpen,
      color: "text-orange-600",
    },
    {
      label: "Total Topics",
      value: statistics.overview.totalTopics,
      icon: Layers,
      color: "text-red-600",
    },
    {
      label: "Contributors",
      value: statistics.contributors.totalUniqueUploaders,
      icon: Users,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="pl-0 pr-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
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

