import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types for Class Resources
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
  uploadedBy: UploadedBy;
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
  uploadedBy: UploadedBy;
}

export interface Link {
  id: string;
  platformId: string;
  subjectId: string;
  chapterId: string | null;
  topicId: string;
  uploadedById: string;
  title: string;
  description: string;
  url: string;
  linkType: string | null;
  domain: string;
  thumbnailUrl: string | null;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  materials: Material[];
  videos: Video[];
  links?: Link[];
  materialsCount: number;
  videosCount: number;
  linksCount?: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  topics: Topic[];
  topicsCount: number;
  totalMaterials: number;
  totalVideos: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  platformId: string;
  classId: string;
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  chaptersCount: number;
  topicsCount: number;
  totalMaterials: number;
  totalVideos: number;
}

export interface ClassResourcesStatistics {
  totalSubjects: number;
  totalChapters: number;
  totalTopics: number;
  totalMaterials: number;
  totalVideos: number;
}

export interface ClassResourcesResponse {
  platform: Platform;
  class: Class;
  subjects: Subject[];
  statistics: ClassResourcesStatistics;
}

export interface ClassResourcesApiResponse {
  success: boolean;
  message: string;
  data: ClassResourcesResponse;
}

export function useLibraryClassResources(classId: string | null) {
  return useQuery<ClassResourcesResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "class-resources", classId],
    queryFn: async () => {
      if (!classId) {
        throw new AuthenticatedApiError("Class ID is required", 400);
      }

      const response = await authenticatedApi.get<ClassResourcesResponse>(
        `/library/resources/getresourcesbyclass/${classId}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch class resources",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh (within staleTime)
    refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
  });
}

