import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface LibraryClass {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function useLibraryClasses() {
  return useQuery<LibraryClass[], AuthenticatedApiError>({
    queryKey: ["library-owner", "general-materials", "classes"],
    queryFn: async () => {
      logger.info("[useLibraryClasses] Fetching library classes...");

      const response = await authenticatedApi.get<LibraryClass[]>(
        "/library/general-materials/classes"
      );

      if (response.success && response.data) {
        // Sort by order field (ascending)
        const sortedClasses = [...response.data].sort(
          (a, b) => a.order - b.order
        );
        logger.info("[useLibraryClasses] Library classes fetched successfully", {
          count: sortedClasses.length,
        });
        return sortedClasses;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch library classes",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
