import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import type {
  ApiResponse,
  ExamBodyQuestionsResponse,
  ExamBodyQuestion,
  CreateExamBodyQuestionRequest,
  UpdateExamBodyQuestionRequest,
} from "./types";

const buildPath = (examBodyId: string, assessmentId: string) =>
  `/exam-bodies/${examBodyId}/assessments/${assessmentId}/questions`;

const extractArray = <T>(value: unknown): T[] | null => {
  return Array.isArray(value) ? (value as T[]) : null;
};

const parseQuestions = (response: ApiResponse<unknown>): ExamBodyQuestion[] => {
  const data = response.data;
  if (Array.isArray(data)) return data as ExamBodyQuestion[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [record.questions, record.items, record.data];
    for (const candidate of candidates) {
      const list = extractArray<ExamBodyQuestion>(candidate);
      if (list) return list;
      if (candidate && typeof candidate === "object") {
        const nested = candidate as Record<string, unknown>;
        const nestedList = extractArray<ExamBodyQuestion>(nested.data);
        if (nestedList) return nestedList;
      }
    }
  }
  return [];
};

export const useExamBodyQuestions = (
  examBodyId: string | null,
  assessmentId: string | null
) => {
  return useQuery<ExamBodyQuestionsResponse, AuthenticatedApiError>({
    queryKey: [
      "library-owner",
      "exam-bodies",
      examBodyId,
      "assessments",
      assessmentId,
      "questions",
    ],
    queryFn: async () => {
      if (!examBodyId || !assessmentId) {
        throw new AuthenticatedApiError("Exam body and assessment ID are required", 400);
      }
      logger.info("[useExamBodyQuestions] Fetching questions", {
        examBodyId,
        assessmentId,
      });
      const response = await authenticatedApi.get<unknown>(
        buildPath(examBodyId, assessmentId)
      );

      if (response.success === false) {
        throw new AuthenticatedApiError(
          response.message || "Failed to fetch questions",
          response.statusCode || 400,
          response
        );
      }

      const questions = parseQuestions(response as ApiResponse<unknown>);
      return { questions };
    },
    enabled: !!examBodyId && !!assessmentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const extractCreatedQuestion = (response: ApiResponse<unknown>): ExamBodyQuestion => {
  const data = response.data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const question = record.question;
    if (question && typeof question === "object") {
      return question as ExamBodyQuestion;
    }
  }

  return data as ExamBodyQuestion;
};

const buildQuestionFormData = (
  data: CreateExamBodyQuestionRequest | UpdateExamBodyQuestionRequest,
  imageFile?: File | null
) => {
  const formData = new FormData();
  formData.append("questionData", JSON.stringify(data));
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return formData;
};

export const useCreateExamBodyQuestion = (examBodyId: string, assessmentId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ExamBodyQuestion,
    AuthenticatedApiError,
    { data: CreateExamBodyQuestionRequest; imageFile?: File | null }
  >({
    mutationFn: async ({ data, imageFile }) => {
      const endpoint = imageFile
        ? `${buildPath(examBodyId, assessmentId)}/with-image`
        : buildPath(examBodyId, assessmentId);
      const payload = imageFile ? buildQuestionFormData(data, imageFile) : data;

      const response = await authenticatedApi.post<unknown>(endpoint, payload);

      if (response.success && response.data) {
        return extractCreatedQuestion(response as ApiResponse<unknown>);
      }
      if (response.data) {
        return extractCreatedQuestion(response as ApiResponse<unknown>);
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create question",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "library-owner",
          "exam-bodies",
          examBodyId,
          "assessments",
          assessmentId,
          "questions",
        ],
      });
      toast({
        title: "Question created",
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
};

export const useUpdateExamBodyQuestion = (examBodyId: string, assessmentId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ExamBodyQuestion,
    AuthenticatedApiError,
    {
      questionId: string;
      data: UpdateExamBodyQuestionRequest;
      imageFile?: File | null;
    }
  >({
    mutationFn: async ({ questionId, data, imageFile }) => {
      const endpoint = `/exam-bodies/${examBodyId}/assessments/questions/${questionId}`;
      const payload = imageFile ? buildQuestionFormData(data, imageFile) : data;

      const response = await authenticatedApi.patch<unknown>(endpoint, payload);

      if (response.success && response.data) {
        return extractCreatedQuestion(response as ApiResponse<unknown>);
      }
      if (response.data) {
        return extractCreatedQuestion(response as ApiResponse<unknown>);
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update question",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "library-owner",
          "exam-bodies",
          examBodyId,
          "assessments",
          assessmentId,
          "questions",
        ],
      });
      toast({
        title: "Question updated",
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
};

export const useDeleteExamBodyQuestionImage = (
  examBodyId: string,
  assessmentId: string
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (questionId) => {
      const response = await authenticatedApi.delete(
        `/exam-bodies/${examBodyId}/assessments/questions/${questionId}/image`
      );
      if (response.success !== false) return;
      throw new AuthenticatedApiError(
        response.message || "Failed to delete question image",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "library-owner",
          "exam-bodies",
          examBodyId,
          "assessments",
          assessmentId,
          "questions",
        ],
      });
      toast({
        title: "Question image deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete question image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteExamBodyQuestion = (examBodyId: string, assessmentId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (questionId) => {
      const response = await authenticatedApi.delete(
        `/exam-bodies/${examBodyId}/assessments/questions/${questionId}`
      );
      if (response.success !== false) return;
      throw new AuthenticatedApiError(
        response.message || "Failed to delete question",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "library-owner",
          "exam-bodies",
          examBodyId,
          "assessments",
          assessmentId,
          "questions",
        ],
      });
      toast({
        title: "Question deleted",
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
};
