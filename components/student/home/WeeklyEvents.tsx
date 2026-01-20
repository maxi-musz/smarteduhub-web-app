"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import type { Notification } from "@/hooks/student/use-student-dashboard";

interface WeeklyEventsProps {
  notifications: Notification[];
}

const getStatusBadge = (comingUpOn: string) => {
  const eventDate = new Date(comingUpOn);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time parts for comparison
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
        Today
      </Badge>
    );
  } else if (eventDate.getTime() === tomorrow.getTime()) {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
        Tomorrow
      </Badge>
    );
  } else if (eventDate > today) {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
        Upcoming
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs">
        Completed
      </Badge>
    );
  }
};

const getTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    social: "bg-pink-100 text-pink-700",
    religious: "bg-purple-100 text-purple-700",
    sport: "bg-orange-100 text-orange-700",
    debate: "bg-yellow-100 text-yellow-700",
    academic: "bg-cyan-100 text-cyan-700",
    students: "bg-blue-100 text-blue-700",
  };

  const colorClass = colors[type.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (
    <Badge variant="secondary" className={`${colorClass} text-xs capitalize`}>
      {type}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export function WeeklyEvents({ notifications }: WeeklyEventsProps) {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-primary" />
          This Week&apos;s Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-brand-light-accent-1">
              No upcoming events
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 rounded-lg border border-brand-border bg-brand-bg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(notification.type)}
                      <span className="text-xs text-brand-light-accent-1">
                        {formatDate(notification.comingUpOn)} • {formatTime(notification.comingUpOn)}
                      </span>
                    </div>
                    {notification.description && (
                      <div className="text-xs text-brand-light-accent-1 mt-1">
                        {notification.description}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(notification.comingUpOn)}
                </div>
              </div>
            ))
          )}
        </div>

        <Button
          onClick={() => {
            alert("View All Events Clicked");
          }}
          className="w-full"
        >
          View All Events
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
