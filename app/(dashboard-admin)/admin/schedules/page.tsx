"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import TimetableGrid from "@/components/teacher/schedules/TimetableGrid";
import AddPeriodDialog from "@/components/teacher/schedules/AddPeriodDialog";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";

// Define types for API integration
interface ApiScheduleResponse {
  success: boolean;
  message: string;
  data: {
    class: string;
    timeSlots: string[];
    schedule: {
      MONDAY: ApiPeriod[];
      TUESDAY: ApiPeriod[];
      WEDNESDAY: ApiPeriod[];
      THURSDAY: ApiPeriod[];
      FRIDAY: ApiPeriod[];
    };
  };
}

interface ApiPeriod {
  id: string;
  subject: string;
  teacher: string;
  timeSlot: string;
  // Add other fields as they come from the API
}

// Define a type for a period (existing structure for grid)
type Period = {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
};

const classes = [
  { id: "jss1", name: "JSS1" },
  { id: "jss2", name: "JSS2" },
  { id: "jss3", name: "JSS3" },
  { id: "ss1", name: "SS1" },
  { id: "ss2", name: "SS2" },
  { id: "ss3", name: "SS3" },
];

const subjects = [
  { id: "math", name: "Mathematics", color: "#3B82F6" },
  { id: "english", name: "English Language", color: "#10B981" },
  { id: "physics", name: "Physics", color: "#8B5CF6" },
  { id: "chemistry", name: "Chemistry", color: "#F59E0B" },
  { id: "biology", name: "Biology", color: "#EF4444" },
  { id: "history", name: "History", color: "#6B7280" },
];

const teachers = [
  { id: "teacher1", name: "Mr. Johnson" },
  { id: "teacher2", name: "Mrs. Smith" },
  { id: "teacher3", name: "Dr. Williams" },
  { id: "teacher4", name: "Ms. Brown" },
];

// Skeleton component for loading state
const TimetableSkeleton = ({ timeSlots }: { timeSlots: string[] }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  // Use dynamic timeSlots from API, fallback to default if empty
  const displayTimeSlots =
    timeSlots.length > 0
      ? timeSlots
      : Array.from({ length: 8 }, (_, i) => `${8 + i}:00-${9 + i}:00`);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] lg:min-w-full">
        {/* Header with time slots - matching TimetableGrid layout */}
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
          {displayTimeSlots.map((timeSlot) => (
            <div
              key={timeSlot}
              className="p-2 lg:p-3 font-medium text-center bg-brand-border rounded-lg"
            >
              <span className="text-xs lg:text-sm">
                {timeSlot.replace("-", " - ")}
              </span>
            </div>
          ))}
        </div>

        {/* Days and skeleton periods - matching TimetableGrid layout */}
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
            {displayTimeSlots.map((timeSlot) => (
              <div
                key={`${day}-${timeSlot}`}
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

// Mock timetable data (removed - now using API data)
// const mockTimetableData: Period[] = [...]

const AdminSchedulesPage = () => {
  // State management
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  // API state
  const [scheduleData, setScheduleData] = useState<
    ApiScheduleResponse["data"] | null
  >(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Fetch class schedule from API
  const fetchClassSchedule = useCallback(async (className: string) => {
    try {
      setIsLoadingSchedule(true);
      setScheduleError(null);

      // Using POST method as GET with body is not standard
      const response = await authenticatedApi.post(
        "/director/schedules/timetable",
        {
          class: className.toLowerCase(),
        }
      );

      if (response.success) {
        const apiData = response.data as ApiScheduleResponse["data"];
        setScheduleData(apiData);
        setTimeSlots(apiData.timeSlots || []);
      } else {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch class schedule",
          response.statusCode || 400,
          response
        );
      }
    } catch (error: unknown) {
      let errorMessage =
        "An unexpected error occurred while loading the schedule.";

      if (error instanceof AuthenticatedApiError) {
        if (error.statusCode === 401) {
          errorMessage = "Your session has expired. Please login again.";
        } else if (error.statusCode === 403) {
          errorMessage = "You don't have permission to access this schedule.";
        } else {
          errorMessage = error.message;
        }
      }

      setScheduleError(errorMessage);
      setShowErrorModal(true);
      setScheduleData(null); // Clear any existing data on error
    } finally {
      setIsLoadingSchedule(false);
    }
  }, []);

  // Set default selected class and fetch its schedule on mount
  useEffect(() => {
    if (selectedClass === "" && classes.length > 0) {
      const defaultClass = classes[0].id;
      setSelectedClass(defaultClass);
      fetchClassSchedule(defaultClass);
    }
  }, [fetchClassSchedule, selectedClass]);

  // Handle class selection change
  const handleClassChange = useCallback(
    (classId: string) => {
      setSelectedClass(classId);
      fetchClassSchedule(classId);
    },
    [fetchClassSchedule]
  );

  // Retry mechanism
  const handleRetry = () => {
    setShowErrorModal(false);
    if (selectedClass) {
      fetchClassSchedule(selectedClass);
    }
  };

  // Convert API data to grid format
  const convertApiDataToGridFormat = useCallback(
    (apiData: ApiScheduleResponse["data"] | null): Period[] => {
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
          dayPeriods.forEach((period: ApiPeriod) => {
            periods.push({
              id: period.id || `${apiDay}-${period.timeSlot}`,
              classId: selectedClass,
              day: dayName,
              timeSlot: period.timeSlot,
              subjectId: period.subject || "",
              teacherId: period.teacher || "",
            });
          });
        }
      });

      return periods;
    },
    [selectedClass]
  );

  const handleAddPeriod = (periodData: Period) => {
    console.log("Adding period:", periodData);
    // Here you would make an API call to save the period
    setIsAddDialogOpen(false);
  };

  const handleEditPeriod = (period: Period) => {
    setEditingPeriod(period);
    setIsAddDialogOpen(true);
  };

  // Get current class data and schedule
  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const classSchedule = convertApiDataToGridFormat(scheduleData);

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
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            disabled={!selectedClass}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </Button>
        </div>

        {/* Class Selection as Badges */}
        <div className="flex items-center gap-2 mb-2">
          {classes.map((cls, idx) => (
            <button
              key={cls.id}
              type="button"
              disabled={isLoadingSchedule}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors relative
          ${
            selectedClass
              ? selectedClass === cls.id
                ? "bg-brand-primary text-white"
                : "border border-brand-border bg-white text-brand-light-accent-1 cursor-pointer hover:bg-gray-50"
              : idx === 0
              ? "bg-brand-primary text-white"
              : "border border-brand-border bg-white text-brand-light-accent-1"
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
          ))}
        </div>
        {selectedClassData && (
          <div className="text-sm text-brand-light-accent-1 my-4">
            Viewing timetable for <strong>{selectedClassData.name}</strong>
          </div>
        )}

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
        {!selectedClass && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Timetable</CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableSkeleton timeSlots={[]} />
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Period Dialog */}
        <AddPeriodDialog
          isOpen={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingPeriod(null);
          }}
          onSubmit={handleAddPeriod}
          subjects={subjects}
          teachers={teachers}
          editingPeriod={editingPeriod ?? undefined}
          selectedClass={selectedClass}
        />

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Failed to Load Schedule
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">{scheduleError}</p>
              <div className="flex gap-3">
                <Button onClick={handleRetry} className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
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
