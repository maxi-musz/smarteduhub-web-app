import { useQuery, useMutation } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface AssessmentSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  thumbnailUrl: string | null;
}

export interface AssessmentChapter {
  id: string;
  title: string;
  order: number;
}

export interface AssessmentTopic {
  id: string;
  title: string;
  description: string | null;
}

export interface AssessmentPlatform {
  id: string;
  name: string;
  slug: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  assessmentType: string;
  gradingType: string;
  status: string;
  duration: number; // minutes
  timeLimit: number; // seconds
  startDate: string | null;
  endDate: string | null;
  maxAttempts: number;
  allowReview: boolean;
  totalPoints: number;
  passingScore: number;
  showCorrectAnswers: boolean;
  showFeedback: boolean;
  studentCanViewGrading: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  subject: AssessmentSubject;
  chapter: AssessmentChapter | null;
  topic: AssessmentTopic | null;
  platform: AssessmentPlatform;
  questionsCount: number;
}

export interface UserAttempt {
  id: string;
  attemptNumber: number;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  totalScore: number | null;
  percentage: number | null;
  passed: boolean | null;
  isGraded: boolean;
  createdAt: string;
}

export interface UserProgress {
  attemptsTaken: number;
  attemptsRemaining: number;
  maxAttempts: number;
  canTakeAssessment: boolean;
  latestAttempt: UserAttempt | null;
}

export interface AssessmentDetailsResponse {
  assessment: Assessment;
  userProgress: UserProgress;
  attempts: UserAttempt[];
}

export interface QuestionOption {
  id: string;
  optionText: string;
  order: number;
  imageUrl: string | null;
  audioUrl: string | null;
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  questionType: string;
  order: number;
  points: number;
  isRequired: boolean;
  timeLimit: number | null;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  showHint: boolean;
  hintText: string | null;
  minLength: number | null;
  maxLength: number | null;
  minValue: number | null;
  maxValue: number | null;
  difficultyLevel: string | null;
  options: QuestionOption[];
}

export interface AssessmentQuestionsResponse {
  assessmentId: string;
  assessmentTitle: string;
  questions: AssessmentQuestion[];
  totalQuestions: number;
  totalPoints: number;
  showCorrectAnswers: boolean;
}

