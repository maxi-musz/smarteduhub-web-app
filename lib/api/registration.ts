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

    // Construct the full URL
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
    }
    
    // Ensure the URL has a protocol to prevent relative URL issues
    // If it doesn't start with http:// or https://, prepend https://
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      backendUrl = `https://${backendUrl}`;
    }
    
    // Remove trailing slash if present to avoid double slashes
    backendUrl = backendUrl.replace(/\/$/, '');
    
    const endpoint = `${backendUrl}/auth/onboard-school`;
    
    // Log what we're sending for debugging
    console.log("Sending registration data to backend:", {
      backendUrl,
      endpoint,
      schoolData,
      files: {
        cac: documentData.cac?.name,
        utility: documentData.utility?.name,
        taxId: documentData.taxId?.name,
      },
    });

    // Call backend API directly
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        body: formData,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      }
    );

    // Check if response is ok before parsing JSON
    let data;
    try {
      const responseText = await response.text();
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      // If JSON parsing fails, return error response
      return {
        success: false,
        statusCode: response.status || 500,
        message: response.status === 405 
          ? "Invalid endpoint. Please check the API configuration."
          : "Invalid response from server. Please try again.",
        error: parseError,
      };
    }

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
