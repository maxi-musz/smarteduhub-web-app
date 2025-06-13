import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Clock } from "lucide-react";
import { getWeekDays, getClassesForDay } from "@/utils/teacherClassesUtils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // <-- Correct import

export function TeacherClassesCarousel() {
  const router = useRouter(); // <-- Correct hook
  const weekDays = getWeekDays();

  return (
    <div className="mb-8 pt-6">
      <h2 className="text-lg font-medium mb-4 text-brand-heading">
        Quick Classes
      </h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            startIndex: 0, // Start with today
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
            {weekDays.map((day, index) => {
              const classes = getClassesForDay(day.name);

              return (
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
                      {classes.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {classes.map((item) => (
                            <li
                              key={item.id}
                              className="py-3 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">
                                  {item.subject}
                                  <span className="ml-2 text-xs text-gray-500">
                                    {item.subjectCode}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.startTime} - {item.endTime} •{" "}
                                  {item.room}
                                </p>
                              </div>
                              <div
                                className="w-3 h-12 rounded-md"
                                style={{ backgroundColor: item.color }}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 py-4 text-center">
                          {day.isToday
                            ? "No classes scheduled for today"
                            : `No classes scheduled for ${day.displayName.toLowerCase()}`}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
