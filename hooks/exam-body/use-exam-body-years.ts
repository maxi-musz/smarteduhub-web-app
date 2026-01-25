import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import type {
  ApiResponse,
  ExamBodyYear,
  CreateExamBodyYearRequest,
  UpdateExamBodyYearRequest,
} from "./types";

const buildPath = (examBodyId: string) =>
  `/exam-bodies/${examBodyId}/years`;

const extractArray = <T>(value: unknown): T[] | null => {
  return Array.isArray(value) ? (value as T[]) : null;
};

const parseYears = (response: ApiResponse<unknown>): ExamBodyYear[] => {
  const data = response.data;
  if (Array.isArray(data)) return data as ExamBodyYear[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [record.years, record.items, record.data];
    for (const candidate of candidates) {
      const list = extractArray<ExamBodyYear>(candidate);
      if (list) return list;
      if (candidate && typeof candidate === "object") {
        const nested = candidate as Record<string, unknown>;
        const nestedList = extractArray<ExamBodyYear>(nested.data);
        if (nestedList) return nestedList;
      }
    }
  }
  return [];
};

export const useExamBodyYears = (examBodyId: string | null) => {
  return useQuery<ExamBodyYear[], AuthenticatedApiError>({
    queryKey: ["library-owner", "exam-bodies", examBodyId, "years"],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }
      logger.info("[useExamBodyYears] Fetching years", { examBodyId });
      const response = await authenticatedApi.get<unknown>(buildPath(examBodyId));

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch exam body years",
          response.statusCode || 400,
          response
        );
      }

      return parseYears(response as ApiResponse<unknown>);
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateExamBodyYear = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ExamBodyYear, AuthenticatedApiError, CreateExamBodyYearRequest>({
    mutationFn: async (data) => {
      const response = await authenticatedApi.post<ExamBodyYear>(
        buildPath(examBodyId),
        data
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to create year",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "years"],
      });
      toast({
        title: "Year created",
        description: data.year,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create year",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateExamBodyYear = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ExamBodyYear,
    AuthenticatedApiError,
    { id: string; data: UpdateExamBodyYearRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await authenticatedApi.patch<ExamBodyYear>(
        `${buildPath(examBodyId)}/${id}`,
        data
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to update year",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "years"],
      });
      toast({
        title: "Year updated",
        description: data.year,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update year",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteExamBodyYear = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.delete(
        `${buildPath(examBodyId)}/${id}`
      );
      if (response.success !== false) return;
      throw new AuthenticatedApiError(
        response.message || "Failed to delete year",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "years"],
      });
      toast({
        title: "Year deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete year",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
