import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import type {
  ApiResponse,
  ExamBodyAssessment,
  CreateExamBodyAssessmentRequest,
  UpdateExamBodyAssessmentRequest,
} from "./types";

const buildPath = (examBodyId: string) =>
  `/exam-bodies/${examBodyId}/assessments`;

const extractArray = <T>(value: unknown): T[] | null => {
  return Array.isArray(value) ? (value as T[]) : null;
};

const parseAssessments = (response: ApiResponse<unknown>): ExamBodyAssessment[] => {
  const data = response.data;
  if (Array.isArray(data)) return data as ExamBodyAssessment[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [record.assessments, record.items, record.data];
    for (const candidate of candidates) {
      const list = extractArray<ExamBodyAssessment>(candidate);
      if (list) return list;
      if (candidate && typeof candidate === "object") {
        const nested = candidate as Record<string, unknown>;
        const nestedList = extractArray<ExamBodyAssessment>(nested.data);
        if (nestedList) return nestedList;
      }
    }
  }
  return [];
};

export interface ExamBodyAssessmentsQuery {
  subjectId?: string;
  yearId?: string;
}

export const useExamBodyAssessments = (
  examBodyId: string | null,
  params: ExamBodyAssessmentsQuery = {}
) => {
  return useQuery<ExamBodyAssessment[], AuthenticatedApiError>({
    queryKey: [
      "library-owner",
      "exam-bodies",
      examBodyId,
      "assessments",
      params,
    ],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }
      logger.info("[useExamBodyAssessments] Fetching assessments", {
        examBodyId,
        params,
      });

      const queryParams = new URLSearchParams();
      if (params.subjectId) queryParams.append("subjectId", params.subjectId);
      if (params.yearId) queryParams.append("yearId", params.yearId);

      const endpoint =
        queryParams.toString().length > 0
          ? `${buildPath(examBodyId)}?${queryParams.toString()}`
          : buildPath(examBodyId);

      const response = await authenticatedApi.get<unknown>(endpoint);

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch exam body assessments",
          response.statusCode || 400,
          response
        );
      }

      return parseAssessments(response as ApiResponse<unknown>);
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateExamBodyAssessment = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ExamBodyAssessment,
    AuthenticatedApiError,
    {
      subjectId: string;
      yearId: string;
      data: CreateExamBodyAssessmentRequest;
    }
  >({
    mutationFn: async ({ subjectId, yearId, data }) => {
      const queryParams = new URLSearchParams();
      queryParams.append("subjectId", subjectId);
      queryParams.append("yearId", yearId);

      const response = await authenticatedApi.post<ExamBodyAssessment>(
        `${buildPath(examBodyId)}?${queryParams.toString()}`,
        data
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to create assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "assessments"],
      });
      toast({
        title: "Assessment created",
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
};

export const useUpdateExamBodyAssessment = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ExamBodyAssessment,
    AuthenticatedApiError,
    { id: string; data: UpdateExamBodyAssessmentRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await authenticatedApi.patch<ExamBodyAssessment>(
        `${buildPath(examBodyId)}/${id}`,
        data
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to update assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "assessments"],
      });
      toast({
        title: "Assessment updated",
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
};

export const useDeleteExamBodyAssessment = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.delete(
        `${buildPath(examBodyId)}/${id}`
      );
      if (response.success !== false) return;
      throw new AuthenticatedApiError(
        response.message || "Failed to delete assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "assessments"],
      });
      toast({
        title: "Assessment deleted",
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
};

export const usePublishExamBodyAssessment = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ExamBodyAssessment, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.patch<ExamBodyAssessment>(
        `${buildPath(examBodyId)}/${id}/publish`
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to publish assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "assessments"],
      });
      toast({
        title: "Assessment published",
        description: data.title,
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
};

export const useUnpublishExamBodyAssessment = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ExamBodyAssessment, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.patch<ExamBodyAssessment>(
        `${buildPath(examBodyId)}/${id}/unpublish`
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to unpublish assessment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "assessments"],
      });
      toast({
        title: "Assessment unpublished",
        description: data.title,
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
};
