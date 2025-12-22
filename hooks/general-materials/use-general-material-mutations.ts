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
  classId?: string;
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

export interface CreateAiBookApiResponse {
  success: boolean;
  message: string;
  data: AiBookMaterial;
}

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

export interface CreateAiBookChapterApiResponse {
  success: boolean;
  message: string;
  data: AiBookChapter;
}

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
        if (input.classId) formData.append("classId", input.classId);
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
          return response;
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
        return response;
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


