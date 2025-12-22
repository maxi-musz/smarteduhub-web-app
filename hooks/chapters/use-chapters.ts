import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Chapter Types
export interface ChapterData {
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

export interface CreateChapterDto {
  subjectId: string;
  title: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export interface UpdateChapterDto {
  title?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export interface ChapterApiResponse {
  success: boolean;
  message: string;
  data: ChapterData;
}

// Create Chapter Mutation
export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation<ChapterApiResponse, AuthenticatedApiError, CreateChapterDto>({
    mutationFn: async (data) => {
      logger.info("[useCreateChapter] Creating chapter", { data });
      
      const response = await authenticatedApi.post<ChapterApiResponse>(
        "/library/subject/chapter/createchapter",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateChapter] Chapter created successfully", {
          chapterId: response.data.id,
        });
        return response;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create chapter",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useCreateChapter] Cache invalidated", {
        subjectId: variables.subjectId,
      });
    },
  });
}

// Update Chapter Mutation
export function useUpdateChapter() {
  const queryClient = useQueryClient();

  return useMutation<
    ChapterApiResponse,
    AuthenticatedApiError,
    { chapterId: string; data: UpdateChapterDto }
  >({
    mutationFn: async ({ chapterId, data }) => {
      logger.info("[useUpdateChapter] Updating chapter", { chapterId, data });
      
      const response = await authenticatedApi.patch<ChapterApiResponse>(
        `/library/subject/chapter/updatechapter/${chapterId}`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateChapter] Chapter updated successfully", {
          chapterId: response.data.id,
        });
        return response;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update chapter",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useUpdateChapter] Cache invalidated");
    },
  });
}

