import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types for Resources By Class Response
export interface Platform {
  id: string;
  name: string;
  slug: string;
}

export interface Class {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedBy {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Material {
  id: string;
  title: string;
  description: string | null;
  materialType: string;
  url: string;
  s3Key: string;
  sizeBytes: number;
  pageCount: number | null;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: UploadedBy;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  s3Key: string;
  thumbnailUrl: string | null;
  thumbnailKey: string | null;
  durationSeconds: number | null;
  sizeBytes: number | null;
  views: number;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: UploadedBy;
}

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  materials: Material[];
  videos: Video[];
  materialsCount: number;
  videosCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string | null;
  thumbnailUrl: string | null;
  thumbnailKey: string | null;
  platformId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  topics: Topic[];
  topicsCount: number;
  totalMaterials: number;
  totalVideos: number;
}

export interface Statistics {
  totalSubjects: number;
  totalTopics: number;
  totalMaterials: number;
  totalVideos: number;
}

export interface ResourcesByClassResponse {
  platform: Platform;
  class: Class;
  subjects: Subject[];
  statistics: Statistics;
}

export interface ResourcesByClassApiResponse {
  success: boolean;
  message: string;
  data: ResourcesByClassResponse;
}

/**
 * Hook to fetch resources for a specific class
 * GET /api/v1/library/resources/getresourcesbyclass/:classId
 */
export function useLibraryResourcesByClass(classId: string | null) {
  return useQuery<ResourcesByClassResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "resources-by-class", classId],
    queryFn: async (): Promise<ResourcesByClassResponse> => {
      if (!classId) {
        throw new AuthenticatedApiError("Class ID is required", 400);
      }

      logger.info(
        `[useLibraryResourcesByClass] Fetching resources for class: ${classId}`
      );

      const response =
        await authenticatedApi.get<ResourcesByClassApiResponse>(
          `/library/resources/getresourcesbyclass/${classId}`
        );

      if (response.success && response.data) {
        const classData = response.data as unknown as ResourcesByClassResponse;
        return classData;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch class resources",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
