"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowRight, User } from "lucide-react";

interface ClassScheduleItem {
  id: string;
  course: string;
  code: string;
  time: string;
  day: string;
  teacher: string;
  isToday: boolean;
}

const todaySchedule: ClassScheduleItem[] = [
  {
    id: "1",
    course: "Advanced Mathematics",
    code: "MATH 301",
    time: "09:00 - 10:30",
    day: "Monday",
    teacher: "Dr. Sarah Johnson",
    isToday: true,
  },
  {
    id: "2",
    course: "Computer Science Fundamentals",
    code: "CS 101",
    time: "11:00 - 12:30",
    day: "Monday",
    teacher: "Prof. Michael Chen",
    isToday: true,
  },
  {
    id: "3",
    course: "English Literature",
    code: "ENG 205",
    time: "14:00 - 15:30",
    day: "Monday",
    teacher: "Dr. Emily Roberts",
    isToday: true,
  },
];

export function ClassScheduleSummary() {
  return (
    <Card className="shadow-lg bg-white h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="size-4 text-green-400" />
          Today&apos;s Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {todaySchedule.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border-l-4 border-l-brand-primary"
            >
              <div className="space-y-1 flex-1">
                <div className="font-medium text-sm">{item.course}</div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.code}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-brand-light-accent-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-brand-light-accent-1">
                  <User className="h-3 w-3" />
                  <span>{item.teacher}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            alert("View All Performance Clicked");
          }}
          className="w-full"
          variant="outline"
        >
          View All Performance
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
