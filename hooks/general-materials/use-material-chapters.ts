"use client";

import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface MaterialChapterFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  sizeBytes: number | null;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
}

export interface MaterialChapter {
  id: string;
  title: string;
  description: string | null;
  pageStart: number | null;
  pageEnd: number | null;
  order: number;
  isProcessed: boolean;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
  files: MaterialChapterFile[];
}

export interface MaterialChaptersApiResponse {
  success: boolean;
  message: string;
  data: MaterialChapter[];
}

export function useMaterialChapters(materialId: string | null) {
  return useQuery<MaterialChapter[], AuthenticatedApiError>({
    queryKey: ["library-owner", "general-materials", "chapters", materialId],
    queryFn: async () => {
      if (!materialId) {
        throw new AuthenticatedApiError("Material ID is required", 400);
      }

      logger.info("[useMaterialChapters] Fetching chapters for material", {
        materialId,
      });

      try {
        const response = await authenticatedApi.get<MaterialChaptersApiResponse>(
          `/library/general-materials/${materialId}/chapters`
        );

        if (response.success && response.data) {
          logger.info(
            "[useMaterialChapters] Chapters fetched successfully",
            {
              materialId,
              chaptersCount: response.data.length,
            }
          );
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to fetch material chapters",
          response.statusCode || 400,
          response
        );
      } catch (error) {
        logger.error("[useMaterialChapters] Error fetching chapters", {
          materialId,
          error,
        });
        throw error;
      }
    },
    enabled: !!materialId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

