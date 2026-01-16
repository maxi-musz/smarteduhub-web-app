"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddPeriodDialog from "@/components/teacher/schedules/AddPeriodDialog";
import TimeSlotManagement from "@/components/teacher/schedules/TimeSlotManagement";
import {
  useTimetableSchedule,
  useTimetableOptions,
  useCreateTimetableEntry,
  type TimetableSchedulePeriod,
  type TimetableOptions,
  type TimetableSchedule,
} from "@/hooks/schedules/use-schedules";
import { useToast } from "@/hooks/use-toast";
import {
  ScheduleHeader,
  ClassSelector,
  TimetableView,
  AddPeriodButton,
  ErrorModal,
} from "./schedule-components";

// Define a type for a period (for grid display)
type Period = {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
};

const AdminSchedulesPage = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch timetable options (classes, teachers, subjects, timeSlots)
  const { data: timetableOptions, isLoading: isLoadingOptions } = useTimetableOptions();

  // Get classes from options
  const classes = useMemo(
    () => (timetableOptions as TimetableOptions | undefined)?.classes || [],
    [timetableOptions]
  );

  // Get selected class name (API expects class name, not ID)
  const selectedClassName = classes.find((c) => c.id === selectedClass)?.name || null;

  // Fetch timetable schedule for selected class (using class name, not ID)
  const {
    data: scheduleData,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useTimetableSchedule(selectedClassName);

  // Create timetable entry mutation
  const createEntryMutation = useCreateTimetableEntry();

  // Set default selected class on mount
  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  // Handle class selection change
  const handleClassChange = useCallback(
    (classId: string) => {
      setSelectedClass(classId);
    },
    []
  );

  // Convert API data to grid format
  const convertApiDataToGridFormat = useCallback(
    (apiData: TimetableSchedule | undefined): Period[] => {
      if (!apiData || !apiData.schedule) return [];

      const periods: Period[] = [];
      const dayMapping: { [key: string]: string } = {
        MONDAY: "Monday",
        TUESDAY: "Tuesday",
        WEDNESDAY: "Wednesday",
        THURSDAY: "Thursday",
        FRIDAY: "Friday",
      };

      Object.entries(apiData.schedule).forEach(([apiDay, dayPeriods]) => {
        const dayName = dayMapping[apiDay];
        if (dayName && Array.isArray(dayPeriods)) {
          dayPeriods.forEach((period: TimetableSchedulePeriod) => {
            if (period.subject && period.teacher) {
              // Find the time slot string format for this period
              const timeSlotObj = apiData.timeSlots.find(
                (ts) => ts.id === period.timeSlotId
              );
              // Format timeSlot string to match the format used in timeSlots array
              const timeSlotString = timeSlotObj
                ? `${timeSlotObj.startTime}-${timeSlotObj.endTime}`
                : `${period.startTime}-${period.endTime}` || period.timeSlotId;

              periods.push({
                id: period.timeSlotId + "-" + apiDay,
                classId: selectedClass,
                day: dayName,
                timeSlot: timeSlotString,
                subjectId: period.subject.id,
                teacherId: period.teacher.id,
              });
            }
          });
        }
      });

      return periods;
    },
    [selectedClass]
  );

  // Handle add/edit period
  const handleAddPeriod = useCallback(
    (data: {
      class_id: string;
      subject_id: string;
      teacher_id: string;
      timeSlotId: string;
      day_of_week: string;
      room?: string;
      notes?: string;
    }) => {
      createEntryMutation.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Timetable entry created successfully",
          });
          setIsAddDialogOpen(false);
          setEditingPeriod(null);
        },
        onError: (error) => {
          // Don&apos;t close the dialog on error - keep the form data so user can fix and retry
          toast({
            title: "Error",
            description: error.message || "Failed to create timetable entry",
            variant: "destructive",
          });
          // Keep the dialog open and form data intact
        },
      });
    },
    [createEntryMutation, toast]
  );

  const handleEditPeriod = (period: Period) => {
    setEditingPeriod(period);
    setIsAddDialogOpen(true);
  };

  // Format time slots for display - include labels for TimetableGrid
  const typedScheduleData = scheduleData as TimetableSchedule | undefined;

  // Get current class data and schedule
  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const classSchedule = convertApiDataToGridFormat(typedScheduleData);
  const timeSlots = typedScheduleData?.timeSlots
    ? typedScheduleData.timeSlots
        .sort((a, b) => a.order - b.order)
        .map((slot) => ({
          id: slot.id,
          label: slot.label,
          startTime: slot.startTime,
          endTime: slot.endTime,
          timeSlot: `${slot.startTime}-${slot.endTime}`,
        }))
    : [];

  // Get subjects and teachers - prefer from schedule data if available, fallback to options
  // This ensures we have all subjects/teachers that are actually in the schedule
  const subjectsFromSchedule = new Map<
    string,
    { id: string; name: string; color: string }
  >();
  const teachersFromSchedule = new Map<string, { id: string; name: string }>();

  if (typedScheduleData?.schedule) {
    Object.values(typedScheduleData.schedule).forEach(
      (dayPeriods: TimetableSchedulePeriod[]) => {
        dayPeriods.forEach((period: TimetableSchedulePeriod) => {
          if (period.subject) {
            subjectsFromSchedule.set(period.subject.id, {
              id: period.subject.id,
              name: period.subject.name,
              color: period.subject.color || "#3B82F6",
            });
          }
          if (period.teacher) {
            teachersFromSchedule.set(period.teacher.id, {
              id: period.teacher.id,
              name: period.teacher.name,
            });
          }
        });
      }
    );
  }

  // Combine schedule data with options to ensure we have all subjects/teachers
  const typedTimetableOptions = timetableOptions as TimetableOptions | undefined;
  const subjects =
    Array.from(subjectsFromSchedule.values()).length > 0
      ? Array.from(subjectsFromSchedule.values())
      : typedTimetableOptions?.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          color: s.color || "#3B82F6",
        })) || [];

  const teachers =
    Array.from(teachersFromSchedule.values()).length > 0
      ? Array.from(teachersFromSchedule.values())
      : typedTimetableOptions?.teachers || [];

  // Handle error display
  useEffect(() => {
    if (scheduleError) {
      setErrorMessage(scheduleError.message || "Failed to load schedule");
      setShowErrorModal(true);
    }
  }, [scheduleError]);

  return (
    <div className="min-h-screen py-6 space-y-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        <ScheduleHeader />

        {/* Tabs for different views */}
        <Tabs defaultValue="timetable" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="time-slots">Time Slots</TabsTrigger>
          </TabsList>

          {/* Timetable Tab */}
          <TabsContent value="timetable" className="space-y-4">
            <ClassSelector
              classes={classes}
              selectedClass={selectedClass}
              isLoading={isLoadingOptions}
              isLoadingSchedule={isLoadingSchedule}
              onClassChange={handleClassChange}
            />

            {selectedClassData && (
              <div className="text-sm text-brand-light-accent-1 my-4">
                Viewing timetable for <strong>{selectedClassData.name}</strong>
              </div>
            )}

            <AddPeriodButton
              onClick={() => setIsAddDialogOpen(true)}
              disabled={!selectedClass || isLoadingOptions}
            />

            <TimetableView
              selectedClass={selectedClass}
              selectedClassName={selectedClassName}
              scheduleData={typedScheduleData}
              isLoadingSchedule={isLoadingSchedule}
              scheduleError={scheduleError}
              periods={classSchedule}
              subjects={subjects}
              teachers={teachers}
              timeSlots={timeSlots}
              onEditPeriod={handleEditPeriod}
            />
          </TabsContent>

          {/* Time Slots Management Tab */}
          <TabsContent value="time-slots">
            <TimeSlotManagement />
          </TabsContent>
        </Tabs>

        {/* Add/Edit Period Dialog */}
        <AddPeriodDialog
          isOpen={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingPeriod(null);
          }}
          onSubmit={handleAddPeriod}
          editingPeriod={editingPeriod ?? undefined}
          selectedClassId={selectedClass}
          selectedClassName={selectedClassName || undefined}
        />

        {/* Error Modal */}
        <ErrorModal
          open={showErrorModal}
          onOpenChange={setShowErrorModal}
          error={errorMessage}
        />
      </div>
    </div>
  );
};

export default AdminSchedulesPage;
