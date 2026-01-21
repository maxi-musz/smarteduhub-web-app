import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

// Watch progress request types
export interface WatchProgressRequest {
  watchDurationSeconds?: number;
  lastWatchPosition?: number;
  deviceType?: "mobile" | "tablet" | "desktop" | "tv";
  platform?: "ios" | "android" | "web";
  referrerSource?: "direct" | "search" | "recommendation" | "related_video" | "playlist";
  videoQuality?: "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p";
  playbackSpeed?: number;
  bufferingEvents?: number;
  sessionId?: string;
  userAgent?: string;
}

export interface WatchProgressResponse {
  success: boolean;
  message: string;
  data: {
    watchId: string;
    completionPercentage: number;
    isCompleted: boolean;
    lastWatchPosition: number;
  } | null;
}

/**
 * Hook to track video watch progress
 */
export const useTrackWatchProgress = () => {
  const queryClient = useQueryClient();

  return useMutation<
    WatchProgressResponse["data"],
    AuthenticatedApiError,
    { videoId: string; progress: WatchProgressRequest }
  >({
    mutationFn: async ({ videoId, progress }): Promise<WatchProgressResponse["data"]> => {
      console.log(`[useTrackWatchProgress] Calling backend to track progress for video: ${videoId}`, {
        lastWatchPosition: progress.lastWatchPosition,
        watchDurationSeconds: progress.watchDurationSeconds,
        endpoint: `/video/${videoId}/watch-progress`,
      });

      logger.info(`[useTrackWatchProgress] Tracking watch progress for video: ${videoId}`, {
        lastWatchPosition: progress.lastWatchPosition,
        watchDurationSeconds: progress.watchDurationSeconds,
        completionPercentage:
          progress.lastWatchPosition && progress.watchDurationSeconds
            ? Math.round((progress.lastWatchPosition / progress.watchDurationSeconds) * 100)
            : 0,
      });

      const response = await authenticatedApi.post<WatchProgressResponse>(
        `/video/${videoId}/watch-progress`,
        progress
      );

      console.log(`[useTrackWatchProgress] Backend response:`, {
        success: response.success,
        message: response.message,
        data: response.data,
      });

      if (response.success && response.data) {
        const progressData = response.data as unknown as NonNullable<WatchProgressResponse["data"]>;
        logger.info(`[useTrackWatchProgress] Watch progress tracked successfully`, {
          watchId: progressData.watchId,
          completionPercentage: progressData.completionPercentage,
          isCompleted: progressData.isCompleted,
        });

        // Invalidate video playback query to refresh watch position
        queryClient.invalidateQueries({
          queryKey: ["video", "play", videoId],
        });

        return progressData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to track watch progress",
        response.statusCode || 400,
        response
      );
    },
    onError: (error) => {
      // Don't show toast for progress tracking errors - they're not critical
      logger.error(`[useTrackWatchProgress] Error tracking progress:`, {
        message: error.message,
        statusCode: error.statusCode,
      });
    },
  });
};

