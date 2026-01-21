import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

export interface TeacherTopic {
  id: string;
  title: string;
  description: string | null;
  order: number;
  status: string;
  videos: Array<{
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    url: string;
    uploadedAt: string;
    size: string;
    views: number;
    status: string;
  }>;
  materials: Array<{
    id: string;
    title: string;
    type: string;
    size: string;
    url: string;
    uploadedAt: string;
    downloads: number;
    status: string;
  }>;
  instructions: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherTopicDto {
  subject_id: string; // Also accepts subjectId
  title: string;
  description?: string;
  instructions?: string;
  is_active?: boolean;
  academic_session_id?: string; // Optional - uses current active session if not provided
}

export interface TeacherTopicDetail {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  order: number;
  is_active: boolean;
  subject: {
    id: string;
    name: string;
    code: string | null;
    color: string;
  };
  school: {
    id: string;
    school_name: string;
  };
  academicSession: {
    id: string;
    academic_year: string;
    term: string;
  };
  createdBy: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherTopicResponse extends TeacherTopicDetail {}

/**
 * Hook to create a topic for a teacher subject
 * Uses POST /teachers/topics endpoint
 */
export function useCreateTeacherTopic() {
  const queryClient = useQueryClient();

  return useMutation<CreateTeacherTopicResponse, AuthenticatedApiError, CreateTeacherTopicDto>({
    mutationFn: async (data): Promise<CreateTeacherTopicResponse> => {
      logger.info("[useCreateTeacherTopic] Creating topic", { 
        subject_id: data.subject_id,
        title: data.title,
      });

      // Prepare request body - API accepts both subject_id and subjectId
      const requestBody: {
        title: string;
        description?: string;
        instructions?: string;
        is_active?: boolean;
        subject_id: string;
        academic_session_id?: string;
      } = {
        title: data.title,
        subject_id: data.subject_id,
      };

      if (data.description !== undefined) {
        requestBody.description = data.description;
      }
      if (data.instructions !== undefined) {
        requestBody.instructions = data.instructions;
      }
      if (data.is_active !== undefined) {
        requestBody.is_active = data.is_active;
      }
      if (data.academic_session_id !== undefined) {
        requestBody.academic_session_id = data.academic_session_id;
      }

      const response = await authenticatedApi.post<{
        success: boolean;
        message: string;
        data: CreateTeacherTopicResponse;
        statusCode?: number;
      }>(
        `/teachers/topics`,
        requestBody
      );

      // Check success field first
      if (response.success && response.data) {
        const topicData = response.data as unknown as CreateTeacherTopicResponse;
        logger.info("[useCreateTeacherTopic] Topic created successfully", {
          topicId: topicData.id,
        });
        return topicData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate comprehensive subject query to refresh topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "subject", variables.subject_id, "comprehensive"],
      });
      // Also invalidate the subject detail query
      queryClient.invalidateQueries({
        queryKey: ["teacher", "subject", variables.subject_id],
      });
      // Invalidate topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topics"],
      });
      logger.info("[useCreateTeacherTopic] Cache invalidated", {
        subject_id: variables.subject_id,
      });
    },
  });
}

/**
 * Fetch topic by ID
 * Uses GET /teachers/topics/:id endpoint
 */
const fetchTeacherTopicById = async (topicId: string): Promise<TeacherTopicDetail> => {
  logger.info("[useTeacherTopicById] Fetching topic", { topicId });

  const response = await authenticatedApi.get<{
    success: boolean;
    message: string;
    data: TeacherTopicDetail;
  }>(`/teachers/topics/${topicId}`);

  if (response.success && response.data) {
    const topicData = response.data as unknown as TeacherTopicDetail;
    logger.info("[useTeacherTopicById] Topic fetched successfully", {
      topicId: topicData.id,
    });
    return topicData;
  }

  throw new AuthenticatedApiError(
    response.message || "Failed to fetch topic",
    response.statusCode || 404,
    response
  );
};

/**
 * Hook to fetch topic by ID
 */
