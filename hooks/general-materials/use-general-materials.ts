import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface GeneralMaterialsPlatform {
  id: string;
  name: string;
  slug: string;
  status: string;
  materialsCount: number;
}

export interface GeneralMaterialsOverviewStatistics {
  totalMaterials: number;
  aiEnabledMaterials: number;
  totalChapters: number;
}

export interface GeneralMaterialsByStatusStatistics {
  published: number;
  draft: number;
  archived: number;
}

export interface GeneralMaterialsStatistics {
  overview: GeneralMaterialsOverviewStatistics;
  byStatus: GeneralMaterialsByStatusStatistics;
}

export interface GeneralMaterialUploadedBy {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface GeneralMaterialDashboardItem {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  isAvailable: boolean;
  isAiEnabled: boolean;
  thumbnailUrl: string | null;
  thumbnailS3Key: string | null;
  status: string;
  views: number;
  downloads: number;
  chapterCount?: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy: GeneralMaterialUploadedBy;
}

export interface GeneralMaterialsDashboardResponse {
  platform: GeneralMaterialsPlatform;
  statistics: GeneralMaterialsStatistics;
  materials: GeneralMaterialDashboardItem[];
}

export interface GeneralMaterialClass {
  id: string;
  name: string;
}

export interface GeneralMaterialSubject {
  id: string;
  name: string;
  code: string;
}

export interface GeneralMaterialItem {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  isAvailable: boolean;
  isAiEnabled: boolean;
  status: string;
  views: number;
  downloads: number;
  thumbnailUrl: string | null;
  thumbnailS3Key: string | null;
  chapterCount?: number;
  createdAt: string;
  updatedAt: string;
  class: GeneralMaterialClass | null;
  subject: GeneralMaterialSubject | null;
  uploadedBy: GeneralMaterialUploadedBy;
}

export interface GeneralMaterialsListMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface GeneralMaterialsListResponse {
  items: GeneralMaterialItem[];
  meta: GeneralMaterialsListMeta;
}

export function useGeneralMaterialsDashboard() {
  return useQuery<GeneralMaterialsDashboardResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "general-materials", "dashboard"],
    queryFn: async () => {
      logger.info(
        "[useGeneralMaterialsDashboard] Fetching general materials dashboard..."
      );

      const response =
        await authenticatedApi.get<GeneralMaterialsDashboardResponse>(
          "/library/general-materials/dashboard"
        );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch general materials dashboard",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export interface GeneralMaterialsListParams {
  page?: number;
  limit?: number;
  search?: string;
  isAiEnabled?: boolean;
}

export function useGeneralMaterialsList(
  params?: GeneralMaterialsListParams
) {
  // Ensure page and limit are valid numbers >= 1
  const page = Math.max(1, params?.page || 1);
  const limit = Math.max(1, Math.min(100, params?.limit || 20)); // Also cap at 100
  const search = params?.search;
  const isAiEnabled = params?.isAiEnabled;

  return useQuery<GeneralMaterialsListResponse, AuthenticatedApiError>({
    queryKey: [
      "library-owner",
      "general-materials",
      "list",
      page,
      limit,
      search,
      isAiEnabled,
    ],
    queryFn: async () => {
      logger.info(
        "[useGeneralMaterialsList] Fetching general materials list...",
        { page, limit, search, isAiEnabled }
      );

      const queryParams = new URLSearchParams();
      // Always include page and limit (they have defaults but backend validates them)
      queryParams.append("page", String(page));
      queryParams.append("limit", String(limit));
      if (search && search.trim()) {
        queryParams.append("search", search.trim());
      }
      if (isAiEnabled !== undefined) {
        queryParams.append("isAiEnabled", String(isAiEnabled));
      }

      const queryString = queryParams.toString();
      const endpoint = `/library/general-materials/all${
        queryString ? `?${queryString}` : ""
      }`;

      const response =
        await authenticatedApi.get<GeneralMaterialsListResponse>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch general materials list",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


