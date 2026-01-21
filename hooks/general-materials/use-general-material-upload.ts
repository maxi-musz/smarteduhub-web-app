import { useState, useCallback, useEffect, useRef } from "react";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface AiBookUploadRequest {
  file: File;
  thumbnail: File;
  title: string;
  description?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  classIds?: string[];
  subjectId?: string;
  isAiEnabled?: boolean;
}

export interface AiBookUploadSessionResponse {
  sessionId: string;
  progressEndpoint: string;
}

export type AiBookUploadStage =
  | "validating"
  | "uploading"
  | "processing"
  | "saving"
  | "completed"
  | "error";

export interface AiBookUploadProgress {
  sessionId: string;
  progress: number;
  stage: AiBookUploadStage;
  message: string;
  bytesUploaded: number;
  totalBytes: number;
  estimatedTimeRemaining: number | null;
  error: string | null;
  materialId: string | null;
}

export interface AiBookUploadProgressApiResponse {
  success: boolean;
  message: string;
  data: AiBookUploadProgress;
}

export function useAiBookUpload() {
  const queryClient = useQueryClient();
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    sessionId: string | null;
    progress: AiBookUploadProgress | null;
    error: string | null;
  }>({
    isUploading: false,
    sessionId: null,
    progress: null,
    error: null,
  });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const startPolling = useCallback((sessionId: string) => {
    // Set initial progress state to show loading immediately
    setUploadState((prev) => ({
      ...prev,
      progress: {
        sessionId,
        progress: 0,
        stage: "validating",
        message: "Starting upload...",
        bytesUploaded: 0,
        totalBytes: 0,
        estimatedTimeRemaining: null,
        error: null,
        materialId: null,
      },
    }));

    const poll = async () => {
      try {
        const response =
          await authenticatedApi.get<AiBookUploadProgress>(
            `/library/general-materials/upload-progress/${sessionId}/poll`
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
              toast.success("AI Book uploaded successfully");
              // Refresh AI Books data
              queryClient.invalidateQueries({
                queryKey: ["library-owner", "general-materials"],
              });
            } else if (progressData.error) {
              toast.error(progressData.error);
            }
          }
        }
      } catch (error) {
        logger.error("[useAiBookUpload] Error polling upload progress", {
          error,
        });
        // On error, still update progress to show error state
        setUploadState((prev) => ({
          ...prev,
          progress: prev.progress
            ? {
                ...prev.progress,
                stage: "error",
                error: error instanceof Error ? error.message : "Failed to track upload progress",
              }
            : null,
        }));
      }
    };

    // Start polling immediately, then every 2 seconds
    poll();
    pollingIntervalRef.current = setInterval(poll, 2000);
  }, [queryClient]);

  const trackProgress = useCallback(
    (sessionId: string) => {
      logger.info("[useAiBookUpload] Starting progress tracking via polling", {
        sessionId,
      });
      startPolling(sessionId);
    },
    [startPolling]
  );

  const startUpload = useCallback(
    async (data: AiBookUploadRequest) => {
      try {
        setUploadState({
          isUploading: true,
          sessionId: null,
          progress: null,
          error: null,
        });

        logger.info("[useAiBookUpload] Starting AI Book upload", {
          title: data.title,
          fileSize: data.file.size,
        });

        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("thumbnail", data.thumbnail);
        formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.author) formData.append("author", data.author);
        if (data.isbn) formData.append("isbn", data.isbn);
        if (data.publisher) formData.append("publisher", data.publisher);
        if (data.classIds && data.classIds.length > 0) {
          data.classIds.forEach((classId) => {
            formData.append("classIds[]", classId);
          });
        }
        if (data.subjectId) formData.append("subjectId", data.subjectId);
        if (typeof data.isAiEnabled === "boolean") {
          formData.append("isAiEnabled", String(data.isAiEnabled));
        }

        const response =
          await authenticatedApi.post<AiBookUploadSessionResponse>(
            "/library/general-materials/upload/start",
            formData
          );

        if (response.success && response.data) {
          const sessionId = response.data.sessionId;
          setUploadState((prev) => ({
            ...prev,
            sessionId,
          }));

          trackProgress(sessionId);
          return sessionId;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to start AI Book upload",
          response.statusCode || 400,
          response
        );
      } catch (error: any) {
        const errorMessage =
          error?.message || "Failed to start AI Book upload. Please try again.";
        setUploadState({
          isUploading: false,
          sessionId: null,
          progress: null,
          error: errorMessage,
        });
        toast.error(errorMessage);
        throw error;
      }
    },
    [trackProgress]
  );

  const reset = useCallback(() => {
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


