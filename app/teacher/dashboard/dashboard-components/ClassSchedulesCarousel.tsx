"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import type { TeacherDashboard } from "@/hooks/teacher/use-teacher-data";
import { Badge } from "@/components/ui/badge";

interface ClassSchedulesCarouselProps {
  dashboardData: TeacherDashboard | undefined;
  isLoading: boolean;
}

export const ClassSchedulesCarousel = ({
  dashboardData,
  isLoading,
}: ClassSchedulesCarouselProps) => {
  const router = useRouter();

  const classSchedules = dashboardData?.class_schedules;
  const todaySchedule = classSchedules?.today;
  const tomorrowSchedule = classSchedules?.tomorrow;
  const dayAfterSchedule = classSchedules?.day_after_tomorrow;

  const scheduleDays = [
    {
      name: "today",
      displayName: "Today's Classes",
      day: todaySchedule?.day || "",
      schedule: todaySchedule?.schedule || [],
      iconColor: "text-purple-500",
    },
    {
      name: "tomorrow",
      displayName: "Tomorrow's Classes",
      day: tomorrowSchedule?.day || "",
      schedule: tomorrowSchedule?.schedule || [],
      iconColor: "text-blue-500",
    },
    {
      name: "dayAfter",
      displayName: "Day After Tomorrow's Classes",
      day: dayAfterSchedule?.day || "",
      schedule: dayAfterSchedule?.schedule || [],
      iconColor: "text-green-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="mb-8 pt-6">
        <h2 className="text-lg font-medium mb-4 text-brand-heading">
          Quick Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full">
              <CardHeader className="pb-2">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="h-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 pt-6">
      <h2 className="text-lg font-medium mb-4 text-brand-heading">
        Quick Classes
      </h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            startIndex: 0,
          }}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <CarouselPrevious className="relative left-0 top-0 translate-x-0 translate-y-0" />
              <CarouselNext className="relative right-0 top-0 translate-x-0 translate-y-0" />
            </div>
            <Button
              onClick={() => {
                router.push("/teacher/schedules");
              }}
              variant="outline"
            >
              View Full Class Schedule
            </Button>
          </div>

          <CarouselContent className="-ml-4">
            {scheduleDays.map((day) => (
              <CarouselItem
                key={day.name}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className={`h-5 w-5 mr-2 ${day.iconColor}`} />
                      {day.displayName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {day.schedule.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {day.schedule.map((item, index) => (
                          <li
                            key={`${day.name}-${index}`}
                            className="py-3 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  style={{
                                    backgroundColor: item.subject.color || "#3B82F6",
                                    color: "white",
                                  }}
                                  className="text-xs capitalize"
                                >
                                  {item.subject.name}
                                </Badge>
                                {item.subject.code && (
                                  <span className="text-xs text-gray-500">
                                    {item.subject.code}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium">
                                {item.class.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.time.from} - {item.time.to} • {item.room || "TBA"}
                              </p>
                            </div>
                            <div
                              className="w-3 h-12 rounded-md"
                              style={{
                                backgroundColor: item.subject.color || "#3B82F6",
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 py-4 text-center">
                        No classes scheduled for {day.displayName.toLowerCase()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

