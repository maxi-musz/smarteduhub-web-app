import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on TEACHER-RESULTS-API.md
type ApiResponseData<T> = T;

// Grade type
export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

// Term type
export type Term = "first" | "second" | "third";

// Current Session
export interface CurrentSession {
  id: string;
  academic_year: string; // Format: "YYYY/YYYY"
  term: Term;
}

// Available Session
export interface AvailableSession {
  id: string;
  academic_year: string;
  term: Term;
  is_current: boolean;
}

// Subject (at class level)
export interface ClassSubject {
  id: string;
  name: string;
  code: string;
  color: string; // Hex color code
}

// Subject Result (at student level)
export interface StudentSubjectResult {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  ca_score: number | null;
  exam_score: number | null;
  total_score: number;
  total_max_score: number;
  percentage: number;
  grade: Grade;
}

// Student Result
export interface StudentResult {
  student_id: string;
  student_name: string;
  roll_number: string;
  display_picture: string | null;
  total_ca_score: number | null;
  total_exam_score: number | null;
  total_score: number | null;
  total_max_score: number | null;
  overall_percentage: number | null;
  overall_grade: Grade | null;
  class_position: number | null;
  total_students: number;
  subjects: StudentSubjectResult[];
}

// Class with Results
export interface ClassWithResults {
  id: string;
  name: string; // e.g., "JSS 1A"
  classId: string; // Short ID, e.g., "1"
  subjects: ClassSubject[];
  students: StudentResult[];
  page: number;
  limit: number;
  total_students: number; // Total students (unpaginated)
}

// Results Main Page Response
export interface ResultsMainPageData {
  current_session: CurrentSession;
  sessions: AvailableSession[];
  classes: ClassWithResults[];
  page: number;
  limit: number;
}

// Query Parameters
export interface GetResultsMainPageParams {
  sessionId?: string;
  term?: Term;
  page?: number;
  limit?: number;
}

// 1. Get Results Main Page
export function useResultsMainPage(params: GetResultsMainPageParams = {}) {
  return useQuery<ResultsMainPageData, AuthenticatedApiError>({
    queryKey: ["teacher", "results", "main-page", params],
    queryFn: async () => {
      logger.info("[useResultsMainPage] Fetching results main page", { params });
      
      const queryParams = new URLSearchParams();
      if (params.sessionId) {
        queryParams.append("sessionId", params.sessionId);
      }
      if (params.term) {
        queryParams.append("term", params.term);
      }
      if (params.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params.limit) {
        queryParams.append("limit", params.limit.toString());
      }

      const endpoint = `/teachers/results/main-page${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authenticatedApi.get<ApiResponseData<ResultsMainPageData>>(endpoint);

      if (response.success && response.data) {
        logger.info("[useResultsMainPage] Results main page fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch results main page",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache for 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    refetchOnReconnect: false, // Don't refetch on reconnect if data is still fresh
  });
}

