import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import type {
  ApiResponse,
  ExamBodySubject,
  CreateExamBodySubjectRequest,
  UpdateExamBodySubjectRequest,
} from "./types";

const buildPath = (examBodyId: string) =>
  `/exam-bodies/${examBodyId}/subjects`;

const extractArray = <T>(value: unknown): T[] | null => {
  return Array.isArray(value) ? (value as T[]) : null;
};

const parseSubjects = (response: ApiResponse<unknown>): ExamBodySubject[] => {
  const data = response.data;
  if (Array.isArray(data)) return data as ExamBodySubject[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [record.subjects, record.items, record.data];
    for (const candidate of candidates) {
      const list = extractArray<ExamBodySubject>(candidate);
      if (list) return list;
      if (candidate && typeof candidate === "object") {
        const nested = candidate as Record<string, unknown>;
        const nestedList = extractArray<ExamBodySubject>(nested.data);
        if (nestedList) return nestedList;
      }
    }
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

export const useExamBodySubjects = (examBodyId: string | null) => {
  return useQuery<ExamBodySubject[], AuthenticatedApiError>({
    queryKey: ["library-owner", "exam-bodies", examBodyId, "subjects"],
    queryFn: async () => {
      if (!examBodyId) {
        throw new AuthenticatedApiError("Exam body ID is required", 400);
      }
      logger.info("[useExamBodySubjects] Fetching subjects", { examBodyId });
      const response = await authenticatedApi.get<unknown>(buildPath(examBodyId));

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch exam body subjects",
          response.statusCode || 400,
          response
        );
      }

      return parseSubjects(response as ApiResponse<unknown>);
    },
    enabled: !!examBodyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateExamBodySubject = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ExamBodySubject, AuthenticatedApiError, CreateExamBodySubjectRequest>({
    mutationFn: async (data) => {
      const formData = new FormData();
      appendIfDefined(formData, "name", data.name);
      appendIfDefined(formData, "code", data.code);
      appendIfDefined(formData, "icon", data.icon);
      appendIfDefined(formData, "description", data.description);
      appendIfDefined(formData, "order", data.order ?? undefined);

      const response = await authenticatedApi.post<ExamBodySubject>(
        buildPath(examBodyId),
        formData
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to create subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "subjects"],
      });
      toast({
        title: "Subject created",
        description: data.name,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateExamBodySubject = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ExamBodySubject,
    AuthenticatedApiError,
    { id: string; data: UpdateExamBodySubjectRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      appendIfDefined(formData, "name", data.name);
      appendIfDefined(formData, "code", data.code);
      appendIfDefined(formData, "icon", data.icon);
      appendIfDefined(formData, "description", data.description);
      appendIfDefined(formData, "order", data.order ?? undefined);

      const response = await authenticatedApi.patch<ExamBodySubject>(
        `${buildPath(examBodyId)}/${id}`,
        formData
      );

      if (response.success && response.data) return response.data;
      if (response.data) return response.data;

      throw new AuthenticatedApiError(
        response.message || "Failed to update subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "subjects"],
      });
      toast({
        title: "Subject updated",
        description: data.name,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteExamBodySubject = (examBodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.delete(
        `${buildPath(examBodyId)}/${id}`
      );
      if (response.success !== false) return;
      throw new AuthenticatedApiError(
        response.message || "Failed to delete subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "exam-bodies", examBodyId, "subjects"],
      });
      toast({
        title: "Subject deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
