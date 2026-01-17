import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

// Types based on TEACHER-API.md

// 1. Teacher Profile Types
export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  display_picture: string | null;
  status: string;
  assigned_subjects: Array<{
    id: string;
    name: string;
    code: string | null;
    color: string | null;
    description: string | null;
    assigned_class: {
      id: string;
      name: string;
    } | null;
  }>;
  managed_classes: Array<{
    id: string;
    name: string;
    student_count: number;
    subject_count: number;
  }>;
  summary: {
    total_subjects: number;
    total_classes: number;
  };
}

// 2. Teacher Timetable Types
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  order: number;
}

export interface DaySchedule {
  timeSlotId: string;
  startTime: string;
  endTime: string;
  label: string;
  class: {
    id: string;
    name: string;
  } | null;
  subject: {
    id: string;
    name: string;
    code: string | null;
    color: string | null;
  } | null;
  room: string | null;
}

export interface TeacherTimetable {
  timeSlots: TimeSlot[];
  schedule: {
    MONDAY: DaySchedule[];
    TUESDAY: DaySchedule[];
    WEDNESDAY: DaySchedule[];
    THURSDAY: DaySchedule[];
    FRIDAY: DaySchedule[];
  };
}

// 3. Teacher Dashboard Types
export interface CurrentSession {
  academic_year: string;
  start_year: number;
  end_year: number;
  term: string;
  term_start_date: string;
  term_end_date: string;
}

export interface ManagedClass {
  id: string | null;
  name: string | null;
  students: {
    total: number;
    males: number;
    females: number;
  };
}

export interface SubjectTeaching {
  id: string;
  name: string;
  code: string | null;
  color: string | null;
  description: string | null;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  comingUpOn: string;
  createdAt: string;
}

export interface ScheduleEntry {
  subject: {
    id: string;
    name: string;
    code: string | null;
    color: string | null;
  };
  class: {
    id: string;
    name: string;
  };
  time: {
    from: string;
    to: string;
    label: string;
  };
  room: string | null;
}

export interface ClassSchedules {
  today: {
    day: string;
    schedule: ScheduleEntry[];
  };
  tomorrow: {
    day: string;
    schedule: ScheduleEntry[];
  };
  day_after_tomorrow: {
    day: string;
    schedule: ScheduleEntry[];
  };
}

export interface TeacherDashboard {
  current_session: CurrentSession;
  managed_class: ManagedClass;
  subjects_teaching: SubjectTeaching[];
  recent_notifications: Notification[];
  class_schedules: ClassSchedules;
}

// 4. Student Tab Types
export interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  display_picture: string | null;
  status: string;
  gender: string;
  class: {
    id: string;
    name: string;
  } | null;
  user_id: string;
}

export interface StudentTabPagination {
  current_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  results_per_page: number;
}

export interface StudentTabResponse {
  students: {
    data: Student[];
    pagination: StudentTabPagination;
  };
  classes: Array<{
    id: string;
    name: string;
    student_count: number;
    subject_count: number;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    code: string | null;
    color: string | null;
    description: string | null;
    assigned_class: {
      id: string;
      name: string;
    } | null;
  }>;
  summary: {
    total_students: number;
    total_classes: number;
    total_subjects: number;
  };
}

export interface StudentTabParams {
  page?: number;
  limit?: number;
  search?: string;
  class_id?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
}

