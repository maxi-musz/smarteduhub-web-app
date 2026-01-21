import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on backend students results endpoint documentation

// Grade type
export type StudentGrade = "A" | "B" | "C" | "D" | "E" | "F";

// Term type
export type StudentTerm = "first" | "second" | "third";

// Current academic session
export interface StudentCurrentSession {
  id: string;
  academic_year: string; // e.g. "2024-2025"
  term: StudentTerm;
}

// Per‑subject result for the student
export interface StudentSubjectResult {
  subject_id: string;
  subject_code: string;
  subject_color: string;
  subject_name: string;
  ca_score: number | null;
  exam_score: number | null;
  total_score: number;
  total_max_score: number;
  percentage: number;
  grade: StudentGrade;
  class_analysis?: {
    total_students: number;
    student_position: number | null;
  };
}

// Main data payload for student results
export interface StudentResultsData {
  current_session: StudentCurrentSession;
  subjects: StudentSubjectResult[];
  // Present only when results are released but no subject data is available
  result_id?: string;
  released_at?: string;
}

// Raw API response wrapper
interface StudentResultsApiResponse {
  success: boolean;
  message: string;
  data: StudentResultsData | null;
  statusCode?: number;
}

// Query parameters accepted by backend
export interface GetStudentResultsParams {
  session_id?: string;
  term_id?: string;
}

export function useStudentResults(params: GetStudentResultsParams = {}) {
  return useQuery<StudentResultsData, AuthenticatedApiError>({
    queryKey: ["student", "results", params],
    queryFn: async () => {
      logger.info("[useStudentResults] Fetching student results", { params });

      const queryParams = new URLSearchParams();
      if (params.session_id) {
        queryParams.append("session_id", params.session_id);
      }
      if (params.term_id) {
        queryParams.append("term_id", params.term_id);
      }

      const endpoint = `/students/results${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response =
        await authenticatedApi.get<StudentResultsApiResponse>(endpoint);

      if (response.success && response.data) {
        logger.info(
          "[useStudentResults] Student results fetched successfully",
        );
        return response.data as unknown as StudentResultsData;
      }

      // Treat all non‑success responses as errors so UI can show message from backend
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch student results",
        response.statusCode || 400,
        response,
      );
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

