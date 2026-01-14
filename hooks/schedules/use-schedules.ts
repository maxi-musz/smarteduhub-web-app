import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on API documentation
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  order: number;
  isActive: boolean;
  schoolId?: string;
  school_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeSlotRequest {
  startTime: string;
  endTime: string;
  label: string;
}

export interface UpdateTimeSlotRequest {
  startTime?: string;
  endTime?: string;
  label?: string;
  order?: number;
  isActive?: boolean;
}

export interface TimetableOptions {
  classes: Array<{ id: string; name: string }>;
  teachers: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string; code: string | null; color: string | null }>;
  timeSlots: Array<{
    id: string;
    name: string;
    label: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface TimetableSchedulePeriod {
  timeSlotId: string;
  startTime: string;
  endTime: string;
  label: string;
  subject: {
    id: string;
    name: string;
    code: string | null;
    color: string | null;
  } | null;
  teacher: {
    id: string;
    name: string;
  } | null;
  room: string | null;
}

export interface TimetableSchedule {
  class: Array<{ classId: string; name: string }>;
  timeSlots: Array<{
    id: string;
    startTime: string;
    endTime: string;
    label: string;
    order: number;
  }>;
  schedule: {
    MONDAY: TimetableSchedulePeriod[];
    TUESDAY: TimetableSchedulePeriod[];
    WEDNESDAY: TimetableSchedulePeriod[];
    THURSDAY: TimetableSchedulePeriod[];
    FRIDAY: TimetableSchedulePeriod[];
  };
}

export interface CreateTimetableEntryRequest {
  class_id: string;
  subject_id: string;
  teacher_id: string;
  timeSlotId: string;
  day_of_week: string;
  room?: string;
  notes?: string;
}

export interface TimetableEntry {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  school_id: string;
  timeSlotId: string;
  day_of_week: string;
  room: string | null;
  notes: string | null;
  isActive: boolean;
  academic_session_id: string;
  createdAt: string;
  updatedAt: string;
  class: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
    code: string | null;
    color: string | null;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  timeSlot: {
    id: string;
    startTime: string;
    endTime: string;
    label: string;
    order: number;
  };
}

export interface SubjectsWithTeachers {
  subjects: Array<{
    id: string;
    name: string;
    code: string | null;
    color: string | null;
    teachers: Array<{
      id: string;
      name: string;
      display_picture: string | null;
    }>;
  }>;
  summary: {
    total_subjects: number;
    subjects_with_teachers: number;
    subjects_without_teachers: number;
  };
}

// Inner data type used with the shared authenticated ApiResponse<T> wrapper
type ApiResponseData<T> = T;

// 1. Get All Time Slots
export function useTimeSlots() {
  return useQuery<TimeSlot[], AuthenticatedApiError>({
    queryKey: ["schedules", "time-slots"],
    queryFn: async () => {
      logger.info("[useTimeSlots] Fetching all time slots");
      const response = await authenticatedApi.get<ApiResponseData<TimeSlot[]>>(
        "/director/schedules/time-slots"
      );

      if (response.success && response.data) {
        logger.info("[useTimeSlots] Time slots fetched successfully", {
          count: response.data.length,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch time slots",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// 2. Create Time Slot
export function useCreateTimeSlot() {
  const queryClient = useQueryClient();

  return useMutation<TimeSlot, AuthenticatedApiError, CreateTimeSlotRequest>({
    mutationFn: async (data) => {
      logger.info("[useCreateTimeSlot] Creating time slot", {
        startTime: data.startTime,
        endTime: data.endTime,
        label: data.label,
      });
      const response = await authenticatedApi.post<ApiResponseData<TimeSlot>>(
        "/director/schedules/create-time-slot",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateTimeSlot] Time slot created successfully", {
          id: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create time slot",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", "time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["schedules", "timetable-options"] });
    },
  });
}

// 3. Update Time Slot
export function useUpdateTimeSlot() {
  const queryClient = useQueryClient();

  return useMutation<TimeSlot, AuthenticatedApiError, { id: string; data: UpdateTimeSlotRequest }>({
    mutationFn: async ({ id, data }) => {
      logger.info("[useUpdateTimeSlot] Updating time slot", { id, data });
      const response = await authenticatedApi.patch<ApiResponseData<TimeSlot>>(
        `/director/schedules/time-slots/${id}`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateTimeSlot] Time slot updated successfully", {
          id: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update time slot",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", "time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["schedules", "timetable-options"] });
    },
  });
}

// 4. Delete Time Slot
export function useDeleteTimeSlot() {
  const queryClient = useQueryClient();

  return useMutation<TimeSlot, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      logger.info("[useDeleteTimeSlot] Deleting time slot", { id });
      const response = await authenticatedApi.delete<ApiResponseData<TimeSlot>>(
        `/director/schedules/time-slots/${id}`
      );

      if (response.success && response.data) {
        logger.info("[useDeleteTimeSlot] Time slot deleted successfully", {
          id: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete time slot",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", "time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["schedules", "timetable-options"] });
    },
  });
}

// 5. Get Timetable Options
export function useTimetableOptions() {
  return useQuery<TimetableOptions, AuthenticatedApiError>({
    queryKey: ["schedules", "timetable-options"],
    queryFn: async () => {
      logger.info("[useTimetableOptions] Fetching timetable options");
      const response = await authenticatedApi.get<ApiResponseData<TimetableOptions>>(
        "/director/schedules/timetable-options"
      );

      if (response.success && response.data) {
        logger.info("[useTimetableOptions] Timetable options fetched successfully", {
          classes: response.data.classes.length,
          teachers: response.data.teachers.length,
          subjects: response.data.subjects.length,
          timeSlots: response.data.timeSlots.length,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch timetable options",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// 6. Get Timetable Schedule
export function useTimetableSchedule(classLevel: string | null) {
  return useQuery<TimetableSchedule, AuthenticatedApiError>({
    queryKey: ["schedules", "timetable", classLevel],
    queryFn: async () => {
      if (!classLevel) {
        throw new AuthenticatedApiError("Class level is required", 400);
      }

      logger.info("[useTimetableSchedule] Fetching timetable schedule", { classLevel });
      const response = await authenticatedApi.post<ApiResponseData<TimetableSchedule>>(
        "/director/schedules/timetable",
        { class: classLevel.toLowerCase() }
      );

      if (response.success && response.data) {
        logger.info("[useTimetableSchedule] Timetable schedule fetched successfully", {
          classLevel,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch timetable schedule",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!classLevel,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// 7. Create Timetable Entry
export function useCreateTimetableEntry() {
  const queryClient = useQueryClient();

  return useMutation<TimetableEntry, AuthenticatedApiError, CreateTimetableEntryRequest>({
    mutationFn: async (data) => {
      logger.info("[useCreateTimetableEntry] Creating timetable entry", {
        class_id: data.class_id,
        subject_id: data.subject_id,
        teacher_id: data.teacher_id,
        timeSlotId: data.timeSlotId,
        day_of_week: data.day_of_week,
        hasRoom: !!data.room,
        hasNotes: !!data.notes,
      });
      const response = await authenticatedApi.post<ApiResponseData<TimetableEntry>>(
        "/director/schedules/create-timetable",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateTimetableEntry] Timetable entry created successfully", {
          id: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create timetable entry",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate timetable schedules for all classes
      queryClient.invalidateQueries({ queryKey: ["schedules", "timetable"] });
    },
  });
}

// 8. Get Subjects with Teachers
export function useSubjectsWithTeachers() {
  return useQuery<SubjectsWithTeachers, AuthenticatedApiError>({
    queryKey: ["schedules", "subjects-with-teachers"],
    queryFn: async () => {
      logger.info("[useSubjectsWithTeachers] Fetching subjects with teachers");
      const response = await authenticatedApi.get<ApiResponseData<SubjectsWithTeachers>>(
        "/director/schedules/subjects-with-teachers"
      );

      if (response.success && response.data) {
        logger.info("[useSubjectsWithTeachers] Subjects with teachers fetched successfully", {
          totalSubjects: response.data.summary.total_subjects,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch subjects with teachers",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}


