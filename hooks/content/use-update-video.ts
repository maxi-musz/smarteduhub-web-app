import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface UpdateVideoDto {
  title?: string;
  swapOrderWith?: string;
}

export interface VideoUpdateApiResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    order: number;
    [key: string]: any;
  };
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation<
    VideoUpdateApiResponse,
    AuthenticatedApiError,
    { videoId: string; data: UpdateVideoDto }
  >({
    mutationFn: async ({ videoId, data }) => {
      logger.info("[useUpdateVideo] Updating video", { videoId, data });

      const response = await authenticatedApi.patch<VideoUpdateApiResponse>(
        `/library/content/video/${videoId}/update`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateVideo] Video updated successfully", {
          videoId: response.data.id,
        });
        return response;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update video",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["topic-materials"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chapter-contents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["video-play"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useUpdateVideo] Cache invalidated");
    },
  });
}

