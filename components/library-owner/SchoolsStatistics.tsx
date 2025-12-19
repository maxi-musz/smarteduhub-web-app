import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  School,
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  Building2,
} from "lucide-react";
import { SchoolsStatistics as SchoolsStatisticsType } from "@/hooks/use-library-owner-schools";

interface SchoolsStatisticsProps {
  statistics: SchoolsStatisticsType;
}

export const SchoolsStatistics = ({ statistics }: SchoolsStatisticsProps) => {
  const overviewStats = [
    {
      label: "Total Schools",
      value: statistics.overview.totalSchools,
      icon: School,
      color: "text-blue-600",
    },
    {
      label: "Total Teachers",
      value: statistics.overview.totalTeachers,
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      label: "Total Students",
      value: statistics.overview.totalStudents,
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Total Classes",
      value: statistics.overview.totalClasses,
      icon: Building2,
      color: "text-orange-600",
    },
    {
      label: "Total Subjects",
      value: statistics.overview.totalSubjects,
      icon: BookOpen,
      color: "text-red-600",
    },
    {
      label: "Total Parents",
      value: statistics.overview.totalParents,
      icon: UserCheck,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {overviewStats.map((stat, index) => {
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

