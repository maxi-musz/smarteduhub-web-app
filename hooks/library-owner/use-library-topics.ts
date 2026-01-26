import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Topic Types for Library Owner (no chapters)
export interface LibraryTopicData {
  id: string;
  platformId: string;
  subjectId: string;
  title: string;
  description?: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  resourceCounts?: {
    totalVideos: number;
    totalMaterials: number;
    totalLinks: number;
    totalAssignments: number;
    totalResources: number;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
    class: {
      id: string;
      name: string;
    };
  };
}

// Response type for GET /library/subject/topic?subjectId={subjectId}
export interface GetTopicsBySubjectResponse {
  success: boolean;
  message: string;
  data: {
    subject: {
      id: string;
      name: string;
      code: string | null;
      class: {
        id: string;
        name: string;
      };
    };
    topics: LibraryTopicData[];
    count: number;
  };
}

export interface CreateLibraryTopicDto {
  subjectId: string;
  title: string;
  description?: string;
  order?: number;
  is_active?: boolean;
  classId?: string; // Optional classId for proper query invalidation
}

export interface UpdateLibraryTopicDto {
  title?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export interface UpdateLibraryTopicVariables {
  topicId: string;
  data: UpdateLibraryTopicDto;
  classId?: string; // Optional classId for proper query invalidation
  subjectId?: string; // Optional subjectId for proper query invalidation
}

// Inner data type for the authenticated API response
export type LibraryTopicApiResponse = LibraryTopicData;

/**
 * Hook to fetch topics for a specific subject
 * GET /library/subject/topic?subjectId={subjectId}
 */
export function useLibrarySubjectTopics(subjectId: string) {
  return useQuery<GetTopicsBySubjectResponse["data"], AuthenticatedApiError>({
    queryKey: ["library-owner", "subject-topics", subjectId],
    queryFn: async () => {
      console.log("📥 [FETCH TOPICS] GET /library/subject/topic?subjectId=" + subjectId);

      const response = await authenticatedApi.get<GetTopicsBySubjectResponse["data"]>(
        `/library/subject/topic?subjectId=${subjectId}`
      );

      if (response.success && response.data) {
        console.log("📥 [FETCH TOPICS] Response:", {
          status: response.statusCode || 200,
          topicsCount: response.data.count || response.data.topics?.length || 0,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch topics",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!subjectId,
    staleTime: 0, // Always refetch to get latest data
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Create Topic Mutation (new API - no chapters)
export function useCreateLibraryTopic() {
  const queryClient = useQueryClient();

  return useMutation<LibraryTopicApiResponse, AuthenticatedApiError, CreateLibraryTopicDto>({
    mutationFn: async (data) => {
      console.log("🔵 [CREATE TOPIC] POST /library/subject/topic/createtopic");
      
      const response = await authenticatedApi.post<LibraryTopicApiResponse>(
        "/library/subject/topic/createtopic",
        data
      );

      console.log("🟢 [CREATE TOPIC] Response:", {
        status: response.statusCode,
        topicId: response.data?.id,
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: async (response, variables) => {
      // Get classId from variables (passed explicitly) or from response
      let classId = variables.classId || response?.subject?.class?.id;
      
      // If classId is still undefined, try to find it from active queries
      if (!classId) {
        const allQueries = queryClient.getQueryCache().getAll();
        // Look for class-resources queries to extract classId
        const classResourcesQuery = allQueries.find(q => 
          q.queryKey[0] === "library-owner" && 
          q.queryKey[1] === "class-resources" &&
          q.queryKey[2] // has classId
        );
        if (classResourcesQuery && classResourcesQuery.queryKey[2]) {
          classId = classResourcesQuery.queryKey[2] as string;
        }
        
        // Also try to find from subject queries
        if (!classId) {
          const subjectQuery = allQueries.find(q => 
            q.queryKey[0] === "library-owner" && 
            q.queryKey[1] === "subject" &&
            q.queryKey[3] === variables.subjectId &&
            q.queryKey[2] // has classId
          );
          if (subjectQuery && subjectQuery.queryKey[2]) {
            classId = subjectQuery.queryKey[2] as string;
          }
        }
      }
      
      // Simple approach: invalidate and refetch the topics query
      const queryKey = ["library-owner", "subject-topics", variables.subjectId];
      console.log("🔄 [CREATE TOPIC] Refetching topics list", { subjectId: variables.subjectId });
      
      // Invalidate to mark as stale
      queryClient.invalidateQueries({ queryKey });
      
      // Force refetch
      await queryClient.refetchQueries({ queryKey });
      
      console.log("✅ [CREATE TOPIC] Topics list refetched - reloading page to ensure UI updates");
      
      // Reload the page to ensure UI updates (simple and reliable)
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
  });
}

// Update Topic Mutation (new API - no chapters)
export function useUpdateLibraryTopic() {
  const queryClient = useQueryClient();

  return useMutation<
    LibraryTopicApiResponse,
    AuthenticatedApiError,
    UpdateLibraryTopicVariables
  >({
    mutationFn: async ({ topicId, data }) => {
      console.log(`🟡 [UPDATE TOPIC] PATCH /library/subject/topic/updatetopic/${topicId}`);
      
      const response = await authenticatedApi.patch<LibraryTopicApiResponse>(
        `/library/subject/topic/updatetopic/${topicId}`,
        data
      );

      console.log("🟢 [UPDATE TOPIC] Response:", {
        status: response.statusCode,
        topicId: response.data?.id,
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: async (response, variables) => {
      // Get subjectId from variables, response, or extract from response subject
      let subjectId = variables.subjectId || response?.subjectId || response?.subject?.id;
      
      // If still no subjectId, try to find it from active queries
      if (!subjectId) {
        const allQueries = queryClient.getQueryCache().getAll();
        // Look for subject-topics queries to extract subjectId
        const topicsQuery = allQueries.find(q => 
          q.queryKey[0] === "library-owner" && 
          q.queryKey[1] === "subject-topics" &&
          q.queryKey[2] // has subjectId
        );
        if (topicsQuery && topicsQuery.queryKey[2]) {
          subjectId = topicsQuery.queryKey[2] as string;
        }
      }
      
      if (!subjectId) {
        console.warn("🟡 [UPDATE TOPIC] No subjectId found, cannot refetch topics");
        return;
      }
      
      // Simple approach: invalidate and refetch the topics query
      const queryKey = ["library-owner", "subject-topics", subjectId];
      console.log("🔄 [UPDATE TOPIC] Refetching topics list", { subjectId });
      
      // Invalidate to mark as stale
      queryClient.invalidateQueries({ queryKey });
      
      // Force refetch
      await queryClient.refetchQueries({ queryKey });
      
      console.log("✅ [UPDATE TOPIC] Topics list refetched - reloading page to ensure UI updates");
      
      // Reload the page to ensure UI updates (simple and reliable)
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
  });
}

// Delete Topic Mutation
export function useDeleteLibraryTopic() {
  const queryClient = useQueryClient();

  return useMutation<
    {
      success: boolean;
      message?: string;
      data?: {
        deletedTopic: {
          id: string;
          title: string;
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
        deletedResourcesCount: number;
      };
    },
    AuthenticatedApiError,
    { topicId: string; subjectId?: string; classId?: string }
  >({
    mutationFn: async ({ topicId }) => {
      console.log(`🔴 [DELETE TOPIC] DELETE /library/subject/topic/deletetopic/${topicId}`);
      
      const response = await authenticatedApi.delete<{
        deletedTopic: {
          id: string;
          title: string;
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
        deletedResourcesCount: number;
      }>(`/library/subject/topic/deletetopic/${topicId}`);

      console.log("🟢 [DELETE TOPIC] Response:", {
        status: response.statusCode,
        deletedResourcesCount: response.data?.deletedResourcesCount,
      });

      if (response.success === true || (response.success === undefined && !response.message)) {
        return {
          success: response.success ?? true,
          message: response.message,
          data: response.data,
        };
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: async (response, { topicId, subjectId, classId }) => {
      // Get subjectId from variables or extract from response
      let finalSubjectId = subjectId || response?.data?.deletedTopic?.subject?.id;
      
      // If still no subjectId, try to find it from active queries
      if (!finalSubjectId) {
        const allQueries = queryClient.getQueryCache().getAll();
        // Look for subject-topics queries to extract subjectId
        const topicsQuery = allQueries.find(q => 
          q.queryKey[0] === "library-owner" && 
          q.queryKey[1] === "subject-topics" &&
          q.queryKey[2] // has subjectId
        );
        if (topicsQuery && topicsQuery.queryKey[2]) {
          finalSubjectId = topicsQuery.queryKey[2] as string;
        }
      }
      
      if (!finalSubjectId) {
        console.warn("🔴 [DELETE TOPIC] No subjectId found, cannot refetch topics");
        return;
      }
      
      // Simple approach: invalidate and refetch the topics query
      const queryKey = ["library-owner", "subject-topics", finalSubjectId];
      console.log("🔄 [DELETE TOPIC] Refetching topics list", { subjectId: finalSubjectId });
      
      // Invalidate to mark as stale
      queryClient.invalidateQueries({ queryKey });
      
      // Force refetch
      await queryClient.refetchQueries({ queryKey });
      
      console.log("✅ [DELETE TOPIC] Topics list refetched - reloading page to ensure UI updates");
      
      // Reload the page to ensure UI updates (simple and reliable)
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
      // Also invalidate other related queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "subject-detail", finalSubjectId],
      });
      
      if (classId) {
        queryClient.invalidateQueries({
          queryKey: ["library-owner", "subject", classId, finalSubjectId],
        });
      }
      
      // Invalidate topic materials for this specific topic
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "topic-materials", topicId],
      });
    },
  });
}
