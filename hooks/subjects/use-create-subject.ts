import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface CreateSubjectRequest {
  classId: string;
  name: string;
  code?: string;
  color?: string;
  description?: string;
  thumbnail?: File;
}

export interface CreateSubjectResponse {
  id: string;
  platformId: string;
  classId: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  createdAt: string;
  updatedAt: string;
  class: {
    id: string;
    name: string;
    order: number;
  };
}

// Inner data type for the authenticated API response
export type CreateSubjectApiResponse = CreateSubjectResponse;

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation<CreateSubjectResponse, AuthenticatedApiError, CreateSubjectRequest>({
    mutationFn: async (data) => {
      logger.info("[useCreateSubject] Creating subject", {
        classId: data.classId,
        name: data.name,
        hasThumbnail: !!data.thumbnail,
      });

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("classId", data.classId);
      formData.append("name", data.name);
      
      if (data.code) {
        formData.append("code", data.code);
      }
      if (data.color) {
        formData.append("color", data.color);
      }
      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      const response = await authenticatedApi.post<CreateSubjectApiResponse>(
        "/library/subject/createsubject",
        formData
      );

      if (response.success && response.data) {
        logger.info("[useCreateSubject] Subject created successfully", {
          subjectId: response.data.id,
          name: response.data.name,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch class resources to show the new subject
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources", variables.classId],
      });
      // Also invalidate the resources dashboard
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "resources"],
      });
    },
  });
}

