import { useQuery } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useSession } from "next-auth/react";

// Shared types for topic content across all roles
export interface TopicContentData {
  topicId: string;
  topicTitle: string;
  topicDescription: string | null;
  topicOrder: number;
  contentSummary: {
    totalVideos: number;
    totalMaterials: number;
    totalAssignments: number;
    totalQuizzes: number;
    totalLiveClasses: number;
    totalLibraryResources: number;
    totalContent: number;
  };
  videos: Array<{
    id: string;
    title: string;
    description: string | null;
    url: string;
    order: number;
    duration: string | null;
    thumbnail: any | null;
    size: string | null;
    views: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  materials: Array<{
    id: string;
    title: string;
    description: string | null;
    url: string;
    size: string | null;
    downloads: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  assignments?: Array<{
    id: string;
    title: string;
    description: string | null;
    dueDate: string | null;
    status: string;
    maxScore: number | null;
    timeLimit: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
  assessments?: Array<{
    id: string;
    title: string;
    description: string | null;
    duration: number | null;
    totalQuestions: number | null;
    passingScore: number | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  liveClasses?: Array<{
    id: string;
    title: string;
    description: string | null;
    meetingUrl: string;
    startTime: string;
    endTime: string;
    status: string;
    maxParticipants: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
  libraryResources?: Array<{
    id: string;
    title: string;
    description: string | null;
    resourceType: string;
    url: string | null;
    status: string;
    format: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get API endpoint prefix based on role
 * Note: School directors use teacher endpoints for topic content since they don't have their own
 */
function getRoleEndpointPrefix(role?: string): string {
  switch (role) {
    case "teacher":
      return "/teachers";
    case "school_director":
      // School directors use teacher endpoints for topic content
      return "/teachers";
    case "student":
      return "/students";
    default:
      return "/teachers"; // Default fallback
  }
}

/**
 * Fetch topic content for any role
 */
const fetchTopicContent = async (
  topicId: string,
  role?: string
): Promise<TopicContentData> => {
  // School directors use teacher endpoints for topic content
  const effectiveRole = role === "school_director" ? "teacher" : role;
  const rolePrefix = getRoleEndpointPrefix(effectiveRole);
  logger.info(`[use-topic-content] Fetching topic content for ${role || "teacher"} (using ${effectiveRole} endpoint)`, { topicId });

  const response = await authenticatedApi.get<{
    success: boolean;
    message: string;
    data: TopicContentData;
  }>(`${rolePrefix}/topics/${topicId}/content`);

  if (response.success && response.data) {
    const topicContent = response.data as unknown as TopicContentData;
    logger.info(`[use-topic-content] Topic content fetched successfully`, {
      topicId: topicContent.topicId,
      videosCount: topicContent.videos.length,
      materialsCount: topicContent.materials.length,
    });
    return topicContent;
  }

  throw new Error(response.message || "Failed to fetch topic content");
};

/**
 * Hook to fetch topic content - automatically uses current user's role
 */
export const useTopicContent = (topicId: string | null) => {
  const { data: session } = useSession();
  const role = session?.user?.role as string | undefined;

  return useQuery({
    queryKey: ["topic", role, topicId, "content"],
    queryFn: () => fetchTopicContent(topicId!, role),
    enabled: !!topicId && !!role,
    staleTime: 2 * 60 * 1000, // 2 minutes - content may change more frequently
  });
};

