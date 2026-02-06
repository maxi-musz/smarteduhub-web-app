/**
 * Types for library owner school onboarding (POST /library/schools/onboard-school and related).
 * Aligned with ONBOARDING-AND-LIBRARY-SCHOOLS-API.md.
 */

export type SchoolType = "primary" | "secondary" | "primary_and_secondary" | "other";
export type SchoolOwnership = "government" | "private" | "other";
export type CurrentTerm = "first" | "second" | "third";

export interface LibraryOnboardSchoolFormData {
  school_name: string;
  school_email: string;
  school_address: string;
  school_phone: string;
  school_type: SchoolType;
  school_ownership: SchoolOwnership;
  academic_year: string;
  current_term: CurrentTerm;
  term_start_date: string;
  term_end_date?: string;
}

export interface LibraryOnboardSchoolDocuments {
  cac_or_approval_letter: File;
  utility_bill: File;
  tax_cert: File;
  school_icon?: File;
}

/** Response data from POST /library/schools/onboard-school (201) */
export interface OnboardSchoolResponseData {
  id: string;
  school_name: string;
  school_email: string;
  school_address: string;
  school_icon: { url: string; key: string; uploaded_at: string } | null;
  documents: {
    cac: string | null;
    utility_bill: string | null;
    tax_clearance: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface LibraryOnboardTeacherPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface LibraryOnboardStudentPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  default_class: string;
}
