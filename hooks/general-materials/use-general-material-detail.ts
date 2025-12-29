import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { getMockBookById } from "@/data/mock-data-general-books";

export interface GeneralMaterialChapterFile {
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

export interface GeneralMaterialChapter {
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
  files: GeneralMaterialChapterFile[];
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

export interface GeneralMaterialUploadedBy {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface GeneralMaterialDetail {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  isbn: string | null;
  publisher: string | null;
  materialType: string;
  url: string;
  s3Key: string;
  sizeBytes: number | null;
  pageCount: number | null;
  thumbnailUrl: string | null;
  thumbnailS3Key: string | null;
  isAvailable: boolean;
  isAiEnabled: boolean;
  status: string;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  class: GeneralMaterialClass | null;
  subject: GeneralMaterialSubject | null;
  uploadedBy: GeneralMaterialUploadedBy;
  chapters: GeneralMaterialChapter[];
}

export interface GeneralMaterialDetailResponse {
  material: GeneralMaterialDetail;
  chapters: GeneralMaterialChapter[];
}

export interface GeneralMaterialDetailApiResponse {
  success: boolean;
  message: string;
  data: GeneralMaterialDetail;
}

export function useGeneralMaterialDetail(materialId: string | null) {
  return useQuery<GeneralMaterialDetailResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "general-materials", "detail", materialId],
    queryFn: async () => {
      if (!materialId) {
        throw new AuthenticatedApiError("Material ID is required", 400);
      }

      logger.info(
        "[useGeneralMaterialDetail] Fetching general material detail...",
        { materialId }
      );

      // Check if we have mock data
      const mockBook = getMockBookById(materialId);
      if (mockBook) {
        logger.info(
          "[useGeneralMaterialDetail] Using mock data for material",
          { materialId }
        );
        return {
          material: {
            id: mockBook.id,
            title: mockBook.title,
            description: mockBook.description,
            author: mockBook.author,
            isbn: mockBook.isbn,
            publisher: mockBook.publisher,
            materialType: mockBook.materialType,
            url: mockBook.url,
            s3Key: mockBook.s3Key,
            sizeBytes: null,
            pageCount: mockBook.pageCount,
            thumbnailUrl: mockBook.thumbnailUrl,
            thumbnailS3Key: mockBook.thumbnailS3Key,
            isAvailable: mockBook.isAvailable,
            isAiEnabled: mockBook.isAiEnabled,
            status: mockBook.status,
            views: mockBook.views,
            downloads: mockBook.downloads,
            createdAt: mockBook.createdAt,
            updatedAt: mockBook.updatedAt,
            class: mockBook.classId
              ? { id: mockBook.classId, name: "SSS 1" }
              : null,
            subject: mockBook.subjectId
              ? { id: mockBook.subjectId, name: "Mathematics", code: "MATH" }
              : null,
            uploadedBy: {
              id: mockBook.uploadedById,
              email: "uploader@example.com",
              first_name: "John",
              last_name: "Doe",
            },
            chapters: mockBook.chapters.map((ch) => ({
              id: ch.id,
              title: ch.title,
              description: ch.description,
              pageStart: ch.pageStart,
              pageEnd: ch.pageEnd,
              order: ch.order,
              isProcessed: false,
              chunkCount: 0,
              createdAt: ch.createdAt,
              updatedAt: ch.updatedAt,
              files: [],
            })),
          },
          chapters: mockBook.chapters.map((ch) => ({
            id: ch.id,
            title: ch.title,
            description: ch.description,
            pageStart: ch.pageStart,
            pageEnd: ch.pageEnd,
            order: ch.order,
            isProcessed: false,
            chunkCount: 0,
            createdAt: ch.createdAt,
            updatedAt: ch.updatedAt,
            files: [],
          })),
        };
      }

      // Try to fetch from API - single endpoint returns material with chapters
      try {
        const response = await authenticatedApi.get<GeneralMaterialDetail>(
          `/library/general-materials/${materialId}`
        );

        if (response.success && response.data) {
          return {
            material: response.data,
            chapters: response.data.chapters || [],
          };
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to fetch general material detail",
          response.statusCode || 400,
          response
        );
      } catch (error) {
        // If API fails and we have mock data, use it
        const fallbackMockBook = getMockBookById(materialId);
        if (fallbackMockBook) {
          logger.info(
            "[useGeneralMaterialDetail] API failed, using mock data",
            { materialId }
          );
          return {
            material: {
              id: fallbackMockBook.id,
              title: fallbackMockBook.title,
              description: fallbackMockBook.description,
              author: fallbackMockBook.author,
              isbn: fallbackMockBook.isbn,
              publisher: fallbackMockBook.publisher,
              materialType: fallbackMockBook.materialType,
              url: fallbackMockBook.url,
              s3Key: fallbackMockBook.s3Key,
              sizeBytes: null,
              pageCount: fallbackMockBook.pageCount,
              thumbnailUrl: fallbackMockBook.thumbnailUrl,
              thumbnailS3Key: fallbackMockBook.thumbnailS3Key,
              isAvailable: fallbackMockBook.isAvailable,
              isAiEnabled: fallbackMockBook.isAiEnabled,
              status: fallbackMockBook.status,
              views: fallbackMockBook.views,
              downloads: fallbackMockBook.downloads,
              createdAt: fallbackMockBook.createdAt,
              updatedAt: fallbackMockBook.updatedAt,
              class: fallbackMockBook.classId
                ? { id: fallbackMockBook.classId, name: "SSS 1" }
                : null,
              subject: fallbackMockBook.subjectId
                ? { id: fallbackMockBook.subjectId, name: "Mathematics", code: "MATH" }
                : null,
              uploadedBy: {
                id: fallbackMockBook.uploadedById,
                email: "uploader@example.com",
                first_name: "John",
                last_name: "Doe",
              },
              chapters: fallbackMockBook.chapters.map((ch) => ({
                id: ch.id,
                title: ch.title,
                description: ch.description,
                pageStart: ch.pageStart,
                pageEnd: ch.pageEnd,
                order: ch.order,
                isProcessed: false,
                chunkCount: 0,
                createdAt: ch.createdAt,
                updatedAt: ch.updatedAt,
                files: [],
              })),
            },
            chapters: fallbackMockBook.chapters.map((ch) => ({
              id: ch.id,
              title: ch.title,
              description: ch.description,
              pageStart: ch.pageStart,
              pageEnd: ch.pageEnd,
              order: ch.order,
              isProcessed: false,
              chunkCount: 0,
              createdAt: ch.createdAt,
              updatedAt: ch.updatedAt,
              files: [],
            })),
          };
        }
        throw error;
      }
    },
    enabled: !!materialId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