export function useTeacherTopicById(topicId: string | null) {
  return useQuery<TeacherTopicDetail, AuthenticatedApiError>({
    queryKey: ["teacher", "topic", topicId],
    queryFn: () => fetchTeacherTopicById(topicId!),
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export interface TeacherTopicContentData {
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
  assignments: Array<{
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
  assessments: Array<{
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
  liveClasses: Array<{
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
  libraryResources: Array<{
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
 * Fetch topic content by topic ID
 * Uses GET /teachers/topics/:id/content endpoint
 */
const fetchTeacherTopicContent = async (topicId: string): Promise<TeacherTopicContentData> => {
  logger.info("[useTeacherTopicContent] Fetching topic content", { topicId });

  const response = await authenticatedApi.get<{
    success: boolean;
    message: string;
    data: TeacherTopicContentData;
  }>(`/teachers/topics/${topicId}/content`);

  if (response.success && response.data) {
    const topicContent = response.data as unknown as TeacherTopicContentData;
    logger.info("[useTeacherTopicContent] Topic content fetched successfully", {
      topicId: topicContent.topicId,
      videosCount: topicContent.videos.length,
      materialsCount: topicContent.materials.length,
    });
    return topicContent;
  }

  throw new AuthenticatedApiError(
    response.message || "Failed to fetch topic content",
    response.statusCode || 404,
    response
  );
};

/**
 * Hook to fetch topic content by topic ID
 */
export function useTeacherTopicContent(topicId: string | null) {
  return useQuery<TeacherTopicContentData, AuthenticatedApiError>({
    queryKey: ["teacher", "topic", topicId, "content"],
    queryFn: () => fetchTeacherTopicContent(topicId!),
    enabled: !!topicId,
    staleTime: 2 * 60 * 1000, // 2 minutes - content may change more frequently
  });
}

export interface UpdateTeacherTopicDto {
  title?: string;
  description?: string;
  instructions?: string;
  is_active?: boolean;
}

/**
 * Hook to update a topic
 * Uses PATCH /teachers/topics/:id endpoint
 */
export function useUpdateTeacherTopic() {
  const queryClient = useQueryClient();

  return useMutation<
    TeacherTopicDetail,
    AuthenticatedApiError,
    { topicId: string; data: UpdateTeacherTopicDto }
  >({
    mutationFn: async ({ topicId, data }): Promise<TeacherTopicDetail> => {
      logger.info("[useUpdateTeacherTopic] Updating topic", {
        topicId,
        updates: Object.keys(data),
      });

      const requestBody: UpdateTeacherTopicDto = {};

      if (data.title !== undefined) {
        requestBody.title = data.title;
      }
      if (data.description !== undefined) {
        requestBody.description = data.description;
      }
      if (data.instructions !== undefined) {
        requestBody.instructions = data.instructions;
      }
      if (data.is_active !== undefined) {
        requestBody.is_active = data.is_active;
      }

      const response = await authenticatedApi.patch<{
        success: boolean;
        message: string;
        data: TeacherTopicDetail;
      }>(`/teachers/topics/${topicId}`, requestBody);

      if (response.success && response.data) {
        const topicData = response.data as unknown as TeacherTopicDetail;
        logger.info("[useUpdateTeacherTopic] Topic updated successfully", {
          topicId: topicData.id,
        });
        return topicData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate topic queries
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topic", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topic", data.id, "content"],
      });
      // Invalidate comprehensive subject query to refresh topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "subject", data.subject.id, "comprehensive"],
      });
      // Invalidate topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topics"],
      });
      logger.info("[useUpdateTeacherTopic] Cache invalidated", {
        topicId: data.id,
        subjectId: data.subject.id,
      });
    },
  });
}

/**
 * Hook to delete a topic
 * Uses DELETE /teachers/topics/:id endpoint
 */
export function useDeleteTeacherTopic() {
  const queryClient = useQueryClient();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (topicId) => {
      logger.info("[useDeleteTeacherTopic] Deleting topic", { topicId });

      const response = await authenticatedApi.delete<{
        success: boolean;
        message: string;
        data: null;
      }>(`/teachers/topics/${topicId}`);

      // Check if response indicates success
      // For 204 No Content, response might be empty or have success: true
      if (response.success === true || (response.success === undefined && !response.message)) {
        logger.info("[useDeleteTeacherTopic] Topic deleted successfully", {
          topicId,
        });
        return;
      }

      // If success is false, throw error
      throw new AuthenticatedApiError(
        response.message || "Failed to delete topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, topicId) => {
      // Invalidate all topic-related queries
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topic", topicId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topic", topicId, "content"],
      });
      // Invalidate comprehensive subject query to refresh topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "subject"],
      });
      // Invalidate topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topics"],
      });
      logger.info("[useDeleteTeacherTopic] Cache invalidated", { topicId });
    },
  });
}

export interface ReorderTopicsDto {
  topics: Array<{
    id: string;
    order: number;
  }>;
}

/**
 * Hook to reorder multiple topics
 * Uses POST /teachers/topics/reorder/:subjectId endpoint
 */
