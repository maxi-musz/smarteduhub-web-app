import { useQuery } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on API response
export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  order: number;
  is_selected: boolean;
}

export interface SelectedOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface UserAnswer {
  text_answer: string | null;
  numeric_answer: number | null;
  date_answer: string | null;
  selected_options: SelectedOption[];
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

export interface CorrectAnswer {
  id: string;
  option_ids: string[];
}

export interface QuestionWithAnswer {
  id: string;
  question_text: string;
  question_image: string | null;
  question_type: string;
  points: number;
  order: number;
  explanation: string | null;
  options: QuestionOption[];
  user_answer: UserAnswer | null;
  correct_answers: CorrectAnswer[];
}

export interface Submission {
  submission_id: string;
  attempt_number: number;
  status: string;
  total_score: number;
  percentage: number;
  passed: boolean;
  grade_letter: string | null;
  time_spent: number;
  started_at: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  is_graded: boolean;
  overall_feedback: string | null;
  questions: QuestionWithAnswer[];
  total_questions: number;
  questions_answered: number;
  questions_correct: number;
}

export interface AssessmentWithAnswers {
  id: string;
  title: string;
  description: string | null;
  assessment_type: string;
  status: string;
  duration: number;
  total_points: number;
  max_attempts: number;
  passing_score: number;
  instructions: string | null;
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
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  is_published: boolean;
  total_attempts: number;
  remaining_attempts: number;
}

export interface SubmissionSummary {
  total_submissions: number;
  latest_submission: {
    submission_id: string;
    attempt_number: number;
    status: string;
    total_score: number;
    percentage: number;
    passed: boolean;
  } | null;
  best_score: number;
  best_percentage: number;
  passed_attempts: number;
}

export interface AssessmentResultsResponse {
  success: boolean;
  message: string;
  data: {
    assessment: AssessmentWithAnswers;
    submissions: Submission[];
    total_questions: number;
    total_points: number;
    estimated_duration: number;
    submission_summary: SubmissionSummary;
  };
}

/**
 * Fetch assessment results with answers
 */
const fetchAssessmentResults = async (
  assessmentId: string
): Promise<AssessmentResultsResponse> => {
  logger.info("[use-student-assessment-results] Fetching results", { assessmentId });

  try {
    const endpoint = `/students/assessments/${assessmentId}/answers`;

    const response = await authenticatedApi.get<AssessmentResultsResponse>(endpoint);

    logger.info("[use-student-assessment-results] Results fetched successfully", response);

    if (!response || typeof response !== "object") {
      logger.error("[use-student-assessment-results] Response is not an object:", { response });
      throw new Error("Invalid response format from assessment results API");
    }

    if ("success" in response && response.success === false) {
      const errorMsg = response.message || "Failed to fetch assessment results";
      logger.error("[use-student-assessment-results] Backend returned success: false", {
        message: errorMsg,
        response,
      });
      throw new Error(errorMsg);
    }

    if (!response.data) {
      throw new Error("Invalid response: missing data");
    }

    // Return the response as-is since it already matches AssessmentResultsResponse structure
    return response as unknown as AssessmentResultsResponse;
  } catch (error) {
    logger.error("[use-student-assessment-results] Error fetching results:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Hook to fetch student assessment results
 */
export const useStudentAssessmentResults = (assessmentId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["student", "assessment", assessmentId, "results"],
    queryFn: () => fetchAssessmentResults(assessmentId!),
    enabled: !!assessmentId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

