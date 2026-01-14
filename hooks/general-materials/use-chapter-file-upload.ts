import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

export interface ChapterFileUploadRequest {
  materialId: string;
  chapterId: string;
  file: File;
  title?: string;
  description?: string;
  fileType?: string;
  order?: number;
}

export interface ChapterFileUploadResponse {
  id: string;
  chapterId: string;
  platformId: string;
  uploadedById: string;
  fileName: string;
  fileType: string;
  url: string;
  s3Key: string | null;
  sizeBytes: number | null;
  pageCount: number | null;
  title: string | null;
  description: string | null;
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

// Inner data type for the authenticated API response
export type ChapterFileUploadApiResponse = ChapterFileUploadResponse;

export function useChapterFileUpload() {
  const queryClient = useQueryClient();

  return useMutation<
    ChapterFileUploadApiResponse,
    AuthenticatedApiError,
    ChapterFileUploadRequest
  >({
    mutationFn: async (input: ChapterFileUploadRequest) => {
      logger.info("[useChapterFileUpload] Uploading file to chapter", {
        materialId: input.materialId,
        chapterId: input.chapterId,
        fileName: input.file.name,
        fileSize: input.file.size,
      });

      const formData = new FormData();
      formData.append("file", input.file);
      if (input.title) formData.append("title", input.title);
      if (input.description) formData.append("description", input.description);
      if (input.fileType) formData.append("fileType", input.fileType);
      if (input.order !== undefined) {
        formData.append("order", String(input.order));
      }

      const response = await authenticatedApi.post<ChapterFileUploadApiResponse>(
        `/library/general-materials/${input.materialId}/chapters/${input.chapterId}/files`,
        formData
      );

      if (response.success && response.data) {
        logger.info("[useChapterFileUpload] File uploaded successfully", {
          fileId: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to upload chapter file",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate the material detail query to refresh chapter files
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "detail", variables.materialId],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "general-materials", "dashboard"],
      });
      toast.success("Chapter file uploaded successfully");
    },
    onError: (error) => {
      logger.error("[useChapterFileUpload] Upload failed", { error });
      toast.error(error.message || "Failed to upload chapter file");
    },
  });
}

