import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Inner data type for the authenticated API response
export interface DeleteAssignmentApiResponse {
  id: string;
  title: string;
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation<DeleteAssignmentApiResponse, AuthenticatedApiError, string>({
    mutationFn: async (assignmentId: string) => {
      logger.info("[useDeleteAssignment] Deleting assignment", { assignmentId });

      const response = await authenticatedApi.delete<DeleteAssignmentApiResponse>(
        `/library/content/assignment/${assignmentId}`
      );

      if (response.success && response.data) {
        logger.info("[useDeleteAssignment] Assignment deleted successfully", {
          assignmentId: response.data.id,
          title: response.data.title,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete assignment",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh content
      queryClient.invalidateQueries({
        queryKey: ["topic-materials"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chapter-contents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useDeleteAssignment] Cache invalidated");
    },
  });
}

