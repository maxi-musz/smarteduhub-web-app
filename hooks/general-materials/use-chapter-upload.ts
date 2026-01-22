import { useState, useCallback, useEffect, useRef } from "react";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface ChapterUploadRequest {
  materialId: string;
  file: File;
  title: string;
  description?: string;
  pageStart?: number;
  pageEnd?: number;
  fileTitle?: string;
  fileDescription?: string;
  enableAiChat?: boolean;
}

export interface ChapterUploadSessionResponse {
  sessionId: string;
  progressEndpoint: string;
}

export type ChapterUploadStage =
  | "validating"
  | "uploading"
  | "processing"
  | "saving"
  | "completed"
  | "error";

export interface ChapterUploadProgress {
  sessionId: string;
  progress: number;
  stage: ChapterUploadStage;
  message: string;
  bytesUploaded: number;
  totalBytes: number;
  estimatedTimeRemaining: number | null;
  error: string | null;
  chapterId: string | null;
}

export interface ChapterUploadProgressApiResponse {
  success: boolean;
  message: string;
  data: ChapterUploadProgress;
}

export function useChapterUpload() {
  const queryClient = useQueryClient();
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    sessionId: string | null;
    progress: ChapterUploadProgress | null;
    error: string | null;
  }>({
    isUploading: false,
    sessionId: null,
    progress: null,
    error: null,
  });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
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
        chapterId: null,
      },
    }));

    // Use polling for progress tracking (SSE requires custom auth handling)
    const poll = async () => {
      try {
        const response =
          await authenticatedApi.get<ChapterUploadProgress>(
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
              toast.success("Chapter uploaded and processed successfully");
              // Refresh chapters data
              queryClient.invalidateQueries({
                queryKey: ["library-owner", "general-materials", "chapters"],
              });
              queryClient.invalidateQueries({
                queryKey: ["library-owner", "general-materials", "list"],
              });
            } else if (progressData.error) {
              toast.error(progressData.error);
            }
          }
        }
      } catch (error) {
        logger.error("[useChapterUpload] Error polling upload progress", {
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

  const startUpload = useCallback(
    async (data: ChapterUploadRequest) => {
      try {
        setUploadState({
          isUploading: true,
          sessionId: null,
          progress: null,
          error: null,
        });

        logger.info("[useChapterUpload] Starting chapter upload", {
          materialId: data.materialId,
          title: data.title,
          fileSize: data.file.size,
        });

        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.pageStart !== undefined) {
          formData.append("pageStart", String(data.pageStart));
        }
        if (data.pageEnd !== undefined) {
          formData.append("pageEnd", String(data.pageEnd));
        }
        if (data.fileTitle) formData.append("fileTitle", data.fileTitle);
        if (data.fileDescription) formData.append("fileDescription", data.fileDescription);
        if (typeof data.enableAiChat === "boolean") {
          formData.append("enableAiChat", String(data.enableAiChat));
        }

        const response =
          await authenticatedApi.post<ChapterUploadSessionResponse>(
            `/library/general-materials/${data.materialId}/chapters/upload/start`,
            formData
          );

        if (response.success && response.data) {
          const sessionId = response.data.sessionId;
          setUploadState((prev) => ({
            ...prev,
            sessionId,
          }));

          startPolling(sessionId);
          return sessionId;
        }

        throw new AuthenticatedApiError(
          response.message || "Failed to start chapter upload",
          response.statusCode || 400,
          response
        );
      } catch (error: any) {
        const errorMessage =
          error?.message || "Failed to start chapter upload. Please try again.";
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
    [startPolling]
  );

  const reset = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
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
