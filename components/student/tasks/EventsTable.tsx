"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "ongoing" | "finished";
  type: string;
}

const eventsData: Event[] = [
  {
    id: "1",
    title: "Final Exam - Advanced Mathematics",
    date: "2024-06-17", // Monday
    time: "09:00 - 12:00",
    location: "Exam Hall A",
    status: "pending",
    type: "Exam",
  },
  {
    id: "2",
    title: "Student Council Meeting",
    date: "2024-06-18", // Tuesday
    time: "14:00 - 16:00",
    location: "Conference Room",
    status: "ongoing",
    type: "Meeting",
  },
  {
    id: "3",
    title: "Science Fair Presentation",
    date: "2024-06-19", // Wednesday
    time: "10:00 - 17:00",
    location: "Main Auditorium",
    status: "finished",
    type: "Event",
  },
  {
    id: "4",
    title: "Group Project Submission",
    date: "2024-06-20", // Thursday
    time: "23:59",
    location: "Online Portal",
    status: "pending",
    type: "Assignment",
  },
  {
    id: "5",
    title: "Career Fair 2024",
    date: "2024-06-21", // Friday
    time: "09:00 - 18:00",
    location: "Sports Complex",
    status: "finished",
    type: "Fair",
  },
  {
    id: "6",
    title: "Workshop: Research Methods",
    date: "2024-06-17", // Monday
    time: "13:00 - 16:00",
    location: "Library Seminar Room",
    status: "pending",
    type: "Workshop",
  },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const getStatusBadge = (status: Event["status"]) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
          Pending
        </Badge>
      );
    case "ongoing":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
          Ongoing
        </Badge>
      );
    case "finished":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
          Finished
        </Badge>
      );
  }
};

const getTypeBadge = (type: string) => {
  const colors = {
    Exam: "bg-red-100 text-red-700",
    Meeting: "bg-blue-100 text-blue-700",
    Event: "bg-purple-100 text-purple-700",
    Assignment: "bg-yellow-100 text-yellow-700",
    Fair: "bg-indigo-100 text-indigo-700",
    Workshop: "bg-cyan-100 text-cyan-700",
  };

  const colorClass =
    colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700";

  return (
    <Badge variant="secondary" className={`${colorClass} text-xs`}>
      {type}
    </Badge>
  );
};

const getDayFromDate = (dateString: string) => {
  const date = new Date(dateString);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[date.getDay()];
};

export default function EventsTable() {
  const [activeDay, setActiveDay] = useState("Monday");

  const getFilteredEvents = (day: string) => {
    return eventsData.filter((event) => getDayFromDate(event.date) === day);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-brand-heading">
          <Calendar className="h-4 w-4" />
          My Weekly Events & Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4 bg-brand-border">
            {weekdays.map((day) => (
              <TabsTrigger key={day} value={day} className="text-sm">
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {weekdays.map((day) => (
            <TabsContent key={day} value={day}>
              <div className="rounded-lg border border-brand-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-brand-border">
                      <TableHead className="font-semibold">Event</TableHead>
                      <TableHead className="font-semibold">
                        Date & Time
                      </TableHead>
                      <TableHead className="font-semibold">Location</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredEvents(day).length > 0 ? (
                      getFilteredEvents(day).map((event) => (
                        <TableRow
                          key={event.id}
                          className="transition-colors hover:bg-brand-border/30"
                        >
                          <TableCell className="space-y-1">
                            <div className="font-medium text-foreground">
                              {event.title}
                            </div>
                            <div>{getTypeBadge(event.type)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm mb-1">
                              <Calendar className="h-3 w-3 text-brand-light-accent-1" />
                              <span className="font-medium">
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-brand-light-accent-1" />
                              <span className="text-brand-light-accent-1">
                                {event.time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3 text-brand-light-accent-1" />
                              <span>{event.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(event.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-brand-light-accent-1 py-8"
                        >
                          No events scheduled for {day}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
