import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface AIBookChapterFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  sizeBytes: number;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
}

export interface AIBookChapter {
  id: string;
  title: string;
  description: string | null;
  pageStart: number;
  pageEnd: number;
  order: number;
  isAiEnabled: boolean;
  isProcessed: boolean;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
  files: AIBookChapterFile[];
}

export function useAIBookChapters(bookId: string | null) {
  return useQuery<AIBookChapter[], AuthenticatedApiError>({
    queryKey: ["explore", "ai-books", "chapters", bookId],
    queryFn: async () => {
      if (!bookId) {
        throw new AuthenticatedApiError("Book ID is required", 400);
      }

      logger.info("[useAIBookChapters] Fetching chapters for book", { bookId });

      const response = await authenticatedApi.get<AIBookChapter[]>(
        `/explore/ai-books/${bookId}/chapters`
      );

      if (response.success && response.data) {
        // Sort chapters by order
        const sortedChapters = [...response.data].sort((a, b) => a.order - b.order);
        
        logger.info("[useAIBookChapters] Chapters fetched successfully", {
          bookId,
          chaptersCount: sortedChapters.length,
        });
        return sortedChapters;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch book chapters",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useAIBookChapter(bookId: string | null, chapterId: string | null) {
  return useQuery<AIBookChapter, AuthenticatedApiError>({
    queryKey: ["explore", "ai-books", "chapter", bookId, chapterId],
    queryFn: async () => {
      if (!bookId || !chapterId) {
        throw new AuthenticatedApiError("Book ID and Chapter ID are required", 400);
      }

      logger.info("[useAIBookChapter] Fetching chapter detail", { bookId, chapterId });

      const response = await authenticatedApi.get<AIBookChapter>(
        `/explore/ai-books/${bookId}/chapters/${chapterId}`
      );

      if (response.success && response.data) {
        logger.info("[useAIBookChapter] Chapter detail fetched successfully", {
          bookId,
          chapterId,
          title: response.data.title,
          filesCount: response.data.files?.length || 0,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch chapter detail",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!bookId && !!chapterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
