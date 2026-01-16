"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimetableGrid from "@/components/teacher/schedules/TimetableGrid";
import { TimetableSkeleton } from "./TimetableSkeleton";
import { type TimetableSchedulePeriod, type TimetableSchedule } from "@/hooks/schedules/use-schedules";

interface Period {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
}

interface TimetableViewProps {
  selectedClass: string;
  selectedClassName: string | null;
  scheduleData: TimetableSchedule | undefined;
  isLoadingSchedule: boolean;
  scheduleError: Error | null;
  periods: Period[];
  subjects: Array<{ id: string; name: string; color: string }>;
  teachers: Array<{ id: string; name: string }>;
  timeSlots: Array<{
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    timeSlot: string;
  }>;
  onEditPeriod: (period: Period) => void;
}

export const TimetableView = ({
  selectedClass,
  selectedClassName,
  scheduleData,
  isLoadingSchedule,
  scheduleError,
  periods,
  subjects,
  teachers,
  timeSlots,
  onEditPeriod,
}: TimetableViewProps) => {
  if (!selectedClass) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableSkeleton timeSlots={[]} />
        </CardContent>
      </Card>
    );
  }

  // Check if no time slots exist
  const hasTimeSlots = timeSlots.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable - {selectedClassName || "Loading..."}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingSchedule ? (
          <TimetableSkeleton timeSlots={timeSlots.map((slot) => slot.timeSlot)} />
        ) : scheduleError ? (
          <div className="text-center py-8 text-red-600">
            {scheduleError.message || "Failed to load schedule"}
          </div>
        ) : !hasTimeSlots ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-brand-heading mb-2">
                No Time Slots Created
              </h3>
              <p className="text-sm text-brand-light-accent-1 mb-4">
                You need to create time slots before you can schedule classes. Go to the &quot;Time Slots&quot; tab to create your first time slot.
              </p>
            </div>
          </div>
        ) : (
          <TimetableGrid
            periods={periods}
            subjects={subjects}
            teachers={teachers}
            timeSlots={timeSlots}
            onEdit={onEditPeriod}
          />
        )}
      </CardContent>
    </Card>
  );
};

