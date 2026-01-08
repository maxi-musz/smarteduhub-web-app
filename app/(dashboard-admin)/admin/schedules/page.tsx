"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, AlertCircle, RefreshCw, Clock } from "lucide-react";
import TimetableGrid from "@/components/teacher/schedules/TimetableGrid";
import AddPeriodDialog from "@/components/teacher/schedules/AddPeriodDialog";
import TimeSlotManagement from "@/components/teacher/schedules/TimeSlotManagement";
import {
  useTimetableSchedule,
  useTimetableOptions,
  useCreateTimetableEntry,
  type TimetableSchedulePeriod,
} from "@/hooks/schedules/use-schedules";
import { useToast } from "@/hooks/use-toast";

// Define a type for a period (for grid display)
type Period = {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
};

// Skeleton component for loading state
const TimetableSkeleton = ({ timeSlots }: { timeSlots: string[] }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const displayTimeSlots =
    timeSlots.length > 0
      ? timeSlots
      : Array.from({ length: 8 }, (_, i) => `${8 + i}:00-${9 + i}:00`);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] lg:min-w-full">
        <div
          className={`grid gap-1 mb-2`}
          style={{
            gridTemplateColumns: `1fr repeat(${displayTimeSlots.length}, 1fr)`,
          }}
        >
          <div className="p-2 lg:p-3 font-semibold text-center bg-brand-border rounded-lg">
            <div className="w-4 h-4 mx-auto mb-1 bg-gray-300 rounded animate-pulse"></div>
            <span className="text-xs lg:text-sm">Time</span>
          </div>
          {displayTimeSlots.map((timeSlot, index) => (
            <div
              key={`skeleton-${index}-${timeSlot}`}
              className="p-2 lg:p-3 font-medium text-center bg-brand-border rounded-lg"
            >
              <span className="text-xs lg:text-sm">
                {String(timeSlot).replace("-", " - ")}
              </span>
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div
            key={day}
            className={`grid gap-1 mb-2`}
            style={{
              gridTemplateColumns: `1fr repeat(${displayTimeSlots.length}, 1fr)`,
            }}
          >
            <div className="p-3 lg:p-4 font-semibold text-center bg-brand-primary text-white rounded-lg flex items-center justify-center">
              <span className="text-sm lg:text-base">{day}</span>
            </div>
            {displayTimeSlots.map((timeSlot, index) => (
              <div
                key={`${day}-skeleton-${index}-${timeSlot}`}
                className="min-h-[60px] lg:min-h-[80px] border-2 border-dashed border-brand-border rounded-lg relative"
              >
                <div className="h-full p-1 lg:p-2 rounded-lg">
                  <div className="h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
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
  const classes = timetableOptions?.classes || [];

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
  React.useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  // Handle class selection change
  const handleClassChange = useCallback((classId: string) => {
    setSelectedClass(classId);
  }, []);

  // Convert API data to grid format
  const convertApiDataToGridFormat = useCallback(
    (apiData: typeof scheduleData): Period[] => {
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
          // Don't close the dialog on error - keep the form data so user can fix and retry
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

  // Get current class data and schedule
  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const classSchedule = convertApiDataToGridFormat(scheduleData);

  // Format time slots for display - include labels for TimetableGrid
  const timeSlots = scheduleData?.timeSlots
    ? scheduleData.timeSlots
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
  const subjectsFromSchedule = new Map<string, { id: string; name: string; color: string }>();
  const teachersFromSchedule = new Map<string, { id: string; name: string }>();

  if (scheduleData?.schedule) {
    Object.values(scheduleData.schedule).forEach((dayPeriods) => {
      dayPeriods.forEach((period) => {
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
    });
  }

  // Combine schedule data with options to ensure we have all subjects/teachers
  const subjects = Array.from(subjectsFromSchedule.values()).length > 0
    ? Array.from(subjectsFromSchedule.values())
    : (timetableOptions?.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        color: s.color || "#3B82F6",
      })) || []);

  const teachers = Array.from(teachersFromSchedule.values()).length > 0
    ? Array.from(teachersFromSchedule.values())
    : (timetableOptions?.teachers || []);

  return (
    <div className="min-h-screen py-6 space-y-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">
              Class Schedules
            </h1>
            <p className="text-brand-light-accent-1 mt-1">
              Manage and view class timetables
            </p>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="timetable" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="time-slots">Time Slots</TabsTrigger>
          </TabsList>

          {/* Timetable Tab */}
          <TabsContent value="timetable" className="space-y-4">
            {/* Class Selection */}
            <div className="flex items-center gap-2 mb-2">
              {isLoadingOptions ? (
                <div className="flex items-center gap-2 text-brand-light-accent-1">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading classes...
                </div>
              ) : (
                classes.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    disabled={isLoadingSchedule}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors relative
                      ${
                        selectedClass === cls.id
                          ? "bg-brand-primary text-white"
                          : "border border-brand-border bg-white text-brand-light-accent-1 cursor-pointer hover:bg-gray-50"
                      }
                      ${isLoadingSchedule ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    onClick={() => handleClassChange(cls.id)}
                  >
                    {cls.name}
                    {isLoadingSchedule && selectedClass === cls.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            {selectedClassData && (
              <div className="text-sm text-brand-light-accent-1 my-4">
                Viewing timetable for <strong>{selectedClassData.name}</strong>
              </div>
            )}

            {/* Add Period Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                disabled={!selectedClass || isLoadingOptions}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Period
              </Button>
            </div>

            {/* Timetable Grid */}
            {selectedClass && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Weekly Timetable - {selectedClassData?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingSchedule ? (
                    <TimetableSkeleton timeSlots={timeSlots} />
                  ) : scheduleError ? (
                    <div className="text-center py-8 text-red-600">
                      {scheduleError.message || "Failed to load schedule"}
                    </div>
                  ) : (
                    <TimetableGrid
                      periods={classSchedule}
                      subjects={subjects}
                      teachers={teachers}
                      timeSlots={timeSlots}
                      onEdit={handleEditPeriod}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Show skeleton on initial load when no class selected yet */}
            {!selectedClass && !isLoadingOptions && (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Timetable</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimetableSkeleton timeSlots={[]} />
                </CardContent>
              </Card>
            )}
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
          selectedClass={selectedClass}
          selectedClassId={selectedClass}
          selectedClassName={selectedClassName}
        />

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Error
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowErrorModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminSchedulesPage;
