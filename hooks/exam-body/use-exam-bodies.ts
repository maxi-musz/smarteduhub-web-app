import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import type {
  ApiResponse,
  ExamBody,
  ExamBodyDetail,
  CreateExamBodyRequest,
  UpdateExamBodyRequest,
} from "./types";

const BASE_PATH = "/exam-bodies";

const extractArray = <T>(value: unknown): T[] | null => {
  return Array.isArray(value) ? (value as T[]) : null;
};

const extractArrayFromRecord = <T>(
  record: Record<string, unknown>,
  keys: string[]
): T[] | null => {
  for (const key of keys) {
    const direct = extractArray<T>(record[key]);
    if (direct) return direct;

    const nested = record[key];
    if (nested && typeof nested === "object") {
      const nestedRecord = nested as Record<string, unknown>;
      const nestedList = extractArray<T>(nestedRecord.data);
      if (nestedList) return nestedList;
    }
  }
  return null;
};

const parseExamBodies = (response: ApiResponse<unknown>): ExamBody[] => {
  const data = response.data;
  if (Array.isArray(data)) {
    return data as ExamBody[];
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const list = extractArrayFromRecord<ExamBody>(record, [
      "examBodies",
      "items",
      "data",
    ]);
    if (list) return list;
  }

  return [];
};

const appendIfDefined = (
  formData: FormData,
  key: string,
  value: string | number | File | null | undefined
) => {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, value instanceof File ? value : String(value));
};

export const useExamBodies = () => {
  return useQuery<ExamBody[], AuthenticatedApiError>({
    queryKey: ["library-owner", "exam-bodies"],
    queryFn: async () => {
      logger.info("[useExamBodies] Fetching exam bodies");
      const response = await authenticatedApi.get<unknown>(BASE_PATH);

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch exam bodies",
          response.statusCode || 400,
          response
        );
      }

      return parseExamBodies(response as ApiResponse<unknown>);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const parseExamBodyDetail = (response: ApiResponse<unknown>): ExamBodyDetail => {
  const data = response.data;
  if (data && typeof data === "object") {
    return data as ExamBodyDetail;
  }
  return data as ExamBodyDetail;
};

export const useExamBody = (examBodyId: string | null) => {
  return useQuery<ExamBodyDetail, AuthenticatedApiError>({
    queryKey: ["library-owner", "exam-bodies", examBodyId],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }
      logger.info("[useExamBody] Fetching exam body", { examBodyId });
      const response = await authenticatedApi.get<unknown>(
        `${BASE_PATH}/${examBodyId}`
      );

      if (response.success && response.data) {
        return parseExamBodyDetail(response as ApiResponse<unknown>);
      }

      if (response.data) {
        return parseExamBodyDetail(response as ApiResponse<unknown>);
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch exam body",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateExamBody = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ExamBody, AuthenticatedApiError, CreateExamBodyRequest>({
    mutationFn: async (data) => {
      const formData = new FormData();
      appendIfDefined(formData, "name", data.name);
      appendIfDefined(formData, "fullName", data.fullName);
      appendIfDefined(formData, "icon", data.icon);
      appendIfDefined(formData, "description", data.description);
      appendIfDefined(formData, "websiteUrl", data.websiteUrl);
      appendIfDefined(formData, "status", data.status);

      const response = await authenticatedApi.post<ExamBody>(BASE_PATH, formData);

      if (response.success && response.data) {
        return response.data;
      }

      if (response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create exam body",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["library-owner", "exam-bodies"] });
      toast({
        title: "Exam body created",
        description: data.name,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create exam body",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateExamBody = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ExamBody,
    AuthenticatedApiError,
    { id: string; data: UpdateExamBodyRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      appendIfDefined(formData, "name", data.name);
      appendIfDefined(formData, "fullName", data.fullName);
      appendIfDefined(formData, "icon", data.icon);
      appendIfDefined(formData, "description", data.description);
      appendIfDefined(formData, "websiteUrl", data.websiteUrl);
      appendIfDefined(formData, "status", data.status);

      const response = await authenticatedApi.patch<ExamBody>(
        `${BASE_PATH}/${id}`,
        formData
      );

      if (response.success && response.data) {
        return response.data;
      }

      if (response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update exam body",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["library-owner", "exam-bodies"] });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", data.id],
      });
      toast({
        title: "Exam body updated",
        description: data.name,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update exam body",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteExamBody = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.delete(`${BASE_PATH}/${id}`);

      if (response.success !== false) {
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete exam body",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-owner", "exam-bodies"] });
      toast({
        title: "Exam body deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete exam body",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
