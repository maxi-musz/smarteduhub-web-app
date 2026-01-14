import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface CreateLinkRequest {
  topicId: string;
  subjectId: string;
  chapterId?: string;
  title: string;
  url: string;
  description?: string;
  linkType?: string;
}

export interface LinkData {
  id: string;
  platformId: string;
  subjectId: string;
  chapterId: string | null;
  topicId: string;
  uploadedById: string;
  title: string;
  description: string;
  url: string;
  linkType: string | null;
  domain: string;
  thumbnailUrl: string | null;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  topic: {
    id: string;
    title: string;
  };
  subject: {
    id: string;
    name: string;
  };
  chapter: {
    id: string;
    title: string;
  } | null;
}

// Inner data type for the authenticated API response
export type CreateLinkApiResponse = LinkData;

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation<CreateLinkApiResponse, AuthenticatedApiError, CreateLinkRequest>({
    mutationFn: async (data) => {
      logger.info("[useCreateLink] Creating link", {
        topicId: data.topicId,
        title: data.title,
        url: data.url,
      });

      const response = await authenticatedApi.post<CreateLinkApiResponse>(
        "/library/content/create-link",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateLink] Link created successfully", {
          linkId: response.data.id,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create link",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["topic-materials"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chapter-contents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "class-resources"],
      });
      logger.info("[useCreateLink] Cache invalidated", {
        topicId: variables.topicId,
        subjectId: variables.subjectId,
      });
    },
  });
}

