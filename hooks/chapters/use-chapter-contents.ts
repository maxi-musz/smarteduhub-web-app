import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface ChapterContentTopic {
  id: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  contentCounts: {
    videos: number;
    materials: number;
    links: number;
    assignments: number;
    comments: number;
    total: number;
  };
}

export interface ChapterContentsAnalysis {
  totalTopics: number;
  activeTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalLinks: number;
  totalAssignments: number;
  totalComments: number;
  totalContent: number;
  averageContentPerTopic: number;
}

export interface ChapterContentsChapter {
  id: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
  subject: {
    id: string;
    name: string;
    code: string;
    thumbnailUrl: string | null;
    thumbnailKey: string | null;
    class: {
      id: string;
      name: string;
    };
  };
}

export interface ChapterContentsResponse {
  chapter: ChapterContentsChapter;
  analysis: ChapterContentsAnalysis;
  topics: ChapterContentTopic[];
}

export interface ChapterContentsApiResponse {
  success: boolean;
  message: string;
  data: ChapterContentsResponse;
}

export function useChapterContents(chapterId: string | null) {
  return useQuery<ChapterContentsResponse, AuthenticatedApiError>({
    queryKey: ["chapter-contents", chapterId],
    queryFn: async () => {
      if (!chapterId) {
        throw new AuthenticatedApiError("Chapter ID is required", 400);
      }

      logger.info(`[useChapterContents] Fetching contents for chapter: ${chapterId}`);
      const response = await authenticatedApi.get<ChapterContentsResponse>(
        `/library/subject/chapter/getcontents/${chapterId}`
      );

      if (response.success && response.data) {
        logger.info(`[useChapterContents] Chapter contents fetched successfully`, {
          chapterId,
          chapterTitle: response.data.chapter.title,
          topicsCount: response.data.topics.length,
          analysis: response.data.analysis,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch chapter contents",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!chapterId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh (within staleTime)
    refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
  });
}

