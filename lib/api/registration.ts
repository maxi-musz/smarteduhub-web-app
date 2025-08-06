interface SchoolFormData {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  schoolType: string;
  schoolOwnership: string;
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
  data?: any;
  error?: any;
}

export async function registerSchool(
  schoolData: SchoolFormData,
  documentData: DocumentData
): Promise<RegistrationResponse> {
  try {
    const formData = new FormData();

    // Append school data
    formData.append("schoolName", schoolData.schoolName);
    formData.append("schoolEmail", schoolData.schoolEmail);
    formData.append("schoolPhone", schoolData.schoolPhone);
    formData.append("schoolAddress", schoolData.schoolAddress);
    formData.append("schoolType", schoolData.schoolType);
    formData.append("schoolOwnership", schoolData.schoolOwnership);

    // Append files
    if (documentData.cac) {
      formData.append("cac", documentData.cac);
    }
    if (documentData.utility) {
      formData.append("utility", documentData.utility);
    }
    if (documentData.taxId) {
      formData.append("taxId", documentData.taxId);
    }

    // Log what we're sending for debugging
    console.log("Sending registration data:", {
      schoolData,
      files: {
        cac: documentData.cac
          ? `${documentData.cac.name} (${documentData.cac.size} bytes, type: ${documentData.cac.type})`
          : null,
        utility: documentData.utility
          ? `${documentData.utility.name} (${documentData.utility.size} bytes, type: ${documentData.utility.type})`
          : null,
        taxId: documentData.taxId
          ? `${documentData.taxId.name} (${documentData.taxId.size} bytes, type: ${documentData.taxId.type})`
          : null,
      },
    });

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log("Registration response:", {
      status: response.status,
      statusCode: data.statusCode,
      success: data.success,
      message: data.message,
    });

    return {
      success: data.success,
      statusCode: data.statusCode,
      message: data.message,
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
