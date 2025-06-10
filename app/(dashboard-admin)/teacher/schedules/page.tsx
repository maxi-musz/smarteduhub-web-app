"use client";

import React, { useState } from "react";
import { mockSchedule } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Weekdays for tabs
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TeacherSchedulesPage = () => {
  const [selectedDay, setSelectedDay] = useState(weekdays[0]);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");

  // Filter schedule for selected day
  const daySchedule = mockSchedule.filter((item) => item.day === selectedDay);

  // Current "week" - in a real app, this would be dynamic
  const currentWeek = "Oct 23 - Oct 27, 2025";

  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 8 + i;
    return `${hour}:00`;
  });

  return (
    <div className="content-area">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
          <p className="text-gray-500 text-sm">Manage your teaching schedule</p>
        </div>
        <Button className="bg-edu-primary hover:bg-edu-primary/90">
          <Plus className="h-4 w-4 mr-1" />
          Add Class
        </Button>
      </div>

      {/* Weekly Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-edu-primary" />
              <span className="font-medium">{currentWeek}</span>
            </div>

            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View toggles */}
      <div className="flex justify-end mb-4">
        <div className="flex border rounded-md">
          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-1 text-sm ${
              viewMode === "week"
                ? "bg-edu-primary text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`px-3 py-1 text-sm ${
              viewMode === "day"
                ? "bg-edu-primary text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {viewMode === "week" ? (
        /* Week View */
        <Tabs
          defaultValue={selectedDay}
          onValueChange={(value) => setSelectedDay(value)}
        >
          <TabsList className="grid grid-cols-5 mb-6">
            {weekdays.map((day) => (
              <TabsTrigger key={day} value={day}>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {weekdays.map((day) => (
            <TabsContent key={day} value={day}>
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">
                    {day}&apos;s Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockSchedule.filter((item) => item.day === day).length >
                  0 ? (
                    <div className="space-y-4">
                      {mockSchedule
                        .filter((item) => item.day === day)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex p-3 border rounded-md relative overflow-hidden card-hover"
                          >
                            <div
                              className="absolute left-0 top-0 bottom-0 w-2"
                              style={{ backgroundColor: item.color }}
                            />
                            <div className="ml-4">
                              <h3 className="font-medium">
                                {item.subject}
                                <span className="ml-2 text-xs text-gray-500">
                                  {item.subjectCode}
                                </span>
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.startTime} - {item.endTime}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.room}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">
                      No classes scheduled for {day}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        /* Day View - Calendar-like */
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center justify-between">
              <span>{selectedDay}&apos;s Schedule</span>
              <div className="flex gap-2">
                {weekdays.map((day) => (
                  <Button
                    key={day}
                    variant={day === selectedDay ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                    className={day === selectedDay ? "bg-edu-primary" : ""}
                  >
                    {day.charAt(0)}
                  </Button>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-[80px_1fr] divide-x">
              <div className="text-right pr-2 py-2 bg-gray-50">
                {timeSlots.map((time) => (
                  <div key={time} className="h-20 text-xs text-gray-500 pt-1">
                    {time}
                  </div>
                ))}
              </div>
              <div className="relative min-h-[40rem]">
                {daySchedule.map((item) => {
                  // Calculate position and height based on start/end time
                  const startHour = parseInt(item.startTime.split(":")[0]);
                  const startMinute = parseInt(
                    item.startTime.split(":")[1] || "0"
                  );
                  const endHour = parseInt(item.endTime.split(":")[0]);
                  const endMinute = parseInt(item.endTime.split(":")[1] || "0");

                  const top = (startHour - 8 + startMinute / 60) * 5 + "rem";
                  const duration =
                    endHour - startHour + (endMinute - startMinute) / 60;
                  const height = duration * 5 + "rem";

                  return (
                    <div
                      key={item.id}
                      className="absolute left-2 right-2 rounded-md p-2 overflow-hidden"
                      style={{
                        top,
                        height,
                        backgroundColor: item.color + "30", // Add transparency
                        borderLeft: `4px solid ${item.color}`,
                      }}
                    >
                      <h4 className="font-medium text-sm">{item.subject}</h4>
                      <p className="text-xs text-gray-700">
                        {item.startTime} - {item.endTime}
                      </p>
                      <p className="text-xs text-gray-500">{item.room}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherSchedulesPage;
