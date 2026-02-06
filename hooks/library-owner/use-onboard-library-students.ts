import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import type { LibraryOnboardStudentPayload } from "./types-onboarding";

interface OnboardStudentsApiDataItem {
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
  data?: OnboardStudentsApiDataItem[];
  statusCode?: number;
};

export type OnboardLibraryStudentsPayload = {
  schoolId: string;
  students: LibraryOnboardStudentPayload[];
};

export function useOnboardLibraryStudents() {
  const queryClient = useQueryClient();

  return useMutation<
    OnboardStudentsApiDataItem[],
    AuthenticatedApiError,
    OnboardLibraryStudentsPayload
  >({
    mutationFn: async ({ schoolId, students }) => {
      logger.info("[useOnboardLibraryStudents] Submitting students...", {
        schoolId,
        count: students.length,
      });

      const response = await authenticatedApi.post<
        OnboardStudentsApiDataItem[]
      >(`/library/schools/${schoolId}/onboard-students`, { students });

      const typed = response as unknown as ApiResponse;
      if (typed.success && Array.isArray(typed.data)) {
        logger.info("[useOnboardLibraryStudents] Students onboarded successfully");
        return typed.data;
      }

      throw new AuthenticatedApiError(
        typed.message ?? "Failed to onboard students",
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
