import { useQuery } from "@tanstack/react-query";
import { publicApi, PublicApiError } from "@/lib/api/public";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

// Types
export interface LibraryClass {
  id: string;
  name: string;
  order: number;
  subjectsCount: number;
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
}

export interface LibrarySubject {
  id: string;
  name: string;
  code: string;
  description: string | null;
  color: string;
  thumbnailUrl: string | null;
  thumbnailKey?: string | null;
  videosCount: number;
  topicsCount: number;
  createdAt: string;
  platform: Platform;
  class: LibraryClass | null;
}

export interface LibraryVideo {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  sizeBytes: number | null;
  views: number;
  order: number;
  status?: string; // "published"
  createdAt: string;
  updatedAt: string;
  uploadedBy?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  topic: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    chapter: {
      id: string;
      title: string;
      order: number;
    } | null;
  } | null;
  subject: LibrarySubject;
  platform: Platform;
}

export interface ExploreData {
  classes: LibraryClass[];
  subjects: LibrarySubject[];
  recentVideos: LibraryVideo[];
  statistics: {
    totalClasses: number;
    totalSubjects: number;
    totalVideos: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// New API Structure Types
export interface LibraryMaterial {
  id: string;
  title: string;
  description: string | null;
  url: string;
  s3Key: string | null;
  materialType: string; // "PDF", "DOC", "DOCX", "PPT", etc.
  sizeBytes: number | null;
  pageCount: number | null;
  status: string; // "published"
  order: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface LibraryAssessment {
  id: string;
  title: string;
  description: string | null;
  duration: number; // Duration in minutes
  passingScore: number; // Percentage (0-100)
  status: string; // "PUBLISHED" only
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSubmission {
  id: string; // Attempt ID
  assessmentId: string;
  assessmentTitle: string;
  attemptNumber: number;
  status: string; // "SUBMITTED", "GRADED", etc.
  dateTaken: string; // "Wed, Jan 15 2025" format
  totalQuestions: number;
  maxScore: number;
  userScore: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // Time in seconds
  passingScore: number; // Percentage threshold
}

export interface TopicStatistics {
  videosCount: number;
  materialsCount: number;
  assessmentsCount: number;
  totalViews: number;
  totalDuration: number; // seconds
  totalVideoSize: number; // bytes
  totalMaterialSize: number; // bytes
  totalSize: number; // bytes
  totalQuestions: number;
}

export interface LibraryTopic {
  id: string;
  title: string;
  description: string | null;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  videos: LibraryVideo[];
  materials: LibraryMaterial[];
  assessments: LibraryAssessment[];
  submissions: AssessmentSubmission[]; // User's assessment submissions (only if authenticated)
  statistics: TopicStatistics;
}

export interface LibraryChapter {
  id: string;
  title: string;
  description: string | null;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  topics: LibraryTopic[];
  statistics: TopicStatistics; // Aggregated from all topics
}

export interface SubjectStatistics {
  chaptersCount: number;
  topicsCount: number;
  videosCount: number;
  materialsCount: number;
  assessmentsCount: number;
  totalViews: number;
  totalDuration: number; // seconds
  totalSize: number; // bytes
  totalQuestions: number;
}

export interface SubjectResourcesResponse {
  subject: LibrarySubject;
  chapters: LibraryChapter[];
  statistics: SubjectStatistics;
}

// Legacy type for backward compatibility (old API structure)
export interface LibraryTopicLegacy {
  id: string;
  title: string;
  description: string | null;
  order: number;
  is_active: boolean;
  createdAt: string;
  chapter: {
    id: string;
    title: string;
    description: string | null;
    order: number;
  } | null;
  analytics: {
    videosCount: number;
    totalViews: number;
    totalDuration: number;
  };
  recentVideos: Array<{
    id: string;
    title: string;
    thumbnailUrl: string | null;
    durationSeconds: number;
    views: number;
    createdAt: string;
  }>;
}

export interface TopicsResponse {
  subject: LibrarySubject;
  topics: LibraryTopicLegacy[];
}

// Main Explore Page Hook
export function useExplore() {
  return useQuery<ExploreData, PublicApiError>({
    queryKey: ["explore", "main"],
    queryFn: async () => {
      const response = await publicApi.get<ExploreData>("/explore");

      if (response.success && response.data) {
        return response.data;
      }

      throw new PublicApiError(
        response.message || "Failed to fetch explore data",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Filtered & Paginated Subjects Hook
export interface SubjectsParams {
  classId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useExploreSubjects(params?: SubjectsParams) {
  return useQuery<PaginatedResponse<LibrarySubject>, PublicApiError>({
    queryKey: ["explore", "subjects", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params?.classId) {
        searchParams.append("classId", params.classId);
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.page) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.limit) {
        searchParams.append("limit", params.limit.toString());
      }

      const queryString = searchParams.toString();
      const endpoint = `/explore/subjects${queryString ? `?${queryString}` : ""}`;

      const response = await publicApi.get<PaginatedResponse<LibrarySubject>>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new PublicApiError(
        response.message || "Failed to fetch subjects",
        response.statusCode || 400,
        response
      );
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Filtered & Paginated Videos Hook
export interface VideosParams {
  classId?: string;
  subjectId?: string;
  topicId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useExploreVideos(params?: VideosParams) {
  return useQuery<PaginatedResponse<LibraryVideo>, PublicApiError>({
    queryKey: ["explore", "videos", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params?.classId) {
        searchParams.append("classId", params.classId);
      }
      if (params?.subjectId) {
        searchParams.append("subjectId", params.subjectId);
      }
      if (params?.topicId) {
        searchParams.append("topicId", params.topicId);
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.page) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.limit) {
        searchParams.append("limit", params.limit.toString());
      }

      const queryString = searchParams.toString();
      const endpoint = `/explore/videos${queryString ? `?${queryString}` : ""}`;

      const response = await publicApi.get<PaginatedResponse<LibraryVideo>>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new PublicApiError(
        response.message || "Failed to fetch videos",
        response.statusCode || 400,
        response
      );
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Subject Resources Hook (New API - returns chapters, topics, and all resources)
// Uses authenticated API if available to include user submissions
export function useExploreTopics(subjectId: string | null) {
  return useQuery<SubjectResourcesResponse, PublicApiError | AuthenticatedApiError>({
    queryKey: ["explore", "topics", subjectId],
    queryFn: async () => {
      if (!subjectId) {
        throw new PublicApiError("Subject ID is required", 400);
      }

      // Try authenticated API first (includes submissions if user is logged in)
      // Falls back to public API only if 401 (unauthorized)
      try {
        const { authenticatedApi } = await import("@/lib/api/authenticated");
        const response = await authenticatedApi.get<SubjectResourcesResponse>(
          `/explore/topics/${subjectId}`
        );

        if (response.success && response.data) {
          return response.data;
        }
      } catch (error) {
        // Only fall back to public API if it's a 401 (unauthorized)
        // This means user is not logged in, so use public API
        if (error instanceof AuthenticatedApiError && error.statusCode === 401) {
          // User not authenticated, use public API (no submissions will be included)
          const response = await publicApi.get<SubjectResourcesResponse>(
            `/explore/topics/${subjectId}`
          );

          if (response.success && response.data) {
            return response.data;
          }
        } else {
          // Re-throw other errors (network errors, etc.)
          throw error;
        }
      }

      // Fallback to public API if authenticated API didn't return data
      const response = await publicApi.get<SubjectResourcesResponse>(
        `/explore/topics/${subjectId}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new PublicApiError(
        response.message || "Failed to fetch subject resources",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

