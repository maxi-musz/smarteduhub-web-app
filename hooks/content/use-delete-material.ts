import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Inner data type for the authenticated API response
export interface DeleteMaterialApiResponse {
  id: string;
  title: string;
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation<DeleteMaterialApiResponse, AuthenticatedApiError, string>({
    mutationFn: async (materialId: string) => {
      logger.info("[useDeleteMaterial] Deleting material", { materialId });

      const response = await authenticatedApi.delete<DeleteMaterialApiResponse>(
        `/library/content/material/${materialId}`
      );

      if (response.success && response.data) {
        logger.info("[useDeleteMaterial] Material deleted successfully", {
          materialId: response.data.id,
          title: response.data.title,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to delete material",
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
      logger.info("[useDeleteMaterial] Cache invalidated");
    },
  });
}