export function useReorderTopics() {
  const queryClient = useQueryClient();

  return useMutation<void, AuthenticatedApiError, { subjectId: string; data: ReorderTopicsDto }>({
    mutationFn: async ({ subjectId, data }) => {
      logger.info("[useReorderTopics] Reordering topics", {
        subjectId,
        topicsCount: data.topics.length,
      });

      const response = await authenticatedApi.post<{
        success: boolean;
        message: string;
        data: null;
      }>(`/teachers/topics/reorder/${subjectId}`, data);

      if (response.success !== false) {
        logger.info("[useReorderTopics] Topics reordered successfully", {
          subjectId,
        });
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to reorder topics",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate comprehensive subject query to refresh topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "subject", variables.subjectId, "comprehensive"],
      });
      // Invalidate topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topics"],
      });
      logger.info("[useReorderTopics] Cache invalidated", {
        subjectId: variables.subjectId,
      });
    },
  });
}

/**
 * Hook to reorder a single topic
 * Uses PATCH /teachers/topics/reorder/:subjectId/:topicId endpoint
 */
export function useReorderSingleTopic() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AuthenticatedApiError,
    { subjectId: string; topicId: string; newPosition: number }
  >({
    mutationFn: async ({ subjectId, topicId, newPosition }) => {
      logger.info("[useReorderSingleTopic] Reordering topic", {
        subjectId,
        topicId,
        newPosition,
      });

      const response = await authenticatedApi.patch<{
        success: boolean;
        message: string;
        data: null;
      }>(`/teachers/topics/reorder/${subjectId}/${topicId}`, {
        newPosition,
      });

      if (response.success !== false) {
        logger.info("[useReorderSingleTopic] Topic reordered successfully", {
          topicId,
          newPosition,
        });
        return;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to reorder topic",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate comprehensive subject query to refresh topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "subject", variables.subjectId, "comprehensive"],
      });
      // Invalidate topic queries
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topic", variables.topicId],
      });
      // Invalidate topics list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "topics"],
      });
      logger.info("[useReorderSingleTopic] Cache invalidated", {
        subjectId: variables.subjectId,
        topicId: variables.topicId,
      });
    },
  });
}

export interface UploadVideoRequest {
  title: string;
  description?: string;
  subject_id: string;
  topic_id: string;
  video: File;
  thumbnail?: File;
}

