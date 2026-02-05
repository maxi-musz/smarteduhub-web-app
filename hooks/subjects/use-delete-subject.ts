import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface DeleteSubjectResponse {
  id: string;
  name: string;
  deletedContent: {
    topics: number;
    videos: number;
    materials: number;
    assignments: number;
    assessments: number;
    links: number;
    comments: number;
    generalMaterials: number;
    storageFiles: number;
    hlsFolders: number;
  };
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation<DeleteSubjectResponse, AuthenticatedApiError, string>({
    mutationFn: async (subjectId: string) => {
      logger.info("[useDeleteSubject] Deleting subject", { subjectId });

      const response = await authenticatedApi.delete<DeleteSubjectResponse>(
        `/library/subject/deletesubject/${subjectId}`
      );

      if (response.success && response.data) {
        logger.info("[useDeleteSubject] Subject deleted successfully", {
          subjectId: response.data.id,
          name: response.data.name,
          deletedContent: response.data.deletedContent,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "resources"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "subjects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
    },
  });
}
