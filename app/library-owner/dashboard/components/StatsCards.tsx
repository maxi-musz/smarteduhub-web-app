import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Upload, FileText, Video } from "lucide-react";
import { LibraryOwnerDashboardResponse } from "@/hooks/library-owner/use-library-owner-dashboard";

interface StatsCardsProps {
  statistics: LibraryOwnerDashboardResponse["statistics"];
  myActivity: LibraryOwnerDashboardResponse["myActivity"];
}

export const StatsCards = ({ statistics, myActivity }: StatsCardsProps) => {
  const stats = [
    {
      label: "Total Videos",
      value: statistics.videos.total,
      icon: Video,
      description: `${statistics.videos.published} published`,
    },
    {
      label: "Total Materials",
      value: statistics.materials.total,
      icon: FileText,
      description: `${statistics.materials.published} published`,
    },
    {
      label: "My Videos",
      value: myActivity.videosUploaded,
      icon: Upload,
      description: "Videos I uploaded",
    },
    {
      label: "My Materials",
      value: myActivity.materialsUploaded,
      icon: BookOpen,
      description: "Materials I uploaded",
    },
  ];

  return (
    <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-light-accent-1">
                {stat.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-heading">
                {stat.value}
              </div>
              <p className="text-xs text-brand-light-accent-1 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

