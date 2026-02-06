import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import type {
  LibraryOnboardSchoolFormData,
  LibraryOnboardSchoolDocuments,
  OnboardSchoolResponseData,
} from "./types-onboarding";

type ApiSuccessResponse = {
  success: true;
  message: string;
  data: OnboardSchoolResponseData;
  statusCode: number;
};

export type OnboardLibrarySchoolPayload = {
  form: LibraryOnboardSchoolFormData;
  documents: LibraryOnboardSchoolDocuments;
};

function buildFormData(
  form: LibraryOnboardSchoolFormData,
  documents: LibraryOnboardSchoolDocuments
): FormData {
  const formData = new FormData();
  formData.append("school_name", form.school_name);
  formData.append("school_email", form.school_email);
  formData.append("school_address", form.school_address);
  formData.append("school_phone", form.school_phone);
  formData.append("school_type", form.school_type);
  formData.append("school_ownership", form.school_ownership);
  formData.append("academic_year", form.academic_year);
  formData.append("current_term", form.current_term);
  formData.append("term_start_date", form.term_start_date);
  if (form.term_end_date) {
    formData.append("term_end_date", form.term_end_date);
  }
  formData.append("cac_or_approval_letter", documents.cac_or_approval_letter);
  formData.append("utility_bill", documents.utility_bill);
  formData.append("tax_cert", documents.tax_cert);
  if (documents.school_icon) {
    formData.append("school_icon", documents.school_icon);
  }
  return formData;
}

export function useOnboardLibrarySchool() {
  const queryClient = useQueryClient();

  return useMutation<
    OnboardSchoolResponseData,
    AuthenticatedApiError,
    OnboardLibrarySchoolPayload
  >({
    mutationFn: async (payload) => {
      const formData = buildFormData(payload.form, payload.documents);
      logger.info("[useOnboardLibrarySchool] Submitting onboard-school...");

      const response = await authenticatedApi.post<OnboardSchoolResponseData>(
        "/library/schools/onboard-school",
        formData
      );

      const typed = response as unknown as ApiSuccessResponse;
      if (typed.success && typed.data) {
        logger.info("[useOnboardLibrarySchool] School onboarded successfully", {
          schoolId: typed.data.id,
          schoolName: typed.data.school_name,
        });
        return typed.data;
      }

      throw new AuthenticatedApiError(
        (response as { message?: string }).message ?? "Failed to onboard school",
        (response as { statusCode?: number }).statusCode ?? 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-owner", "schools"] });
    },
  });
}
