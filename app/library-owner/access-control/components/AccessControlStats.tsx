"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldCheck, Building2, CheckCircle } from "lucide-react";

interface AccessControlStatsProps {
  totalGrants: number;
  activeGrants: number;
  schoolsWithAccess: number;
  isLoading?: boolean;
}

export function AccessControlStats({
  totalGrants,
  activeGrants,
  schoolsWithAccess,
  isLoading,
}: AccessControlStatsProps) {
  const stats = [
    {
      label: "Total Access Grants",
      value: totalGrants,
      icon: ShieldCheck,
      color: "text-brand-primary",
      bgColor: "bg-brand-primary/10",
    },
    {
      label: "Active Grants",
      value: activeGrants,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Schools with Access",
      value: schoolsWithAccess,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-brand-light-accent-1">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-heading">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
