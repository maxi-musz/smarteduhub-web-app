import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const schoolName = formData.get("schoolName") as string;
    const schoolEmail = formData.get("schoolEmail") as string;
    const schoolPhone = formData.get("schoolPhone") as string;
    const schoolAddress = formData.get("schoolAddress") as string;
    const schoolType = formData.get("schoolType") as string;
    const schoolOwnership = formData.get("schoolOwnership") as string;

    // Extract files
    const cacFile = formData.get("cac") as File;
    const utilityFile = formData.get("utility") as File;
    const taxIdFile = formData.get("taxId") as File;

    // Log received data for debugging
    console.log("Received registration request:", {
      schoolName,
      schoolEmail,
      schoolPhone,
      schoolAddress,
      schoolType,
      schoolOwnership,
      files: {
        cac: cacFile
          ? `${cacFile.name} (${cacFile.size} bytes, type: ${cacFile.type})`
          : null,
        utility: utilityFile
          ? `${utilityFile.name} (${utilityFile.size} bytes, type: ${utilityFile.type})`
          : null,
        taxId: taxIdFile
          ? `${taxIdFile.name} (${taxIdFile.size} bytes, type: ${taxIdFile.type})`
          : null,
      },
    });

    // Validate required fields
    if (
      !schoolName ||
      !schoolEmail ||
      !schoolPhone ||
      !schoolAddress ||
      !schoolType ||
      !schoolOwnership
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All school information fields are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Validate required files
    if (!cacFile || !utilityFile) {
      return NextResponse.json(
        {
          success: false,
          message: "CAC document and utility bill are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Create FormData for the backend API with correct field names
    const backendFormData = new FormData();
    backendFormData.append("school_name", schoolName);
    backendFormData.append("school_email", schoolEmail);
    backendFormData.append("school_phone", schoolPhone);
    backendFormData.append("school_address", schoolAddress);
    backendFormData.append("school_type", schoolType);
    backendFormData.append("school_ownership", schoolOwnership);

    // Convert files with correct field names
    backendFormData.append("cac_or_approval_letter", cacFile, cacFile.name);
    backendFormData.append("utility_bill", utilityFile, utilityFile.name);

    if (taxIdFile) {
      backendFormData.append("tax_cert", taxIdFile, taxIdFile.name);
    }

    console.log("Sending to backend:", {
      endpoint: "https://smart-edu-hub.onrender.com/api/v1/auth/onboard-school",
      method: "POST",
      contentType: "multipart/form-data",
      fields: [
        "school_name",
        "school_email",
        "school_phone",
        "school_address",
        "school_type",
        "school_ownership",
      ],
      files: [
        "cac_or_approval_letter",
        "utility_bill",
        taxIdFile ? "tax_cert" : null,
      ].filter(Boolean),
    });

    // Alternative method if the above doesn't work:
    // Convert to base64 and send as JSON
    /*
    const cacBase64 = Buffer.from(await cacFile.arrayBuffer()).toString('base64');
    const utilityBase64 = Buffer.from(await utilityFile.arrayBuffer()).toString('base64');
    const taxIdBase64 = taxIdFile ? Buffer.from(await taxIdFile.arrayBuffer()).toString('base64') : null;
    
    const jsonPayload = {
      schoolName,
      schoolEmail,
      schoolAddress,
      schoolType,
      schoolOwnership,
      cac: {
        data: cacBase64,
        name: cacFile.name,
        type: cacFile.type
      },
      utility: {
        data: utilityBase64,
        name: utilityFile.name,
        type: utilityFile.type
      },
      ...(taxIdBase64 && {
        taxId: {
          data: taxIdBase64,
          name: taxIdFile.name,
          type: taxIdFile.type
        }
      })
    };
    */

    // Send to backend API with correct endpoint
    const response = await fetch(
      "https://smart-edu-hub.onrender.com/api/v1/auth/onboard-school",
      {
        method: "POST",
        body: backendFormData,
        // Don't set Content-Type header - let the browser set it automatically for FormData
      }
    );

    console.log("Backend response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    const data = await response.json();

    console.log("Backend response data:", data);

    if (response.ok && data.statusCode === 201 && data.success === true) {
      return NextResponse.json(
        {
          success: true,
          message: "School registration successful",
          statusCode: 201,
          data: data.data,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Registration failed",
          statusCode: response.status,
          error: data.error,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
