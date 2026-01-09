import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface ExploreVideoPlayResponse {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  sizeBytes: number | null;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  hasViewedBefore: boolean;
  viewedAt: string | null;
  topic: {
    id: string;
    title: string;
    description: string | null;
    chapter: {
      id: string;
      title: string;
    } | null;
  } | null;
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
    thumbnailUrl: string | null;
  };
  platform: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
}

export interface ExploreVideoPlayApiResponse {
  success: boolean;
  message: string;
  data: ExploreVideoPlayResponse;
}

export function useExploreVideoPlay(videoId: string | null) {
  return useQuery<ExploreVideoPlayResponse, AuthenticatedApiError>({
    queryKey: ["explore", "video-play", videoId],
    queryFn: async () => {
      if (!videoId) {
        throw new AuthenticatedApiError("Video ID is required", 400);
      }

      logger.info(`[useExploreVideoPlay] Fetching video for playback: ${videoId}`);
      const response = await authenticatedApi.get<ExploreVideoPlayResponse>(
        `/explore/videos/${videoId}/play`
      );

      if (response.success && response.data) {
        logger.info(`[useExploreVideoPlay] Video fetched successfully`, {
          videoId,
          videoTitle: response.data.title,
          views: response.data.views,
          hasViewedBefore: response.data.hasViewedBefore,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

