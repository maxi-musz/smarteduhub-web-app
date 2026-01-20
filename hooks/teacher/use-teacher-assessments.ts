import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

// Types based on TEACHER-ASSESSMENT-API.md
type ApiResponseData<T> = T;

// 1. Assessment Types
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ACTIVE" | "CLOSED" | "ARCHIVED";
export type AssessmentType = "CBT" | "ASSIGNMENT" | "EXAM" | "QUIZ" | "TEST" | "FORMATIVE" | "SUMMATIVE" | "DIAGNOSTIC" | "BENCHMARK" | "PRACTICE" | "MOCK_EXAM" | "OTHER";
export type GradingType = "AUTOMATIC" | "MANUAL" | "MIXED";
export type QuestionType = "MULTIPLE_CHOICE_SINGLE" | "MULTIPLE_CHOICE_MULTIPLE" | "SHORT_ANSWER" | "LONG_ANSWER" | "TRUE_FALSE" | "FILL_IN_BLANK" | "MATCHING" | "ORDERING" | "FILE_UPLOAD" | "NUMERIC" | "DATE" | "RATING_SCALE";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  subject_id: string;
  topic_id: string | null;
  duration: number | null;
  max_attempts: number;
  passing_score: number;
  total_points: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_correct_answers: boolean;
  show_feedback: boolean;
  allow_review: boolean;
  start_date: string | null;
  end_date: string | null;
  time_limit: number | null;
  grading_type: GradingType;
  auto_submit: boolean;
  tags: string[];
  assessment_type: AssessmentType;
  status: AssessmentStatus;
  created_by: string;
  school_id: string;
  academic_session_id: string;
  is_result_released: boolean;
  created_at: string;
  updated_at: string;
  subject?: {
    id: string;
    name: string;
    code: string | null;
  };
  topic?: {
    id: string;
    title: string;
  };
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface AssessmentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Raw API response shape for GET /teachers/assessments
export interface AssessmentsApiResponse {
  assessments: Partial<Record<AssessmentType, Assessment[]>>;
  counts: Partial<Record<AssessmentType, number>>;
  total: number;
}

// Normalized shape used by the UI
export interface AssessmentsResponse {
  assessments: Assessment[];
  pagination: AssessmentPagination;
}

export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  instructions?: string;
  subject_id: string;
  topic_id?: string;
  duration?: number;
  max_attempts?: number;
  passing_score?: number;
  total_points?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  show_correct_answers?: boolean;
  show_feedback?: boolean;
  allow_review?: boolean;
  start_date?: string;
  end_date?: string;
  time_limit?: number;
  grading_type?: GradingType;
  auto_submit?: boolean;
  tags?: string[];
  assessment_type?: AssessmentType;
}

export interface UpdateAssessmentRequest {
  title?: string;
  description?: string;
  instructions?: string;
  duration?: number;
  max_attempts?: number;
  passing_score?: number;
  total_points?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  show_correct_answers?: boolean;
  show_feedback?: boolean;
  allow_review?: boolean;
  start_date?: string;
  end_date?: string;
  time_limit?: number;
  grading_type?: GradingType;
  auto_submit?: boolean;
  tags?: string[];
  assessment_type?: AssessmentType;
  status?: AssessmentStatus;
}

export interface QuestionOption {
  id?: string;
  option_text: string;
  order: number;
  is_correct: boolean;
  image_url?: string | null;
  audio_url?: string | null;
}

export interface CorrectAnswer {
  id?: string;
  answer_text?: string | null;
  answer_number?: number | null;
  answer_date?: string | null;
  option_ids?: string[];
  answer_json?: unknown;
}

export interface Question {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: QuestionType;
  order: number;
  points: number;
  is_required: boolean;
  time_limit: number | null;
  image_url: string | null;
  image_s3_key: string | null;
  audio_url: string | null;
  video_url: string | null;
  allow_multiple_attempts: boolean;
  show_hint: boolean;
  hint_text: string | null;
  min_length: number | null;
  max_length: number | null;
  min_value: number | null;
  max_value: number | null;
  explanation: string | null;
  difficulty_level: DifficultyLevel;
  created_at: string;
  updated_at: string;
  options?: QuestionOption[];
  correct_answers?: CorrectAnswer[];
}

export interface QuestionsResponse {
  assessment: {
    id: string;
    title: string;
    subject: {
      id: string;
      name: string;
      code: string | null;
    };
    topic: {
      id: string;
      title: string;
    } | null;
  };
  questions: Question[];
  total_questions: number;
  total_points: number;
}

