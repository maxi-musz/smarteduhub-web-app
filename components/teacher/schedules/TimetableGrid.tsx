import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Define types for your data
interface Period {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
  isNew?: boolean;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface TimeSlotInfo {
  id?: string;
  label?: string;
  startTime?: string;
  endTime?: string;
  timeSlot: string; // The time slot string format (e.g., "08:45-09:30")
}

interface TimetableGridProps {
  periods: Period[];
  subjects: Subject[];
  teachers: Teacher[];
  onEdit: (period: Period) => void;
  timeSlots?: string[] | TimeSlotInfo[]; // Optional prop for dynamic time slots (can be strings or objects with labels)
}

const TimetableGrid: React.FC<TimetableGridProps> = ({
  periods,
  subjects,
  teachers,
  onEdit,
  timeSlots: propTimeSlots,
}) => {
  const isMobile = useIsMobile();

  // Use dynamic timeSlots from props only - no hardcoded fallback
  // Normalize timeSlots to TimeSlotInfo format
  const timeSlots: TimeSlotInfo[] =
    propTimeSlots && propTimeSlots.length > 0
      ? propTimeSlots.map((slot) => {
          if (typeof slot === "string") {
            return { timeSlot: slot };
          }
          return slot as TimeSlotInfo;
        }).filter((slot) => slot.timeSlot && slot.timeSlot !== "[object Object]")
      : [];

  const getPeriodForSlot = (day: string, timeSlot: string) => {
    return periods.find(
      (period) => period.day === day && period.timeSlot === timeSlot
    );
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
  };

  const getTeacherById = (id: string) => {
    return teachers.find((teacher) => teacher.id === id);
  };

  // If no time slots, return empty state
  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 text-brand-light-accent-1">
        No time slots available. Please create time slots first.
      </div>
    );
  }

  // Mobile layout - stacked by day
  if (isMobile) {
    return (
      <div className="space-y-4">
        {days.map((day) => (
          <div key={day} className="rounded-lg p-3">
            <h3 className="font-semibold text-lg mb-3 text-primary">{day}</h3>
            <div className="space-y-2">
              {timeSlots.map((timeSlot, slotIndex) => {
                const timeSlotStr = timeSlot.timeSlot;
                const period = getPeriodForSlot(day, timeSlotStr);
                const subject = period
                  ? getSubjectById(period.subjectId)
                  : null;
                const teacher = period
                  ? getTeacherById(period.teacherId)
                  : null;

                return (
                  <div
                    key={`${day}-${slotIndex}-${timeSlotStr}`}
                    className="flex items-center justify-between p-3 border border-red-500 rounded-lg min-h-[60px]"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-brand-light-accent-1 mb-1">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {timeSlot.timeSlot.replace("-", " - ")}
                          </span>
                          {timeSlot.label && (
                            <span className="text-xs text-brand-light-accent-1 mt-0.5">
                              {timeSlot.label}
                            </span>
                          )}
                        </div>
                      </div>
                      {period && subject && teacher ? (
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              backgroundColor: subject.color,
                              color: "white",
                            }}
                            className="text-xs capitalize"
                          >
                            {subject.name}
                          </Badge>
                          <span className="text-sm capitalize">{teacher.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-brand-light-accent-1">
                          No class scheduled
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-2 h-8 w-8"
                      onClick={() =>
                        period
                          ? onEdit(period)
                          : onEdit({
                              id: "",
                              classId: "",
                              subjectId: "",
                              teacherId: "",
                              day,
                              timeSlot: timeSlotStr,
                              isNew: true,
                            })
                      }
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Tablet and desktop layout - grid format
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] lg:min-w-full">
        {/* Header with time slots */}
        <div
          className={`grid gap-1 mb-2`}
          style={{
            gridTemplateColumns: `1fr repeat(${timeSlots.length}, 1fr)`,
          }}
        >
          <div className="p-2 lg:p-3 font-semibold text-center bg-brand-border rounded-lg">
            <Clock className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs lg:text-sm">Time</span>
          </div>
          {timeSlots.map((timeSlot, index) => (
            <div
              key={`time-slot-${index}-${timeSlot.timeSlot}`}
              className="p-2 lg:p-3 font-medium text-center bg-brand-border rounded-lg"
            >
              <div className="flex flex-col">
                <span className="text-xs lg:text-sm font-semibold">
                  {timeSlot.timeSlot.replace("-", " - ")}
                </span>
                {timeSlot.label && (
                  <span className="text-[10px] lg:text-xs text-brand-light-accent-1 mt-0.5">
                    {timeSlot.label}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Days and periods */}
        {days.map((day) => (
          <div
            key={day}
            className={`grid gap-1 mb-2`}
            style={{
              gridTemplateColumns: `1fr repeat(${timeSlots.length}, 1fr)`,
            }}
          >
            <div className="p-3 lg:p-4 font-semibold text-center bg-brand-primary text-white rounded-lg flex items-center justify-center">
              <span className="text-sm lg:text-base">{day}</span>
            </div>
            {timeSlots.map((timeSlot, slotIndex) => {
              const timeSlotStr = String(timeSlot);
              const period = getPeriodForSlot(day, timeSlotStr);
              const subject = period ? getSubjectById(period.subjectId) : null;
              const teacher = period ? getTeacherById(period.teacherId) : null;

              return (
                <div
                  key={`${day}-${slotIndex}-${timeSlotStr}`}
                  className="min-h-[60px] lg:min-h-[80px] border-2 border-dashed border-brand-primary rounded-lg hover:border-primary/50 transition-colors relative group"
                >
                  {period && subject && teacher ? (
                    <div
                      className="h-full p-1 lg:p-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        backgroundColor: `${subject.color}15`,
                        borderColor: subject.color,
                      }}
                      onClick={() => onEdit(period)}
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <Badge
                            style={{
                              backgroundColor: subject.color,
                              color: "white",
                            }}
                            className="text-[10px] lg:text-xs mb-1 capitalize"
                          >
                            {subject.name}
                          </Badge>
                          <p className="text-[10px] lg:text-xs font-medium text-brand-light-accent-1 line-clamp-2 capitalize">
                            {teacher.name}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-5 w-5 lg:h-6 lg:w-6 self-end"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(period);
                          }}
                        >
                          <Edit className="w-2 h-2 lg:w-3 lg:h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-brand-light-accent-1 hover:text-brand-primary transition-colors">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] lg:text-xs p-1 h-auto"
                        onClick={() =>
                          onEdit({
                            id: "",
                            classId: "",
                            subjectId: "",
                            teacherId: "",
                            day,
                            timeSlot: timeSlotStr,
                            isNew: true,
                          })
                        }
                      >
                        + Add Period
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
