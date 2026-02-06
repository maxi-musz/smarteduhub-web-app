import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface CreateLibrarySchoolSubjectPayload {
  schoolId: string;
  subject_name: string;
  code?: string;
  class_taking_it?: string;
  teacher_taking_it?: string;
  color?: string;
  description?: string;
}

export interface CreateLibrarySchoolSubjectResponse {
  id: string;
  name: string;
  code: string | null;
  color: string;
  description: string | null;
  schoolId: string;
  classId: string | null;
  academic_session_id: string;
  createdAt: string;
  updatedAt: string;
}

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: CreateLibrarySchoolSubjectResponse;
  statusCode?: number;
};

export function useCreateLibrarySchoolSubject() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateLibrarySchoolSubjectResponse,
    AuthenticatedApiError,
    CreateLibrarySchoolSubjectPayload
  >({
    mutationFn: async ({
      schoolId,
      subject_name,
      code,
      class_taking_it,
      teacher_taking_it,
      color,
      description,
    }) => {
      logger.info("[useCreateLibrarySchoolSubject] Creating subject...", {
        schoolId,
        subject_name,
      });

      const body: Record<string, string | undefined> = {
        subject_name,
        code: code?.trim() || undefined,
        class_taking_it: class_taking_it || undefined,
        teacher_taking_it: teacher_taking_it || undefined,
        color: color?.trim() || undefined,
        description: description?.trim() || undefined,
      };

      const response = await authenticatedApi.post<CreateLibrarySchoolSubjectResponse>(
        `/library/schools/${schoolId}/create-subject`,
        body
      );

      const typed = response as unknown as ApiResponse;
      if (typed.success && typed.data) {
        logger.info("[useCreateLibrarySchoolSubject] Subject created successfully");
        return typed.data;
      }

      throw new AuthenticatedApiError(
        typed.message ?? "Failed to create subject",
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
