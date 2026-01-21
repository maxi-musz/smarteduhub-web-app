import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Topic Types for Library Owner (no chapters)
export interface LibraryTopicData {
  id: string;
  platformId: string;
  subjectId: string;
  title: string;
  description?: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  subject?: {
    id: string;
    name: string;
    code: string;
    class: {
      id: string;
      name: string;
    };
  };
}

export interface CreateLibraryTopicDto {
  subjectId: string;
  title: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export interface UpdateLibraryTopicDto {
  title?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

// Inner data type for the authenticated API response
export type LibraryTopicApiResponse = LibraryTopicData;

// Create Topic Mutation (new API - no chapters)
export function useCreateLibraryTopic() {
  const queryClient = useQueryClient();

  return useMutation<LibraryTopicApiResponse, AuthenticatedApiError, CreateLibraryTopicDto>({
    mutationFn: async (data) => {
      logger.info("[useCreateLibraryTopic] Creating topic", { data });
      
      const response = await authenticatedApi.post<LibraryTopicApiResponse>(
        "/library/subject/topic/createtopic",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateLibraryTopic] Topic created successfully", {
          topicId: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner"],
      });
      // Specifically invalidate subject detail query
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "subject-detail", variables.subjectId],
      });
      // Invalidate resources query (used by subject detail)
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "resources"],
      });
      // Invalidate class resources
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      // Invalidate subject query
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "subject", variables.subjectId],
      });
      logger.info("[useCreateLibraryTopic] Cache invalidated", {
        subjectId: variables.subjectId,
      });
    },
  });
}

// Update Topic Mutation (new API - no chapters)
export function useUpdateLibraryTopic() {
  const queryClient = useQueryClient();

  return useMutation<
    LibraryTopicApiResponse,
    AuthenticatedApiError,
    { topicId: string; data: UpdateLibraryTopicDto }
  >({
    mutationFn: async ({ topicId, data }) => {
      logger.info("[useUpdateLibraryTopic] Updating topic", { topicId, data });
      
      const response = await authenticatedApi.patch<LibraryTopicApiResponse>(
        `/library/subject/topic/updatetopic/${topicId}`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateLibraryTopic] Topic updated successfully", {
          topicId: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner"],
      });
      // Invalidate resources query
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "resources"],
      });
      // Invalidate class resources
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useUpdateLibraryTopic] Cache invalidated");
    },
  });
}

// Delete Topic Mutation
// Note: Check API docs for correct delete endpoint - may not be available
export function useDeleteLibraryTopic() {
  const queryClient = useQueryClient();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (topicId) => {
      logger.info("[useDeleteLibraryTopic] Deleting topic", { topicId });
      
      // Note: Check API docs for correct delete endpoint
      // Assuming it follows pattern: DELETE /library/subject/topic/:topicId
      const response = await authenticatedApi.delete<{
        success: boolean;
        message: string;
        data: null;
      }>(`/library/subject/topic/${topicId}`);

      if (response.success === true || (response.success === undefined && !response.message)) {
        logger.info("[useDeleteLibraryTopic] Topic deleted successfully", {
          topicId,
        });
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, topicId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner"],
      });
      // Invalidate resources query
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "resources"],
      });
      // Invalidate class resources
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      // Invalidate topic materials
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "topic-materials", topicId],
      });
      // Invalidate subject queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "subject"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "subject-detail"],
      });
      logger.info("[useDeleteLibraryTopic] Cache invalidated", { topicId });
    },
  });
}
