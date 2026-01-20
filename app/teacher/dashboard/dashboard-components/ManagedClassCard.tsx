"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap } from "lucide-react";
import type { TeacherDashboard } from "@/hooks/teacher/use-teacher-data";

interface ManagedClassCardProps {
  dashboardData: TeacherDashboard | undefined;
  isLoading: boolean;
}

export const ManagedClassCard = ({
  dashboardData,
  isLoading,
}: ManagedClassCardProps) => {
  const managedClass = dashboardData?.managed_class;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!managedClass || !managedClass.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-brand-primary" />
            Managed Class
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            You are not currently managing any class
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-brand-primary" />
          Managed Class
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-brand-heading mb-2">
              {managedClass.name}
            </h3>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-lg font-semibold">
                    {managedClass.students.total}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Males</p>
                  <p className="font-medium">{managedClass.students.males}</p>
                </div>
                <div>
                  <p className="text-gray-500">Females</p>
                  <p className="font-medium">{managedClass.students.females}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

