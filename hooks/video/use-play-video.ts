import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Video playback response types
export interface VideoPlaybackData {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number;
  size?: string;
  sizeBytes?: number;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  topic: {
    id: string;
    title: string;
    description?: string;
    chapter?: {
      id: string;
      title: string;
    };
    subject?: {
      id: string;
      name: string;
      code: string;
      color: string;
    };
  } | null;
  subject?: {
    id: string;
    name: string;
    code: string;
    color: string;
    thumbnailUrl?: string;
  };
  platform?: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  school?: {
    id: string;
    school_name: string;
  };
  hasViewedBefore: boolean;
  viewedAt: string | null;
  lastWatchPosition: number;
  completionPercentage: number;
  isCompleted: boolean;
  videoType: "library" | "school";
}

export interface VideoPlaybackResponse {
  success: boolean;
  message: string;
  data: VideoPlaybackData | null;
}

/**
 * Hook to fetch video playback data
 */
export const usePlayVideo = (videoId: string | null) => {
  return useQuery<VideoPlaybackData, AuthenticatedApiError>({
    queryKey: ["video", "play", videoId],
    queryFn: async (): Promise<VideoPlaybackData> => {
      if (!videoId) {
        throw new AuthenticatedApiError("Video ID is required", 400);
      }

      logger.info(`[usePlayVideo] Fetching video playback data for video: ${videoId}`);

      const response = await authenticatedApi.get<VideoPlaybackResponse>(
        `/video/${videoId}/play`
      );

      if (response.success && response.data) {
        const videoData = response.data as unknown as VideoPlaybackData;
        logger.info(`[usePlayVideo] Video playback data fetched successfully`, {
          videoId: videoData.id,
          title: videoData.title,
          videoType: videoData.videoType,
          hasViewedBefore: videoData.hasViewedBefore,
          lastWatchPosition: videoData.lastWatchPosition,
        });
        return videoData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch video playback data",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!videoId,
    staleTime: 2 * 60 * 1000, // 2 minutes - video data doesn't change frequently
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

