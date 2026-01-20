"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import type { TeacherDashboard } from "@/hooks/teacher/use-teacher-data";

interface AnnouncementsCardProps {
  dashboardData: TeacherDashboard | undefined;
  isLoading: boolean;
}

export const AnnouncementsCard = ({
  dashboardData,
  isLoading,
}: AnnouncementsCardProps) => {
  const notifications = dashboardData?.recent_notifications || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2 text-brand-primary" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-brand-border">
            {notifications.map((notification) => {
              const date = new Date(notification.comingUpOn);
              const formattedDate = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <li key={notification.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      {notification.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline">{formattedDate}</Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 py-4 text-center">
            No announcements at this time
          </p>
        )}
      </CardContent>
    </Card>
  );
};

