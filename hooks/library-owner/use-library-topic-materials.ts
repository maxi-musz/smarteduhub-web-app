import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types matching new backend response structure (no chapters)
export interface LibraryTopicVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number;
  sizeBytes: number;
  views: number;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface LibraryTopicMaterial {
  id: string;
  title: string;
  description: string;
  materialType: string;
  url: string;
  sizeBytes: number;
  pageCount: number;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface LibraryTopicLink {
  id: string;
  title: string;
  description: string;
  url: string;
  linkType: string | null;
  domain: string;
  thumbnailUrl: string | null;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryTopicMaterialsStatistics {
  totalVideos: number;
  totalMaterials: number;
  totalLinks: number;
  totalAssignments: number;
  totalComments: number;
  totalCbts: number;
  totalContent: number;
  totalVideoViews: number;
  totalVideoDuration: number;
  totalVideoDurationFormatted: string;
  totalVideoSize: number;
  totalVideoSizeFormatted: string;
  totalMaterialSize: number;
  totalMaterialSizeFormatted: string;
  materialTypeBreakdown: Record<string, number>;
  assignmentTypeBreakdown: Record<string, number>;
  linkTypeBreakdown: Record<string, number>;
  topLevelComments: number;
  totalReplies: number;
  editedComments: number;
  totalCbtQuestions: number;
  totalCbtAttempts: number;
  publishedCbts: number;
  totalContentSize: number;
  totalContentSizeFormatted: string;
}

export interface LibraryTopicMaterialsContent {
  videos: LibraryTopicVideo[];
  materials: LibraryTopicMaterial[];
  links: LibraryTopicLink[];
  assignments: any[];
  comments: any[];
  cbts: any[];
}

export interface LibraryTopicMaterialsResponse {
  topic: {
    id: string;
    title: string;
    description: string;
    order: number;
    is_active: boolean;
    subject: {
      id: string;
      name: string;
      code: string;
      class: {
        id: string;
        name: string;
      };
    };
  };
  statistics: LibraryTopicMaterialsStatistics;
  content: LibraryTopicMaterialsContent;
}

export interface LibraryTopicMaterialsApiResponse {
  success: boolean;
  message: string;
  data: LibraryTopicMaterialsResponse;
}

export function useLibraryTopicMaterials(topicId: string | null) {
  return useQuery<LibraryTopicMaterialsResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "topic-materials", topicId],
    queryFn: async () => {
      if (!topicId) {
        throw new AuthenticatedApiError("Topic ID is required", 400);
      }

      logger.info(`[useLibraryTopicMaterials] Fetching materials for topic: ${topicId}`);
      const response = await authenticatedApi.get<LibraryTopicMaterialsApiResponse>(
        `/library/subject/topic/getmaterials/${topicId}`
      );

      if (response.success && response.data) {
        // Response structure: { success: true, data: LibraryTopicMaterialsResponse, message: string }
        const materialsData = response.data as unknown as LibraryTopicMaterialsResponse;
        logger.info(`[useLibraryTopicMaterials] Topic materials fetched successfully`, {
          topicId,
          topicTitle: materialsData.topic?.title,
          videosCount: materialsData.content?.videos?.length || 0,
          materialsCount: materialsData.content?.materials?.length || 0,
          linksCount: materialsData.content?.links?.length || 0,
          statistics: materialsData.statistics,
        });
        return materialsData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch topic materials",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