export interface CreateQuestionRequest {
  question_text: string;
  question_type: QuestionType;
  order?: number;
  points?: number;
  is_required?: boolean;
  time_limit?: number;
  image_url?: string;
  image_s3_key?: string;
  audio_url?: string;
  video_url?: string;
  allow_multiple_attempts?: boolean;
  show_hint?: boolean;
  hint_text?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  explanation?: string;
  difficulty_level?: DifficultyLevel;
  options?: QuestionOption[];
  correct_answers?: CorrectAnswer[];
}

export interface UpdateQuestionRequest {
  question_text?: string;
  question_type?: QuestionType;
  order?: number;
  points?: number;
  is_required?: boolean;
  time_limit?: number;
  image_url?: string;
  image_s3_key?: string;
  audio_url?: string;
  video_url?: string;
  allow_multiple_attempts?: boolean;
  show_hint?: boolean;
  hint_text?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  explanation?: string;
  difficulty_level?: DifficultyLevel;
  options?: QuestionOption[];
  correct_answers?: CorrectAnswer[];
}

export interface UploadImageResponse {
  image_url: string;
  image_s3_key: string;
}

export interface AssessmentAttempt {
  id: string;
  attempt_number: number;
  score: number;
  percentage: number;
  status: string;
  started_at: string;
  submitted_at: string | null;
  time_taken: number | null;
  is_passed: boolean;
}

export interface StudentAttemptData {
  student: {
    id: string;
    student_id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
      display_picture: string | null;
    };
  };
  attempts: AssessmentAttempt[];
  best_score: number | null;
  attempts_count: number;
  has_passed: boolean;
}

export interface AssessmentAttemptsResponse {
  assessment: {
    id: string;
    title: string;
    total_points: number;
    passing_score: number;
    max_attempts: number;
    subject: {
      id: string;
      name: string;
      code: string | null;
    };
    topic: {
      id: string;
      title: string;
    } | null;
  };
  students: StudentAttemptData[];
  statistics: {
    total_students: number;
    attempted_count: number;
    not_attempted_count: number;
    passed_count: number;
    failed_count: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
  };
}

export interface StudentSubmissionResponse {
  assessment: {
    id: string;
    title: string;
    total_points: number;
  };
  student: {
    id: string;
    student_id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
      display_picture: string | null;
    };
  };
  attempts: Array<{
    id: string;
    attempt_number: number;
    score: number;
    percentage: number;
    status: string;
    started_at: string;
    submitted_at: string;
    time_taken: number;
    is_passed: boolean;
    responses: Array<{
      id: string;
      question_id: string;
      question_text: string;
      question_type: QuestionType;
      question_points: number;
      selected_option_ids: string[] | null;
      answer_text: string | null;
      is_correct: boolean;
      points_awarded: number;
      feedback: string | null;
    }>;
  }>;
  best_attempt: {
    attempt_number: number;
    score: number;
    percentage: number;
  };
}

export interface GetAssessmentsParams {
  subject_id: string;
  status?: AssessmentStatus;
  topic_id?: string;
  assessment_type?: AssessmentType;
  page?: number;
  limit?: number;
}

