import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types for Resources Dashboard
export interface Platform {
  id: string;
  name: string;
  slug: string;
  status: string;
  videosCount: number;
  materialsCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  platformId: string;
  classId: string;
  createdAt: string;
  videosCount?: number;
  materialsCount?: number;
}

export interface Topic {
  id: string;
  title: string;
  platformId: string;
  subjectId: string;
  order: number;
  is_active: boolean;
  createdAt: string;
}

export interface LibraryClass {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  subjectsCount: number;
  videosCount: number;
  materialsCount: number;
  subjects: Subject[];
}

export interface Video {
  id: string;
  platformId: string;
  subjectId: string;
  topicId: string;
  uploadedById: string;
  title: string;
  description: string;
  videoUrl: string;
  videoS3Key: string;
  thumbnailUrl: string;
  thumbnailS3Key: string;
  durationSeconds: number;
  sizeBytes: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  platform: Platform;
  subject: Subject;
  topic: Topic;
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface Material {
  id: string;
  platformId: string;
  subjectId: string;
  topicId: string;
  uploadedById: string;
  title: string;
  description: string;
  materialType: string;
  url: string;
  s3Key: string;
  sizeBytes: number;
  pageCount: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  platform: Platform;
  subject: Subject;
  topic: Topic;
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface ResourcesStatistics {
  overview: {
    totalClasses: number;
    totalSubjects: number;
    totalTopics: number;
    totalVideos: number;
    totalMaterials: number;
  };
  videos: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    byPlatform: Record<string, number>;
  };
  materials: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    byType: Record<string, number>;
    byPlatform: Record<string, number>;
  };
  contributors: {
    totalUniqueUploaders: number;
    videoUploaders: number;
    materialUploaders: number;
  };
}

export interface ResourcesDashboardResponse {
  statistics: ResourcesStatistics;
  libraryClasses: LibraryClass[];
  resources: {
    videos: Video[];
    materials: Material[];
  };
  subjects: Subject[];
  topics: Topic[];
  platforms: Platform[];
}

export function useLibraryOwnerResources() {
  return useQuery<ResourcesDashboardResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "resources"],
    queryFn: async () => {
      logger.info(
        "[useLibraryOwnerResources] Fetching resources dashboard data..."
      );

      // authenticatedApi wraps responses in { success, message, data }
      // so we ask for the inner ResourcesDashboardResponse here
      const response =
        await authenticatedApi.get<ResourcesDashboardResponse>(
          "/library/resources/getresourcesdashboard"
        );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch resources dashboard",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh (within staleTime)
    refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
  });
}


