"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { useTimetableOptions, useTimetableSchedule, useCreateTimeSlot } from "@/hooks/schedules/use-schedules";
import { useToast } from "@/hooks/use-toast";

// Define types for subject and teacher
interface Subject {
  id: string;
  name: string;
  color: string | null;
}
interface Teacher {
  id: string;
  name: string;
}
interface PeriodFormData {
  day: string;
  timeSlotId: string;
  subjectId: string;
  teacherId: string;
  room?: string;
  notes?: string;
  // Custom time entry
  useCustomTime: boolean;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}
interface Period {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
}

const days = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
];

// Generate hours (00-23)
const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: hour, label: hour };
});

// Generate minutes (00, 15, 30, 45)
const minutes = [
  { value: "00", label: "00" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "45", label: "45" },
];

interface AddPeriodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    class_id: string;
    subject_id: string;
    teacher_id: string;
    timeSlotId: string;
    day_of_week: string;
    room?: string;
    notes?: string;
  }) => void;
  editingPeriod?: Period;
  selectedClass: string;
  selectedClassId?: string;
  selectedClassName?: string; // Class name for fetching schedule
}

const AddPeriodDialog: React.FC<AddPeriodDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingPeriod,
  selectedClass,
  selectedClassId,
  selectedClassName,
}) => {
  const { toast } = useToast();
  const { data: timetableOptions, isLoading } = useTimetableOptions();
  const { data: scheduleData } = useTimetableSchedule(selectedClassName || null);
  const createTimeSlotMutation = useCreateTimeSlot();

  const [formData, setFormData] = useState<PeriodFormData>({
    day: "",
    timeSlotId: "",
    subjectId: "",
    teacherId: "",
    room: "",
    notes: "",
    useCustomTime: false,
    startHour: "08",
    startMinute: "00",
    endHour: "09",
    endMinute: "00",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCreatingTimeSlot, setIsCreatingTimeSlot] = useState(false);

  // Track if dialog was just opened to initialize form only once
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only reset form when dialog closes
    if (!isOpen) {
      setFormData({
        day: "",
        timeSlotId: "",
        subjectId: "",
        teacherId: "",
        room: "",
        notes: "",
        useCustomTime: false,
        startHour: "08",
        startMinute: "00",
        endHour: "09",
        endMinute: "00",
      });
      setValidationError(null);
      setIsInitialized(false);
      return;
    }

    // Initialize form only when dialog opens (not on every render)
    if (isOpen && !isInitialized) {
      if (editingPeriod) {
        // Map editing period to new format
        const dayMapping: { [key: string]: string } = {
          Monday: "MONDAY",
          Tuesday: "TUESDAY",
          Wednesday: "WEDNESDAY",
          Thursday: "THURSDAY",
          Friday: "FRIDAY",
        };
        setFormData({
          day: dayMapping[editingPeriod.day] || editingPeriod.day || "",
          timeSlotId: editingPeriod.timeSlot || "",
          subjectId: editingPeriod.subjectId || "",
          teacherId: editingPeriod.teacherId || "",
          room: "",
          notes: "",
          useCustomTime: false,
          startHour: "08",
          startMinute: "00",
          endHour: "09",
          endMinute: "00",
        });
      }
      setIsInitialized(true);
      setValidationError(null);
    }
  }, [editingPeriod, isOpen, isInitialized]);

  // Check for time conflicts
  const checkTimeConflict = (
    day: string,
    startTime: string,
    endTime: string
  ): boolean => {
    if (!scheduleData?.schedule || !day) return false;

    const daySchedule = scheduleData.schedule[day as keyof typeof scheduleData.schedule];
    if (!daySchedule || !Array.isArray(daySchedule)) return false;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return daySchedule.some((period) => {
      // Only check periods that have a subject and teacher (actual scheduled periods)
      if (!period.subject || !period.teacher || !period.startTime || !period.endTime) {
        return false;
      }
      
      const periodStart = timeToMinutes(period.startTime);
      const periodEnd = timeToMinutes(period.endTime);

      // Check for overlap: periods overlap if new starts before existing ends AND new ends after existing starts
      // Also check for exact match
      return (
        (startMinutes < periodEnd && endMinutes > periodStart) ||
        (startMinutes === periodStart && endMinutes === periodEnd)
      );
    });
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (hour: string, minute: string): string => {
    return `${hour}:${minute}`;
  };

  const validateTime = (): string | null => {
    if (!formData.useCustomTime) {
      if (!formData.timeSlotId) {
        return "Please select a time slot or enter custom time";
      }
      return null;
    }

    const startTime = formatTime(formData.startHour, formData.startMinute);
    const endTime = formatTime(formData.endHour, formData.endMinute);

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return "End time must be after start time";
    }

    if (formData.day && checkTimeConflict(formData.day, startTime, endTime)) {
      return "This time slot conflicts with an existing period on this day";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedClassId) {
      setValidationError("Class is required");
      return;
    }

    const timeError = validateTime();
    if (timeError) {
      setValidationError(timeError);
      return;
    }

    let finalTimeSlotId = formData.timeSlotId;

    // If using custom time, find or create time slot
    if (formData.useCustomTime) {
      const startTime = formatTime(formData.startHour, formData.startMinute);
      const endTime = formatTime(formData.endHour, formData.endMinute);

      // First, try to find an existing time slot with the same times
      const existingTimeSlot = timetableOptions?.timeSlots.find(
        (slot) => slot.startTime === startTime && slot.endTime === endTime
      );

      if (existingTimeSlot) {
        finalTimeSlotId = existingTimeSlot.id;
      } else {
        // Create a new time slot
        setIsCreatingTimeSlot(true);
        try {
          const newTimeSlot = await createTimeSlotMutation.mutateAsync({
            startTime,
            endTime,
            label: `${startTime} - ${endTime}`,
          });
          finalTimeSlotId = newTimeSlot.id;
        } catch (error: any) {
          setValidationError(
            error.message || "Failed to create time slot. Please try again."
          );
          setIsCreatingTimeSlot(false);
          return;
        }
        setIsCreatingTimeSlot(false);
      }
    }

    if (!finalTimeSlotId) {
      setValidationError("Time slot is required");
      return;
    }

    try {
      // Call onSubmit and wait for it to complete
      await onSubmit({
        class_id: selectedClassId,
        subject_id: formData.subjectId,
        teacher_id: formData.teacherId,
        timeSlotId: finalTimeSlotId,
        day_of_week: formData.day,
        room: formData.room || undefined,
        notes: formData.notes || undefined,
      });
      
      // Only clear form if submission was successful (dialog will be closed by parent)
      // If there was an error, the parent will keep the dialog open and we keep the form data
    } catch (error) {
      // Error handling is done in the parent component
      // Don't clear the form on error
    }
  };

  const subjects = timetableOptions?.subjects || [];
  const teachers = timetableOptions?.teachers || [];
  const timeSlots = timetableOptions?.timeSlots || [];
  const selectedSubject = subjects.find((s) => s.id === formData.subjectId);

  // Update validation when time or day changes
  useEffect(() => {
    if (formData.useCustomTime && formData.day) {
      const error = validateTime();
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  }, [
    formData.useCustomTime,
    formData.startHour,
    formData.startMinute,
    formData.endHour,
    formData.endMinute,
    formData.day,
    formData.timeSlotId,
  ]);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPeriod?.id ? "Edit Period" : "Add New Period"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={formData.day}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, day: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeMode">Time Selection</Label>
              <Select
                value={formData.useCustomTime ? "custom" : "existing"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    useCustomTime: value === "custom",
                    timeSlotId: value === "custom" ? "" : prev.timeSlotId,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="existing">Select from existing</SelectItem>
                  <SelectItem value="custom">Enter custom time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.useCustomTime ? (
            <div className="space-y-4 p-4 border border-brand-border rounded-lg bg-brand-bg/30">
              <Label>Custom Time</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm">
                    Start Time
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startHour" className="text-xs text-brand-light-accent-1">
                        Hour
                      </Label>
                      <Select
                        value={formData.startHour}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, startHour: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startMinute" className="text-xs text-brand-light-accent-1">
                        Minute
                      </Label>
                      <Select
                        value={formData.startMinute}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            startMinute: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute.value} value={minute.value}>
                              {minute.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-xs text-brand-light-accent-1">
                    {formatTime(formData.startHour, formData.startMinute)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm">
                    End Time
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="endHour" className="text-xs text-brand-light-accent-1">
                        Hour
                      </Label>
                      <Select
                        value={formData.endHour}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, endHour: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="endMinute" className="text-xs text-brand-light-accent-1">
                        Minute
                      </Label>
                      <Select
                        value={formData.endMinute}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, endMinute: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute.value} value={minute.value}>
                              {minute.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-xs text-brand-light-accent-1">
                    {formatTime(formData.endHour, formData.endMinute)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Select
                value={formData.timeSlotId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, timeSlotId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timeSlots.map((slot) => {
                    // Check if this timeSlotId is already used on the selected day
                    const isOccupied = formData.day && scheduleData?.schedule
                      ? (() => {
                          const daySchedule = scheduleData.schedule[formData.day as keyof typeof scheduleData.schedule];
                          if (!daySchedule || !Array.isArray(daySchedule)) return false;
                          return daySchedule.some(
                            (period) =>
                              period.timeSlotId === slot.id &&
                              period.subject !== null &&
                              period.teacher !== null
                          );
                        })()
                      : false;
                    return (
                      <SelectItem
                        key={slot.id}
                        value={slot.id}
                        disabled={isOccupied}
                        className={isOccupied ? "opacity-50" : ""}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{slot.name}</span>
                          {isOccupied && (
                            <span className="text-xs text-red-600 ml-2">
                              (Occupied)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {formData.day && (
                <p className="text-xs text-brand-light-accent-1">
                  Occupied time slots are disabled for the selected day
                </p>
              )}
            </div>
          )}

          {validationError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subjectId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, subjectId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <div className="flex items-center gap-2">
                      {subject.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      )}
                      {subject.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSubject && selectedSubject.color && (
              <Badge
                style={{
                  backgroundColor: selectedSubject.color,
                  color: "white",
                }}
                className="mt-1"
              >
                {selectedSubject.name}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, teacherId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room (Optional)</Label>
            <Input
              id="room"
              value={formData.room}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, room: e.target.value }))
              }
              placeholder="e.g., Room 101"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="e.g., Bring textbooks"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isCreatingTimeSlot}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !formData.day ||
                (!formData.timeSlotId && !formData.useCustomTime) ||
                !formData.subjectId ||
                !formData.teacherId ||
                !selectedClassId ||
                !!validationError ||
                isCreatingTimeSlot
              }
            >
              {isCreatingTimeSlot ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Time Slot...
                </>
              ) : editingPeriod?.id ? (
                "Update Period"
              ) : (
                "Add Period"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPeriodDialog;