export function useAssessmentDetails(assessmentId: string | null) {
  return useQuery<AssessmentDetailsResponse, AuthenticatedApiError>({
    queryKey: ["explore", "assessment", assessmentId],
    queryFn: async () => {
      if (!assessmentId) {
        throw new AuthenticatedApiError("Assessment ID is required", 400);
      }

      logger.info(`[useAssessmentDetails] Fetching assessment: ${assessmentId}`);
      const response = await authenticatedApi.get<AssessmentDetailsResponse>(
        `/explore/assessments/${assessmentId}`
      );

      if (response.success && response.data) {
        logger.info(`[useAssessmentDetails] Assessment fetched successfully`, {
          assessmentId,
          title: response.data.assessment.title,
          canTake: response.data.userProgress.canTakeAssessment,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch assessment",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!assessmentId,
    staleTime: 0, // Don't cache - always fresh
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useAssessmentQuestions(assessmentId: string | null, enabled: boolean = false) {
  return useQuery<AssessmentQuestionsResponse, AuthenticatedApiError>({
    queryKey: ["explore", "assessment", assessmentId, "questions"],
    queryFn: async () => {
      if (!assessmentId) {
        throw new AuthenticatedApiError("Assessment ID is required", 400);
      }

      logger.info(`[useAssessmentQuestions] Fetching questions: ${assessmentId}`);
      const response = await authenticatedApi.get<AssessmentQuestionsResponse>(
        `/explore/assessments/${assessmentId}/questions`
      );

      if (response.success && response.data) {
        logger.info(`[useAssessmentQuestions] Questions fetched successfully`, {
          assessmentId,
          questionCount: response.data.questions.length,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch questions",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!assessmentId && enabled,
    staleTime: 0, // Don't cache - always fresh
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export interface QuestionResponse {
  questionId: string;
  selectedOptions?: string[];
  textAnswer?: string;
  numericAnswer?: number;
  dateAnswer?: string;
  fileUrls?: string[];
  timeSpent?: number;
}

export interface SubmitAssessmentRequest {
  responses: QuestionResponse[];
  timeSpent: number;
}

export interface QuestionResponseResult {
  questionId: string;
  questionText: string;
  questionType: string;
  selectedOptions?: string[];
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  correctAnswer?: string;
  selectedAnswer?: string;
  explanation?: string;
  timeSpent: number;
}

export interface AssessmentSubmissionResponse {
  attempt: {
    id: string;
    attemptNumber: number;
    status: string;
    submittedAt: string;
    timeSpent: number;
    totalScore: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
  };
  results: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    totalScore: number;
    maxScore: number;
    percentage: number;
    passingScore: number;
    passed: boolean;
    grade: string;
  };
  responses: QuestionResponseResult[];
  feedback: {
    message: string;
    attemptsRemaining: number;
  };
}

export function useSubmitAssessment() {
  return useMutation<AssessmentSubmissionResponse, AuthenticatedApiError, { assessmentId: string; data: SubmitAssessmentRequest }>({
    mutationFn: async ({ assessmentId, data }) => {
      logger.info(`[useSubmitAssessment] Submitting assessment: ${assessmentId}`);
      const response = await authenticatedApi.post<AssessmentSubmissionResponse>(
        `/explore/assessments/${assessmentId}/submit`,
        data
      );

      if (response.success && response.data) {
        logger.info(`[useSubmitAssessment] Assessment submitted successfully`, {
          assessmentId,
          score: response.data.results.percentage,
          passed: response.data.results.passed,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to submit assessment",
        response.statusCode || 400,
        response
      );
    },
  });
}

// Attempt Results Types
export interface AttemptUserAnswer {
  textAnswer: string | null;
  numericAnswer: number | null;
  dateAnswer: string | null;
  selectedOptions: string[];
  fileUrls: string[];
}

export interface AttemptCorrectAnswer {
  text: string | null;
  number: number | null;
  date: string | null;
  optionIds: string[];
}

export interface AttemptQuestionResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  points: number;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  order: number;
  options: Array<{
    id: string;
    optionText: string;
    imageUrl: string | null;
    order: number;
  }>;
  userAnswer: AttemptUserAnswer;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  feedback: string | null;
  timeSpent: number;
  correctAnswer?: AttemptCorrectAnswer;
  explanation?: string;
}

export interface AttemptResultsResponse {
  attempt: {
    id: string;
    attemptNumber: number;
    status: string;
    startedAt: string;
    submittedAt: string;
    timeSpent: number;
    totalScore: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    isGraded: boolean;
    gradedAt: string | null;
    grade: string | null;
  };
  assessment: {
    id: string;
    title: string;
    description: string | null;
    totalPoints: number;
    passingScore: number;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    chapter: {
      id: string;
      title: string;
    } | null;
    topic: {
      id: string;
      title: string;
    } | null;
  };
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    ungradedQuestions: number;
  };
  responses: AttemptQuestionResponse[];
}

export function useAttemptResults(attemptId: string | null) {
  return useQuery<AttemptResultsResponse, AuthenticatedApiError>({
    queryKey: ["explore", "assessments", "attempts", attemptId],
    queryFn: async () => {
      if (!attemptId) {
        throw new AuthenticatedApiError("Attempt ID is required", 400);
      }

      logger.info(`[useAttemptResults] Fetching attempt results: ${attemptId}`);
      const response = await authenticatedApi.get<AttemptResultsResponse>(
        `/explore/assessments/attempts/${attemptId}`
      );

      if (response.success && response.data) {
        logger.info(`[useAttemptResults] Attempt results fetched successfully`, {
          attemptId,
          score: response.data.attempt.percentage,
          passed: response.data.attempt.passed,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch attempt results",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!attemptId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

