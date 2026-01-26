import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

// Types
export interface ExploreExamBody {
  id: string;
  name: string;
  fullName: string;
  code: string;
  logoUrl: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  subjects: Array<{
    id: string;
    name: string;
    code: string;
    iconUrl: string | null;
    order: number;
  }>;
  years: Array<{
    id: string;
    year: string;
    order: number;
  }>;
}

export interface ExploreExamBodySubject {
  id: string;
  name: string;
  code: string;
  iconUrl: string | null;
  order: number;
}

export interface ExploreExamBodyYear {
  id: string;
  year: string;
  order: number;
}

export interface ExploreExamBodyAssessment {
  id: string;
  examBodyId: string;
  subjectId: string;
  yearId: string;
  title: string;
  description: string | null;
  duration: number | null;
  maxAttempts: number | null;
  assessmentType: "EXAM";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  subject: {
    id: string;
    name: string;
    code: string;
    iconUrl: string | null;
  };
  year: {
    id: string;
    year: string;
  };
}

export interface ExploreExamBodyQuestionOption {
  id: string;
  optionText: string;
  order: number;
  imageUrl: string | null;
  audioUrl: string | null;
  // NOTE: isCorrect is NOT included in explore API
}

export interface ExploreExamBodyQuestion {
  id: string;
  assessmentId: string;
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  isRequired: boolean;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  explanation: string | null;
  createdAt: string;
  updatedAt: string;
  options: ExploreExamBodyQuestionOption[];
  // NOTE: correctAnswers is NOT included in explore API
}

export interface ExploreExamBodyQuestionsResponse {
  assessment: {
    id: string;
    title: string;
    description: string | null;
    maxAttempts: number | null;
    duration: number | null;
  };
  questions: ExploreExamBodyQuestion[];
}

// Submit Assessment Types
export interface SubmitAssessmentResponse {
  questionId: string;
  selectedOptions?: string[];
  textAnswer?: string;
  numericAnswer?: number;
  dateAnswer?: string;
  timeSpent?: number;
}

export interface SubmitAssessmentRequest {
  responses: SubmitAssessmentResponse[];
  timeSpent?: number;
}

export interface AttemptSummary {
  id: string;
  attemptNumber: number;
  status: "COMPLETED" | "IN_PROGRESS" | "ABANDONED";
  submittedAt: string;
  timeSpent: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
}

export interface Attempt {
  id: string;
  assessmentId: string;
  userId: string;
  attemptNumber: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "GRADED" | "EXPIRED";
  startedAt: string | null;
  submittedAt: string | null;
  timeSpent: number | null;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  isGraded: boolean;
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assessment: {
    id: string;
    title: string;
    description: string | null;
    maxAttempts: number | null;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    year: {
      id: string;
      year: string;
    };
  };
}

export interface AssessmentResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  grade: string;
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  feedback: string | null;
  explanation: string | null;
  selectedOptions?: string[];
  textAnswer?: string | null;
  numericAnswer?: number | null;
  dateAnswer?: string | null;
  correctAnswer?: string | number | string[] | null;
  selectedAnswer?: string | number | string[] | null;
}

export interface SubmitAssessmentResponseData {
  attempt: AttemptSummary;
  results: AssessmentResults;
  responses: QuestionResponse[];
  feedback: {
    message: string;
    attemptsRemaining: number | null;
  };
}

export interface AttemptQuestion {
  questionId: string;
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  explanation: string | null;
  userAnswer: {
    selectedOptions?: string[];
    textAnswer?: string | null;
    numericAnswer?: number | null;
    dateAnswer?: string | null;
    fileUrls?: string[];
  };
  correctAnswer: {
    id: string;
    answerText: string | null;
    answerNumber: number | null;
    answerDate: string | null;
    optionIds: string[];
    answerJson: any | null;
  };
  options: Array<{
    id: string;
    optionText: string;
    order: number;
    isCorrect: boolean;
    imageUrl: string | null;
    audioUrl: string | null;
  }>;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  feedback: string | null;
}

export interface AttemptResultsResponse {
  attempt: AttemptSummary;
  assessment: {
    id: string;
    title: string;
    description: string | null;
    maxAttempts: number | null;
    subject?: {
      id: string;
      name: string;
      code: string;
    };
    year?: {
      id: string;
      year: string;
    };
  };
  questions: AttemptQuestion[];
  results: AssessmentResults;
}