// 1. Create Assessment
export function useCreateAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Assessment, AuthenticatedApiError, CreateAssessmentRequest>({
    mutationFn: async (data) => {
      logger.info("[useCreateAssessment] Creating assessment", { title: data.title });
      const response = await authenticatedApi.post<ApiResponseData<Assessment>>(
        "/teachers/assessments",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateAssessment] Assessment created successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", data.subject_id] });
      toast({
        title: "Assessment created successfully",
        description: data.title,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 2. Get All Assessments
export function useAssessments(params: GetAssessmentsParams) {
  return useQuery<AssessmentsResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "assessments", params],
    queryFn: async () => {
      logger.info("[useAssessments] Fetching assessments", { params });
      const queryParams = new URLSearchParams();
      queryParams.append("subject_id", params.subject_id);
      if (params.status) queryParams.append("status", params.status);
      if (params.topic_id) queryParams.append("topic_id", params.topic_id);
      if (params.assessment_type) queryParams.append("assessment_type", params.assessment_type);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const endpoint = `/teachers/assessments?${queryParams.toString()}`;
      const response = await authenticatedApi.get<ApiResponseData<AssessmentsApiResponse>>(endpoint);

      if (response.success && response.data) {
        logger.info("[useAssessments] Assessments fetched successfully");

        const apiData = response.data;

        // Flatten assessments based on optional type filter
        let flatAssessments: Assessment[] = [];

        if (params.assessment_type) {
          const list = apiData.assessments[params.assessment_type];
          flatAssessments = Array.isArray(list) ? list : [];
        } else {
          flatAssessments = Object.values(apiData.assessments).flatMap((group) =>
            Array.isArray(group) ? group : []
          );
        }

        const page = params.page ?? 1;
        const limit = params.limit ?? (flatAssessments.length || 10);
        const total = apiData.total ?? flatAssessments.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        const normalized: AssessmentsResponse = {
          assessments: flatAssessments,
          pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
          },
        };

        return normalized;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch assessments",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!params.subject_id,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache for 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    refetchOnReconnect: false, // Don't refetch on reconnect if data is still fresh
  });
}

// 3. Get Assessment by ID
export function useAssessmentById(assessmentId: string | null) {
  return useQuery<Assessment, AuthenticatedApiError>({
    queryKey: ["teacher", "assessments", assessmentId],
    queryFn: async () => {
      if (!assessmentId) {
        throw new AuthenticatedApiError("Assessment ID is required", 400);
      }
      logger.info("[useAssessmentById] Fetching assessment", { assessmentId });
      const response = await authenticatedApi.get<ApiResponseData<Assessment>>(
        `/teachers/assessments/${assessmentId}`
      );

      if (response.success && response.data) {
        logger.info("[useAssessmentById] Assessment fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch assessment",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!assessmentId,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache for 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    refetchOnReconnect: false, // Don't refetch on reconnect if data is still fresh
  });
}

// 4. Update Assessment
export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Assessment, AuthenticatedApiError, { id: string; data: UpdateAssessmentRequest }>({
    mutationFn: async ({ id, data }) => {
      logger.info("[useUpdateAssessment] Updating assessment", { id });
      const response = await authenticatedApi.patch<ApiResponseData<Assessment>>(
        `/teachers/assessments/${id}`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateAssessment] Assessment updated successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", data.id] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", data.subject_id] });
      toast({
        title: "Assessment updated successfully",
        description: data.title,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 5. Delete Assessment
export function useDeleteAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      logger.info("[useDeleteAssessment] Deleting assessment", { id });
      const response = await authenticatedApi.delete<ApiResponseData<null>>(
        `/teachers/assessments/${id}`
      );

      if (response.success) {
        logger.info("[useDeleteAssessment] Assessment deleted successfully");
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments"] });
      queryClient.removeQueries({ queryKey: ["teacher", "assessments", id] });
      toast({
        title: "Assessment deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 6. Publish Assessment
export function usePublishAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Assessment, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      logger.info("[usePublishAssessment] Publishing assessment", { id });
      const response = await authenticatedApi.post<ApiResponseData<Assessment>>(
        `/teachers/assessments/${id}/publish`
      );

      if (response.success && response.data) {
        logger.info("[usePublishAssessment] Assessment published successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to publish assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate all assessment queries
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments"] });
      // Invalidate specific assessment
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", data.id] });
      // Invalidate assessments list for this subject
      if (data.subject_id) {
        queryClient.invalidateQueries({ 
          queryKey: ["teacher", "assessments"], 
          predicate: (query) => {
            const queryKey = query.queryKey;
            // Match queries with params that include this subject_id
            if (queryKey.length >= 3 && typeof queryKey[2] === 'object' && queryKey[2] !== null) {
              const params = queryKey[2] as GetAssessmentsParams;
              return params.subject_id === data.subject_id;
            }
            return false;
          }
        });
      }
      toast({
        title: "Assessment published successfully",
        description: "Students can now access this assessment",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to publish assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 7. Unpublish Assessment
export function useUnpublishAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Assessment, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      logger.info("[useUnpublishAssessment] Unpublishing assessment", { id });
      const response = await authenticatedApi.post<ApiResponseData<Assessment>>(
        `/teachers/assessments/${id}/unpublish`
      );

      if (response.success && response.data) {
        logger.info("[useUnpublishAssessment] Assessment unpublished successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to unpublish assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate all assessment queries
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments"] });
      // Invalidate specific assessment
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", data.id] });
      // Invalidate assessments list for this subject
      if (data.subject_id) {
        queryClient.invalidateQueries({ 
          queryKey: ["teacher", "assessments"], 
          predicate: (query) => {
            const queryKey = query.queryKey;
            // Match queries with params that include this subject_id
            if (queryKey.length >= 3 && typeof queryKey[2] === 'object' && queryKey[2] !== null) {
              const params = queryKey[2] as GetAssessmentsParams;
              return params.subject_id === data.subject_id;
            }
            return false;
          }
        });
      }
      toast({
        title: "Assessment unpublished successfully",
        description: "Students can no longer access this assessment",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to unpublish assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 8. Release Results
export function useReleaseResults() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Assessment, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      logger.info("[useReleaseResults] Releasing results", { id });
      const response = await authenticatedApi.post<ApiResponseData<Assessment>>(
        `/teachers/assessments/${id}/release-results`
      );

      if (response.success && response.data) {
        logger.info("[useReleaseResults] Results released successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to release results",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", data.id] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", data.id, "attempts"] });
      toast({
        title: "Results released successfully",
        description: "Students can now see their scores and correct answers",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to release results",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 9. Get Topic Assessments
export function useTopicAssessments(topicId: string | null) {
  return useQuery<Assessment[], AuthenticatedApiError>({
    queryKey: ["teacher", "assessments", "topic", topicId],
    queryFn: async () => {
      if (!topicId) {
        throw new AuthenticatedApiError("Topic ID is required", 400);
      }
      logger.info("[useTopicAssessments] Fetching topic assessments", { topicId });
      const response = await authenticatedApi.get<ApiResponseData<Assessment[]>>(
        `/teachers/assessments/topic/${topicId}`
      );

      if (response.success && response.data) {
        logger.info("[useTopicAssessments] Topic assessments fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch topic assessments",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!topicId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// 10. Get Assessment Questions
export function useAssessmentQuestions(assessmentId: string | null) {
  return useQuery<QuestionsResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "assessments", assessmentId, "questions"],
    queryFn: async () => {
      if (!assessmentId) {
        throw new AuthenticatedApiError("Assessment ID is required", 400);
      }
      logger.info("[useAssessmentQuestions] Fetching questions", { assessmentId });
      const response = await authenticatedApi.get<ApiResponseData<QuestionsResponse>>(
        `/teachers/assessments/${assessmentId}/questions`
      );

      if (response.success && response.data) {
        logger.info("[useAssessmentQuestions] Questions fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch questions",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!assessmentId,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache for 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    refetchOnReconnect: false, // Don't refetch on reconnect if data is still fresh
  });
}

// 11. Upload Question Image
export function useUploadQuestionImage() {
  const { toast } = useToast();

  return useMutation<UploadImageResponse, AuthenticatedApiError, { assessmentId: string; image: File }>({
    mutationFn: async ({ assessmentId, image }) => {
      logger.info("[useUploadQuestionImage] Uploading image", { assessmentId });
      const formData = new FormData();
      formData.append("image", image);

      const response = await authenticatedApi.post<ApiResponseData<UploadImageResponse>>(
        `/teachers/assessments/${assessmentId}/questions/upload-image`,
        formData
      );

      if (response.success && response.data) {
        logger.info("[useUploadQuestionImage] Image uploaded successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to upload image",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      toast({
        title: "Image uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to upload image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 12. Create Question
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Question, AuthenticatedApiError, { assessmentId: string; data: CreateQuestionRequest; imageFile?: File }>({
    mutationFn: async ({ assessmentId, data, imageFile }) => {
      logger.info("[useCreateQuestion] Creating question", { assessmentId, hasImage: !!imageFile });

      // If image is provided, use atomic endpoint (recommended)
      if (imageFile) {
        const formData = new FormData();
        
        // Remove image_url and image_s3_key from data - not needed when uploading file
        const { image_url, image_s3_key, ...questionData } = data;
        
        // Append question data as JSON string
        formData.append('questionData', JSON.stringify(questionData));
        
        // Append image file
        formData.append('image', imageFile);

        const response = await authenticatedApi.post<ApiResponseData<Question>>(
          `/teachers/assessments/${assessmentId}/questions/with-image`,
          formData
        );

        if (response.success && response.data) {
          logger.info("[useCreateQuestion] Question created successfully with image");
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to create question",
          response.statusCode || 400,
          response
        );
      } else {
        // No image - use regular JSON endpoint
        const response = await authenticatedApi.post<ApiResponseData<Question>>(
          `/teachers/assessments/${assessmentId}/questions`,
          data
        );

        if (response.success && response.data) {
          logger.info("[useCreateQuestion] Question created successfully");
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to create question",
          response.statusCode || 400,
          response
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", variables.assessmentId, "questions"] });
      toast({
        title: "Question created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create question",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 13. Update Question
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Question, AuthenticatedApiError, { assessmentId: string; questionId: string; data: UpdateQuestionRequest; imageFile?: File }>({
    mutationFn: async ({ assessmentId, questionId, data, imageFile }) => {
      logger.info("[useUpdateQuestion] Updating question", { assessmentId, questionId });
      
      if (imageFile) {
        // If image is provided, send as FormData
        const formData = new FormData();
        formData.append("image", imageFile);
        // Append other fields as JSON string
        const { image_url, image_s3_key, ...questionData } = data;
        formData.append("questionData", JSON.stringify(questionData));

        const response = await authenticatedApi.patch<ApiResponseData<Question>>(
          `/teachers/assessments/${assessmentId}/questions/${questionId}`,
          formData
        );

        if (response.success && response.data) {
          logger.info("[useUpdateQuestion] Question updated successfully with image");
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to update question",
          response.statusCode || 400,
          response
        );
      } else {
        // No image - send as JSON
        const response = await authenticatedApi.patch<ApiResponseData<Question>>(
          `/teachers/assessments/${assessmentId}/questions/${questionId}`,
          data
        );

        if (response.success && response.data) {
          logger.info("[useUpdateQuestion] Question updated successfully");
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to update question",
          response.statusCode || 400,
          response
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", variables.assessmentId, "questions"] });
      toast({
        title: "Question updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update question",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 14. Delete Question Image
export function useDeleteQuestionImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, { assessmentId: string; questionId: string }>({
    mutationFn: async ({ assessmentId, questionId }) => {
      logger.info("[useDeleteQuestionImage] Deleting question image", { assessmentId, questionId });
      const response = await authenticatedApi.delete<ApiResponseData<null>>(
        `/teachers/assessments/${assessmentId}/questions/${questionId}/image`
      );

      if (response.success) {
        logger.info("[useDeleteQuestionImage] Question image deleted successfully");
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete question image",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", variables.assessmentId, "questions"] });
      toast({
        title: "Image deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 15. Delete Question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, { assessmentId: string; questionId: string }>({
    mutationFn: async ({ assessmentId, questionId }) => {
      logger.info("[useDeleteQuestion] Deleting question", { assessmentId, questionId });
      const response = await authenticatedApi.delete<ApiResponseData<null>>(
        `/teachers/assessments/${assessmentId}/questions/${questionId}`
      );

      if (response.success) {
        logger.info("[useDeleteQuestion] Question deleted successfully");
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete question",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments", variables.assessmentId, "questions"] });
      toast({
        title: "Question deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete question",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// 16. Get Assessment Attempts
export function useAssessmentAttempts(assessmentId: string | null) {
  return useQuery<AssessmentAttemptsResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "assessments", assessmentId, "attempts"],
    queryFn: async () => {
      if (!assessmentId) {
        throw new AuthenticatedApiError("Assessment ID is required", 400);
      }
      logger.info("[useAssessmentAttempts] Fetching attempts", { assessmentId });
      const response = await authenticatedApi.get<ApiResponseData<AssessmentAttemptsResponse>>(
        `/teachers/assessments/${assessmentId}/attempts`
      );

      if (response.success && response.data) {
        logger.info("[useAssessmentAttempts] Attempts fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch attempts",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!assessmentId,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache for 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    refetchOnReconnect: false, // Don't refetch on reconnect if data is still fresh
  });
}

// 17. Get Student Submission
export function useStudentSubmission(assessmentId: string | null, studentId: string | null) {
  return useQuery<StudentSubmissionResponse, AuthenticatedApiError>({
    queryKey: ["teacher", "assessments", assessmentId, "attempts", studentId],
    queryFn: async () => {
      if (!assessmentId || !studentId) {
        throw new AuthenticatedApiError("Assessment ID and Student ID are required", 400);
      }
      logger.info("[useStudentSubmission] Fetching student submission", { assessmentId, studentId });
      const response = await authenticatedApi.get<ApiResponseData<StudentSubmissionResponse>>(
        `/teachers/assessments/${assessmentId}/attempts/${studentId}`
      );

      if (response.success && response.data) {
        logger.info("[useStudentSubmission] Student submission fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch student submission",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!assessmentId && !!studentId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}


