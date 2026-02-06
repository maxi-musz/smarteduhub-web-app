import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface UpdateLibrarySchoolSubjectPayload {
  schoolId: string;
  subjectId: string;
  subject_name?: string;
  code?: string;
  class_taking_it?: string;
  teachers_taking_it?: string[];
  color?: string;
  description?: string;
}

interface UpdateSubjectApiResponse {
  success: boolean;
  message?: string;
  data?: {
    subject: unknown;
    updatedFields?: string[];
    teachersAssigned?: number;
  };
  statusCode?: number;
}

export function useUpdateLibrarySchoolSubject() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, AuthenticatedApiError, UpdateLibrarySchoolSubjectPayload>({
    mutationFn: async ({
      schoolId,
      subjectId,
      subject_name,
      code,
      class_taking_it,
      teachers_taking_it,
      color,
      description,
    }) => {
      logger.info("[useUpdateLibrarySchoolSubject] Updating subject...", {
        schoolId,
        subjectId,
      });

      const body: Record<string, string | string[] | undefined> = {};
      if (subject_name !== undefined) body.subject_name = subject_name.trim();
      if (code !== undefined) body.code = code.trim();
      if (class_taking_it !== undefined) body.class_taking_it = class_taking_it.trim();
      if (teachers_taking_it !== undefined) body.teachers_taking_it = teachers_taking_it;
      if (color !== undefined) body.color = color.trim();
      if (description !== undefined) body.description = description.trim();

      const response = await authenticatedApi.patch<UpdateSubjectApiResponse["data"]>(
        `/library/schools/${schoolId}/subjects/${subjectId}`,
        body
      );

      const typed = response as unknown as UpdateSubjectApiResponse;
      if (typed.success) {
        logger.info("[useUpdateLibrarySchoolSubject] Subject updated successfully");
        return { success: true };
      }

      throw new AuthenticatedApiError(
        typed.message ?? "Failed to update subject",
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
