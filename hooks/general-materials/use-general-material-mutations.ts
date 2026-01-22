import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface CreateAiBookRequest {
  file: File;
  thumbnail: File;
  title: string;
  description?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  classIds?: string[];
  subjectId?: string;
  isAiEnabled?: boolean;
}

export interface AiBookMaterial {
  id: string;
  platformId: string;
  uploadedById: string;
  title: string;
  description: string | null;
  author: string | null;
  isbn: string | null;
  publisher: string | null;
  materialType: string;
  url: string;
  s3Key: string;
  pageCount: number | null;
  thumbnailUrl: string | null;
  thumbnailS3Key: string | null;
  isAvailable: boolean;
  classId: string | null;
  subjectId: string | null;
  isAiEnabled: boolean;
  status: string;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

// Inner data type for the authenticated API response
export type CreateAiBookApiResponse = AiBookMaterial;

export interface CreateAiBookChapterRequest {
  materialId: string;
  title: string;
  description?: string;
  pageStart?: number;
  pageEnd?: number;
}

export interface AiBookChapter {
  id: string;
  materialId: string;
  platformId: string;
  title: string;
  description: string | null;
  pageStart: number | null;
  pageEnd: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Inner data type for the authenticated API response
export type CreateAiBookChapterApiResponse = AiBookChapter;

export function useCreateAiBook() {
  const queryClient = useQueryClient();

  return useMutation<CreateAiBookApiResponse, AuthenticatedApiError, CreateAiBookRequest>(
    {
      mutationFn: async (input: CreateAiBookRequest) => {
        logger.info("[useCreateAiBook] Creating AI Book (single-step upload)", {
          title: input.title,
          fileSize: input.file.size,
        });

        const formData = new FormData();
        formData.append("file", input.file);
        formData.append("thumbnail", input.thumbnail);
        formData.append("title", input.title);
        if (input.description) formData.append("description", input.description);
        if (input.author) formData.append("author", input.author);
        if (input.isbn) formData.append("isbn", input.isbn);
        if (input.publisher) formData.append("publisher", input.publisher);
        if (input.classIds && input.classIds.length > 0) {
          input.classIds.forEach((classId) => {
            formData.append("classIds[]", classId);
          });
        }
        if (input.subjectId) formData.append("subjectId", input.subjectId);
        if (typeof input.isAiEnabled === "boolean") {
          formData.append("isAiEnabled", String(input.isAiEnabled));
        }

        const response =
          await authenticatedApi.post<CreateAiBookApiResponse>(
            "/library/general-materials",
            formData
          );

        if (response.success && response.data) {
          logger.info("[useCreateAiBook] AI Book created successfully", {
            materialId: response.data.id,
          });
          return response.data;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to create AI Book",
          response.statusCode || 400,
          response
        );
      },
      onSuccess: () => {
        // Refresh dashboard and list for AI Books
        queryClient.invalidateQueries({
          queryKey: ["library-owner", "general-materials", "dashboard"],
        });
        queryClient.invalidateQueries({
          queryKey: ["library-owner", "general-materials", "list"],
        });
      },
    }
  );
}

export function useCreateAiBookChapter() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateAiBookChapterApiResponse,
    AuthenticatedApiError,
    CreateAiBookChapterRequest
  >({
    mutationFn: async (input: CreateAiBookChapterRequest) => {
      logger.info("[useCreateAiBookChapter] Creating AI Book chapter", {
        materialId: input.materialId,
        title: input.title,
      });

      const { materialId, ...body } = input;

      const response =
        await authenticatedApi.post<CreateAiBookChapterApiResponse>(
          `/library/general-materials/${materialId}/chapters`,
          body
        );

      if (response.success && response.data) {
        logger.info("[useCreateAiBookChapter] Chapter created successfully", {
          chapterId: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create AI Book chapter",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate AI Books list and dashboard so any material-level chapter counts can update
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "dashboard"],
      });
      // Optionally, we could invalidate a material-specific query if added later
      logger.info("[useCreateAiBookChapter] Cache invalidated", {
        materialId: variables.materialId,
      });
    },
  });
}

export interface CreateChapterWithFileRequest {
  materialId: string;
  file: File;
  title: string;
  description?: string;
  pageStart?: number;
  pageEnd?: number;
  isAiEnabled?: boolean;
  fileTitle?: string;
  fileDescription?: string;
  fileType?: string;
  fileOrder?: number;
  enableAiChat?: boolean;
}

export interface ChapterFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  sizeBytes: number;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
}

