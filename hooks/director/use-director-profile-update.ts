import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { DirectorProfile } from "./use-director-profile";

type ApiResponseData<T> = T;

export interface UpdateProfileRequest {
  // User fields
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  gender?: "male" | "female" | "other";
  
  // Settings fields
  push_notifications?: boolean;
  email_notifications?: boolean;
  assessment_reminders?: boolean;
  grade_notifications?: boolean;
  announcement_notifications?: boolean;
  dark_mode?: boolean;
  sound_effects?: boolean;
  haptic_feedback?: boolean;
  auto_save?: boolean;
  offline_mode?: boolean;
  profile_visibility?: string;
  show_contact_info?: boolean;
  show_academic_progress?: boolean;
  data_sharing?: boolean;
  
  // Files
  display_picture?: File;
  school_logo?: File;
}

export function useDirectorProfileUpdate() {
  const queryClient = useQueryClient();

  return useMutation<
    DirectorProfile,
    AuthenticatedApiError,
    UpdateProfileRequest
  >({
    mutationFn: async (data: UpdateProfileRequest) => {
      logger.info("[useDirectorProfileUpdate] Updating director profile");

      const formData = new FormData();

      // Append user fields
      if (data.first_name !== undefined) {
        formData.append("first_name", data.first_name);
      }
      if (data.last_name !== undefined) {
        formData.append("last_name", data.last_name);
      }
      if (data.phone_number !== undefined) {
        formData.append("phone_number", data.phone_number);
      }
      if (data.gender !== undefined) {
        formData.append("gender", data.gender);
      }

      // Append settings fields - send booleans as "true"/"false" strings for FormData
      // Backend should parse these strings to boolean values
      if (data.push_notifications !== undefined) {
        formData.append("push_notifications", data.push_notifications ? "true" : "false");
      }
      if (data.email_notifications !== undefined) {
        formData.append("email_notifications", data.email_notifications ? "true" : "false");
      }
      if (data.assessment_reminders !== undefined) {
        formData.append("assessment_reminders", data.assessment_reminders ? "true" : "false");
      }
      if (data.grade_notifications !== undefined) {
        formData.append("grade_notifications", data.grade_notifications ? "true" : "false");
      }
      if (data.announcement_notifications !== undefined) {
        formData.append("announcement_notifications", data.announcement_notifications ? "true" : "false");
      }
      if (data.dark_mode !== undefined) {
        formData.append("dark_mode", data.dark_mode ? "true" : "false");
      }
      if (data.sound_effects !== undefined) {
        formData.append("sound_effects", data.sound_effects ? "true" : "false");
      }
      if (data.haptic_feedback !== undefined) {
        formData.append("haptic_feedback", data.haptic_feedback ? "true" : "false");
      }
      if (data.auto_save !== undefined) {
        formData.append("auto_save", data.auto_save ? "true" : "false");
      }
      if (data.offline_mode !== undefined) {
        formData.append("offline_mode", data.offline_mode ? "true" : "false");
      }
      if (data.profile_visibility !== undefined) {
        formData.append("profile_visibility", data.profile_visibility);
      }
      if (data.show_contact_info !== undefined) {
        formData.append("show_contact_info", data.show_contact_info ? "true" : "false");
      }
      if (data.show_academic_progress !== undefined) {
        formData.append("show_academic_progress", data.show_academic_progress ? "true" : "false");
      }
      if (data.data_sharing !== undefined) {
        formData.append("data_sharing", data.data_sharing ? "true" : "false");
      }

      // Append files
      if (data.display_picture) {
        formData.append("display_picture", data.display_picture);
      }
      if (data.school_logo) {
        formData.append("school_logo", data.school_logo);
      }

      const response =
        await authenticatedApi.patch<ApiResponseData<DirectorProfile>>(
          "/director/profiles",
          formData
        );

      if (response.success && response.data) {
        logger.info(
          "[useDirectorProfileUpdate] Director profile updated successfully"
        );
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update director profile",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["director", "profile"] });
    },
  });
}

