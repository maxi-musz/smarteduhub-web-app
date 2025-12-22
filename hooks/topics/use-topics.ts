import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Topic Types
export interface TopicData {
  id: string;
  platformId: string;
  subjectId: string;
  chapterId: string;
  title: string;
  description?: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  chapter?: {
    id: string;
    title: string;
    order: number;
  };
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

export interface CreateTopicDto {
  chapterId: string;
  subjectId: string;
  title: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export interface UpdateTopicDto {
  title?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export interface TopicApiResponse {
  success: boolean;
  message: string;
  data: TopicData;
}

// Create Topic Mutation
export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation<TopicApiResponse, AuthenticatedApiError, CreateTopicDto>({
    mutationFn: async (data) => {
      logger.info("[useCreateTopic] Creating topic", { data });
      
      const response = await authenticatedApi.post<TopicApiResponse>(
        "/library/subject/chapter/topic/createtopic",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateTopic] Topic created successfully", {
          topicId: response.data.id,
        });
        return response;
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
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useCreateTopic] Cache invalidated", {
        chapterId: variables.chapterId,
        subjectId: variables.subjectId,
      });
    },
  });
}

// Update Topic Mutation
export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation<
    TopicApiResponse,
    AuthenticatedApiError,
    { topicId: string; data: UpdateTopicDto }
  >({
    mutationFn: async ({ topicId, data }) => {
      logger.info("[useUpdateTopic] Updating topic", { topicId, data });
      
      const response = await authenticatedApi.patch<TopicApiResponse>(
        `/library/subject/chapter/topic/updatetopic/${topicId}`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateTopic] Topic updated successfully", {
          topicId: response.data.id,
        });
        return response;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useUpdateTopic] Cache invalidated");
    },
  });
}

