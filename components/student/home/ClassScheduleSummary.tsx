"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowRight, User } from "lucide-react";
import type { DaySchedule } from "@/hooks/student/use-student-dashboard";

interface ClassScheduleSummaryProps {
  schedule: {
    today: DaySchedule;
    tomorrow: DaySchedule;
    day_after_tomorrow: DaySchedule;
  };
}

export function ClassScheduleSummary({ schedule }: ClassScheduleSummaryProps) {
  const todaySchedule = schedule.today.schedule;
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
          {todaySchedule.length === 0 ? (
            <div className="text-center py-8 text-brand-light-accent-1">
              No classes scheduled for today
            </div>
          ) : (
            todaySchedule.map((item, index) => (
              <div
                key={`${item.subject.id}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border-l-4"
                style={{ borderLeftColor: item.subject.color }}
              >
                <div className="space-y-1 flex-1">
                  <div className="font-medium text-sm">{item.subject.name}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {item.subject.code}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-brand-light-accent-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.time.from} - {item.time.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-light-accent-1">
                    <User className="h-3 w-3" />
                    <span>{item.teacher.name}</span>
                  </div>
                </div>
              </div>
            ))
          )}
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
