"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, MapPin } from "lucide-react";

interface WeeklyEvent {
  id: string;
  title: string;
  type: "social" | "religious" | "sport" | "debate" | "academic";
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "today" | "completed";
}

const weeklyEvents: WeeklyEvent[] = [
  {
    id: "1",
    title: "Football Match vs. Central High",
    type: "sport",
    date: "Jun 12",
    time: "15:00",
    location: "Main Field",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Science Club Meeting",
    type: "academic",
    date: "Jun 11",
    time: "14:00",
    location: "Lab B-102",
    status: "today",
  },
  {
    id: "3",
    title: "Morning Prayer Assembly",
    type: "religious",
    date: "Jun 10",
    time: "08:00",
    location: "Main Hall",
    status: "completed",
  },
  {
    id: "4",
    title: "Debate Competition Finals",
    type: "debate",
    date: "Jun 14",
    time: "10:00",
    location: "Auditorium",
    status: "upcoming",
  },
];

const getStatusBadge = (status: WeeklyEvent["status"]) => {
  switch (status) {
    case "upcoming":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
          Upcoming
        </Badge>
      );
    case "today":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
          Today
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs">
          Completed
        </Badge>
      );
  }
};

const getTypeBadge = (type: WeeklyEvent["type"]) => {
  const colors = {
    social: "bg-pink-100 text-pink-700",
    religious: "bg-purple-100 text-purple-700",
    sport: "bg-orange-100 text-orange-700",
    debate: "bg-yellow-100 text-yellow-700",
    academic: "bg-cyan-100 text-cyan-700",
  };

  const colorClass = colors[type];

  return (
    <Badge variant="secondary" className={`${colorClass} text-xs capitalize`}>
      {type}
    </Badge>
  );
};

export function WeeklyEvents() {
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
          {weeklyEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-brand-border bg-brand-bg space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="font-medium text-sm">{event.title}</div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(event.type)}
                    <span className="text-xs text-brand-light-accent-1">
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-light-accent-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
                {getStatusBadge(event.status)}
              </div>
            </div>
          ))}
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
