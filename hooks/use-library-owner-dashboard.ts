import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types for Library Owner Dashboard
export interface Library {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  subjectsCount: number;
  topicsCount: number;
}

export interface VideoStatistics {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

export interface MaterialStatistics {
  total: number;
  published: number;
  draft: number;
  archived: number;
  byType: {
    PDF: number;
    DOC: number;
    PPT: number;
    VIDEO: number;
    NOTE: number;
    LINK: number;
    OTHER: number;
  };
}

export interface ContributorsStatistics {
  totalUniqueUploaders: number;
  videoUploaders: number;
  materialUploaders: number;
}

export interface DashboardVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  sizeBytes: number;
  status: string;
  order: number;
  subjectId: string;
  topicId: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  topic?: {
    id: string;
    title: string;
  };
}

export interface DashboardMaterial {
  id: string;
  title: string;
  description: string;
  materialType: string;
  url: string;
  sizeBytes: number;
  pageCount: number;
  status: string;
  order: number;
  subjectId: string;
  topicId: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  topic?: {
    id: string;
    title: string;
  };
}

export interface MyActivity {
  videosUploaded: number;
  materialsUploaded: number;
  recentVideos: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
  recentMaterials: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}

export interface LibraryOwnerDashboardResponse {
  library: Library;
  statistics: {
    videos: VideoStatistics;
    materials: MaterialStatistics;
    contributors: ContributorsStatistics;
  };
  content: {
    videos: DashboardVideo[];
    materials: DashboardMaterial[];
  };
  myActivity: MyActivity;
}

export function useLibraryOwnerDashboard() {
  return useQuery<LibraryOwnerDashboardResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "dashboard"],
    queryFn: async () => {
      logger.info("[useLibraryOwnerDashboard] Fetching dashboard data...");
      const response = await authenticatedApi.get<LibraryOwnerDashboardResponse>(
        "/library/dashboard"
      );

      if (response.success && response.data) {
        logger.info("[useLibraryOwnerDashboard] Dashboard data fetched successfully");
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch library owner dashboard",
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

