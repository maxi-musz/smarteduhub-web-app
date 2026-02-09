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

    // Normalize and apply shuffling
    if (response.data && typeof response.data === "object" && "assessment" in response.data && "questions" in response.data) {
      const data = response.data as unknown as {
        assessment: AssessmentWithQuestions;
        questions: Array<{
          id: string;
          question_text: string;
          question_image?: string | null;
          question_type: string;
          points: number;
          order: number;
          explanation?: string | null;
          options?: Array<{ id: string; text?: string; option_text?: string; is_correct?: boolean; order?: number }>;
          correct_answers?: unknown[];
        }>;
        total_questions: number;
        total_points: number;
        estimated_duration: number;
      };
      const { assessment, questions, total_questions, total_points, estimated_duration } = data;

      // Read shuffle flags (backend may send snake_case or camelCase; default true when omitted)
      const rawAssessment = assessment as unknown as Record<string, unknown>;
      const shuffleQuestions = rawAssessment.shuffle_questions ?? rawAssessment.shuffleQuestions ?? true;
      const shuffleOptions = rawAssessment.shuffle_options ?? rawAssessment.shuffleOptions ?? true;

      // Normalize questions: ensure options array and option.text (backend may send option_text)
      const normalizeCorrectAnswers = (raw: unknown[]): CorrectAnswer[] =>
        raw.map((item) => {
          const o = item as { id?: string; option_ids?: string[] };
          return { id: o.id ?? "", option_ids: Array.isArray(o.option_ids) ? o.option_ids : [] };
        });

      let processedQuestions: AssessmentQuestion[] = questions.map((q) => {
        const options = Array.isArray(q.options) ? q.options : [];
        const normalizedOptions: QuestionOption[] = options.map((opt) => ({
          id: opt.id,
          text: opt.text ?? (opt as { option_text?: string }).option_text ?? "",
          is_correct: opt.is_correct ?? false,
          order: typeof opt.order === "number" ? opt.order : 0,
        }));
        const rawCorrectAnswers = Array.isArray(q.correct_answers) ? q.correct_answers : [];
        return {
          id: q.id,
          question_text: q.question_text,
          question_image: q.question_image ?? null,
          question_type: q.question_type,
          points: q.points,
          order: q.order,
          explanation: q.explanation ?? null,
          options: normalizedOptions,
          correct_answers: normalizeCorrectAnswers(rawCorrectAnswers),
        };
      });

      // Shuffle questions if enabled (always run so order differs per load when shuffle is true)
      if (shuffleQuestions) {
        processedQuestions = shuffleArray(processedQuestions);
        logger.info("[use-student-assessment-questions] Questions shuffled");
      }

      // Shuffle options within each question if enabled
      if (shuffleOptions) {
        processedQuestions = processedQuestions.map((question) => ({
          ...question,
          options: Array.isArray(question.options) && question.options.length > 0
            ? shuffleArray(question.options)
            : question.options,
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

      const percentage = data.data.percentage ?? (data.data as { feedback?: { percentage?: number } }).feedback?.percentage;
      const passed = data.data.passed ?? (data.data as { feedback?: { passed?: boolean } }).feedback?.passed;
      const scoreText = typeof percentage === "number" ? `${percentage.toFixed(1)}%` : null;
      const resultText = typeof passed === "boolean" ? (passed ? "Passed" : "Not Passed") : null;
      const description = scoreText && resultText
        ? `Score: ${scoreText} - ${resultText}`
        : scoreText
          ? `Score: ${scoreText}`
          : "Your submission has been recorded.";

      toast({
        title: "Assessment submitted successfully",
        description,
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

