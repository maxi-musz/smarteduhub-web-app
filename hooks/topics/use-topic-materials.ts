import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types matching backend response structure
export interface TopicVideo {
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

export interface TopicMaterial {
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

export interface TopicLink {
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
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface TopicMaterialsStatistics {
  totalVideos: number;
  totalMaterials: number;
  totalLinks: number;
  totalAssignments: number;
  totalComments: number;
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
  assignmentsWithDueDate: number;
  linkTypeBreakdown: Record<string, number>;
  topLevelComments: number;
  totalReplies: number;
  editedComments: number;
  totalContentSize: number;
  totalContentSizeFormatted: string;
}

export interface TopicMaterialsContent {
  videos: TopicVideo[];
  materials: TopicMaterial[];
  links: TopicLink[];
  assignments: any[];
  comments: any[];
}

export interface TopicMaterialsResponse {
  topic: {
    id: string;
    title: string;
    description: string;
    order: number;
    is_active: boolean;
    chapter: {
      id: string;
      title: string;
      order: number;
    };
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
  statistics: TopicMaterialsStatistics;
  content: TopicMaterialsContent;
}

export interface TopicMaterialsApiResponse {
  success: boolean;
  message: string;
  data: TopicMaterialsResponse;
}

export function useTopicMaterials(topicId: string | null) {
  return useQuery<TopicMaterialsResponse, AuthenticatedApiError>({
    queryKey: ["topic-materials", topicId],
    queryFn: async () => {
      if (!topicId) {
        throw new AuthenticatedApiError("Topic ID is required", 400);
      }

      logger.info(`[useTopicMaterials] Fetching materials for topic: ${topicId}`);
      const response = await authenticatedApi.get<TopicMaterialsResponse>(
        `/library/subject/chapter/topic/getmaterials/${topicId}`
      );

      if (response.success && response.data) {
        logger.info(`[useTopicMaterials] Topic materials fetched successfully`, {
          topicId,
          topicTitle: response.data.topic.title,
          videosCount: response.data.content.videos.length,
          materialsCount: response.data.content.materials.length,
          linksCount: response.data.content.links.length,
          statistics: response.data.statistics,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch topic materials",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh (within staleTime)
    refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
  });
}

