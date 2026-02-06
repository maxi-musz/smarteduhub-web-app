import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import type { LibraryOnboardTeacherPayload } from "./types-onboarding";

interface OnboardTeachersApiDataItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: OnboardTeachersApiDataItem[];
  statusCode?: number;
};

export type OnboardLibraryTeachersPayload = {
  schoolId: string;
  teachers: LibraryOnboardTeacherPayload[];
};

export function useOnboardLibraryTeachers() {
  const queryClient = useQueryClient();

  return useMutation<
    OnboardTeachersApiDataItem[],
    AuthenticatedApiError,
    OnboardLibraryTeachersPayload
  >({
    mutationFn: async ({ schoolId, teachers }) => {
      logger.info("[useOnboardLibraryTeachers] Submitting teachers...", {
        schoolId,
        count: teachers.length,
      });

      const response = await authenticatedApi.post<
        OnboardTeachersApiDataItem[]
      >(`/library/schools/${schoolId}/onboard-teachers`, { teachers });

      const typed = response as unknown as ApiResponse;
      if (typed.success && Array.isArray(typed.data)) {
        logger.info("[useOnboardLibraryTeachers] Teachers onboarded successfully");
        return typed.data;
      }

      throw new AuthenticatedApiError(
        typed.message ?? "Failed to onboard teachers",
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
