import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

// Question Types
export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  order: number;
}

export interface CorrectAnswer {
  id: string;
  option_ids: string[];
}

export interface AssessmentQuestion {
  id: string;
  question_text: string;
  question_image: string | null;
  question_type: string; // MULTIPLE_CHOICE, TRUE_FALSE, FILL_IN_BLANK, ESSAY, NUMERIC, DATE
  points: number;
  order: number;
  explanation: string | null;
  options: QuestionOption[];
  correct_answers: CorrectAnswer[];
}

export interface AssessmentWithQuestions {
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
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
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
  student_attempts: number;
  remaining_attempts: number;
}

export interface AssessmentQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    assessment: AssessmentWithQuestions;
    questions: AssessmentQuestion[];
    total_questions: number;
    total_points: number;
    estimated_duration: number;
  };
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Fetch assessment questions for student
 */
const fetchAssessmentQuestions = async (
  assessmentId: string
): Promise<AssessmentQuestionsResponse> => {
  logger.info("[use-student-assessment-questions] Fetching questions", { assessmentId });

  try {
    const endpoint = `/students/assessments/${assessmentId}/questions`;

    const response = await authenticatedApi.get<AssessmentQuestionsResponse>(endpoint);

    logger.info("[use-student-assessment-questions] Questions fetched successfully", response);

    if (!response || typeof response !== "object") {
      logger.error("[use-student-assessment-questions] Response is not an object:", { response });
      throw new Error("Invalid response format from assessment questions API");
    }

    if ("success" in response && response.success === false) {
      const errorMsg = response.message || "Failed to fetch assessment questions";
      logger.error("[use-student-assessment-questions] Backend returned success: false", {
        message: errorMsg,
        response,
      });
      throw new Error(errorMsg);
    }

    // Apply shuffling if enabled
    if (response.data && typeof response.data === "object" && "assessment" in response.data && "questions" in response.data) {
      const data = response.data as unknown as {
        assessment: AssessmentWithQuestions;
        questions: AssessmentQuestion[];
        total_questions: number;
        total_points: number;
        estimated_duration: number;
      };
      const { assessment, questions, total_questions, total_points, estimated_duration } = data;
      
      let processedQuestions = [...questions];
      
      // Shuffle questions if enabled
      if (assessment.shuffle_questions) {
        processedQuestions = shuffleArray(processedQuestions);
        logger.info("[use-student-assessment-questions] Questions shuffled");
      }
      
      // Shuffle options within each question if enabled
      if (assessment.shuffle_options) {
        processedQuestions = processedQuestions.map(question => ({
          ...question,
          options: shuffleArray(question.options),
        }));
        logger.info("[use-student-assessment-questions] Options shuffled");
      }

      return {
        success: response.success,
        message: response.message || "",
        data: {
          assessment,
          questions: processedQuestions,
          total_questions,
          total_points,
          estimated_duration,
        },
      };
    }

    throw new Error("Invalid response: missing data");
  } catch (error) {
    logger.error("[use-student-assessment-questions] Error fetching questions:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Hook to fetch student assessment questions
 */
export const useStudentAssessmentQuestions = (assessmentId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["student", "assessment", assessmentId, "questions"],
    queryFn: () => fetchAssessmentQuestions(assessmentId!),
    enabled: !!assessmentId && enabled,
    staleTime: 0, // Don't cache - always fetch fresh to ensure proper shuffling
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Submit Assessment Types
export interface QuestionAnswer {
  question_id: string;
  answer: string | string[] | number | null;
  time_spent: number; // seconds spent on this question
}

export interface SubmitAssessmentRequest {
  assessment_id: string;
  answers: QuestionAnswer[];
  total_time_spent: number; // total seconds spent on assessment
  started_at: string; // ISO timestamp
  submitted_at: string; // ISO timestamp
}

export interface SubmitAssessmentResponse {
  success: boolean;
  message: string;
  data: {
    attempt_id: string;
    assessment_id: string;
    student_id: string;
    attempt_number: number;
    status: string;
    total_score: number;
    percentage: number;
    passed: boolean;
    total_time_spent: number;
    started_at: string;
    submitted_at: string;
    graded_at: string | null;
    feedback: {
      total_questions: number;
      correct_answers: number;
      incorrect_answers: number;
      unanswered: number;
      score: number;
      percentage: number;
      passed: boolean;
      passing_score: number;
      time_spent: number;
      attempts_remaining: number;
    };
  };
}

/**
 * Submit student assessment answers
 */
const submitAssessment = async (
  data: SubmitAssessmentRequest
): Promise<SubmitAssessmentResponse> => {
  logger.info("[use-student-assessment-questions] Submitting assessment", { 
    assessmentId: data.assessment_id,
    answersCount: data.answers.length,
  });

  try {
    const endpoint = `/students/assessments/${data.assessment_id}/submit`;

    const response = await authenticatedApi.post<SubmitAssessmentResponse>(endpoint, data);

    logger.info("[use-student-assessment-questions] Assessment submitted successfully", response);

    if (!response || typeof response !== "object") {
      logger.error("[use-student-assessment-questions] Response is not an object:", { response });
      throw new Error("Invalid response format from submit assessment API");
    }

    if ("success" in response && response.success === false) {
      const errorMsg = response.message || "Failed to submit assessment";
      logger.error("[use-student-assessment-questions] Backend returned success: false", {
        message: errorMsg,
        response,
      });
      throw new Error(errorMsg);
    }

    if (!response.data) {
      throw new Error("Invalid response: missing data");
    }

    // Return the response as-is since it already matches SubmitAssessmentResponse structure
    return response as unknown as SubmitAssessmentResponse;
  } catch (error) {
    logger.error("[use-student-assessment-questions] Error submitting assessment:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Hook to submit student assessment
 */
export const useSubmitStudentAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: submitAssessment,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["student", "assessments"] });
      queryClient.invalidateQueries({ 
        queryKey: ["student", "assessment", data.data.assessment_id] 
      });
      
      toast({
        title: "Assessment submitted successfully",
        description: `Score: ${data.data.percentage.toFixed(1)}% - ${data.data.passed ? "Passed" : "Not Passed"}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit assessment",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });
};

