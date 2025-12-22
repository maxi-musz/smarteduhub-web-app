import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface DeleteVideoApiResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
  };
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation<DeleteVideoApiResponse, AuthenticatedApiError, string>({
    mutationFn: async (videoId: string) => {
      logger.info("[useDeleteVideo] Deleting video", { videoId });

      const response = await authenticatedApi.delete<DeleteVideoApiResponse>(
        `/library/content/video/${videoId}`
      );

      if (response.success && response.data) {
        logger.info("[useDeleteVideo] Video deleted successfully", {
          videoId: response.data.id,
          title: response.data.title,
        });
        return response;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete video",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh content
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
      logger.info("[useDeleteVideo] Cache invalidated");
    },
  });
}

