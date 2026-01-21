import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Student Assessment Types based on API response
export interface StudentAssessmentAttempt {
  id: string;
  attempt_number: number;
  status: string;
  total_score: number;
  percentage: number;
  passed: boolean;
  submitted_at: string;
  max_score?: number;
}

export interface StudentAssessmentAttempts {
  total_attempts: number;
  remaining_attempts: number;
  has_reached_max: boolean;
  latest_attempt: StudentAssessmentAttempt | null;
}

export interface StudentPerformanceSummary {
  highest_score: number;
  highest_percentage: number;
  overall_achievable_mark: number;
  best_attempt: StudentAssessmentAttempt | null;
}

export interface StudentAssessment {
  id: string;
  title: string;
  description: string | null;
  assessment_type: string;
  status: string;
  duration: number;
  total_points: number;
  max_attempts: number;
  passing_score: number;
  questions_count: number;
  subject: {
    id: string;
    name: string;
    code: string | null;
    color: string | null;
  };
  teacher: {
    id: string;
    name: string;
  };
  due_date: string | null;
  created_at: string;
  is_published: boolean;
  submissions: {
    total_submissions: number;
    recent_submissions: unknown[];
    student_counts: Record<string, unknown>;
  };
  student_attempts: StudentAssessmentAttempts;
  student_can_view_grading: boolean;
  performance_summary: StudentPerformanceSummary;
  _count: {
    questions: number;
  };
}

export interface GroupedAssessment {
  assessment_type: string;
  status: string;
  count: number;
  assessments: StudentAssessment[];
}

export interface StudentAssessmentsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StudentAssessmentsFilters {
  search: string;
  assessment_type: string;
  status: string;
  subject_id: string;
}

export interface CurrentSession {
  academic_year: string;
  term: string;
}

export interface SubjectAssessmentStats {
  total_assessments: number;
  attempted: number;
  completed: number;
  not_attempted: number;
}

export interface SubjectWithStats {
  id: string;
  name: string;
  code: string | null;
  color: string | null;
  description: string | null;
  assessment_stats: SubjectAssessmentStats;
}

export interface StudentAssessmentsResponse {
  success: boolean;
  message: string;
  data: {
    pagination: StudentAssessmentsPagination;
    filters: StudentAssessmentsFilters;
    general_info: {
      current_session: CurrentSession;
    };
    subjects: SubjectWithStats[];
    assessments: StudentAssessment[];
    grouped_assessments: GroupedAssessment[];
  };
}

export interface GetStudentAssessmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  assessmentType?: string;
  status?: string;
  subjectId?: string;
}

/**
 * Fetch student assessments
 */
const fetchStudentAssessments = async (
  params: GetStudentAssessmentsParams
): Promise<StudentAssessmentsResponse> => {
  const {
    page = 1,
    limit = 10,
    search = "",
    assessmentType = "all",
    status = "all",
    subjectId = "all",
  } = params;

  logger.info("[use-student-assessments] Fetching student assessments", { ...params });

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);
    if (assessmentType && assessmentType !== "all") queryParams.append("assessmentType", assessmentType);
    if (status && status !== "all") queryParams.append("status", status);
    if (subjectId && subjectId !== "all") queryParams.append("subject_id", subjectId);

    const endpoint = `/students/assessments?${queryParams.toString()}`;

    const response = await authenticatedApi.get<StudentAssessmentsResponse>(endpoint);

    logger.info("[use-student-assessments] Assessments fetched successfully", response);

    if (!response || typeof response !== "object") {
      logger.error("[use-student-assessments] Response is not an object:", { response });
      throw new Error("Invalid response format from assessments API");
    }

    if ("success" in response && response.success === false) {
      const errorMsg = response.message || "Failed to fetch assessments";
      logger.error("[use-student-assessments] Backend returned success: false", {
        message: errorMsg,
        response,
      });
      throw new Error(errorMsg);
    }

    if (!response.data) {
      throw new Error("Invalid response: missing data");
    }

    // Return the response as-is since it already matches StudentAssessmentsResponse structure
    return response as unknown as StudentAssessmentsResponse;
  } catch (error) {
    logger.error("[use-student-assessments] Error fetching assessments:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Hook to fetch student assessments
 */
export const useStudentAssessments = (params: GetStudentAssessmentsParams = {}) => {
  return useQuery({
    queryKey: ["student", "assessments", params],
    queryFn: () => fetchStudentAssessments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
};

