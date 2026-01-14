import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface UpdateSubjectRequest {
  subjectId: string;
  name?: string;
  code?: string;
  color?: string;
  description?: string;
}

export interface UpdateSubjectResponse {
  id: string;
  platformId: string;
  classId: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null;
  createdAt: string;
  updatedAt: string;
  class: {
    id: string;
    name: string;
    order: number;
  };
}

// Inner data type for the authenticated API response
export type UpdateSubjectApiResponse = UpdateSubjectResponse;

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation<UpdateSubjectResponse, AuthenticatedApiError, UpdateSubjectRequest>({
    mutationFn: async (data) => {
      logger.info("[useUpdateSubject] Updating subject", {
        subjectId: data.subjectId,
        fields: {
          name: data.name,
          code: data.code,
          color: data.color,
          description: data.description,
        },
      });

      const payload: Record<string, string> = {};
      if (data.name) payload.name = data.name;
      if (data.code) payload.code = data.code;
      if (data.color) payload.color = data.color;
      if (data.description !== undefined) payload.description = data.description;

      const response = await authenticatedApi.patch<UpdateSubjectApiResponse>(
        `/library/subject/updatesubject/${data.subjectId}`,
        payload
      );

      if (response.success && response.data) {
        logger.info("[useUpdateSubject] Subject updated successfully", {
          subjectId: response.data.id,
          name: response.data.name,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate and refetch class resources to show the updated subject
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources", data.classId],
      });
      // Also invalidate the resources dashboard
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "resources"],
      });
    },
  });
}

export interface UpdateSubjectThumbnailRequest {
  subjectId: string;
  thumbnail: File;
}

export function useUpdateSubjectThumbnail() {
  const queryClient = useQueryClient();

  return useMutation<UpdateSubjectResponse, AuthenticatedApiError, UpdateSubjectThumbnailRequest>({
    mutationFn: async (data) => {
      logger.info("[useUpdateSubjectThumbnail] Updating subject thumbnail", {
        subjectId: data.subjectId,
        fileName: data.thumbnail.name,
        fileSize: data.thumbnail.size,
      });

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("thumbnail", data.thumbnail);

      const response = await authenticatedApi.patch<UpdateSubjectApiResponse>(
        `/library/subject/updatesubjectthumbnail/${data.subjectId}`,
        formData
      );

      if (response.success && response.data) {
        logger.info("[useUpdateSubjectThumbnail] Subject thumbnail updated successfully", {
          subjectId: response.data.id,
          thumbnailUrl: response.data.thumbnailUrl,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update subject thumbnail",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate and refetch class resources to show the updated thumbnail
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources", data.classId],
      });
      // Also invalidate the resources dashboard
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "resources"],
      });
    },
  });
}

