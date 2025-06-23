"use client";

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
import { Clock, MapPin, User } from "lucide-react";
import { useState } from "react";

interface ClassScheduleItem {
  id: string;
  course: string;
  code: string;
  time: string;
  location: string;
  instructor: string;
  day: string;
  isToday: boolean;
}

const scheduleData: ClassScheduleItem[] = [
  {
    id: "1",
    course: "Advanced Mathematics",
    code: "MATH 301",
    time: "09:00 - 10:30",
    location: "Room A-205",
    instructor: "Mrs. Chidinma Okafor",
    day: "Monday",
    isToday: true,
  },
  {
    id: "2",
    course: "Computer Science Fundamentals",
    code: "CS 101",
    time: "11:00 - 12:30",
    location: "Lab B-102",
    instructor: "Mr. Tunde Balogun",
    day: "Monday",
    isToday: true,
  },
  {
    id: "3",
    course: "English Literature",
    code: "ENG 205",
    time: "14:00 - 15:30",
    location: "Room C-301",
    instructor: "Mrs. Aisha Bello",
    day: "Monday",
    isToday: true,
  },
  {
    id: "4",
    course: "Physics Laboratory",
    code: "PHY 151",
    time: "10:00 - 12:00",
    location: "Physics Lab",
    instructor: "Mr. Emeka Nwosu",
    day: "Tuesday",
    isToday: false,
  },
  {
    id: "5",
    course: "History of Art",
    code: "ART 200",
    time: "13:00 - 14:30",
    location: "Room D-401",
    instructor: "Mrs. Funke Adeyemi",
    day: "Wednesday",
    isToday: false,
  },
  {
    id: "6",
    course: "Chemistry Lab",
    code: "CHEM 102",
    time: "15:00 - 17:00",
    location: "Chemistry Lab A",
    instructor: "Mr. Seyi Ogunleye",
    day: "Thursday",
    isToday: false,
  },
  {
    id: "7",
    course: "Statistics",
    code: "STAT 201",
    time: "09:00 - 10:30",
    location: "Room B-303",
    instructor: "Mrs. Grace Eze",
    day: "Friday",
    isToday: false,
  },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ClassScheduleTable() {
  const [activeDay, setActiveDay] = useState("Monday");

  const getFilteredSchedule = (day: string) => {
    return scheduleData.filter((item) => item.day === day);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-brand-heading">
          <Clock className="h-4 w-4" />
          My Weekly Time Table
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
                      <TableHead className="font-semibold">Course</TableHead>
                      <TableHead className="font-semibold">Time</TableHead>
                      <TableHead className="font-semibold">Location</TableHead>
                      <TableHead className="font-semibold">
                        Instructor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredSchedule(day).length > 0 ? (
                      getFilteredSchedule(day).map((item) => (
                        <TableRow
                          key={item.id}
                          className={`transition-colors hover:bg-white ${
                            item.isToday
                              ? "bg-blue-50/50 border-l-4 border-l-brand-primary"
                              : ""
                          }`}
                        >
                          <TableCell className="space-y-1">
                            <div className="font-medium text-brand-light-accent-1">
                              {item.course}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.code}
                              </Badge>
                              {item.isToday && (
                                <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
                                  Today
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-brand-light-accent-1" />
                              <span className="font-medium">{item.time}</span>
                            </div>
                            <div className="text-xs text-brand-light-accent-1">
                              {item.day}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3 text-brand-light-accent-1" />
                              <span>{item.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-3 w-3 text-brand-light-accent-1" />
                              <span>{item.instructor}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-brand-light-accent-1 py-8"
                        >
                          No classes scheduled for {day}
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