// 5. Schedules Tab Types
export interface ScheduleSlot {
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

export interface SchedulesTabResponse {
  subjects: Array<{
    id: string;
    name: string;
    code: string | null;
    color: string | null;
  }>;
  classes: Array<{
    id: string;
    name: string;
  }>;
  timetable_data: {
    timeSlots: Array<{
      id: string;
      startTime: string;
      endTime: string;
      order: number;
      label: string;
    }>;
    schedule: {
      MONDAY: ScheduleSlot[];
      TUESDAY: ScheduleSlot[];
      WEDNESDAY: ScheduleSlot[];
      THURSDAY: ScheduleSlot[];
      FRIDAY: ScheduleSlot[];
      SATURDAY: ScheduleSlot[];
      SUNDAY: ScheduleSlot[];
    };
  };
}

// 6. Subjects Dashboard Types
export interface TimetableEntry {
  id: string;
  day_of_week: string;
  startTime: string;
  endTime: string;
  room: string | null;
  class: {
    id: string;
    name: string;
  };
}

export interface SubjectDashboardItem {
  id: string;
  name: string;
  code: string | null;
  color: string | null;
  description: string | null;
  thumbnail?: string | null;
  timetableEntries?: TimetableEntry[];
  classesTakingSubject?: Array<{
    id: string;
    name: string;
  }>;
  contentCounts?: {
    totalVideos: number;
    totalMaterials: number;
    totalAssignments: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectsDashboardPagination {
  current_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  results_per_page: number;
}

// Actual API response structure (may differ from docs)
export interface SubjectsDashboardApiResponse {
  subjects: SubjectDashboardItem[]; // Direct array, not nested in data
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  teachingSubjects?: SubjectDashboardItem[];
  managedClasses?: Array<{
    id: string;
    name: string;
  }>;
  stats: {
    totalSubjects: number;
    totalVideos: number;
    totalMaterials: number;
    totalClasses: number;
  };
  academicSession: {
    id: string;
    academic_year: string;
    term: string;
  };
}

// Normalized response structure for components
export interface SubjectsDashboardResponse {
  subjects: {
    data: SubjectDashboardItem[];
    pagination: SubjectsDashboardPagination;
  };
  stats: {
    totalSubjects: number;
    totalVideos: number;
    totalMaterials: number;
    totalClasses: number;
  };
  academicSession: {
    id: string;
    academic_year: string;
    term: string;
  };
}

export interface SubjectsDashboardParams {
  page?: number;
  limit?: number;
  search?: string;
  academic_session_id?: string;
  class_id?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
}

// Inner data type used with the shared authenticated ApiResponse<T> wrapper
type ApiResponseData<T> = T;

// 1. Get Teacher Profile
export function useTeacherProfile() {
  return useQuery<TeacherProfile, AuthenticatedApiError>({
    queryKey: ["teacher", "profile"],
    queryFn: async () => {
      logger.info("[useTeacherProfile] Fetching teacher profile");
      const response = await authenticatedApi.get<ApiResponseData<TeacherProfile>>(
        "/teachers/profile"
      );

      if (response.success && response.data) {
        logger.info("[useTeacherProfile] Teacher profile fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch teacher profile",
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

// 2. Get Teacher Timetable
export function useTeacherTimetable() {
  return useQuery<TeacherTimetable, AuthenticatedApiError>({
    queryKey: ["teacher", "timetable"],
    queryFn: async () => {
      logger.info("[useTeacherTimetable] Fetching teacher timetable");
      const response = await authenticatedApi.get<ApiResponseData<TeacherTimetable>>(
        "/teachers/timetable"
      );

      if (response.success && response.data) {
        logger.info("[useTeacherTimetable] Teacher timetable fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch teacher timetable",
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

// 3. Get Teacher Dashboard
export function useTeacherDashboard() {
  return useQuery<TeacherDashboard, AuthenticatedApiError>({
    queryKey: ["teacher", "dashboard"],
    queryFn: async () => {
      logger.info("[useTeacherDashboard] Fetching teacher dashboard");
      const response = await authenticatedApi.get<ApiResponseData<TeacherDashboard>>(
        "/teachers/dashboard"
      );

      if (response.success && response.data) {
        logger.info("[useTeacherDashboard] Teacher dashboard fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch teacher dashboard",
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

// 4. Get Student Tab
export function useStudentTab(params?: StudentTabParams) {
  return useQuery<StudentTabResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "student-tab", params],
    queryFn: async () => {
      logger.info("[useStudentTab] Fetching student tab", { params });
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.class_id) queryParams.append("class_id", params.class_id);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

      const endpoint = `/teachers/student-tab${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authenticatedApi.get<ApiResponseData<StudentTabResponse>>(
        endpoint
      );

      if (response.success && response.data) {
        logger.info("[useStudentTab] Student tab fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch student tab",
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

// 5. Get Schedules Tab
export function useSchedulesTab() {
  return useQuery<SchedulesTabResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "schedules-tab"],
    queryFn: async () => {
      logger.info("[useSchedulesTab] Fetching schedules tab");
      const response = await authenticatedApi.get<ApiResponseData<SchedulesTabResponse>>(
        "/teachers/schedules-tab"
      );

      if (response.success && response.data) {
        logger.info("[useSchedulesTab] Schedules tab fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch schedules tab",
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

// 6. Get Subjects Dashboard
export function useSubjectsDashboard(params?: SubjectsDashboardParams) {
  return useQuery<SubjectsDashboardResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "subjects-dashboard", params],
    queryFn: async () => {
      logger.info("[useSubjectsDashboard] Fetching subjects dashboard", { params });
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.academic_session_id) queryParams.append("academic_session_id", params.academic_session_id);
      if (params?.class_id) queryParams.append("class_id", params.class_id);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

      const endpoint = `/teachers/subjects-dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authenticatedApi.get<ApiResponseData<SubjectsDashboardApiResponse>>(
        endpoint
      );

      if (response.success && response.data) {
        const apiData = response.data;
        
        // Transform API response to match expected structure
        // API returns subjects as direct array, but components expect subjects.data
        const normalizedData: SubjectsDashboardResponse = {
          subjects: {
            data: apiData.subjects || [],
            pagination: {
              current_page: apiData.pagination?.page || 1,
              total_items: apiData.pagination?.total || 0,
              total_pages: apiData.pagination?.totalPages || 1,
              has_next: apiData.pagination?.hasNext || false,
              has_previous: apiData.pagination?.hasPrevious || false,
              results_per_page: apiData.pagination?.limit || 5,
            },
          },
          stats: apiData.stats,
          academicSession: apiData.academicSession,
        };

        logger.info("[useSubjectsDashboard] Subjects dashboard fetched successfully", {
          stats: normalizedData.stats,
          subjectsCount: normalizedData.subjects.data.length,
          pagination: normalizedData.subjects.pagination,
        });
        
        return normalizedData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch subjects dashboard",
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

// 7. Attendance Types
export interface AttendanceClass {
  id: string;
  name: string;
  code: string;
  subject: string;
  teacher_name: string;
  room: string;
  total_students: number;
}

export interface AcademicSession {
  academic_year: string;
  term: string;
  term_start_date: string;
  term_end_date: string;
  current_date: string;
  is_current: boolean;
}

export interface SessionDetailsResponse {
  classes_managing: AttendanceClass[];
  academic_sessions: AcademicSession[];
}

export interface AttendanceStudent {
  id: string;
  user_id: string;
  student_id: string;
  admission_number: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  display_picture: string | null;
  gender: string;
  status: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  class_teacher: string;
  room: string;
  total_students: number;
}

export interface StudentsResponse {
  students: AttendanceStudent[];
  class_info: ClassInfo;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface AttendanceRecord {
  id: string | null;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_email: string;
  student_number: string;
  display_picture: string | null;
  status: string | null;
  reason: string | null;
  is_excused: boolean;
  excuse_note: string | null;
  marked_at: string | null;
}

export interface AttendanceStatistics {
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  partial_count: number;
  attendance_rate: number;
}

export interface AttendanceForDateResponse {
  session_id: string | null;
  class_id: string;
  class_name: string;
  date: string;
  session_type: string;
  status: string | null;
  submitted_at: string | null;
  submitted_by: string | null;
  notes: string | null;
  statistics: AttendanceStatistics | null;
  attendance_records: AttendanceRecord[];
}

export interface SubmitAttendanceRequest {
  class_id: string;
  date: string;
  session_type?: string;
  attendance_records: Array<{
    student_id: string;
    status: string;
    reason?: string;
    is_excused?: boolean;
    excuse_note?: string;
  }>;
  notes?: string;
}

export interface UpdateAttendanceRequest {
  class_id: string;
  date: string;
  attendance_records: Array<{
    student_id: string;
    status: string;
    reason?: string;
    is_excused?: boolean;
    excuse_note?: string;
  }>;
  notes?: string;
}

export interface SubmitAttendanceResponse {
  session_id: string;
  class_id: string;
  date: string;
  status: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_rate: number;
}

// 7. Get Session Details and Classes
export function useAttendanceSessionDetails() {
  return useQuery<SessionDetailsResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "attendance", "session-details"],
    queryFn: async () => {
      logger.info("[useAttendanceSessionDetails] Fetching session details");
      const response = await authenticatedApi.get<ApiResponseData<SessionDetailsResponse>>(
        "/teachers/attendance/getsessiondetailsandclasses"
      );

      if (response.success && response.data) {
        logger.info("[useAttendanceSessionDetails] Session details fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch session details",
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

// 8. Get Students for Class
export function useAttendanceStudents(classId: string | null, page = 1, limit = 100) {
  return useQuery<StudentsResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "attendance", "students", classId, page, limit],
    queryFn: async () => {
      if (!classId) {
        throw new AuthenticatedApiError("Class ID is required", 400);
      }
      logger.info("[useAttendanceStudents] Fetching students", { classId, page, limit });
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const endpoint = `/teachers/attendance/classes/${classId}/students?${queryParams.toString()}`;
      const response = await authenticatedApi.get<ApiResponseData<StudentsResponse>>(endpoint);

      if (response.success && response.data) {
        logger.info("[useAttendanceStudents] Students fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch students",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!classId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// 9. Get Attendance for Date
export function useAttendanceForDate(classId: string | null, date: string | null) {
  return useQuery<AttendanceForDateResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "attendance", "date", classId, date],
    queryFn: async () => {
      if (!classId || !date) {
        throw new AuthenticatedApiError("Class ID and date are required", 400);
      }
      logger.info("[useAttendanceForDate] Fetching attendance", { classId, date });
      const endpoint = `/teachers/attendance/classes/${classId}/date/${date}`;
      const response = await authenticatedApi.get<ApiResponseData<AttendanceForDateResponse>>(endpoint);

      if (response.success && response.data) {
        logger.info("[useAttendanceForDate] Attendance fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch attendance",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!classId && !!date,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    retry: 1,
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
}

// 10. Submit Attendance
export function useSubmitAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<SubmitAttendanceResponse, AuthenticatedApiError, SubmitAttendanceRequest>({
    mutationFn: async (data) => {
      logger.info("[useSubmitAttendance] Submitting attendance", {
        classId: data.class_id,
        date: data.date,
        recordsCount: data.attendance_records.length,
      });

      const response = await authenticatedApi.post<ApiResponseData<SubmitAttendanceResponse>>(
        "/teachers/attendance/submit",
        data
      );

      if (response.success && response.data) {
        logger.info("[useSubmitAttendance] Attendance submitted successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to submit attendance",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate attendance queries
      queryClient.invalidateQueries({
        queryKey: ["teacher", "attendance", "date", variables.class_id, variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher", "attendance", "session-details"],
      });
      toast({
        title: "Attendance submitted successfully",
        description: `Attendance rate: ${data.attendance_rate.toFixed(1)}%`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit attendance",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 11. Update Attendance
export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<SubmitAttendanceResponse, AuthenticatedApiError, UpdateAttendanceRequest>({
    mutationFn: async (data) => {
      logger.info("[useUpdateAttendance] Updating attendance", {
        classId: data.class_id,
        date: data.date,
        recordsCount: data.attendance_records.length,
      });

      const response = await authenticatedApi.patch<ApiResponseData<SubmitAttendanceResponse>>(
        "/teachers/attendance/update",
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateAttendance] Attendance updated successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update attendance",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate attendance queries
      queryClient.invalidateQueries({
        queryKey: ["teacher", "attendance", "date", variables.class_id, variables.date],
      });
      toast({
        title: "Attendance updated successfully",
        description: `Updated attendance rate: ${data.attendance_rate.toFixed(1)}%`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update attendance",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

