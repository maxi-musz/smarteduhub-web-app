import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import {
  CBT,
  CreateCBTRequest,
  UpdateCBTRequest,
  CBTResponse,
  CBTListResponse,
} from "./use-cbt-types";
import { toast } from "sonner";

// Get all CBTs for a subject (optionally filtered by topicId)
export function useCBTs(subjectId: string | null, topicId?: string | null) {
  return useQuery<CBT[], AuthenticatedApiError>({
    queryKey: ["cbt", "list", subjectId, topicId ?? "all"],
    queryFn: async () => {
      if (!subjectId) {
        throw new AuthenticatedApiError("Subject ID is required", 400);
      }

      // Build query string with subjectId and optional topicId
      const queryParams = new URLSearchParams();
      queryParams.append("subjectId", subjectId);
      if (topicId && topicId !== "general" && topicId !== null) {
        queryParams.append("topicId", topicId);
      }

      const response = await authenticatedApi.get<{ assessments: CBT[]; totalCount: number }>(
        `/library/assessment/cbt?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        // Backend returns { assessments: CBT[], totalCount: number }
        // Check if data has 'assessments' property (new format) or is directly an array (old format)
        let assessments: CBT[];
        if (response.data && typeof response.data === 'object' && 'assessments' in response.data) {
          assessments = (response.data as { assessments: CBT[]; totalCount: number }).assessments;
        } else if (Array.isArray(response.data)) {
          // Fallback for old format (direct array)
          assessments = response.data;
        } else {
          assessments = [];
        }
        
        const cbts = Array.isArray(assessments) ? assessments : [];
        logger.info("[useCBTs] Retrieved assessments", {
          count: cbts.length,
          subjectId,
          topicId: topicId || "all",
        });
        return cbts;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch CBTs",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2, // Retry 2 times (3 total attempts: 1 initial + 2 retries)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Get single CBT by ID
export function useCBT(cbtId: string | null) {
  return useQuery<CBT, AuthenticatedApiError>({
    queryKey: ["cbt", cbtId],
    queryFn: async () => {
      if (!cbtId) {
        throw new AuthenticatedApiError("CBT ID is required", 400);
      }

      const response = await authenticatedApi.get<CBT>(
        `/library/assessment/cbt/${cbtId}`
      );

      if (response.success && response.data) {
        logger.info("[useCBT] Retrieved CBT", {
          cbtId,
          title: response.data.title,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch CBT",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!cbtId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2, // Retry 2 times (3 total attempts: 1 initial + 2 retries)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Create CBT
export function useCreateCBT() {
  const queryClient = useQueryClient();

  return useMutation<CBT, AuthenticatedApiError, CreateCBTRequest>({
    mutationFn: async (data) => {
      const response = await authenticatedApi.post<CBT>(
        "/library/assessment/cbt",
        data
      );

      if (response.success && response.data) {
        logger.info("[useCreateCBT] Created CBT", {
          cbtId: response.data.id,
          title: response.data.title,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create CBT",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate and refetch CBTs list
      queryClient.invalidateQueries({ queryKey: ["cbt", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cbt", data.id] });
      toast.success("CBT created successfully");
    },
    onError: (error) => {
      logger.error("[useCreateCBT] Failed to create CBT", { error: error.message });
      toast.error(error.message || "Failed to create CBT");
    },
  });
}

// Update CBT
export function useUpdateCBT() {
  const queryClient = useQueryClient();

  return useMutation<
    CBT,
    AuthenticatedApiError,
    { id: string; data: UpdateCBTRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await authenticatedApi.patch<CBT>(
        `/library/assessment/cbt/${id}`,
        data
      );

      if (response.success && response.data) {
        logger.info("[useUpdateCBT] Updated CBT", {
          cbtId: id,
          title: response.data.title,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update CBT",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cbt", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cbt", data.id] });
      queryClient.setQueryData(["cbt", data.id], data);
      toast.success("CBT updated successfully");
    },
    onError: (error) => {
      logger.error("[useUpdateCBT] Failed to update CBT", { error: error.message });
      toast.error(error.message || "Failed to update CBT");
    },
  });
}

// Delete CBT
export function useDeleteCBT() {
  const queryClient = useQueryClient();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.delete(
        `/library/assessment/cbt/${id}`
      );

      if (!response.success) {
        throw new AuthenticatedApiError(
          response.message || "Failed to delete CBT",
          response.statusCode || 400,
          response
        );
      }

      logger.info("[useDeleteCBT] Deleted CBT", { cbtId: id });
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cbt", "list"] });
      queryClient.removeQueries({ queryKey: ["cbt", id] });
      toast.success("CBT deleted successfully");
    },
    onError: (error) => {
      logger.error("[useDeleteCBT] Failed to delete CBT", { error: error.message });
      toast.error(error.message || "Failed to delete CBT");
    },
  });
}

// Publish CBT
export function usePublishCBT() {
  const queryClient = useQueryClient();

  return useMutation<CBT, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.post<CBT>(
        `/library/assessment/cbt/${id}/publish`
      );

      if (response.success && response.data) {
        logger.info("[usePublishCBT] Published CBT", { cbtId: id });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to publish CBT",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cbt", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cbt", data.id] });
      queryClient.setQueryData(["cbt", data.id], data);
      toast.success("CBT published successfully");
    },
    onError: (error) => {
      logger.error("[usePublishCBT] Failed to publish CBT", { error: error.message });
      toast.error(error.message || "Failed to publish CBT");
    },
  });
}

// Unpublish CBT
export function useUnpublishCBT() {
  const queryClient = useQueryClient();

  return useMutation<CBT, AuthenticatedApiError, string>({
    mutationFn: async (id) => {
      const response = await authenticatedApi.post<CBT>(
        `/library/assessment/cbt/${id}/unpublish`
      );

      if (response.success && response.data) {
        logger.info("[useUnpublishCBT] Unpublished CBT", { cbtId: id });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to unpublish CBT",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cbt", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cbt", data.id] });
      queryClient.setQueryData(["cbt", data.id], data);
      toast.success("CBT unpublished successfully");
    },
    onError: (error) => {
      logger.error("[useUnpublishCBT] Failed to unpublish CBT", { error: error.message });
      toast.error(error.message || "Failed to unpublish CBT");
    },
  });
}

