import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionsResponse,
  QuestionResponse,
  UploadImageResponse,
} from "./use-cbt-types";
import { toast } from "sonner";

// Get all questions for a CBT
export function useCBTQuestions(cbtId: string | null) {
  return useQuery<Question[], AuthenticatedApiError>({
    queryKey: ["cbt", cbtId, "questions"],
    queryFn: async () => {
      if (!cbtId) {
        throw new AuthenticatedApiError("CBT ID is required", 400);
      }

      logger.info("[useCBTQuestions] Fetching questions", { cbtId });
      const response = await authenticatedApi.get<Question[]>(
        `/library/assessment/cbt/${cbtId}/questions`
      );

      // Log response for debugging
      console.log("[useCBTQuestions] Full API Response:", {
        success: response.success,
        message: response.message,
        statusCode: response.statusCode,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
        hasQuestionsProperty: response.data && typeof response.data === 'object' && 'questions' in response.data,
        questionsArray: response.data?.questions,
        fullResponse: JSON.stringify(response, null, 2),
      });

      if (response.success && response.data) {
        // Backend returns questions in data.questions array
        // Handle both cases: data is array directly OR data.questions is the array
        let questions: Question[] = [];
        
        if (Array.isArray(response.data)) {
          // If data is directly an array (legacy format)
          questions = response.data;
        } else if (response.data && typeof response.data === 'object' && 'questions' in response.data) {
          // If data is an object with questions property (current format)
          questions = Array.isArray(response.data.questions) ? response.data.questions : [];
        }
        
        console.log("[useCBTQuestions] Processed Questions:", {
          count: questions.length,
          questions: questions,
        });
        logger.info("[useCBTQuestions] Questions fetched successfully", {
          cbtId,
          count: questions.length,
        });
        return questions;
      }

      console.error("[useCBTQuestions] Invalid response structure:", response);

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch questions",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!cbtId,
    staleTime: 0, // Always consider data stale to force fresh fetch
    gcTime: 10 * 60 * 1000,
    retry: 2, // Retry 2 times (3 total attempts: 1 initial + 2 retries)
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts to get fresh data
    refetchOnReconnect: false,
  });
}

// Upload question image
export function useUploadQuestionImage() {
  return useMutation<
    UploadImageResponse,
    AuthenticatedApiError,
    { cbtId: string; imageFile: File }
  >({
    mutationFn: async ({ cbtId, imageFile }) => {
      logger.info("[useUploadQuestionImage] Uploading image", { cbtId });

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await authenticatedApi.post<{ data: UploadImageResponse }>(
        `/library/assessment/cbt/${cbtId}/questions/upload-image`,
        formData
      );

      if (response.success && response.data) {
        logger.info("[useUploadQuestionImage] Image uploaded successfully", {
          cbtId,
          imageUrl: response.data.imageUrl || "Unknown",
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to upload image",
        response.statusCode || 400,
        response
      );
    },
    onError: (error) => {
      logger.error("[useUploadQuestionImage] Failed to upload image", { error: error.message });
      toast.error(error.message || "Failed to upload image");
    },
  });
}

// Create question
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation<
    Question,
    AuthenticatedApiError,
    { cbtId: string; data: CreateQuestionRequest; imageFile?: File }
  >({
    mutationFn: async ({ cbtId, data, imageFile }) => {
      logger.info("[useCreateQuestion] Creating question", {
        cbtId,
        questionType: data.questionType,
        hasImage: !!imageFile,
      });

      // If image is provided, send as multipart/form-data
      if (imageFile) {
        const formData = new FormData();
        
        // Remove imageUrl and imageS3Key from data - they're not needed when uploading file
        const { imageUrl, imageS3Key, ...questionData } = data;
        
        // Append question data as JSON string
        formData.append('questionData', JSON.stringify(questionData));
        
        // Append image file
        formData.append('image', imageFile);

        const response = await authenticatedApi.post<{ data: Question }>(
          `/library/assessment/cbt/${cbtId}/questions`,
          formData
        );

        if (response.success && response.data) {
          logger.info("[useCreateQuestion] Question created successfully with image", {
            cbtId,
            questionId: response.data.id || "Unknown",
          });
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to create question",
          response.statusCode || 400,
          response
        );
      } else {
        // No image - send as JSON (backward compatibility)
        const formData = new FormData();
        const { imageUrl, imageS3Key, ...questionData } = data;
        formData.append('questionData', JSON.stringify(questionData));

        const response = await authenticatedApi.post<{ data: Question }>(
          `/library/assessment/cbt/${cbtId}/questions`,
          formData
        );

        if (response.success && response.data) {
          logger.info("[useCreateQuestion] Question created successfully", {
            cbtId,
            questionId: response.data.id || "Unknown",
          });
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
      // Invalidate and refetch questions - query key must match useCBTQuestions exactly
      queryClient.invalidateQueries({
        queryKey: ["cbt", variables.cbtId, "questions"],
        refetchType: "active", // Force refetch active queries
      });
      // Also invalidate the CBT itself to update question count
      queryClient.invalidateQueries({ 
        queryKey: ["cbt", variables.cbtId],
        refetchType: "active",
      });
      // Invalidate CBT list to update question counts in the list
      queryClient.invalidateQueries({ 
        queryKey: ["cbt", "list"],
        refetchType: "active",
      });
      toast.success("Question created successfully");
    },
    onError: (error) => {
      logger.error("[useCreateQuestion] Failed to create question", { error: error.message });
      toast.error(error.message || "Failed to create question");
    },
  });
}

// Update question
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation<
    Question,
    AuthenticatedApiError,
    {
      cbtId: string;
      questionId: string;
      data: UpdateQuestionRequest;
      imageFile?: File;
    }
  >({
    mutationFn: async ({ cbtId, questionId, data, imageFile }) => {
      logger.info("[useUpdateQuestion] Updating question", {
        cbtId,
        questionId,
        hasImage: !!imageFile,
      });

      // If image is provided, send as multipart/form-data
      if (imageFile) {
        const formData = new FormData();
        
        // Remove imageUrl and imageS3Key from data - they're not needed when uploading file
        const { imageUrl, imageS3Key, ...questionData } = data;
        
        // Append question data as JSON string
        formData.append('questionData', JSON.stringify(questionData));
        
        // Append image file
        formData.append('image', imageFile);

        const response = await authenticatedApi.patch<{ data: Question }>(
          `/library/assessment/cbt/${cbtId}/questions/${questionId}`,
          formData
        );

        if (response.success && response.data) {
          logger.info("[useUpdateQuestion] Question updated successfully with image", {
            cbtId,
            questionId,
          });
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to update question",
          response.statusCode || 400,
          response
        );
      } else {
        // No image - send as JSON (backward compatibility)
        const formData = new FormData();
        const { imageUrl, imageS3Key, ...questionData } = data;
        formData.append('questionData', JSON.stringify(questionData));

        const response = await authenticatedApi.patch<{ data: Question }>(
          `/library/assessment/cbt/${cbtId}/questions/${questionId}`,
          formData
        );

        if (response.success && response.data) {
          logger.info("[useUpdateQuestion] Question updated successfully", {
            cbtId,
            questionId,
          });
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to update question",
          response.statusCode || 400,
          response
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["cbt", variables.cbtId, "questions"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({ 
        queryKey: ["cbt", variables.cbtId],
        refetchType: "active",
      });
      queryClient.invalidateQueries({ 
        queryKey: ["cbt", "list"],
        refetchType: "active",
      });
      queryClient.setQueryData(
        ["cbt", variables.cbtId, "questions", variables.questionId],
        data
      );
      toast.success("Question updated successfully");
    },
    onError: (error) => {
      logger.error("[useUpdateQuestion] Failed to update question", { error: error.message });
      toast.error(error.message || "Failed to update question");
    },
  });
}

// Delete question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AuthenticatedApiError,
    { cbtId: string; questionId: string }
  >({
    mutationFn: async ({ cbtId, questionId }) => {
      logger.info("[useDeleteQuestion] Deleting question", {
        cbtId,
        questionId,
      });
      const response = await authenticatedApi.delete(
        `/library/assessment/cbt/${cbtId}/questions/${questionId}`
      );

      if (!response.success) {
        throw new AuthenticatedApiError(
          response.message || "Failed to delete question",
          response.statusCode || 400,
          response
        );
      }

      logger.info("[useDeleteQuestion] Question deleted successfully", {
        cbtId,
        questionId,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["cbt", variables.cbtId, "questions"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({ 
        queryKey: ["cbt", variables.cbtId],
        refetchType: "active",
      });
      queryClient.invalidateQueries({ 
        queryKey: ["cbt", "list"],
        refetchType: "active",
      });
      queryClient.removeQueries({
        queryKey: ["cbt", variables.cbtId, "questions", variables.questionId],
      });
      toast.success("Question deleted successfully");
    },
    onError: (error) => {
      logger.error("[useDeleteQuestion] Failed to delete question", { error: error.message });
      toast.error(error.message || "Failed to delete question");
    },
  });
}

// Delete question image
export function useDeleteQuestionImage() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AuthenticatedApiError,
    { cbtId: string; questionId: string }
  >({
    mutationFn: async ({ cbtId, questionId }) => {
      logger.info("[useDeleteQuestionImage] Deleting question image", {
        cbtId,
        questionId,
      });
      const response = await authenticatedApi.delete(
        `/library/assessment/cbt/${cbtId}/questions/${questionId}/image`
      );

      if (!response.success) {
        throw new AuthenticatedApiError(
          response.message || "Failed to delete question image",
          response.statusCode || 400,
          response
        );
      }

      logger.info("[useDeleteQuestionImage] Question image deleted successfully", {
        cbtId,
        questionId,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["cbt", variables.cbtId, "questions"],
      });
      toast.success("Question image deleted successfully");
    },
    onError: (error) => {
      logger.error("[useDeleteQuestionImage] Failed to delete question image", { error: error.message });
      toast.error(error.message || "Failed to delete question image");
    },
  });
}

// Delete orphaned question image (before question is created)
export function useDeleteOrphanedImage() {
  return useMutation<
    { assessmentId: string; imageS3Key: string; imageDeleted: boolean },
    AuthenticatedApiError,
    { cbtId: string; imageS3Key: string }
  >({
    mutationFn: async ({ cbtId, imageS3Key }) => {
      logger.info("[useDeleteOrphanedImage] Deleting orphaned image", {
        cbtId,
        imageS3Key,
      });
      const response = await authenticatedApi.delete<{
        assessmentId: string;
        imageS3Key: string;
        imageDeleted: boolean;
      }>(
        `/library/assessment/cbt/${cbtId}/questions/orphaned-image`,
        {
          body: JSON.stringify({ imageS3Key }),
        }
      );

      if (response.success && response.data) {
        logger.info("[useDeleteOrphanedImage] Orphaned image deleted successfully", {
          cbtId,
          imageS3Key,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete orphaned image",
        response.statusCode || 400,
        response
      );
    },
    onError: (error) => {
      logger.error("[useDeleteOrphanedImage] Failed to delete orphaned image", { error: error.message });
      // Don't show toast for orphaned image deletion errors - it's cleanup
    },
  });
}

