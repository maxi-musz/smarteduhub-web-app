import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface AIBookChapterFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  sizeBytes: number | null;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
}

export interface AIBookChapter {
  id: string;
  title: string;
  description: string | null;
  pageStart: number | null;
  pageEnd: number | null;
  order: number;
  isProcessed: boolean;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
  files: AIBookChapterFile[];
}

export interface AIBookDetail {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  thumbnailS3Key: string | null;
  thumbnailUrl: string | null;
  url: string; // Main PDF URL
  s3Key: string;
  sizeBytes: number | null;
  pageCount: number | null;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  chapters: AIBookChapter[];
}

export function useAIBookDetail(bookId: string | null) {
  return useQuery<AIBookDetail, AuthenticatedApiError>({
    queryKey: ["explore", "ai-books", "detail", bookId],
    queryFn: async () => {
      if (!bookId) {
        throw new AuthenticatedApiError("Book ID is required", 400);
      }

      logger.info("[useAIBookDetail] Fetching AI book detail", { bookId });

      // Try the explore endpoint first
      try {
        const response = await authenticatedApi.get<AIBookDetail>(
          `/explore/ai-books/${bookId}`
        );

        if (response.success && response.data) {
          logger.info("[useAIBookDetail] AI book detail fetched successfully", {
            bookId,
            title: response.data.title,
            chaptersCount: response.data.chapters?.length || 0,
          });
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to fetch AI book detail",
          400,
          response
        );
      } catch (error) {
        // Fallback to general materials endpoint if explore endpoint doesn't exist
        if (error instanceof AuthenticatedApiError && error.statusCode === 404) {
          logger.info("[useAIBookDetail] Explore endpoint not found, trying general materials endpoint", {
            bookId,
          });

          const fallbackResponse = await authenticatedApi.get<AIBookDetail>(
            `/library/general-materials/${bookId}`
          );

          if (fallbackResponse.success && fallbackResponse.data) {
            logger.info("[useAIBookDetail] AI book detail fetched from fallback endpoint", {
              bookId,
            });
            return fallbackResponse.data;
          }
        }

        throw error;
      }
    },
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
