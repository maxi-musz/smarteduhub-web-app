import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, Video, FileText } from "lucide-react";
import { ClassResourcesStatistics } from "@/hooks/use-library-class-resources";

interface ClassStatisticsProps {
  statistics: ClassResourcesStatistics;
}

export const ClassStatistics = ({ statistics }: ClassStatisticsProps) => {
  const stats = [
    {
      label: "Total Subjects",
      value: statistics.totalSubjects,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      label: "Total Chapters",
      value: statistics.totalChapters,
      icon: Layers,
      color: "text-indigo-600",
    },
    {
      label: "Total Topics",
      value: statistics.totalTopics,
      icon: Layers,
      color: "text-purple-600",
    },
    {
      label: "Total Videos",
      value: statistics.totalVideos,
      icon: Video,
      color: "text-green-600",
    },
    {
      label: "Total Materials",
      value: statistics.totalMaterials,
      icon: FileText,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-light-accent-1">
                {stat.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-heading">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

