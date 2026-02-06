import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

interface OnboardClassesApiDataItem {
  id: string;
  name: string;
  school_id: string;
  class_teacher_id: string | null;
  created_at: string;
  updated_at: string;
}

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: OnboardClassesApiDataItem[];
  statusCode?: number;
};

export type OnboardLibraryClassesPayload = {
  schoolId: string;
  class_names: string[];
};

export function useOnboardLibraryClasses() {
  const queryClient = useQueryClient();

  return useMutation<
    OnboardClassesApiDataItem[],
    AuthenticatedApiError,
    OnboardLibraryClassesPayload
  >({
    mutationFn: async ({ schoolId, class_names }) => {
      logger.info("[useOnboardLibraryClasses] Submitting classes...", {
        schoolId,
        count: class_names.length,
      });

      const response = await authenticatedApi.post<OnboardClassesApiDataItem[]>(
        `/library/schools/${schoolId}/onboard-classes`,
        { class_names }
      );

      const typed = response as unknown as ApiResponse;
      if (typed.success && Array.isArray(typed.data)) {
        logger.info("[useOnboardLibraryClasses] Classes onboarded successfully");
        return typed.data;
      }

      throw new AuthenticatedApiError(
        typed.message ?? "Failed to onboard classes",
        typed.statusCode ?? 400,
        response
      );
    },
    onSuccess: (_, { schoolId }) => {
      queryClient.invalidateQueries({ queryKey: ["library-owner", "schools"] });
      queryClient.invalidateQueries({
        queryKey: ["library-owner", "school", schoolId],
      });
    },
  });
}