const BASE_PATH = "/explore/exam-bodies";

// Hook: Get all exam bodies
export const useExploreExamBodies = () => {
  return useQuery<ExploreExamBody[], AuthenticatedApiError>({
    queryKey: ["explore", "exam-bodies"],
    queryFn: async () => {
      logger.info("[useExploreExamBodies] Fetching exam bodies");
      const response = await authenticatedApi.get<ExploreExamBody[]>(BASE_PATH);

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch exam bodies",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }

      // Handle nested data structure
      if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.data)) {
          return record.data as ExploreExamBody[];
        }
        if (Array.isArray(record.examBodies)) {
          return record.examBodies as ExploreExamBody[];
        }
      }

      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook: Get single exam body
export const useExploreExamBody = (examBodyId: string | null) => {
  return useQuery<ExploreExamBody, AuthenticatedApiError>({
    queryKey: ["explore", "exam-bodies", examBodyId],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }

      logger.info("[useExploreExamBody] Fetching exam body", { examBodyId });
      const response = await authenticatedApi.get<ExploreExamBody>(
        `${BASE_PATH}/${examBodyId}`
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch exam body",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (data && typeof data === "object") {
        const record = data as unknown as Record<string, unknown>;
        if (record.id) {
          return data as ExploreExamBody;
        }
        if (record.data && typeof record.data === "object") {
          return record.data as ExploreExamBody;
        }
      }

      return data as ExploreExamBody;
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook: Get subjects for exam body
export const useExploreExamBodySubjects = (examBodyId: string | null) => {
  return useQuery<ExploreExamBodySubject[], AuthenticatedApiError>({
    queryKey: ["explore", "exam-bodies", examBodyId, "subjects"],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }

      logger.info("[useExploreExamBodySubjects] Fetching subjects", {
        examBodyId,
      });
      const response = await authenticatedApi.get<ExploreExamBodySubject[]>(
        `${BASE_PATH}/${examBodyId}/subjects`
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch subjects",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.data)) {
          return record.data as ExploreExamBodySubject[];
        }
        if (Array.isArray(record.subjects)) {
          return record.subjects as ExploreExamBodySubject[];
        }
      }

      return [];
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook: Get years for exam body
export const useExploreExamBodyYears = (examBodyId: string | null) => {
  return useQuery<ExploreExamBodyYear[], AuthenticatedApiError>({
    queryKey: ["explore", "exam-bodies", examBodyId, "years"],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }

      logger.info("[useExploreExamBodyYears] Fetching years", { examBodyId });
      const response = await authenticatedApi.get<ExploreExamBodyYear[]>(
        `${BASE_PATH}/${examBodyId}/years`
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch years",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.data)) {
          return record.data as ExploreExamBodyYear[];
        }
        if (Array.isArray(record.years)) {
          return record.years as ExploreExamBodyYear[];
        }
      }

      return [];
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook: Get assessments for exam body
export const useExploreExamBodyAssessments = (
  examBodyId: string | null,
  filters?: {
    subjectId?: string | null;
    yearId?: string | null;
  }
) => {
  return useQuery<ExploreExamBodyAssessment[], AuthenticatedApiError>({
    queryKey: [
      "explore",
      "exam-bodies",
      examBodyId,
      "assessments",
      filters?.subjectId,
      filters?.yearId,
    ],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }

      const params = new URLSearchParams();
      if (filters?.subjectId) {
        params.append("subjectId", filters.subjectId);
      }
      if (filters?.yearId) {
        params.append("yearId", filters.yearId);
      }

      const queryString = params.toString();
      const url = `${BASE_PATH}/${examBodyId}/assessments${
        queryString ? `?${queryString}` : ""
      }`;

      logger.info("[useExploreExamBodyAssessments] Fetching assessments", {
        examBodyId,
        filters,
      });
      const response = await authenticatedApi.get<ExploreExamBodyAssessment[]>(
        url
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch assessments",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.data)) {
          return record.data as ExploreExamBodyAssessment[];
        }
        if (Array.isArray(record.assessments)) {
          return record.assessments as ExploreExamBodyAssessment[];
        }
      }

      return [];
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook: Get questions for assessment (without answers)
export const useExploreExamBodyQuestions = (
  examBodyId: string | null,
  assessmentId: string | null
) => {
  return useQuery<
    ExploreExamBodyQuestionsResponse,
    AuthenticatedApiError
  >({
    queryKey: [
      "explore",
      "exam-bodies",
      examBodyId,
      "assessments",
      assessmentId,
      "questions",
    ],
    queryFn: async () => {
      if (!examBodyId || !assessmentId) {
        throw new AuthenticatedApiError(
          "Exam body ID and assessment ID are required",
          400
        );
      }

      logger.info("[useExploreExamBodyQuestions] Fetching questions", {
        examBodyId,
        assessmentId,
      });
      const response = await authenticatedApi.get<ExploreExamBodyQuestionsResponse>(
        `${BASE_PATH}/${examBodyId}/assessments/${assessmentId}/questions`
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch questions",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (data && typeof data === "object") {
        const record = data as unknown as Record<string, unknown>;
        if (record.assessment && record.questions) {
          return data as ExploreExamBodyQuestionsResponse;
        }
        if (record.data && typeof record.data === "object") {
          return record.data as ExploreExamBodyQuestionsResponse;
        }
      }

      return data as ExploreExamBodyQuestionsResponse;
    },
    enabled: !!examBodyId && !!assessmentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook: Submit assessment
export const useSubmitAssessment = (
  examBodyId: string,
  assessmentId: string
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    SubmitAssessmentResponseData,
    AuthenticatedApiError,
    SubmitAssessmentRequest
  >({
    mutationFn: async (data) => {
      logger.info("[useSubmitAssessment] Submitting assessment", {
        examBodyId,
        assessmentId,
      });
      const response = await authenticatedApi.post<SubmitAssessmentResponseData>(
        `${BASE_PATH}/${examBodyId}/assessments/${assessmentId}/submit`,
        data
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to submit assessment",
          response.statusCode || 400,
          response
        );
      }

      const responseData = response.data;
      if (responseData && typeof responseData === "object") {
        const record = responseData as unknown as Record<string, unknown>;
        if (record.attempt && record.results) {
          return responseData as SubmitAssessmentResponseData;
        }
        if (record.data && typeof record.data === "object") {
          return record.data as SubmitAssessmentResponseData;
        }
      }

      return responseData as SubmitAssessmentResponseData;
    },
    onSuccess: () => {
      // Invalidate attempts list and questions
      queryClient.invalidateQueries({
        queryKey: [
          "explore",
          "exam-bodies",
          examBodyId,
          "assessments",
          assessmentId,
          "attempts",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "explore",
          "exam-bodies",
          examBodyId,
          "assessments",
          assessmentId,
          "questions",
        ],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook: Get attempt results
export const useAttemptResults = (attemptId: string | null) => {
  return useQuery<AttemptResultsResponse, AuthenticatedApiError>({
    queryKey: ["explore", "exam-bodies", "attempts", attemptId],
    queryFn: async () => {
      if (!attemptId) {
        throw new AuthenticatedApiError("Attempt ID is required", 400);
      }

      logger.info("[useAttemptResults] Fetching attempt results", {
        attemptId,
      });
      const response = await authenticatedApi.get<AttemptResultsResponse>(
        `${BASE_PATH}/attempts/${attemptId}`
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch attempt results",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (data && typeof data === "object") {
        const record = data as unknown as Record<string, unknown>;
        if (record.attempt && record.responses) {
          return data as AttemptResultsResponse;
        }
        if (record.data && typeof record.data === "object") {
          return record.data as AttemptResultsResponse;
        }
      }

      return data as AttemptResultsResponse;
    },
    enabled: !!attemptId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook: Get all attempts for a user (optionally filtered by assessmentId)
export const useAssessmentAttempts = (assessmentId?: string | null) => {
  return useQuery<Attempt[], AuthenticatedApiError>({
    queryKey: ["explore", "exam-bodies", "attempts", assessmentId],
    queryFn: async () => {
      logger.info("[useAssessmentAttempts] Fetching attempts", {
        assessmentId,
      });

      const url = assessmentId
        ? `${BASE_PATH}/attempts?assessmentId=${assessmentId}`
        : `${BASE_PATH}/attempts`;

      const response = await authenticatedApi.get<Attempt[]>(url);

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch attempts",
          response.statusCode || 400,
          response
        );
      }

      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === "object") {
        const record = data as unknown as Record<string, unknown>;
        if (Array.isArray(record.data)) {
          return record.data as Attempt[];
        }
        if (Array.isArray(record.attempts)) {
          return record.attempts as Attempt[];
        }
      }

      return [];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
