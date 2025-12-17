interface SchoolFormData {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  schoolType: string;
  schoolOwnership: string;
  academicYear: string;
  currentTerm: string;
  termStartDate: string;
}

interface DocumentData {
  cac: File | null;
  utility: File | null;
  taxId: File | null;
}

interface RegistrationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
  error?: unknown;
}

export async function registerSchool(
  schoolData: SchoolFormData,
  documentData: DocumentData
): Promise<RegistrationResponse> {
  try {
    const formData = new FormData();

    // Append school data with backend field names (snake_case)
    formData.append("school_name", schoolData.schoolName);
    formData.append("school_email", schoolData.schoolEmail);
    formData.append("school_phone", schoolData.schoolPhone);
    formData.append("school_address", schoolData.schoolAddress);
    formData.append("school_type", schoolData.schoolType);
    formData.append("school_ownership", schoolData.schoolOwnership);
    formData.append("academic_year", schoolData.academicYear);
    formData.append("current_term", schoolData.currentTerm);
    formData.append("term_start_date", schoolData.termStartDate);

    // Append files with backend field names
    if (documentData.cac) {
      formData.append("cac_or_approval_letter", documentData.cac);
    }
    if (documentData.utility) {
      formData.append("utility_bill", documentData.utility);
    }
    if (documentData.taxId) {
      formData.append("tax_cert", documentData.taxId);
    }

    // Log what we're sending for debugging
    console.log("Sending registration data to backend:", {
      endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/onboard-school`,
      schoolData,
      files: {
        cac: documentData.cac?.name,
        utility: documentData.utility?.name,
        taxId: documentData.taxId?.name,
      },
    });

    // Call backend API directly
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/onboard-school`,
      {
        method: "POST",
        body: formData,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      }
    );

    const data = await response.json();

    console.log("Backend response:", {
      status: response.status,
      statusCode: data.statusCode,
      success: data.success,
      message: data.message,
    });

    return {
      success: data.success || response.ok,
      statusCode: data.statusCode || response.status,
      message: data.message || "Registration completed",
      data: data.data,
      error: data.error,
    };
  } catch (error) {
    console.error("Registration API error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Network error. Please check your connection and try again.",
      error: error,
    };
  }
}
