import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on actual backend response

export interface StudentAttendanceSummary {
  totalSchoolDaysThisMonth: number;
  totalPresentThisMonth: number;
  totalSchoolDaysThisTerm: number;
  totalPresentThisTerm: number;
  lastAbsentDate: string | null;
}

export interface StudentAttendanceRecord {
  date: string; // YYYY-MM-DD
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "PARTIAL" | "HOLIDAY" | "WEEKEND";
  isExcused: boolean;
  reason: string | null;
  markedAt: string | null; // ISO 8601 timestamp
  markedBy: string | null; // Teacher ID
}

export interface AcademicSession {
  id: string;
  academic_year: string;
  term: string; // "first" | "second" | "third"
  start_date: string; // ISO 8601 timestamp
  end_date: string; // ISO 8601 timestamp
  is_current: boolean;
  status: string; // "active" | "inactive" | "completed"
}

export interface AvailableTerm {
  id: string;
  term: string;
  academic_year: string;
}

export interface StudentAttendanceData {
  summary: StudentAttendanceSummary;
  records: StudentAttendanceRecord[];
  academic_sessions: AcademicSession[];
  available_terms: AvailableTerm[];
}

// Query parameters
export interface GetStudentAttendanceParams {
  year?: number;
  month?: number; // 1-12
}

// Raw API response wrapper
interface StudentAttendanceApiResponse {
  success: boolean;
  message: string;
  data: StudentAttendanceData | null;
  statusCode?: number;
}

export function useStudentAttendance(params: GetStudentAttendanceParams = {}) {
  return useQuery<StudentAttendanceData, AuthenticatedApiError>({
    queryKey: ["student", "attendance", params],
    queryFn: async () => {
      logger.info("[useStudentAttendance] Fetching student attendance", { params });

      const queryParams = new URLSearchParams();
      if (params.year) {
        queryParams.append("year", params.year.toString());
      }
      if (params.month) {
        queryParams.append("month", params.month.toString());
      }

      const endpoint = `/students/attendance${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response =
        await authenticatedApi.get<StudentAttendanceApiResponse>(endpoint);

      if (response.success && response.data) {
        logger.info(
          "[useStudentAttendance] Student attendance fetched successfully",
        );
        return response.data as unknown as StudentAttendanceData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch student attendance",
        response.statusCode || 400,
        response,
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
