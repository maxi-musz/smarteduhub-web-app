import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

// Re-export types from teacher assessments hook
export type {
  Assessment,
  AssessmentStatus,
  AssessmentType,
  GradingType,
  QuestionType,
  DifficultyLevel,
  AssessmentPagination,
  AssessmentsResponse,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  Question,
  QuestionOption,
  CorrectAnswer,
  QuestionsResponse,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  UploadImageResponse,
  AssessmentAttempt,
  StudentAttemptData,
  AssessmentAttemptsResponse,
  StudentSubmissionResponse,
} from "@/hooks/teacher/use-teacher-assessments";

export interface GetAssessmentsParams {
  subject_id: string;
  status?: AssessmentStatus;
  topic_id?: string;
  assessment_type?: AssessmentType;
  page?: number;
  limit?: number;
  role?: "teacher" | "school_director" | "student";
}

/**
 * Get API endpoint prefix based on role
 */
function getRoleEndpointPrefix(role?: string): string {
  switch (role) {
    case "teacher":
      return "/teachers";
    case "school_director":
      // School directors may use director endpoints or teacher endpoints
      // Defaulting to /director, but can be adjusted based on actual API
      return "/director";
    case "student":
      return "/students";
    default:
      return "/teachers"; // Default fallback
  }
}

/**
 * Fetch assessments for any role
 */
