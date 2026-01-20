import { useQuery } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on the backend API response
export interface StudentTopicContentResponse {
  success: boolean;
  message: string;
  data: TopicContentData;
}

export interface TopicContentData {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  topicOrder: number;
  contentSummary: ContentSummary;
  videos: TopicVideo[];
  materials: TopicMaterial[];
  assignments: TopicAssignment[];
  quizzes: TopicQuiz[];
  liveClasses: LiveClass[];
  libraryResources: LibraryResource[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentSummary {
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
  totalQuizzes: number;
  totalLiveClasses: number;
  totalLibraryResources: number;
  totalContent: number;
}

export interface TopicVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  order: number;
  size: string;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicAssignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicQuiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  meetingUrl: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch topic content data
 */
const fetchTopicContent = async (topicId: string): Promise<TopicContentData> => {
  logger.info("[use-student-topic-content] Fetching topic content", { topicId });

  try {
    const response = await authenticatedApi.get<TopicContentData>(
      `/students/topics/${topicId}/content`
    );

    logger.info("[use-student-topic-content] Topic content fetched successfully", response);

    // authenticatedApi returns the parsed JSON response
    if (response && typeof response === "object" && "data" in response && response.success && response.data) {
      return response.data;
    }

    // If response is already the data object
    if (response && typeof response === "object" && "topicId" in response) {
      return response as unknown as TopicContentData;
    }

    logger.error("[use-student-topic-content] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from topic content API");
  } catch (error) {
    logger.error("[use-student-topic-content] Error fetching topic content:", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
};

/**
 * Hook to fetch topic content
 */
export const useStudentTopicContent = (topicId: string) => {
  return useQuery({
    queryKey: ["student", "topic", topicId, "content"],
    queryFn: () => fetchTopicContent(topicId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!topicId, // Only fetch if topicId is provided
  });
};