export interface ChapterWithFileResponse {
  id: string;
  materialId: string;
  platformId: string;
  title: string;
  description: string | null;
  pageStart: number | null;
  pageEnd: number | null;
  order: number;
  isAiEnabled: boolean;
  isProcessed: boolean;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
  files: ChapterFile[];
}

// Inner data type for the authenticated API response
export type CreateChapterWithFileApiResponse = ChapterWithFileResponse;

export function useCreateChapterWithFile() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateChapterWithFileApiResponse,
    AuthenticatedApiError,
    CreateChapterWithFileRequest
  >({
    mutationFn: async (input: CreateChapterWithFileRequest) => {
      logger.info("[useCreateChapterWithFile] Creating chapter with file", {
        materialId: input.materialId,
        title: input.title,
        fileName: input.file.name,
        fileSize: input.file.size,
      });

      const formData = new FormData();
      formData.append("file", input.file);
      formData.append("title", input.title);
      if (input.description) formData.append("description", input.description);
      if (input.pageStart !== undefined) {
        formData.append("pageStart", String(input.pageStart));
      }
      if (input.pageEnd !== undefined) {
        formData.append("pageEnd", String(input.pageEnd));
      }
      if (typeof input.isAiEnabled === "boolean") {
        formData.append("isAiEnabled", String(input.isAiEnabled));
      }
      if (input.fileTitle) formData.append("fileTitle", input.fileTitle);
      if (input.fileDescription) formData.append("fileDescription", input.fileDescription);
      if (input.fileType) formData.append("fileType", input.fileType);
      if (input.fileOrder !== undefined) {
        formData.append("fileOrder", String(input.fileOrder));
      }
      if (typeof input.enableAiChat === "boolean") {
        formData.append("enableAiChat", String(input.enableAiChat));
      }

      const response =
        await authenticatedApi.post<CreateChapterWithFileApiResponse>(
          `/library/general-materials/${input.materialId}/chapters/with-file`,
          formData
        );

      if (response.success && response.data) {
        logger.info("[useCreateChapterWithFile] Chapter with file created successfully", {
          chapterId: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create chapter with file",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate material detail to refresh chapters
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "detail", variables.materialId],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "dashboard"],
      });
      logger.info("[useCreateChapterWithFile] Cache invalidated", {
        materialId: variables.materialId,
      });
    },
  });
}

export interface RetryProcessingResponse {
  materialId: string;
  status: "COMPLETED" | "FAILED" | "PROCESSING";
  totalChunks: number;
  processedChunks: number;
  failedChunks: number;
  errorMessage: string | null;
  embeddingModel: string | null;
  processingTime: number;
  createdAt: string;
  updatedAt: string;
}

// Inner data type for the authenticated API response
export type RetryProcessingApiResponse = RetryProcessingResponse;

export function useRetryProcessing() {
  const queryClient = useQueryClient();

  return useMutation<
    RetryProcessingApiResponse,
    AuthenticatedApiError,
    { chapterId: string }
  >({
    mutationFn: async ({ chapterId }) => {
      logger.info("[useRetryProcessing] Retrying AI processing", {
        chapterId,
        endpoint: `/library/general-materials/${chapterId}/retry-processing`,
      });

      const endpoint = `/library/general-materials/${chapterId}/retry-processing`;
      console.log("[useRetryProcessing] Calling endpoint:", endpoint, "for chapterId:", chapterId);

      const response =
        await authenticatedApi.post<RetryProcessingApiResponse>(
          endpoint
        );

      if (response.success && response.data) {
        logger.info("[useRetryProcessing] Processing retry completed", {
          chapterId,
          status: response.data.status,
          processingTime: response.data.processingTime,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to retry processing",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate all chapters queries to refresh processing status
      // Since we don't have materialId, we invalidate all chapter queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "chapters"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "dashboard"],
      });
      logger.info("[useRetryProcessing] Cache invalidated", {
        chapterId: variables.chapterId,
        status: data.status,
      });
    },
  });
}