export interface UploadVideoResponse {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: any | null;
  size: string;
  duration: string;
  status: string;
  subject_id: string;
  topic_id: string;
  uploaded_by: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadSessionResponse {
  sessionId: string;
}

export interface UploadProgressData {
  progress: number; // 0-100
  stage: "uploading" | "processing" | "completed" | "error";
  message: string;
  data?: UploadVideoResponse | UploadMaterialResponse | null;
  error?: string;
}

export interface UploadMaterialRequest {
  title: string;
  description?: string;
  subject_id: string;
  topic_id: string;
  material: File;
}

export interface UploadMaterialResponse {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: any | null;
  size: string;
  fileType: string;
  originalName: string;
  downloads: number;
  status: string;
  order: number;
  subject_id: string;
  topic_id: string;
  uploaded_by: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook to start a video upload session with progress tracking
 * Uses POST /teachers/topics/upload-video/start endpoint
 */
export function useStartVideoUpload() {
  return useMutation<UploadSessionResponse, AuthenticatedApiError, UploadVideoRequest>({
    mutationFn: async (data): Promise<UploadSessionResponse> => {
      logger.info("[useStartVideoUpload] Starting video upload session", {
        topicId: data.topic_id,
        subjectId: data.subject_id,
        title: data.title,
        videoSize: data.video.size,
        hasThumbnail: !!data.thumbnail,
      });

      // Create FormData
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("subject_id", data.subject_id);
      formData.append("topic_id", data.topic_id);
      formData.append("video", data.video);
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      const response = await authenticatedApi.post<{
        success: boolean;
        message: string;
        data: UploadSessionResponse;
        statusCode?: number;
      }>("/teachers/topics/upload-video/start", formData);

      if (response.success && response.data) {
        const sessionData = response.data as unknown as UploadSessionResponse;
        logger.info("[useStartVideoUpload] Upload session started", {
          sessionId: sessionData.sessionId,
        });
        return sessionData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to start video upload",
        response.statusCode || 400,
        response
      );
    },
  });
}

/**
 * Hook to get video upload progress via polling
 * Uses GET /teachers/topics/video-upload-progress/:sessionId endpoint
 */
export function useVideoUploadProgress(sessionId: string | null) {
  return useQuery<UploadProgressData, AuthenticatedApiError>({
    queryKey: ["teacher", "video-upload-progress", sessionId],
    queryFn: async (): Promise<UploadProgressData> => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await authenticatedApi.get<{
        success: boolean;
        message: string;
        data: UploadProgressData;
        statusCode?: number;
      }>(`/teachers/topics/video-upload-progress/${sessionId}`);

      if (response.success && response.data) {
        return response.data as unknown as UploadProgressData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to get upload progress",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling if completed or error
      if (data?.stage === "completed" || data?.stage === "error") {
        logger.info("[useVideoUploadProgress] Stopping polling", {
          stage: data.stage,
          progress: data.progress,
        });
        return false;
      }
      // Poll every 2 seconds while uploading/processing
      return 2000;
    },
    refetchIntervalInBackground: true,
    // Stop refetching when query is disabled or data is completed/error
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to start a material upload session with progress tracking
 * Uses POST /teachers/topics/upload-material/start endpoint
 */
export function useStartMaterialUpload() {
  return useMutation<UploadSessionResponse, AuthenticatedApiError, UploadMaterialRequest>({
    mutationFn: async (data): Promise<UploadSessionResponse> => {
      logger.info("[useStartMaterialUpload] Starting material upload session", {
        topicId: data.topic_id,
        subjectId: data.subject_id,
        title: data.title,
        materialSize: data.material.size,
      });

      // Create FormData
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("subject_id", data.subject_id);
      formData.append("topic_id", data.topic_id);
      formData.append("material", data.material);

      const response = await authenticatedApi.post<{
        success: boolean;
        message: string;
        data: UploadSessionResponse;
        statusCode?: number;
      }>("/teachers/topics/upload-material/start", formData);

      if (response.success && response.data) {
        const sessionData = response.data as unknown as UploadSessionResponse;
        logger.info("[useStartMaterialUpload] Upload session started", {
          sessionId: sessionData.sessionId,
        });
        return sessionData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to start material upload",
        response.statusCode || 400,
        response
      );
    },
  });
}

/**
 * Hook to get material upload progress via polling
 * Uses GET /teachers/topics/material-upload-progress/:sessionId endpoint
 */
export function useMaterialUploadProgress(sessionId: string | null) {
  return useQuery<UploadProgressData, AuthenticatedApiError>({
    queryKey: ["teacher", "material-upload-progress", sessionId],
    queryFn: async (): Promise<UploadProgressData> => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await authenticatedApi.get<{
        success: boolean;
        message: string;
        data: UploadProgressData;
        statusCode?: number;
      }>(`/teachers/topics/material-upload-progress/${sessionId}`);

      if (response.success && response.data) {
        const progressData = response.data as unknown as UploadProgressData;
        return progressData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to get upload progress",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling if completed or error
      if (data?.stage === "completed" || data?.stage === "error") {
        logger.info("[useMaterialUploadProgress] Stopping polling", {
          stage: data.stage,
          progress: data.progress,
        });
        return false;
      }
      // Poll every 2 seconds while uploading/processing
      return 2000;
    },
    refetchIntervalInBackground: true,
    // Stop refetching when query is disabled or data is completed/error
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to track video upload progress using Server-Sent Events (SSE)
 * Uses GET /teachers/topics/upload-progress/:sessionId endpoint
 * Falls back to polling if SSE is not available
 */
export function useVideoUploadProgressSSE(
  sessionId: string | null,
  onProgress?: (progress: UploadProgressData) => void
) {
  const [progress, setProgress] = useState<UploadProgressData | null>(null);
  const [error, setError] = useState<AuthenticatedApiError | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    // Try to use SSE if available
    const setupSSE = async () => {
      try {
        // Get session token for SSE
        const session = await getSession();
        if (!session?.user?.accessToken) {
          throw new Error("No access token available");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!baseUrl) {
          throw new Error("Backend URL not configured");
        }

        // Create EventSource with token in query params (since SSE doesn't support custom headers)
        const sseUrl = `${baseUrl}/teachers/topics/upload-progress/${sessionId}?token=${session.user.accessToken}`;
        
        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as UploadProgressData;
            setProgress(data);
            setError(null);
            
            if (onProgress) {
              onProgress(data);
            }

            // Close connection when completed or error
            if (data.stage === "completed" || data.stage === "error") {
              eventSource.close();
              eventSourceRef.current = null;
            }
          } catch (err) {
            logger.error("[useVideoUploadProgressSSE] Error parsing SSE data", { err });
          }
        };

        eventSource.onerror = (err) => {
          logger.error("[useVideoUploadProgressSSE] SSE error", { err });
          eventSource.close();
          eventSourceRef.current = null;
          // Fallback to polling will be handled by the component
          setError(new AuthenticatedApiError("SSE connection failed", 500));
        };
      } catch (err) {
        logger.error("[useVideoUploadProgressSSE] Failed to setup SSE", { err });
        setError(
          err instanceof AuthenticatedApiError
            ? err
            : new AuthenticatedApiError("Failed to setup SSE connection", 500)
        );
      }
    };

    setupSSE();

    // Cleanup on unmount or sessionId change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [sessionId, onProgress]);

  return { progress, error };
}

