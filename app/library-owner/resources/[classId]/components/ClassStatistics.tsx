import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, Video, FileText } from "lucide-react";
import { ClassResourcesStatistics } from "@/hooks/library-owner/use-library-class-resources";

interface ClassStatisticsProps {
  statistics: ClassResourcesStatistics;
}

export const ClassStatistics = ({ statistics }: ClassStatisticsProps) => {
  const stats = [
    {
      label: "Total Subjects",
      value: statistics?.totalSubjects ?? 0,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      label: "Total Chapters",
      value: statistics?.totalChapters ?? 0,
      icon: Layers,
      color: "text-indigo-600",
    },
    {
      label: "Total Topics",
      value: statistics?.totalTopics ?? 0,
      icon: Layers,
      color: "text-purple-600",
    },
    {
      label: "Total Videos",
      value: statistics?.totalVideos ?? 0,
      icon: Video,
      color: "text-green-600",
    },
    {
      label: "Total Materials",
      value: statistics?.totalMaterials ?? 0,
      icon: FileText,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="pl-0 pr-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
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
                {(stat.value ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