const fetchAssessments = async (
  params: GetAssessmentsParams
): Promise<AssessmentsResponse> => {
  const {
    subject_id,
    status,
    topic_id,
    assessment_type,
    page = 1,
    limit = 10,
    role,
  } = params;

  const rolePrefix = getRoleEndpointPrefix(role);
  logger.info(`[use-assessments] Fetching ${role || "teacher"} assessments`, { ...params });

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("subject_id", subject_id);
    if (status) queryParams.append("status", status);
    if (topic_id) queryParams.append("topic_id", topic_id);
    if (assessment_type) queryParams.append("assessment_type", assessment_type);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Construct endpoint based on role
    // For school directors, check if they use /director/assessments or /teachers/assessments
    const endpoint = role === "school_director"
      ? `${rolePrefix}/assessments?${queryParams.toString()}`
      : `${rolePrefix}/assessments?${queryParams.toString()}`;

    const response = await authenticatedApi.get<{
      success?: boolean;
      data?: {
        assessments: Partial<Record<AssessmentType, Assessment[]>>;
        counts?: Partial<Record<AssessmentType, number>>;
        total?: number;
        pagination?: AssessmentPagination;
      };
      assessments?: Partial<Record<AssessmentType, Assessment[]>>;
      counts?: Partial<Record<AssessmentType, number>>;
      total?: number;
      pagination?: AssessmentPagination;
      message?: string;
    }>(endpoint);

    logger.info(`[use-assessments] Assessments fetched successfully`, response);

    if (!response || typeof response !== "object") {
      logger.error("[use-assessments] Response is not an object:", { response });
      throw new Error("Invalid response format from assessments API");
    }

    if ("success" in response && response.success === false) {
      const errorMsg = response.message || "Failed to fetch assessments";
      logger.error("[use-assessments] Backend returned success: false", {
        message: errorMsg,
        response,
      });
      throw new Error(errorMsg);
    }

    // Handle nested structure: { success: true, data: { assessments: {...}, total: ... } }
    if (
      "data" in response &&
      response.data &&
      typeof response.data === "object" &&
      "assessments" in response.data
    ) {
      const apiData = response.data;
      let flatAssessments: Assessment[] = [];

      if (assessment_type && apiData.assessments[assessment_type]) {
        flatAssessments = Array.isArray(apiData.assessments[assessment_type])
          ? apiData.assessments[assessment_type]!
          : [];
      } else {
        flatAssessments = Object.values(apiData.assessments).flatMap((group) =>
          Array.isArray(group) ? group : []
        );
      }

      const total = apiData.total ?? flatAssessments.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const pagination = apiData.pagination || {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      };

      return {
        assessments: flatAssessments,
        pagination,
      };
    }

    // Handle direct structure: { assessments: {...}, total: ... }
    if ("assessments" in response && typeof response.assessments === "object") {
      const apiData = response;
      let flatAssessments: Assessment[] = [];

      if (assessment_type && apiData.assessments[assessment_type]) {
        flatAssessments = Array.isArray(apiData.assessments[assessment_type])
          ? apiData.assessments[assessment_type]!
          : [];
      } else {
        flatAssessments = Object.values(apiData.assessments).flatMap((group) =>
          Array.isArray(group) ? group : []
        );
      }

      const total = apiData.total ?? flatAssessments.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const pagination = apiData.pagination || {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      };

      return {
        assessments: flatAssessments,
        pagination,
      };
    }

    logger.error("[use-assessments] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from assessments API");
  } catch (error) {
    logger.error("[use-assessments] Error fetching assessments:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Hook to fetch assessments - automatically uses current user's role
 */
export const useAssessments = (params: Omit<GetAssessmentsParams, "role">) => {
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | "student" | undefined;
  const { subject_id, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["assessments", role, params],
    queryFn: () => fetchAssessments({ ...params, role }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
    enabled: !!role && !!subject_id, // Only fetch if role and subject_id are available
  });
};

/**
 * Fetch assessment by ID for any role
 */
const fetchAssessmentById = async (
  assessmentId: string,
  role?: string
): Promise<Assessment> => {
  const rolePrefix = getRoleEndpointPrefix(role);
  logger.info(`[use-assessment-by-id] Fetching assessment for ${role || "teacher"}`, { assessmentId });

  try {
    const response = await authenticatedApi.get<{
      success?: boolean;
      data?: Assessment;
      message?: string;
    }>(`${rolePrefix}/assessments/${assessmentId}`);

    if (response.success && response.data) {
      return response.data;
    }

    // Handle direct structure
    if ("data" in response && response.data) {
      return response.data;
    }

    throw new AuthenticatedApiError(
      response.message || "Failed to fetch assessment",
      400,
      response
    );
  } catch (error) {
    logger.error("[use-assessment-by-id] Error fetching assessment:", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Hook to fetch assessment by ID - automatically uses current user's role
 */
export const useAssessmentById = (assessmentId: string | null) => {
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | "student" | undefined;

  return useQuery({
    queryKey: ["assessment", role, assessmentId],
    queryFn: () => fetchAssessmentById(assessmentId!, role),
    enabled: !!assessmentId && !!role,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch assessment questions for any role
 */
const fetchAssessmentQuestions = async (
  assessmentId: string,
  role?: string
): Promise<QuestionsResponse> => {
  const rolePrefix = getRoleEndpointPrefix(role);
  logger.info(`[use-assessment-questions] Fetching questions for ${role || "teacher"}`, { assessmentId });

  try {
    const response = await authenticatedApi.get<{
      success?: boolean;
      data?: QuestionsResponse;
      message?: string;
    }>(`${rolePrefix}/assessments/${assessmentId}/questions`);

    if (response.success && response.data) {
      return response.data;
    }

    if ("data" in response && response.data) {
      return response.data;
    }

    throw new AuthenticatedApiError(
      response.message || "Failed to fetch questions",
      400,
      response
    );
  } catch (error) {
    logger.error("[use-assessment-questions] Error fetching questions:", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Hook to fetch assessment questions - automatically uses current user's role
 */
export const useAssessmentQuestions = (assessmentId: string | null) => {
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | "student" | undefined;

  return useQuery({
    queryKey: ["assessment", role, assessmentId, "questions"],
    queryFn: () => fetchAssessmentQuestions(assessmentId!, role),
    enabled: !!assessmentId && !!role,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch assessment attempts for any role (typically teachers/directors)
 */
const fetchAssessmentAttempts = async (
  assessmentId: string,
  role?: string
): Promise<AssessmentAttemptsResponse> => {
  const rolePrefix = getRoleEndpointPrefix(role);
  logger.info(`[use-assessment-attempts] Fetching attempts for ${role || "teacher"}`, { assessmentId });

  try {
    const response = await authenticatedApi.get<{
      success?: boolean;
      data?: AssessmentAttemptsResponse;
      message?: string;
    }>(`${rolePrefix}/assessments/${assessmentId}/attempts`);

    if (response.success && response.data) {
      return response.data;
    }

    if ("data" in response && response.data) {
      return response.data;
    }

    throw new AuthenticatedApiError(
      response.message || "Failed to fetch attempts",
      400,
      response
    );
  } catch (error) {
    logger.error("[use-assessment-attempts] Error fetching attempts:", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Hook to fetch assessment attempts - automatically uses current user's role
 */
export const useAssessmentAttempts = (assessmentId: string | null) => {
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | undefined;

  return useQuery({
    queryKey: ["assessment", role, assessmentId, "attempts"],
    queryFn: () => fetchAssessmentAttempts(assessmentId!, role),
    enabled: !!assessmentId && !!role && (role === "teacher" || role === "school_director"),
    staleTime: 10 * 60 * 1000,
  });
};

// Mutations (only for teachers and directors)
export function useCreateAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | undefined;
  const rolePrefix = getRoleEndpointPrefix(role);

  return useMutation<Assessment, AuthenticatedApiError, CreateAssessmentRequest>({
    mutationFn: async (data) => {
      logger.info("[useCreateAssessment] Creating assessment", { title: data.title });
      const response = await authenticatedApi.post<{ success?: boolean; data?: Assessment; message?: string }>(
        `${rolePrefix}/assessments`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateAssessment] Assessment created successfully");
        return response.data;
      }

      if ("data" in response && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create assessment",
        400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessments", data.subject_id] });
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

export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | undefined;
  const rolePrefix = getRoleEndpointPrefix(role);

  return useMutation<Assessment, AuthenticatedApiError, { id: string; data: UpdateAssessmentRequest }>({
    mutationFn: async ({ id, data }) => {
      logger.info("[useUpdateAssessment] Updating assessment", { id });
      const response = await authenticatedApi.patch<{ success?: boolean; data?: Assessment; message?: string }>(
        `${rolePrefix}/assessments/${id}`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateAssessment] Assessment updated successfully");
        return response.data;
      }

      if ("data" in response && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update assessment",
        400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessment", data.id] });
      queryClient.invalidateQueries({ queryKey: ["assessments", data.subject_id] });
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

export function useDeleteAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | undefined;
  const rolePrefix = getRoleEndpointPrefix(role);

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      logger.info("[useDeleteAssessment] Deleting assessment", { id });
      const response = await authenticatedApi.delete<{ success?: boolean; message?: string }>(
        `${rolePrefix}/assessments/${id}`
      );

      if (response.success !== false) {
        logger.info("[useDeleteAssessment] Assessment deleted successfully");
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete assessment",
        400,
        response
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.removeQueries({ queryKey: ["assessment", id] });
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

// Re-export question-related hooks from teacher assessments (they can be shared)
export {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useUploadQuestionImage,
  useDeleteQuestionImage,
  usePublishAssessment,
  useUnpublishAssessment,
  useReleaseResults,
  useStudentSubmission,
} from "@/hooks/teacher/use-teacher-assessments";

