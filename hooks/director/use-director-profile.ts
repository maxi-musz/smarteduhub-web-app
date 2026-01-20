import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Inner data type used with the shared authenticated ApiResponse<T> wrapper
type ApiResponseData<T> = T;

export interface DirectorUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  display_picture: unknown | null;
  gender: "male" | "female" | "other";
  role: string;
  status: "active" | "suspended" | "inactive";
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DirectorSchool {
  id: string;
  school_name: string;
  school_email: string;
  school_phone: string;
  school_address: string;
  school_type: "primary" | "secondary" | "primary_and_secondary";
  school_ownership: "government" | "private";
  status:
    | "not_verified"
    | "pending"
    | "approved"
    | "rejected"
    | "failed"
    | "suspended"
    | "closed"
    | "archived";
  created_at: string;
  updated_at: string;
}

export interface DirectorCurrentSession {
  id: string;
  academic_year: string;
  term: "first" | "second" | "third";
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | "completed";
}

export interface DirectorSettings {
  push_notifications: boolean;
  email_notifications: boolean;
  assessment_reminders: boolean;
  grade_notifications: boolean;
  announcement_notifications: boolean;
  dark_mode: boolean;
  sound_effects: boolean;
  haptic_feedback: boolean;
  auto_save: boolean;
  offline_mode: boolean;
  profile_visibility: string;
  show_contact_info: boolean;
  show_academic_progress: boolean;
  data_sharing: boolean;
}

export interface DirectorStats {
  total_teachers: number;
  total_students: number;
  total_classes: number;
  total_subjects: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  plan_type: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE" | "CUSTOM";
  description: string | null;
  cost: number;
  currency: string;
  billing_cycle: "MONTHLY" | "QUARTERLY" | "YEARLY" | "ONE_TIME";
  is_active: boolean;
  max_allowed_teachers: number;
  max_allowed_students: number;
  max_allowed_classes: number | null;
  max_allowed_subjects: number | null;
  allowed_document_types: string[];
  max_file_size_mb: number;
  max_document_uploads_per_student_per_day: number;
  max_document_uploads_per_teacher_per_day: number;
  max_storage_mb: number;
  max_files_per_month: number;
  max_daily_tokens_per_user: number;
  max_weekly_tokens_per_user: number | null;
  max_monthly_tokens_per_user: number | null;
  max_total_tokens_per_school: number | null;
  max_messages_per_week: number;
  max_conversations_per_user: number | null;
  max_chat_sessions_per_user: number | null;
  features: Record<string, unknown> | null;
  start_date: string | null;
  end_date: string | null;
  status:
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "EXPIRED"
    | "CANCELLED"
    | "TRIAL";
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailablePlan extends SubscriptionPlan {
  allowed_features?: Record<string, unknown> | null;
}

export interface DirectorProfile {
  user: DirectorUser;
  school: DirectorSchool;
  current_session: DirectorCurrentSession | null;
  settings: DirectorSettings;
  stats: DirectorStats;
  subscription_plan: SubscriptionPlan | null;
  available_plans: AvailablePlan[];
}

export function useDirectorProfile() {
  return useQuery<DirectorProfile, AuthenticatedApiError>({
    queryKey: ["director", "profile"],
    queryFn: async () => {
      logger.info("[useDirectorProfile] Fetching director profile");
      const response =
        await authenticatedApi.get<ApiResponseData<DirectorProfile>>(
          "/director/profiles"
        );

      if (response.success && response.data) {
        logger.info(
          "[useDirectorProfile] Director profile fetched successfully"
        );
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch director profile",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}


