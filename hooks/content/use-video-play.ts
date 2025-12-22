import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface VideoPlayResponse {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number;
  sizeBytes: number;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  topic: {
    id: string;
    title: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface VideoPlayApiResponse {
  success: boolean;
  message: string;
  data: VideoPlayResponse;
}

export function useVideoPlay(videoId: string | null) {
  return useQuery<VideoPlayResponse, AuthenticatedApiError>({
    queryKey: ["video-play", videoId],
    queryFn: async () => {
      if (!videoId) {
        throw new AuthenticatedApiError("Video ID is required", 400);
      }

      logger.info(`[useVideoPlay] Fetching video for playback: ${videoId}`);
      const response = await authenticatedApi.get<VideoPlayResponse>(
        `/library/content/video/${videoId}/play`
      );

      if (response.success && response.data) {
        logger.info(`[useVideoPlay] Video fetched successfully`, {
          videoId,
          videoTitle: response.data.title,
          views: response.data.views,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch video",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh (within staleTime)
    refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
  });
}

