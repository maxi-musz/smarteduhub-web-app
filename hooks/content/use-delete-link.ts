import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Inner data type for the authenticated API response
export interface DeleteLinkApiResponse {
  id: string;
  title: string;
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation<DeleteLinkApiResponse, AuthenticatedApiError, string>({
    mutationFn: async (linkId: string) => {
      logger.info("[useDeleteLink] Deleting link", { linkId });

      const response = await authenticatedApi.delete<DeleteLinkApiResponse>(
        `/library/content/link/${linkId}`
      );

      if (response.success && response.data) {
        logger.info("[useDeleteLink] Link deleted successfully", {
          linkId: response.data.id,
          title: response.data.title,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete link",
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
        queryKey: ["library-owner", "topic-materials"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useDeleteLink] Cache invalidated");
    },
  });
}

