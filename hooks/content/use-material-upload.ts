import { useState, useCallback, useEffect, useRef } from "react";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface MaterialUploadRequest {
  topicId: string;
  subjectId: string;
  title: string;
  description?: string;
  material: File;
}

export interface UploadSessionResponse {
  sessionId: string;
  progressEndpoint: string;
}

export interface UploadProgress {
  sessionId: string;
  progress: number;
  stage: "validating" | "uploading" | "processing" | "saving" | "completed" | "error";
  message: string;
  bytesUploaded: number;
  totalBytes: number;
  estimatedTimeRemaining: number | null;
  error: string | null;
  materialId: string | null;
}

export interface MaterialUploadApiResponse {
  success: boolean;
  message: string;
  data: UploadSessionResponse;
}

export interface ProgressApiResponse {
  success: boolean;
  message: string;
  data: UploadProgress;
}

export function useMaterialUpload() {
  const queryClient = useQueryClient();
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    sessionId: string | null;
    progress: UploadProgress | null;
    error: string | null;
  }>({
    isUploading: false,
    sessionId: null,
    progress: null,
    error: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const startPolling = useCallback((sessionId: string) => {
    const poll = async () => {
      try {
        const response = await authenticatedApi.get<UploadProgress>(
          `/library/content/upload-progress/${sessionId}/poll`
        );

        if (response.success && response.data) {
          const progressData = response.data;
          setUploadState((prev) => ({
            ...prev,
            progress: progressData,
          }));

          if (
            progressData.stage === "completed" ||
            progressData.stage === "error"
          ) {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            setUploadState((prev) => ({
              ...prev,
              isUploading: false,
            }));

            if (progressData.stage === "completed") {
              toast.success("Material uploaded successfully");
              // Invalidate queries to refresh content
              queryClient.invalidateQueries({
                queryKey: ["topic-materials"],
              });
              queryClient.invalidateQueries({
                queryKey: ["chapter-contents"],
              });
              queryClient.invalidateQueries({
                queryKey: ["library-owner", "class-resources"],
              });
            } else if (progressData.error) {
              toast.error(progressData.error);
            }
          }
        }
      } catch (error) {
        logger.error("[useMaterialUpload] Error polling progress", { error });
      }
    };

    poll();
    pollingIntervalRef.current = setInterval(poll, 2000);
  }, []);

  const trackProgress = useCallback((sessionId: string) => {
    // Use polling since EventSource doesn't support custom headers for auth
    logger.info("[useMaterialUpload] Starting progress tracking via polling", {
      sessionId,
    });
    startPolling(sessionId);
  }, [startPolling]);

  const startUpload = useCallback(async (data: MaterialUploadRequest) => {
    try {
      setUploadState({
        isUploading: true,
        sessionId: null,
        progress: null,
        error: null,
      });

      logger.info("[useMaterialUpload] Starting material upload", {
        topicId: data.topicId,
        title: data.title,
        materialSize: data.material.size,
      });

      // Create FormData
      const formData = new FormData();
      formData.append("topicId", data.topicId);
      formData.append("subjectId", data.subjectId);
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("material", data.material);

      const response = await authenticatedApi.post<UploadSessionResponse>(
        "/library/content/upload-material/start",
        formData
      );

      if (response.success && response.data) {
        const sessionId = response.data.sessionId;
        setUploadState((prev) => ({
          ...prev,
          sessionId,
        }));

        // Start tracking progress
        trackProgress(sessionId);
        return sessionId;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to start material upload",
        response.statusCode || 400,
        response
      );
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to start material upload. Please try again.";
      setUploadState({
        isUploading: false,
        sessionId: null,
        progress: null,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  }, [trackProgress]);

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setUploadState({
      isUploading: false,
      sessionId: null,
      progress: null,
      error: null,
    });
  }, []);

  return {
    startUpload,
    uploadState,
    reset,
  };
}

